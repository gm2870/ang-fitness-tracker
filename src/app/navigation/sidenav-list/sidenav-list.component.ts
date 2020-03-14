import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() closeSidenav = new EventEmitter();
  isAuth$: Observable<boolean>;
  constructor(private store: Store<fromRoot.State>, private authService: AuthService) {}
  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }
  onSidenavClose() {
    this.closeSidenav.emit();
  }
  onLogout() {
    this.onSidenavClose();
    this.authService.logout();
  }
}
