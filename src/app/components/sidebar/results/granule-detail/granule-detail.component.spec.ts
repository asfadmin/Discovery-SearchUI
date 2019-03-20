import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, Component, Directive  } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';

import { TruncateModule } from '@yellowspot/ng-truncate';
import { PipesModule } from '@pipes';
import { Sentinel1Product } from '@models';
import { GranuleDetailComponent } from './granule-detail.component';

import { testProduct } from '@testing/data';


describe('GranuleDetailComponent', () => {
  let fixture;
  let component: GranuleDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PipesModule,
        TruncateModule
      ],
      declarations: [
        GranuleDetailComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(GranuleDetailComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onNewQueueProduct()', async () => {
    let product: Sentinel1Product;
    component.newQueueItem.subscribe((newProduct) => product = newProduct);

    const result = component.onNewQueueProduct(testProduct);

    expect(product).toEqual(testProduct);
  });

  it('should run #onQueueAllProducts()', async () => {
    let products: Sentinel1Product[];
    component.newQueueItems.subscribe((newProducts) => products = newProducts);

    component.products = [ testProduct ];
    const result = component.onQueueAllProducts();

    expect(products).toEqual(component.products);
  });

  it('should run #onSetFocusedGranule()', async () => {
    let product: Sentinel1Product;
    component.newFocusedGranule.subscribe((newProduct) => product = newProduct);

    const result = component.onSetFocusedGranule(testProduct);

    expect(product).toEqual(testProduct);
  });

  it('should run #onClearFocusedGranule()', async () => {
    let didEmit = false;
    component.clearFocusedGranule.subscribe(_ => didEmit = true);

    const result = component.onClearFocusedGranule();

    expect(didEmit).toBeTruthy();
  });
});
