import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { ScreenSizeService } from '@services';
import { UnzippedFolder, CMRProduct } from '@models';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  size: number;
  url: string;
}

@Component({
  selector: 'app-file-contents',
  templateUrl: './file-contents.component.html',
  styleUrls: ['./file-contents.component.scss']
})
export class FileContentsComponent implements OnInit, OnDestroy {
  public product: CMRProduct;

  sceneNameLen: number;
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    (node: UnzippedFolder, level: number) => {
      return {
        expandable: !!node.contents && node.contents.length > 0,
        name: node.name,
        level: level,
        url: node.url,
        size: node.size
      };
    },
    node => node.level,
    node => node.expandable,
    node => node.contents
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  public queuedProductIds: Set<string>;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      combineLatest(
        this.store$.select(scenesStore.getUnzippedProducts),
        this.store$.select(scenesStore.getOpenUnzippedProduct)
      ).pipe(
        tap(([_, product]) => this.product = product),
        map(([unzipped, product]) => unzipped[product ? product.id : null]),
        filter(unzipped => !!unzipped),
      ).subscribe(
        unzipped => this.dataSource.data = unzipped
      )
    );

    this.subs.add(
      this.store$.select(queueStore.getQueuedProductIds).pipe(
        map(names => new Set(names))
      ).subscribe(
        ids => this.queuedProductIds = ids
      )
    );

    this.subs.add(
      this.screenSize.size$.pipe(
        map(size => {
          if (size.width > 1775) {
            return 32;
          } else if (size.width > 1350) {
            return 20;
          } else {
            return 10;
          }
        }),
      ).subscribe(len => this.sceneNameLen = len)
    );

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  public extension(filename: string): string {
    const fileExtension = filename.split('.').pop();

    return !fileExtension ?
      '' : `(${fileExtension})`;
  }

  public onToggleQueueProduct(node: ExampleFlatNode): void {
    const fileProduct = this.productFromNode(node, this.product);

    this.store$.dispatch(new queueStore.ToggleProduct(fileProduct));
  }

  public productFromNode(node: ExampleFlatNode, product): CMRProduct {
    const extension = this.extension(node.name);

    const productTypeDisplay = `${this.product.productTypeDisplay} ${extension}`;
    return {
      ...this.product,
      bytes: node.size,
      id: this.makeUnzippedId(node, product),
      downloadUrl: node.url,
      name: node.name,
      productTypeDisplay,
      isUnzippedFile: true,
      metadata: { ...this.product.metadata },
      file: `${this.product.file}_${node.name}`
    };
  }

  public makeUnzippedId(node, product): string {
    return product.id + node.name;
  }

  public isQueued(node: ExampleFlatNode): boolean {
    const nodeId = this. makeUnzippedId(node, this.product);

    return this.queuedProductIds.has(nodeId);
  }

  public prodDownloaded( product ) {
    product = product;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
