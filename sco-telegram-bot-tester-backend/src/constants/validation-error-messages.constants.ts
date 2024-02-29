export const validationErrorMessages = {
    LOGIN: {
        NAME: {
            NOT_EMPTY: 'Name should be not empty',
            INVALID_VALUE: 'Name should be string value',
            MIN_LENGTH: 'Name minimum length is 4 characteres',
            MAX_LENGTH: 'Name maximum length is 15 characteres',
        },
        PASSWORD: {
            NOT_EMPTY: 'Password should be not empty',
            INVALID_VALUE: 'Password should be string value',
            MIN_LENGTH: 'Password minimum length is 8 characteres',
            MAX_LENGTH: 'Password maximum length is 30 characteres',
            MATCHES: 'Password invalid format. At least one upper case, one lower case, one number and one special character',
        }
    },
    USERS: {
        ID: {
            NOT_EMPTY: '_id should be not empty',
            INVALID_VALUE: '_id should be string value',
        },
        NAME: {
            NOT_EMPTY: 'Name should be not empty',
            INVALID_VALUE: 'Name should be string value',
            MIN_LENGTH: 'Name minimum length is 4 characteres',
            MAX_LENGTH: 'Name maximum length is 15 characteres',
        },
        PASSWORD: {
            NOT_EMPTY: 'Password should be not empty',
            INVALID_VALUE: 'Password should be string value',
            MIN_LENGTH: 'Password minimum length is 8 characteres',
            MAX_LENGTH: 'Password maximum length is 30 characteres',
            MATCHES: 'Password invalid format. At least one upper case & one lower case & one number & one special character',
        },
        NEW_PASSWORD: {
            NOT_EMPTY: 'New password should be not empty',
            INVALID_VALUE: 'New password should be string value',
            MIN_LENGTH: 'New password minimum length is 8 characteres',
            MAX_LENGTH: 'New password maximum length is 30 characteres',
            MATCHES: 'New password invalid format. At least one upper case & one lower case & one number & one special character',
        },
        EMAIL: {
            NOT_EMPTY: 'Email should be not empty',
            INVALID_VALUE: 'Email should be string value',
            MATCHES: 'Email should be valid',
        },
        ACTIVE: {
            NOT_EMPTY: 'Active should be not empty',
            INVALID_VALUE: 'Active should be boolean value',
        },
        ROLE: {
            NOT_EMPTY: 'Role should be not empty',
            INVALID_VALUE: 'Role should be string value',
        },
        PWD_RECOVERY_TOKEN: {
            NOT_EMPTY: 'Password recovery token should be not empty',
            INVALID_VALUE: 'Password recovery token should be string value',
        },
        PWD_RECOVERY_DATE: {
            NOT_EMPTY: 'Password recovery date should be not empty',
            INVALID_VALUE: 'Password recovery date should be date value',
        },
        TYPE_OBJ: {
            NOT_EMPTY: 'TypeObj should be not empty',
            INVALID_VALUE: 'TypeObj should be string value',
        },
    },
    SEND_MESSAGE: {
        TOKEN: {
            NOT_EMPTY: 'Token should be not empty',
            INVALID_VALUE: 'Token should be string value',
        },
        CHAT_ID: {
            NOT_EMPTY: 'Chat id should be not empty',
            INVALID_VALUE: 'Chat id should be string value',
        },
        TEXT: {
            NOT_EMPTY: 'Text should be not empty',
            INVALID_VALUE: 'Text should be string value',
        },
        USER: {
            NOT_EMPTY: 'User should be not empty',
            INVALID_VALUE: 'User should be object (UserDto)',
        },
    },
    TELEGRAM_BOT_RESULT: {
        ID: {
            NOT_EMPTY: '_id should be not empty',
            INVALID_VALUE: '_id should be string value',
        },
        USER: {
            NOT_EMPTY: 'User should be not empty',
            INVALID_VALUE: 'User should be object (UserDto)',
        },
        TOKEN: {
            NOT_EMPTY: 'Token should be not empty',
            INVALID_VALUE: 'Token should be string value',
        },
        CHAT_ID: {
            NOT_EMPTY: 'Chat id should be not empty',
            INVALID_VALUE: 'Chat id should be string value',
        },
        TEXT: {
            NOT_EMPTY: 'Text should be not empty',
            INVALID_VALUE: 'Text should be string value',
        },
        SUCCESS: {
            NOT_EMPTY: 'Success should be not empty',
            INVALID_VALUE: 'Success should be boolean value',
        },
        ERROR_CODE: {
            NOT_EMPTY: 'Error code should be not empty',
            INVALID_VALUE: 'Error code should be number value',
        },
        ERROR_MESSAGE: {
            NOT_EMPTY: 'Error message should be not empty',
            INVALID_VALUE: 'Error message should be string value',
        },
        CREATED_AT: {
            NOT_EMPTY: 'Created at should be not empty',
            INVALID_VALUE: 'Created at should be Date value',
        },
        UPDATED_AT: {
            NOT_EMPTY: 'Updated at should be not empty',
            INVALID_VALUE: 'Updated at should be Date value',
        },
        TYPE_OBJ: {
            NOT_EMPTY: 'TypeObj should be not empty',
            INVALID_VALUE: 'TypeObj should be string value',
        },
    },
};
    