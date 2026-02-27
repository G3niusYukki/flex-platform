export enum UserType {
  WORKER = "WORKER",
  EMPLOYER = "EMPLOYER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum OnlineStatus {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  BUSY = "BUSY",
}

export enum SalaryType {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  FIXED = "FIXED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  DISPUTED = "DISPUTED",
}

export enum DispatchStatus {
  PENDING_ACCEPT = "PENDING_ACCEPT",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum UrgencyLevel {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum DispatchType {
  MANUAL = "MANUAL",
  SYSTEM_AUTO = "SYSTEM_AUTO",
  WORKER_ACCEPT = "WORKER_ACCEPT",
}

export enum DispatchRecordStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export enum EvaluationType {
  EMPLOYER_TO_WORKER = "EMPLOYER_TO_WORKER",
  WORKER_TO_EMPLOYER = "WORKER_TO_EMPLOYER",
}

export enum TransactionType {
  ORDER_PAYMENT = "ORDER_PAYMENT",
  REFUND = "REFUND",
  WITHDRAWAL = "WITHDRAWAL",
  RECHARGE = "RECHARGE",
  SYSTEM_ADJUSTMENT = "SYSTEM_ADJUSTMENT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  WECHAT = "WECHAT",
  ALIPAY = "ALIPAY",
  STRIPE = "STRIPE",
  BALANCE = "BALANCE",
}

export enum NotificationType {
  NEW_ORDER = "NEW_ORDER",
  ORDER_DISPATCHED = "ORDER_DISPATCHED",
  ORDER_ACCEPTED = "ORDER_ACCEPTED",
  ORDER_STARTED = "ORDER_STARTED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_CANCELED = "ORDER_CANCELED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  WITHDRAWAL_SUCCESS = "WITHDRAWAL_SUCCESS",
  NEW_EVALUATION = "NEW_EVALUATION",
  SYSTEM_NOTICE = "SYSTEM_NOTICE",
}

export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "待接单",
  [OrderStatus.ACCEPTED]: "已接单",
  [OrderStatus.IN_PROGRESS]: "进行中",
  [OrderStatus.COMPLETED]: "已完成",
  [OrderStatus.CANCELED]: "已取消",
  [OrderStatus.DISPUTED]: "有争议",
};

export const USER_STATUS_TEXT: Record<UserStatus, string> = {
  [UserStatus.PENDING]: "待审核",
  [UserStatus.ACTIVE]: "正常",
  [UserStatus.INACTIVE]: "已禁用",
  [UserStatus.SUSPENDED]: "已封禁",
};

export const GENDER_TEXT: Record<Gender, string> = {
  [Gender.MALE]: "男",
  [Gender.FEMALE]: "女",
  [Gender.OTHER]: "其他",
};
