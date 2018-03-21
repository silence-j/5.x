<template>
  <div v-if="companyInfo" >
    <div class="company-detail-wraper social-media-boxshadow">
        <div class="company-header">
          <img class="head-pic" :src="`${companyInfo.img}` || '/static/img/default_avatar.png'" onerror="javascript:this.src='/static/img/default_avatar.jpg'" alt="">
          <!--<div v-if="companyInfo.img" class="head-pic" :style="'background:url(' + companyInfo.img+ ') no-repeat;background-size:cover;'"></div>-->
          <!--<div v-else class="head-pic" :style="'background:url(../../../static/img/default_avatar.png) no-repeat;background-size:cover;'"></div>-->
          <div class="name-and-btn">
            <div class="name">
              {{companyInfo.name}}
            </div>
            <div class="visit-home-page" @click="openUrl(companyInfo.url)">访问主页</div>
          </div>
        </div>
        <template v-for="(infoItem, index) in companyInfo.info" >
          <div class="company-title" :key="index">{{infoItem.title}}:</div>
          <div class="story-info-item" :key="index">
            <ShowMore :maxHeight="106" showTip="展开" hidTip="收起">
               <div class="info-item" v-for="(cinfo, i) in infoItem.contentJson"  :key="i">
                  <div class="info-value">
                      {{cinfo}}
                  </div>
                </div>
            </ShowMore>
          </div>
        </template>

      </div> 
  </div>
</template>

<script>
import ShowMore from '@/components/newShowMore.vue'

export default{
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    companyInfo: function () {
      let companyInfoJson = {}
      let cInfoJson = []
      let infoFromVuex = this.$store.getters.socialMediaCompanyInfo.info
      /**
       * 没数据的时候 ，不compute
       */
      if (!infoFromVuex) return undefined
      for (let info of this.$store.getters.socialMediaCompanyInfo.info) {
        info.contentJson = JSON.parse(info.content)
        cInfoJson.push(info)
      }
      Object.assign(companyInfoJson, this.$store.getters.socialMediaCompanyInfo, {cInfoJson: cInfoJson})
      return companyInfoJson
    }
  },
  watch: {
  },
  methods: {
    openUrl (url) {
      window.open(url)
    }
  },
  components: {
    ShowMore
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  .company-detail-wraper{
      width:390px;
      max-height: 850px;
      min-height: 350px;
      position:absolute;
      top:30px;
      left:815px;
      padding:40px 30px;
      box-sizing: border-box;
      .head-pic{
        display: inline-block;
        width:80px;
        height: 80px;
        overflow: hidden;
        /*background: blue;*/
      }
      .name-and-btn{
        display: inline-block;
        vertical-align: top;
        margin-left:20px;
        .name{
          font-size: 16px;
          color: #5488F9;
        }
        .visit-home-page{
          width:100px;
          height: 36px;
          line-height: 36px;
          background: #5488F9;
          border-radius: 4px;
          text-align: center;
          margin-top:21px;
          font-size: 14px;
          color: #FFFFFF;
          cursor:pointer;
          &:hover{
            background: rgb(118, 160, 250);
          }
        }
      }
      .company-title{
        font-size: 14px;
        color: #33475B;
        margin-top:20px;
        margin-bottom: 10px;
        &:first-child{
          margin-top:30px;
        }
      }
      .info-item{
        font-size: 13px;
        color: #7C98B6;
        line-height: 20px;
        margin-top:5px;
        .info-key,.info-value{
          display: inline-block;
        }
        .info-value-line{
          margin-top:5px;
        }
      }
      .story-info-item{
        max-height: 145px;
        overflow-y: auto;

      }

    }
</style>
