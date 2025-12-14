import { useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import styles from "./requestsPage.module.scss";

//моки пользователей
const MOCK_USERS: UserWithLikes[] = [
  {
    id: 1001,
    name: "Евгений",
    username: "evgeniy95",
    email: "evgeniy95@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=24",
    likes: 23,
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
    name: "Роман",
    username: "ivan89",
    email: "ivan89@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=52",
    likes: 16,
    likesCount: 20,
    isLikedByCurrentUser: false,
    cityId: 2,
    dateOfBirth: new Date("1974-03-12"),
    gender: "M",
    dateOfRegistration: new Date("2025-02-15T12:00:00Z"),
    lastLoginDatetime: new Date("2025-12-10T10:00:00Z"),
  },
  {
    id: 1003,
    name: "Людмила",
    username: "maria01",
    email: "maria01@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    likes: 11,
    likesCount: 15,
    isLikedByCurrentUser: false,
    cityId: 3,
    dateOfBirth: new Date("1997-08-05"),
    gender: "F",
    dateOfRegistration: new Date("2025-03-20T12:00:00Z"),
    lastLoginDatetime: new Date("2025-12-12T14:30:00Z"),
  },
];

//моки входящих заявок с соответствующими
const MOCK_REQUESTS = [
  {
    id: "req-1",
    fromUserId: "user-1002",
    toUserId: "user-1001",
    status: "pending",
    offerTitle: "Заявка на обмен",
  },
  {
    id: "req-2",
    fromUserId: "user-1003",
    toUserId: "user-1001",
    status: "pending",
    offerTitle: "Заявка на обмен",
  },
];

export const Requests = () => {
  const [users] = useState(MOCK_USERS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  //пользователи, которые прислали нам заявки
  const usersWithRequests = useMemo(() => {
    return requests
      .map((req) => {
        const user = users.find(
          (u) => u.id === parseInt(req.fromUserId.replace("user-", ""), 10),
        );
        if (!user) return null;

        return {
          ...user,
          exchangeId: req.id,
          exchangeStatus: req.status,
          offerTitle: req.offerTitle,
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
  }, [requests, users]);

  const handleAction = (exchangeId: string, status: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== exchangeId) return req;
        let newStatus: typeof req.status = "pending";
        if (status === "pending")
          newStatus = "accepted"; // Принять
        else if (status === "accepted")
          newStatus = "completed"; // Завершить
        else if (status === "completed") newStatus = "pending"; // Возобновить
        return { ...req, status: newStatus };
      }),
    );
  };

  if (usersWithRequests.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Заявки</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Нет новых заявок</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Заявки</h1>
      <p className={styles.subtitle}>
        Количество заявок: {usersWithRequests.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithRequests.map((user) => {
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
