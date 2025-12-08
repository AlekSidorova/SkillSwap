import type { InputProps } from "./input.types";
import styles from "./input.module.scss";
import { useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { RadioActive, RadioEmpty } from "./InputSvg/RadioSvg";
import { CheckboxActive, CheckboxEmpty } from "./InputSvg/CheckboxSvg";
import { SearchSvg } from "./InputSvg/searchSvg";
import { CalendateSvg } from "./InputSvg/calendareSvg";
import { HidePassword, ShowPassword } from "./InputSvg/passwordSvg";

export const Input = (props: InputProps) => {
  const {
    type,
    children,
    isOpenList = false,
    isShowPassword = false,
    isBlockCheckedLabel = false,
    openListFunction,
    ...restProps
  } = props;

  if (type === "radio" || type === "checkbox") {
    const inputClass =
      type === "radio" ? styles.inputRadio : styles.inputCheckbox;

    const labelClass =
      type === "radio" ? styles.labelRadio : styles.labelCheckbox;

    const checkedSvg =
      type === "radio" ? (
        props.checked ? (
          <RadioActive />
        ) : (
          <RadioEmpty />
        )
      ) : props.checked ? (
        <CheckboxActive isOpenList={isOpenList} />
      ) : (
        <CheckboxEmpty />
      );

    const blockChecked = (e: MouseEvent<HTMLSpanElement>) => {
      if (isBlockCheckedLabel) {
        e.preventDefault();
        openListFunction?.();
      }
    };

    return (
      <label className={labelClass}>
        <input
          className={`${inputClass} ${styles.visuallyHidden}`}
          type={type}
          aria-checked={props.checked}
          {...restProps}
        />
        {checkedSvg}
        <span className={styles.inputText} onClick={blockChecked}>
          {children}
        </span>
      </label>
    );
  }

  if (type === "search") {
    return (
      <label className={styles.inputSearchWrapper}>
        <input
          className={styles.inputSearch}
          type={type}
          role="search"
          placeholder={props.placeholder || "Искать навык"}
          aria-label={props["aria-label"] || "Поиск"}
          {...restProps}
        />
        <SearchSvg className={styles.inputSearchSvg} aria-hidden="true" />
      </label>
    );
  }

  if (type === "date") {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handlePlaceHolderColor = (event: ChangeEvent<HTMLInputElement>) => {
      event.target.value
        ? event.target.classList.remove(styles.datePlaceholder)
        : event.target.classList.add(styles.datePlaceholder);

      if (inputRef.current?.blur) setIsCalendarOpen(false);
    };

    const handleCalendarToggle = () => {
      if (inputRef.current === null) return;

      if (isCalendarOpen) {
        setIsCalendarOpen(false);
      } else {
        inputRef.current.showPicker();
        setIsCalendarOpen(true);
      }
    };

    return (
      <div className={styles.inputDateWrapper}>
        <input
          ref={inputRef}
          className={`${styles.input} ${styles.datePlaceholder}`}
          onChange={handlePlaceHolderColor}
          type={type}
          aria-label={props["aria-label"] || "Выберите дату"}
          {...restProps}
        />
        <button
          type="button"
          className={styles.buttonDate}
          onClick={handleCalendarToggle}
          aria-label="Открыть календарь"
          aria-expanded={isCalendarOpen}
        >
          <CalendateSvg aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (type === "password") {
    const [showPassword, setShowPassword] = useState(isShowPassword);
    const [hasValue, setHasValue] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleHasValue = (event: ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(event.target.value));
    };

    return (
      <div className={styles.inputPasswordWrapper}>
        <input
          className={styles.inputPassword}
          type={showPassword ? "text" : "password"}
          onChange={handleHasValue}
          aria-label={props["aria-label"] || "Введите пароль"}
          {...restProps}
        />
        {hasValue && (
          <button
            type="button"
            className={styles.showPassword}
            onClick={handleShowPassword}
            aria-label={showPassword ? "Показать пароль" : "Скрыть пароль"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <HidePassword aria-hidden="true" />
            ) : (
              <ShowPassword aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      className={styles.input}
      type={type}
      aria-label={props["aria-label"] || props.placeholder}
      {...restProps}
    />
  );
};

// Универсальный компонент, который покрывает всё использование импутов в приложении. В качестве обязательного пропса необходимо передать тип инпута (type). Далее остальные пропсы передаются по мере необходимости.
// Обратите внимание! В макете, в выпадающем списке, есть разные отрисовки при состоянии checked. В данном компоненте это учтено через пропс isOpenList.
// Компоненты полностью стилизированы и, на текущий момент, не требуют внешних вмешательств. Разве что, в дальнейшем, подключим оригинальные картинки из проекта. Сейчас стоят заглушки.
// Пример использования:
// <Input type="checkbox" isOpenList children="Бизнес и карьера" />
// <Input type="checkbox" children="Бизнес и карьера" />
// <Input type="radio" children="Хочу научиться" name="Обязательно одинаковое имя!"/>
// <Input type="radio" children="Хочу играть в батлу" name="Обязательно одинаковое имя!"/>
// <Input type="text" placeholder="Введите ваше имя" />
// <Input type="search" placeholder="Искать навык" />
// Добавлен функционал для type="password". Если передать в пропс флаг isShowPassword, то форма будет сразу с открытым паролем, а если не передать, то с закрытым. Удобно будет использовать для разных задач (авторизация и регистрация).
