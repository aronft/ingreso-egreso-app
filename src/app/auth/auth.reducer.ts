import { User } from './user.model';

import * as fromAuth from './auth.actions'
import { createReducer, on } from '@ngrx/store';

export interface AuthState {
    user: User
}


const estadoInicial: AuthState = {
    user: null
}


export function reducer(state: AuthState = estadoInicial, action: fromAuth.acciones ) {

    switch (action.type) {

        case fromAuth.SET_USER:
            return {
                user: {...action.user}
            }
     
        case fromAuth.UNSET_USER: 
            return {
                user: null
            }
            
        default:
            return state
    }
}