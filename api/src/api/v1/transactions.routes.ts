import { Hono } from "hono";
import { validator as zValidator } from 'hono-openapi/zod';
import { z } from "zod";
import { TransactionService } from "../../services/transactionService";

const TransactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categoryId: z.string(),
  type: z.enum(['income', 'expense', 'transfer']),
  accountId: z.string(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  recurringId: z.string().optional()
});

const QuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  categoryId: z.string().optional()
});

const transactionsRoutes = new Hono()
  // Create transaction
  .post('/', zValidator('json', TransactionSchema), async (c) => {
    const data = c.req.valid('json');
    const result = await TransactionService.createTransaction(c, data);
    return c.json(result, 201);
  })
  // Get all transactions with filters
  .get('/', zValidator('query', QuerySchema), async (c) => {
    const query = c.req.valid('query');
    const transactions = await TransactionService.getTransactions(c, query);
    return c.json(transactions);
  })
  // Get transaction by ID
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const transaction = await TransactionService.getTransactionById(c, id);
    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    return c.json(transaction);
  })
  // Update transaction
  .put('/:id', zValidator('json', TransactionSchema), async (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const updated = await TransactionService.updateTransaction(c, id, data);
    if (!updated) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    return c.json(updated);
  })
  // Delete transaction
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await TransactionService.deleteTransaction(c, id);
    if (!deleted) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    return c.json({ success: true });
  })
  // Sankey diagram data
  .get('/sankey', async (c) => {
    const startDate = c.req.query('startDate') || new Date(new Date().getFullYear(), 0, 1).toISOString();
    const endDate = c.req.query('endDate') || new Date().toISOString();
    
    const flowData = await TransactionService.getSankeyData(c, startDate, endDate);
    return c.json(flowData);
  })
  // Monthly report
  .get('/report/:year/:month', async (c) => {
    const year = parseInt(c.req.param('year'));
    const month = parseInt(c.req.param('month')) - 1;
    
    const report = await TransactionService.getMonthlyReport(c, year, month);
    return c.json(report);
  });

export default transactionsRoutes;