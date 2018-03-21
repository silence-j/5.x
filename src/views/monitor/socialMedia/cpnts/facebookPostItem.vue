<template>
  <div class="tl-content-wraper">
      <tl-header :timeLineType="'facebook'" :name="localSocialMedialItemJson.contentJson.name" :head="aboutInfo.img" :pagelink="aboutInfo.link"></tl-header>
      <div class="post-info">
        {{localSocialMedialItemJson.contentJson.content}}
        <!-- 视频链接 -->
        <template v-if="localSocialMedialItemJson.contentJson.videoLink">
          <div class="vedio-wraper">
            <img v-if="localSocialMedialItemJson.contentJson.imgUrl" :src="localSocialMedialItemJson.contentJson.imgUrl" width="100%" @click="openUrl(localSocialMedialItemJson.contentJson.videoLink)">
            <div class="video-modal"></div>
            <i class="icon-font vedio-icon">&#xe61f;</i>
          </div>
        </template>
        <!-- 图片链接 -->
        <template v-else>
          <img v-if="localSocialMedialItemJson.contentJson.imgUrl" :src="localSocialMedialItemJson.contentJson.imgUrl" width="100%" style="margin-top:10px;">
        </template>

      </div>
      <div class="sp-line"></div>
        <template  v-for="(item , index) in localSocialMedialItemJson.contentJson.comments">
          <comments :comment-item="item" v-if="index< maxLength" :key="index"></comments>
        </template>
      <div class="all-comments">
        <span @click="maxLength = (localSocialMedialItemJson.contentJson.comments&&localSocialMedialItemJson.contentJson.comments.length)" v-if="maxLength < (localSocialMedialItemJson.contentJson.comments&&localSocialMedialItemJson.contentJson.comments.length)">
          全部评论
        </span>
      </div>
  </div>
</template>

<script>
  import tlHeader from './cpnts/tlHeader'
  import comments from './cpnts/comments'
  import SocialMediaAPI from '@/api/socialMedia'
  export default{
    props: ['socialMediaItem'],
    data () {
      return {
        maxLength: 3,
        aboutInfo: {}
      }
    },
    mounted () {
      /**
       * 请求数据
       */
      SocialMediaAPI.getFbAbout({pubId: this.localSocialMedialItemJson.contentJson.pubId}).then(res => {
        if (!res.data.code) {
          this.aboutInfo = res.data.data || {}
        }
      })
    },
    computed: {
      /**
       * 把 socialMediaItem 中的 content字段转化成标准json格式
       * @return {[type]} [description]
       */
      localSocialMedialItemJson: function () {
        let smJson = {}
        Object.assign(smJson, this.socialMediaItem, {contentJson: JSON.parse(this.socialMediaItem.content || {})})
        return smJson
      }
    },
    watch: {
    },
    methods: {
      openUrl (link) {
        window.open(link)
      }
    },
    components: {
      tlHeader,
      comments
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tl-content-wraper{
  .vedio-wraper{
    position: relative;
    margin-top:10px;
    line-height: 0;
    .video-modal{
      background: rgba(0,0,0,.6);
      position: absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      cursor: pointer;
    }
    .vedio-icon{
      position: absolute;
      top:50%;
      left:50%;
      font-size:30px;
      cursor: pointer;
    }
  }
  .post-info{
    font-size: 13px;
    color: #33475B;
    line-height: 18px;
  }
  .sp-line{
    border-bottom:1px solid #DFE3EB;
    margin:20px 0 16px 0;
  }
  .all-comments{
    font-size: 14px;
    color: #4F6D95;
    text-align: center;
    span{
      cursor: pointer;
    }
  }
}
</style>
