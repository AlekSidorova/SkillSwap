import { type FC, memo, useState } from "react";
import type { TOption, TSelectorUIProps } from "./type";
import styles from "./selector.module.scss";
import arrow from "../../../images/icons/chevron-down.svg";
import clsx from "clsx";

export const SelectorUI: FC<TSelectorUIProps> = memo(
  ({ selectionTitle, selectionOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<TOption[]>([]);

    const toggleOption = (option: TOption) => {
      if (selected.includes(option)) {
        setSelected(selected.filter((opt: TOption) => opt !== option));
      } else {
        setSelected([...selected, option]);
      }
    };

    return (
      <div className={clsx(styles.wrapper)}>
        <div
          className={clsx(styles.container, {
            [styles.container_open]: isOpen,
          })}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectionTitle}
          <img
            src={arrow}
            alt="иконка стрелочки"
            className={clsx(styles.arrow, { [styles.arrow_open]: isOpen })}
          />
        </div>
        {isOpen && (
          <ul className={clsx(styles.list)}>
            {selectionOptions.map((option) => (
              <li
                className={clsx(styles.listElement)}
                key={option}
                onClick={() => toggleOption(option)}
              >
                <input
                  className={clsx(styles.input, {
                    [styles.input_checked]: selected.includes(option),
                  })}
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                />
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      // <form>
      //   <fieldset className={styles.container}>
      //     {selectOptions.map((item, index) => (
      //       <label key={index}>
      //         <input type="radio" value={item} />
      //         {item}
      //       </label>
      //     ))}
      //   </fieldset>
      // </form>
    );
  },
);
