import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<HelpComponent>>(MatDialogRef);
  private store$ = inject<Store<AppState>>(Store);

  public topic: string;

  ngOnInit(): void {
    this.store$
      .select(uiStore.getHelpDialogTopic)
      .subscribe((topic) => (this.topic = topic));
  }

  public setHelpTopic(topic: string): void {
    this.store$.dispatch(new uiStore.SetHelpDialogTopic(topic));
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
