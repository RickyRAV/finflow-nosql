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
      },
    }),
  )
  .get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
)

export default app;
export type AppType = typeof routes;
