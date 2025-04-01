import { Hono } from "hono";
import testRoutes from "./test.routes";
import transactionsRoutes from "./transactions.routes";
import accountsRoutes from "./accounts.routes";

const v1 = new Hono()
    .route("/test", testRoutes)
    .route("/transactions", transactionsRoutes)
    .route("/accounts", accountsRoutes);

  export default v1;