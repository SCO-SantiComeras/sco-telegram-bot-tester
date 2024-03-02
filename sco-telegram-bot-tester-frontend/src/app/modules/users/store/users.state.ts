import { HttpErrorsService } from 'src/app/shared/http-error/http-errors.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { User } from "../model/user";
import { Injectable } from "@angular/core";
import { UsersService } from "../users.service";
import { CreateUser, DeleteUser, FetchUsers, SubscribeUserWS, UnSubscribeUserWS, UpdateUser } from "./users.actions";
import { catchError, map, tap } from "rxjs/operators";

export class UsersStateModel {
  users: User[];
  user: User;
  success: boolean;
  notifyChangeUsers: boolean;
  errorMsg: string;
  successMsg: string;
}

export const UsersStateDefaults: UsersStateModel = {
  users: [],
  user: undefined,
  success: false,
  notifyChangeUsers: false,
  errorMsg: '',
  successMsg: '',
};

@State<UsersStateModel>({
  name: 'users',
  defaults: UsersStateDefaults,
})

@Injectable()
export class UsersState {

  constructor(
    private readonly usersService: UsersService,
    private readonly translateService: TranslateService,
    private readonly httpErrorsService: HttpErrorsService,
  ) {}

  @Selector()
  static users(state: UsersStateModel): User[] {
    return state.users;
  }

  @Selector()
  static user(state: UsersStateModel): User {
    return state.user;
  }
  
  @Selector()
  static success(state: UsersStateModel): boolean {
    return state.success;
  }

  @Selector()
  static notifyChangeUsers(state: UsersStateModel): boolean {
    return state.notifyChangeUsers;
  }

  @Selector()
  static errorMsg(state: UsersStateModel): string {
    return state.errorMsg;
  }

  @Selector()
  static successMsg(state: UsersStateModel): string {
    return state.successMsg;
  }

  @Action(FetchUsers)
  public fetchUsers(
    { patchState }: StateContext<UsersStateModel>,
    { payload }: FetchUsers
  ) { 
    return this.usersService.fetchUsers(payload.filter).pipe(
      map((users: User[]) => {
        patchState({
          users: [],
        });

        if (users) {
          patchState({
            users: users,
          });
        }
      })
    );
  }

  @Action(CreateUser)
  public createUser(
    { patchState }: StateContext<UsersStateModel>,
    { payload }: CreateUser
  ) {
    return this.usersService.createUser(payload.user).pipe(
      tap((user: User) => {
        patchState({
          success: false,
          errorMsg: this.translateService.getTranslate('label.users.state.create.error'),
        });

        if(user){
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.users.state.create.success'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.users.state.create.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      }),
    );
  }

  @Action(UpdateUser)
  public updateUser(
    { patchState }: StateContext<UsersStateModel>,
    { payload }: UpdateUser
  ) {
    return this.usersService.updateUser(payload._id, payload.user).pipe(
      tap((user: User) => {
        patchState({
          success: false,
          errorMsg: this.translateService.getTranslate('label.users.state.update.error'),
        });

        if(user){
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.users.state.update.success'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.users.state.update.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      }),
    );
  }

  @Action(DeleteUser)
  public deleteUser( 
    { patchState }: StateContext<UsersStateModel>,
    { payload }: DeleteUser
  ) {
    return this.usersService.deleteUser(payload.name).pipe(
      tap((result: boolean) => {
        patchState({
          success: false,
          errorMsg: this.translateService.getTranslate('label.users.state.delete.error'),
        });

        if(result){
          patchState({
            success: true,
            successMsg: this.translateService.getTranslate('label.users.state.delete.success'),
          });
        }
      }),
      catchError(error => {
        let errorMsg: string = this.translateService.getTranslate('label.users.state.delete.error');
        if (this.httpErrorsService.getErrorMessage(error.error.message)) {
          errorMsg = this.httpErrorsService.getErrorMessage(error.error.message);
        }

        patchState({
          success: false,
          errorMsg: errorMsg,
        });

        throw new Error(error);
      }),
    );
  }
  
  /* Web Sockets */
  @Action(SubscribeUserWS)
  public suscribeUserWS(ctx: StateContext<UsersStateModel>) {
    return this.usersService.getUsersBySocket().pipe(
      map((change: boolean) => {
        if (change) {
          let state = ctx.getState();

          state = {
            ...state,
            notifyChangeUsers : !state.notifyChangeUsers
          };

          ctx.setState({ ...state });
        }
      })
    )
  }

  @Action(UnSubscribeUserWS)
  public unsuscribeUserWS() {
    this.usersService.removeSocket();
  }
}