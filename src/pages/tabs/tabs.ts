import { Component } from '@angular/core';

import { HomePage } from '../home/home';
// import { CatalogPage } from '../catalog/catalog';
// import { PodcastPage } from '../podcast/podcast';
// import { SearchPage } from '../search/search';
// import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'CatalogPage';
  tab3Root = 'PodcastPage';
  tab4Root = 'SearchPage';
  tab5Root = 'SettingPage';

  constructor() {

  }
}
