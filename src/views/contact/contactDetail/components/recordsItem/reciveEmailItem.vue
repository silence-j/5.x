<template>
  <div class="timeline-wrapper recive-email-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe62e;</span>
    </span>
    <div class="timeline-container recive-email-container">
      <div class="header">
        <img :src="data.avatarUrl || '/static/img/default_avatar.jpg'" alt="" class="avatar"  onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <span class="title-date">
          <div class="title">{{data.accInfo.name}} 收到了一封邮件来自 {{(data.socialContent).contactName}}（{{(data.socialContent).contactEmail}}）</div>
          <div class="date">{{data.socialContent.sendTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <p class="mail-title">{{(data.socialContent).title}}</p>
        <div class="mail-send" v-if="data.socialContent.copyer||data.socialContent.secreter">
          <p v-if="data.socialContent.copyer">
            <span class="title">抄送：</span>
              <el-tooltip class="item" effect="light" :content="data.socialContent.copyer" placement="top-start">
                 <span class="mail-persons">{{(data.socialContent).copyer}}</span>
              </el-tooltip>
          </p>
          <p v-if="data.socialContent.secreter">
            <span class="title">密送：</span>
             <el-tooltip class="item" effect="light" :content="data.socialContent.secreter" placement="bottom-start">
                <span class="mail-persons">{{(data.socialContent).secreter}}</span>
              </el-tooltip>
          </p>
        </div>
        <div class="mail-context">
          <ShowMore :maxHeight="100">
            <div v-html="data.socialContent.content"></div>
          </ShowMore>
        </div>
        <div class="mail-file" v-for="attachment in data.socialContent.attachments">
          <a :href="attachment.address" target="_blank">
           {{attachment.fileName}}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ShowMore from '@/components/newShowMore.vue'
export default {
  name: '',
  data () {
    return {
      // operName: ''
    }
  },
  mounted () {
    // this.getOperName()
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
  },
  components: {
    ShowMore
  },
  methods: {
    // getOperName () {
    //   let operId = this.data.socialContent.operUserId || this.data.userId
    //   let info = this.data.userInfoMap[operId]
    //   if (info) {
    //     this.operName = info.name
    //   } else {
    //     this.operName = operId
    //   }
    // }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../../assets/style/timeline";
  .recive-email-wrapper{
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
    .recive-email-container{
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
        // .email-marking-flag{
        //   position: absolute;
        //   top: 23px;
        //   right: 21px;
        //   width: 60px;
        //   height: 18px;
        //   font-size: 12px;
        //   color: #fff;
        //   background-color: #5488f9;
        //   text-align: center;
        //   line-height: 18px;
        // }
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
      .content{
      }
      .mail-state{
        border-bottom: 1px solid #EAF0F6;
        padding: 20px 0;
        .open{
          margin-left: 30px;
        }
      }
      .extend-title{
        color: #33475b;
        font-size: 13px;
        font-weight: bold;
        padding: 20px 0;
        border-bottom: 1px solid #eaf0f6;
      }
      .mail-title{
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0;
      }
      .mail-send{
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px dashed #CBD6E3;
      }
      .mail-file{
        margin-top: 30px;
      }
    }
  }
</style>
