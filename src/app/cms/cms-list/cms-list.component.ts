import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { Page } from './../../../models/page';
import { CmsObject } from './../../../models/object';

@Component({
  selector: 'app-cms-list',
  templateUrl: './cms-list.component.html',
  styleUrls: ['./cms-list.component.css']
})

export class CmsListComponent {
    @Input() subpages;
    @Input() page;
    newPage: Page = new Page();
    @Output() editPageEvent = new EventEmitter();
    @Output() createNewPageEvent = new EventEmitter();
    @Output() newPageEvent = new EventEmitter();
    @Input() userlogin;

    toggleHidden = true;
    parent = "5a111233aaa94d061a93e719";
    sparent = "5a111233aaa94d061a93e719";
    current_row = 1;
    current_rowID;

    newsave: CmsObject;
    filesToUploadInfo: Array<{ url: any, fname: string, size: string, extension: string, resolution: any }> = [];
    @ViewChild("file") file;
    filesToUpload: Array<File> = [];
    errors: Array<string> = [];
    fileExt: string = "JPG, GIF, PNG";
    maxFiles: number = 5;
    maxSize: number = 5;
    clickedRow;
    value = 0;

    constructor(
        public _cmsService: CmsService,
        public _userService: UserService,
    ) { }

    onClicc(event) {
        var tazbfield = document.getElementsByClassName('trow');
        for (var i = 0; i < tazbfield.length; i++) {
            tazbfield[i].classList.remove('active');
        }
    }
    
    private isValidFileExtension(files) {
        var extensions = (this.fileExt.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });

        for (var i = 0; i < files.length; i++) {
            var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            var exists = extensions.includes(ext);
            if (!exists) {
                this.errors.push("Error (Extension): " + files[i].name);
            }
            this.isValidFileSize(files[i]);
        }
    }

    checkbuttons(page) {
        var element = document.getElementsByClassName('btnsaveCms');
        for (var i = 0; i < element.length; i++) {
            element[i].classList.remove('hidden');
        }
        var element = document.getElementsByClassName('btnsaveCmsNew');
        for (var i = 0; i < element.length; i++) {
            element[i].classList.add('hidden');
        }
        var ccell = document.getElementById('rowcell_' + page._id);
        if (ccell.getAttribute('class') == "icon icmn-arrow-right5") {
            ccell.setAttribute('class', 'icon icmn-arrow-down5');
        } else {
            ccell.setAttribute('class', 'icon icmn-arrow-right5');
        }
    }

    deleteList() {
      var tabfield = document.getElementsByClassName('checkboxes');
      for (var i = 0; i < tabfield.length; i++) {
        if ((<HTMLInputElement>tabfield[i]).checked == true) {
          var thisId = tabfield[i].getAttribute('id');
          this._cmsService.deletAssetFolderItem('content', thisId.replace('chk_', ''));
          this._cmsService.destroyPageById(thisId.replace('chk_', ''))
        }
      }
    }

    settab(tid) {
        this.clickedRow = tid;
        var tabfield = document.getElementsByClassName('tabfield ');
        for (var i = 0; i < tabfield.length; i++) {
            tabfield[i].classList.add('hidden');
        }
        var myButtonClasses = document.getElementById(tid).classList;
        myButtonClasses.add('active');
        myButtonClasses.remove('hidden');
    }
   
    private isValidFiles(files) {
        if (files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileSize(file) {
        var fileSizeinMB = file.size / (1024 * 1000);
        var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize)
            this.errors.push("Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )");
    }

    humanfilesize(size, unit, decimals) {
        if (size > 1024000000 && decimals > 0)
            return (size / 1024000000).toFixed(decimals) + " GB";
        if ((!unit && size > 1024000000) || unit == "GB")
            return (size / 1024000000).toFixed(0) + " GB";
        if ((!unit && size > 1024000) && decimals > 0)
            return (size / 1024000).toFixed(decimals) + " MB";
        if (!unit && size > 1024000 || unit == "MB")
            return (size / 1024000).toFixed(2) + " MB";
        if (!unit && size < 1024000 || unit == "KB")
            return (size / 1024).toFixed(0) + " KB";
        if (!unit && size < 1024 || unit == "B")
            return (size).toFixed(0) + " bytes";
        return (size) + " bytes";
    }
    
  checkDeleteButton(page) {
      var element = document.getElementsByClassName('btndeletePage');
      if (page.secure == true) {
          for (var i = 0; i < element.length; i++) {
              element[i].classList.add('hidden');
          }
      } else {
          for (var i = 0; i < element.length; i++) {
              element[i].classList.remove('hidden');
          }
      }
  }
   
  toggle_new_cms() {
    if (this._userService.getUserLoggedIn() == false) {
          this.newPage.parent = this._cmsService.pageSelected._id;
          this.newPage.treelevel = (this._cmsService.pageSelected.treelevel + 1);
          
          this._cmsService.setPageSelected(this.newPage);
          this.editPageEvent.emit(this._cmsService.pageSelected);
      }
    }
}
