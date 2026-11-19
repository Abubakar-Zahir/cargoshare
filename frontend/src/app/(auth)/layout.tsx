import type { ChildrenProps } from "@/lib/types";
import styles from "./auth.module.css";

const AuthLayout = ({ children }: ChildrenProps) => (
  <div className={styles.page}>
    <div className={styles.card}>{children}</div>
  </div>
);

export default AuthLayout;
