import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App} from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { CataloggroupProvider } from '../../providers/cataloggroup';

/**
 * Generated class for the DownloadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-download',
  templateUrl: 'download.html',
})
export class DownloadPage {
  chapters: any = [];
  bookitem: any;
  catalogs : CataloggroupProvider;
  downloading : boolean = false;
  selectIds:any = [];
  rightTitle : string = '全部下载';
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiService,
    private tool: ToolService,private app: App,
  ) {
    
    console.log(this.navParams)
    this.catalogs = this.navParams.data.catalogs;
  }

  selectItem(item){
    console.log("--------------选择改变------------")
    var index = this.selectIds.indexOf(item.requestParam.chapterID)
    if (index >= 0){
      this.selectIds.splice(index, 1);
    }else {
      this.selectIds.push(item.requestParam.chapterID)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadPage');
  }

  rightBtnClick() {
    if (this.downloading == false){
      this.catalogs.downloadAll()
      this.rightTitle = '取消下载'
    }else {
      this.catalogs.cancelAll();
      this.rightTitle = '全部下载'
    }
    this.downloading = !this.downloading;
  }

  handleDownload(item){
    this.catalogs.downloadOneItem(item)
  }

  select(chapterItem){
    chapterItem.selectItem();
  }

  //选中所有
  selectAll(){
    this.catalogs.selectAll()
  }

  //反选
  unselectAll(){
    this.catalogs.unselectAll()
  }

  //反序
  reverse(){
    this.catalogs.reverse()
  }

  //下载选中
  downloadSelectitems(){
    this.catalogs.downloadSelectItems()
  }

  //连续选中
  selectMutil(){
    if (this.selectIds.length >= 2){
      let len = this.selectIds.length
      this.catalogs.selectMutil(this.selectIds[len - 1], this.selectIds[len - 2]);
    }
  }

  cancelAll(){
    this.catalogs.cancelAll();
  }
  
}
