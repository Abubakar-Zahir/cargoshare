import type { ReactNode } from "react";
import styles from "./auth.module.css";

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <div className={styles.page}>
    <div className={styles.card}>{children}</div>
  </div>
);

export default AuthLayout;
