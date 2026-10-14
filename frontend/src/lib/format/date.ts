import { tz } from "@date-fns/tz";
import { format } from "date-fns";

export const APP_TIME_ZONE = "Asia/Karachi";

const inKarachi = tz(APP_TIME_ZONE);

export function formatDay(value: Date | string): string {
  return format(value, "EEE, d MMM", { in: inKarachi });
}
