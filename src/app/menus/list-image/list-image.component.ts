import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from './../../services/user.service';
import { CmsService } from './../../services/cms.service';
import { Page } from './../../../models/page';
import { MessageService } from './../../services/message.service';

@Component({
  selector: 'app-menu-listimage',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.css'],
})
export class menusListImage implements OnInit {
  newPage: Page = new Page();
  @Output() editPageEvent = new EventEmitter();
  progress: number = 0;
  filescount: number = 0;
  pageSelectedUpdated = new EventEmitter<Page>();
  fileschecked = 0;

  constructor(
    public _cmsService: CmsService,
    public _userService: UserService,
    public _messageService: MessageService
  ) {}

  ngOnInit() {}

  toggleListAutoImage() {
    if (this._cmsService.listAutoImage == false) {
      this._cmsService.listAutoImage = true;
    } else {
      this._cmsService.listAutoImage = false;
    }
  }

  toggle_new_cms() {
    if (this._userService.getUserLoggedIn() == true) {
      if (this._cmsService.pageSelected.title == 'Root') {
        this._messageService.SetAlertWarning('Root is secured');
      } else {
        this._messageService.SetAlertWarning('Create new child');
        var newpage = Object.create(this._cmsService.pageSelected);
        newpage.schemaextend = this._cmsService.pageSelected.schemaextend;
        newpage.parent = this._cmsService.pageSelected._id;
        newpage._id = '';
        newpage.title = '';
        newpage.kids = 0;
        newpage.listItem = false;
        newpage.secure = false;
        newpage.visible = true;
        newpage.hits = 0;
        newpage.treelevel = this._cmsService.pageSelected.treelevel + 1;
        newpage.objectType = this._cmsService.pageSelected.objectType;
        if (this._userService.getUserLoggedIn() == true)
          newpage.createdBy = this._userService.user_current._id;

        this._cmsService.setPageSelected2(newpage);
        (<HTMLInputElement>document.getElementById('_id')).value = '';
        (<HTMLInputElement>document.getElementById('title')).value =
          this._cmsService.pageSelected.title;
        (<HTMLInputElement>document.getElementById('parent')).value =
          newpage.parent;
      }
    } else {
      this._messageService.SetAlertInfo('Please log in');
    }
  }

  readyPro(page, parent) {
    this._cmsService.pageredd(page);
    this.editPageEvent.emit(page);
  }

  toggleDiv(divId) {
    var table = document.getElementById(divId);
    if (document.getElementById('index').style.width != '100%') {
      document.getElementById('fieldRight').style.display = 'none';
      document.getElementById('index').style.width = '100%';
    } else {
      document.getElementById('fieldRight').style.display = 'block';
      document.getElementById('index').style.width = '36%';
    }
  }

  saveList() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var parent = (<HTMLInputElement>document.getElementById('saveParent'))
          .value;
        if (parent != '') {
          this._cmsService
            .getcms(thisId)
            .subscribe((res) => this.cutFromParent(res, parent));
          // (res) => this.saveListReady(thisId, parent)
        } else {
          console.log('Select parent');
        }
      }
    }
    this._messageService.SetAlertInfo('Parent modified for selected items');
  }

  saveListReady(id, parent) {
    this._cmsService
      .getcms(id)
      .subscribe((res) => this.cutFromParent(res, parent));
  }

  contextReady(context, page, parent) {
    //console.log(res);
    //console.log(this._cmsService.treelevelfile);
    let indexOriFile;
    let indexC;

    let indexB = this._cmsService.pages[0].cmsSubPages.findIndex(
      (res) => res._id == page.parent
    );

    if (indexB != -1) {
      //this._cmsService.pages[0].cmsSubPages[indexB].cmsSubPages.slice();
      //console.log(this._cmsService.pages[0].cmsSubPages[indexB].title);
    }

    console.log('verwijderen');
    this._cmsService.pages[0].cmsSubPages.forEach((element, index) => {
      if (element._id == page.parent) {
        indexOriFile = this._cmsService.pages[0].cmsSubPages[
          indexB
        ].cmsSubPages.findIndex((res) => res._id == page._id);
        if (indexOriFile != -1) {
          this._cmsService.pages[0].cmsSubPages[indexB].cmsSubPages.splice(
            indexOriFile,
            1
          );
        }
      } else if (element._id == context[1]._id) {
        this._cmsService.pages[0].cmsSubPages[index].cmsSubPages.forEach(
          (element2, index2) => {
            if (element2._id == context[2]._id) {
              if (element2._id == page.parent) {
                indexOriFile = this._cmsService.pages[0].cmsSubPages[
                  index
                ].cmsSubPages[index2].cmsSubPages.findIndex(
                  (res) => res._id == page._id
                );

                this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                  index2
                ].cmsSubPages.splice(indexOriFile, 1);
              }
              this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                index2
              ].cmsSubPages.forEach((element3, index3) => {
                if (element3._id == page.parent) {
                  indexOriFile = this._cmsService.pages[0].cmsSubPages[
                    index
                  ].cmsSubPages[index2].cmsSubPages[
                    index3
                  ].cmsSubPages.findIndex((res) => res._id == page._id);
                  this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                    index2
                  ].cmsSubPages[index3].cmsSubPages.splice(indexOriFile, 1);
                } else if (element3._id == context[3]._id) {
                  if (
                    this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                      index2
                    ].cmsSubPages[index3].cmsSubPages
                  ) {
                    this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                      index2
                    ].cmsSubPages[index3].cmsSubPages.forEach(
                      (element4, index4) => {
                        if (element4._id == page.parent) {
                          if (
                            this._cmsService.pages[0].cmsSubPages[index]
                              .cmsSubPages[index2].cmsSubPages[index3]
                              .cmsSubPages[index4].cmsSubPages
                          ) {
                            indexOriFile =
                              this._cmsService.pages[0].cmsSubPages[
                                index
                              ].cmsSubPages[index2].cmsSubPages[
                                index3
                              ].cmsSubPages[index4].cmsSubPages.findIndex(
                                (res) => res._id == page._id
                              );
                            this._cmsService.pages[0].cmsSubPages[
                              index
                            ].cmsSubPages[index2].cmsSubPages[
                              index3
                            ].cmsSubPages[index4].cmsSubPages.splice(
                              indexOriFile,
                              1
                            );
                          }
                        }
                      }
                    );
                  }
                }
              });
            }
          }
        );
      }
    });

    this._cmsService.updateParent(page._id, parent).subscribe();
    this._cmsService.incrementKid(parent).subscribe();

    this._cmsService.pages[0].cmsSubPages.forEach((element, index) => {
      if (element._id == parent) {
        if (this._cmsService.pages[0].cmsSubPages[index].cmsSubPages)
          this._cmsService.pages[0].cmsSubPages[index].cmsSubPages.unshift(
            page
          );
      } else if (this._cmsService.pages[0].cmsSubPages[index].cmsSubPages) {
        this._cmsService.pages[0].cmsSubPages[index].cmsSubPages.forEach(
          (element2, index2) => {
            if (element2._id == parent) {
              if (
                this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[index2]
                  .cmsSubPages
              ) {
                this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                  index2
                ].cmsSubPages.unshift(page);
              }
            } else {
              if (
                this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[index2]
                  .cmsSubPages
              ) {
                this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                  index2
                ].cmsSubPages.forEach((element3, index3) => {
                  if (element3._id == parent) {
                    if (
                      this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                        index2
                      ].cmsSubPages[index3].cmsSubPages
                    ) {
                      this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                        index2
                      ].cmsSubPages[index3].cmsSubPages.unshift(page);
                    }
                  } else {
                    if (
                      this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                        index2
                      ].cmsSubPages[index3].cmsSubPages
                    ) {
                      this._cmsService.pages[0].cmsSubPages[index].cmsSubPages[
                        index2
                      ].cmsSubPages[index3].cmsSubPages.forEach(
                        (element4, index4) => {
                          if (element4._id == parent) {
                            if (
                              this._cmsService.pages[0].cmsSubPages[index]
                                .cmsSubPages[index2].cmsSubPages[index3]
                                .cmsSubPages[index4].cmsSubPages
                            ) {
                              this._cmsService.pages[0].cmsSubPages[
                                index
                              ].cmsSubPages[index2].cmsSubPages[
                                index3
                              ].cmsSubPages[index4].cmsSubPages.unshift(page);
                            }
                          }
                        }
                      );
                    }
                  }
                });
              }
            }
          }
        );
      }
    });
    //console.log(indexB + ' ' + indexC + ' ' + indexOriFile);
  }

  cutFromParent(page: Page, parent: string) {
    //this._cmsService.tcontext(page);
    this._cmsService
      .getcontext(page)
      .subscribe((res) => this.contextReady(res, page, parent));

    //console.log(this._cmsService.pages[0].cmsSubPages[indexB].cmsSubPages);
  }

  saveListmusicgenre() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        let thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        let parent = (<HTMLInputElement>(
          document.getElementById('musicGenreParent')
        )).value;
        if (parent != '') {
          this._cmsService
            .updateMusicGenre(thisId, parent)
            .subscribe(() => this.savelistPreReadyExtension(thisId));
        } else {
          console.log('Select music genre');
        }
      }
    }
    this._messageService.SetAlertInfo(
      'Music genre inserted for selected items'
    );
  }

  savelistPreReady(thisId: string, field: string) {
    this._cmsService
      .getcms(thisId)
      .subscribe((res) => this.savelistReady(res, field));
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
  }

  savelistReady(page: Page, field: string) {
    if (page._id == this._cmsService.pageSelected._id) {
      this._cmsService.setPageSelected(page);
    }
    this._cmsService.resetParentCmsSubPages(page, field);
  }

  saveListtreelevels() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        let thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        let parent = (<HTMLInputElement>(
          document.getElementById('treelevelParent')
        )).value;
        if (parent != '') {
          this._cmsService
            .updateTreelevel(thisId, parent)
            .subscribe(() => this.savelistPreReady(thisId, 'treelevel'));
        } else {
          console.log('treelevelParent not found');
        }
      }
    }
    this._messageService.SetAlertInfo('Treelevel modified for selected items');
  }

  selectOnlyJpg() {
    var tabfield = document.getElementsByClassName('chklevelE');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('jpg') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
    var tabfield = document.getElementsByClassName('chklevelF');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('jpg') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
    var tabfield = document.getElementsByClassName('chklevelG');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('jpg') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
  }

  selectOnlyMp4() {
    var tabfield = document.getElementsByClassName('chklevelE');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('mp4') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
    var tabfield = document.getElementsByClassName('chklevelF');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('mp4') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
    var tabfield = document.getElementsByClassName('chklevelG');
    for (var i = 0; i < tabfield.length; i++) {
      var thisTitle = tabfield[i].getAttribute('title');
      var thisId = tabfield[i].getAttribute('id');
      let preTitle = thisTitle.toLocaleLowerCase();
      if (
        preTitle.match('mp4') &&
        (<HTMLInputElement>tabfield[i]).checked == false
      ) {
        (<HTMLInputElement>tabfield[i]).checked = true;
      } else {
        (<HTMLInputElement>tabfield[i]).checked = false;
      }
      this._cmsService.listCheckboxCount(thisId);
    }
  }

  toggleLevel(chklevelA) {
    var tabfield = document.getElementsByClassName(chklevelA);
    for (var i = 0; i < tabfield.length; i++) {
      var id = tabfield[i].getAttribute('id').replace('chk_', '');
      var parent = tabfield[i].getAttribute('title');
      if (
        document.getElementById('chkpar' + id).classList.contains('hidden') ==
          false &&
        document
          .getElementById('rowul' + parent)
          .classList.contains('hidden') == false
      ) {
        if ((<HTMLInputElement>tabfield[i]).checked == true) {
          (<HTMLInputElement>tabfield[i]).checked = false;
          this._cmsService.listCheckboxCounter--;
        } else {
          (<HTMLInputElement>tabfield[i]).checked = true;
          this._cmsService.listCheckboxCounter++;
        }
        //this._cmsService.listCheckboxCount('chk_' + id);
      }
    }
  }

  saveListDeleteImage() {
    //console.log('saveListKids');
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id');
        //console.log(thisId.replace('chk_', ''));
        this._cmsService.saveListDeleteImage(thisId.replace('chk_', ''));
      }
    }
    this._messageService.SetAlertInfo('Images deleted for selected items');
  }

  saveListImagefromVIdeo() {
    var tabfield = document.getElementsByClassName('checkbox');
    var imgsec = (<HTMLInputElement>(
      document.getElementById('saveListImagefromVIdeo')
    )).value;
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService
          .createImageByIdSeconds(thisId, parseInt(imgsec))
          .subscribe((res) => this.savelistPreReady(thisId, 'image'));
      }
    }
    this._messageService.SetAlertInfo('Image created for selected items');
  }

  FetchMovies(page: Page) {
    if (
      this._cmsService.convertcount + 1 <
      this._cmsService.convertedMovies.length
    ) {
      this._cmsService.convertedMovies[this._cmsService.convertcount] = page;
      this._cmsService.convertcount++;
      let index = this._cmsService.conversionParents.findIndex(
        (e) => e === page.parent
      );
      if (index == -1) this._cmsService.conversionParents.push(page.parent);
      this.convertMovie(Math.round(page.schemaextend[0].length));
      this._cmsService.listCheckboxCounter--;
      //this._cmsService.resetParentCmsSubPagesExtension(page);
    } else {
      this._cmsService.listCheckboxCounter = 0;
      this._cmsService.convertedMovies[this._cmsService.convertcount] = page;
      this.fileschecked = 0;
      // this._cmsService.conversionParents.forEach((element) => {
      //   document
      //     .getElementById('rowli_' + element)
      //     .setAttribute('data-kids', 'off');
      //   document.getElementById('tabrowl_' + element).click();
      // });

      this._messageService.SetAlertInfo(
        'Finished converting ' +
          this._cmsService.convertedMovies.length +
          ' movie' +
          (this._cmsService.convertedMovies.length > 1 ? 's' : '')
      );
      this._cmsService.convertcount = 0;
    }
    var div = document.getElementById('chk_' + page._id);
    div.scrollIntoView();
    this._cmsService.resetParentCmsSubPagesExtension(page);
  }

  getMovieInfoAfterConvertReady(page: Page) {
    (<HTMLInputElement>document.getElementById('chk_' + page._id)).checked =
      false;
    this._cmsService.totalConversionTime =
      this._cmsService.totalConversionTime -
      Math.round(page.schemaextend[0].length);
    this.FetchMovies(page);
  }

  convertMovie(length: number) {
    this._messageService.SetAlertInfo(
      'Start converting ' +
        this._cmsService.convertedMovies[this._cmsService.convertcount].title +
        (this._cmsService.convertedMovies.length > 1
          ? ' movie ' +
            (this._cmsService.convertcount + 1) +
            ' of ' +
            this._cmsService.convertedMovies.length
          : '')
    );
    this._cmsService
      .convertMovie(
        this._cmsService.convertedMovies[this._cmsService.convertcount]
      )
      .subscribe((res) =>
        this.convertMovieReady(
          this._cmsService.convertedMovies[this._cmsService.convertcount]
        )
      );
    let dhis = this;
    setTimeout(function () {
      dhis.sysreporter(length, true);
    }, 1000);
  }

  convertMovieReady(page: Page) {
    this._cmsService
      .getMovieInfo(page)
      .subscribe((result) => this.getMovieInfoAfterConvertReady(result));
  }

  setMovieConverterBat() {
    var tabfield = document.getElementsByClassName('checkbox');
    this._cmsService.totalscan = 0;
    this._cmsService.convertcount = 0;
    this._cmsService.convertedMovies = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        this._cmsService.totalscan++;
      }
    }

    let b = 0;
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var id = (<HTMLInputElement>tabfield[i]).getAttribute('id');
        var thisId = id.replace('chk_', '');

        this._cmsService
          .getcms(thisId)
          .subscribe((result) => this.CodecCheck(result, b));
        b++;
      }
    }

    let dhis = this;
    this._messageService.SetAlertSuccess(
      'Start converting movies in few seconds. (Retrieving file info ...) '
    );
    setTimeout(function () {
      if (dhis._cmsService.convertedMovies.length > 0) {
        dhis._cmsService
          .createBat(
            'convert_to_265',
            dhis._cmsService.conversionCommands,
            dhis._cmsService.conversionIds
          )
          .subscribe((res) => dhis.createBatReady());
        dhis.sysreporter(dhis._cmsService.totalConversionTime, true);
      } else {
        dhis._messageService.SetAlertInfo(
          'No mp4 files or files already hevc.'
        );
      }
    }, this._cmsService.listCheckboxCounter * 1000 + 3000);
  }

  createBatReady() {
    this._messageService.SetAlertInfo('Finished converting movie(s) to hevc');
    this._cmsService.conversionParents.forEach((element) => {
      document
        .getElementById('rowli_' + element)
        .setAttribute('data-kids', 'off');
      document.getElementById('tabrowl_' + element).click();
    });
    this._cmsService.listCheckboxCounter = 0;
    this._cmsService.conversionCommands = '';
    this._cmsService.conversionIds = [];
    this._cmsService.conversionParents = [];
  }

  setMovieConverter() {
    var tabfield = document.getElementsByClassName('checkbox');
    this._cmsService.totalscan = 0;
    this._cmsService.convertcount = 0;
    this._cmsService.convertedMovies = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        this._cmsService.totalscan++;
      }
    }

    let b = 0;
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var id = (<HTMLInputElement>tabfield[i]).getAttribute('id');
        var thisId = id.replace('chk_', '');

        this._cmsService
          .getcms(thisId)
          .subscribe((result) => this.CodecCheck(result, b));
        b++;
      }
    }

    let dhis = this;
    this._messageService.SetAlertSuccess(
      'Start converting movies in few seconds. (Retrieving file info ...) '
    );
    setTimeout(function () {
      if (dhis._cmsService.convertedMovies.length > 0) {
        //dhis._cmsService.convertcount++;

        //console.log(commands);
        dhis.convertMovie(
          Math.round(dhis._cmsService.convertedMovies[0].schemaextend[0].length)
        );
      } else {
        dhis._messageService.SetAlertInfo(
          'No mp4 files or files already hevc.'
        );
      }
    }, this._cmsService.listCheckboxCounter * 1000 + 3000);
  }

  CodecCheck(result: Page, i: number) {
    let count = 1;
    if (
      result != undefined &&
      result.schemaextend &&
      result.schemaextend[0].videocodec != 'h265' &&
      result.schemaextend[0].videocodec != 'hevc' &&
      result.schemaextend[0].fileextension == 'mp4'
    ) {
      let index = this._cmsService.conversionParents.findIndex(
        (e) => e == result.parent
      );
      if (index - 1) {
        this._cmsService.conversionParents.push(result.parent);
      }
      this._cmsService.convertedMovies.push(result);
      this._cmsService.totalConversionTime =
        this._cmsService.totalConversionTime +
        Math.round(result.schemaextend[0].length);

      let thisId = result._id;
      let basePath = 'Y:\\Websites\\new.voormezelf\\assets\\';
      this._cmsService.conversionCommands +=
        '"D:\\ffmpeg\\bin\\ffmpeg.exe" -i ' +
        basePath +
        'content\\' +
        thisId +
        '\\main.mp4 -vcodec libx265 -preset:v medium -crf 27 -async 1 -c:a copy -y ' +
        basePath +
        'sys\\main_' +
        thisId +
        '.mp4 > ' +
        basePath +
        'ffmpeg\\log.txt 2>&1\r\n';

      this._cmsService.conversionCommands +=
        'if not exist ' +
        basePath +
        'converted\\' +
        thisId +
        '\\ md ' +
        basePath +
        'converted\\' +
        thisId +
        ' 2> nul\r\n' +
        'if exist ' +
        basePath +
        'content\\' +
        thisId +
        '\\main.mp4 move ' +
        basePath +
        'content\\' +
        thisId +
        '\\main.mp4 ' +
        basePath +
        'converted\\' +
        thisId +
        '\\' +
        'main.mp4 2> nul\r\n';

      this._cmsService.conversionCommands +=
        'if exist ' +
        basePath +
        'sys\\main_' +
        thisId +
        '.mp4 move ' +
        basePath +
        'sys\\main_' +
        thisId +
        '.mp4 ' +
        basePath +
        'content\\' +
        thisId +
        '\\main.mp4 2> nul\r\n'; //  > $null

      this._cmsService.conversionCommands +=
        'echo Finished movie ' +
        count +
        (this._cmsService.conversionParents.length > 0
          ? ' (' + this._cmsService.conversionParents.length + ' total)'
          : '') +
        '\r\n';
      count++;
      this._cmsService.conversionIds.push(thisId);

      this.fileschecked++;
    } else {
      this._messageService.SetAlertInfo('No mp4 files or files already hevc.');
    }
  }

  fetchFastStart(page: Page) {
    if (
      this._cmsService.convertcount + 1 <
      this._cmsService.convertedMovies.length
    ) {
      this._cmsService.convertcount++;
      let index = this._cmsService.conversionParents.findIndex(
        (e) => e === page.parent
      );
      if (index == -1) this._cmsService.conversionParents.push(page.parent);
      this.faststartPreReady(
        this._cmsService.convertedMovies[this._cmsService.convertcount]
      );
      this._cmsService.listCheckboxCounter--;
    } else {
      this._cmsService.listCheckboxCounter = 0;
      this.fileschecked = 0;
      this._cmsService.conversionParents.forEach((element) => {
        document
          .getElementById('rowli_' + element)
          .setAttribute('data-kids', 'off');
        document.getElementById('tabrowl_' + element).click();
      });
      this._messageService.SetAlertInfo(
        'Finished faststart ' +
          this._cmsService.convertedMovies.length +
          ' movie' +
          (this._cmsService.convertedMovies.length > 1 ? 's' : '')
      );
      this._cmsService.convertcount = 0;
    }
    var div = document.getElementById('chk_' + page._id);
    div.scrollIntoView();
  }

  faststartPreReady(page: Page) {
    this.sysreporter(page.schemaextend[0].length, false);
    this._messageService.SetAlertInfo(
      'Faststart movie ' +
        this._cmsService.convertedMovies[this._cmsService.convertcount].title +
        (this._cmsService.convertedMovies.length > 1
          ? ' movie ' +
            (this._cmsService.convertcount + 1) +
            ' of ' +
            this._cmsService.convertedMovies.length
          : '')
    );
    this._cmsService
      .faststart(
        this._cmsService.convertedMovies[this._cmsService.convertcount]
      )
      .subscribe((res) =>
        this.faststartReady(
          this._cmsService.convertedMovies[this._cmsService.convertcount]
        )
      );
  }

  faststartReady(page: Page) {
    (<HTMLInputElement>(
      document.getElementById(
        'chk_' +
          this._cmsService.convertedMovies[this._cmsService.convertcount]._id
      )
    )).checked = false;
    this._cmsService.listCheckboxCounter--;
    this.fetchFastStart(page);
    //this.savelistPreReadyExtension(page._id);
  }

  faststart() {
    this._messageService.SetAlertInfo('Scanning for faststart');
    var tabfield = document.getElementsByClassName('checkbox');
    let b = 0;
    let id;
    this._cmsService.convertedMovies = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        id = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService
          .getcms(id)
          .subscribe((result) => this._cmsService.convertedMovies.push(result));

        if (b == 0) {
          let dhis = this;
          setTimeout(function () {
            if (dhis._cmsService.convertedMovies.length > 0) {
              dhis._messageService.SetAlertInfo(
                'Start faststart ' +
                  dhis._cmsService.convertedMovies.length +
                  ' movie' +
                  (dhis._cmsService.convertedMovies.length > 1 ? 's' : '')
              );
              dhis._cmsService.conversionParents.push(
                dhis._cmsService.convertedMovies[0].parent
              );
              dhis._cmsService
                .getcms(id)
                .subscribe((res) => dhis.faststartPreReady(res));
            } else {
              dhis._messageService.SetAlertInfo('No files found.');
            }
          }, this._cmsService.listCheckboxCounter * 250);
        }

        b++;
      }
    }
  }

  saveListProperty(prop) {
    let propval = (<HTMLInputElement>(
      document.getElementById('lst_prop_' + prop._id)
    )).value;
    console.log(propval);
    var tabfield = document.getElementsByClassName('checkbox');
    let b = 0;
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var id = (<HTMLInputElement>tabfield[i]).getAttribute('id');
        var thisId = id.replace('chk_', '');
        this._cmsService
          .listValueToField(
            thisId,
            prop.pname,
            propval ? propval : 'clear',
            prop.type
          )
          .subscribe((result) => this.saveListPropertyReady(result));
        b++;
      }
    }
  }

  radioset(propval: string, id: string) {
    (<HTMLInputElement>document.getElementById('lst_prop_' + id)).value =
      propval;
  }

  saveListPropertyReady(page: Page) {
    //console.log(page);
    this.savelistPreReadyExtension(page._id);
    // this._cmsService
    //   .getcms(page._id)
    //   .subscribe((result) =>
    //     this.savelistPreReadyExtension(result)
    //   );
  }

  fileToImageConverter() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var id = (<HTMLInputElement>tabfield[i]).getAttribute('id');
        var thisId = id.replace('chk_', '');
        //var thisId = (<HTMLInputElement>tabfield[i]).getAttribute('id');
        this._cmsService
          .fileToImageConverter(thisId)
          .subscribe((result) => console.log(result));
      }
    }
    this._messageService.SetAlertInfo(
      'File (main.jpg) set to Image (image.jpg) for selected items'
    );
  }

  sysreporter(length, countup = false) {
    let dhis = this;
    if (length > 0) {
      var i = 1;
      var progress = dhis.progress;
      while (i < length && progress <= 100) {
        setTimeout(function () {
          dhis.getFFmpegLog(
            dhis._cmsService.convertcount,
            dhis._cmsService.convertedMovies.length,
            dhis._cmsService.totalConversionTime,
            countup == true ? true : false
          );
        }, i * 1000);
        i++;
      }
    }
  }

  // ready ffmpeg logs and output progress of converting
  getFFmpegLog(mcount, mtotal, totalConversionTime, countup = false) {
    const xhr = new XMLHttpRequest();
    var mainc = this;
    xhr.open('GET', 'http://77.171.83.149:3001/assets/ffmpeg/log.txt', true);
    xhr.onload = function () {
      function secondsToHms(d) {
        d = Number(d);
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
        return hDisplay + ':' + mDisplay + ':' + sDisplay;
      }

      if (this.status == 200) {
        var ready = this.responseText.split('encoded ');
        if (ready.length > 1) {
          document.getElementById('selectedListStatus').innerHTML =
            'Finished converting ' +
            mtotal +
            ' movie' +
            (mtotal > 1 ? 's' : '');
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
          var resttotal;

          var preduration = this.responseText.split('Duration: ');
          if (preduration.length > 0) {
            pdur = preduration[1].split(', ');
            duration = pdur[0];

            var a = duration.split(':');
            if (duration.length > 1) {
              totalSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
            }
          }

          lines = this.responseText.split('frame');
          last_line1 = lines[lines.length - 1];

          lines = last_line1.split('time=');
          last_line = lines[lines.length - 1];

          lines = last_line.split(' bitrate');

          if (duration != '') {
            var c = lines[0].split(':');
            secondspast = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];

            restseconds = totalSeconds - secondspast;

            if (
              parseInt(restseconds) == 0 &&
              countup == true &&
              mtotal > 1 &&
              mcount < mtotal
            ) {
              console.log('cout up');
              mainc._cmsService.convertcount++;
              mcount = mcount + 1;
            }
            resttime = secondsToHms(restseconds);
            if (mcount + 1 != mtotal)
              resttotal = secondsToHms(totalConversionTime - secondspast);
            //console.log(resttotal);
          }

          var t1 = Math.round(totalSeconds);
          var t2 = lines[0];

          var b = t2.split(':');
          if (b.length > 1) t2 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
          var percentage = Math.round((parseInt(t2) / t1) * 100);
          mainc.progress = percentage;

          document.getElementById('ajaxres').innerHTML = '';
          document.getElementById('ffmpeg_log_res').innerHTML =
            percentage + '%';
          document.getElementById('selectedListStatus').innerHTML =
            'Converting movie ' +
            (mtotal == 1 ? '' : mcount + 1 + ' of ' + mtotal) +
            ' at <b>' +
            percentage +
            '%</b>' +
            (resttime != '' ? ' | <b>' + resttime + '</b>' : '') +
            (resttotal != '' && resttotal != undefined
              ? ' | <b>' + resttotal + '</b>'
              : '');
        }
      }
    };
    xhr.send();
  }

  saveListImDBfromVideo() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id');
        this._cmsService
          .getImdbById(thisId.replace('chk_', ''))
          .subscribe((res) => this.getImdbReady(res));
      }
    }
    this._messageService.SetAlertInfo('IMDB updated for selected items');
  }

  getImdbReady(res) {
    console.log(res);
  }

  setPickOrder() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id');

        this._cmsService
          .updatePickorder(thisId.replace('chk_', ''), i)
          .subscribe((res) => console.log(res));
      }
    }
    this._messageService.SetAlertInfo('Pickorder updated for selected items');
  }

  setStringReplace() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var replace = (<HTMLInputElement>(
          document.getElementById('stringToReplace')
        )).value;

        this._cmsService
          .getcms(thisId)
          .subscribe((result) => this.setStringReplaceReady(result, replace));
      }
    }
    this._messageService.SetAlertInfo(
      'String to replace updated for selected items'
    );
  }

  setStringReplaceReady(res, string) {
    res.title = res.title.replace(string, '');
    this._cmsService
      .updatePage(res)
      .subscribe((result) => this.savelistPreReady(res._id, 'title'));
    //this.savelistPreReady(thisId, 'image')
  }

  compareNumbers(a, b) {
    return a - b;
  }

  setTitleSubtraction() {
    var tabfield = document.getElementsByClassName('checkbox');
    var arr2 = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var title = tabfield[i].getAttribute('title');
        var titnr = title.split(' - ');
        var obj = { _id: thisId, title: title };
        var obj2 = { _id: thisId, title: title };
        arr2.push(obj2);
      }
    }
    arr2.sort((a, b) => {
      return a.title - b.title;
    });
    var i = 0;
    for (const element of arr2) {
      this._cmsService.updatePickorder(element._id, i).subscribe();
      i++;
    }
    this._messageService.SetAlertInfo(
      'Title subtraction updated for selected items'
    );
  }

  setTitleSort() {
    var tabfield = document.getElementsByClassName('checkbox');
    var array = [];
    var arr2 = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var title = tabfield[i].getAttribute('title');
        var titnr = title.split(' - ');
        var obj = { _id: thisId, title: title };
        var obj2 = { _id: thisId, title: title };
        array.push(obj);
      }
    }
    array.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });

    var i = 0;
    for (const element of array) {
      this._cmsService.updatePickorder(element._id, i).subscribe();
      i++;
    }
    this._messageService.SetAlertInfo('Title sort updated for selected items');
  }

  setTrackSort() {
    var tabfield = document.getElementsByClassName('checkbox');
    var array = [];
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var title = tabfield[i].getAttribute('title');
        var track = tabfield[i].getAttribute('name');
        var obj = { _id: thisId, title: title, track: track };
        array.push(obj);
      }
    }

    array.sort(function (a, b) {
      if (
        a.track === '1' ||
        a.track === '2' ||
        a.track === '3' ||
        a.track === '4' ||
        a.track === '5' ||
        a.track === '6' ||
        a.track === '7' ||
        a.track === '8' ||
        a.track === '9'
      ) {
        a.track = '0' + a.track;
      }
      return a.track.localeCompare(b.track);
    });

    var i = 0;
    for (const element of array) {
      this._cmsService.updatePickorder(element._id, i).subscribe();
      i++;
    }
    this._messageService.SetAlertInfo('Track updated for selected items');
  }

  saveListInfofromVIdeo() {
    //console.log('saveListInfofromVIdeo');
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        //console.log(thisId.replace('chk_', ''));

        this._cmsService
          .getMovieInfoById(thisId)
          .subscribe((res) => this.getMovieInfoReady(res, thisId));
        //this._cmsService.createImageById(thisId.replace('chk_',''));
      }
    }
    this._messageService.SetAlertInfo(
      'Info from video updated for selected items'
    );
  }

  getMovieInfoReady(page, id) {
    this.savelistPreReadyExtension(id);
    this._messageService.SetAlertInfo('Info movies updated.');
  }

  saveListTrackFromTitle() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService
          .geturl(thisId)
          .subscribe((res) => this.getMovieInfoReady(res, thisId));
        //this._cmsService.createImageById(thisId.replace('chk_',''));
      }
    }
    this._messageService.SetAlertInfo(
      'Track from title updated for selected items'
    );
  }

  saveListID3tagsfromAudio() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService
          .getcms(thisId)
          .subscribe((result) =>
            this.saveListID3tagsfromAudioPreReady(result, thisId)
          );
      }
    }
    this._messageService.SetAlertInfo('Updating ID3 tags ...');
  }

  saveListID3tagsfromAudioPreReady(page: Page, thisId: string) {
    this._cmsService
      .id3tags(page)
      .subscribe((res) => this.saveListID3tagsfromAudioReady(res, thisId));
  }

  saveListID3tagsfromAudioReady(res, thisId) {
    this.savelistPreReadyExtension(thisId);
  }

  createImageList() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService.createImage(thisId).subscribe();
      }
    }
    this._messageService.SetAlertInfo('Creating image for selected items');
  }

  createThumbFromImageList() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService.imageThumbFromImage(thisId).subscribe();
      }
    }
    this._messageService.SetAlertInfo(
      'Thumb from image updated for selected items'
    );
  }

  //createImageReady(res, page) {
  //  this._cmsService.update_edit_image_fields(page);
  //}

  saveListThumbFromMain() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        this._cmsService.createThumb(thisId).subscribe();
      }
    }
    this._messageService.SetAlertInfo('Thumb updated for selected items');
  }

  //createImage2(thisId) {
  //  this._cmsService.createImageById(thisId);
  //.then(res => this._cmsService.update_edit_image_fields(page));
  //this._cmsService.update_edit_image_fields(this._cmsService.pageSelected);
  //}

  saveListKids() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        let thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        let listItem = (<HTMLInputElement>(
          document.getElementById('saveListKids')
        )).value;
        if (listItem !== '') {
          this._cmsService
            .updateListKids(thisId, listItem)
            .subscribe(() => this.savelistPreReady(thisId, 'kids'));
        } else {
          console.log('Select parent');
        }
      }
    }
    this._messageService.SetAlertInfo('Kids updated for selected items');
  }

  saveListPersons() {
    //console.log('saveListPersons');
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var listItem = (<HTMLInputElement>(
          document.getElementById('saveListPersons')
        )).value;
        if (listItem !== '') {
          //var tmppage = this.prepareSavePage();
          this._cmsService
            .insertPerson(thisId, listItem) // updatePage
            .subscribe((res) => this.savelistPreReadyExtension(thisId));
          //  .catch(err => this._messageService.SetAlertDanger(err));
          //this._cmsService.decrementKid(this._cmsService.pageSelected._id);
        } else {
          console.log('Select parent');
        }
      }
    }
    this._messageService.SetAlertInfo('Persons inserted for selected items');
  }

  saveListDeletePersons() {
    console.log('saveListPersons');
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var listItem = (<HTMLInputElement>(
          document.getElementById('saveListPersons')
        )).value;
        this._cmsService
          .deletePerson(thisId)
          .subscribe((res) => this.deletePersonReady(res));
      }
    }
    this._messageService.SetAlertInfo('Persons deleted for selected items');
  }

  deletePersonReady(res) {}

  insertPersonReady(res) {}

  saveListItem() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        let thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        let listItem = (<HTMLInputElement>(
          document.getElementById('saveListItem')
        )).value;
        if (listItem !== '') {
          this._cmsService
            .updateListItem(thisId, listItem)
            .subscribe(() => this.savelistPreReady(thisId, 'listItem'));
        } else {
          console.log('Select saveListItem');
        }
      }
    }
    this._messageService.SetAlertInfo('ListItem updated for selected items');
  }

  saveListObject() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
        var objekt = (<HTMLInputElement>document.getElementById('saveObject'))
          .value;
        if (objekt !== '') {
          this._cmsService
            .updateObject(thisId, objekt)
            .subscribe((res) => this.savelistPreReady(thisId, 'object'));
        } else {
          console.log('Select saveObject');
        }
      }
    }
    this._messageService.SetAlertInfo('Object updated for selected items');
  }

  deleteListSelection() {
    var confirmText = 'Are you sure you want to delete selected pages?';
    if (confirm(confirmText)) {
      this.filescount = 0;
      var tabfield = document.getElementsByClassName('checkbox');
      let b = 0;
      for (var i = 0; i < tabfield.length; i++) {
        if ((<HTMLInputElement>tabfield[i]).checked == true) {
          this.filescount++;
          var thisId = tabfield[i].getAttribute('id').replace('chk_', '');
          this._cmsService
            .getcms(thisId)
            .subscribe((res) => this.checkSecure(res, thisId, b));
          b++;
        }
      }
    }
    this._messageService.SetAlertInfo('Page deleted for selected items');
  }

  checkSecure(page: Page, thisId: string, b: number) {
    if (page.secure == false) {
      this.deleteListSelectionPre(page, thisId, b);
    }
  }

  deleteListSelectionPre(page: Page, id: string, index: number) {
    this._cmsService
      .deletAssetFolderItem('content', id)
      .subscribe(() => this.destroyPageByIdPrePage(page, index));
  }

  destroyPageByIdPrePage(page, index) {
    this._cmsService
      .destroyPageById(page._id)
      .subscribe(() => this.destroyPageByIdReady(page, page._id, index));
  }

  destroyPageByIdReady(res, id, index) {
    this._cmsService
      .getcms(res.parent)
      .subscribe((res) => this.destroyPageByIdReadyPage(res, id, index));
  }

  destroyPageByIdReadyPage(parent, id: string, index) {
    var elem = document.getElementById('rowli_' + id);
    elem.parentNode.removeChild(elem);
    this._cmsService.decrementKid(parent._id);
    if (this.filescount == index + 1) {
      this._cmsService.setPageSelected(parent);
      this._messageService.SetAlertInfo(this.filescount + ' Pages deleted');
    }
  }

  UnsecureListSelection() {
    var tabfield = document.getElementsByClassName('checkbox');
    for (var i = 0; i < tabfield.length; i++) {
      if ((<HTMLInputElement>tabfield[i]).checked == true) {
        var thisId = tabfield[i].getAttribute('id');
        this._cmsService.unsecurePageById(thisId.replace('chk_', ''));
      }
    }
    this._messageService.SetAlertInfo('Unsecure updated for selected items');
  }

  listSendSec() {
    var element = document.getElementsByClassName('checkbox');
    for (var i = 0; i < element.length; i++) {
      if ((<HTMLInputElement>element[i]).checked == true) {
        var nid = element[i].getAttribute('id').replace('chk_', '');
        this._cmsService.upsertPageProperty(nid, 'secure', 'Boolean', true);
      }
    }
    this._messageService.SetAlertInfo('Secure updated for selected items');
  }

  // listSendSed() {
  //   var element = document.getElementsByClassName('checkbox');
  //   for (var i = 0; i < element.length; i++) {
  //     if ((<HTMLInputElement>element[i]).checked == true) {
  //       var nid = element[i].getAttribute('id').replace('chk_', '');
  //       this._cmsService.upsertPageProperty(nid, 'secure', 'Boolean', false);
  //       this._messageService.SetAlertWarning('Items unsecured');
  //     }
  //   }
  // }

  listSecVisible() {
    var element = document.getElementsByClassName('checkbox');
    for (var i = 0; i < element.length; i++) {
      if ((<HTMLInputElement>element[i]).checked == true) {
        var nid = element[i].getAttribute('id').replace('chk_', '');
        this._cmsService.upsertPageProperty(nid, 'visible', 'Boolean', true);
        this._messageService.SetAlertWarning('Items set visible');
      }
    }
    this._messageService.SetAlertInfo(
      'Visible to true updated for selected items'
    );
  }

  listSecInvisible() {
    var element = document.getElementsByClassName('checkbox');
    for (var i = 0; i < element.length; i++) {
      if ((<HTMLInputElement>element[i]).checked == true) {
        var nid = element[i].getAttribute('id').replace('chk_', '');
        this._cmsService.upsertPageProperty(nid, 'visible', 'Boolean', false);
        //.subscribe(result => this._messageService.SetAlertWarning('Items set invisible'))
      }
    }
    this._messageService.SetAlertInfo(
      'Visible to false updated for selected items'
    );
  }

  toggleLetter() {
    var element = document.getElementsByClassName('letter');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo('Toggled letter for selected items');
  }

  toggleListCheckboxes() {
    var element = document.getElementsByClassName('checkbox');
    for (var i = 0; i < element.length; i++) {
      var nid = element[i].getAttribute('id').replace('chk_', '');
      var parent = element[i].getAttribute('title');
      if (
        document
          .getElementById('rowul' + parent)
          .classList.contains('hidden') == false
      ) {
        document.getElementById('chkpar' + nid).classList.toggle('hidden');
      }
    }
    this._messageService.SetAlertInfo('Toggled checkbox for selected items');
  }

  toggleListVisibility() {
    var element = document.getElementsByClassName('Visibility');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo('Toggled visibility for selected items');
  }

  toggleListSecurity() {
    var element = document.getElementsByClassName('Security');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo('Toggled secure for selected items');
  }

  toggleListKids() {
    var element = document.getElementsByClassName('iconLetter');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo('Toggled kids selected items');
  }

  toggleListImages() {
    var element = document.getElementsByClassName('listImages');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo('Toggled images for selected items');
  }

  toggleListDnd() {
    var element = document.getElementsByClassName('dnd');
    for (var i = 0; i < element.length; i++) {
      element[i].classList.toggle('hidden');
    }
    this._messageService.SetAlertInfo(
      'Toggled drag and drop for selected items'
    );
  }
}
