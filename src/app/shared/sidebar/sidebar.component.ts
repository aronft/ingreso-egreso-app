import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  user: User
  userSubscription: Subscription = new Subscription()
  constructor(private store: Store<AppState>, private authService: AuthService, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.userSubscription = this.store.select('auth').subscribe(resp => {
      this.user = resp.user
    })
  }

  logout(){
    this.authService.logout()
    this.ingresoEgresoService.cancelarSubscriptions()
    
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

}
