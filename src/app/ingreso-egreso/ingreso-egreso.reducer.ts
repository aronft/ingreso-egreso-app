

import { Action, createReducer, on } from '@ngrx/store';
import * as fromIngreso from './ingreso-egreso.actions'
import { IngresoEgreso } from './ingreso-egreso.model';

export interface IngresoEgresoState {
    items: IngresoEgreso[]
}

const estadoInicial: IngresoEgresoState = {
    items: []
}

const reducer = createReducer(estadoInicial,
    on (fromIngreso.setItems, (state, {items}) => {
        return {
            items: [
                ...items.map(item => {
                    return {
                        ...item
                    }
                })
            ]
        }
    }),
    on(fromIngreso.unsetItems, (state) => {
        return {
            items: []
        }
    })
)

export function ingresoEgresoReducer(state:IngresoEgresoState | undefined, action: Action) {
    return reducer(state, action)
} 