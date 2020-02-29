import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter();
  isAuth: boolean;
  constructor(private authService: AuthService) {}
  authSub: Subscription;
  ngOnInit() {
    this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }
  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
