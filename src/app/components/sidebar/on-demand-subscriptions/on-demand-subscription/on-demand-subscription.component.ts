import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { SubSink } from 'subsink';
import * as moment from 'moment';

import * as models from '@models';

@Component({
  selector: 'app-on-demand-subscription',
  templateUrl: './on-demand-subscription.component.html',
  styleUrls: ['./on-demand-subscription.component.scss']
})
export class OnDemandSubscriptionComponent implements OnInit, OnDestroy {
  @Input() subscription: models.OnDemandSubscription;
  @Input() isExpanded: boolean;
  @Input() isToggling: boolean;

  @Output() toggleEnabled = new EventEmitter<models.OnDemandSubscription>();
  @Output() toggleExpand = new EventEmitter<string>();
  @Output() loadSearch = new EventEmitter<models.OnDemandSubscription>();
  @Output() viewProducts = new EventEmitter<string>();
  @Output() newEnd = new EventEmitter<Date>();
  @Output() renew = new EventEmitter<models.OnDemandSubscription>();

  @ViewChild('endDateForm', { static: false }) public endDateForm: NgForm;

  public endDateErrors$ = new Subject<void>();

  public isEditingEndDate = false;
  public newEndDate: Date;
  public isEndError = false;
  public isSubOutOfDate: boolean;
  public expiresThisMonth: boolean;

  public subs = new SubSink();

  constructor() { }

  ngOnInit(): void {
    this.subs.add(
      this.endDateErrors$.pipe(
        tap(_ => {
          this.isEndError = true;
          this.subEndControl.reset();
          this.subEndControl.setErrors({'incorrect': true});
        }),
        delay(820),
      ).subscribe(_ => {
        this.isEndError = false;
        this.subEndControl.setErrors(null);
      })
    );

    const today = new Date();
    const subEnd = new Date(this.subscription.filters.end);
    this.isSubOutOfDate = today > subEnd;
    const daysLeft = Math.max(moment(subEnd).diff(moment(today), 'days'), 0);
    this.expiresThisMonth = daysLeft < 29;
  }

  public getMinDate(): Date {
    return this.subscription.filters.start;
  }

  public getMaxDate(): Date {
    const current = new Date();
    current.setDate(current.getDate() + 179);

    return current;
  }

  public onEndDateChange(e: MatDatepickerInputEvent<moment.Moment>): void {
    let date: null | Date;

    if (!this.subEndControl.valid || !e.value) {
      date = null;
      this.endDateErrors$.next();
    } else {
      const momentDate = e.value.set({h: 0});
      date = momentDate.toDate();
    }

    this.newEndDate = date;
  }

  public onEditDate(): void {
    if (this.isExpanded === false) {
      this.toggleExpand.emit(this.subscription.id);
    }

    this.newEndDate = this.subscription.filters.end;
    this.isEditingEndDate = true;
  }

  public onDoneEditing(): void {
    this.isEditingEndDate = false;

    if (this.newEndDate) {
      this.newEnd.emit(this.newEndDate);
    }
  }

  public onToggleEnabled(): void {
    this.toggleEnabled.emit(this.subscription);
  }

  public onToggleExpand(): void {
    this.toggleExpand.emit(this.subscription.id);
  }

  public loadOnDemandSearch(): void {
    this.viewProducts.emit(this.subscription.name);
  }

  public onRenewSubscription(): void {
    this.renew.emit(this.subscription);
  }

  public onLoadSearch(): void {
    this.loadSearch.emit(this.subscription);
  }

  private get subEndControl() {
    return this.endDateForm.form
      .controls['endInput'];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
