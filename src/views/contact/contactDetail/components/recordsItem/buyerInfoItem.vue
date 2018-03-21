<template>
  <div class="timeline-wrapper buyer-info-wrapper" v-if="data.contactType==0">
    <span class="type-icon">
      <span class="icon-font">&#xe637;</span>
    </span>
    <div class="timeline-container buyer-info-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{contactInfo.name}}
            <span class="text-light">访问了官网</span>
          </div>
          <div class="date">{{data.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
          <div class="buyer-table" v-show="showMore" v-loading="isLoading">
            <table>
              <tr class="update-tr first-title">
                <td class="update-td">属性</td>
                <td class="update-td">轨迹</td>
                <td class="update-td">时间</td>
              </tr>
            </table>
            <table>
              <tr class="update-tr">
                <td class="update-td" colspan="1">浏览次数</td>
                <td class="update-td" colspan="2">{{buyerInfo.pv ||'&nbsp;'}}</td>
              </tr>
              <tr class="update-tr">
                <td class="update-td" colspan="1">停留时间</td>
                <td class="update-td" colspan="2">{{stayTime ||'&nbsp;'}}</td>
              </tr>
              <tr class="update-tr" v-if="buyerInfo.loginVo">
                <td class="update-td">登录信息</td>
                <td class="update-td">{{buyerInfo.loginVo.title ||'&nbsp;'}}</td>
                <td class="update-td" v-if="buyerInfo.loginVo.createTime">
                  {{buyerInfo.loginVo.createTime | time-formater-only-hourminute}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr class="update-tr" v-if="buyerInfo.referrerVo">
                <td class="update-td">访问来源</td>
                <td class="update-td">{{referrerUrl ||'&nbsp;'}}</td>
                <td class="update-td" v-if="buyerInfo.referrerVo.createTime!='' && buyerInfo.referrerVo.createTime!=null && buyerInfo.referrerVo.url">{{buyerInfo.referrerVo.createTime | time-formater-only-hourminute}}</td>
                <td class="update-td" v-else>-</td>
              </tr>
              <tr class="update-tr" v-if="buyerInfo.landUrlVo">
                <td class="update-td">着陆页面</td>
                <td class="update-td">
                  <p v-if="buyerInfo.landUrlVo.url.indexOf('product') > 0">产品详情页</p>
                  <a :href="buyerInfo.landUrlVo.url" target="_blank" class="blue">{{buyerInfo.landUrlVo.title ||'&nbsp;'}}</a>
                </td>
                <td class="update-td" v-if="buyerInfo.landUrlVo.createTime!='' || buyerInfo.landUrlVo.createTime!=null">{{buyerInfo.landUrlVo.createTime | time-formater-only-hourminute}}</td>
                <td class="update-td" v-else>-</td>
              </tr>
              <tr class="update-tr" v-if="buyerInfo.productPageList.length>0" v-for="productObj in buyerInfo.productPageList">
                <td class="update-td">查看商品</td>
                <td class="update-td"><a :href="productObj.url " target="_blank" class="ordinary">{{productObj.title ||'&nbsp;'}}</a></td>
                <td class="update-td" v-if="productObj.createTime!=='' || productObj.createTime!==null">{{productObj.createTime | time-formater-only-hourminute}}</td>
                <td class="update-td" v-else>&nbsp;</td>
              </tr>
            </table>
          </div>
          <!-- 点击展开之后再去请求借口，所以不能用showmore组件 -->
          <a href="javascript:void(0)" @click="showMoreOrHid" class="show-hid-btn">{{showMoreText}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import contactInfoApi from '@/api/contactInfoApi'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      buyerInfo: {},
      showMore: false,
      showMoreText: '查看详情',
      // 第一次请求借口，隐藏后不再二次请求
      isDataReady: false,
      isLoading: false
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
    },
    stayTime () {
      if (!this.buyerInfo.uvTime) {
        return this.buyerInfo.uvTime
      } else {
        let time = this.buyerInfo.uvTime / 1000
        let hour = parseInt(time / 3600)
        let minute = parseInt((time - (3600 * hour)) / 60)
        let socend = parseInt(time - (3600 * hour) - (60 * minute))
        return `${hour}个小时  ${minute}分钟  ${socend}秒`
      }
    },
    referrerUrl () {
      let url = this.buyerInfo.referrerVo.url
      if (url.indexOf('https://t.co') >= 0) {
        return 'https://twitter.com'
      }
      return url
    }
  },
  components: {
  },
  methods: {
    showMoreOrHid () {
      let showMoreText = this.showMoreText === '查看详情' ? '隐藏' : '查看详情'
      this.showMore = !this.showMore
      this.showMoreText = showMoreText
      if (this.showMore && !this.isDataReady) {
        this.isLoading = true
        let params = {
          // buyerId: sessionStorage.getItem('buyerId') ? sessionStorage.getItem('buyerId') : '',
          createTime: this.data.createTime,
          browseEndTime: this.data.browseEndTime,
          platform: 0,
          cookie: this.data.socialContent.cookie
        }
        if (sessionStorage.getItem('buyerId') !== '' && sessionStorage.getItem('buyerId') !== null && sessionStorage.getItem('buyerId') !== 'null') {
          let buyerId = sessionStorage.getItem('buyerId')
          params.buyerId = buyerId
        }
        contactInfoApi.getFootprintDetail(params).then(res => {
          if (res.data.code === 0) {
            this.buyerInfo = res.data.data
            this.isLoading = false
            this.isDataReady = true
          }
        })
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../../assets/style/timeline";
  .buyer-info-wrapper{
    .buyer-info-container{
      .header{
        height: 59px;
        border-bottom: 1px solid #eaf0f6;
      }
      .content{
        .buyer-table{
            border: 1px solid #EAF0F6;
            margin-top:17px;
            text-align: center;
            overflow: hidden;
            .first-title.update-tr{
              background: #F5F8FA;
              .update-td:nth-child(1){
                color: #33475B;
              }
              .update-td:nth-child(2){
                color: #33475B;
              }
              .update-td:nth-child(3){
                color: #33475B;
              }
            }
            .update-tr{
              border-top: 1px solid #EAF0F6;
              border-bottom:none;
              padding:0 0;
              .update-td{
                padding:11px 10px;
                border-left: 1px solid #EAF0F6;
                word-break: break-all;
                float: initial;
              }
              .update-td:nth-child(1){
                border-left:none;
                width:18%;
                font-size: 13px;
                line-height: 18px;
                color: #33475B;
              }
              .update-td:nth-child(2){
                width:62.7%;
                font-size: 13px;
                color: #33475B;
                line-height: 18px;
              }
              .update-td:nth-child(3){
                font-size: 13px;
                color: #33475B;
                line-height: 18px;
              }
              .ordinary{
                color: #33475B;
              }
            }
          .update-tr:first-child{
            border-top:none;
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
  }
</style>
