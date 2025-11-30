import type { InputProps } from "./input.types";
import styles from "./input.module.scss";

export const Input = (props: InputProps) => {
  const { type, children, isOpenList = false, ...restProps } = props;

  if (type === "radio" || type === "checkbox") {
    const inputClass =
      type === "radio" ? styles.inputRadio : styles.inputCheckbox;

    const labelClass =
      type === "radio" ? styles.labelRadio : styles.labelCheckbox;

    const inputCustom =
      type === "radio"
        ? styles.inputRadioCustom
        : `${styles.inputCheckboxCustom} ${isOpenList ? styles.isList : styles.nonList}`;

    return (
      <label className={labelClass}>
        <input
          className={`${inputClass} ${styles.visuallyHidden}`}
          type={type}
          {...restProps}
        />
        <span className={inputCustom}> </span>
        <span className={styles.inputText}>{children}</span>
      </label>
    );
  }

  if (type === "search") {
    return (
      <label className={styles.inputSearchWrapper}>
        <input
          className={styles.inputSearch}
          type={type}
          placeholder={props.placeholder || "Искать навык"}
          {...restProps}
        />
      </label>
    );
  }

  return <input className={styles.input} type={type} {...restProps} />;
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
