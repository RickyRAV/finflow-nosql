import { Hono } from "hono";
import { validator as zValidator } from 'hono-openapi/zod';
import { z } from "zod";
import { AccountService } from "../../services/accountService";

const AccountSchema = z.object({
  name: z.string(),
  type: z.enum(['checking', 'savings', 'credit', 'investment', 'cash']),
  balance: z.number(),
  currency: z.string().default('USD'),
  isActive: z.boolean().default(true),
  description: z.string().optional()
});

const accountRoutes = new Hono()
  // Create account
  .post('/', zValidator('json', AccountSchema), async (c) => {
    const data = c.req.valid('json');
    const result = await AccountService.createAccount(c, data);
    return c.json(result, 201);
  })
  // Get all accounts
  .get('/', async (c) => {
    const accounts = await AccountService.getAccounts(c);
    return c.json(accounts);
  })
  // Get account by ID
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    const account = await AccountService.getAccountById(c, id);
    if (!account) {
      return c.json({ error: 'Account not found' }, 404);
    }
    return c.json(account);
  })
  // Update account
  .put('/:id', zValidator('json', AccountSchema), async (c) => {
    const id = c.req.param('id');
    const data = c.req.valid('json');
    const updated = await AccountService.updateAccount(c, id, data);
    if (!updated) {
      return c.json({ error: 'Account not found' }, 404);
    }
    return c.json(updated);
  })
  // Delete account
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await AccountService.deleteAccount(c, id);
    if (!deleted) {
      return c.json({ error: 'Account not found' }, 404);
    }
    return c.json({ success: true });
  });

export default accountRoutes; 