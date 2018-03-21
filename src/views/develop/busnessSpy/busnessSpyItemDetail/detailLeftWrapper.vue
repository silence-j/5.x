<template>
<div class="left-wrapper">
  <div class="info-wrapper">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <h1 class="title">概况</h1>
      <div>
        <span class="info-item">
          <h2 class="item-title">地址</h2>
          <p class="address-content" 
          v-if="data.baseInfo && data.baseInfo.address"
          :title="`${data.baseInfo.address.address} ${data.baseInfo.address.state} ${data.baseInfo.address.country}`">
            {{data.baseInfo.address.address}}
            {{data.baseInfo.address.state}}
            {{data.baseInfo.address.country}}
          </p>
          <p class="address-content" v-else>
            -
          </p>
        </span>
        <i class="line"></i>
        <span class="info-item">
          <h2 class="item-title">联系方式</h2>
          <p class="time-content" v-if="data.baseInfo.telephone">{{data.baseInfo.telephone}}</p>
          <p class="time-content" v-else>-</p>
        </span>
        <i class="line"></i>
        <span class="info-item">
          <h2 class="item-title">营业额</h2>
          <p class="sales-content" v-if="data.baseInfo.sales">{{data.baseInfo.sales}}</p>
          <p class="sales-content" v-else>-</p>
        </span>
        <i class="line"></i>
        <span class="info-item">
          <h2 class="item-title">员工数量</h2>
          <p class="count-content" v-if="data.baseInfo.companySize">{{data.baseInfo.companySize}}</p>
          <p class="count-content" v-else>-</p>
        </span>
      </div>
    </div>
  </div>
  <trend :data="data"></trend>
  <record :data="data"></record>
  <relation :data="data"></relation>
</div>
</template>
<script>
import trend from './detailTrendWrapper'
import record from './detailRecordWrapper'
import relation from './detailRelationWrapper'
export default {
  name: '',
  data () {
    return {
      isLoading: true
    }
  },
  mounted () {

  },
  watch: {
    data (newVal, oldVal) {
      if (newVal) {
        this.isLoading = false
      }
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {

  },
  components: {
    trend,
    record,
    relation
  },
  methods: {

  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .left-wrapper{
    display: inline-block;
    width: 784px;
    margin-right: 16px;
    vertical-align: top;
    .info-wrapper{
      width: 100%;
      height: 130px;
      padding: 20px 30px;
      box-sizing: border-box;
      background-color: #fff;
      margin-bottom: 16px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      .loading{
        margin: 30px auto;
      }
      .title{
        font-weight: 500;
        font-size: 18px;
        margin-bottom: 9px;
        color: #33475b;
      }
      .info-item{
        display: inline-block;
        vertical-align: top;
        .item-title{
          font-size: 13px;
          color: #7c98b6;
          font-weight: 500;
        }
        .address-content, .time-content, .sales-content, .count-content{
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 1.2;
          color: #33475b;
          margin-top: 10px;
        }
        .time-content{
          width: 120px;
        }
        .sales-content{
          width: 85px;
        }
        .count-content{
          width: 72px;
        }
      }
      .line{
        display: inline-block;
        position: relative;
        width: 2px;
        height: 36px;
        margin: 0 40px;
        background-color: #dfe3eb;
      }
    }
  }
</style>
