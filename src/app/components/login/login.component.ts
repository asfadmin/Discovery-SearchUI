import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { filter, delay } from 'rxjs/operators';

import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import { ViewType } from '@models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() view$: Observable<ViewType>;

  @Output() closed = new EventEmitter<void>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.view$.pipe(
      delay(100),
      filter(view => view === ViewType.LOGIN)
    ).subscribe(
      _ => this.openLoginDialog()
    );
  }

  private openLoginDialog(): void {
     const dialogRef = this.dialog.open(LoginDialogComponent , {
       maxWidth: '100vw', maxHeight: '100vh',
       height: '100%', width: '100%'
     });

    dialogRef.afterClosed().subscribe(
      _ => this.closed.emit()
    );
  }



}
