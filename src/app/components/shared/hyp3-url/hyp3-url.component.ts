import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import * as userStore from '@store/user';
import {SubSink} from 'subsink';
import * as services from '@services';
import { Store} from '@ngrx/store';
import { AppState } from '@store';

@Component({
  selector: 'app-hyp3-url',
  templateUrl: './hyp3-url.component.html',
  styleUrls: ['./hyp3-url.component.scss']
})
export class Hyp3UrlComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private hyp3 = inject(services.Hyp3ApiService);


  private subs = new SubSink();
  public hyp3BaseUrl = this.hyp3.baseUrl;
  public hyp3BackendUrl: string;

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.hyp3BackendUrl = profile.hyp3BackendUrl;
          if (this.hyp3BackendUrl) {
            this.hyp3.setApiUrl(this.hyp3BackendUrl);
          } else {
            this.hyp3BackendUrl = this.hyp3.apiUrl;
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
