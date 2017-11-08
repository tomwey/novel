import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectFolderPage } from './select-folder';

@NgModule({
  declarations: [
    SelectFolderPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectFolderPage),
  ],
})
export class SelectFolderPageModule {}
