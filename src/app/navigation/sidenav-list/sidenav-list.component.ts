import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter();
  isAuth: boolean;
  constructor(private authService: AuthService) {}
  authSub: Subscription;
  ngOnInit() {
    this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
  onSidenavClose() {
    this.closeSidenav.emit();
  }
  onLogout() {
    this.onSidenavClose();
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
