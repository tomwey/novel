import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ToolService } from "../../providers/tool-service";
import { ApiService } from "../../providers/api-service";
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

  dataType: string = 'chapter';
  chapters: any = [];
  brief: string = '';
  otherSources: any = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private api: ApiService,
              private tool: ToolService,
              private app: App
    ) {
      this.bookItem = this.navParams.data;
      // console.log(this.bookItem);
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

        // this.bookItem.chapters = data.partArr[0].chapterArr;

        this.tool.hideLoading();
      })
      .catch(error => {
        this.tool.hideLoading();
      });
  }

  playAudio(item): void {
    this.app.getRootNavs()[0].push('AudioplayerPage', {bookitem:this.bookItem, chapters: this.chapters, item: item});
  }

}
