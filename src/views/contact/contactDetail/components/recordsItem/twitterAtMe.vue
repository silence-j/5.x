<template>
  <div class="timeline-wrapper twitter-me-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe633;</span>
    </span>
    <div class="timeline-container twitter-me-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            <span class="icon-font" style="color:#48B3FE;font-weight: 500;">&#xe6d2;</span>
            {{contactInfo.name}}(@{{data.socialContent.senderAccountName || ''}})
             <span class="text-light">在Twitter上@了</span>
             {{data.accInfo.name}}(@{{data.socialContent.receiverAccountName}})
          </div>
          <div class="date">{{data.socialContent.messageTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <div class="twitter-content" v-show="showMore">
          <div class="origin-content">
            <p>{{data.socialContent.content}}</p>
            <imgPreList
            v-if="this.data.socialContent.attachments.length>0"
            :options="{imgList: this.data.socialContent.attachments,size: 80,max: 3}"></imgPreList>
          </div>
          <div class="operate">
             <span :style="{color: isThumbUp?'#7C98B6':'#5488f9'}" @click="thumbUpOrCancel"><i class="icon-font icon-agree"></i>赞</span>
             <span @click="showReTwitter=false;showReply=!showReply"><i class="icon-font icon-replay"></i>回复</span>
             <span @click="showReply=false;showReTwitter=!showReTwitter"><i class="icon-font icon-retweet"></i>转推</span>
          </div>
          <!-- 回复编辑内容模块 -->
          <div v-show="showReply" class="replay">
            <div class="arrow-up1 arrow"></div>
            <div class="arrow-up2 arrow"></div>
            <div class="replay-info">
              <div class="info">
                <img :src="data.twAvatarUrl">
                <span>{{data.socialContent.receiverName}}</span>
              </div>
              <el-input
              v-model="replyContent"
              type="textarea"
              :rows="4"
              class="replay-input"></el-input>
            </div>
            <el-button @click="confirmReply" class="reply-btn" type="primary" :disabled="replyBtnState">回复</el-button>
          </div>
          <!-- 转推编辑内容模块 -->
          <div v-show="showReTwitter" class="retwitter replay">
            <div class="arrow-up1 arrow"></div>
            <div class="arrow-up2 arrow"></div>
            <div class="replay-info">
              <div class="info">
                <img :src="data.twAvatarUrl">
                <span>{{data.socialContent.receiverName}}</span>
              </div>
              <el-input v-model="reTwitterContent" type="textarea" :rows="4" class="replay-input"></el-input>
            </div>
            <el-button @click="confirmReTwitter" class="reply-btn" type="primary" :disabled="reTwitterBtnState">转推</el-button>
          </div>
        </div>
        <!-- 点击展开之后再去请求借口，所以不能用showmore组件 -->
        <a href="javascript:void(0)" @click="showMoreOrHid" class="show-hid-btn">{{showMoreText}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import imgPreList from '@/components/imgPreList'
import contactInfoApi from '@/api/contactInfoApi'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      isThumbUp: true,
      showReply: false,
      showReTwitter: false,
      replyBtnState: false,
      reTwitterBtnState: true,
      replyContent: '',
      reTwitterContent: '',
      showMore: false,
      showMoreText: '查看详情',
      isDataReady: false,
      operName: ''
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  watch: {
    replyContent (val) {
      if (val.length === 0) {
        this.replyBtnState = true
      } else {
        this.replyBtnState = false
      }
    },
    reTwitterContent (val) {
      if (val.length === 0) {
        this.reTwitterBtnState = true
      } else {
        this.reTwitterBtnState = false
      }
    }
  },
  mounted () {
    this.contactType = parseInt(this.$route.query.contactType)
    this.getUserName()
  },
  computed: {
    contactBase () {
      return this.$store.getters.contactDetail.base
    },
    contactInfo () {
      return this.$store.getters.desc
    }
  },
  components: {
    imgPreList
  },
  methods: {
    getUserName () {
      // 获取用户的tw name
      let userTwAccount = this.data.socialContent.bindingAccount === this.data.socialContent.receiverId
      ? this.data.socialContent.senderAccountName
      : this.data.socialContent.receiverAccountName
      this.replyContent = `@${userTwAccount} `
    },
    thumbUpOrCancel () {
      let isLike = this.isThumbUp ? 1 : 0
      let tipMessage = this.isThumbUp ? '点赞成功！' : '取消点赞！'
      contactInfoApi.zanTwitter({
        socialContentId: this.data.socialContent.socialId,
        socialAccountType: 2,
        isLike
      }).then(res => {
        if (!res.data.code) {
          this.$message.success(tipMessage)
          this.isThumbUp = !this.isThumbUp
        } else {
          this.$message.error('点赞失败！')
        }
      })
    },
    confirmReply () {
      if (this.replyContent.replace(/ /g, '') === '') {
        this.$message.error('内容输入不准为空')
        return
      }
      contactInfoApi.replyTwitter({
        userId: localStorage.userId,
        socialContentId: this.data.socialContent.socialId,
        socialAccountType: 2,
        content: this.replyContent
      }).then(res => {
        if (!res.data.code) {
          this.$message.success('回复成功！')
          this.getUserName()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    confirmReTwitter () {
      if (this.reTwitterContent.replace(/ /g, '') === '') {
        this.$message.error('内容输入不准为空')
        return
      }
      contactInfoApi.reTwitter({
        userId: localStorage.userId,
        socialContentId: this.data.socialContent.socialId,
        socialAccountType: 2,
        content: this.reTwitterContent
      }).then(res => {
        if (!res.data.code) {
          this.$message.success('转推成功！')
          this.reTwitterContent = ''
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    showMoreOrHid () {
      let showMoreText = this.showMoreText === '查看详情' ? '隐藏' : '查看详情'
      this.showMore = !this.showMore
      this.showMoreText = showMoreText
      if (this.showMore && !this.isDataReady) {
        contactInfoApi.getZanStatus({socialContentId: this.data.socialContent.socialId}).then((res) => {
          this.isDataReady = true
          if (res.data.data === 1) {
            this.isThumbUp = false
          } else {
            this.isThumbUp = true
          }
        })
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  // @import "../../../../../assets/style/timeline";
  .twitter-me-wrapper{
    // position: relative;
    // margin-bottom: 50px;
    // .type-icon{
    //   position: absolute;
    //   top: 10px;
    //   left: -15px;
    //   display: inline-block;
    //   text-align: center;
    //   line-height: 30px;
    //   color: #fff;
    //   width: 30px;
    //   height: 30px;
    //   border-radius: 50%;
    //   background-color: #86abfa;
    //   box-shadow: 0 2px 6px rgba(84, 136, 249, 0.5);
    // }
    .twitter-me-container{
      // position: relative;
      // margin-left: 40px;
      // background: #fff;
      // padding: 21px 20px 20px 20px;
      // border-radius: 4px;
      .header{
        // position: relative;
        // width: 100%;
        height: 59px;
        // font-size: 0;
        border-bottom: 1px solid #eaf0f6;
        // .avatar{
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        //   margin-right: 7px;
        //   vertical-align: top;
        // }
        .title-date{
          // display: inline-block;
          // vertical-align: top;
          // .title{
          //   line-height: 20px;
          //   font-size: 13px;
          //   color: #33475b;
          //   font-weight: 600;
          //   margin-bottom: 5px;
          //   word-break: break-all;
          // }
          // .date{
          //   font-size: 13px;
          //   color: #7c98b6;
          // }
        }
      }
      .twitter-content{
        // padding: 20px 40px 0 40px;
        // .origin-content{
        //   background: #F5F8FA;
        //   padding: 12px 20px;
        // }
        // .operate{
        //   font-size: 13px;
        //   color: #7C98B6;
        //   margin-top: 10px;
        //   i{
        //     font-style: normal;
        //     margin-right: 5px;
        //   }
        //   span{
        //     cursor: pointer;
        //     margin-right: 20px;
        //   }
        // }
        .replay{
          // position: relative;
          .arrow{
            // position: absolute;
            // width: 0;
            // height: 0;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            top: -9px;
            left: 70px;
          }
          .arrow-up1{
            border-bottom: 10px solid #02AAAA;
          }
          .arrow-up2{
             border-bottom: 10px solid #fff;
             top: -8px;
          }
          .replay-info{
            // margin-top: 20px;
            // margin-bottom: 10px;
            // border: 1px solid #02AAAA;
            // border-radius: 6px;
            // padding: 10px;
            // .info{
            //   border-bottom: 1px solid #EAF0F6;
            //   padding: 10px 0;
            //   img{
            //     height: 28px;
            //     width: 28px;
            //     border-radius: 50%;
            //   }
            //   span{
            //     display: inline-block;
            //     vertical-align: top;
            //     margin-left: 10px;
            //     font-weight: bold;
            //     font-size: 13px;
            //     line-height: 28px;
            //   }
            // }
            .replay-input{
              textarea{
                border: none !important;
              }
            }
          }
          // .reply-btn{
          //   padding: 6px 25px;
          // }
        }
        .retwitter{
          .arrow{
            left: 140px;
          }
        }
      }
      .show-hid-btn{
        display: inline-block;
        font-size: 13px;
        color: #5488f9;
        margin-top: 16px;
      }
    }
  }
</style>
