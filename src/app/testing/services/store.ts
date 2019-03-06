import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable().pipe(
      map(selector)
    );
  }

  dispatch(action: any) {}
}
