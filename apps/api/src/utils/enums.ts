// convert TokenTypes to int ... TODO:
export enum TokenTypesEnum {
  ACCESS,
  REFRESH,
  RESET_PASSWORD,
  VERIFY_EMAIL,
}

export enum ImageStatusEnum {
  UPLOADED,
  PROCESSING,
  FAILEDRETRY,
  ERROR,
  READY,
  TRASHED,
  DELETED,
}

export enum PublishStatus {
  AUTODRAFT,
  DRAFT,
  FORREVIEW,
  REJECTED,
  PUBLISHED,
  TRASHED,
  DELETED,
}
