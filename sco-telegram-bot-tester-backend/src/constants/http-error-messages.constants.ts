export const httpErrorMessages = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNNABLE_USER_TOKEN: 'Unnable to generate user token',
    UNAUTHORIZED: 'Unauthorized',
    SESSION_EXPIRED: 'Session expired',
    USER_NOT_ACTIVED: 'User not actived',
  },
  USERS: {
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXIST: 'User already exist',
    NAME_ALREADY_EXIST: 'Name already registered',
    EMAIL_ALREADY_EXIST: 'Email already registered',
    CREATE_USER_ERROR: 'Unnable to create user',
    UPDATE_USER_ERROR: 'Unnable to update user',
    ADMIN_ALREADY_EXIST: 'Admin already exist',
    UNNABLE_DELETE_ADMIN: 'Unnable to delete admin',
    UNNABLE_UPDATE_ADMIN: 'Unnable to update admin',
  },
  TELEGRAM_BOT_TESTER: {
    UNNABLE_CREATE_TELEGRAM_BOT: 'Unnable to create telegram bot',
    BOT_TOKEN_UNAUTHORIZED: 'Bot token unauthorized',
    BOT_TOKEN_NOT_FOUND: 'Bot token not found',
    CHAT_ID_NOT_FOUND: 'Chat id not found',
    CHAT_GROUP_DELETE: 'Group chat was deleted'
  },
  TELEGRAM_BOT_RESULTS: {
    TELEGRAM_BOT_RESULT_NOT_FOUND: 'Telegram bot result not found',
    UNNABLE_CREATE_TELEGRAM_BOT_RESULT: 'Unnable to create telegram bot result',
  },
  APP: {
    METHOD_NOT_IMPLEMENTED: 'Method not implemented',
    METHOD_NOT_ALLOWED: 'Method not allowed',
  }
};
  