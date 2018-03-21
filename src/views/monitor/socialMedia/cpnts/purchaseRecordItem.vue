<template>
  <div class="tl-content-wraper">
      <tl-header :timeLineType="'purchase'" :name="localSocialMedialItemJson.contentJson.buyer"></tl-header>
      <div class="purchase-info">
          <div class="purchase-footer">
            <span class="from" :title="localSocialMedialItemJson.contentJson.loadingPort">
                {{localSocialMedialItemJson.contentJson.loadingPort}}
            </span>
            <span class="icon-font from-to-dist-icon">&#xe6b0;</span>
            <span class="to" :title="localSocialMedialItemJson.contentJson.unloadingPort">
                {{localSocialMedialItemJson.contentJson.unloadingPort}}
              
            </span>
            <span class="hs-code">Hs Code: </span>
            <span class="hs-code-value">{{localSocialMedialItemJson.contentJson.hsCode}} </span>
            <span class="date">
                {{localSocialMedialItemJson.contentJson.arrivaldate|time-formater-no-hour}}
            </span>
          </div>
          <div class="kg-wraper">
              {{localSocialMedialItemJson.contentJson.weightKg}} KG
           <div class="piece">
              {{localSocialMedialItemJson.contentJson.quantity}} piece
           </div>
          </div>
          <div class="product-wraper">
            <span :title="localSocialMedialItemJson.contentJson.exporter">
            {{localSocialMedialItemJson.contentJson.exporter}}
            </span>
           <div class="product">
             产品描述:{{localSocialMedialItemJson.contentJson.details}}
           </div>
          </div>
          
         
      </div>
     
  </div>
</template>

<script>
  import tlHeader from './cpnts/tlHeader'
  export default{
    props: ['socialMediaItem'],
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
      /**
       * 把 socialMediaItem 中的 content字段转化成标准json格式
       * @return {[type]} [description]
       */
      localSocialMedialItemJson: function () {
        let smJson = {}
        Object.assign(smJson, this.socialMediaItem, {contentJson: JSON.parse(this.socialMediaItem.content) || {}})
        return smJson
      }
    },
    watch: {
    },
    methods: {
    },
    components: {
      tlHeader
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tl-content-wraper{
  .purchase-footer{
    height: 30px;
    line-height: 30px;
    background: #eef4f9;
    width:100%;
    .from-to-dist-icon{
      margin: 0 16px;
      color: #B0C1D4;
    }
    .from{
      margin-left:30px;
      font-size: 13px;
      color: #33475B;
      width:140px;
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .to{
      font-size: 13px;
      color: #33475B;
      width:140px;
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .hs-code{
      color:#7C98B6;
      font-size: 13px;
    }
    .hs-code-value{
      color:#33475B;
      font-size: 13px;
      margin-left:15px;
    }
    .date{
      font-size: 13px;
      color: #4F6D95;
      float: right;
      margin-right:30px;
    }
  }
  .purchase-info{
    &>div{
      display: inline-block;
      vertical-align: middle;
    }
    div.kg-wraper{
      width:210px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-right: 1px solid #DFE3EB;
      font-size: 20px;
      color: #33475B;
      height: 40px;
      margin-top:24px;
      .piece{
        font-size: 14px;
        color: #7C98B6;
        margin-top:2px;
        line-height: 20px;
      }
    }
    div.product-wraper{
      width:340px;
      margin-left:40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 20px;
      color: #33475B;
      height: 40px;
      margin-top:24px;
      .product{
        font-size: 14px;
        color: #7C98B6;
        margin-top:2px;
        line-height: 20px;
      }
    }

    .purchase-value{
      width:100%;
      font-size: 14px;
      color: #33475B;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .purchase-title{
      font-size: 13px;
      color: #7C98B6;
      height: 18px;
      line-height: 18px;
    }
  }
}
</style>
