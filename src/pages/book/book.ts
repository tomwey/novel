import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToolService } from "../../providers/tool-service";
import { ApiService } from "../../providers/api-service";
import { Constants } from '../../providers/constants';
import { NewbieService } from '../../providers/newbie-service';
import { File } from '@ionic-native/file';
import { CataloggroupProvider } from '../../providers/cataloggroup';
import { DownloadService } from '../../providers/download';
import { stagger } from '@angular/core/src/animation/dsl';
import { DownloadServiceProvider } from '../../providers/download-service';
import { Events } from 'ionic-angular/util/events';
/**
 * Generated class for the BookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {

  firstLoaded: boolean = false;
  bookItem: any = null;

  hasFavorited: boolean = false;

  dataType: string = 'chapter';
  chapters: any = [];
  brief: string = '';
  otherSources: any = [];
  catalogs : CataloggroupProvider;
  book: any = null;
  catalogcapters : any = null;
  isReverse: boolean = false;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private api: ApiService,
              private tool: ToolService,
              private app: App,
              private nbService: NewbieService,
              private file:File,
              public downloadService: DownloadService,
              private downloadTool:DownloadServiceProvider,
              private events: Events,
    ) {
      this.bookItem = this.navParams.data;
      // console.log(this.bookItem);
      this.book = JSON.parse(JSON.stringify(this.navParams.data));

      this.nbService.hasAdded(this.book.save_key || NewbieService.FAVORITE_KEY, this.book)
        .then(yesOrNo => {
          this.hasFavorited = yesOrNo;
        });
  }

  // ionViewDidLoad() {
    
  // }

  ionViewDidEnter() {
    if (!this.firstLoaded) {
      this.firstLoaded = true;

      this.refresh();
    }
  }

  segmentChanged(ev): void {
    // console.log(ev);
    // console.log(this.dataType);
    if (this.dataType === 'other') {
      this.loadOtherResources();
    } else if (this.dataType === 'chapter') {
      // this.chapters = this.bookItem.chapters;
    }

    console.log(this.chapters);
  }

  loadOtherResources(): void {
    this.tool.showLoading('加载中...');

    this.api.get('getSource.php', this.bookItem)
      .then(data => {
        // console.log(data);
        this.otherSources = data.sourceArr;
        this.tool.hideLoading();
      })
      .catch(error => {
        console.log(error);
        this.tool.hideLoading();
      })
  }

  refresh(): void {
    this.tool.showLoading('加载中...');
    let request = {
      title: this.book.title,
      filter_title: this.book.filter_title,
      ID: this.book.ID,
      href: this.book.href,
      author:this.book.author,
      new:this.book.new,
      time:this.book.time,
      category:this.book.category,
      bookType: this.book.bookType,
      name:this.book.name,
      pre:this.book.pre,
      bookjs: this.book.bookjs,
      chapterjs: this.book.chapterjs,
      src:this.book.src,
      openID:'187cc0fff2b361dce805e8b0c11c7fedc30a8034',
      ungz:1
    };

    this.bookItem.openID = '187cc0fff2b361dce805e8b0c11c7fedc30a8034';
    this.bookItem.ungz = 1;
    console.log("下载数据-----------")
    console.log(this.bookItem)
    this.api.get('getBook.php', request)
      .then(data => {
        // console.log(JSON.stringify(data));
        // if (this.downloadService.getChapters(this.bookItem.ID)) {
        //   this.chapters = this.downloadService.getChapters(this.bookItem.ID);
        // } else {
        //   this.chapters = data.partArr[0].chapterArr;
        //   this.chapters.forEach(element => {
        //     element._s = 5; //默认状态
        //   });
        //   this.downloadService.saveChapters(this.bookItem.ID, this.chapters);
        // }
        this.chapters = data.partArr[0].chapterArr;
        this.brief = data.brief;

        this.bookItem.bookName = data.bookName;
        this.bookItem.brief = data.brief;
        this.bookItem.chapterpre = data.chapterpre;
        this.bookItem.href = data.href;
        this.bookItem.time2 = data.time;
        this.bookItem.ts = data.ts;
        this.catalogs = new CataloggroupProvider(this.bookItem, this.chapters, this.file, this.nbService, this.downloadTool);
        this.catalogcapters = this.catalogs.chapters;
        console.log(this.catalogs)
        // this.bookItem.chapters = data.partArr[0].chapterArr;

        this.tool.hideLoading();
      })
      .catch(error => {
        // console.log(error);
        this.tool.hideLoading();
        setTimeout(() => {
          this.tool.showToast('加载章节出错');
        }, 100);
      });
  }

  playAudio(item): void {
    if (Constants.APP_TYPE === 1) {
      // 有声小说
      this.app.getRootNavs()[0].push('AudioplayerPage', 
      {bookitem:this.bookItem, chapters: this.chapters, item: item.chapterItem});
    } else if (Constants.APP_TYPE === 2) {
      // 追书小说
      this.app.getRootNavs()[0].push('BookViewPage', 
      { bookitem:this.bookItem, chapters: this.chapters, item: item.chapterItem });
    }
    
  }

  doFavorite(): void {
    // alert(JSON.stringify(bookItem));

    if (this.hasFavorited) {
      this.nbService.removeItems(this.book.save_key, [this.book])
        .then(data => {
          this.hasFavorited = false;
          this.tool.showToast('已取消收藏');

          this.nbService.removeItems('book:notify', [this.book]);
        })
        .catch(error => {
          this.tool.showToast('取消收藏失败');
        });
    } else {
      this.book.save_key = NewbieService.FAVORITE_KEY;
      
      this.nbService.addItem(NewbieService.FAVORITE_KEY, this.book)
      .then(data => {
        this.hasFavorited = true;
        this.tool.showToast('收藏成功');

        // this.updatedFavorites(1);
        this.book.notify = true;
        this.nbService.addItem('book:notify', this.book);
      })
      .catch(error => {
        this.tool.showToast('收藏失败');
      });
    }
  }

  gotoBook(book): void {
    this.app.getRootNavs()[0].push('BookPage', book);
  }

  reverse() {
    this.isReverse = !this.isReverse;
    this.catalogs.chapters.reverse();
  }

  doDwonalod(): void{
    this.app.getRootNavs()[0].push('DownloadPage', {catalogs:this.catalogs});   
  }

  downloaditem(item):void{
    this.catalogs.downloadOneItem(item)
  }

  deleteItem(item): void{
    item.deleteself()
  }

  handleDownload(event, item): void {
    // console.log(item);
    event.stopPropagation();
    this.catalogs.downloadOneItem(item)

    if (!this.hasFavorited) {
      this.book.save_key = NewbieService.FAVORITE_KEY;
      // this.book.notify = true;
      this.nbService.addItem(NewbieService.FAVORITE_KEY, this.book)
      .then(data => {
        this.hasFavorited = true;
        // this.tool.showToast('收藏成功');
        this.book.notify = true;
        this.nbService.addItem('book:notify', this.book);
      })
      .catch(error => {
        // this.tool.showToast('收藏失败');
      });
    }

    // let state = item._s || 0;

    // if (state === 0) { // 默认状态
    //   this._download(item);
    // } else if (state === 4) { // 下载完成
    //   this._deleteDownload(item);
    // } else { // 取消下载
    //   this._cancelDownload(item);
    // }
  }

  private _download(item) {
    item._s = 1; // 等待下载
    this.downloadService.addToDownloadQueue(this.bookItem, [item]);
  }

  private _deleteDownload(item) {

  }

  private _cancelDownload(item) {

  }

}
