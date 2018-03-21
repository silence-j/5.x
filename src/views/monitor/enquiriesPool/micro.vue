<template>
  <div class="commonEnq">
    <div class="micro-container" @click="getDetail">
      <div v-if="noRecommend" class="title" style="position:relative">
        <span class="posiRight" v-if="vipType===2">
          <i class="icon-agree" ></i>
        </span>
        <h3>推荐来源:</h3>
        <div :style="{backgroundColor: itemOrigin.color}">
          <span :title="itemOrigin.originText" :style="{paddingRight: itemOrigin.canDel ? '28px' : '13px'}">
            {{itemOrigin.originText}}
            <i v-if="itemOrigin.canDel" @click="delRec" class="iconfont del-btn">&#xe65a;</i>
          </span>
        </div>
      </div>
      <div class="content-top">
        <p class="oriTitle" v-if="data.oriTitle !== null && data.oriTitle !== '' && data.oriTitle !== undefined" style="font-weight: bold;font-size: 16px">{{data.oriTitle || ''}}</p>
        <p class="say-some" v-html="data.oriContent"></p>
      </div>
      <div class="see-detail">
        <el-button type="text" style="color: #5488F9;">查看详情</el-button>
        <div v-if="data.oriPic && data.oriPic.length" class="detail-img">
          <span class="icon-tupian">&#xe649;</span>
          <span v-if="data.oriPic && data.oriPic.length > 1" class="img-count">{{data.oriPic.length}}</span>
        </div>
      </div>
      <!-- <div v-if="data.oriPic && data.oriPic.length > 0" class="pic-box" :style="{background: `url(${data.oriPic[0].url}) center no-repeat `}"></div> -->
      <div class="content-bottom">
        <div class="person-info">
          <img :src="data.enquiryPerson.avatar" alt="" @click="toEnquiryPersonFb" class="person-pic">
          <div class="person-name">
            <div class="who" @click="toEnquiryPersonFb">
              <a :href="data.enquiryPerson.fbHomepage" target="_block">
                {{data.enquiryPerson.firstname}}{{data.enquiryPerson.lastname || ''}}
              </a>
            </div>
            <div class="who-time">{{data.enquiryTime | time-formater-has-hour}}</div>
          </div>
          <div class="contact-person">
            <el-button type="primary" :disabled="true" v-if='isAddeSub === 0' >团队联系人</el-button>
            <el-button type="primary" :disabled="addDisable"  v-else-if="!addSuccess && !hasAdded" @click="addContact"><i class="el-icon-plus"></i>联系人</el-button>
            <el-button type="primary" v-else @click="toContactDetail">查看联系人</el-button>
          </div>
        </div>
        <p class="what-say" v-html="data.enquiryContent"></p>
        <!-- <div class="line-bottom"></div> -->
        <!-- <div class="detail">
          <el-button type="text" style="color: #666;">查看详情</el-button>
        </div> -->
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      class="detail-dia">
      <div class="top-box" lock-scroll="true">
        <i class="iconfont close-btn" @click="dialogVisible = false">&#xe62c;</i>
        <h3 v-if="noRecommend">推荐来源:</h3>
        <div v-if="noRecommend" :style="{backgroundColor: itemOrigin.color}">
          <span :title="itemOrigin.originText" :style="{paddingRight: itemOrigin.canDel ? '28px' : '13px'}">
            {{itemOrigin.originText}}
            <i v-if="itemOrigin.canDel" @click="delRec"  class="iconfont del-btn">&#xe65a;</i>
          </span>
        </div>
      </div>
      <div class="next-box">
        <!--<p class="say-some" v-html="keyword === ''? data.oriContent : replaceValue(data.oriContent)"></p>-->
        <p class="say-some">{{data.oriContent}}</p>
      </div>
      <carouselChange
        v-if="data.oriPic&&data.oriPic.length>0&&(data.oriVideo==''||data.oriVideo==null)"
        :imageList="data.oriPic"
        @nextPageSure="nextPageFunc"></carouselChange>
      <div class="say-box">
        <div class="someone">
          <a :href="data.enquiryPerson.fbHomepage" target="_block">
            <img :src="data.enquiryPerson.avatar" alt="" class="person-pic">
          </a>
          <span>
		  			<a :href="data.enquiryPerson.fbHomepage" target="_block">
		  				{{data.enquiryPerson.firstname}}{{data.enquiryPerson.lastname || ''}}
		  			</a>
		  		</span>
          <div class="contact-person">
            <el-button type="primary" :disabled="true" v-if='isAddeSub === 0' >团队联系人</el-button>
            <el-button type="primary" :disabled="addDisable" v-else-if="!addSuccess && !hasAdded" @click="addContact"><i class="el-icon-plus"></i>联系人</el-button>
            <el-button type="primary" v-else @click="toContactDetail">查看联系人</el-button>
          </div>
        </div>
        <div class="loading loading-circle loading-top" v-if="fbReplyLoading"></div>
        <div v-else>
          <div class="reply-box" v-for="(item, index) in replyList" :key="index">
            <div class="history-say">
              <a :href="`https://www.facebook.com/profile.php?id=${item.profile.id}`" target="_block">
                <img :src="item.profile.thumbSrc"  alt="" class="pic">
              </a>
              <div class="liuyan">
                <div>
                  <span>
                    <a :href="`https://www.facebook.com/profile.php?id=${item.profile.id}`" target="_block">
                      {{item.profile.name}}
                    </a>
                  </span>
                  <span>{{item.commentTime | time-formater-has-hour}}</span>
                </div>
                <p v-html="item.text"></p>
              </div>
            </div>
            <div v-if="item.replies && item.replies.length" v-for="(inner, iindes) in item.replies" :key="iindes" class="history-say inner-reply">
              <img :src="inner.profile.thumbSrc" alt="" class="pic">
              <div class="liuyan inner-liuyan">
                <div>
                  <span>
                    <a :href="`https://www.facebook.com/profile.php?id=${inner.profile.id}`" target="_block">
                      {{inner.profile.name}}
                    </a>
                  </span>
                  <span>{{inner.commentTime | time-formater-has-hour}}</span>
                </div>
                <p v-html="inner.text"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <delDialog class="del-dialog" :config="delDialogConfig" @sure="confirmDel"></delDialog>
    <el-dialog v-model="addTipsShow" class="add-tips" size="tiny">
      <div class="delete-tip">
        <span class="icon-font">&#xe629;</span>
        <span class="tip-content">{{addTips.title}}</span>
        <p class="tip-text">{{addTips.content}}</p>
        <div class="btn-wrapper">
          <el-button type="primary" @click="addTipsShow = false">知道了</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import enquiriesAPI from '@/api/enquiriesAPI'
  import carouselChange from '@/components/carouselChange/carouselChange.vue'
  import delDialog from '@/components/box/dialogBox'
  export default {
    data () {
      return {
        addTipsShow: false,
        addTips: {
          title: '',
          content: ''
        },
        noRecommend: true,
        dialogVisible: false,
        delDialogConfig: {
          visible: false,
          notice: `是否停止推荐来自搜索历史 ${this.data.keywords.length > 9 ? `${this.data.keywords.slice(0, 9)}...` : this.data.keywords} 的询盘？`,
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          flag: 0,
          showclosebtn: true, // 按钮取消
          popovercls: 'confirm-pop'
        },
        replyList: [],
        fbReplyLoading: false,
        addSuccess: false,
        personId: null,
        addDisable: false
      }
    },
    mounted () {
      if (this.data.keywordMatchs === null) {
        this.noRecommend = false
      }
    },
    components: {
      carouselChange,
      delDialog
    },
    methods: {
      // replaceValue (val) {
      //   let patt = new RegExp(this.key, 'ig')
      //   let newValue = val
      //   if (this.key) {
      //     newValue = val.replace(patt, '<em>$&</em>')
      //   }
      //   return newValue
      // },
      toEnquiryPersonFb (e) {
        e.stopPropagation()
      },
      nextPageFunc (value) {
        // console.log(value)
      },
      delRec (e) {
        e.stopPropagation()
        this.delDialogConfig.visible = true
      },
      confirmDel () {
        enquiriesAPI.deleteTag({ keywords: this.data.keywords }).then(res => {
          if (!res.data.code) {
            this.$emit('delTag', true)
            this.$message.success('删除成功')
          }
        })
      },
      getFbDetail (id) {
        this.fbReplyLoading = true
        enquiriesAPI.getMementList({commentId: id}).then(res => {
          if (!res.data.code) {
            this.fbReplyLoading = false
            if (res.data.data) {
              this.replyList = res.data.data.comments
            } else {
              this.replyList = null
            }
          }
        })
      },
      getDetail () {
        this.dialogVisible = true
        this.getFbDetail(this.data.thirdId)
      },
      addContact (e) {
        e.stopPropagation()
        this.addDisable = true
        let params = {
          firstName: `${this.data.enquiryPerson.firstname || ''}${this.data.enquiryPerson.lastname || ''}`,
          microRecommendId: this.data.recommendId,
          createSource: 'commercial_opportunity_create',
          avatar: this.data.enquiryPerson.avatar,
          sociaes: JSON.stringify([{
            platform: 0,
            url: this.data.enquiryPerson.fbHomepage,
            socialId: this.data.enquiryPerson.fbID
          }])
        }
        enquiriesAPI.addPerson(params).then(res => {
          this.addDisable = false
          if (!res.data.code) {
            if (res.data.subMessage) {
              // this.addTipsShow = true
              this.addTips = {
                title: res.data.message,
                content: res.data.subMessage
              }
            } else {
              this.$message.success('新增联系人成功')
              this.addSuccess = true
              this.personId = res.data.data.personId
            }
          } else {
            this.$message.error(res.data.message)
            if (res.data.message === '联系人已被他人添加') {
              this.isAddeSub = 0
            }
            // setTimeout(() => {
            //   window.location.reload()
            // }, 600)
          }
        })
      },
      showDetail () {
        this.dialogVisible = true
      },
      toContactDetail (e) {
        e.stopPropagation()
        let id = this.personId || this.data.enquiryPerson.contactsPersonId
        this.$router.push({
          path: '/contactDetail',
          query: {
            'contactType': 0,
            'contactId': id
          }
        })
      }
    },
    computed: {
      // key () {
      //   if (!this.keyWord) {
      //     return
      //   }
      //   let k = this.keyword.replace(/\+/g, '')
      //   return k
      // },
      itemOrigin () {
        let originObj = {}
        // let isMatched = this.data.keywordMatchs[0].isMatched
        let type = this.data.keywordMatchs === null ? '' : this.data.keywordMatchs[0].type
        switch (type) {
          case 'explore':
            originObj.originText = `搜索历史: ${this.data.keywords}`
            originObj.color = '#ffb1c5'
            originObj.canDel = true
            break
          case 'detective':
            originObj.originText = `搜索历史: ${this.data.keywords}`
            originObj.color = '#ffb1c5'
            originObj.canDel = true
            break
          case 'product':
            originObj.originText = `产品类型: ${this.data.keywords}`
            originObj.color = '#99e3eb'
            break
          case 'seo':
            originObj.originText = `SEO关键字: ${this.data.keywords}`
            originObj.color = '#ffdca8'
            break
          case 'system':
            originObj.originText = `系统关键字: ${this.data.keywords}`
            originObj.color = '#ffdca8'
            break
          case 'enquiries':
            originObj.originText = `询盘关键词: ${this.data.keywords}`
            originObj.color = '#ffdca8'
            originObj.span = true
            break
        }
        return originObj
      },
      delDialogConfig () {
        return {
          visible: false,
          notice: `是否停止推荐来自搜索历史 ${this.data.keywords} 的询盘？`,
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          flag: 0,
          showclosebtn: true, // 按钮取消
          popovercls: 'confirm-pop'
        }
      },
      hasAdded () {
        if (this.data.enquiryPerson.contactsPersonId === '' || !this.data.enquiryPerson.contactsPersonId) {
          return false
        } else {
          return true
        }
      }
    },
    props: {
      data: {
        type: Object
      },
      isAddeSub: {
        type: Number
      },
      vipType: Number,
      keyword: String
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .commonEnq {
    display: inline-block;
    vertical-align: top;
    width: 380px;
    margin-bottom: 30px;
    background: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    .micro-container{
      cursor: pointer;
    }
    .pic-box{
      width: 80%;
      margin: auto;
    }
    .see-detail{
      padding: 0 20px;
      .detail-img{
        float: right;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #888888;
        .icon-tupian{
          font-size: 16px;
          color: #BBBBBB;
        }
        .img-count{
          padding: 0 0 0 5px;
        }
      }
    }
    .posiRight {
      position: absolute;
      top: 0px;
      right: 0px;
      border: 24px solid #f00;
      border-left-color: transparent;
      border-bottom-color:transparent;
      width: 0px;
      height: 0px;
      .icon-agree{
        position: relative;
        right: -2px;
        top: -16px;
        font-size: 16px;
        color: #ffffff
      }
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 48px;
      border-bottom: 1px solid #EAF0F6;
      h3 {
        font-weight: normal;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        margin-left: 20px;
        margin-right: 3px;
      }
      div:nth-of-type(1) {
        display: inline-block;
        height: 28px;
        font-size: 13px;
        color: #33475B;
        margin-left: 7px;
        letter-spacing: 0;
        border-radius: 5px;
        span {
          display: inline-block;
          position: relative;
          line-height: 28px;
          padding: 0 13px;
          max-width: 260px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          box-sizing: border-box;
          .del-btn{
            cursor: pointer;
            position: absolute;
            display: inline-block;
            font-size: 14px;
            top: 2px;
            right: 8px;
          }
        }
      }
    }
    .content-top {

      box-sizing: border-box;
      padding: 16px 20px;
      .oriTitle{
        font-size: 16px;
        font-weight: bold;
        height: 16px;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
      }
      .top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        // .conpic{
        // 	width: 14px;
        // 	height: 13px;
        // 	display: inline-block;
        // 	background-image: url(../../../assets/xunpan/commom.svg);
        // 	background-size: 100% 100%;
        // 	position: relative;
        // 	top: -1px;
        // }
        i {
          font-size: 13px;
        }
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #33475B;
          letter-spacing: 0;
          margin: 0px 2px;
        }
        p {
          width: 290px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: PingFangSC-Semibold;
          font-size: 16px;
          color: #444444;
          letter-spacing: 0;
        }
      }
      .center-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 10px;
        .pic {
          height: 32px;
          width: 32px;
          border-radius: 2px;
          background-size: 100% 100%;
          margin-right: 8px;
        }
        .right {
          height: 32px;
          width: 300px;
          position: relative;
          .name {
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            letter-spacing: 0;
            a{
              color: #6295F7;
            }
          }
          .time {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #888888;
            letter-spacing: 0;
            position: absolute;
            bottom: 0px;
          }
          .say-some {
            font-size: 14px;
            line-height: 20px;
            width: 100%;
          }
          .oriTitle{
            font-size: 16px;
            font-weight: bold;
            height: 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            white-space: nowrap;
          }
        }
      }
      .say-some {
        margin-top: 10px;
        font-family: HelveticaNeue;
        font-size: 14px;
        color: #888888;
        letter-spacing: 0;
        line-height: 20px;
        height: 38px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        /* autoprefixer: off*/
        -webkit-box-orient: vertical;
        /* autoprefixer: on*/
        -webkit-line-clamp: 2;
        em{
          color: #F44336;
          font-style: normal;
        }
      }
    }
    .pic-box {
      width: 80%;
      height: 180px;
      background-position: center;
      margin: auto;
    }
    .content-bottom {
      background-color: #F8F9FD;
      width: 100%;
      box-sizing: border-box;
      padding: 20px 0px 33px 20px;
      .person-info{
        position: relative;
        display:flex;
        .person-pic{
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-right: 8px;
        }
        .person-name{
          position: relative;
          width: 298px;
          .who{
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #6295F7;
            letter-spacing: 0;
            a{
              color: #6295F7;
            }
          }
          .who-time{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #888888;
            letter-spacing: 0;
            position: absolute;
            bottom: 3px;
          }
        }
        .contact-person{
          width: 80px;
          height: 28px;
          position: absolute;
          top: 0px;
          right: 20px;
          background: transparent;
          .el-button{
            padding: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #FFFFFF;
            letter-spacing: 0;
            i{
              font-size: 10px;
              margin-right: 2px;
              position: relative;
              top: -1px;
            }
          }
        }
      }
      .what-say{
        width: 294px;
        margin-left: 49px;
        color: #888888;
        margin-top: 8px;
        overflow: hidden;
        font-size: 14px;
        line-height: 20px;
        height: 40px;
        text-overflow: ellipsis;
        display: -webkit-box;
        /* autoprefixer: off*/
        -webkit-box-orient: vertical;
        /* autoprefixer: on*/
        -webkit-line-clamp: 2;
        em {
          color: #F44336;
          font-style: normal;
        }
      }
      .line-bottom{
        width: 310px;
        height: 2px;
        background-color:  #E4E4E4;
        margin-left: 49px;
        margin-top: 10px;
      }
      .detail{
        width: 310px;
        margin-left: 49px;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        align-items: center;
        >span{
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #666666;
          line-height: 21px;
        }
        .mount{
          margin-right: 20px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
        }
      }
    }
    .detail-dia{
      .el-dialog{
        width: 680px;
        box-sizing: border-box;
      }
      .el-dialog__header{
        display: none;
      }
      .el-dialog__body{
        padding: 0px;
        width: 680px;
        max-height: 700px;
        /*overflow-y: scroll;*/
        overflow-x: hidden;
        .loading-circle{
          margin: 55px auto;
        }
      }
      .top-box{
        position: relative;
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom:1px solid #EAF0F6;
        .close-btn{
          cursor: pointer;
          font-size: 40px;
          color: #b3b3b3;
          position: absolute;
          top: 10px;
          right: 10px;
        }
        h3{
          font-family: "微软雅黑";
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          margin-left: 20px;
          margin-right: 6px;
        }
        div:nth-of-type(1) {
          display: inline-block;
          height: 28px;
          font-size: 13px;
          color: #33475B;
          letter-spacing: 0;
          background-color: rgba(255,59,110,0.40);
          border-radius: 5px;
          span {
            display: inline-block;
            max-width: 500px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
            line-height: 28px;
            padding: 0 13px;
            .del-btn{
              cursor: pointer;
              position: absolute;
              display: inline-block;
              font-size: 14px;
              top: 2px;
              right: 7px;
            }
          }
        }
      }
      .next-box{
        width: 100%;

        box-sizing: border-box;
        padding: 20px;
        .top {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          // .conpic{
          //   height: 18px;
          //   width: 18px;
          //   display: inline-block;
          //   background-image: url(../../../assets/xunpan/apic.svg);
          //   background-size: 100% 100%;
          // }
          p{
            font-family: PingFangSC-Semibold;
            font-size: 18px;
            color: #444444;
            letter-spacing: 0;
          }
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #33475B;
            letter-spacing: 0;
            margin: 0px 2px;
            margin-right: 5px;
          }

        }
        .center-info {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 10px;
          .pic {
            height: 32px;
            width: 32px;
            border-radius: 2px;
            background-size: 100% 100%;
            margin-right: 8px;
          }
          .right {
            height: 32px;
            width: 300px;
            position: relative;
            .name {
              font-family: PingFangSC-Semibold;
              font-size: 14px;
              color: #6295F7;
              letter-spacing: 0;
              a{
                color: #6295F7;
              }
            }
            .time {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #888888;
              letter-spacing: 0;
              position: absolute;
              bottom: 0px;
            }
            .say-some {
              width: 100%;
            }
          }
        }
        .say-some {
          margin-top: 17px;
          margin-bottom: 16px;
          font-family: HelveticaNeue;
          font-size: 14px;
          color: #888888;
          line-height: 20px;
          word-wrap: break-word;
          em {
            color: #F44336;
            font-style: normal;
          }
        }
      }
    }
    .del-dialog{
      .el-dialog{
        .el-dialog__body{
          font-size: 14px;
          color: #444;
          line-height: 21px;
          .confirm-main{
            .icon-font{
              color: #ff3b6e;
              vertical-align: top;
            }
            span{
              vertical-align: top;
              display: inline-block;
              width: 236px;
              font-size: 14px;
              color: #444;
              line-height: 21px;
            }
          }
          .confirm-btn{
            .confirm{
              background-color: #ff3b6e;
            }
          }
        }
      }
    }
    .image_list_change{
      margin-left: 70px;
      .big_image_display{
        text-align: center;
        img{
          width: auto;
        }
      }
    }
    .say-box{
      padding:0px 20px 20px 20px;
      .someone{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 76px;
        width: 100%;
        border-bottom: 1px solid #EAF0F6;

        .person-pic{
          width: 40px;
          height: 40px;
          background-size: 100% 100%;
          border-radius: 20px;
          margin-right: 8px;
        }
        >span{
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #5488F9;
          letter-spacing: 0;
          a{
            color: #5488F9;
          }
        }
        .contact-person{
          width: 80px;
          height: 28px;
          position: absolute;
          right: 20px;
          background: transparent;
          top: 50%;
          transform: translateY(-50%);
          .el-button{
            padding: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #FFFFFF;
            letter-spacing: 0;
            i{
              font-size: 10px;
              margin-right: 2px;
              position: relative;
              top: -1px;
            }
          }
        }
      }
      .next-one{
        overflow: hidden;

        width: 100%;
        border-bottom: 1px solid #EAF0F6;
        box-sizing: border-box;
        padding: 16px;
        .pic {
          height: 40px;
          width: 40px;
          border-radius: 20px;
          background-size: 100% 100%;
          margin-right: 8px;
          float: left;
        }
        .liuyan{
          width: calc(100% - 40px);
          line-height: 20px;
          float: left;
          div{
            >span:nth-of-type(1){
              font-family: PingFangSC-Semibold;
              font-size: 14px;
              color: #5488F9;
              letter-spacing: 0;
              a{
                color: #5488F9;
              }
            }
            >span:nth-of-type(2){
              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #888888;
              letter-spacing: 0;
              margin-left: 10px;
            }
          }
          >p{
            width: 560px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #888888;
            letter-spacing: 0;
            margin-top: 6px;
            line-height: 20px;
          }
        }
      }
      .history-say{
        overflow: hidden;
        width: 100%;
        box-sizing: border-box;
        box-sizing: border-box;
        margin-top: 17px;
        .pic {
          height: 40px;
          width: 40px;
          border-radius: 20px;
          background-size: 100% 100%;
          margin-right: 8px;
          float: left;
        }
        .liuyan{
          float: left;
          width: 580px;
          text-align: justify;
          div{
            >span:nth-of-type(1){
              font-family: PingFangSC-Semibold;
              font-size: 14px;
              color: #5488F9;
              letter-spacing: 0;
              a{
                color: #5488F9;
              }
            }
            >span:nth-of-type(2){
              font-family: PingFangSC-Regular;
              font-size: 13px;
              color: #888888;
              letter-spacing: 0;
              margin-left: 10px;
            }
          }
          >p{
            line-height: 20px;
            font-family: PingFangSC-Regular;
            font-size: 13px;
            color: #888888;
            letter-spacing: 0;
            margin-top: 6px;
          }
        }
        .inner-liuyan{
          width: 535px;
        }
      }
      .history-say:nth-last-of-type(1){
        border-bottom: 1px solid #EAF0F6;
        padding-bottom: 16px;
        margin-bottom: 9px;
      }
      .inner-reply{
        margin-left: 45px;
        p{
          max-width: 100%;
        }
      }
      .bottom-title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        line-height: 21px;
      }
    }
  }
</style>
