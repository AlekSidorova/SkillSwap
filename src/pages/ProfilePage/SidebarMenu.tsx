import { useLocation } from "react-router-dom";
import styles from "./profilePage.module.scss";

import {
  Request,
  MessageText,
  IdeaLK,
  Like,
  User,
} from "@/shared/ui/DecoratedButton/svg/IconSvg";

//тут нужно указать, куда кнопки переходят - но также тут должны быть заглушки
//в нашем случае активные кнопки это Избранное, вроде Мои навыки и Личные данные
export const SidebarMenu = () => {
  //определяем активный рункт меню
  const location = useLocation();
  const isFavorites = location.pathname === "/favorites";
  const isProfile = location.pathname === "/profile";

  return (
    <aside>
      <div className={styles.sidebarBackground}>
        <nav className={styles.menu} role="navigation">
          <a href="#0" className={styles.menuItem}>
            <Request />
            Заявки
          </a>

          <a href="#0" className={styles.menuItem}>
            <MessageText />
            Мои обмены
          </a>

          {/* TODO: куда ссылка "Мои навыки" */}
          <a href="/#0" className={styles.menuItem}>
            <IdeaLK />
            Мои навыки
          </a>

          <a
            href="/favorites"
            className={isFavorites ? styles.menuItemActive : styles.menuItem}
          >
            <Like />
            Избранное
          </a>

          <a
            href="/profile"
            className={isProfile ? styles.menuItemActive : styles.menuItem}
          >
            <User />
            Личные данные
          </a>
        </nav>
      </div>
    </aside>
  );
};
