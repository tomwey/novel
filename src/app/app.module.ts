import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

// import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from '../pages/home/home';
// import { CatalogPage } from '../pages/catalog/catalog';
// import { PodcastPage } from '../pages/podcast/podcast';
// import { SearchPage } from '../pages/search/search';
// import { SettingPage } from '../pages/setting/setting';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiService } from '../providers/api-service';
import { ToolService } from '../providers/tool-service';
import { Constants } from '../providers/constants';
import { BooksService } from '../providers/books-service';
import { PodCastsService } from '../providers/podcast-service';
import { NewbieService } from '../providers/newbie-service';
import { SearchService } from '../providers/search-service';
import { GlobalPlayService } from '../providers/global-play-service';
import { DownloadServiceProvider } from '../providers/download-service';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Device } from '@ionic-native/device';
import { DownloadService } from '../providers/download';
import { Clipboard } from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Brightness } from '@ionic-native/brightness';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    // CatalogPage,
    // PodcastPage,
    // SearchPage,
    // SettingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      // preloadModules: true,
      mode: 'ios',
      backButtonText: '返回',
      // tabsHideOnSubPages: true,
      // pageTransition: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    // CatalogPage,
    // PodcastPage,
    // SearchPage,
    // SettingPage,
    TabsPage
  ],
  providers: [
    File,
    FileTransfer,
    StatusBar,
    Device,
    Clipboard,
    InAppBrowser,
    SplashScreen,
    Brightness,
    // Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    Constants,
    ToolService,
    BooksService,
    PodCastsService,
    NewbieService,
    SearchService,
    GlobalPlayService,
    DownloadServiceProvider,
    DownloadService,
  ]
})
export class AppModule {}
