import { Context } from "hono";
import { createDb } from "./index";

export const COLLECTIONS = {
  TRANSACTIONS: "transactions",
  CATEGORIES: "categories",
  ACCOUNTS: "accounts",
  RECURRING_TRANSACTIONS: "recurring_transactions"
} as const;

export async function ensureCollections(c: Context) {
  const db = await createDb(c);
  
  for (const collectionName of Object.values(COLLECTIONS)) {
    const collection = db.collection(collectionName);
    const exists = await collection.exists();
    if (!exists) {
      await collection.create();
      console.log(`Created collection: ${collectionName}`);
    }
  }

  // indexes for better performance
  const transactions = db.collection(COLLECTIONS.TRANSACTIONS);
  await transactions.ensureIndex({
    type: "persistent",
    fields: ["date"]
  });
  await transactions.ensureIndex({
    type: "persistent",
    fields: ["categoryId"]
  });
  await transactions.ensureIndex({
    type: "persistent",
    fields: ["accountId"]
  });
} 