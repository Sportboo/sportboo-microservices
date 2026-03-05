
export enum OtpType {
  EmailRegistration = 'EMAIL_REGISTRATION_OTP',
  PhoneRegistration = 'PHONE_REGISTRATION_OTP',
  ForgetUserPasswordOtp = 'FORGET_USER_PASSWORD_OTP',
  ForgetAdminPasswordOtp = 'FORGET_ADMIN_PASSWORD_OTP',
  FiatTransactionWithdrawal = 'FIAT_TRANSACTION_WITHDRAWAL_OTP',
  CryptoTransactionWithdrawal = 'CRYPTO_TRANSACTION_WITHDRAWAL_OTP',
  FiatTransactionTransfer = 'FIAT_TRANSACTION_TRANSFER_OTP',
  CryptoTransactionTransfer = 'CRYPTO_TRANSACTION_TRANSFER_OTP',
}

export enum FiatTransactionServiceProvider {
  Flutterwave = 'flutterwave',
  Paystack = 'paystack',
  Paypal = 'paypal'
}

export enum MarketSelection {
  DirectWinSelection,
  DoubleChanceSelection,
  OverUnderSelection,
  GoalNoGoalSelection,
  OddEvenSelection,
}

export enum AccountVerificationType {
  DriverLicenseFrontUrl = 'driverLicenseFrontUrl',
  DriverLicenseBackUrl = 'driverLicenseBackUrl',
  IdCardFrontUrl = 'idCardFrontUrl',
  IdCardBackUrl = 'idCardBackUrl',
  PassportFrontUrl = 'passportFrontUrl',
  PassportBackUrl = 'passportBackUrl',
  PermitFrontUrl = 'permitFrontUrl',
  PermitBackUrl = 'permitBackUrl',
}

export enum PushNotificationIntension {
  Notification = 'NOTIFICATION'
}

export enum TokenType {
  AccessToken = 'ACCESS_TOKEN',
  RefreshToken = 'REFRESH_TOKEN'
}

export enum ActivityPeriod {
  SevenDays = 'SEVEN_DAYS', 
  OneMonth = 'ONE_MONTH', 
  OneYear = 'ONE_YEAR'
}

export enum TransactionFilterType {
  Recent = 'RECENT',
  Crypto = 'CRYPTO',
  Fiat = 'FIAT',
}

export enum AssetFilterType {
  StableCoins = 'STABLE_COINS',
  Fiat = 'FIAT'
}

export enum FavoriteType {
  Player = 'player',
  Competition = 'competition',
  Match = 'match',
  Team = 'team',
}
