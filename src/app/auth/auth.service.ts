import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators'

import Swal from 'sweetalert2'
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { setUserAction } from './auth.actions';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription: Subscription = new Subscription()
  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore, private store: Store<AppState>) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.userSubscription =  this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges().subscribe((usuarioObj: any) => {
          const newUser = new User(usuarioObj)
          console.log(newUser);
          this.store.dispatch(new setUserAction(newUser))
        })
      } else {
        this.userSubscription.unsubscribe()
      }
    })
  }

  registrar(nombre: string, correo: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.createUserWithEmailAndPassword(correo, password)
    .then(resp => {
      const user: User = {
        uid: resp.user.uid,
        nombre: nombre,
        email: resp.user.email
      }

      this.afDB.doc(`${user.uid}/usuario`).set(user)
        .then(() => {
          this.router.navigate(['/'])
          this.store.dispatch(new DesactivarLoadingAction())
        })
        .catch(error => {
          console.log(error);
          this.store.dispatch(new DesactivarLoadingAction())
        })
    })
    .catch(error => {
      Swal.fire('Error al crear ', error.message, 'error')
      this.store.dispatch(new DesactivarLoadingAction())
    })
  }

  login(correo: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction())
    this.afAuth.auth.signInWithEmailAndPassword(correo, password)
    .then(resp => {
      this.router.navigate(['/'])
      this.store.dispatch(new DesactivarLoadingAction())
    })
    .catch(error => {
      Swal.fire('Error al iniciar sesion', error.message, 'error')
      this.store.dispatch(new DesactivarLoadingAction())
    })
  }

  logout() {
    this.router.navigate(['/login'])
    this.afAuth.auth.signOut()
  }

  isAuth() {
      return this.afAuth.authState.pipe(map(fbUser =>{
        if (fbUser === null) {
          this.router.navigate(['/login'])
        }
        return fbUser != null
      }))
  }
}
