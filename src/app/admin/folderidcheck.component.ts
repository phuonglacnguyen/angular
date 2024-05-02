import { Component, OnInit } from '@angular/core';
import { CmsService } from './../services/cms.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-folderidcheck',
  templateUrl: './folderidcheck.component.html',
  styleUrls: ['./folderidcheck.component.css']
})
export class FolderIdCheckComponent implements OnInit {
songs;

  constructor(public _cmsService: CmsService) { }

  ngOnInit() {
    this._cmsService.folderIdCheck().subscribe(songs => this.songsReady(songs));
  }

  songsReady(songs) {
    console.log(songs);
    this.songs = songs;

    // songs.forEach(song => {
    //   var page = song;
    //   console.log(song.title);
    //   this._cmsService.decrementKid(page.parent);
    //   this._cmsService.deletAssetFolderItem('content', page._id);
    //   this._cmsService.destroyPage(song)
    //       .subscribe(res => console.log(song.title + ' deleted'));
    // })
  }

}
