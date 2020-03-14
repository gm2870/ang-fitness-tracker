import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UiService {
  loadingStateChange = new Subject<boolean>();
  constructor(private snackBar: MatSnackBar) {}
  showSnackBar(message: string, action, duration) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }
}
