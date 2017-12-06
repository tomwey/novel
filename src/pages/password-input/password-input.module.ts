import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordInputPage } from './password-input';

@NgModule({
  declarations: [
    PasswordInputPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordInputPage),
  ],
})
export class PasswordInputPageModule {}
