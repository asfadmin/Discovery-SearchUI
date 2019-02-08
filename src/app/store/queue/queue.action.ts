import { Action } from '@ngrx/store';

import { Sentinel1Product } from '@models';

export enum QueueActionType {
  ADD_ITEM = '[Queue] Add Item',
  REMOVE_ITEM = '[Queue] Remove Item',
  CLEARN_QUEUE = '[Queue] Clear Queue',
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

export type QueueActions =
  | AddItem
  | RemoveItem
  | ClearQueue;
