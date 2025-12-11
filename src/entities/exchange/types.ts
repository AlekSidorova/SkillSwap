// Типы для обменов навыками

export type ExchangeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Exchange {
  id: number;
  fromUserId: number;
  toUserId: number;
  fromSkillId: number;
  toSkillId: number;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
  fromUser?: {
    id: number;
    name: string;
  };
  toUser?: {
    id: number;
    name: string;
  };
}

export interface CreateExchangeRequest {
  fromUserId: number;
  toUserId: number;
  fromSkillId: number;
  toSkillId: number;
}

export interface ExchangeNotification {
  type: "exchange_accepted" | "exchange_rejected" | "exchange_completed";
  exchangeId: number;
  fromUserId: number;
  toUserId: number;
  toUserName: string;
  message: string;
  timestamp: string;
}
