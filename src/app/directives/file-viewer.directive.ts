import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { Files } from './../../models/bots/Files';
import { Media } from './../../models/media';
import { CmsService } from './../services/cms.service';

@Directive({
  selector: '[fileViewer]',
})
export class FileViewertDirective implements OnInit {
  @Input() fileSpecs: Media;
  dataObject;
  objectProps;

  constructor(private elRef: ElementRef, private _cmsService: CmsService) {}

  imageArray = ['jpg', 'gif', 'png'];
  movieArray = ['mp4', 'mkv', 'mpg', 'avi', 'wmv'];

  ngOnInit() {
    if (this.imageArray.indexOf(this.fileSpecs.extension) != -1) {
      this.printImageThumb();
    } else if (this.movieArray.indexOf(this.fileSpecs.extension) != -1) {
      this.printFilmThumb();
    } else {
      this.printOtherThumb();
    }
  }

  printOtherThumb() {
    var img = new Image(); // width, height values are optional params
    var url = '/api/images/filetypeicons/' + this.fileSpecs.extension + '.png';
    img.src = url;

    var node = document.createElement('h4');
    var textnode = document.createTextNode(
      this.fileSpecs.filename + '.' + this.fileSpecs.extension
    );
    node.appendChild(textnode);
    this.elRef.nativeElement.appendChild(img);
    this.elRef.nativeElement.appendChild(node);
  }

  printFilmThumb() {
    //console.log('print film thumb');
    if (this.fileSpecs._id != null) {
      var video = document.createElement('video');
      var url = '/api/assets/film/' + this.fileSpecs._id;
      video.src = url;
      video.controls = true;
      var node = document.createElement('div');
      var fsiz = document.createElement('div');
      var fsiznode = document.createTextNode(
        'Filesize: ' + this.humanfilesize(this.fileSpecs.filesize, '', 0)
      );
      var textnode = document.createTextNode(
        'Filename: ' + this.fileSpecs.filename + '.' + this.fileSpecs.extension
      );
      fsiz.appendChild(fsiznode);
      node.appendChild(textnode);
      this.elRef.nativeElement.appendChild(video);
      this.elRef.nativeElement.appendChild(node);
      this.elRef.nativeElement.appendChild(fsiz);

      for (var a = 0; a < this._cmsService.SystemLists.length; a++) {
        var catName = this._cmsService.SystemLists[a].title;
        if (
          this.fileSpecs.schemaextend[0][catName] != undefined &&
          this.fileSpecs.schemaextend[0][catName].length > 0
        ) {
          var fcat = document.createElement('div');
          var relea = '';
          fcat.setAttribute('id', 'clip_' + catName + '_' + this.fileSpecs._id);
          var tmpb = this.fileSpecs.schemaextend[0][catName] + '';
          var strs: any;
          if (this.fileSpecs.schemaextend[0][catName].length > 1) {
            var releab = tmpb.split(',');
            for (var s = 0; s < releab.length; s++) {
              strs = releab[s].trim();
              var sts = this._cmsService.SystemLists[a].cmsSubPages;
              var n = sts.findIndex((x) => x._id === strs);
              if (n != -1) {
                relea +=
                  this._cmsService.SystemLists[a].cmsSubPages[n].title + ', ';
              }
            }
          } else {
            var sts = this._cmsService.SystemLists[a].cmsSubPages;
            var n = sts.findIndex((x) => x._id === tmpb);
            relea += this._cmsService.SystemLists[a].cmsSubPages[n].title + '';
          }
          var fcatnode = document.createTextNode(catName + ': ' + relea);
          fcat.appendChild(fcatnode);
          this.elRef.nativeElement.appendChild(fcat);
        }
      }
    }
  }

  printImageThumb() {
    var img = new Image(); // width, height values are optional params
    var url = '/api/assets/media/' + this.fileSpecs._id;
    img.src = url;

    var node = document.createElement('h4');
    var textnode = document.createTextNode(
      this.fileSpecs.filename + '.' + this.fileSpecs.extension
    );
    node.appendChild(textnode);
    this.elRef.nativeElement.appendChild(img);
    this.elRef.nativeElement.appendChild(node);
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
}
