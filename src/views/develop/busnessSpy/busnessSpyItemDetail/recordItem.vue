<template>
  <div class="record-item-wrapper">
    <div class="relative-item-title">
      <span class="out-port">出口商: <span v-html="item.supplier" :title="item.supplier" class="black-color"></span></span>
      <span class="item-code">Hs Code: <span v-html="item.hsCode || '-'" class="black-color"></span></span>
    </div>
    <div class="item-detail">
      <span class="item item-exporter" :title="item.originPort">
        <p class="inner-title">出口港：</p>
        <p class="inner-info">{{item.originPort || '-'}}</p>
      </span>
      <span class="item item-loadingporter" :title="item.destPort">
        <p class="inner-title">到港：</p>
        <p class="inner-info">{{item.destPort || '-'}}</p>
        <p class="inner-time">{{item.arrivaldate.slice(0, 10)}}</p>
      </span>
      <span class="item item-prod">
        <p class="inner-title">产品：</p>
        <p class="inner-prod" v-if="item.quantity">数量：{{Number(item.quantity).toFixed(2)}}</p>
        <p class="inner-prod" v-if="item.weightKg">重量：{{Number(item.weightKg).toFixed(2)}}Kg</p>
        <p class="inner-prod" v-if="item.price">价格：{{Number(item.price).toFixed(2)}}</p>
      </span>
    </div>
    <div class="prod-info">
      <p class="inner-title">产品描述</p>
      <p class="inner-info" :class="showMore ? 'show-all' : ''" v-html="replacedText"></p>
      <div class="toggle-more" @click="toggleShowMore" v-if="pureTextLength >= 96" v-html="showMoreText"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      showMore: false
    }
  },
  props: {
    item: {
      type: Object
    }
  },
  mounted () {

  },
  computed: {
    showMoreText () {
      if (this.showMore) {
        return '收起'
      } else {
        return '<span style="color: #33475b">...</span>查看更多'
      }
    },
    replacedText () {
      return this.item.details.replace(/<em class="text-highlight">/g, '').replace(/<\/em>/g, '')
    },
    pureTextLength () {
      return this.item.details.replace(/<em class="text-highlight">/g, '').replace(/<\/em>/g, '').replace(/<span class="mactch_text">/g, '').replace(/<\/span>/g, '').length
    }
  },
  components: {
  },
  methods: {
    toggleShowMore () {
      this.showMore = !this.showMore
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.record-item-wrapper{
  padding-bottom: 10px;
  .black-color{
    margin-left: 5px;
    font-size: 14px;
    color: #33475B;
  }
  .relative-item-title{
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #f5f8fa;
    color: #7C98B6;
    font-size: 13px;
    .item-code{
      display: inline-block;
      width: 150px;
      height: 40px;
      float: right;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:after{
        content: "";
        width: 0;
        height: 0;
        clear: both;
        display: table-cell;
      }
    }
    .out-port{
      display: inline-block;
      max-width: 440px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .item-detail{
    height: 84px;
    border-bottom: 1px solid #DFE3EB;
    .item{
      padding: 10px 20px;
      border-right: 1px solid #dfe3eb;
      vertical-align: top;
      display: inline-block;
      box-sizing: border-box;
      .inner-title{
        font-size: 13px;
        color: #7C98B6;
        margin-bottom: 6px;
      }
      .inner-info{
        font-size: 14px;
        color: #33475B;
        line-height: 1.3;
        display: -webkit-box;
        /* autoprefixer: off*/
        -webkit-box-orient: vertical;
        /* autoprefixer: on*/
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .inner-time{
        font-size: 14px;
        color: #33475B;
        line-height: 1.3;
      }
    }
    .item-exporter{
      width: 197px;
      height: 84px;
    }
    .item-loadingporter{
      width: 197px;
      height: 84px;
    }
    .item-prod{
      width: 390px;
      height: 84px;
      border-right: none;
      .inner-prod{
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        color: #33475B;
        margin-right: 30px;
      }
    }
  }
  .prod-info{
    box-sizing: border-box;
    padding: 10px 20px;
    border-bottom: 1px solid #CBD6E3;
    .inner-title{
      font-size: 13px;
      color: #7C98B6;
      margin-bottom: 6px;
    }
    .inner-info{
      margin-bottom: 4px;
      text-align: justify;
      display: inline-block;
      vertical-align: top;
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
      color: #33475B;
      line-height: 1.3;
      .mactch_text{
        color: #ffb446;
      }
    }
    .show-all{
      max-width: 100%;
      white-space: normal;
    }
    .toggle-more{
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;
      color: #6594fa;
    }
  }
}
</style>
