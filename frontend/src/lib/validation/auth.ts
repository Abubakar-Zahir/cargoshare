import { z } from "zod";

import { PASSWORD_MAX_LENGTH } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
});
