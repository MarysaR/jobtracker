const express = require("express");
import { Request, Response } from "express";

const router = express.Router();

// GET /auth/user - Récupérer utilisateur actuel
router.get("/user", (req: Request, res: Response) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// POST /auth/logout - Déconnexion
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
