import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import * as models from '@models';
// import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteParseService {
  //   private http = inject(HttpClient);
  public granule = signal<models.CMRProduct>(null);
  //
  private orbitFileUrl = computed(() =>
    this.granule().metadata.nisar.additionalUrls.find((s) =>
      s.endsWith('yaml'),
    ),
  );
  //   private latest = computed(() =>
  //     this.http
  //       .get<Response>(this.orbitFileUrl())
  //       .pipe(tap((response) => this.orbitFile.set(response))),
  //   );
  public orbitResponse = httpResource.blob(() => ({
    url: this.orbitFileUrl(),
    method: 'GET',
    withCredentials: true,
  }));
  public orbitFile = computed(() => this.orbitResponse.value);
}
