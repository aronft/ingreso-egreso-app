import { Action } from '@ngrx/store';
import { User } from './user.model';

export const SET_USER = '[USER] set user'


export class setUserAction implements Action {
    readonly type = SET_USER
    constructor(public user: User) {

    }
}

export type acciones = setUserAction