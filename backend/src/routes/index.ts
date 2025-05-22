const express = require("express");
import { getApplications } from "./applications.get";
import { postApplication } from "./applications.post";
import { putApplication } from "./applications.put";
import { deleteApplication } from "./applications.delete";

const router = express.Router();

router.get("/applications", getApplications);
router.post("/applications", postApplication);
router.put("/applications/:id", putApplication);
router.delete("/applications/:id", deleteApplication);

export default router;
