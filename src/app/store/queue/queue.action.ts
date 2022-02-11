import { Action } from '@ngrx/store';

import { CMRProduct, AsfApiOutputFormat, QueuedHyp3Job, SarviewsProduct, DownloadStatus } from '@models';

export enum QueueActionType {
  ADD_ITEMS = '[Queue] Add Items',
  REMOVE_ITEM = '[Queue] Remove Item',
  REMOVE_ITEMS = '[Queue] Removes Item',
  CLEAR_QUEUE = '[Queue] Clear Queue',

  ADD_JOB = '[Queue] Add Job',
  ADD_JOBS = '[Queue] Add Jobs',
  REMOVE_JOB = '[Queue] Remove Job',
  REMOVE_JOBS = '[Queue] Remove Jobs',
  CLEAR_PROCESSING_QUEUE = '[Queue] Clear On Demand Queue',
  CLEAR_PROCESSING_QUEUE_BY_JOB_TYPE = '[Queue] Clear On Demand Queue By Type',

  TOGGLE_PRODUCT = '[Queue] Toggle Product',
  QUEUE_SCENE = '[Scenes] Queue Scene',
  REMOVE_SCENE_FROM_QUEUE = '[Queue] Remove Scene From Queue',

  MAKE_DOWNLOAD_SCRIPT  = '[Queue] Make Bulk Download From Queue',
  MAKE_DOWNLOAD_SCRIPT_FROM_LIST = '[Queue] Make a bulk Download script from search results',
  MAKE_DOWNLOAD_SCRIPT_FROM_SARVIEWS_PRODUCTS = '[Queue] Make a bulk Download Script From SARViews Event Products',
  DOWNLOAD_METADATA = '[Queue] Download Metadata',
  DOWNLOAD_SEARCHTYPE_METADATA = '[Queue] Download Search Result Metadata',

  DOWNLOAD_PRODUCT = '[Queue] Download product',
  REMOVE_DOWNLOAD_PRODUCT = '[Queue] Remove Download product',

  FIND_PAIR = '[Scenes] finds the closest pair to a given scene'
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

export class ToggleProduct implements Action {
  public readonly type = QueueActionType.TOGGLE_PRODUCT;

  constructor(public payload: CMRProduct) {}
}
export class DownloadProduct implements Action {
  public readonly type = QueueActionType.DOWNLOAD_PRODUCT;

  constructor(public payload: DownloadStatus) {}
}

export class RemoveDownloadProduct implements Action {
  public readonly type = QueueActionType.REMOVE_DOWNLOAD_PRODUCT;

  constructor(public payload: DownloadStatus) {}
}
export class ClearQueue implements Action {
  public readonly type = QueueActionType.CLEAR_QUEUE;
}

export class AddJob implements Action {
  public readonly type = QueueActionType.ADD_JOB;

  constructor(public payload: QueuedHyp3Job) {}
}

export class AddJobs implements Action {
  public readonly type = QueueActionType.ADD_JOBS;

  constructor(public payload: QueuedHyp3Job[]) {}
}

export class RemoveJob implements Action {
  public readonly type = QueueActionType.REMOVE_JOB;

  constructor(public payload: QueuedHyp3Job) {}
}

export class RemoveJobs implements Action {
  public readonly type = QueueActionType.REMOVE_JOBS;

  constructor(public payload: QueuedHyp3Job[]) {}
}

export class ClearProcessingQueue implements Action {
  public readonly type = QueueActionType.CLEAR_PROCESSING_QUEUE;
}

export class ClearProcessingQueueByJobType implements Action {
  public readonly type = QueueActionType.CLEAR_PROCESSING_QUEUE_BY_JOB_TYPE;

  constructor(public payload: Set<string>) {}
}

export class MakeDownloadScript implements Action {
  public readonly type = QueueActionType.MAKE_DOWNLOAD_SCRIPT;
}

export class MakeDownloadScriptFromList implements Action {
  public readonly type = QueueActionType.MAKE_DOWNLOAD_SCRIPT_FROM_LIST;
  constructor(public payload: CMRProduct[]) {}
}

export class MakeDownloadScriptFromSarviewsProducts implements Action {
  public readonly type = QueueActionType.MAKE_DOWNLOAD_SCRIPT_FROM_SARVIEWS_PRODUCTS;

  constructor(public payload: SarviewsProduct[]) {}
}

export class DownloadMetadata implements Action {
  public readonly type = QueueActionType.DOWNLOAD_METADATA;

  constructor(public payload: AsfApiOutputFormat) {}
}

export class DownloadSearchtypeMetadata implements Action {
  public readonly type = QueueActionType.DOWNLOAD_SEARCHTYPE_METADATA;

  constructor(public payload: AsfApiOutputFormat) {}
}
export class QueueScene implements Action {
  public readonly type = QueueActionType.QUEUE_SCENE;

  constructor(public payload: string) {}
}

export class FindPair implements Action {
  public readonly type = QueueActionType.FIND_PAIR;

  constructor(public payload: CMRProduct) {}
}
export class RemoveSceneFromQueue implements Action {
  public readonly type = QueueActionType.REMOVE_SCENE_FROM_QUEUE;

  constructor(public payload: string) {}
}

export type QueueActions =
  | AddItems
  | QueueScene
  | RemoveSceneFromQueue
  | RemoveItem
  | RemoveItems
  | ClearQueue
  | AddJob
  | AddJobs
  | RemoveJob
  | RemoveJobs
  | ToggleProduct
  | ClearProcessingQueue
  | ClearProcessingQueueByJobType
  | MakeDownloadScript
  | MakeDownloadScriptFromList
  | MakeDownloadScriptFromSarviewsProducts
  | DownloadMetadata
  | DownloadSearchtypeMetadata
  | FindPair
  | DownloadProduct
  | RemoveDownloadProduct;
