<template>
  <div class="tiny-enquiry-wrapper">
    <div class="ori-content">
      <span v-html="data.socialContent.microEnquiryRecommend.oriContent"></span>
      <a
      class="link-text" 
      :href="item.href" 
      v-for="(item, index) in data.socialContent.microEnquiryRecommend.oriLink" 
      :key="index"
      target="_blank">{{item.text}}</a>
    </div>
    <imgPreList 
    v-if="data.socialContent.microEnquiryRecommend.oriPic && data.socialContent.microEnquiryRecommend.oriPic.length>0"
    :options="preListOptions"></imgPreList>
    <!-- 视频显示 -->
    <div class="video-wrapper" v-if="data.socialContent.microEnquiryRecommend.oriVideo">
      <a :href="data.socialContent.microEnquiryRecommend.oriVideo[0].targeturl || 'javascript:void(0)'">
        <img :src="data.socialContent.microEnquiryRecommend.oriVideo[0].coverurl || '/static/img/black.png'" alt="" />
        <i class="icon-font img-see">&#xe61f;</i>
      </a>
    </div>
    <div class="enquiry-detail">
      <a
      target="_blank"
      class="social-link"
      :href="data.socialContent.microEnquiryRecommend.enquiryPerson.fbHomepage ? data.socialContent.microEnquiryRecommend.enquiryPerson.fbHomepage : null">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'">
        <span class="user-name">{{data.socialContent.contactName}}</span>
      </a>
      <div class="enquiry-content">{{data.socialContent.microEnquiryRecommend.enquiryContent}}</div>
    </div>
  </div>
</template>
<script>
import imgPreList from '@/components/imgPreList.vue'
export default {
  name: '',
  data () {
    return {
      preListOptions: {
        imgList: this.data.socialContent.microEnquiryRecommend.oriPic,
        max: 2,
        size: 80
      },
      showAll: false,
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
    imgPreList
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.tiny-enquiry-wrapper{
  padding-top: 16px;
  .ori-content{
    font-weight: 600;
    font-size: 16px;
    text-align: justify;
    .link-text{
      display: inline-block;
      margin-right: 5px;
      color: #5844f9;
      text-decoration: underline;
    }
  }
  .video-wrapper{
    position: relative;
    margin: 16px 0;
    font-size: 0;
    img{
      width: 80px;
      height: 80px;
    }
    .img-see{
      display: inline-block;
      position: absolute;
      top: 24px;
      left: 29px;
      color: #fff;
      opacity: 0.7;
      font-size: 26px;
    }
  }
  .enquiry-detail{
    width: 100%;
    font-size: 0;
    margin-top: 8px;
    .social-link{
      display: inline-block;
      .avatar{
        width: 32px;
        height: 32px;
        margin-right: 16px;
        vertical-align: top;
      }
      .user-name{
        display: inline-block;
        font-size: 16px;
        color: #5488f9;
        height: 32px;
        line-height: 32px;
        vertical-align: top;
      }
    }
    .enquiry-content{
      width: 100%;
      margin-top: 8px;
      color: #4f6d95;
      font-size: 13px;
    }
  }
}
</style>
