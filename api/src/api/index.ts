import { Hono } from "hono";
import v1 from './v1/index'; 

const api = new Hono();

const routes = api.route("/v1", v1);

export default routes;