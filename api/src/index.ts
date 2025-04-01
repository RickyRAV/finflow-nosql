import { Hono } from 'hono';
import { openAPISpecs } from "hono-openapi";
import { cors } from "hono/cors";
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { prettyJSON } from "hono/pretty-json";
import api from './api';

const app = new Hono()

// Middlewares
app.use(logger(), etag(), prettyJSON(), cors());

// define routes
const routes = app.route('/api', api
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
);


export default app;
export type AppType = typeof routes;
