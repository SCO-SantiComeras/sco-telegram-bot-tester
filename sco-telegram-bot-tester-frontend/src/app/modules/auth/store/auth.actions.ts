import { Login } from "../model/login";
import { User } from "../../users/model/user";

export class LogIn {
    static readonly type = '[Auth] Login';
    constructor(public payload: { login: Login } ) {}
}

export class LogOut {
    static readonly type = '[Auth] Logout';
}

export class RegisterUser {
    static readonly type = '[Auth] Register user';
    constructor(public payload: { user: User }) {}
}

export class RequestPassword {
    static readonly type = '[Auth] Request new password';
    constructor(public payload: { email: string }) {}
}

export class ResetPassword {
    static readonly type = '[Auth] Reset password';
    constructor(public payload: { pwdRecoveryToken: string, user: User }) {}
}

export class FetchUserRecoveryPwd {
    static readonly type = '[Auth] Fetch user Recovery Pwd';
    constructor(public payload: { pwdRecoveryToken: string }) {}
}

export class FetchUserByEmail {
    static readonly type = '[Auth] Fetch user Email';
    constructor(public payload: { email: string }) {}
}

export class ConfirmEmail {
    static readonly type = '[Auth] Confirm Users Email';
    constructor(public payload: { email: string }) {}
}

export class ValidateToken {
    static readonly type = '[Auth] Validate token';
    constructor(public payload: { user: User }) {}
}