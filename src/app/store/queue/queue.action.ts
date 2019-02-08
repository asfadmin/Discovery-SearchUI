import { Action } from '@ngrx/store';

import { Sentinel1Product, AsfApiOutputFormat } from '@models';

export enum QueueActionType {
  ADD_ITEM = '[Queue] Add Item',
  REMOVE_ITEM = '[Queue] Remove Item',
  CLEARN_QUEUE = '[Queue] Clear Queue',

  MAKE_DOWNLOAD_SCRIPT  = '[Queue] Make Bulk Download From Queue',
  DOWNLOAD_METADATA = '[Queue] Download Metadata',
}

export class AddItem implements Action {
  public readonly type = QueueActionType.ADD_ITEM;

  constructor(public payload: Sentinel1Product) {}
}

export class RemoveItem implements Action {
  public readonly type = QueueActionType.REMOVE_ITEM;

  constructor(public payload: Sentinel1Product) {}
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

export type QueueActions =
  | AddItem
  | RemoveItem
  | ClearQueue
  | MakeDownloadScript
  | DownloadMetadata;
