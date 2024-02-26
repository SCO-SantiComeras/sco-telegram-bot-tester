import { RoleConstants } from "./roles.constants";

export const usersConstants = {
    ADMIN: {
        NAME: 'admin',
        PASSWORD: 'Admin123456!',
        EMAIL: 'admin@sco-telegram-bot-tester',
        ACTIVE: true,
        ROLE: RoleConstants.ADMIN,
    },
    PUBLIC: {
        NAME: 'public',
        PASSWORD: 'Public123456!',
        EMAIL: 'public@sco-telegram-bot-tester',
        ACTIVE: true,
        ROLE: RoleConstants.PUBLIC,
    },
}