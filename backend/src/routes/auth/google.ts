const express = require("express");
import passport from "../../auth/passport";
import { Request, Response } from "express";

const router = express.Router();

// GET /auth/google - Démarrer l'auth Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// GET /auth/google/callback - Callback Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    // Succès - rediriger vers le frontend
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  }
);

export default router;
