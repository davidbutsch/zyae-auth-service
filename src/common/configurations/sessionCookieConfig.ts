import { CookieOptions } from "express";

export const sessionCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: false,
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
};
