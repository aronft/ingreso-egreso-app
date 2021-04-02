import { Action, createAction, props } from '@ngrx/store';
import { User } from './user.model';

export const SET_USER = '[USER] set user'
export const UNSET_USER = '[USER] unset user'


export class setUserAction implements Action {
    readonly type = SET_USER
    constructor(public user: User) {

    }
}

export class unsetUserAction implements Action {
    readonly type = UNSET_USER
}
export type acciones = setUserAction | unsetUserAction