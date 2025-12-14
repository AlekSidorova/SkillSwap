import { useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import styles from "./exchangesPage.module.scss";

//текущий пользователь
const CURRENT_USER_ID = "user-1000";

//моки пользователей
const MOCK_USERS: UserWithLikes[] = [
  {
    id: 1001,
    name: "Евгений",
    username: "evgeniy95",
    email: "evgeniy95@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=24",
    likes: 40,
    likesCount: 40,
    isLikedByCurrentUser: false,
    cityId: 1,
    dateOfBirth: new Date("1995-05-23"),
    gender: "M",
    dateOfRegistration: new Date("2025-01-01T12:00:00Z"),
    lastLoginDatetime: new Date("2025-11-28T21:50:00Z"),
  },
  {
    id: 1002,
    name: "Иван",
    username: "ivan89",
    email: "ivan89@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
    likes: 20,
    likesCount: 20,
    isLikedByCurrentUser: false,
    cityId: 2,
    dateOfBirth: new Date("1989-03-12"),
    gender: "M",
    dateOfRegistration: new Date("2025-02-15T12:00:00Z"),
    lastLoginDatetime: new Date("2025-12-10T10:00:00Z"),
  },
  {
    id: 1003,
    name: "Мария",
    username: "maria01",
    email: "maria01@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    likes: 15,
    likesCount: 15,
    isLikedByCurrentUser: false,
    cityId: 3,
    dateOfBirth: new Date("1990-08-05"),
    gender: "F",
    dateOfRegistration: new Date("2025-03-20T12:00:00Z"),
    lastLoginDatetime: new Date("2025-12-12T14:30:00Z"),
  },
];

//моки активных обменов
const MOCK_EXCHANGES = [
  {
    id: "ex-1",
    fromUserId: "user-1000",
    toUserId: "user-1002",
    status: "pending",
    offerTitle: "Обмен",
  },
  {
    id: "ex-2",
    fromUserId: "user-1003",
    toUserId: "user-1000",
    status: "accepted",
    offerTitle: "Обмен",
  },
];

export const Exchanges = () => {
  const [users] = useState(MOCK_USERS);
  const [exchanges, setExchanges] = useState(MOCK_EXCHANGES);

  //формируем список пользователей с активными обменами
  const usersWithExchanges = useMemo(() => {
    return exchanges
      .map((ex) => {
        const otherUserId =
          ex.fromUserId === CURRENT_USER_ID ? ex.toUserId : ex.fromUserId;
        const otherUserIdNum = parseInt(otherUserId.replace("user-", ""), 10);

        const user = users.find((u) => u.id === otherUserIdNum);
        if (!user) return null;

        return {
          ...user,
          exchangeId: ex.id,
          exchangeStatus: ex.status,
          offerTitle: ex.offerTitle,
        } as UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        };
      })
      .filter(
        (
          u,
        ): u is UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        } => Boolean(u),
      );
  }, [exchanges, users]);

  const handleAction = (exchangeId: string, status: string) => {
    setExchanges((prev) =>
      prev.map((ex) => {
        if (ex.id !== exchangeId) return ex;
        let newStatus: typeof ex.status = "pending";
        if (status === "pending") newStatus = "accepted";
        else if (status === "accepted") newStatus = "completed";
        else if (status === "completed") newStatus = "pending";
        return { ...ex, status: newStatus };
      }),
    );
  };

  if (usersWithExchanges.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>У вас пока нет активных обменов</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Мои обмены</h1>
      <p className={styles.subtitle}>
        Активных обменов: {usersWithExchanges.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithExchanges.map((user) => {
          let buttonText = "";
          if (user.exchangeStatus === "pending") buttonText = "Принять";
          else if (user.exchangeStatus === "accepted") buttonText = "Завершить";
          else if (user.exchangeStatus === "completed")
            buttonText = "Возобновить";

          return (
            <Card
              key={user.id}
              user={user}
              cities={[]}
              description={user.offerTitle}
              buttonText={buttonText}
              onDetailsClick={() =>
                handleAction(user.exchangeId, user.exchangeStatus)
              }
            />
          );
        })}
      </div>
    </>
  );
};
