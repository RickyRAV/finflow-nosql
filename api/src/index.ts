import { Hono } from 'hono';
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { prettyJSON } from "hono/pretty-json";
import api from './api';
import { ensureCollections } from './db/collections';
import { apiReference } from '@scalar/hono-api-reference'

const app = new Hono()

// Middlewares
app.use('*', logger(), etag(), prettyJSON(), cors());

// Ensure collections exist
app.use('*', async (c, next) => {
  await ensureCollections(c);
  await next();
});

// define routes
const routes = app.route('/api', api)
  .get('/openapi',
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Finflow API",
          description: "API for Finflow",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:8787",
            description: "Local server",
          },
          {
            url: "https://api.finflow.app",
            description: "Production server",
          },
        ],
        paths: {
          "/api/v1/transactions/{id}": {
            get: {
              summary: "Get transaction by ID",
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                }
              ],
              responses: {
                "200": {
                  description: "Transaction found",
                  content: {
                    "application/json": {
                      schema: { "$ref": "#/components/schemas/Transaction" }
                    }
                  }
                },
                "404": {
                  description: "Transaction not found"
                }
              }
            },
            delete: {
              summary: "Delete transaction",
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                }
              ],
              responses: {
                "200": {
                  description: "Transaction deleted",
                  content: {
                    "application/json": {
                      schema: { 
                        type: "object",
                        properties: {
                          success: { type: "boolean" }
                        }
                      }
                    }
                  }
                },
                "404": {
                  description: "Transaction not found"
                }
              }
            }
          },
          "/api/v1/transactions/sankey": {
            get: {
              summary: "Get sankey diagram data",
              parameters: [
                {
                  name: "startDate",
                  in: "query",
                  schema: { type: "string", format: "date" }
                },
                {
                  name: "endDate",
                  in: "query",
                  schema: { type: "string", format: "date" }
                }
              ],
              responses: {
                "200": {
                  description: "Sankey data retrieved successfully"
                }
              }
            }
          },
          "/api/v1/transactions/report/{year}/{month}": {
            get: {
              summary: "Get monthly report",
              parameters: [
                {
                  name: "year",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                },
                {
                  name: "month",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                }
              ],
              responses: {
                "200": {
                  description: "Monthly report retrieved successfully"
                }
              }
            }
          },
          "/api/v1/accounts": {
            get: {
              summary: "Get all accounts",
              responses: {
                "200": {
                  description: "Accounts retrieved successfully",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: { "$ref": "#/components/schemas/Account" }
                      }
                    }
                  }
                }
              }
            }
          },
          "/api/v1/accounts/{id}": {
            get: {
              summary: "Get account by ID",
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                }
              ],
              responses: {
                "200": {
                  description: "Account found",
                  content: {
                    "application/json": {
                      schema: { "$ref": "#/components/schemas/Account" }
                    }
                  }
                },
                "404": {
                  description: "Account not found"
                }
              }
            },
            delete: {
              summary: "Delete account",
              parameters: [
                {
                  name: "id",
                  in: "path",
                  required: true,
                  schema: { type: "string" }
                }
              ],
              responses: {
                "200": {
                  description: "Account deleted",
                  content: {
                    "application/json": {
                      schema: { 
                        type: "object",
                        properties: {
                          success: { type: "boolean" }
                        }
                      }
                    }
                  }
                },
                "404": {
                  description: "Account not found"
                }
              }
            }
          }
        },
        // Add component schemas
        components: {
          schemas: {
            Transaction: {
              type: "object",
              properties: {
                id: { type: "string" },
                amount: { type: "number", exclusiveMinimum: 0 },
                description: { type: "string" },
                date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                categoryId: { type: "string" },
                type: { type: "string", enum: ["income", "expense", "transfer"] },
                accountId: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
                notes: { type: "string" },
                recurringId: { type: "string" }
              },
              required: ["amount", "description", "date", "categoryId", "type", "accountId"]
            },
            Account: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                type: { type: "string", enum: ["checking", "savings", "credit", "investment", "cash"] },
                balance: { type: "number" },
                currency: { type: "string", default: "USD" },
                isActive: { type: "boolean", default: true },
                description: { type: "string" }
              },
              required: ["name", "type", "balance"]
            }
          }
        }
      },
    }),
  )
  .get(
  '/docs',
  apiReference({
    title: 'Finflow API Documentation',
    spec: {
      url: '/openapi',
    },
    theme: 'saturn',
  })
)

export default app;
export type AppType = typeof routes;
