import { User } from "../../users/model/user";

export class FetchUsers{
    static readonly type = '[USER] Fetch users';
    constructor(public payload: { filter?: any }) {}
}

export class CreateUser {
    static readonly type = '[USER] Create a new user';
    constructor(public payload: { user: User }) {}
}

export class UpdateUser {
    static readonly type = '[USER] Update a user';
    constructor(public payload: { _id: string, user: User }) {}
}

export class DeleteUser {
    static readonly type = '[USER] Delete a user';
    constructor(public payload: { name: string }) {}
}

/* Web Sockets */
export class SubscribeUserWS{
    static readonly type = '[USER] Subscribe user WS'
}

export class UnSubscribeUserWS {
    static readonly type = '[USER] UnSubscribe user WS';
}