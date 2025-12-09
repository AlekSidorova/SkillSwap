import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { Calendar } from "@shared/ui/Calendar/Calendar";
import editIcon from "@images/icons/edit.svg?url";
import chevronDownIcon from "@images/icons/chevron-down.svg?url";
import editPhotoIcon from "@images/icons/edit-photo.svg";
import styles from "./profilePage.module.scss";
import { useAppSelector } from "@app/store/hooks";
import { selectUser } from "@/features/auth/model/slice";

export const ProfileForm = () => {
  const user = useAppSelector(selectUser);

  return (
    <section className={styles.content}>
      <div className={styles.profileBackground}>
        <div className={styles.grid}>
          {/* тут используются инпут, что сделали ранее */}
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Почта</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="text"
                  value="Mariia@gmail.com"
                  aria-label="Email пользователя"
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                />
              </div>
              <button className={styles.changePassword}>Изменить пароль</button>
            </div>

            {/* и тут используются инпут */}
            <div className={styles.field}>
              <label className={styles.label}>Имя</label>
              <div className={styles.inputWrapper}>
                <Input
                  type="text"
                  value="Мария"
                  aria-label="Имя пользователя"
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                />
              </div>
            </div>

            {/* здесь использую календарь, что сделали тоже - проверь шрифты у него */}
            <div className={styles.birthGender}>
              <div className={styles.field}>
                <label className={styles.label}>Дата рождения</label>
                <div className={styles.inputBirth}>
                  <Calendar
                    value={new Date("1995-10-28")}
                    onChange={(date) => console.log(date)}
                  />
                </div>
              </div>

              {/* ниже в коментах я указала свою реализацию выбора пола, но я надеюсь,
              что его уже сделали и можно будет просто вставить сюда */}
              <div className={styles.field}>
                <label className={styles.label}>Пол</label>
                <div className={styles.genderWrapper}>
                  <button className={styles.genderTrigger} disabled>
                    Выбор пола
                    <img
                      src={chevronDownIcon}
                      alt="Открыть меню"
                      className={styles.genderArrowIcon}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* точно так же и с городом, этот компонент уже должен быть, его тоже надо
            сюда просто вставить */}
            <div className={styles.field}>
              <label className={styles.label}>Город</label>
              <div className={styles.cityWrapper}>
                <button className={styles.cityTrigger} disabled>
                  Москва
                  <img
                    src={chevronDownIcon}
                    alt="Открыть меню"
                    className={styles.genderArrowIcon}
                  />
                </button>
              </div>
            </div>

            {/* тут я решила сделать textarea - так можно писать текст в несколько строк */}
            <div className={styles.field}>
              <label className={styles.label}>О себе</label>
              <div className={styles.textareaWrapper}>
                <textarea
                  value="Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем‑то интересным!"
                  aria-label="О себе"
                />
                <img
                  src={editIcon}
                  alt="Редактировать"
                  className={styles.inputChildrenIcon}
                />
              </div>
            </div>

            {/* кнопка - ну она уже сделана, нужно добавить там ховеры если надо
            активна кнопка, неактивна - все это надо сделать */}
            <div className={styles.buttonSave}>
              <Button onClick={() => console.log("Сохраняем данные")}>
                Сохранить
              </Button>
            </div>
          </div>

          {/* аватар меняется от useAppSelector(selectUser) - точно так же как и в шапке
          соответственно надо сделать так, чтобы его можно было менять - сейчас же фото из моков */}
          <div className={styles.avatarBlock}>
            <div className={styles.avatarWrapper}>
              <img
                src={user?.avatarUrl}
                alt="avatar"
                className={styles.avatar}
              />
              <img
                src={editPhotoIcon}
                alt="Редактировать фото"
                className={styles.avatarEditIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

//я реализовала выбор гендера, но, раз уж у нас уже должен быть готовый компонент -
//просто вставь то, что сделают
//если же нет, юзай вот этот - он рабочий

// import { DropDown } from "@/shared/ui/DropDown/DropDown";

// const [gender, setGender] = useState("Женский");
// const [genderOpen, setGenderOpen] = useState(false);

{
  /* <div className={styles.field}>
  <label className={styles.label}>Пол</label>

  <div className={styles.genderWrapper}>
    <button
      className={styles.genderTrigger}
      onClick={() => setGenderOpen((prev) => !prev)}
    >
      {gender}
      <img
        src={chevronDownIcon}
        alt="Открыть меню"
        className={styles.genderArrowIcon}
      />
    </button>

    <DropDown
      isOpen={genderOpen}
      onClose={() => setGenderOpen(false)}
      triggerGroupe="gender"
      role="listbox"
      ariaLabel="Выбор пола"
      top="100%" // появляется сразу под кнопкой
      left="0" // выравнивание по левому краю кнопки
    >
      <ul className={styles.genderMenu}>
        {["Не указан", "Мужской", "Женский"].map((item) => (
          <li
            key={item}
            onClick={() => {
              setGender(item);
              setGenderOpen(false);
            }}
            className={styles.genderItem}
            role="option"
            aria-selected={gender === item}
          >
            {item}
          </li>
        ))}
      </ul>
    </DropDown>
  </div>
</div>; */
}
