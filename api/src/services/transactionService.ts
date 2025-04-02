import { Context } from "hono";
import { createDb, aql } from "../db";
import { COLLECTIONS } from "../db/collections";
import type { Transaction, FlowData } from "../types";

interface TransactionQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense' | 'transfer';
  categoryId?: string;
}

export class TransactionService {
  static async createTransaction(c: Context, transaction: Transaction) {
    const db = await createDb(c);
    const now = new Date().toISOString();
    
    const doc = {
      ...transaction,
      createdAt: now,
      updatedAt: now
    };
    
    const accountCursor = await db.query(aql`
      FOR a IN accounts
      FILTER a._key == ${transaction.accountId}
      RETURN a
    `);
    const account = await accountCursor.next();
    
    if (!account) {
      throw new Error('Account not found');
    }
    
    const balanceChange = transaction.type === 'income' 
      ? transaction.amount 
      : (transaction.type === 'expense' ? -transaction.amount : 0);
    
    const transCursor = await db.query(aql`
      INSERT ${doc} INTO transactions
      RETURN NEW
    `);
    const newTransaction = await transCursor.next();
    
    await db.query(aql`
      FOR a IN accounts
      FILTER a._key == ${transaction.accountId}
      UPDATE a WITH {
        balance: a.balance + ${balanceChange}
      } IN accounts
    `);
    
    return newTransaction;
  }

  static async getTransactions(c: Context, query: TransactionQuery) {
    const db = await createDb(c);
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    
    const cursor = await db.query(aql`
      LET filtered = (
        FOR t IN transactions
        ${query.startDate ? aql`FILTER t.date >= ${query.startDate}` : aql``}
        ${query.endDate ? aql`FILTER t.date <= ${query.endDate}` : aql``}
        ${query.type ? aql`FILTER t.type == ${query.type}` : aql``}
        ${query.categoryId ? aql`FILTER t.categoryId == ${query.categoryId}` : aql``}
        SORT t.date DESC
        LIMIT ${offset}, ${limit}
        LET category = (
          FOR cat IN categories
          FILTER cat._key == t.categoryId
          RETURN cat
        )[0]
        RETURN MERGE(t, { category })
      )
      RETURN {
        data: filtered,
        total: LENGTH(filtered),
        page: ${page},
        limit: ${limit}
      }
    `);
    
    return await cursor.next();
  }

  static async getTransactionById(c: Context, id: string) {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      FOR t IN transactions
      FILTER t._key == ${id}
      LET category = (
        FOR cat IN categories
        FILTER cat._key == t.categoryId
        RETURN cat
      )[0]
      RETURN MERGE(t, { category })
    `);
    
    return await cursor.next();
  }

  static async updateTransaction(c: Context, id: string, transaction: Transaction) {
    const db = await createDb(c);
    const now = new Date().toISOString();
    
    const oldCursor = await db.query(aql`
      FOR t IN transactions
      FILTER t._key == ${id}
      RETURN t
    `);
    const old = await oldCursor.next();
    
    if (!old) {
      return null;
    }
    
    const oldBalanceChange = old.type === 'income' 
      ? old.amount 
      : (old.type === 'expense' ? -old.amount : 0);
    
    const newBalanceChange = transaction.type === 'income' 
      ? transaction.amount 
      : (transaction.type === 'expense' ? -transaction.amount : 0);
    
    const transCursor = await db.query(aql`
      FOR t IN transactions
      FILTER t._key == ${id}
      UPDATE t WITH MERGE(${transaction}, { updatedAt: ${now} })
      IN transactions
      RETURN NEW
    `);
    const updated = await transCursor.next();
    
    await db.query(aql`
      FOR a IN accounts
      FILTER a._key == ${transaction.accountId}
      UPDATE a WITH {
        balance: a.balance - ${oldBalanceChange} + ${newBalanceChange}
      } IN accounts
    `);
    
    return updated;
  }

  static async deleteTransaction(c: Context, id: string) {
    const db = await createDb(c);
    
    const oldCursor = await db.query(aql`
      FOR t IN transactions
      FILTER t._key == ${id}
      RETURN t
    `);
    const old = await oldCursor.next();
    
    if (!old) {
      return null;
    }
    
    const balanceChange = old.type === 'income' 
      ? old.amount 
      : (old.type === 'expense' ? -old.amount : 0);
    
    await db.query(aql`
      FOR t IN transactions
      FILTER t._key == ${id}
      REMOVE t IN transactions
    `);
    
    await db.query(aql`
      FOR a IN accounts
      FILTER a._key == ${old.accountId}
      UPDATE a WITH {
        balance: a.balance - ${balanceChange}
      } IN accounts
    `);
    
    return old;
  }

  static async getSankeyData(c: Context, startDate: string, endDate: string): Promise<FlowData> {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      LET transactionData = (
        FOR t IN transactions
        FILTER t.date >= ${startDate} AND t.date <= ${endDate}
        COLLECT category = t.categoryId, account = t.accountId, type = t.type
        AGGREGATE total = SUM(t.amount)
        RETURN {
          source: category,
          target: account,
          value: total,
          type: type
        }
      )
      
      LET categoryNodes = (
        FOR cat IN categories
        RETURN {
          id: cat._key,
          name: cat.name,
          type: 'category'
        }
      )
      
      LET accountNodes = (
        FOR acc IN accounts
        RETURN {
          id: acc._key,
          name: acc.name,
          type: 'account'
        }
      )
      
      RETURN {
        nodes: APPEND(categoryNodes, accountNodes),
        links: transactionData
      }
    `);
    
    return await cursor.next();
  }

  static async getMonthlyReport(c: Context, year: number, month: number) {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      LET startDate = DATE_ISO8601(${year}, ${month}, 1)
      LET endDate = DATE_ISO8601(${year}, ${month + 1}, 1)
      
      RETURN {
        income: (
          FOR t IN transactions
          FILTER t.type == 'income'
          AND t.date >= startDate
          AND t.date < endDate
          COLLECT AGGREGATE total = SUM(t.amount)
          RETURN total
        )[0],
        
        expenses: (
          FOR t IN transactions
          FILTER t.type == 'expense'
          AND t.date >= startDate
          AND t.date < endDate
          COLLECT AGGREGATE total = SUM(t.amount)
          RETURN total
        )[0],
        
        byCategory: (
          FOR t IN transactions
          FILTER t.date >= startDate
          AND t.date < endDate
          COLLECT category = t.categoryId
          AGGREGATE total = SUM(t.amount)
          LET catDoc = (
            FOR cat IN categories
            FILTER cat._key == category
            RETURN cat
          )[0]
          RETURN {
            category: catDoc.name,
            total: total
          }
        )
      }
    `);
    
    return await cursor.next();
  }
} 