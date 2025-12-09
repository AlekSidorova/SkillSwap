import styles from "./profilePage.module.scss";
import { SidebarMenu } from "./SidebarMenu";
import { ProfileForm } from "./ProfileForm";

export const ProfilePage = () => {
  return (
    <div className={styles.wrapper}>
      {/* левое меню */}
      <SidebarMenu />

      {/* личные данные */}
      <ProfileForm />
    </div>
  );
};

// ProfilePage собирает страницу: SidebarMenu + ProfileForm.

// SidebarMenu.tsx — только левое меню, без бизнес-логики.
// ProfileForm.tsx — вся форма профиля, можно внутри дробить (поля, аватар, кнопка - я это пока не делала, чтобы
// не было для тебя лишнего кода).

//пока это все лежит в одной папке, но после нужно разделить по FSD
