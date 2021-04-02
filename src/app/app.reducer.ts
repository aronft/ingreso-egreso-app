import { ActionReducerMap } from '@ngrx/store'
import * as fromUI from 'src/app/shared/ui.reducer'
import * as fromAuth from 'src/app/auth/auth.reducer'
import * as fromIngresoEgreso from 'src/app/ingreso-egreso/ingreso-egreso.reducer'

export interface AppState {
    ui: fromUI.State
    auth: fromAuth.AuthState
    ingresoEgreso: fromIngresoEgreso.IngresoEgresoState

}

export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUI.reducer,
    auth: fromAuth.reducer,
    ingresoEgreso: fromIngresoEgreso.ingresoEgresoReducer
}