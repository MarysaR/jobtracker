const express = require("express");
import googleRoutes from "./google";
import emailRoutes from "./email";
import sessionRoutes from "./session";

const router = express.Router();

router.use("/", googleRoutes);
router.use("/", emailRoutes);
router.use("/", sessionRoutes);

export default router;
