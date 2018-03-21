<template>
  <div class="custom-info-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe632;</span>
    </span>
    <div class="custom-info-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{contactInfo.name}}
            <span style="color: #7C98B6;font-weight: 500">有一条海关数据</span>
          </div>
          <div class="date">{{data.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
      <ShowMore :maxHeight="0" showTip="查看详情" hidTip="隐藏">
        <div v-if="data.socialContent.detail" class="compire">
          <div class="compire-info" v-if="data.socialContent.detail.originCountry">
            <span class="compire-title">来源国</span>
            <span class="compire-value">{{data.socialContent.detail.originCountry || '未知'}}</span>
          </div>
          <div class="compire-info" v-if="data.socialContent.detail.tradeTime">
            <span class="compire-title">交易时间</span>
            <span class="compire-value">{{data.socialContent.detail.tradeTime |time-formater-has-hour }}</span>
          </div>
          <div class="compire-info" v-if="data.socialContent.detail.supplier">
            <span class="compire-title">采购商</span>
            <span class="compire-value">{{data.socialContent.detail.supplier || '未知'}}</span>
          </div>
          <div class="compire-info" v-if="data.socialContent.detail.weight">
            <span class="compire-title">重量</span>
            <span class="compire-value">{{data.socialContent.detail.weight || '未知'}}</span>
          </div>
          <div class="compire-info" v-if="data.socialContent.detail.productDesc">
            <span class="compire-title">产品描述</span>
            <span class="compire-value">{{data.socialContent.detail.productDesc || '未知'}}</span>
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
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .custom-info-wrapper{
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
    .custom-info-container{
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
        .compire{
          margin-top: 10px;
          .compire-info{
            border-bottom: 1px dashed #DFE3EB;
            padding: 20px 0;
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
  }
</style>
