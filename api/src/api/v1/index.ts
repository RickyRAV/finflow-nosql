import { Hono } from "hono";
import testRoutes from "./test.routes";

const v1 = new Hono()
  .route("/test", testRoutes);

  export default v1;