import { Component, OnInit, Input } from '@angular/core';
import { environment } from './../../environments/environment';
import { CmsService } from './../services/cms.service';
import { UserService } from './../services/user.service';
import { Page } from './../../models/page';

@Component({
  selector: 'app-homepageblok',
  templateUrl: './homepageblok.component.html',
  styleUrls: ['./homepageblok.component.css'],
})
export class HomepageblokComponent implements OnInit {
  @Input() type;
  @Input() _id;

  items = [];
  enviapiurl = '';
  page: Page = new Page();
  constructor(
    public _userService: UserService,
    private _cmsService: CmsService
  ) {
    this.enviapiurl = environment.API_URL;
  }

  ngOnInit(): void {
    //console.log(this._id);
    this._cmsService.getcms(this._id).subscribe((res) => (this.page = res));
    if (
      this.type == 'd' ||
      this.type == 'p' ||
      this.type == 'm' ||
      this.type == 'q'
    ) {
      this.getAllDoubleLists();
    } else if (this.type != 'h') {
      this.getAllLists();
    }
  }

  getAllDoubleLists() {
    this._cmsService
      .getRandomChild(this._id)
      .subscribe((result) => this.getAllDoublePreReady(result));
  }

  getAllDoublePreReady(res) {
    if (this.type == 'm') {
      this._cmsService
        .getRandomChild(res[0]._id)
        .subscribe((result) => this.getTripleLists(result));
    } else {
      this._cmsService
        .getRandomChild(res[0]._id)
        .subscribe((result) => this.getPagesReady(result));
    }
  }

  getTripleLists(res) {
    this._cmsService
      .getPages(res[0]._id)
      .subscribe((result) => this.getPagesReady(result));
  }

  getAllLists() {
    this._cmsService
      .getRandomChild(this._id)
      .subscribe((result) => this.getPagesReady(result));
  }

  getPagesReady(res) {
    this.items = res;
    let dhis = this;
    if (this.type == 'v' || this.type == 'd' || this.type == 'p') {
      if (document.getElementById('home_' + this.type + '_' + this._id))
        document
          .getElementById('home_' + this.type + '_' + this._id)
          .setAttribute(
            'src',
            environment.API_URL +
              '/api/assets/content/' +
              dhis.items[0]._id +
              '/main.mp4'
          );

      document
        .getElementById('home_' + this.type + '_' + this._id)
        .setAttribute(
          'poster',
          environment.API_URL +
            '/api/assets/content/' +
            dhis.items[0]._id +
            '/thumb.jpg'
        );

      if (
        dhis.items &&
        dhis._id == '5c0d45ea64c6c530246b568a' &&
        dhis.items[0].schemaextend[0].subtitles.length > 0
      ) {
        dhis.items[0].schemaextend[0].subtitles.forEach(function (s) {
          if (s.ISO == 'GB') {
            if (document.getElementById('enTrack_' + dhis._id))
              document
                .getElementById('enTrack_' + dhis._id)
                .setAttribute(
                  'src',
                  dhis.enviapiurl +
                    '/api/assets/content/' +
                    dhis.items[0]._id +
                    '/' +
                    s.ISO +
                    '.vtt'
                );
          } else if (s.ISO == 'NL') {
            if (document.getElementById('nlTrack' + dhis._id))
              document
                .getElementById('nlTrack' + dhis._id)
                .setAttribute(
                  'src',
                  dhis.enviapiurl +
                    '/api/assets/content/' +
                    dhis.items[0]._id +
                    '/' +
                    s.ISO +
                    '.vtt'
                );
          }
        });
      }
    } else if (this.type == 'c' || this.type == 'q') {
      if (document.getElementById('home_' + this.type + '_' + this._id)) {
        if (this.type == 'q' && this._id == '5ca885cce19d492df0898192') {
          if (
            this.items[0].objectType == '5c0114ca962a560534e3e575' ||
            this.items[0].objectType == '5c0114dc962a560534e3e576'
          ) {
            document.getElementById(
              'home_' + this.type + '_' + this._id
            ).style.display = 'none';
            document.getElementById(
              'home_video_' + this.type + '_' + this._id
            ).style.display = 'inline-block';
            document
              .getElementById('home_video_' + this.type + '_' + this._id)
              .setAttribute(
                'src',
                environment.API_URL +
                  '/api/assets/content/' +
                  this.items[0]._id +
                  '/main.mp4'
              );
          } else {
            document
              .getElementById('home_video_' + this.type + '_' + this._id)
              .setAttribute('src', '');
            document.getElementById(
              'home_video_' + this.type + '_' + this._id
            ).style.display = 'none';
            document.getElementById(
              'home_' + this.type + '_' + this._id
            ).style.display = 'inline-block';
            document
              .getElementById('home_' + this.type + '_' + this._id)
              .setAttribute(
                'src',
                environment.API_URL +
                  '/api/assets/content/' +
                  this.items[0]._id +
                  '/thumb.jpg'
              );
          }
        } else {
          document
            .getElementById('home_' + this.type + '_' + this._id)
            .setAttribute(
              'src',
              environment.API_URL +
                '/api/assets/content/' +
                this.items[0]._id +
                '/thumb.jpg'
            );
        }
      }
    } else if (this.type == 'm') {
      // const video = document.getElementById(
      //   'home_' + this.type + '_' + this._id
      // ) as HTMLAudioElement | null;
      // document
      //   .getElementById('home_' + this.type + '_' + this._id)
      //   .setAttribute(
      //     'src',
      //     environment.API_URL +
      //       '/api/assets/Albums/' +
      //       this.items[0].schemaextend[0].url +
      //       '/main.mp3'
      //   );
      //video.load();
    }
    setTimeout(function () {}, 3000);
  }

  removeHistory(index) {
    this._userService.user_current.urlHistory.splice(index, 1);
    this._userService.update(this._userService.user_current).subscribe();
  }

  reloadImages() {
    if (
      this.type == 'd' ||
      this.type == 'p' ||
      this.type == 'm' ||
      this.type == 'q'
    ) {
      this.getAllDoubleLists();
    } else {
      this.getAllLists();
    }
  }

  loadfile(url, album) {
    if (this._userService.user_current != undefined) {
      const video = document.getElementById(
        'home_' + this.type + '_' + this._id
      ) as HTMLAudioElement | null;
      video.src = this.enviapiurl + '/api/assets/music/Albums/' + url;
    }
  }
}
