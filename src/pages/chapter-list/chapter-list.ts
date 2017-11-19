import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadServiceProvider } from '../../providers/download-service';
import { CataloggroupProvider } from '../../providers/cataloggroup';
import { Constants } from '../../providers/constants';
import { App } from 'ionic-angular/components/app/app';

/**
 * Generated class for the ChapterListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chapter-list',
  templateUrl: 'chapter-list.html',
})
export class ChapterListPage {

  book: any = null;
  chapters: any = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private download: DownloadServiceProvider,
              // private catalogs: CataloggroupProvider,
              private app: App,
            ) {
    this.book = this.navParams.data.book;
    let key = this.navParams.data.key;

    if (key === 'downloading') {
      this.chapters = this.download.downloadList.get(this.book.ID);
    } else {
      this.chapters = this.download.downloadedList.get(this.book.ID);
    }
    
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChapterListPage');
  }

  handleDownload(event, item) {
    event.stopPropagation();
    // this.catalogs.downloadOneItem(item)
  }

  playAudio(item): void {
    if (Constants.APP_TYPE === 1) {
      // 有声小说
      this.app.getRootNavs()[0].push('AudioplayerPage', 
      {bookitem:this.book, chapters: this.chapters, item: item.chapterItem});
    } else if (Constants.APP_TYPE === 2) {
      // 追书小说
      this.app.getRootNavs()[0].push('BookViewPage', 
      { bookitem:this.book, chapters: this.chapters, item: item.chapterItem });
    }
    
  }

}
