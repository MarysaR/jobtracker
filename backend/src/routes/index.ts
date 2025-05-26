const express = require("express");
import { getApplications } from "./applications.get";
import { postApplication } from "./applications.post";
import { putApplication } from "./applications.put";
import { deleteApplication } from "./applications.delete";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/applications", verifyToken, getApplications);
router.post("/applications", verifyToken, postApplication);
router.put("/applications/:id", verifyToken, putApplication);
router.delete("/applications/:id", verifyToken, deleteApplication);

export default router;
