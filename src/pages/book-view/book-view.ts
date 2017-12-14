import { Component, ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Range } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { ToolService } from '../../providers/tool-service';
import { NewbieService } from '../../providers/newbie-service';
import { Content } from 'ionic-angular';
import { Brightness } from '@ionic-native/brightness';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { ElementRef } from '@angular/core/src/linker/element_ref';

/**
 * Generated class for the BookViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book-view',
  templateUrl: 'book-view.html'
})

export class BookViewPage {

  @ViewChild(Content) contentPage: Content;
  // @ViewChild('bodyContent') bodyCotainer: ElementRef;

  theme: string = 'theme1';
  
  isNightMode: boolean = false;

  brightness: number = 50;
  tapOutside : boolean = false;
  content: string = null;
  bookdatas: any = [];
  paramData :any;
  currentIndex:number;
  saveItem: any = null;
  marginTop:number = -20;
  hasAddedToBookmark: boolean = false;
  selectmenu : number = 0;
  requestParams: any = { 
      openID:"e47d16be01ae009dbcdf696e62f9c1ecd5da4559",//设备唯一标识，可随意填一个
      isPlay : "1",
      chapterID : "ccc51fbfe2b4f5d2fd7804d0ba3d0083",
      chapterTitle : "[第003集]",
      title : "借命",
      chapterjs : "",
      chapterHref : "http:\/\/www.ysts8.com\/Yshtml\/Ys22483.html?vid=AGJ6AWV7BnFdNDUoNWZ4ATQqATB7LGAoMqQnLDNcADMpMDIsMWF8LJ7,,url=http:\/\/www.ysts8.com\/down_22483_50_1_3.html",
      chapterServer : "44c29edb103a2872f519ad0c9a0fdaaa",
      ID : "41f33a237e4af3435ba53c3d308a8cdf",
      ungz: 1
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: ApiService,
    private tool: ToolService,private app: App,
    private nbService:NewbieService,
    private brightCtrl: Brightness,
    private events: Events,
    private storage: Storage,
  ) {
    this.paramData = this.navParams.data;
    this.currentIndex = this.paramData.chapters.indexOf(this.paramData.item);

    // 初始化亮度
    this.brightCtrl.getBrightness().then((val) => {
      this.brightness = val * 100;
    }).catch();

    // 获取已经设置的主题
    this.storage.get('theme.2.name').then(val => {
      this.theme = val || 'theme1';
    })

    this.events.subscribe('theme.changed', (data) => {
      this.changeTheme(data);
      this.storage.set('theme.2.name', data.name);
    });
  }

  private changeTheme(themeData) {
    // let div = this.bodyCotainer.nativeElement as HTMLElement;
    // div.style.background = theme.background;
    // div.style.color = theme.color;
    this.theme = themeData.name;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad BookViewPage');
    this.parseParam();
    this.loadData();
    this.content = "盘古开天，造就了洪荒世界，但一个死气沉沉的洪荒并不是他所期望的样子，所以盘古以身演化洪荒，使得洪荒成为了一个山清水秀、灵气充沛的美丽世界，随着时间的流逝，洪荒之中的生灵也渐渐多了起来，这些生灵便是日后的洪荒百族。洪荒是热闹起来了，但盘古一身污血所化的无边血海却是寂静无比，最多也就是一阵风吹过，血海泛起一点波澜，这样的死气沉沉从盘古开天开始已经持续了数百万年，“啊！···”突然间，血海中心爆发出一阵尖叫，一时间沉寂许久的血海一下子变得波涛汹涌起来。血海中心，一朵血红色的巨大莲花悬浮在血海之上，十二片莲花瓣浮现着神秘的光滑，莲台之上站着一个二十出头的青年人，不，应该不能说是人，准确地说是灵魂，看着眼前的无边血海，由不得他不恐惧，要知道这个青年之前只是一个技术宅男而已。  青年叫沐森，活在新时代，长在红旗下，享受着21世纪的美好生活，时代虽然美好，但压力也是很大，房奴、车奴无处不在，沐森两者都不是，没办法，连女朋友都没有，买房买车干什么呢？对于一个伟大的技术宅男，房和车可有可无。    沐森的生活每天都是千篇一律，朝九晚五的上班，下班之后基本都是待在家里，基本没什么户外活动，但他也有自己的爱好，他喜欢钻研各种稀奇古怪或是高科技的东西，他研究过周易八卦风水秘术，也研究过简易的机器人，开发过各类游戏外挂，反正只要是他感兴趣的，他就会花时间去仔细钻研。    但是谁能想到天有不测风云，在大厦顶上看流星雨，却莫名被雷给劈了，古语云，大难不死，必有祸福，可眼前的情况是怎么回事，自己的身体怎么没了？这一切都是迷，尤其是这无边血海，虽然见过血，但却没有见过这么多，无边无际的血啊，这由不得沐森不恐惧地尖叫起来。    突然，沐森眉头一皱，脑海中多出了一段不属于他自己的记忆，越看越心惊，最后完全是一副呆滞表情，嘴张得老大老大的，完全可以塞下一个灯泡了，呆滞了许久，刚刚回过神来的沐森突然对天起誓：“大道在上，世上再无沐森，吾乃血海之主冥河是也。”    沐森，不，是冥河，冥河刚起完誓，血海之上的虚空便闪过一阵波澜，但马上便消失得无影无踪，看见此情景，冥河才松了一口气，刚刚脑海之中多出的信息正是原来这血海之主冥河老祖的传承信息，自己穿越到冥河未生的血海，大道便默认他成了血海之祖。    但他毕竟是来自后世，属于异数，为大道所不容，只能放弃以前的身份，成为洪荒中一员，只有如此才能不算是异数，但在发誓时，他也动了一个小心思，他直接向大道起誓，而非天道，如今天道新生，还没有觉醒，洪荒仍在大道掌控之下，向大道起誓，这样天道便无法知晓他的过去，这样一来，冥河也不用担心暴露自己的来历了。    既来之，则安之，这也算是冥河的一大优点，随遇而安，既然无法改变现在的事实，那就只能接受了，就好像网上流传着的一句话，生活就像强奸，当你无力反抗时，那你就躺下来享受吧，冥河要做的就是努力活下去，最好能活出精彩。    想想也是，冥河跟三清、祖巫、接引准提、女娲伏羲、帝俊太一那些人一样都是先天魔神，起点要远远高于其他洪荒生灵，但三清、接引准提和女娲成了天道圣人，而帝俊太一和十二祖巫，虽然基本上死光了，但身为巫妖首领，好歹也叱咤一个洪荒量劫，就连鲲鹏、镇元子都留下了自己的传奇故事。    而冥河呢，身为血海之主，起点本就不低，但是做的事基本成了洪荒的一个笑话，按照他知道的洪荒神话，冥河想成圣，抢劫红云，想得到红云身上作为成圣之基的鸿蒙紫气，结果惹上帝俊、太一、鲲鹏和镇元子四人，还一无所获，得不偿失。    接着女娲造人成圣，冥河也跟着造了修罗族，虽然得了功德，但却极为有限，而后三清和西方二圣立教成圣，他又跟着立了修罗教，又得了一些功德，但远远不够功德成圣所需的功德，之后又被西方二圣抢了一些修罗族人立了八部天龙，又多了地藏王菩萨这个不善的邻居，要不是因为血海不干、冥河不死的神通和六道轮回之一修罗道之主的身份，恐怕根本不能安安稳稳地偏居一隅。    但这并不是现在冥河所期望的，虽然那样可以不死，但那跟死又有什么区别呢，他前世虽然只是一个技术宅，但是他也有自己的血性，前世平平凡凡地过了二十多年，今世却不一样了，这里有着无数神话人物，有着无数前世听得耳熟能详的神话故事，他不再甘于平凡，体内的热血已经开始沸腾··呃，等等，自己好像还没有身体呢。    思绪飘了那么远，冥河到现在才想起来自己还没有身体，刚穿越到血海，他便得到了血海的认可，原本属于冥河老祖的伴生灵宝变成了他的伴生灵宝。    不得不说，冥河还是很富裕的，光是伴生灵宝便足足有四件，极品先天灵宝业火红莲，也就是他现在屁股下面坐着的那个莲花，而他头顶上悬浮着一杆旗帜，它正是先天五方旗之一的北方玄元控水旗，与业火红莲一样同属于极品先天灵宝。    业火红莲，混沌青莲破碎后，四颗莲子化为创世青莲、业火红莲、功德金莲和灭世黑莲，都是极品先天灵宝级别的十二品莲花，业火红莲能释放出无尽红莲业火，以因果业火之力焚杀一切，防御力也是顶级，端坐莲台无可匹敌，业火红莲每隔一段时间便会产生一粒莲子，以三光神水催化，最多可以长成九品莲台，但三光神水可不是那么容易得到的。    玄元控水旗，极品先天灵宝，乃是混沌青莲的莲叶所化，朦胧乾坤、遮天蔽日、诸邪避退、万法不侵，最主要的是可控天下万水，而且每隔一段时间还可产生一滴三光神水，这才是最珍贵的，除此之外，防御也极强，与戊己杏黄旗、青莲宝色旗、离地焰光旗、素色云界旗更是布下先天五行大阵。    而莲台两旁，两柄漆黑长剑护卫其左右，看似朴实无华，实则杀意若隐若现，它们便是上品先天灵宝元屠、阿鼻二剑，属于杀伐灵宝，威力要远高于一般的上品先天灵宝，二者配合，威力可比极品先天灵宝。    除此之外，冥河竟然还有半成的开天功德，要知道这可是半成大道功德，三清也不过才一人一成大道功德，而以后就算得到功德，也只是天道功德，根本比不上这大道功德，只要这大道功德不失，在这洪荒之中就相当于有了一个护身符，就是鸿钧道祖也要有所考虑。    不过想想也是，冥河这半成开天功德可不是白得的，开天之后，盘古一身的污血、开天被斩杀的魔神残血以及先天煞气都被汇聚在了血海之中，可以说，这血海完全就是一个垃圾场，大道至公，这半成开天功德也算是补偿冥河的。    但想到化形出世，冥河就不得不考虑一下了，本来冥河化形用的是血海最精华的一团血液，起点很高，但这也限制住了他的未来，这团最精华的血液中融聚了盘古污血、魔神血液以及先天煞气，杂而不纯，恐怕达到准圣境界就已经是极限了。    洪荒修行境界可以划分为炼精化气、炼气化神、炼神还虚、炼虚合道，之后便是仙人境界，地仙、天仙、真仙、玄仙、太乙玄仙、金仙、太乙金仙、大罗金仙、准圣、圣人（混元大罗金仙）、天道圣人（混元造化金仙）、大道圣人（混元无极金仙），每个境界都分为初期、中期、后期以及巅峰四小阶段。    虽然说日后洪荒之中，加上鸿钧道祖也只有七位圣人，但冥河真的甘心吗？答案当然是不甘心，既然重活一世，那就该获得轰轰烈烈，畏畏缩缩、偏安一隅，那还不如早死早超生呢。    既然想要达到更高的目标，那么有一个好的根基便是最基本的，本来用来化形的血液太过杂乱不纯，冥河要做的便是让它变得精纯，所有血液合二为一，不分彼此，虽然会失去盘古以及死去魔神的特性，但是冥河知道，只有自己的才是最好的，有得必有失。    而能让这团血液变得精纯的方法并不多，一是用先天至宝乾坤鼎重炼这团血液，乾坤鼎具有返本归元、转化后天为先天的功效，一定可以达到冥河的要求，但鬼知道这鼎在哪，所以只能pass掉。"
  }

  parseParam(){
    let item = this.paramData.chapters[this.currentIndex]
    this.requestParams.ID = this.paramData.bookitem.ID;
    this.requestParams.openID = this.paramData.bookitem.openID;
    this.requestParams.chapterjs = this.paramData.bookitem.chapterjs;
    this.requestParams.title = this.paramData.bookitem.title;
    this.requestParams.chapterID = item.chapterID;
    this.requestParams.chapterTitle = item.chapterTitle;
    this.requestParams.chapterHref = this.paramData.bookitem.chapterpre + item.chapterHref;
    this.requestParams.chapterServer = item.chapterServer;
    this.saveToHistory(item)
  }

  saveToHistory(item)
  {
    this.saveItem = JSON.parse(JSON.stringify(this.paramData));
    this.saveItem.ID = this.paramData.bookitem.ID;
    this.saveItem.item = item;
    this.saveItem.progress = 0;
    this.saveItem.type = "read";
    
    this.nbService.removeItems(NewbieService.HISTORY_KEY, [this.saveItem])
      .then(data => {
        this.nbService.addItem(NewbieService.HISTORY_KEY, this.saveItem);
      })
      .catch(error => {});

    this.nbService.hasAdded(NewbieService.BOOKMARK_KEY, this.saveItem).then((added)=>{
      this.hasAddedToBookmark = added;
    }).catch(()=>{  
      this.hasAddedToBookmark = false;
    })
  }


  loadData(): Promise<any> {
    return new Promise((resolve => {
      this.tool.showLoading('加载中...');
      this.api.get('getChapter.php', this.requestParams)
        .then(data => {
          this.tool.hideLoading();
          console.log(data);
          
          resolve(true);
        })
        .catch(error => {
          this.tool.hideLoading();
          resolve(false);
        })
    }));
  }

  tapNovel(){
    console.log("tapppppppppppppppppppp")
    this.tapOutside = !this.tapOutside;
    if (this.tapOutside == false){
      this.marginTop = -20;
    }else {
      this.marginTop = -40;
    }
    if (this.selectmenu != 0){
      this.tapOutside = !this.tapOutside;
      this.selectmenu = 0;
    }

    this.contentPage.resize();
  }

  gotoMenu(){ //目录
    this.app.getRootNavs()[0].push('BookPage', this.paramData.bookitem);
  }

  addBookmark(){ //添加到书签
    if (!this.hasAddedToBookmark){
      this.nbService.addItem(NewbieService.BOOKMARK_KEY, this.saveItem)
      .then(data => {
        this.hasAddedToBookmark = true;
        this.tool.showToast('已添加到我的书签');
      })
      .catch(error => {
        this.tool.showToast('添加书签失败');
      });
    }else {
      this.nbService.removeItems(NewbieService.BOOKMARK_KEY, [this.saveItem]).then(data=>{
        this.hasAddedToBookmark = false;
        this.tool.showToast('已从我的书签中移除');
      }).catch(error=>{
        this.tool.showToast('移除书签失败');
      })
    }
  }

  gotomarkList(){ //书签列表
    //this.app.getRootNavs()[0].push('HomePage');
  }
  
  changeBg(){ //改变背景
    this.app.getRootNavs()[0].push('ChangeBackgroundPage');
  }

  changeFont(){ //改变字体
    this.app.getRootNavs()[0].push('ReadingConfigPage');
  }

  changeLight(){  //改变亮度
    this.selectmenu = 1;

    this.contentPage.resize();
  }

  changeBrightness() {
    this.brightCtrl.setBrightness(this.brightness / 100.0);
  }

  changeNight(){ //白天黑夜切换

    this.isNightMode = !this.isNightMode;

    if (this.isNightMode) {
      this.theme = 'theme2';
      this.brightCtrl.setBrightness(0.2);
    } else {
      this.storage.get('theme.2.name').then(val => {
        this.theme = val || 'theme1';
        this.brightCtrl.setBrightness(this.brightness / 100.0);
      });
    }
    
  }

  changeToAudio(){ //听书模式

  }

  showProgress(){ //显示进度

  }

  autoScroll(){ //自动翻页

  }

}
