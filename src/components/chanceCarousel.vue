<template><!--pop图片轮播弹框-->
  <div>
    <div class="swiper-box" :class="chanceList.length<=2?'heightauto':'heighthidden'">
      <div class="swiper-roll" style="top:0px;">
        <div class="chance_recommend" :class="chance.inquiryType==1?'common':'micro_enquiries'" v-for="(chance,index) in chanceList" :key="chance">
          <!--<i class="icon-font data-contraction contraction-left" @click="chance.isShow=true" v-if="!chance.isShow">&#xe6a9;</i>-->
          <!--<i class="icon-font data-contraction contraction-bottom" @click="chance.isShow=false" v-if="chance.isShow">&#xe6a9;</i>-->
          <div class="left-chance-info" v-if="chance.inquiryType==1"><!--普通询盘-->
            <span class="title mousefunc rough" @mouseover="displayChance($event, chance, 1)" @mouseleave="moveDisplayChance($event)" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null">{{chance.oriTitle}}</span>
            <span class="title mousefunc" @mouseover="displayChance($event, chance, 1)" @mouseleave="moveDisplayChance($event)" v-else>{{chance.oriTitle}}</span>
            <p class="desc" :class="!chance.isShow?'second-row-confine':''">{{chance.oriContent}}</p>
            <div class="contraction-module" v-show="chance.isShow" v-if="chance.oriContentExt!=''&&chance.oriContentExt!=null" v-html="getChanceDetail(chance.oriContentExt)">
              <!--<p class="info">公司：<span>fawfwagawgwawagw</span></p>-->
            </div>
            <p class="classify" v-if="(chance.inquiryCatagory.localName!=''&&chance.inquiryCatagory.localName!=null)||(chance.inquiryCatagory.oriName!=''&&chance.inquiryCatagory.oriName!=null)">分类：{{chance.inquiryCatagory.localName || chance.inquiryCatagory.oriName}}</p>
          </div>
          <div class="left-chance-info" v-else><!--微询盘-->
            <span class="content mousefunc rough" :class="!chance.isShow?'second-row-confine':''" @mouseover="displayChance($event, chance, 0)" @mouseleave="moveDisplayChance($event)" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null">{{chance.oriContent}}
              <a :href="link.href" v-for="(link,index) in chance.oriLink" v-if="chance.oriLink" :key="link"><span v-if="index<chance.oriLink.length-1">,</span>{{link.text}}
              </a>
            </span>
            <span class="content mousefunc" :class="!chance.isShow?'second-row-confine':''" @mouseover="displayChance($event, chance, 0)" @mouseleave="moveDisplayChance($event)" v-else>{{chance.oriContent}}
              <a :href="link.href" v-for="(link,index) in chance.oriLink" v-if="chance.oriLink" :key="link"><span v-if="index<chance.oriLink.length-1">,</span>{{link.text}}
              </a>
            </span>
            <!--图片-->
            <div class="contraction-module image-list" v-show="chance.isShow" v-if="chance.oriPic&&(chance.oriVideo==''||chance.oriVideo==null)"><!--优先展示vido,没有vido才展示图片-->
              <span class="img-small-wicket" v-for="(img, index) in chance.oriPic" :key="img" @click.stop="previewImg(chance.oriPic,index)" v-show="index<2 || chance.imglistIsShow || chance.oriPic.length<4">
                <img :src="img.url" />
                <em class="icon-font img-see">&#xe60c;</em>
              </span>
              <span class="have-image-prompting" @click.stop="previewImg(chance.oriPic,0)" v-show="!chance.imglistIsShow" v-if="chance.oriPic.length>4">+{{chanceDataLimit.oriPic.length-2}}</span>
            </div>
            <p v-if="chance.oriVideo!=''&&chance.oriVideo!=null&&chance.oriVideo.length>0" class="videoplay" v-show="chance.isShow">
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
              <span class="name" @click.stop="linkPageHome(chance.inquiryPerson)" :class="{canlink: chance.inquiryPerson.fbID!=''&&chance.inquiryPerson.fbID!=null}">{{chance.inquiryPerson.firstname}} {{chance.inquiryPerson.lastname}}</span>
            </p>
            <p class="desc" :class="!chance.isShow?'line-desc':''">{{chance.inquiryContent}}</p>
            <p class="classify" v-show="chance.isShow" v-if="chance.inquiryCatagory.localName!=''&&chance.inquiryCatagory.localName!=null&&chance.inquiryCatagory.oriName!=''&&chance.inquiryCatagory.oriName!=null">分类：{{chance.inquiryCatagory.localName || chance.inquiryCatagory.oriName}}</p>
          </div>
          <div class="right-chance-module">
            <span class="time" v-if="chance.inquiryType==1">{{chance.inquiryTime | time-formater-no-hour}}</span>
            <span class="time" v-else>{{chance.inquiryTime | time-formater-no-second}}</span>
            <div class="opt_btn">
              <p class="btn-row" v-if="chance.inquiryType==1">
                <el-button type="primary" class="right_btn" size="small" @click="addPersonFunc(index, $event)" v-if="chance.inquiryPerson.contactsPersonId==''||chance.inquiryPerson.contactsPersonId==null&&chance.inquiryPerson.email!=''&&chance.inquiryPerson.mobile!=''&&chance.inquiryPerson.phone!=''&&chance.inquiryPerson.email!=null&&chance.inquiryPerson.mobile!=null&&chance.inquiryPerson.phone!=null"><i class="icon-font" style="margin-right:4px;">&#xe6ad;</i>联系人</el-button>
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
        </div>
        <!--微询盘图片弹框-->
        <ImgRoastPop :imgPreview="imgPreview"></ImgRoastPop>
      </div>
    </div>
    <!--普通询盘浮层-->
    <div class="chance-limit-pop" v-if="chanceDataType==1" @mouseover="displayChanceTwo($event)" @mouseleave="moveDisplayChance($event)"><!--普通询盘浮层弹框-->
      <span class="title rough" v-if="chanceDataLimit.inquiryPerson.contactsPersonId==''||chanceDataLimit.inquiryPerson.contactsPersonId==null">{{chanceDataLimit.oriTitle}}</span>
      <span class="title" v-else>{{chanceDataLimit.oriTitle}}</span>
      <p class="desc">{{chanceDataLimit.oriContent}}</p>
      <div class="contraction-module" v-if="chanceDataLimit.oriContentExt!=''&&chanceDataLimit.oriContentExt!=null" v-html="getChanceDetail(chanceDataLimit.oriContentExt)">
      </div>
      <p class="classify" v-if="chanceDataLimit.inquiryCatagory.localName!=''&&chanceDataLimit.inquiryCatagory.localName!=null&&chanceDataLimit.inquiryCatagory.oriName!=''&&chanceDataLimit.inquiryCatagory.oriName!=null">分类：{{chanceDataLimit.inquiryCatagory.localName || chanceDataLimit.inquiryCatagory.oriName}}</p>
    </div>
    <!--微询盘浮层-->
    <div class="chance-limit-pop" @mouseover="displayChanceTwo($event)" @mouseleave="moveDisplayChance($event)" v-else>
      <span class="content rough" v-if="chanceDataLimit.inquiryPerson.contactsPersonId==''||chanceDataLimit.inquiryPerson.contactsPersonId==null">{{chanceDataLimit.oriContent}}
        <a :href="link.href" v-for="(link,index) in chanceDataLimit.oriLink" v-if="chanceDataLimit.oriLink" :key="link"><span v-if="index<chanceDataLimit.oriLink.length-1">,</span>{{link.text}}
        </a>
      </span>
      <span class="content" v-else>{{chanceDataLimit.oriContent}}
        <a :href="link.href" v-for="(link,index) in chanceDataLimit.oriLink" v-if="chanceDataLimit.oriLink" :key="link"><span v-if="index<chanceDataLimit.oriLink.length-1">,</span>{{link.text}}
        </a>
      </span>
      <div class="contraction-module image-list" v-if="chanceDataLimit.oriPic&&chanceDataLimit.oriPic.length>0&&(chanceDataLimit.oriVideo==''||chanceDataLimit.oriVideo==null)"><!--优先展示vido,没有vido才展示图片-->
        <span class="img-small-wicket" v-for="(img, index) in chanceDataLimit.oriPic" :key="img" @click.stop="previewImg(chanceDataLimit.oriPic,index)" v-show="index<2 || chanceDataLimit.imglistIsShow || chanceDataLimit.oriPic.length<4">
          <img :src="img.url" />
          <em class="icon-font img-see">&#xe60c;</em>
        </span>
        <span class="have-image-prompting" @click.stop="previewImg(chanceDataLimit.oriPic,0)" v-if="chanceDataLimit.oriPic.length>4">+{{chanceDataLimit.oriPic.length-2}}</span>
      </div>
      <p v-if="chanceDataLimit.oriVideo!=''&&chanceDataLimit.oriVideo!=null&&chanceDataLimit.oriVideo.length>0" class="videoplay">
        <span class="video" v-for="(video,index) in chanceDataLimit.oriVideo" :key="video" v-if="video.coverurl!=''&&video.coverurl!=null" @click.stop="videoLink(video.targeturl)">
            <img :src="video.coverurl" alt="" />
            <i class="icon-font img-see">&#xe61f;</i>
        </span>
      </p>
      <p class="revert-info">
        <span class="logo" @click.stop="linkPageHome(chanceDataLimit.inquiryPerson)">
          <img :src="chanceDataLimit.inquiryPerson.avatar" alt="" v-if="chanceDataLimit.inquiryPerson.avatar!=''&&chanceDataLimit.inquiryPerson.avatar!=null">
          <img src="/static/img/default-head.png" alt="" v-else>
        </span>
        <span class="name" @click.stop="linkPageHome(chanceDataLimit.inquiryPerson)" :class="{canlink: chanceDataLimit.inquiryPerson.fbID!=''&&chanceDataLimit.inquiryPerson.fbID!=null}">{{chanceDataLimit.inquiryPerson.firstname}} {{chanceDataLimit.inquiryPerson.lastname}}</span>
      </p>
      <p class="desc">{{chanceDataLimit.inquiryContent}}</p>
      <p class="classify" v-if="chanceDataLimit.inquiryCatagory.localName!=''&&chanceDataLimit.inquiryCatagory.localName!=null&&chanceDataLimit.inquiryCatagory.oriName!=''&&chanceDataLimit.inquiryCatagory.oriName!=null">分类：{{chanceDataLimit.inquiryCatagory.localName || chanceDataLimit.inquiryCatagory.oriName}}</p>
    </div><!--微询盘浮层弹框-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import chanceRecommedApi from '@/api/chanceRecommedAPI'
  import ImgRoastPop from '@/components/imgRoastPop.vue'
  export default{
    props: {
      chanceList: Array
    },
    data () {
      return {
        imgPreview: {
          show: false,
          imgs: []
        },
        cycleObj: '',
        chancePage: 1,
        chanceSize: 10,
        dataIsload: true,  // 商机推荐数据是否正在加载
        chanceDataLimit: {
          inquiryCatagory: {},
          inquiryPerson: {},
          oriPic: [],
          oriVideo: []
        },
        chanceDataType: -1,
        isExecution: false
      }
    },
    mounted () {
      if (this.chanceList.length > 2) {
        this.windowPageChange()
        this.updateChanceList()
      }
    },
    components: {
      ImgRoastPop
    },
    computed: {
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
      displayChanceTwo (event) {
        if (event.target !== event.currentTarget) {
          return
        }
        event.target.style.display = 'block'
      },
      // 鼠标移开，商机推荐提示弹框消失
      moveDisplayChance (event) {
        // let classname = event.target.className
        let chancelimitpop = document.getElementsByClassName('chance-limit-pop')[0]
        chancelimitpop.style.display = 'none'
      },
      // 鼠标移动 商机推荐提示弹框
      displayChance (event, chance, type) {
        // let classname = event.target.className
        // if (classname === 'left-chance-info') {
        // let nextSbiling = event.target.nextElementSibling
        // nextSbiling.style.display = 'block'
        // }
        this.chanceDataLimit = chance
        this.chanceDataType = type
        event = event || window.event
        let leftX = 0
        let topY = 0
        if (event.pageX || event.pageY) {
          leftX = event.pageX
          topY = event.pageY
        } else {
          leftX = event.clientX + document.body.scrollLeft - document.body.clientLeft
          topY = event.clientY + document.body.scrollTop - document.body.clientTop
        }
        // let screenY = event.screenY
        let chancelimitpop = document.getElementsByClassName('chance-limit-pop')[0]
        chancelimitpop.style.display = 'block'
        chancelimitpop.style.top = topY + 'px'
        chancelimitpop.style.left = leftX + 'px'
      },
      // 商机查看图片
      previewImg (images, index) {
        this.imgPreview.show = true
        this.imgPreview.imgs = images
        this.$store.commit('MONITOR_IMGINDEX', {index})
      },
      // 商机查看联系人
      // 查看联系人
      selPerson (id) {
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 0, 'contactId': id}
        })
      },
      // 商机列表添加联系人
      addPersonFunc (index, event) {
        if (this.isExecution) {
          return
        }
        this.isExecution = true
        let inquiryPerson = this.chanceList[index].inquiryPerson
        let params = {
          firstName: inquiryPerson.firstname + '' + inquiryPerson.lastname,
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
            this.chanceList[index].inquiryPerson.contactsPersonId = personId
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('updatePie')
          }
          this.isExecution = false
        })
      },
      // 获取商机推荐列表
      getChanceListFunc () {
        let params = {
          page: this.chancePage,
          size: this.chanceSize
        }
        chanceRecommedApi.getChanceList(params).then(res => {
          if (res.data.code === 0) {
            let records = res.data.data.records
            records.forEach((item) => {
              item.isShow = false
              item.imglistIsShow = false
              this.chanceList.push(item)
            })
            if (this.chanceList.length > 2) {
              this.updateChanceList()
            }
          }
          this.dataIsload = false
        })
      },
      // 商机推荐数据更新
      updateChanceList () {
        // let swiperroll = document.getElementsByClassName('swiper-roll')[0]
        Vue.nextTick(() => {
          let chanceListObj = document.getElementsByClassName('home-chance')
          if (chanceListObj.length > 0) {
            this.cycleObj = setInterval(() => {  // 初始化循环更新数据
              setTimeout(() => {
                this.moveDiv()
              }, 10)
            }, 4000)
            chanceListObj[0].addEventListener('mousemove', () => {  // 鼠标移入循环更新介绍
              let cycleObj = this.cycleObj
              clearInterval(cycleObj)
            })
            chanceListObj[0].addEventListener('mouseleave', () => { // 鼠标移出继续循环更新
              this.cycleObj = setInterval(() => {  // 初始化循环更新数据
                setTimeout(() => {
                  this.moveDiv()
                }, 10)
              }, 4000)
            })
          }
        })
      },
      // 向上动画跑马灯
      moveDiv () {
        let swiperroll = document.getElementsByClassName('swiper-roll')[0]
        let solid = document.getElementsByClassName('chance_recommend')[0]
        if (solid === undefined || swiperroll === undefined) {
          let cycleObj = this.cycleObj
          clearInterval(cycleObj)
          return
        }
        let soildhieght = solid.clientHeight
        let topscoll = soildhieght * (-1)
        let xPos = parseInt(swiperroll.style.top)
        if (xPos === topscoll || xPos < topscoll) {
          let obj = this.chanceList[0]
          this.chanceList.shift()
          this.chanceList.push(obj)
          swiperroll.style.top = '0px'
          return true
        }
        xPos = xPos - 1
        swiperroll.style.top = xPos + 'px'
        setTimeout(() => { this.moveDiv() }, 10)
      },
      // 可视化窗口变更（跑马灯处理）
      windowPageChange () {
        let hidden, visibilityChange
        if (typeof document.hidden !== 'undefined') { // Opera 12.10
          hidden = 'hidden'
          visibilityChange = 'visibilitychange'
        } else if (typeof document.msHidden !== 'undefined') {
          hidden = 'msHidden'
          visibilityChange = 'msvisibilitychange'
        } else if (typeof document.webkitHidden !== 'undefined') {
          hidden = 'webkitHidden'
          visibilityChange = 'webkitvisibilitychange'
        }
        if (typeof document.addEventListener === 'undefined' || typeof document[hidden] === 'undefined') {
        } else {
          document.addEventListener(visibilityChange, () => {
            if (document[hidden]) {
              let cycleObj = this.cycleObj
              clearInterval(cycleObj)
            } else {
              this.cycleObj = setInterval(() => {
                setTimeout(() => {
                  this.moveDiv()
                }, 10)
              }, 4000)
            }
          }, false)
        }
      }
    }
  }
</script>

