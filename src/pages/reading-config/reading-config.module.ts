import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadingConfigPage } from './reading-config';

@NgModule({
  declarations: [
    ReadingConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadingConfigPage),
  ],
})
export class ReadingConfigPageModule {}
