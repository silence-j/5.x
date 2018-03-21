<template>
  <div class="timeline-wrapper mail-state-wrapper">
    <span class="type-icon">
      <span class="icon-font icon-track"></span>
    </span>
    <div class="timeline-container mail-state-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{contactInfo.name}}
            <span style="color: #7C98B6;font-weight: 500">
              {{data.socialContent.trackType === 0?'打开':'点击'}}了{{data.socialContent.mailMarketingFlag?'营销':''}}邮件{{data.socialContent.trackType === 0?'':'链接'}}
            </span>
            &lt;{{data.socialContent.emailTitle}}&gt;
          </div>
          <div class="date">{{data.socialContent.openTime|time-formater-has-hour}}
            <span class="email-marking-flag" v-if="(data.socialContent).mailMarketingFlag">
              营销邮件
            </span>
          </div>
        </span>
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
      contactType: 0
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
  computed: {
    contactBase () {
      return this.$store.getters.contactDetail.base
    },
    contactInfo () {
      return this.$store.getters.desc
    }
  },
  components: {
    ShowMore
  },
  methods: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../../assets/style/timeline";
  .mail-state-wrapper{
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
    .mail-state-container{
      // position: relative;
      // margin-left: 40px;
      // background: #fff;
      // padding: 21px 20px 20px 20px;
      // border-radius: 4px;
      .header{
        .email-marking-flag{
          position: static;
          // top: 23px;
          // right: 21px;
          // width: 60px;
          height: 22px;
          line-height: 22px;
          border-radius: 4px;
          // font-size: 12px;
          // color: #fff;
          // background-color: #5488f9;
          // text-align: center;
        }
        // position: relative;
        // width: 100%;
        // font-size: 0;
        // .email-marking-flag{
          /*position: absolute;*/
          // top: 23px;
          // right: 21px;
          // width: 60px;
          // height: 18px;
          // font-size: 12px;
          // color: #fff;
          // background-color: #5488f9;
          // text-align: center;
          // line-height: 18px;
        // }
        // .avatar{
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        //   margin-right: 7px;
        //   vertical-align: top;
        // }
      }
    }
  }
</style>
