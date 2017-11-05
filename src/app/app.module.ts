import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

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
    StatusBar,
    SplashScreen,
    // Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiService,
    Constants,
    ToolService,
    BooksService,
	  PodCastsService,
  ]
})
export class AppModule {}
