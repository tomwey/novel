import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DownloadServiceProvider } from '../../providers/download-service';
// import { CataloggroupProvider } from '../../providers/cataloggroup';
import { Constants } from '../../providers/constants';
import { App } from 'ionic-angular/components/app/app';
import { File, RemoveResult } from '@ionic-native/file';
import { NewbieService } from '../../providers/newbie-service';

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
  menuID: any = null;
  isEdit: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private download: DownloadServiceProvider,
              // private catalogs: CataloggroupProvider,
              private app: App,
              private file: File,
              private nbService: NewbieService,
            ) {
    this.book = this.navParams.data.book;
    let key = this.navParams.data.key;
    this.menuID = key;

    if (key === 'downloading') {
      this.chapters = this.download.downloadList.get(this.book.ID);
    } else {
      this.chapters = this.book.downloadedChapter;
      // alert(JSON.stringify(this.chapters));
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChapterListPage');
  }

  deleteItems(isEdit) {
    this.isEdit = !this.isEdit;
  }

  handleDownload(event, item) {
    event.stopPropagation();
    // this.catalogs.downloadOneItem(item)
  }

  playAudio(item): void {
    if (this.isEdit) {
      item.selected = !item.selected;
      return;
    }
    // alert(JSON.stringify(item));
    if (Constants.APP_TYPE === 1) {
      // 有声小说
      this.app.getRootNavs()[0].push('AudioplayerPage', 
      {bookitem:this.book, chapters: this.chapters, item: (item.chapterItem || item)});
    } else if (Constants.APP_TYPE === 2) {
      // 追书小说
      this.app.getRootNavs()[0].push('BookViewPage', 
      { bookitem:this.book, chapters: this.chapters, item: (item.chapterItem || item) });
    }
    
  }

  cancel() {
    this.chapters.forEach(element => {
      element.selected = false;
    });
    this.isEdit = false;
  }

  reverse() {
    this.chapters.reverse();
  }

  unselectAll() {
    this.chapters.forEach(element => {
      element.selected = !element.selected;
    });
  }

  selectAll() {
    this.chapters.forEach(element => {
      element.selected = true;
    });
  }

  deleteAll() {
    let items = [];
    this.chapters.forEach(element => {
      if (element.selected) {
        items.push(element);
      }
    });
    // alert(items.length);

    items.forEach(item => {
      this.deleteItem(item);
    });
  }

  deleteItem(item){
    // alert(item.audioFile);
    // alert(JSON.stringify(item));

    if (item.audioFile){
      let comp = item.audioFile.split('/');
      var filename = comp.pop();
      // alert(filename);
      var path = this.file.documentsDirectory + encodeURI(this.book.title.replace(/^\s+|\s+$/g,"")) + '/';
      // alert(path);
      this.file.checkFile(path, filename).then(value => {
        this.file.removeFile(path, filename).then((e:RemoveResult)=>{
          if (e.success){
            let index = this.chapters.indexOf(item);
            if (index !== -1) {
              this.book.downloadedChapter.splice(index, 1);
              if (this.book.downloadedChapter.length === 0) {
                this.nbService.removeItems(NewbieService.DOWNLOADED_KEY, [this.book]);
              } else {
                this.nbService.updateItem(NewbieService.DOWNLOADED_KEY, this.book);
              }
            }
          }
        }).catch((error)=>{
          console.log("删除文件出错")
          // alert(JSON.stringify(error));
        })
      }).catch(error => alert(JSON.stringify(error)));
    }
  }

}
