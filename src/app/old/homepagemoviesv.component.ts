import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../services/user.service';
import { CmsService } from './../services/cms.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-homepagemoviesv',
  templateUrl: './homepagemoviesv.component.html',
  styleUrls: ['./homepagemoviesv.component.css'],
})
export class homepageMoviesvComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: any; // , { static: true}
  items = [];
  itemsCount = 0;
  enviapiurl = environment.API_URL;

  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
  ) {
    let dhis = this;
    setTimeout(function () {
      dhis.getAllMoviesLists();
    }, 2500);
  }

  ngOnInit() {
    var dhis = this;
    setTimeout(function () {
      document.addEventListener('scroll', (event) => {
        var video = document.getElementById(
          'dashboardmoviesvplayercvm'
        ) as HTMLVideoElement;
        if (
          document.getElementById('dashboardmoviesvplayercvm') &&
          dhis._cmsService.elementInViewport(
            document.getElementById('dashboardmoviesvplayercvm')
          ) == true &&
          window.innerWidth < 600
        ) {
          if (dhis._cmsService.videoPlaying == false) {
            var promise = video.play();
            dhis._cmsService.videoPlaying = true;
          }
        } else if (video) {
          video.pause();
          dhis._cmsService.videoPlaying = false;
        }
      });
    }, 1500);
  }

  reloadImages() {
    this.getAllMoviesLists();
  }

  getAllMoviesLists() {
    this._cmsService
      .getDashboardAllMovies()
      .subscribe((result) => this.getAllMoviesListsReady(result));
  }

  getAllMoviesListsReady(res) {
    this.items = res;
    let dhis = this;
    setTimeout(function () {
      if (document.getElementById('dashboardmoviesvplayercvm'))
        document
          .getElementById('dashboardmoviesvplayercvm')
          .setAttribute(
            'src',
            environment.API_URL +
              '/api/assets/content/' +
              dhis.items[0]._id +
              '/main.mp4'
          );

      if (dhis.items[0].schemaextend[0].subtitles.length > 0) {
        dhis.items[0].schemaextend[0].subtitles.forEach(function (s) {
          if (s.ISO == 'GB') {
            document
              .getElementById('enTrack')
              .setAttribute(
                'src',
                '/api/assets/content/' +
                  dhis.items[0]._id +
                  '/' +
                  s.ISO +
                  '.vtt'
              );
          } else if (s.ISO == 'NL') {
            document
              .getElementById('nlTrack')
              .setAttribute(
                'src',
                '/api/assets/content/' +
                  dhis.items[0]._id +
                  '/' +
                  s.ISO +
                  '.vtt'
              );
          }
        });
      }
    }, 3000);
  }
}
