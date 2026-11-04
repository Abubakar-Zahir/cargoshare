import type { ReactNode } from "react";

type WelcomeProps = Readonly<{
  title: string;
  message: string;
  children: ReactNode;
}>;

const Welcome = ({ title, message, children }: WelcomeProps) => (
  <main>
    <h1>{title}</h1>
    <p>{message}</p>
    {children}
  </main>
);

export default Welcome;
