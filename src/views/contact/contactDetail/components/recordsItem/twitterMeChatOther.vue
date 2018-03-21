<template>
  <div class="timeline-wrapper twitter-chat-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe633;</span>
    </span>
    <div class="timeline-container twitter-chat-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="data.accInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="data.accInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            <span class="icon-font" style="color:#48B3FE;font-weight: 500">&#xe6d2;</span>
            {{data.accInfo.name}}(@{{data.socialContent.senderAccountName}})
            <span class="text-light">在Twitter上给</span>
            {{contactInfo.name}}(@{{data.socialContent.receiverAccountName}})发了一条私信
          </div>
          <div class="date">{{data.socialContent.messageTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <ShowMore :maxHeight="0" showTip="查看详情" hidTip="隐藏">
          <div class="twitter-content">
            <div class="origin-content">
              <p>{{data.socialContent.content}}</p>
              <imgPreList
              v-if="this.data.socialContent.attachments.length>0"
              :options="{imgList: this.data.socialContent.attachments,size: 80,max: 3}"></imgPreList>
            </div>
          </div>
        </ShowMore>
      </div>
    </div>
  </div>
</template>
<script>
import ShowMore from '@/components/newShowMore.vue'
import imgPreList from '@/components/imgPreList'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      operName: ''
    }
  },
  mounted () {
    this.contactType = parseInt(this.$route.query.contactType)
  },
  watch: {
  },
  props: {
    data: {
      type: Object
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
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../../assets/style/timeline";
  .twitter-chat-wrapper{
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
    .twitter-chat-container{
      // position: relative;
      // margin-left: 40px;
      // background: #fff;
      // padding: 21px 20px 20px 20px;
      // border-radius: 4px;
      .header{
        // position: relative;
        // width: 100%;
        height: 59px;
        padding-bottom: 8px;
        // font-size: 0;
        border-bottom: 1px solid #eaf0f6;
        // .avatar{
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        //   margin-right: 7px;
        //   vertical-align: top;
        // }
        // .title-date{
          // display: inline-block;
          // width: calc(~"100% - 50px");
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
        // }
      }
      // .content{
        // .twitter-content{
        //   padding: 20px 40px 0 40px;
        //   .origin-content{
        //     background: #F5F8FA;
        //     padding: 12px 20px;
        //   }
        // }
      // }
    }
  }
</style>
