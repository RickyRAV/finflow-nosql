import { Context } from "hono";
import { createDb, aql } from "../db";
import { COLLECTIONS } from "../db/collections";
import type { Account } from "../types";

export class AccountService {
  static async createAccount(c: Context, account: Account) {
    const db = await createDb(c);
    const now = new Date().toISOString();
    
    const doc = {
      ...account,
      createdAt: now,
      updatedAt: now
    };
    
    const cursor = await db.query(aql`
      INSERT ${doc} INTO accounts
      RETURN NEW
    `);
    
    return await cursor.next();
  }

  static async getAccounts(c: Context) {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      FOR a IN accounts
      SORT a.name ASC
      RETURN a
    `);
    
    return await cursor.all();
  }

  static async getAccountById(c: Context, id: string) {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      RETURN DOCUMENT(accounts, ${id})
    `);
    
    return await cursor.next();
  }

  static async updateAccount(c: Context, id: string, account: Account) {
    const db = await createDb(c);
    const now = new Date().toISOString();
    
    const cursor = await db.query(aql`
      UPDATE ${id} WITH MERGE(${account}, { updatedAt: ${now} })
      IN accounts
      RETURN NEW
    `);
    
    return await cursor.next();
  }

  static async deleteAccount(c: Context, id: string) {
    const db = await createDb(c);
    
    const cursor = await db.query(aql`
      REMOVE ${id} IN accounts
      RETURN OLD
    `);
    
    return await cursor.next();
  }
} 