import styles from "./styles/app.module.scss";
import { Outlet } from "react-router-dom";
import { OfferPreview } from "@widgets/offerPreview/offerPreview.tsx";
import { Header } from "@widgets/header/header.tsx";
import { Footer } from "@widgets/footer/footer.tsx";

// type AppProps = {
//   title?: string;
// };

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <OfferPreview variant={"modalOffer"} />
    </div>
  );
}
