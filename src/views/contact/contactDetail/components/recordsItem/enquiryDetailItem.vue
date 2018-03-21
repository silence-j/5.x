<template>
  <div class="enquiry-detail-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe631;</span>
    </span>
    <div class="enquiry-detail-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{data.socialContent.detail.firstName}}{{data.socialContent.detail.lastName}}
            <span style="color: #7C98B6;font-weight: 500">在</span>
            {{data.socialContent.source}}所在的页面
            <span style="color: #7C98B6;font-weight: 500">提交了一份询盘</span>
          </div>
          <div class="date">{{data.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <ShowMore :maxHeight="0" showTip="查看详情" hidTip="隐藏">
          <div>
            <div class="product-info compire-info" v-if="data.socialContent.detail.product&&data.socialContent.detail.product.productName&&data.socialContent.detail.product.productPic">
              <a @click="goToProduct('/detail?shopId=' + contactBase.companyId + '&productId=' + data.socialContent.detail.product.productId)" >
                <img class="compire-img" v-if="data.socialContent.detail.product.productPic" :src="data.socialContent.detail.product.productPic">
              </a>
              <div class="compire-wraper">
                <span class="compire-desc" v-if="data.socialContent.detail.product.productName">{{data.socialContent.detail.product.productName}}</span>
                <br>
                <span class="compire-price">
                  {{data.socialContent.detail.product.productPrice}}
                </span>
              </div>
            </div>
            <!-- 因为有固定的排序和不确定的内容，所以不能用for -->
            <div class="compire-info" v-if="data.socialContent.detail.firstName">
              <span class="compire-title">First Name</span>
                <span class="compire-value">{{data.socialContent.detail.firstName}}</span>
            </div>
            <div class="compire-info" v-if="data.socialContent.detail.lastName">
              <span class="compire-title">last Name</span>
                <span class="compire-value">{{data.socialContent.detail.lastName}}</span>
            </div>
            <div class="compire-info" v-if="data.socialContent.detail.email">
              <span class="compire-title">email</span>
                <span class="compire-value">{{data.socialContent.detail.email}}</span>
            </div>
            <div class="compire-info" v-if="data.socialContent.detail.company">
              <span class="compire-title">company</span>
                <span class="compire-value">{{data.socialContent.detail.company}}</span>
            </div>
            <div class="compire-info" v-if="data.socialContent.detail.content">
              <span class="compire-title">content</span>
                <span class="compire-value">{{data.socialContent.detail.content}}</span>
            </div>
            <div class="compire-info" v-if="data.socialContent.detail.phone">
              <span class="compire-title">phone</span>
                <span class="compire-value">{{data.socialContent.detail.phone}}</span>
            </div>
          </div>
        </ShowMore>
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
    goToProduct (url) {
      window.open(process.env.HOMEPAGE + url)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .enquiry-detail-wrapper{
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
    .enquiry-detail-container{
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
        .compire-info{
          border-bottom: 1px dashed #DFE3EB;
          padding: 20px 0;
          .compire-img{
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 0;
          }
          .compire-wraper{
            display: inline-block;
            width: 555px;
            vertical-align: top;
            margin-left: 5px;
          }
          .compire-price{
            font-weight: bolder;
            font-size: 12px;
            margin-top: 5px;
            display: inline-block;
          }
          .compire-title{
            display: inline-block;
            width: 100px;
            color: #7C98B6;
          }
          .compire-value{
            line-height: 20px;
          }
        }
      }
    }
  }
</style>
