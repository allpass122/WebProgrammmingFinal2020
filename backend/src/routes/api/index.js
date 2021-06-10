import { Router } from "express";
import serverRouter from "./server";

const router = Router();

router.use("/", serverRouter);

export default router;
