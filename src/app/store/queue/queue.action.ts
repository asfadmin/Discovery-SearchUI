import { Action } from '@ngrx/store';

import { CMRProduct, AsfApiOutputFormat } from '@models';

export enum QueueActionType {
  ADD_ITEM = '[Queue] Add Item',
  ADD_ITEMS = '[Queue] Add Items',
  REMOVE_ITEM = '[Queue] Remove Item',
  REMOVE_ITEMS = '[Queue] Removes Item',
  CLEARN_QUEUE = '[Queue] Clear Queue',

  TOGGLE_PRODUCT = '[Queue] Toggle Product',
  QUEUE_GRANULE = '[Granules] Queue Granule',

  MAKE_DOWNLOAD_SCRIPT  = '[Queue] Make Bulk Download From Queue',
  DOWNLOAD_METADATA = '[Queue] Download Metadata',
}

export class AddItem implements Action {
  public readonly type = QueueActionType.ADD_ITEM;

  constructor(public payload: CMRProduct) {}
}

export class ToggleProduct implements Action {
  public readonly type = QueueActionType.TOGGLE_PRODUCT;

  constructor(public payload: CMRProduct) {}
}

export class AddItems implements Action {
  public readonly type = QueueActionType.ADD_ITEMS;

  constructor(public payload: CMRProduct[]) {}
}

export class RemoveItem implements Action {
  public readonly type = QueueActionType.REMOVE_ITEM;

  constructor(public payload: CMRProduct) {}
}

export class RemoveItems implements Action {
  public readonly type = QueueActionType.REMOVE_ITEMS;

  constructor(public payload: CMRProduct[]) {}
}

export class ClearQueue implements Action {
  public readonly type = QueueActionType.CLEARN_QUEUE;
}

export class MakeDownloadScript implements Action {
  public readonly type = QueueActionType.MAKE_DOWNLOAD_SCRIPT;
}

export class DownloadMetadata implements Action {
  public readonly type = QueueActionType.DOWNLOAD_METADATA;

  constructor(public payload: AsfApiOutputFormat) {}
}

export class QueueGranule implements Action {
  public readonly type = QueueActionType.QUEUE_GRANULE;

  constructor(public payload: string) {}
}

export type QueueActions =
  | AddItem
  | AddItems
  | ToggleProduct
  | QueueGranule
  | RemoveItem
  | RemoveItems
  | ClearQueue
  | MakeDownloadScript
  | DownloadMetadata;
