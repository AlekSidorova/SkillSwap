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

          <a href="/favorites" className={styles.menuItem}>
            <Like />
            Избранное
          </a>

          <a href="/profile" className={styles.menuItemActive}>
            <User />
            Личные данные
          </a>
        </nav>
      </div>
    </aside>
  );
};
