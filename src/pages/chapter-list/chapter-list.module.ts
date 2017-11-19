import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChapterListPage } from './chapter-list';

@NgModule({
  declarations: [
    ChapterListPage,
  ],
  imports: [
    IonicPageModule.forChild(ChapterListPage),
  ],
})
export class ChapterListPageModule {}
