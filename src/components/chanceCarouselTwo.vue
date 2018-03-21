<template><!--pop图片轮播弹框-->
  <div>
    <div class="cross-swiper-box">
      <div class="cross-swiper-roll">
        <div class="solid-enquiries" style="right:0px">
          <div class="solid" v-for="(enquirie,index) in chanceList" :key="enquirie">
            <!--普通询盘-->
            <div class="top_info common_top" v-if="enquirie.enquiryType==1">
              <p class="title" v-if="enquirie.enquiryCompany.contactsPersonId==''||enquirie.enquiryCompany.contactsPersonId==null" :title="enquirie.oriTitle">{{enquirie.oriTitle}}</p>
              <p class="desc second-row-confine" v-if="enquirie.enquiryContent!=''&&enquirie.enquiryContent!=null" v-html="enquirie.enquiryContent">
              </p>
              <p class="desc second-row-confine" v-else>暂无数据</p>
              <!--<div class="contraction-module" v-show="enquirie.isShow" v-if="enquirie.oriContentExt!=''&&enquirie.oriContentExt!=null">-->
                <!--<div v-for="oriObj in oriContentExtObjs" class="info">-->
                  <!--<p v-if="oriObj.key=='邮箱'">-->
                    <!--<span>{{oriObj.key}}&nbsp;:&nbsp;</span>-->
                    <!--<span v-if="oriObj.value!=''&&oriObj.value!=null">{{oriObj.value}}</span>-->
                    <!--<span v-else-if="emial!=''&&email!=null">{{email}}</span>-->
                    <!--<span v-else class="info_desc">-->
                    <!--<el-button type="primary" size="small" @click="emailGigFunc">邮箱深度挖掘</el-button>-->
                     <!--</span>-->
                  <!--</p>-->
                  <!--<p v-else>-->
                    <!--<span>{{oriObj.key}}:</span>-->
                    <!--<span class="info_desc">{{oriObj.value}}</span>-->
                  <!--</p>-->
                <!--</div>-->
              <!--</div>-->
              <p class="classify" :class="!enquirie.isShow?'one-row-confine':''" v-if="(enquirie.enquiryCatagory.localName!=''&&enquirie.enquiryCatagory.localName!=null)||(enquirie.enquiryCatagory.oriName!=''&&enquirie.enquiryCatagory.oriName!=null)">分类：{{enquirie.enquiryCatagory.localName || enquirie.enquiryCatagory.oriName}}</p>
            </div>
            <!--微询盘-->
            <div class="top_info micro_top" v-else>
              <div class="left_display" v-if="enquirie.oriVideo&&enquirie.oriVideo.length>0">
                <i class="icon-font vedio_display">&#xe61f;</i>
                <img :src="vedio.coverurl" v-for="(vedio, index) in enquirie.oriVideo" v-if="index==0" @click.stop="videoLink(vedio.targeturl)" :class="{'canclick':vedio.targeturl!=''&&vedio.targeturl!=null}" />
              </div>
              <div class="left_display" :class="{'image_displays':enquirie.oriPic&&enquirie.oriPic.length>1}" v-else-if="enquirie.oriPic&&enquirie.oriPic.length>0">
                <img :src="img.url" v-for="(img, index) in enquirie.oriPic" v-if="index==0" />
              </div>
              <div class="middel_info confine-width-one">
                <p class="content rough second-row-confine" v-if="enquirie.enquiryPerson.contactsPersonId==''||enquirie.enquiryPerson.contactsPersonId==null">
                  {{enquirie.oriContent==''?'暂无数据':enquirie.oriContent}}
                  <a :href="getLinkUrl(link.text)" v-for="(link,index) in enquirie.oriLink" :key="link" target="_blank" v-if="enquirie.oriLink&&link.href!=''&&link.href!=null"><span v-if="index!==0">,</span>{{link.text}}
                  </a>
                </p>
                <p class="content second-row-confine" v-else>
                  {{enquirie.oriContent==''?'暂无数据':enquirie.oriContent}}
                  <a :href="getLinkUrl(link.text)" v-for="(link,index) in enquirie.oriLink" :key="link" target="_blank" v-if="enquirie.oriLink&&link.href!=''&&link.href!=null"><span v-if="index!==0">,</span>{{link.text}}
                  </a>
                </p>
                <p class="info">
                <span class="logo canclick" @click.stop="linkPageHome(enquirie.enquiryPerson)">
                  <img :src="enquirie.enquiryPerson.avatar" alt="" v-if="enquirie.enquiryPerson.avatar!=''&&enquirie.enquiryPerson.avatar!=null">
                  <img src="/static/img/default-head.png" alt="" v-else>
                </span>
                <span class="name one-row-confine text_canclick" @click.stop="linkPageHome(enquirie.enquiryPerson)">
                  {{enquirie.enquiryPerson.firstname}} {{enquirie.enquiryPerson.lastname}}
                </span>
                </p>
                <p class="desc one-row-confine">{{enquirie.enquiryContent}}</p>
              </div>
            </div>
            <div class="bottom_opt">
              <span class="time" v-if="enquirie.enquiryType==1"><i class="icon-font">&#xe67f;</i>{{enquirie.enquiryTime | time-formater-no-hour}}</span>
              <span class="time" v-else><i class="icon-font">&#xe67f;</i>{{enquirie.enquiryTime | time-formater-no-second}}</span>
              <span class="right_double_btn" v-if="enquirie.enquiryType==1">
                 <el-button type="default" class="right_btn" size="small" @click.stop="displayChance(index,enquirie,enquirie.enquiryType)" v-if="!enquirie.isShow">查看</el-button>
                 <el-button type="default" class="right_btn" size="small" @click.stop="enquirie.isShow=false" v-if="enquirie.isShow">收起</el-button>
                 <el-button type="primary" class="right_btn" size="small" @click.stop="addCompanyFunc(enquirie, $event)" v-if="isShowAdd (enquirie)">
                   <i class="icon-font">&#xe6ad;</i>联系人
                 </el-button>
                 <el-button type="primary" class="right_btn" size="small" @click.stop="selCompany(enquirie)" v-if="!isShowAdd (enquirie)">查看联系人</el-button>
              </span>
              <span class="right_double_btn" v-else>
                 <el-button type="default" class="right_btn" size="small" @click.stop="displayChance(index,enquirie,enquirie.enquiryType)" v-if="!enquirie.isShow">查看</el-button>
                 <el-button type="default" class="right_btn" size="small" @click.stop="enquirie.isShow=false" v-if="enquirie.isShow">收起</el-button>
                 <el-button type="primary" class="right_btn" size="small" @click.stop="addPersonFunc(enquirie, $event)" v-if="enquirie.enquiryPerson.contactsPersonId==''||enquirie.enquiryPerson.contactsPersonId==null">
                   <i class="icon-font">&#xe6ad;</i>联系人
                 </el-button>
                 <el-button type="primary" class="right_btn" size="small" @click.stop="selPerson(enquirie.enquiryPerson.contactsPersonId)" v-else-if="enquirie.enquiryPerson.contactsPersonId!=''&&enquirie.enquiryPerson.contactsPersonId!=null">查看联系人</el-button>
              </span>
          </div>
          </div>
        </div>
      </div>
    </div>
    <!--询盘详情弹框-->
    <div class="info-pop" v-if="popIsShow">
      <div class="pop-content">
        <span class="icon-font left_cancel" @click.stop="cancelPop">&#xe62c;</span>
        <div class="middel_info confine_width540" v-if="chanceDataLimit.enquiryType==1">
          <p class="title">{{chanceDataLimit.oriTitle}}</p>
          <p class="desc" v-html="chanceDataLimit.enquiryContent"></p>
          <div class="contraction-module">
          <div v-for="oriObj in oriContentExtObjs" class="info" v-if="oriContentExtObjs.length>0">
            <span>{{oriObj.key}}:</span>
            <span class="info_desc">{{oriObj.value}}</span>
            <!--<p v-if="oriObj.key=='邮箱'">-->
              <!--<span>{{oriObj.key}}&nbsp;:&nbsp;</span>-->
              <!--<span v-if="oriObj.value!=''&&oriObj.value!=null">{{oriObj.value}}</span>-->
              <!--<span v-else-if="email!=''&&email!=null">{{email}}</span>-->
              <!--<span v-else class="info_desc">-->
                <!--<el-button type="primary" size="small" @click.stop="emailGigFunc(chanceDataLimit.enquiryCompany.domain)">邮箱深度挖掘</el-button>-->
              <!--</span>-->
            <!--</p>-->
            <!--<p v-else>-->
              <!--<span>{{oriObj.key}}:</span>-->
              <!--<span class="info_desc">{{oriObj.value}}</span>-->
            <!--</p>-->
          </div>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.name">
              <span>公司：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.name}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryPerson.firstname!==''&&chanceDataLimit.enquiryPerson.firstname!==null">
              <span>联系人：</span><span class="info_desc">{{chanceDataLimit.enquiryPerson.firstname}}{{chanceDataLimit.enquiryPerson.lastname}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.mail">
              <span>邮箱：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.mail}}</span>
            </p>
            <p class="info" v-if="(chanceDataLimit.enquiryCompany.mail==''||chanceDataLimit.enquiryCompany.mail==null)&&chanceDataLimit.enquiryCompany.domain!==''&&chanceDataLimit.enquiryCompany.domain!==null">
              <span>邮箱：</span>
              <span v-if="email!=''&&email!=null" class="info_desc">{{email}}</span>
              <span v-else class="info_desc"><el-button type="primary" size="small" @click="emailGigFunc(chanceDataLimit)" :disabled="chanceDataLimit.isMining">邮箱深度挖掘</el-button></span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.addressCountry">
              <span>国家：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.addressCountry}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.addressLocality">
              <span>地址：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.streetAddress}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.telephone">
              <span>电话：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.telephone}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.fax">
              <span>传真：</span><span class="info_desc">{{chanceDataLimit.enquiryCompany.fax}}</span>
            </p>
            <p class="info" v-if="chanceDataLimit.enquiryCompany.website">
              <span>官网：</span><span class="info_desc text_canclick"><a :href="chanceDataLimit.enquiryCompany.website" target="_blank">{{chanceDataLimit.enquiryCompany.website}}</a></span>
            </p>
        </div>
          <p class="classify" :class="!chanceDataLimit.isShow?'one-row-confine':''" v-if="(chanceDataLimit.enquiryCatagory.localName!=''&&chanceDataLimit.enquiryCatagory.localName!=null)||(chanceDataLimit.enquiryCatagory.oriName!=''&&chanceDataLimit.enquiryCatagory.oriName!=null)">分类：{{chanceDataLimit.enquiryCatagory.localName || chanceDataLimit.enquiryCatagory.oriName}}</p>
          <span class="common_time"><i class="icon-font">&#xe67f;</i>{{chanceDataLimit.enquiryTime | time-formater-no-hour}}</span>
        </div>
        <div class="middel_info confine_width540" v-else>
          <p class="time"><i class="icon-font">&#xe67f;</i>{{chanceDataLimit.enquiryTime | time-formater-no-second}}</p>
          <p class="content rough" v-if="chanceDataLimit.enquiryPerson.contactsPersonId==''||chanceDataLimit.enquiryPerson.contactsPersonId==null">
            {{chanceDataLimit.oriContent==''?'暂无数据':chanceDataLimit.oriContent}}
            <a :href="getLinkUrl(link.text)" v-for="(link,index) in chanceDataLimit.oriLink" v-if="chanceDataLimit.oriLink&&link.href!=''&&link.href!=null" :key="link" target="_blank"><span v-if="index!==0">,</span>{{link.text}}
            </a>
          </p>
          <p class="content" v-else>
            {{chanceDataLimit.oriContent==''?'暂无数据':chanceDataLimit.oriContent}}
            <a :href="getLinkUrl(link.text)" v-for="(link,index) in chanceDataLimit.oriLink" v-if="chanceDataLimit.oriLink&&link.href!=''&&link.href!=null" :key="link" target="_blank"><span v-if="index!==0">,</span>{{link.text}}
            </a>
          </p>
          <carouselChange v-if="chanceDataLimit.oriPic&&chanceDataLimit.oriPic.length>0&&(chanceDataLimit.oriVideo==''||chanceDataLimit.oriVideo==null)" :imageList="chanceDataLimit.oriPic"></carouselChange>
          <p class="video" v-else v-for="(vedio, index) in chanceDataLimit.oriVideo" v-if="vedio.coverurl!=''&&vedio.coverurl!=null" @click.stop="videoLink(vedio.targeturl)">
            <i class="icon-font big_vedio_display">&#xe61f;</i>
            <img :src="vedio.coverurl" />
          </p>
          <p class="info_details">
            <span class="logo canclick" @click.stop="linkPageHome(chanceDataLimit.enquiryPerson)">
              <img :src="chanceDataLimit.enquiryPerson.avatar" alt="" v-if="chanceDataLimit.enquiryPerson.avatar!=''&&chanceDataLimit.enquiryPerson.avatar!=null">
              <img src="/static/img/default-head.png" alt="" v-else>
            </span>
            <span class="name one-row-confine canclick" @click.stop="linkPageHome(chanceDataLimit.enquiryPerson)" v-if="chanceDataLimit.enquiryPerson">
              {{chanceDataLimit.enquiryPerson.firstname}}
            </span>
          </p>
          <p class="desc">{{chanceDataLimit.enquiryContent}}</p>
        </div>
        <div class="pop_left_module" v-if="chanceDataLimit.enquiryType==1">
          <el-button type="primary" class="right_btn" size="small" @click.stop="addCompanyFunc(chanceDataLimit, $event)" v-show="isShowAdd(chanceDataLimit)">
            <i class="icon-font">&#xe6ad;</i>联系人
          </el-button>
          <el-button type="primary" class="right_btn" size="small" @click.stop="selCompany(chanceDataLimit)" v-show="!isShowAdd(chanceDataLimit)">查看联系人</el-button>
        </div>
        <div class="pop_left_module" v-if="chanceDataLimit.enquiryType==2">
          <el-button type="primary" class="right_btn" size="small" @click.stop="addPersonFunc(chanceDataLimit, $event)" v-if="chanceDataLimit.enquiryPerson.contactsPersonId==''||chanceDataLimit.enquiryPerson.contactsPersonId==null">
            <i class="icon-font">&#xe6ad;</i>联系人
          </el-button>
          <el-button type="primary" class="right_btn" size="small" @click.stop="selPerson(chanceDataLimit.enquiryPerson.contactsPersonId)" v-else-if="chanceDataLimit.enquiryPerson.contactsPersonId!=''&&chanceDataLimit.enquiryPerson.contactsPersonId!=null">查看联系人</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import enquiriesAPI from '@/api/enquiriesAPI'
//  import ImgRoastPop from '@/components/imgRoastPop.vue'
  import carouselChange from '@/components/carouselChange/carouselChange.vue'
  import Util from '@/common/Util.js'
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
          enquiryCatagory: {},
          enquiryPerson: {},
          oriPic: [],
          oriVideo: []
        },
        oriContentExtObjs: [],
        chanceDataType: -1,
        isExecution: false,
        popIsShow: false,
        checkIndex: -1,
        email: '',
        isAddIng: false,  // 联系人是否正在添加中
        isChangePage: false
      }
    },
    mounted () {
      this.isChangePage = false
      if (this.chanceList.length > 3) {
        this.windowPageChange()
        this.updateChanceList()
        // this.getChanceListFunc()
      }
    },
    components: {
      carouselChange
    },
    computed: {
    },
    destroyed () {
      let cycleObj = this.cycleObj
      clearInterval(cycleObj)
    },
    methods: {
      getLinkUrl (url) {
        return Util.checkUrl(url)
      },
      isShowAdd (obj) {
        let enquiryCompany = obj.enquiryCompany
        let enquiryPerson = obj.enquiryPerson
        if ((enquiryPerson.contactsPersonId === '' || enquiryPerson.contactsPersonId === null) && (enquiryCompany.contactsCompanyId === '' || enquiryCompany.contactsCompanyId === null)) {  // 已添加
          return true
        }
        if ((enquiryCompany.telephone !== '' && enquiryCompany.telephone !== null) || (enquiryCompany.mail !== '' && enquiryCompany.mail !== null)) {   // 有邮箱或者电话才可能添加联系人
          if (enquiryPerson.firstname !== '' && enquiryPerson.firstname !== null && enquiryPerson.contactsPersonId !== '' && enquiryPerson.contactsPersonId !== null) {  // 联系人
            return false
          } else if ((enquiryPerson.firstname === '' || enquiryPerson.firstname === null) && enquiryCompany.contactsCompanyId !== '' && enquiryCompany.contactsCompanyId !== null) {  // 公司
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
      // 普通询盘深度挖掘
      emailGigFunc (obj) {
        let enquiryCompany = obj.enquiryCompany
        let enquiryPerson = obj.enquiryPerson
        let params = {
          domain: enquiryCompany.domain
        }
        if (enquiryPerson.firstname !== '' && enquiryPerson.firstname !== null) {  // 普通询盘  联系人邮箱挖掘
          params.firstname = enquiryPerson.firstname
          params.lastname = enquiryPerson.lastname
          enquiriesAPI.emailPersonGig(params).then(res => {
            if (res.data.code === 0) {
              let mail = res.data.data.mail
              // enquiryCompany.mail = mail
              if (mail !== '' && mail !== null) { // 挖掘数据成功
                this.email = mail
              } else {   // 没有挖掘到数据
                this.$message({message: '很抱歉，没有挖掘到数据'})
              }
            } else {
              this.$message({
                message: '数据挖掘失败',
                type: 'error'
              })
            }
            obj.isMining = true
            this.chanceList[this.checkIndex].isMining = true
          })
        } else {
          enquiriesAPI.emailCommendGig(params).then(res => {
            if (res.data.code === 0) {
              let mail = res.data.data.mail
              // enquiryCompany.mail = mail
              if (mail !== '' && mail !== null) { // 挖掘数据成功
                this.email = mail
              } else {   // 没有挖掘到数据
                this.$message({message: '很抱歉，没有挖掘到数据'})
              }
            } else {
              this.$message({
                message: '数据挖掘失败',
                type: 'error'
              })
            }
            obj.isMining = true
            this.chanceList[this.checkIndex].isMining = true
          })
        }
//        this.oriContentExtObjs[2].value = '312541415@qq.com'
//        this.email = '312541415@qq.com'
//        console.log(this.oriContentExtObjs[2].value)
      },
      // 视频链接跳转
      videoLink (url) {
        window.open(url)
      },
      // 商机推荐数据更新
      updateChanceList () {
        // let swiperroll = document.getElementsByClassName('swiper-roll')[0]
        Vue.nextTick(() => {
          let chanceListObj = document.getElementsByClassName('home-chance')
          if (chanceListObj.length > 0) {
            let cycleObj = this.cycleObj
            clearInterval(cycleObj)
            this.cycleObj = setInterval(() => {  // 初始化循环更新数据
              this.moveDiv()
            }, 5000)
            chanceListObj[0].addEventListener('mousemove', () => {  // 鼠标移入循环更新介绍
              let cycleObj = this.cycleObj
              clearInterval(cycleObj)
            })
            chanceListObj[0].addEventListener('mouseleave', () => { // 鼠标移出继续循环更新
              let cycleObj = this.cycleObj
              clearInterval(cycleObj)
              if (!this.popIsShow) {
                this.cycleObj = setInterval(() => {  // 初始化循环更新数据
                  this.moveDiv()
                }, 5000)
              }
            })
          }
        })
      },
      // 向左动画跑马灯
      moveDiv () {
        if (this.popIsShow) {
          let cycleObj = this.cycleObj
          clearInterval(cycleObj)
          return
        }
        let swiperroll = document.getElementsByClassName('solid-enquiries')[0]
        let solid = document.getElementsByClassName('solid')[0]
        if (solid === undefined || swiperroll === undefined) {
          let cycleObj = this.cycleObj
          clearInterval(cycleObj)
          return
        }
        let soildhieght = solid.clientWidth

        let leftscoll = soildhieght + 19
        let xPos = parseInt(swiperroll.style.right)
        if (xPos === leftscoll || xPos > leftscoll) {
          let obj = this.chanceList[0]
          this.chanceList.shift()
          this.chanceList.push(obj)
          swiperroll.style.right = '0px'
          return true
        }
        xPos = xPos + 8
        swiperroll.style.right = xPos + 'px'
        setTimeout(() => {
          this.moveDiv()
        }, 10)
      },
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
              this.isChangePage = false
            } else {
              if (!this.isChangePage) {
                console.log('baowei')
                this.isChangePage = true
                let cycleObj = this.cycleObj
                clearInterval(cycleObj)
                this.cycleObj = setInterval(() => {
                  this.moveDiv()
                }, 5000)
              }
            }
          }, false)
        }
      },
      cancelPop () {
        this.popIsShow = false
        this.checkIndex = -1
        this.email = ''
        let cycleObj = this.cycleObj
        if (this.chanceList.length > 3) {
          clearInterval(cycleObj)
          this.cycleObj = setInterval(() => {
            this.moveDiv()
          }, 5000)
        }
      },
      // 商机推荐查看弹框
      displayChance (index, chance, type) {
        this.chanceDataLimit = chance
        if (type === 1) {
          this.getOriContentExtObjs()
        }
        this.chanceDataType = type
        this.popIsShow = true
        this.checkIndex = index
        let cycleObj = this.cycleObj
        clearInterval(cycleObj)
      },
      getOriContentExtObjs () {
        // return JSON.parse(this.commonEnquirie.oriContentExt)
        let objArray = []
//        let emailObj = {}
//        let isHaveEmail = false
//        let commonConpanyInfo = this.chanceDataLimit.enquiryCompany
//        if (commonConpanyInfo.name !== '' && commonConpanyInfo.name !== null) {
//          let obj = {
//            key: '公司',
//            value: commonConpanyInfo.name
//          }
//          objArray.push(obj)
//        }
        if (this.chanceDataLimit.enquiryContentExt !== '' && this.chanceDataLimit.enquiryContentExt !== null) {
          let ori = JSON.parse(this.chanceDataLimit.enquiryContentExt)
          let itemobj = ''
          for (itemobj in ori) {
            let obj = {
              key: itemobj,
              value: ori[itemobj]
            }
            objArray.push(obj)
//            if (itemobj === '公司') {
//              objArray.splice(0, 1, obj)
//            } else if (itemobj === '联系人') {
//              objArray.splice(1, 1, obj)
//            } else if (itemobj === '邮箱') {
//              isHaveEmail = true
//              objArray.splice(2, 1, obj)
//            } else {
//              objArray.push(obj)
//            }
//            if (itemobj === '邮箱') {
//              isHaveEmail = true
//              emailObj = obj
//            } else {
//              objArray.push(obj)
//            }
          }
        }
//        if (!isHaveEmail && commonConpanyInfo.domain !== '' && commonConpanyInfo.domain !== null && (commonConpanyInfo.mail === '' || commonConpanyInfo.mail === null)) {
//          // 对象里面没有‘邮箱字段’，可挖掘，公司信息中不存在邮箱信息
//          let obj = {
//            key: '邮箱',
//            value: ''
//          }
//          objArray.splice(1, 1, obj)
//        } else if (commonConpanyInfo.mail !== '' && commonConpanyInfo.mail !== null) {
//          // 公司信息中存在邮箱信息(不管对象是否有邮箱字段，是否可挖掘)
//          emailObj = {
//            key: '邮箱',
//            value: commonConpanyInfo.mail
//          }
//          objArray.splice(1, 1, emailObj)
//        } else if (isHaveEmail) {
//          // 对象中有邮箱字段
//          if (emailObj && emailObj.key !== '' && emailObj.key !== null) {
//            objArray.splice(1, 1, emailObj)
//          }
//        }
        this.oriContentExtObjs = objArray
      },
      // 查看公司
      selCompany (obj) {
        let enquiryCompany = obj.enquiryCompany
        let enquiryPerson = obj.enquiryPerson
        if (enquiryPerson.firstname === '' || enquiryPerson.firstname === null) {  // 公司
          let id = enquiryCompany.contactsCompanyId
          this.$router.push({
            path: '/contactDetail',
            query: {'contactType': 1, 'contactId': id}
          })
        } else {  // 联系人
          let id = enquiryPerson.contactsPersonId
          this.$router.push({
            path: '/contactDetail',
            query: {'contactType': 0, 'contactId': id}
          })
        }
      },
      // 查看联系人
      selPerson (id) {
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 0, 'contactId': id}
        })
      },
      linkPageHome (obj) {
        let homepage = obj.fbHomepage
        let fbid = obj.fbID
        if (homepage !== '' && homepage !== null) {
          window.open(homepage)
        } else if (fbid !== '' && fbid !== null) {
          window.open('https://www.facebook.com/profile.php?id=' + fbid)
        }
      },
      // 微询盘添加联系人
      addPersonFunc (enquirie, event) {
        if (!this.isAddIng) {
          this.isAddIng = true
          if (this.isExecution) {
            return
          }
          this.isExecution = true
          let enquiryPerson = enquirie.enquiryPerson
          let params = {
            firstName: enquiryPerson.firstname,
            lastName: enquiryPerson.lastname,
            microRecommendId: enquirie.recommendId,
            createSource: 'commercial_opportunity_create'
          }
          if (enquiryPerson.avatar !== '' && enquiryPerson.avatar !== null) {
            params.avatar = enquiryPerson.avatar
          }
          let sociaes = []
          let homepageurl = ''
          let homepage = enquiryPerson.fbHomepage
          let fbid = enquiryPerson.fbID
          if (homepage !== '' && homepage !== null) {
            homepageurl = homepage
          } else if (fbid !== '' && fbid !== null) {
            homepageurl = 'https://www.facebook.com/profile.php?id=' + fbid
          }
          sociaes.push({'platform': 0, 'url': homepageurl, 'socialId': enquiryPerson.fbID})
          params.sociaes = JSON.stringify(sociaes)
          enquiriesAPI.addPerson(params).then(res => {
            if (res.data.code === 0) {
              let personId = res.data.data.personId
              enquirie.enquiryPerson.contactsPersonId = personId
              this.isAddIng = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('updatePie')
            }
            this.isExecution = false
          })
        }
      },
      // 普通询盘添加联系人
      addCompanyFunc (enquirie, event) {
        if (!this.isAddIng) {
          this.isAddIng = true
          if (this.isExecution) {
            return
          }
          this.isExecution = true
          let enquiryCompany = enquirie.enquiryCompany
          let enquiryPerson = enquirie.enquiryPerson
          let dataType = 1
          if (enquiryPerson.firstname === '' || enquiryPerson.firstname === null) {  // 公司
            dataType = 1
          } else { // 联系人
            dataType = 0
          }
          let address = [{
            type: 0,
            address: enquiryCompany.streetAddress,  // 详细地址
            city: enquiryCompany.addressRegion,   // 城市
            state: '',   // 省，洲
            country: enquiryCompany.addressCountry,  // 国家
            postcode: enquiryCompany.postcode
          }]
          let params = {
            type: dataType,
            userId: window.localStorage.userId,
            avatar: enquiryCompany.logo,
            address: JSON.stringify(address),
            remark: enquiryCompany.intro,
            industry: enquiryCompany.industry,
            website: enquiryCompany.website,
            companySize: enquiryCompany.size,
            mainProduct: enquiryCompany.product,
            tradRecommendId: enquirie.recommendId,
            createSource: 'commercial_opportunity_create'
          }
          if (dataType === 0) {  // 联系人
            params.name = enquiryPerson.firstname
            params.companyName = enquiryCompany.name
          } else {
            params.name = enquiryCompany.name
          }
          if (enquiryCompany.mail !== '' && enquiryCompany.mail !== null) {
            params.mail = enquiryCompany.mail
          } else if (this.email !== '' && this.email !== null) {
            params.mail = this.email
          }
          let telephones = []
          let telephone = enquiryCompany.telephone  // 电话
          let fax = enquiryCompany.fax  // 传真
          if (telephone !== '' && telephone !== null) {
            telephones.push({
              type: 8,
              telephone: telephone
            })
          }
          if (fax !== '' && fax !== null) {
            telephones.push({
              type: 7,
              telephone: fax
            })
          }
          if (telephones.length > 0) {
            params.telephone = JSON.stringify(telephones)
          }
//        let sociaes = []
//        let homepageurl = ''
//        let homepage = enquiryCompany.fbHomepage
//        let fbid = enquiryCompany.fbID
//        if (homepage !== '' && homepage !== null) {
//          homepageurl = homepage
//        } else if (fbid !== '' && fbid !== null) {
//          homepageurl = 'https://www.facebook.com/profile.php?id=' + fbid
//        }
//        sociaes.push({'platform': 0, 'url': homepageurl, 'socialId': enquiryCompany.fbID})
//        params.sociaes = JSON.stringify(sociaes)
          enquiriesAPI.addCompany(params).then(res => {
            if (res.data.code === 0) {
              let personId = res.data.data.id
              if (dataType === 1) { // 公司
                if (this.checkIndex !== -1) {
                  this.chanceDataLimit.enquiryCompany.contactsCompanyId = personId
                  this.chanceList[this.checkIndex].enquiryCompany.contactsCompanyId = personId
                }
                enquiryCompany.contactsCompanyId = personId
              } else {  // 联系人
                if (this.checkIndex !== -1) {
                  this.chanceDataLimit.enquiryPerson.contactsPersonId = personId
                  this.chanceList[this.checkIndex].enquiryPerson.contactsPersonId = personId
                }
                enquiryPerson.contactsPersonId = personId
              }
              this.isAddIng = false
//            this.enquirielist.forEach((item, index) => {
//              if (item.inquiryId === id) {
//                item.enquiryCompany.contactsPersonId = personId
//              }
//            })
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.isExecution = false
          })
        }
      }
    },
    watch: {
    }
  }
</script>

