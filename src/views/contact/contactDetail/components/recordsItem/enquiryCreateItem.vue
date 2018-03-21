<template>
  <div class="enquiry-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe634;</span>
    </span>
    <div class="enquiry-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{data.socialContent.contactName}}
            <span style="color: #7C98B6;font-weight: 500">通过 商机推荐 被创建</span>
          </div>
          <div class="date">{{data.socialContent.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <ShowMore :maxHeight="0" :showTip="'查看详情'" :hidTip="'隐藏'">
          <div v-if="data.socialContent.tradEnquiryRecommend">
            <h1 class="enquiry-title">{{data.socialContent.tradEnquiryRecommend.enquiryCatagory.oriName}}</h1>
            <br />
            <p class="enquiry-content" v-html="data.socialContent.tradEnquiryRecommend.enquiryContent"></p>
            <ul>
              <li
              class="user-info-item"
              v-for="(value, key) in data.socialContent.tradEnquiryRecommend.enquiryCompany">
                {{key}}: {{value}}
              </li>
            </ul>
          </div>
          <!-- 下面是微询盘 -->
          <tinyEnquiry
          v-if="data.socialContent.microEnquiryRecommend"
          :data="data"></tinyEnquiry>
        </ShowMore>
      </div>
    </div>
  </div>
</template>
<script>
import ShowMore from '@/components/newShowMore.vue'
import tinyEnquiry from './tinyEnquiry'
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
  computed: {
    contactBase () {
      return this.$store.getters.contactDetail.base
    },
    contactInfo () {
      return this.$store.getters.desc
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  components: {
    ShowMore,
    tinyEnquiry
  },
  methods: {

  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .enquiry-wrapper{
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
    .enquiry-container{
      position: relative;
      margin-left: 40px;
      background: #fff;
      padding: 21px 20px 20px 20px;
      border-radius: 4px;
      .header{
        width: 100%;
        height: 59px;
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
        .enquiry-title{
          font-size: 16px;
          margin-top: 16px;
          margin-bottom: 8px;
          color: #33475b;
        }
        .enquiry-content{
          font-size: 13px;
          color: #4f6d95;
          margin-bottom: 16px;
        }
        .user-info-item{
          font-size: 13px;
          color: #4f6d95;
          line-height: 20px;
        }
      }
    }
  }
</style>
