<template>
  <div style="position: relative;">
    <div class="loading loading-circle loading-chance" v-if="dataIsload"></div><!--数据等待加载-->
    <div class="chance_recommend_list chance_module_list" v-else-if="!dataIsload && chanceList.length>0">
      <div class="chance_recommend" :class="chance.inquiryType==1?'common':'micro_enquiries'" v-for="(chance,index) in chanceList" :key="chance">
        <i class="icon-font data-contraction contraction-left" @click="chance.isShow=true" v-if="!chance.isShow">&#xe6a9;</i>
        <i class="icon-font data-contraction contraction-bottom" @click="chance.isShow=false" v-if="chance.isShow">&#xe6a9;</i>
        <div class="left-chance-info" v-if="chance.inquiryType==1" @click.stop="chance.isShow=!chance.isShow"><!--普通询盘-->
          <span class="title rough" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null">{{chance.oriTitle}}</span>
          <span class="title" v-else>{{chance.oriTitle}}</span>
          <p class="desc" :class="!chance.isShow?'second-row-confine':''">{{chance.oriContent}}</p>
          <div class="contraction-module" v-show="chance.isShow" v-if="chance.oriContentExt!=''&&chance.oriContentExt!=null" v-html="getChanceDetail(chance.oriContentExt)">
            <!--<p class="info">公司：<span>1111</span></p>-->
          </div>
          <p class="classify" v-if="(chance.inquiryCatagory.localName!=''&&chance.inquiryCatagory.localName!=null)||(chance.inquiryCatagory.oriName!=''&&chance.inquiryCatagory.oriName!=null)">分类：{{chance.inquiryCatagory.localName || chance.inquiryCatagory.oriName}}</p>
        </div>
        <div class="left-chance-info" v-else @click.stop="chance.isShow=!chance.isShow"><!--微询盘-->
          <span class="content rough" :class="!chance.isShow?'second-row-confine':''" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null">{{chance.oriContent}}
            <a :href="link.href" v-for="(link,index) in chance.oriLink" v-if="chance.oriLink" :key="link"><span v-if="index<chance.oriLink.length-1">,</span>{{link.text}}
            </a>
          </span>
          <span class="content" :class="!chance.isShow?'second-row-confine':''" v-else>{{chance.oriContent}}
            <a :href="link.href" v-for="(link,index) in chance.oriLink" v-if="chance.oriLink" :key="link"><span v-if="index<chance.oriLink.length-1">,</span>{{link.text}}
            </a>
          </span>
          <div class="contraction-module image-list" v-show="chance.isShow" v-if="chance.oriPic&&chance.oriPic.length>0&&(chance.oriVideo==''||chance.oriVideo==null)">
            <span class="img-small-wicket" v-for="(img, index) in chance.oriPic" :key="img" @click.stop="previewImg(chance.oriPic,index)" v-show="index<2 || chance.imglistIsShow || chance.oriPic.length<4">
              <img :src="img.url"/>
              <em class="icon-font img-see">&#xe60c;</em>
            </span>
            <span class="have-image-prompting" @click.stop="previewImg(chance.oriPic,0)" v-if="chance.oriPic.length>4">+{{chance.oriPic.length-2}}</span>
          </div>
          <p v-if="chance.oriVideo&&chance.oriVideo.length>0" class="videoplay" v-show="chance.isShow">
            <span class="video" v-for="(video,index) in chance.oriVideo" :key="video" v-if="video.coverurl!=''&&video.coverurl!=null" @click.stop="videoLink(video.targeturl)">
                <img :src="video.coverurl" alt="" />
              <i class="icon-font img-see">&#xe61f;</i>
            </span>
          </p>
          <p class="revert-info">
            <span class="logo" @click.stop="linkPageHome(chance.inquiryPerson)">
              <img :src="chance.inquiryPerson.avatar" alt="" v-if="chance.inquiryPerson.avatar!=''&&chance.inquiryPerson.avatar!=null">
              <img src="/static/img/default-head.png" alt="" v-else>
            </span>
            <span class="name" @click.stop="linkPageHome(chance.inquiryPerson)" :class="{canlink: (chance.inquiryPerson.fbID!=''&&chance.inquiryPerson.fbID!=null)||(chance.inquiryPerson.fbHomepage!=''&&chance.inquiryPerson.fbHomepage!=null)}">{{chance.inquiryPerson.firstname}} {{chance.inquiryPerson.lastname}}</span>
          </p>
          <p class="desc" :class="!chance.isShow?'line-desc':''">{{chance.inquiryContent}}</p>
          <p class="classify" v-show="chance.isShow" v-if="chance.inquiryCatagory.localName!=''&&chance.inquiryCatagory.localName!=null&&chance.inquiryCatagory.oriName!=''&&chance.inquiryCatagory.oriName!=null">分类：{{chance.inquiryCatagory.localName || chance.inquiryCatagory.oriName}}</p>
        </div>
        <!--右边时间和操作模块start-->
        <div class="right-chance-module">
          <span class="time" v-if="chance.inquiryType==1">{{chance.inquiryTime | time-formater-no-hour}}</span>
          <span class="time" v-else>{{chance.inquiryTime | time-formater-no-second}}</span>
          <div class="opt_btn">
            <p class="btn-row" v-if="chance.inquiryType==1">
              <el-button type="primary" class="right_btn" size="small" @click="addPersonFunc(index,$event)" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null&&chance.inquiryPerson.email!=''&&chance.inquiryPerson.mobile!=''&&chance.inquiryPerson.phone!=''&&chance.inquiryPerson.email!=null&&chance.inquiryPerson.mobile!=null&&chance.inquiryPerson.phone!=null"><i class="icon-font" style="margin-right:4px;">&#xe6ad;</i>联系人</el-button>
              <el-button type="primary" class="right_btn" size="small" @click="selPerson(chance.inquiryPerson.contactsPersonId)" v-else-if="chance.inquiryPerson.contactsPersonId!=''&&chance.inquiryPerson.contactsPersonId!=null">查看联系人</el-button>
            </p>
            <p class="btn-row" v-else>
              <el-button type="primary" class="right_btn" size="small" @click="addPersonFunc(index,$event)" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null"><i class="icon-font" style="margin-right:4px;">&#xe6ad;</i>联系人</el-button>
              <el-button type="primary" class="right_btn" size="small" @click="selPerson(chance.inquiryPerson.contactsPersonId)" v-else>查看联系人</el-button>
            </p>
            <p class="btn-row" v-if="chance.inquiryType!=1&&((chance.inquiryPerson.fbID!=''&&chance.inquiryPerson.fbID!=null)||(chance.inquiryPerson.fbHomepage!=''&&chance.inquiryPerson.fbHomepage!=null))">
              <el-button type="default" class="right_btn" size="small" @click.stop="linkPageHome(chance.inquiryPerson)">访问主页</el-button>
            </p>
          </div>
        </div>
        <!--右边时间和操作模块end-->
      </div>
      <ImgRoastPop :imgPreview="imgPreview"></ImgRoastPop>
    </div>
    <!--暂无数据-->
    <div class="no-data" v-else-if="page==1">
      <div class="no-info chance-no-data">
        <img src="../../assets/img/monitor/no-post.png" alt="">
        <p style="margin-top: 10px;">暂无数据</p>
      </div>
    </div>
    <div class="change-page" v-if="!dataIsload && totalPages>1">
      <p class="opt-center">
        <el-button @click="prePage" :disabled="page==1?true:false">< 上一页</el-button>
        <el-button @click="nextPage" :disabled="page==totalPages?true:false">下一页 ></el-button>
      </p>
    </div>
    <!--<div class="data-float-pop" id="data-pop" v-show="infoPopIsShow">
      <span class="title">{{chanceDataTop.oriTitle}}</span>
      <p class="desc">{{chanceDataTop.oriContent}}</p>
      <div class="contraction-module">
        <p class="info">公司：<span>fawfwagawgwawagw</span></p>
        <p class="info">国家：<span>fawfwagawgwawagw</span></p>
        <p class="info">官网：<span class="blue">fawfwagawgwawagw</span></p>
      </div>
    </div>-->
  </div>
</template>

<script>
  import chanceRecommedApi from '@/api/chanceRecommedAPI'
  import ImgRoastPop from '@/components/imgRoastPop.vue'
  export default{
    name: 'chaanceRecommend',
    data () {
      return {
        imgPreview: {
          show: false,
          imgs: [],
          type: ''
        },
        chanceList: [],
        page: 1,
        size: 8,
        totalPages: 1,
        dataIsload: true,
        infoPopIsShow: false,
        chanceDataTop: {},
        isExecution: false
      }
    },
    computed: {
    },
    components: {
      ImgRoastPop
    },
    destroyed () {
    },
    mounted () {
      this.getChanceListFunc()
    },
    methods: {
      linkPageHome (obj) {
        let homepage = obj.fbHomepage
        let fbid = obj.fbID
        if (homepage !== '' && homepage !== null) {
          window.open(homepage)
        } else if (fbid !== '' && fbid !== null) {
          window.open('https://www.facebook.com/profile.php?id=' + fbid)
        }
      },
      // 视频链接跳转
      videoLink (url) {
        window.open(url)
      },
      getChanceDetail (oriContentExt) {
        var ori = JSON.parse(oriContentExt)
        let str = ''
        let itemobj = ''
        for (itemobj in ori) {
          str = str + '<p class="info">' + itemobj + '：<span>' + ori[itemobj] + '</span></p>'
        }
        return str
      },
      displayInfo (chance, type) {
        this.infoPopIsShow = true
        this.chanceDataTop = chance
        let datapop = document.getElementById('data-pop')
        datapop.style.top = window.event.screenX + 'px'
        datapop.style.left = window.event.screenY + 'px'
      },
      // 添加联系人
      addPersonFunc (index, event) {
        if (this.isExecution) {
          return
        }
        this.isExecution = true
        let inquiryPerson = this.chanceList[index].inquiryPerson
        let id = this.chanceList[index].inquiryId
        let params = {
          firstName: inquiryPerson.firstname,
          lastName: inquiryPerson.lastName,
          inquiryId: this.chanceList[index].inquiryId,
          createSource: 'commercial_opportunity_create'
        }
        if (inquiryPerson.avatar !== '' && inquiryPerson.avatar !== null) {
          params.avatar = inquiryPerson.avatar
        }
        let sociaes = []
        let homepageurl = ''
        let homepage = inquiryPerson.fbHomepage
        let fbid = inquiryPerson.fbID
        if (homepage !== '' && homepage !== null) {
          homepageurl = homepage
        } else if (fbid !== '' && fbid !== null) {
          homepageurl = 'https://www.facebook.com/profile.php?id=' + fbid
        }
        sociaes.push({'platform': 0, 'url': homepageurl, 'socialId': inquiryPerson.fbID})
        params.sociaes = JSON.stringify(sociaes)
        chanceRecommedApi.addPerson(params).then(res => {
          if (res.data.code === 0) {
            let personId = res.data.data.personId
            this.chanceList.forEach((item, index) => {
              if (item.inquiryId === id) {
                item.inquiryPerson.contactsPersonId = personId
              }
            })
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
          this.isExecution = false
        })
      },
      // 查看联系人
      selPerson (id) {
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 0, 'contactId': id}
        })
      },
      // 获取商机推荐列表
      getChanceListFunc () {
        this.chanceList = []
        this.dataIsload = true
        let params = {
          page: this.page,
          size: this.size
        }
        chanceRecommedApi.getChanceList(params).then(res => {
          if (res.data.code === 0) {
            let records = res.data.data.records
            records.forEach((item) => {
              item.isShow = false
              // item.imglistIsShow = false
              this.chanceList.push(item)
            })
            this.page = res.data.data.page
            this.totalPages = res.data.data.totalPages
          }
          this.dataIsload = false
        })
      },
      previewImg (images, index) {
        this.imgPreview.show = true
        this.imgPreview.imgs = images
        this.$store.commit('MONITOR_IMGINDEX', {index})
      },
      // 上一页
      prePage () {
        if (this.page > 1) {
          this.page = this.page - 1
          this.getChanceListFunc()
        }
      },
      // 下一页
      nextPage () {
        if (this.page < this.totalPages) {
          this.page = this.page + 1
          this.getChanceListFunc()
        }
      },
      showImgList (index) {
        this.chanceList[index].imglistIsShow = true
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/style/chance";
  .loading-chance{
    margin-top:200px;
  }
  .chance-no-data{
    padding-top:100px;
  }
  .data-float-pop{
    position: absolute;
  }
  .change-page{
    margin:30px 0;
    .opt-center{
      text-align: center;
      .el-button:nth-child(2){
        margin-left:50px;
      }
    }
  }
</style>
