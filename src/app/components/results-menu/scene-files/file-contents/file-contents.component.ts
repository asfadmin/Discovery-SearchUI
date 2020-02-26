import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { map, tap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

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
export class FileContentsComponent implements OnInit {
  @Input() product: CMRProduct;

  sceneNameLen: number;
  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

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

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.store$.select(scenesStore.getUnzippedProducts).pipe(
      map(unzipped => unzipped[this.product.id]),
      filter(unzipped => !!unzipped),
    ).subscribe(
      unzipped => this.dataSource.data = unzipped
    );

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
    ).subscribe(len => this.sceneNameLen = len);
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
