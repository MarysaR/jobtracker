const express = require("express");
import passport from "../../auth/passport";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

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
    // Type guard pour req.user
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }

    // Assertion de type simple
    const user = req.user as any;

    // Créer un JWT token
    const token = jwt.sign({ userId: user.id }, process.env.SESSION_SECRET!, {
      expiresIn: "24h",
    });

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// Route pour vérifier un JWT token
router.get("/verify-token", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
