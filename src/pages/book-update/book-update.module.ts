import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookUpdatePage } from './book-update';

@NgModule({
  declarations: [
    BookUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(BookUpdatePage),
  ],
})
export class BookUpdatePageModule {}
