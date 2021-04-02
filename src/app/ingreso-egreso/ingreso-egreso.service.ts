import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { AuthService } from '../auth/auth.service';
import { setItems } from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import * as fromIngresoEgreso from './ingreso-egreso.actions'
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  ingresoEgresoListenerSubscription: Subscription = new Subscription()
  ingresoEgresoItemsSubscripcion: Subscription = new Subscription()
  constructor(private afDB: AngularFirestore, private authService: AuthService, private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth').pipe(
      filter(auth => auth.user != null)
    )
    .subscribe(auth => {
        this.ingresoEgresoItems(auth.user.uid)
    })
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscripcion = this.afDB.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(docData => {
          return docData.map(doc => {
            return  {
              uid: doc.payload.doc.id,
              ...<Object>doc.payload.doc.data()
            }
          })
        })
      )
      .subscribe((collection: any[]) => {
        this.store.dispatch(fromIngresoEgreso.setItems({items: collection}))
      })
  }

  cancelarSubscriptions() {
    this.ingresoEgresoItemsSubscripcion.unsubscribe()
    this.ingresoEgresoListenerSubscription.unsubscribe()
    this.store.dispatch(fromIngresoEgreso.unsetItems())
  }  

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUser()
    return this.afDB.doc(`${user.uid}/ingresos-egresos`).collection('items').add({...ingresoEgreso})
  }

  borrarIngresoEgreso( uid: string) {
    const user = this.authService.getUser()
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete()
  } 

}
