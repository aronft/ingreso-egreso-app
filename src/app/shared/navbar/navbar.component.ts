import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User
  userSubscription: Subscription = new Subscription()
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select('auth').subscribe(resp => {
      this.user = resp.user
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }

}
