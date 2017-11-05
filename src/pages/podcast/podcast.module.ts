import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PodcastPage } from './podcast';

@NgModule({
  declarations: [
    PodcastPage,
  ],
  imports: [
    IonicPageModule.forChild(PodcastPage),
  ],
})
export class PodcastPageModule {}
