import express from "express";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

router.cat("/", authenticate, (req, res) => {});

export default router;
