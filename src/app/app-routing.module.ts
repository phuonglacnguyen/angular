import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserLogoutComponent } from './user/user-logout/user-logout.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { SongsComponent } from './songs/songs.component';
import { FolderIdCheckComponent } from './admin/folderidcheck.component';
import { VideosComponent } from './videos/videos.component';
import { MusicplayerComponent } from './musicplayer/musicplayer.component';
import { MusicFavoritesComponent } from './musicplayer/musicFavorites.component';
import { MoviesFavoritesComponent } from './videos/videoFavorites.component';

import { PhoneBrowserComponent } from './phonebrowser/phonebrowser.component';
import { PhoneBrowserFavoritesComponent } from './phonebrowser/phonebrowserFavorites.component';
import { FoodComponent } from './food/food.component';
import { MedialibComponent } from './medialib/medialib.component';

import { UserComponent } from './user/user.component';
import { KidsComponent } from './kids/kids.component';
import { SkidsComponent } from './kids/skids.component';
import { CmsComponent } from './cms/cms.component';

const routes: Routes = [
  {
    path: 'Videos/65fce36c8015e06e0cd1b02a',
    component: MoviesFavoritesComponent,
  },
  { path: 'Videos/:parent', component: VideosComponent },
  { path: 'Videos/:parent/:id', component: VideosComponent },
  { path: 'songs', component: SongsComponent },
  { path: 'folder_id_check', component: FolderIdCheckComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'logout', component: UserLogoutComponent },
  { path: 'userprofile', component: UserProfileComponent },
  {
    path: 'Music/6553fed32704c658555d3324',
    component: MusicFavoritesComponent,
  },
  { path: 'Music/:albumName', component: MusicplayerComponent },
  { path: 'Music/:albumName/:id', component: MusicplayerComponent },
  { path: 'Food/:id', component: FoodComponent },
  { path: 'medialib', component: MedialibComponent },

  {
    path: 'Personal/65fe13f38015e06e0cd20048',
    component: PhoneBrowserFavoritesComponent,
  },
  { path: 'Personal/:parent', component: PhoneBrowserComponent },
  { path: 'Personal/:parent/:id', component: PhoneBrowserComponent },

  { path: 'users', component: UserComponent },
  { path: 'users/:id', component: UserComponent },

  { path: 'Kids/:parentName/:id', component: KidsComponent },
  { path: 'Skids/:parentName/:id', component: SkidsComponent },
  { path: 'Media/:id', component: KidsComponent },
  { path: 'Apps/:id', component: KidsComponent },
  { path: 'cms', component: CmsComponent },
  { path: 'cms/:id/:browseindex', component: CmsComponent },
  { path: 'cms/:id', component: CmsComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: '', component: HomepageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
