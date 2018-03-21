<template>
  <div class="facebook-chat-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe633;</span>
    </span>
    <div class="facebook-chat-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            <span class="icon-font" style="color:#577ECE;font-weight: 500">&#xe6d9;</span>
            {{contactInfo.name}}(@{{data.socialContent.senderName}})
            <span style="color: #7C98B6;font-weight: 500">在Facebook上给</span>
            你(@{{data.socialContent.receiverName}})发了一条私信
          </div>
          <div class="date">{{data.socialContent.messageTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <ShowMore :maxHeight="0" showTip="查看详情" hidTip="隐藏">
          <div class="facemessage-content">
            <div class="origin-content">
              <p>{{data.socialContent.content}}</p>
              <imgPreList
              v-if="this.data.socialContent.attachments.length>0"
              :options="{imgList: this.data.socialContent.attachments,size: 80,max: 3}"></imgPreList>
            </div>

            <div class="replay message">
              <div class="arrow-left1 arrow"></div>
              <div class="arrow-left2 arrow"></div>
              <div class="replay-info">
                <div class="info">
                  <img :src="data.twAvatarUrl" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
                  <span>{{data.socialContent.receiverName}}</span>
                </div>
                <el-input placeholder="请输入回复内容" v-model="replyContent" type="textarea" :rows="4" class="replay-input"></el-input>
              </div>
              <el-button class="reply-btn" type="primary" @click="confirmReply" :disabled="replyBtnState">回复</el-button>
            </div>
          </div>
        </ShowMore>
      </div>
    </div>
  </div>
</template>
<script>
import contactInfoApi from '@/api/contactInfoApi'
import ShowMore from '@/components/newShowMore.vue'
import imgPreList from '@/components/imgPreList'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      replyContent: '',
      replyBtnState: true
    }
  },
  mounted () {
    this.contactType = parseInt(this.$route.query.contactType)
  },
  props: {
    data: {
      type: Object
    }
  },
  watch: {
    replyContent (val) {
      if (val.length > 0) {
        this.replyBtnState = false
      } else {
        this.replyBtnState = true
      }
    }
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
    ShowMore,
    imgPreList
  },
  methods: {
    confirmReply () {
      contactInfoApi.replyChatingTwitter(
        {
          userId: localStorage.userId,
          receiverId: this.data.socialContent.senderId,
          conversationId: this.data.socialContent.conversationId,
          content: this.replyContent,
          source: this.data.socialContent.source
        }).then(res => {
          if (!res.data.code) {
            this.$message.success('私信成功！')
            this.replyContent = ''
          } else {
            this.$message.error(res.data.message)
          }
        })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .facebook-chat-wrapper{
    position: relative;
    margin-bottom: 50px;
    .type-icon{
      position: absolute;
      top: 10px;
      left: -15px;
      display: inline-block;
      text-align: center;
      line-height: 30px;
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #86abfa;
      box-shadow: 0 2px 6px rgba(84, 136, 249, 0.5);
    }
    .facebook-chat-container{
      position: relative;
      margin-left: 40px;
      background: #fff;
      padding: 21px 20px 20px 20px;
      border-radius: 4px;
      .header{
        position: relative;
        width: 100%;
        height: 59px;
        padding-bottom: 8px;
        font-size: 0;
        border-bottom: 1px solid #eaf0f6;
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 7px;
          vertical-align: top;
        }
        .title-date{
          display: inline-block;
          width: calc(~"100% - 50px");
          vertical-align: top;
          .title{
            line-height: 20px;
            font-size: 13px;
            color: #33475b;
            font-weight: 600;
            margin-bottom: 5px;
            word-break: break-all;
          }
          .date{
            font-size: 13px;
            color: #7c98b6;
          }
        }
      }
      .content{
        .facemessage-content{
          padding: 20px 40px 0 40px;
          .origin-content{
            background: #F5F8FA;
            padding: 12px 20px;
          }
          .replay{
            position: relative;
            .arrow{
              position: absolute;
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              top: 24px;
            }
            .arrow-left1{
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 10px solid #02AAAA;
              left: -19px;
            }
            .arrow-left2{
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 10px solid #fff;
              left: -18px;
            }
            .replay-info{
              margin-top: 20px;
              margin-bottom: 10px;
              border: 1px solid #02AAAA;
              border-radius: 6px;
              padding: 10px;
              .info{
                border-bottom: 1px solid #EAF0F6;
                padding: 10px 0;
                img{
                  display: inline-block;
                  height: 28px;
                  width: 28px;
                  border-radius: 50%;
                }
                span{
                  display: inline-block;
                  vertical-align: top;
                  margin-left: 10px;
                  font-weight: bold;
                  font-size: 13px;
                  line-height: 28px
                }
              }
            }
            .reply-btn{
              padding: 6px 25px;
            }
          }
        }
      }
    }
  }
</style>
