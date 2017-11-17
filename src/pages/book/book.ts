import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToolService } from "../../providers/tool-service";
import { ApiService } from "../../providers/api-service";
import { Constants } from '../../providers/constants';
import { NewbieService } from '../../providers/newbie-service';
import { File } from '@ionic-native/file';
import { CataloggroupProvider } from '../../providers/cataloggroup';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private api: ApiService,
              private tool: ToolService,
              private app: App,
              private nbService: NewbieService,
              private file:File
    ) {
      this.bookItem = this.navParams.data;
      // console.log(this.bookItem);
      this.book = JSON.parse(JSON.stringify(this.bookItem));

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

    this.bookItem.openID = '187cc0fff2b361dce805e8b0c11c7fedc30a8034';
    this.bookItem.ungz = 1;
    console.log("下载数据-----------")
    console.log(this.bookItem)
    this.api.get('getBook.php', this.bookItem)
      .then(data => {
        console.log(data);
        this.chapters = data.partArr[0].chapterArr;
        this.brief = data.brief;

        this.bookItem.bookName = data.bookName;
        this.bookItem.brief = data.brief;
        this.bookItem.chapterpre = data.chapterpre;
        this.bookItem.href = data.href;
        this.bookItem.time2 = data.time;
        this.bookItem.ts = data.ts;
        this.catalogs = new CataloggroupProvider(this.bookItem, this.chapters, this.file);
        this.catalogcapters = this.catalogs.chapters;
        console.log(this.catalogs)
        // this.bookItem.chapters = data.partArr[0].chapterArr;

        this.tool.hideLoading();
      })
      .catch(error => {
        this.tool.hideLoading();
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
      })
      .catch(error => {
        this.tool.showToast('收藏失败');
      });
    }
  }

  gotoBook(book): void {
    this.app.getRootNavs()[0].push('BookPage', book);
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
    console.log(item);
    event.stopPropagation();
  }

}
