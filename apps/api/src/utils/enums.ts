export enum TokenTypesEnum {
  ACCESS,
  REFRESH,
  SIGNATURE,
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

export enum ArtworkStatusEnum {
  DRAFT,
  SAVED,
  PUBLISHED,
  MINTING,
  MINTED,
  TRASHED,
  DELETED,
  HASMINTEDOBJECTS,
  AUTODRAFT,
}

export enum ArObjectStatusEnum {
  DRAFT, // 0
  SAVED, // 1
  PUBLISHED, // 2
  MINTING, // 3
  MINTED, // 4
  TRASHED, // 5
  DELETED, // 6
  AUTODRAFT, // 7
  MINT, // 8
  MINTRETRY, // 9
  MINTERROR, // 10
  MINTCONFIRM, // 11
}

export enum ArModelStatusEnum {
  UPLOADED,
  PROCESSING,
  FAILEDRETRY,
  ERROR,
  READY,
  TRASHED,
  DELETED,
  AUTODRAFT,
  MINTING,
  MINTED,
}

export enum ExhibitionStatusEnum {
  DRAFT,
  SAVED,
  PUBLISHED,
  MINTING,
  MINTED,
  TRASHED,
  DELETED,
  AUTODRAFT,
}
