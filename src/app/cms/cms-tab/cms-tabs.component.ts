import { Component, OnInit, Input } from '@angular/core';
import { CmsService } from './../../services/cms.service';
import { UserService } from './../../services/user.service';
import { MediaService } from './../../services/media.service';
import { MessageService } from './../../services/message.service';
import { FormBuilder } from '@angular/forms';
import { Page } from './../../../models/page';

@Component({
  selector: 'app-cms-tabs',
  templateUrl: './cms-tabs.component.html',
  styleUrls: ['./cms-tabs.component.css'],
})
export class CmsTabsComponent {
  @Input() pageForm;
  dataObject;
  public clicked = 'tab_1';
  public toggleHidden = true;
  chkAssetFolder;
  progress = 0;
  oldurl;
  videoLength;

  constructor(
    public _cmsService: CmsService,
    public _userService: UserService,
    public _mediaService: MediaService,
    public fb: FormBuilder,
    public _messageService: MessageService
  ) {}

  imageThumbFromImage() {
    this._cmsService
      .imageThumbFromImage(this._cmsService.pageSelected._id)
      .subscribe((res) =>
        this.imageThumbFromImageReady(this._cmsService.pageSelected)
      );
  }

  imageThumbFromImageReady(res) {
    this._cmsService.setPageSelected(res);
    this._messageService.SetAlertInfo('Thumb created from image');
  }

  imageInfo() {
    this._cmsService
      .getImageInfo(this._cmsService.pageSelected)
      .subscribe((res) => this.getImageInfoReady(res));
  }

  getImageInfoReady(res) {
    console.log(res);
  }

  getImdb() {
    this._cmsService
      .getImdb(this._cmsService.pageSelected)
      .subscribe((res) => this.getImdbReady());
  }

  getImdbReady() {
    this._cmsService
      .getcms(this._cmsService.pageSelected._id)
      .subscribe((res) => this._cmsService.setPageSelected(res));
    //this._cmsService.setPageSelected(this._cmsService.pageSelected);
    this._messageService.SetAlertInfo('Imdb info updated');
    //this._cmsService.getMovieInfo(this._cmsService.pageSelected).subscribe(res => this.getMovieInfoReady(res));
  }

  srtToVtt(lang) {
    this._cmsService
      .srtToVtt(this._cmsService.pageSelected, lang)
      .subscribe((res) => this.srtToVttReady(res, lang));
  }

  srtToVttReady(res, lang) {
    this._cmsService.setPageSelected(this._cmsService.pageSelected);
    this._messageService.SetAlertInfo(lang + ' Srt converted to Vtt');
  }

  check_subtitle_files() {
    //var res = this._cmsService.checkAssetFile2('GB.srt', '', this._cmsService.pageSelected._id).subscribe(rest => this.check_subtitle_filesReady(rest, "GB"));
    //var reb = this._cmsService.checkAssetFile2('NL.srt', '', this._cmsService.pageSelected._id).subscribe(rest => this.check_subtitle_filesReady(rest, "NL"));
  }

  check_subtitle_filesReady(result, lang) {
    if (result == 'no') {
      //(document.getElementById('subtitle_' + lang.toLowerCase()) as HTMLInputElement).setAttribute('src', '');
    } else {
      (
        document.getElementById(
          'subtitle_' + lang.toLowerCase()
        ) as HTMLInputElement
      ).setAttribute(
        'src',
        'api/assets/content/subtitle_' + lang.toLowerCase() + '.vtt'
      );

      //(document.getElementById('subtitle_' + lang.toLowerCase()) as HTMLInputElement).disabled = false;
    }
  }

  imagerotate(degrees) {
    this._cmsService
      .imagerotate2(this._cmsService.pageSelected._id, degrees)
      .subscribe();
  }

  createThumb() {
    console.log('createThumb');
    this._cmsService
      .createThumb(this._cmsService.pageSelected._id)
      .subscribe((res) => console.log('thumb created'));
  }

  precreateimage(page) {
    this._cmsService
      .createImage(page._id)
      .subscribe((result) => this.createImageReady(result, page));
  }

  createImage(id) {
    //console.log(id);
    this._cmsService.getcms(id).subscribe((res) => this.precreateimage(res));
  }

  createImageReady(res, page) {
    this._cmsService.update_edit_image_fields(page);
    this._messageService.SetAlertInfo('Image and thumb created from movie');
  }

  id3tags() {
    this._cmsService
      .id3tags(this._cmsService.pageSelected)
      .subscribe((result) =>
        this.savelistPreReadyExtension(this._cmsService.pageSelected._id)
      );
  }

  savelistPreReadyExtension(thisId: string) {
    this._cmsService
      .getcms(thisId)
      .subscribe((res) => this.savelistReadyExtension(res));
  }

  savelistReadyExtension(page: Page) {
    if (page._id == this._cmsService.pageSelected._id) {
      this._cmsService.setPageSelected(page);
    }
    this._cmsService.resetParentCmsSubPagesExtension(page);
    this._messageService.SetAlertInfo('Page saved succesfully');
  }

  field_fixed() {
    var position = document.getElementById('div_edit_page').style.position;
    if (!document.getElementById('div_edit_page').style.position) {
      document.getElementById('div_edit_page').style.position = 'fixed';
      document.getElementById('div_edit_page').style.width = '60%';
    } else {
      document.getElementById('div_edit_page').style.position = '';
      document.getElementById('div_edit_page').style.width = '';
    }
  }

  toggle_hidden() {
    var element = document.getElementsByClassName('button_hide');
    if (element.length > 0) {
      if (this.toggleHidden == false) {
        for (var i = 0; i < element.length; i++) {
          element[i].classList.add('hidden');
        }
      } else {
        for (var i = 0; i < element.length; i++) {
          element[i].classList.remove('hidden');
        }
      }
      this.toggleHidden = !this.toggleHidden;
    }
  }

  checkAssetFolder(assetfolder) {
    this._cmsService
      .checkAssetFolder(assetfolder)
      .subscribe((result) => (this._cmsService.chkAssetFolder = result));
  }

  createAssetFolder(assetfolder) {
    this._cmsService
      .createAssetFolder(assetfolder)
      .subscribe((result) => this.createAssetFolderReady(result));
  }

  createAssetFolderReady(answer) {
    if (answer == true) {
      this._cmsService.chkAssetFolder = true;
      this._messageService.SetAlertInfo('Folder created succesfully');
    } else {
      this._messageService.SetAlertWarning('Folder creation failed');
    }
  }

  deleteAssetFolder(assetfolder) {
    this._cmsService
      .deleteAssetFolder(assetfolder)
      .subscribe((result) => this.deleteAssetFolderReady(result));
  }

  deleteAssetFolderReady(answer) {
    if (answer == true) {
      this._messageService.SetAlertInfo('Folder deleted succesfully');
      this._cmsService.chkAssetFolder = false;
    } else {
      this._messageService.SetAlertWarning('Deleting failed');
    }
  }

  settab(tid) {
    if (tid == 'tab_2') {
      this._mediaService.setPage(0);
    }
    this._cmsService.tabEditCurrent = tid;
    var tabfield = document.getElementsByClassName('tabfield');
    if (tabfield.length > 0) {
      for (var i = 0; i < tabfield.length; i++) {
        tabfield[i].classList.add('hidden');
      }
    }
    var myButtonClasses = document.getElementById(tid);
    if (myButtonClasses) {
      myButtonClasses.classList.add('active');
      myButtonClasses.classList.remove('hidden');
    }
    //document.getElementById(tid).classList.remove('hidden');
    this._cmsService.resetDynamicTabs();
  }

  mediaLibShow() {
    document.getElementById('mediaAdd').classList.remove('hidden');
  }

  recall() {
    const recallz = this;
    this.getFFmpegLog();
    console.log('recall?');
    setTimeout(recallz.recall, 1000);
  }

  faststart(page) {
    this._messageService.SetAlertInfo('Starting faststart ' + page.title);
    this.getFFmpegLog();
    this._cmsService
      .faststart(page)
      .subscribe((res) => this.convertfaststartReady(res));
  }

  convertfaststartReady(res) {
    this._cmsService
      .getcms(this._cmsService.pageSelected._id)
      .subscribe((res) =>
        this.setFaststartSelect(this._cmsService.pageSelected)
      );
  }

  setFaststartSelect(res) {
    this.savelistPreReadyExtension(this._cmsService.pageSelected._id);
    this._messageService.SetAlertInfo(
      'Movie ' + this._cmsService.pageSelected.title + ' faststart and updated'
    );
  }

  savelistPreReady(thisId: string, field: string) {
    this._cmsService
      .getcms(thisId)
      .subscribe((res) => this.savelistReady(res, field));
  }

  savelistReady(page: Page, field: string) {
    if (page._id == this._cmsService.pageSelected._id) {
      this._cmsService.setPageSelected(page);
    }
    this._cmsService.resetParentCmsSubPages(page, field);
  }

  convertMovie(page) {
    this.sysreporter();
    if (
      page.schemaextend[0].videocodec != 'hevc' &&
      page.schemaextend[0].videocodec != 'h265'
    ) {
      this._messageService.SetAlertInfo(
        'Start converting ' + this._cmsService.pageSelected.title
      );
      this._cmsService
        .convertMovie(page)
        .subscribe((res) => this.convertMovieReady(res));
    } else {
      this._messageService.SetAlertInfo('Video already h265');
    }
    //let dhis = this;
    //setTimeout(function(){
    //  dhis.sysreporter();
    //}, 2000);
  }

  convertAudio(page) {
    this.sysreporter();
    this._messageService.SetAlertInfo(
      'Start converting audio ' + this._cmsService.pageSelected.title
    );
    this._cmsService
      .convertAudio(page)
      .subscribe((res) => this.convertAudioReady(res));
  }

  autoCrop(page) {
    this.sysreporter();
    this._messageService.SetAlertInfo(
      'Start cropping ' + this._cmsService.pageSelected.title
    );
    this._cmsService
      .autoCrop(page, this._cmsService.pageSelected._id)
      .subscribe((res) => this.autoCropReady(res));
  }

  autoCropReady(res) {
    this._messageService.SetAlertInfo('Video cropped succesfully');
    this._cmsService
      .getMovieInfo(this._cmsService.pageSelected)
      .subscribe((res) => this.getMovieInfoReady(res));
  }

  convertAudioReady(res) {
    this._messageService.SetAlertInfo('Audio converted succesfully');
    //this._cmsService.setPageSelected(this._cmsService.pageSelected);
    document.getElementById('mainmov_file').setAttribute('src', '');
    this._cmsService
      .getMovieInfo(this._cmsService.pageSelected)
      .subscribe((res) => this.getMovieInfoReady(res));

    document
      .getElementById('mainmov_file')
      .setAttribute(
        'src',
        '/api/assets/content/' + this._cmsService.pageSelected._id + '/main.mp4'
      );
    //this._cmsService.getMovieInfo(this._cmsService.pageSelected).subscribe(res => this.getMovieInfoReady(res));
  }

  getMovieInfo() {
    this._cmsService
      .getMovieInfo(this._cmsService.pageSelected)
      .subscribe((res) => this.getMovieInfoReady(res));
  }

  convertMovieReady(res) {
    this._cmsService
      .getMovieInfo(this._cmsService.pageSelected)
      .subscribe((res) => this.getMovieInfoReady(res));
  }

  getMovieInfoReady(res) {
    this._messageService.SetAlertInfo(
      'Movie ' + this._cmsService.pageSelected.title + ' converted and updated'
    );
    this._cmsService
      .getcms(this._cmsService.pageSelected._id)
      .subscribe((res) => this.setPageInfoSelect(res));
  }

  lengtFromMovie() {
    let video = <HTMLVideoElement>document.getElementById('mainmov_file');
    this._cmsService.pageSelected.schemaextend[0].length = video.duration;
    this._cmsService.setPageSelected(this._cmsService.pageSelected);
    this._cmsService.updatePage(this._cmsService.pageSelected).subscribe();
    this._messageService.SetAlertInfo(
      'Movie ' + this._cmsService.pageSelected.title + ' duration updated'
    );
    //this._cmsService.lengthFromMovie(this._cmsService.pageSelected).subscribe(res => console.log(res));
  }

  // durationReady(res) {
  //     this._cmsService.setPageSelected(res);
  //     this._messageService.SetAlertSuccess('Movie time updated');
  // }

  setPageInfoSelect(res) {
    this._cmsService.setPageSelected(res);
    this._cmsService.resetParentCmsSubPage(res);
    this._messageService.SetAlertInfo(
      'Movie ' + this._cmsService.pageSelected.title + ' updated'
    );
  }

  setPageSelect(res) {
    this._cmsService.setPageSelected(res);
    this._messageService.SetAlertInfo(
      'Movie ' + this._cmsService.pageSelected.title + ' converted and updated'
    );
  }

  getVideoTimeFromLog() {
    const xhr = new XMLHttpRequest();
    var mainc = this;
    xhr.open('GET', 'http://77.171.83.149:3001/assets/ffmpeg/log.txt', true);
    xhr.onload = function () {
      if (this.status == 200) {
        //var ready = this.responseText.split('encoded ');
        //if(ready.length > 1) {
        //  document.getElementById('ffmpeg_log_res').innerHTML = '100%';
        //} else {
        var duration;
        var totalSeconds;
        var pdur;

        var preduration = this.responseText.split('Duration: ');
        if (preduration.length > 0) {
          pdur = preduration[1].split(', ');
          duration = pdur[0];

          var a = duration.split(':');
          if (a.length > 1) {
            var u = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
            totalSeconds = u | 0;
            mainc._cmsService.videoLength = totalSeconds;
            //console.log(totalSeconds);
          }
        }
        //}
      }
    };
    xhr.send();
  }

  sysreporter() {
    //document.getElementById('selectedListStatus').innerHTML == '';
    //console.log('sysreporter');
    this._cmsService.totalscan = 0;
    if (this._cmsService.convertedMovies.length > 0) {
      for (var i = 0; i < this._cmsService.convertedMovies.length; i++) {
        this._cmsService.totalscan++;
      }
    }
    //var length = (Math.ceil(this._cmsService.pageSelected.schemaextend[0].length)+100);
    var length = parseInt(this._cmsService.pageSelected.schemaextend[0].length);
    this.getVideoTimeFromLog();
    //let tmp = this.getVideoTimeFromLog();
    let dhis = this;
    setTimeout(function () {
      let length: number = dhis._cmsService.videoLength;
      //console.log(length);
      if (length > 0) {
        var i = 1;
        var progress = dhis.progress;
        while (i < length && progress <= 100) {
          setTimeout(dhis.getFFmpegLog, i * 2000);
          i++;
        }
      }
    }, 4000);
  }

  getFFmpegLog() {
    //console.log('getFFmpegLog');
    const xhr = new XMLHttpRequest();
    var mainc = this;
    //let count = this._cmsService.convertcount;
    //let total = this._cmsService.totalscan;
    xhr.open('GET', 'http://77.171.83.149:3001/assets/ffmpeg/log.txt', true);
    //let length = (<HTMLInputElement>document.getElementById('length')).value;
    xhr.onload = function () {
      if (this.status == 200) {
        var ready = this.responseText.split('encoded ');
        if (ready.length > 1) {
          document.getElementById('ffmpeg_log_res').innerHTML = '100%';
        } else {
          var lines;
          var last_line1;
          var last_line;
          var pdur;
          var duration;
          var totalSeconds;
          var secondspast;
          var restseconds;
          var resttime;

          var preduration = this.responseText.split('Duration: ');
          if (preduration.length > 0) {
            pdur = preduration[1].split(', ');
            duration = pdur[0];

            var a = duration.split(':');
            if (a.length > 1) {
              var u = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
              totalSeconds = u | 0;
            }
          }

          lines = this.responseText.split('frame=');
          last_line1 = lines[lines.length - 1];

          lines = last_line1.split('time=');
          last_line = lines[lines.length - 1];

          lines = last_line.split(' bitrate=');

          if (duration != '') {
            var c = lines[0].split(':');
            var x = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
            secondspast = x | 0;

            restseconds = totalSeconds - secondspast;
            //console.log(totalSeconds + '-' + secondspast + '=' + restseconds);

            var d = Number(restseconds);
            var h = Math.floor(d / 3600);
            var m = Math.floor((d % 3600) / 60);
            var s = Math.floor((d % 3600) % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? '' : '') : '0';
            var mDisplay = m > 0 ? m + (m == 1 ? '' : '') : '0';
            var sDisplay = s > 0 ? s + (s == 1 ? '' : '') : '0';

            if (
              hDisplay == '0' ||
              hDisplay == '1' ||
              hDisplay == '2' ||
              hDisplay == '3' ||
              hDisplay == '4' ||
              hDisplay == '5' ||
              hDisplay == '6' ||
              hDisplay == '7' ||
              hDisplay == '8' ||
              hDisplay == '9'
            ) {
              hDisplay = '0' + hDisplay;
            }

            if (
              mDisplay == '0' ||
              mDisplay == '1' ||
              mDisplay == '2' ||
              mDisplay == '3' ||
              mDisplay == '4' ||
              mDisplay == '5' ||
              mDisplay == '6' ||
              mDisplay == '7' ||
              mDisplay == '8' ||
              mDisplay == '9'
            ) {
              mDisplay = '0' + mDisplay;
            }
            if (s < 10 || sDisplay == '0') {
              sDisplay = '0' + sDisplay;
            }
            resttime = hDisplay + ':' + mDisplay + ':' + sDisplay;
          }

          var t1 = parseInt(totalSeconds);
          var t2 = lines[0];

          var b = t2.split(':');
          if (b.length > 1) t2 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

          var percentage = Math.round((parseInt(t2) / t1) * 100);
          mainc.progress = percentage;

          document.getElementById('ffmpeg_log_res').innerHTML =
            percentage + '%';
          //mainc._cmsService.listCheckboxInfo = 'Converting movie ' + (mainc._cmsService.convertedMovies.length+1) + ' of ' + mainc._cmsService.totalscan + ' at <b>' + percentage+'%</b>'+(resttime != '' ? ' | <b>'+resttime+'</b>' : '');
          //document.getElementById('selectedListStatus').innerHTML = mainc._cmsService.listCheckboxInfo;
          //if(mainc._cmsService.convertedMovies && mainc._cmsService.convertedMovies.length > 0) {
          document.getElementById('ajaxres').innerHTML =
            'Converting at <b>' +
            percentage +
            '%</b>' +
            (resttime != '' ? ' | <b>' + resttime + '</b>' : '');
          //} else {
          //  document.getElementById('ajaxres').innerHTML = 'Converting movie at <b>' + percentage+'%</b>'+(resttime != '' ? ' | <b>'+resttime+'</b>' : '');
          //}
        }
      }
    };
    xhr.send();
  }
}
