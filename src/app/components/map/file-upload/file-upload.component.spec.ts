import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, Component, Directive  } from '@angular/core';
import { isDatasetBrowser } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { cold, getTestScheduler } from 'jasmine-marbles';
import { MatDialog } from '@angular/material/dialog';

import { FileUploadComponent, FileUploadModule } from '.';

describe('FileUploadComponent', () => {
  let fixture;
  let component: FileUploadComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FileUploadModule,
      ],
      providers: [
        { provide: MatDialog, useClass: TestDialog }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #openDialog()', async () => {
    let wasSuccessful: boolean;
    let polygon: string;
    component.dialogClose.subscribe(v => wasSuccessful = v);
    component.newSearchPolygon.subscribe(v => polygon = v);

    (<any>component.dialog).returnValue = 'good wkt';

    component.openDialog();
    getTestScheduler().flush();

    expect(wasSuccessful).toEqual(true);
    expect(polygon).toEqual('good wkt');

    (<any>component.dialog).returnValue = null;

    component.openDialog();
    getTestScheduler().flush();
    expect(wasSuccessful).toEqual(false);
  });

});

class TestDialog {
  public returnValue: string | null;

  public open(_, __) {
    return {
      afterClosed: () => {
        return cold('--v', {v: this.returnValue});
      }
    };
  }

  private getReturn() {
    return this.returnValue;
  }
}
