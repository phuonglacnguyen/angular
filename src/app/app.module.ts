import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PagerService } from './services/pagination.service';

import { HomepageComponent } from './homepage/homepage.component';

import { FoodComponent } from './food/food.component';
import { MedialibDetailComponent } from './medialib/medialib-detail/medialib-detail.component';
import { MedialibListComponent } from './medialib/medialib-list/medialib-list.component';
import { MedialibComponent } from './medialib/medialib.component';
import { MedialibNewComponent } from './medialib/medialib-new/medialib-new.component';
import { MedialibPlaylistComponent } from './medialib/medialib-playlist/medialib-playlist.component';

import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { VideoplayerButtonsComponent } from './videoplayer/videoplayer-buttons/videoplayer-buttons.component';
import { VideoplayerTopButtonsComponent } from './videoplayer/videoplayer-topbuttons/videoplayer-topbuttons.component';
import { VideoplayerMenuComponent } from './videoplayer/videoplayer-menu/videoplayer-menu.component';

import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { IpServiceService } from './services/ip.service';
import { CmsService } from './services/cms.service';
import { FilterService } from './services/filter.service';
import { MusicplayerComponent } from './musicplayer/musicplayer.component';
import { MusicFavoritesComponent } from './musicplayer/musicFavorites.component';
import { MoviesFavoritesComponent } from './videos/videoFavorites.component';
import { MediaService } from './services/media.service';

import { VideosComponent } from './videos/videos.component';
import { PhoneBrowserComponent } from './phonebrowser/phonebrowser.component';
import { PhoneBrowserFavoritesComponent } from './phonebrowser/phonebrowserFavorites.component';

import { menusTopButtons } from './menus/top-buttons/top-buttons.component';
import { NavComponent } from './nav/nav.component';
import { MiniNavComponent } from './nav/mininav.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';

import { FetchJsonPipe } from './pipes/fetch-json.pipe';
import { FirstletterPipe } from './pipes/firstletter.pipe';
import { UpperCasePipe } from './pipes/uppercase.pipe_ori';
import { ParentPipe } from './pipes/parent.pipe';
import { MovieGenrePipe } from './pipes/moviegenre.pipe';
import { ImagePersonPipe } from './pipes/imageperson.pipe';
import { MovieRatingPipe } from './pipes/movierating.pipe';
import { FavoritesPipe } from './pipes/favorites.pipe';
import { MusicGenrePipe } from './pipes/musicgenre.pipe';
import { SafePipe } from './pipes/url.pipe';

import { UserTabsComponent } from './user/user-tabs/user-tabs.component';
import { SongsComponent } from './songs/songs.component';
import { FolderIdCheckComponent } from './admin/folderidcheck.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserLogoutComponent } from './user/user-logout/user-logout.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

import { KidsComponent } from './kids/kids.component';
import { SkidsComponent } from './kids/skids.component';

import { menusListImage } from './menus/list-image/list-image.component';
import { CmsListComponent } from './cms/cms-list/cms-list.component';

import { CmsComponent } from './cms/cms.component';
import { CmsTableComponent } from './cms/cms-table/cms-table.component';
import { CmsTabsComponent } from './cms/cms-tab/cms-tabs.component';
import { CmsTablerowComponent } from './cms/cms-table/cms-tablerow.component';
import { CmsTablerowAComponent } from './cms/cms-table/cms-tablerowA.component';
import { CmsEditComponent } from './cms/cms-edit/cms-edit.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageblokComponent } from './homepage/homepageblok.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    CommonModule,
  ],
  declarations: [
    AppComponent,
    HomepageComponent,
    UserTabsComponent,
    UserLoginComponent,
    UserLogoutComponent,
    UserListComponent,
    UserEditComponent,
    UserComponent,
    menusTopButtons,
    NavComponent,
    MiniNavComponent,
    BreadcrumbComponent,
    FooterComponent,
    VideosComponent,
    MusicplayerComponent,
    MusicFavoritesComponent,
    MoviesFavoritesComponent,
    PhoneBrowserComponent,
    PhoneBrowserFavoritesComponent,
    FoodComponent,
    CmsListComponent,
    menusListImage,
    KidsComponent,
    SkidsComponent,
    CmsTableComponent,
    CmsComponent,
    CmsTabsComponent,
    CmsEditComponent,
    CmsTablerowComponent,
    CmsTablerowAComponent,
    MedialibListComponent,
    MedialibComponent,
    MedialibNewComponent,
    MedialibPlaylistComponent,
    MedialibDetailComponent,
    VideoplayerComponent,
    VideoplayerButtonsComponent,
    VideoplayerTopButtonsComponent,
    VideoplayerMenuComponent,
    FetchJsonPipe,
    FirstletterPipe,
    UpperCasePipe,
    ParentPipe,
    MovieGenrePipe,
    MovieRatingPipe,
    ImagePersonPipe,
    FavoritesPipe,
    MusicGenrePipe,
    SafePipe,
    UserProfileComponent,
    SongsComponent,
    FolderIdCheckComponent,
    HomepageblokComponent,
  ],
  providers: [
    UserService,
    CmsService,
    PagerService,
    FilterService,
    MessageService,
    MediaService,
    IpServiceService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
