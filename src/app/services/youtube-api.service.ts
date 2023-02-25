import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class YoutubeApiService {

  private apiKey = 'AIzaSyBY3_U7ju_fFqlhPajiCpjdnIL8l4EGPDw';
  private ytApiUrl = 'https://www.googleapis.com/youtube/v3/';

  constructor(public http: HttpClient) { }

  public getVideosForChannel(channel = 'UChCfI0oVWw4qDwEidnDskJQ', maxResults = 500): Observable<Object> {
    const url = this.ytApiUrl +
                'search?key=' + this.apiKey +
                '&channelId=' + channel +
                '&order=date&part=snippet &type=video,id&maxResults=' + maxResults;
    return this.http.get(url)
      .pipe(map((res) => {
        return res;
      }));
  }

  public getTagsForVideo(id = ''): Observable<Object> {
    const url = this.ytApiUrl +
      'videos?key=' + this.apiKey +
      '&fields=items(snippet(title,description,tags))' +
      '&part=snippet' +
      '&id=' + id;
    return this.http.get(url)
      .pipe(map((res) => {
        return res;
      }));
  }

  public getVideoContentDetails(id = ''): Observable<Object> {
    const url = this.ytApiUrl + 'videos?' +
                'key=' + this.apiKey +
                '&id=' + id +
                '&part=contentDetails';
    return this.http.get(url)
      .pipe(map((res) => {
        return res;
      }));
  }
}
