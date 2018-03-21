<template>
  <div>
    <div class="second-comment-item">
      <div v-if="replyItem.profile.thumbSrc" class="cmt-head" :style="'background:url(' + replyItem.profile.thumbSrc+ ');background-size:cover;'" @click="open(replyItem.profile.id)"></div>
      <div v-else class="cmt-head" :style="'background:url(../../../static/img/default_avatar.png);background-size:cover;'" @click="open(replyItem.profile.id)"></div>
      <div class="cmt-info">
        <div class="cmt-name" @click="open(replyItem.profile.id)">{{replyItem.profile.name}}</div>
        <div class="cmt-comment">{{replyItem.text}}</div>
        <div class="cmt-time">{{replyItem.commentTime |time-formater-has-hour}}</div>
      </div>
    </div>
  </div>

</template>

<script>

  export default{
    props: ['replyItem'],
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
    },
    watch: {
    },
    methods: {
      open (url) {
        window.open('https://www.facebook.com/' + url)
      }
    },
    components: {
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .sp-line{
      border-bottom:1px solid #DFE3EB;
      margin:20px 0 16px 0;
    }
  .second-comment-item{
    display: flex;
    align-items:center;
    margin-top:16px;
    
    .cmt-head{
      width:24px;
      height:24px;
      background: blue;
      margin-left:10px;
      cursor: pointer;
    }
    .cmt-info{
      margin-left:8px;
      width:520px;
      .cmt-name{
        font-size: 13px;
        color: #5488F9;
        line-height: 18px;
        vertical-align: middle;
        display: inline-block;
        cursor: pointer;
      }
      .cmt-comment{
       font-size: 12px;
        color: #33475B;
        line-height: 17px;

      }
      .cmt-time{
        font-size: 12px;
        line-height: 17px;
        color: #7C98B6;
      }
    }
  }
</style>
