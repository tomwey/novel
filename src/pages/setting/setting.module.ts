import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingPage),
    MultiPickerModule
  ],
})
export class SettingPageModule {}
