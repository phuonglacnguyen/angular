import { Component, OnInit } from '@angular/core';
import { CmsService } from './../services/cms.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
songs;

  constructor(public _cmsService: CmsService) { }

  ngOnInit() {
    this._cmsService.getAllSongs().subscribe(songs => this.songsReady(songs));
  }

  songsReady(songs) {
    //console.log(songs);
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
