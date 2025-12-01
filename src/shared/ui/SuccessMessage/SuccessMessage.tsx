import styles from "../../ui/SuccessMessage/successMessage.module.scss";
import clsx from "clsx";
import type { TSuccessMessageProps } from "@shared/ui/SuccessMessage/types";
import { SuccessIcon } from "@shared/ui/Icons/SuccessIcon";
import { NotificationIcon } from "@shared/ui/Icons/NotificationIcon";
import { Button } from "@shared/ui/Button";

export const SuccessMessage = (props: TSuccessMessageProps) => {
  const { variant = "successMessage", className } = props;

  return (
    <section className={clsx(styles.container, className)}>
      <div className={styles.containerIcon}>
        {variant === "successMessage" && <SuccessIcon />}
        {variant === "notificationMessage" && <NotificationIcon />}
      </div>
      <div className={clsx(styles.content, styles.scrollbar)}>
        {variant === "successMessage" && (
          <>
            <h2 className={styles.contentTitle}>Ваше предложение создано</h2>
            <p className={styles.subTittle}>
              Теперь вы можете предложить обмен
            </p>
          </>
        )}
        {variant === "notificationMessage" && (
          <>
            <h2 className={styles.contentTitle}>Вы предложили обмен</h2>
            <p className={styles.subTittle}>
              Теперь дождитесь подтверждения. Вам придёт уведомление
            </p>
          </>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button>Готово</Button>
      </div>
    </section>
  );
};
