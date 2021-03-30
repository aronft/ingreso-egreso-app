import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators'

import Swal from 'sweetalert2'
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
    })
  }

  registrar(nombre: string, correo: string, password: string) {
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
        })
        .catch(error => {
          console.log(error);
          
        })
    })
    .catch(error => {
      Swal.fire('Error al crear ', error.message, 'error')
      
    })
  }

  login(correo: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(correo, password)
    .then(resp => {
      this.router.navigate(['/'])
    })
    .catch(error => {
      console.log(error)
      Swal.fire('Error al iniciar sesion', error.message, 'error')
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
