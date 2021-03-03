import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-help-toc',
  templateUrl: './help-toc.component.html',
  styleUrls: ['./help-toc.component.scss']
})
export class HelpTocComponent implements OnInit {
  public topic: string;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store$.select(uiStore.getHelpDialogTopic).subscribe(
      topic => this.topic = topic
    );
  }

  public setHelpTopic(topic: string): void {
    this.store$.dispatch(new uiStore.SetHelpDialogTopic(topic));
  }
}
