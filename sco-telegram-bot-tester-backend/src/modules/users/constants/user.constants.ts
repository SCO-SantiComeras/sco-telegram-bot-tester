import { RoleConstants } from "./role.constants";

export const usersConstants = {
     PUBLIC: {
        NAME: 'public',
        PASSWORD: 'Public123456!',
        EMAIL: 'public@sco-telegram-bot-tester.com',
        ACTIVE: true,
        ROLE: RoleConstants.USER,
    },
    ADMIN: {
        NAME: 'admin',
        PASSWORD: 'Admin123456!',
        EMAIL: 'admin@sco-telegram-bot-tester.com',
        ACTIVE: true,
        ROLE: RoleConstants.ADMIN,
    },
}