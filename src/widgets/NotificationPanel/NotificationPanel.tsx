import React, { useState } from "react";
import styles from "./notificationPanel.module.scss";
import { NotificationItem } from "./NotificationItem";

export interface INotification {
  id: string; //айди оповещения
  message: string; //основное сообщение
  details: string; //дополнительные детали (например, "Перейти в профиль...")
  type: "success" | "error" | "warning"; //тип сообщения
  date: string; //дата уведомлений
  action?: string; //действие, например, перейти
}

const NotificationPanel: React.FC = () => {
  //делаем начальное состояние уведомления
  //так же добавляем тестовые данные
  const [notifications, setNotifications] = useState<INotification[]>([
    {
      id: "1",
      message: "Николай принял ваш обмен",
      details: "Перейдите в профиль, чтобы обсудить детали",
      type: "success",
      date: "сегодня",
      action: "Перейти",
    },
    {
      id: "2",
      message: "Татьяна предлагает вам обмен",
      details: "Примите обмен, чтобы обсудить детали",
      type: "warning",
      date: "сегодня",
      action: "Перейти",
    },
    {
      id: "3",
      message: "Олег предлагает вам обмен",
      details: "Примите обмен, чтобы обсудить детали",
      type: "warning",
      date: "вчера",
    },
    {
      id: "4",
      message: "Игорь принял ваш обмен",
      details: "Перейдите в профиль, чтобы обсудить детали",
      type: "success",
      date: "23 мая",
    },
  ]);

  //разделяем уведомления: первые 2 - "Новые", остальное "Просмотренные"
  const newNotifications = notifications.slice(0, 2); //первые 2 элемента
  const viewedNotifications = notifications.slice(2); //оставшиеся элементы

  return (
    <div className={styles.panelContainer}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Новые уведомления</h3>
        <a href="#0" className={styles.readEverything}>
          Прочитать все
        </a>
      </div>

      <div>
        {newNotifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>

      <div className={styles.viewedCard}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>Просмотренные</h3>
          <a href="#0" className={styles.readEverything}>
            Очистить
          </a>
        </div>

        <div>
          {viewedNotifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
