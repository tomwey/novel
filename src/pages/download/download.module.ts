import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadPage } from './download';

@NgModule({
  declarations: [
    DownloadPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadPage),
  ],
})
export class DownloadPageModule {}
