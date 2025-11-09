import { CookieOptions } from "express";
//IN PROD SET THESE
//SameSite: 'strict' or 'lax'  -- for protection against CSRF
//Secure: true -- for HTTPS
export const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: false,
}