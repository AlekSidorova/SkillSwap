import styles from "./styles/app.module.scss";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className={styles.app}>
      <Outlet />
    </div>
  );
}
