import {Component, OnInit, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { YoutubeApiService } from '@services/youtube-api.service';
import { YoutubeVideo, YoutubeVideoContentDetails } from '@models/youtube.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-help-toc',
  templateUrl: './help-toc.component.html',
  styleUrls: ['./help-toc.component.scss']
})
export class HelpTocComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public topic: string;
  public videos: YoutubeVideo[] = [];
  public dataSource: YoutubeVideo[] = [];
  public searchDataSource = new MatTableDataSource([]);
  public resultsDataSource = new MatTableDataSource([]);
  public featuresDataSource = new MatTableDataSource([]);

  public channelSearchResult: YoutubeVideo;
  public contentSearchResult: YoutubeVideoContentDetails;

  public displayedColumns: string[] = ['description'];
  // public displayedColumns: string[] = ['title', 'description', 'length'];

  constructor(
    private store$: Store<AppState>,
    private YoutubeApiService$: YoutubeApiService,
  ) { }

  ngOnInit(): void {

    this.store$.select(uiStore.getHelpDialogTopic).subscribe(
      topic => this.topic = topic
    );

    this.YoutubeApiService$.getVideosForChannel()
      .subscribe(videoList => {
        for (const video of videoList['items']) {
          video.snippet.title = video.snippet.title.replace(/(&quot\;)/g, '\"');
          video.snippet.description = video.snippet.description.split('.')[0];
          this.videos.push(video);
          this.dataSource = this.videos;
          // if (video.snippet.description.includes(')')) {
          //   console.log('video.snippet.description:', video.snippet.description);
          //   this.videos.push(video);
          //   this.dataSource = this.videos;
          // }
        }
      },
        error => console.log(error),
        () => {
          this.matchContentDetails();
          this.matchTags();
        }
      );
  }

  public matchContentDetails () {
    for ( const video of this.videos) {
      // console.log('video:', video);
      this.YoutubeApiService$.getVideoContentDetails(video.id.videoId)
        .subscribe( detailList => {
          for (const detail of detailList['items']) {
            for (const vid of this.videos) {
              if (vid.id.videoId === detail.id) {
                detail.contentDetails.duration = this.convertISO8601ToMs(detail.contentDetails.duration);
                vid.contentDetails = detail.contentDetails;
              }
            }
          }
        },
          error => console.log(error),
          () => {}
        );
    }
  }

  public matchTags () {
    for ( const video of this.videos) {
      this.YoutubeApiService$.getTagsForVideo(video.id.videoId)
        .subscribe( tagList => {
            if ( tagList['items'][0].snippet.hasOwnProperty('tags') ) {
                video.snippet.tags = tagList['items'][0].snippet.tags;
              } else {
                video.snippet.tags = [];
            }
        },
          error => console.log(error),
          () => { this.loadDataTables(); }
        );
    }
  }

  public convertISO8601ToMs(duration: string): string  {
    const time_extractor = /^P([0-9]*D)?T([0-9]*H)?([0-9]*M)?([0-9]*S)?$/i;
    const extracted = time_extractor.exec(duration);
    if (extracted) {
      // const days = parseInt(extracted[1], 10) || 0;
      // const hours = parseInt(extracted[2], 10) || 0;
      const minutes = parseInt(extracted[3], 10) || 0;
      const seconds = parseInt(extracted[4], 10) || 0;
      const formattedDuration: string = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      return formattedDuration;
      // return (days * 24 * 3600 * 1000) + (hours * 3600 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    }
    return '0';
  }

  public applyFilters() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.searchDataSource.filter = 'Defining Data Searches';
    this.resultsDataSource.filter = 'Using Search Results';
    this.featuresDataSource.filter = 'Advanced Features';
  }

  public loadDataTables () {
    console.log('XXXXX this.videos XXXXX:', this.videos);
    this.dataSource = this.videos;
    this.sort.active = 'description';
    this.sort.direction = 'asc';

    this.searchDataSource = new MatTableDataSource(this.dataSource);
    this.searchDataSource.filterPredicate = (data: any, filter: string) => this.tagFilter(data, filter);
    this.searchDataSource.sortingDataAccessor = (item, property) => {
      return this.customSortingDataAccessor(item, property);
    };
    this.searchDataSource.sort = this.sort;

    this.resultsDataSource = new MatTableDataSource(this.dataSource);
    this.resultsDataSource.filterPredicate = (data: any, filter: string) => this.tagFilter(data, filter);
    this.resultsDataSource.sortingDataAccessor = (item, property) => {
      return this.customSortingDataAccessor(item, property);
    };
    this.resultsDataSource.sort = this.sort;

    this.featuresDataSource = new MatTableDataSource(this.dataSource);
    this.featuresDataSource.filterPredicate = (data: any, filter: string) => this.tagFilter(data, filter);
    this.featuresDataSource.sortingDataAccessor = (item, property) => {
      return this.customSortingDataAccessor(item, property);
    };
    this.featuresDataSource.sort = this.sort;

    this.applyFilters();
  }

  public customSortingDataAccessor (item, property) {
    switch (property) {
    case 'description':
      return item.snippet.description;
    default:
      return item[property];
    }
}

  public setHelpTopic(topic: string): void {
    this.store$.dispatch(new uiStore.SetHelpDialogTopic(topic));
  }

  public tagFilter( data: any, filter: string) {
    if ( filter === '*' ) { return true; }
    let matchFound = false;
    if (data.snippet.tags) {
      for (const tag of data.snippet.tags) {
        if (tag.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1) {
          matchFound = true;
        }
      }
    }
    return matchFound;
  }

}
