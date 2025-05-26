const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");

import { Err, Ok, Result } from "../errorHandling";
import { DatabaseError } from "../errorHandling/genericError";

const prisma = new PrismaClient();

const findUserByGoogleId = async (
  googleId: string
): Promise<Result<any, DatabaseError>> => {
  const user = await prisma.user.findUnique({
    where: { googleId },
  });
  return Ok.of(user);
};

const createUser = async (
  userData: any
): Promise<Result<any, DatabaseError>> => {
  const user = await prisma.user.create({
    data: userData,
  });
  if (user) {
    return Ok.of(user);
  }
  return Err.of(new DatabaseError("Failed to create user"));
};

const findUserById = async (
  id: string
): Promise<Result<any, DatabaseError>> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (user) {
    return Ok.of(user);
  }
  return Err.of(new DatabaseError("User not found"));
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      const existingUserResult = await findUserByGoogleId(profile.id);

      if (existingUserResult.isOk() && existingUserResult.value) {
        return done(null, existingUserResult.value);
      }

      // Créer nouvel utilisateur
      const newUserResult = await createUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatarUrl: profile.photos[0]?.value,
      });

      if (newUserResult.isOk()) {
        return done(null, newUserResult.value);
      } else {
        return done(newUserResult.error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  const userResult = await findUserById(id);

  if (userResult.isOk()) {
    done(null, userResult.value);
  } else {
    done(userResult.error, null);
  }
});

export default passport;
