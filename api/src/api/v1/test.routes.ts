import { Hono } from "hono";

const testRoutes = new Hono()
    .get('/', (c) => {
        return c.json({ message: 'Hello World' });
    })

export default testRoutes;