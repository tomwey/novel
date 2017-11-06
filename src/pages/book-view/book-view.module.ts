import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookViewPage } from './book-view';

@NgModule({
  declarations: [
    BookViewPage,
  ],
  imports: [
    IonicPageModule.forChild(BookViewPage),
  ],
})
export class BookViewPageModule {}
