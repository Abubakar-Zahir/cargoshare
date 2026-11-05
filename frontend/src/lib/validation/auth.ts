import { z } from "zod";

import { env } from "@/env";
import {
  DATE_OF_BIRTH_INVALID_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  HOME_PATH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_TOO_LONG_MESSAGE,
  PASSWORD_TOO_SHORT_MESSAGE,
  ROLE_REQUIRED_MESSAGE,
  USERNAME_INVALID_MESSAGE,
  USERNAME_PATTERN,
} from "@/lib/constants";

const emailField = z.email(EMAIL_INVALID_MESSAGE);
const newPasswordField = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_TOO_SHORT_MESSAGE)
  .max(PASSWORD_MAX_LENGTH, PASSWORD_TOO_LONG_MESSAGE);

// An ISO date string compares correctly as text, so this also refuses dates in the future.
const dateOfBirthField = z.iso
  .date(DATE_OF_BIRTH_INVALID_MESSAGE)
  .refine((value) => value <= new Date().toISOString().slice(0, 10), DATE_OF_BIRTH_INVALID_MESSAGE);

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
});

export const signupSchema = z
  .object({
    username: z.string().trim().toLowerCase().regex(USERNAME_PATTERN, USERNAME_INVALID_MESSAGE),
    email: emailField,
    password: newPasswordField,
    date_of_birth: dateOfBirthField,
    is_sender: z.boolean(),
    is_traveler: z.boolean(),
  })
  .refine(({ is_sender, is_traveler }) => is_sender || is_traveler, ROLE_REQUIRED_MESSAGE);

export const forgotPasswordSchema = z.object({
  email: emailField,
  date_of_birth: dateOfBirthField,
  new_password: newPasswordField,
});

// Only paths on this site may follow a login, so a crafted link cannot send users elsewhere.
export const safeNextPath = (value: unknown): string => {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return HOME_PATH;
  }
  try {
    const url = new URL(value, env.NEXT_PUBLIC_SITE_URL);
    const isSameSite = url.origin === new URL(env.NEXT_PUBLIC_SITE_URL).origin;
    return isSameSite ? `${url.pathname}${url.search}` : HOME_PATH;
  } catch {
    return HOME_PATH;
  }
};
