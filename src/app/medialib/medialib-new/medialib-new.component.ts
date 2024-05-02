import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserService } from './../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaService } from './../../services/media.service';
import { CmsService } from './../../services/cms.service';
import { MessageService } from './../../services/message.service';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-medialib-new',
  templateUrl: './medialib-new.component.html',
  styleUrls: ['./medialib-new.component.css'],
})
export class MedialibNewComponent {
  errors: Array<string> = [];
  dragAreaClass: string = 'dragarea';
  @Input() projectId: number = 0;
  @Input() sectionId: number = 0;
  @Input() fileExt: string = 'JPG, GIF, PNG, MP4';
  @Input() maxFiles: number = 5;
  @Input() maxSize: number = 100; // 5MB
  @Input() pageForm;
  @ViewChild('file') file;
  filesToUpload: Array<File> = [];
  newMedia: any;

  newIds: Array<any> = [];
  @Output() getMediaList = new EventEmitter();

  constructor(
    private sanitizer: DomSanitizer,
    private _cmsService: CmsService,
    private _userService: UserService,
    private _mediaService: MediaService,
    public _messageService: MessageService
  ) {}

  get filesToUploadInfo(): FormArray {
    return this.pageForm.get('filesToUploadInfo') as FormArray;
  }

  humanfilesize(size, unit, decimals) {
    if (size > 1024000000 && decimals > 0)
      return (size / 1024000000).toFixed(decimals) + ' GB';
    if ((!unit && size > 1024000000) || unit == 'GB')
      return (size / 1024000000).toFixed(0) + ' GB';
    if (!unit && size > 1024000 && decimals > 0)
      return (size / 1024000).toFixed(decimals) + ' MB';
    if ((!unit && size > 1024000) || unit == 'MB')
      return (size / 1024000).toFixed(2) + ' MB';
    if ((!unit && size < 1024000) || unit == 'KB')
      return (size / 1024).toFixed(0) + ' KB';
    if ((!unit && size < 1024) || unit == 'B')
      return size.toFixed(0) + ' bytes';
    return size + ' bytes';
  }

  newMediaIdReturn(media) {}

  refreshImages(status) {
    if (status == true) {
      console.log('Uploaded successfully!');
    }
  }

  media_fav() {}

  getVideoDimensionsOf(url, callback) {
    let video = document.createElement('video');
    video.src = url;
    video.addEventListener('loadedmetadata', function () {
      let height = this.videoHeight;
      let width = this.videoWidth;
      var res = width + 'x' + height;
      callback(res);
    });
  }

  delete_upload_file(j) {
    console.log(j);
    this.hideUploadButton();
  }

  toggleDiv(elema) {
    var test = document.getElementById(elema);
    if (test.classList.contains('hidden')) {
      test.className = '';
    } else {
      test.className = 'hidden';
    }
  }

  compileProvider(compile) {
    var newvar = compile.imgSrcSanitizationWhitelist(
      /^\s*(http?|local|blob|data|file|chrome-extension):/
    );
    return newvar;
  }

  fileCheck(fileInput: any) {
    var userImageContents = '';
    document.getElementById('userImageContents').innerHTML = '';

    let fi = this.file.nativeElement;
    if (fi.files) {
      document.getElementById('startUploadButton').classList.remove('hidden');
      this.filesToUpload = <Array<File>>fileInput.target.files;
      this.isValidFileExtension(this.filesToUpload);
      this.isValidFiles(this.filesToUpload);
      this.isValidFileSize(this.filesToUpload);
      if (this.filesToUpload.length > 0) {
        for (let i = 0; i < fi.files.length; i++) {
          var file = fi.files[i];
          var url = window.URL.createObjectURL(file);

          var extension = file.name.replace(/^.*\./, '');
          var size = this.humanfilesize(file.size, '', 0);
          var fname = file.name.replace(/\.[^/.]+$/, '');
          userImageContents =
            document.getElementById('userImageContents').innerHTML;

          if (extension == 'jpg' || extension == 'gif' || extension == 'png') {
            var img = new Image();
            img.src = url;
            document.getElementById('userImageContents').innerHTML +=
              '<div><img class="uploadPic" id="idpic_' +
              i +
              '" src="' +
              url +
              '" alt="' +
              fname +
              '" /><br /><div>Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '<br />Resolution:<span id="res' +
              i +
              '"></span></div></div>';
            img.onload = function () {
              var bdimg = document.getElementById('idpic_' + i);
              var width = bdimg.clientWidth;
              var height = bdimg.clientHeight;
              document.getElementById('res' + i).innerHTML =
                width + ' x ' + height;
              document.getElementById('res' + i).setAttribute('width', '120');
            };
          } else if (extension == 'mp4') {
            this.showUploadButton();
            var playername = 'player_' + i;
            var req = this.filesToUploadInfo;
            var ssanitizer = this.sanitizer;
            var rez = this.getVideoDimensionsOf(url, function (resolution) {
              let sanitizedUrl = ssanitizer.bypassSecurityTrustUrl(url);
              /* req[i] = {
                              url: sanitizedUrl,
                              extension: extension,
                              size: size,
                              fname: fname,
                              resolution: resolution
                          }; */
            });
            document.getElementById('userImageContents').innerHTML +=
              '<div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div>';
          } else if (extension == 'mpg') {
            document.getElementById('userImageContents').innerHTML +=
              '<div><img id="idpic_' +
              i +
              '" src="/api/images/filetypeicons/mpg.png" alt="txt file" /><br /><div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div></div>';
          } else if (extension == 'avi') {
            document.getElementById('userImageContents').innerHTML +=
              '<div><img id="idpic_' +
              i +
              '" src="/api/images/filetypeicons/avi.png" alt="txt file" /><br /><div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div></div>';
          } else if (extension == 'wmv') {
            document.getElementById('userImageContents').innerHTML +=
              '<div><img id="idpic_' +
              i +
              '" src="/api/images/filetypeicons/wmv.png" alt="txt file" /><br /><div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div></div>';
          } else if (extension == 'mkv') {
            document.getElementById('userImageContents').innerHTML +=
              '<div><img id="idpic_' +
              i +
              '" src="/api/images/filetypeicons/mkv.png" alt="txt file" /><br /><div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div></div>';
          } else if (extension == 'txt') {
            document.getElementById('userImageContents').innerHTML +=
              '<div><img id="idpic_' +
              i +
              '" src="/api/images/filetypeicons/txt.png" alt="txt file" /><br /><div class="padding_10">Filename: ' +
              fname +
              '.' +
              extension +
              '<br />Filesize: ' +
              size +
              '</div></div>';
          }
        }
        this.showUploadButton();
      } else {
        //this.hideUploadButton();
      }
    } else {
      document.getElementById('userImageContents').innerHTML = '';
      this.hideUploadButton();
    }
  }

  showUploadButton() {
    document.getElementById('startUploadButton').classList.remove('hidden');
    document
      .getElementById('startUploadButton')
      .setAttribute('class', 'btn btn-primary');
  }

  hideUploadButton() {
    document
      .getElementById('startUploadButton')
      .setAttribute('class', 'hidden');
  }

  upload_images() {
    this.hideUploadButton();
    this.saveFiles();
  }

  saveFiles() {
    // console.log('this.saveFiles');
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      formData.append('uploads[]', files[i], files[i]['name']);
    }
    formData.append('user', this._userService.user_current._id);
    //formData.append("user_id", this._userService.user_current._id);
    //console.log(formData);
    this._mediaService
      .upload(formData)
      .subscribe((res) => this.saveFilesReady(res));
    document.getElementById('userImageContents').innerHTML = '';
    this._messageService.SetAlertSuccess('File uploaded');
    //this.toggleDiv('tab_1');
  }

  saveFilesReady(res) {
    //console.log(res);
    //if(res == true) {
    this._mediaService.images.push(res);
    this._mediaService.setPage(this._mediaService.pager.currentPage);
    //this._mediaService.getImageDData();
    //}
  }

  upload_ready(media) {
    this.getMediaList.emit(media);
  }

  getImageData() {
    this._mediaService.getImages().subscribe((data) => (this.newMedia = data));
  }

  private isValidFiles(files) {
    if (files.length > this.maxFiles) {
      this.errors.push(
        'Error: At a time you can upload only ' + this.maxFiles + ' files'
      );
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  private isValidFileExtension(files) {
    var extensions = this.fileExt.split(',').map(function (x) {
      return x.toLocaleUpperCase().trim();
    });

    for (var i = 0; i < files.length; i++) {
      var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      var exists = extensions.includes(ext);
      if (!exists) {
        this.errors.push('Error invalid extension : ' + files[i].name);
      }
      this.isValidFileSize(files[i]);
    }
  }

  private isValidFileSize(file) {
    var fileSizeinMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeinMB * 100) / 100;
    if (size > this.maxSize)
      this.errors.push(
        'Error (File Size): ' +
          file.name +
          ': exceed file size limit of ' +
          this.maxSize +
          'MB ( ' +
          size +
          'MB )'
      );
  }
}
