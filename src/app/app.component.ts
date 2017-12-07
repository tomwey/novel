import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular/util/events';
import { Tabs } from 'ionic-angular/components/tabs/tabs';
import { App } from 'ionic-angular/components/app/app';
// import { PasswordInputPage } from '../pages/password-input/password-input';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private storage: Storage,
    private events: Events,
    private app: App,
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.checkPassword();

      if (platform.is('cordova')) {
        platform.resume.subscribe(() => {
          this.checkPassword();
        });
      }

    });

    this.events.subscribe('password:right', () => {
      this.app.getRootNavs()[0].setRoot(TabsPage);
    });
  }

  private checkPassword() {
    this.storage.get('app.password').then(data => {
      // alert(data);
      if (data) {
        this.app.getRootNavs()[0].setRoot('PasswordInputPage');
      } else {
        // this.app.getRootNavs()[0].setRoot(TabsPage);
      }
    });
  }
}
