export const httpErrorMessageTranslates = {
  ES: {
    AUTH: {
      INVALID_CREDENTIALS: 'Credenciales inválidas',
      UNNABLE_USER_TOKEN: 'Imposible crear un toke para el usuario',
      UNAUTHORIZED: 'No autorizado',
      SESSION_EXPIRED: 'La sesión ha terminado',
      USER_NOT_ACTIVED: 'El usuario no está activo',
    },
    USERS: {
      USER_NOT_FOUND: 'Usuario no encontrado',
      USER_ALREADY_EXIST: 'El usuario ya existe',
      NAME_ALREADY_EXIST: 'El nombre ya está registrado',
      EMAIL_ALREADY_EXIST: 'El email ya ha sido registrado',
      CREATE_USER_ERROR: 'Imposible crear el usuario',
      UPDATE_USER_ERROR: 'Imposible actualizar el usuario',
      ADMIN_ALREADY_EXIST: 'Usuario adminitrador ya existente',
      UNNABLE_DELETE_ADMIN: 'No se puede eliminar el usuario ADMIN',
      UNNABLE_UPDATE_ADMIN: 'El usuario ADMIN no se puede actualizar',
    },
    TELEGRAM_BOT_TESTER: {
      UNNABLE_CREATE_TELEGRAM_BOT: 'Imposible crear un bot de telegram',
      BOT_TOKEN_UNAUTHORIZED: 'Bot token no autorizado',
      BOT_TOKEN_NOT_FOUND: 'Bot token no encontrado',
      CHAT_ID_NOT_FOUND: 'Chat id no encontrado',
      CHAT_GROUP_DELETE: 'El grupo ha sido eliminado',
    },
    TELEGRAM_BOT_RESULTS: {
      TELEGRAM_BOT_RESULT_NOT_FOUND: 'Resultado del bot de telegram no encontrado',
      UNNABLE_CREATE_TELEGRAM_BOT_RESULT: 'Imposible crear resultado del bot de telegram',
    },
    APP: {
      METHOD_NOT_IMPLEMENTED: 'Método no implementado',
      METHOD_NOT_ALLOWED: 'Método no permitido',
    }
  },
  EN: {
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
  }
};
  