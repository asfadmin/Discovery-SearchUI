import { Action } from '@ngrx/store';


export abstract class UrlParameter {
  public load(value: string): Action | null {

      return (value && this.isValid(value)) ?
        this.loadParameter(value) :
        null;
  }

  abstract name(): string;
  abstract loadParameter(val: string): Action;

  protected isValid(val: string): boolean {
    return true;
  }

  public toString(val: any): string {
    return val;
  }
}
