import { saveTheme } from "@/components/theme/actions";
import Button from "@/components/ui/button";
import { THEME_FIELD } from "@/lib/constants";
import type { Theme } from "@/lib/theme";

type ThemeToggleProps = Readonly<{
  lightLabel: string;
  darkLabel: string;
  lightTheme: Theme;
  darkTheme: Theme;
}>;

// Both buttons are sent and globals.css shows only the one offering the other theme:
// the server cannot know the device's setting, and this needs no JavaScript.
const ThemeToggle = ({ lightLabel, darkLabel, lightTheme, darkTheme }: ThemeToggleProps) => (
  <form action={saveTheme}>
    <span className="[display:var(--offer-dark)]">
      <Button type="submit" variant="secondary" name={THEME_FIELD} value={darkTheme}>
        {darkLabel}
      </Button>
    </span>
    <span className="[display:var(--offer-light)]">
      <Button type="submit" variant="secondary" name={THEME_FIELD} value={lightTheme}>
        {lightLabel}
      </Button>
    </span>
  </form>
);

export default ThemeToggle;
