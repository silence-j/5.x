<template>
  <div>
    <div class="comment-item">
      <div v-if="commentItem.profile.thumbSrc" class="cmt-head" :style="'background:url(' + commentItem.profile.thumbSrc+ ');background-size:cover;'" @click="open(commentItem.profile.id)"></div>
      <div v-else class="cmt-head" :style="'background:url(../../../static/img/default_avatar.png);background-size:cover;'" @click="open(commentItem.profile.id)"></div>
      <div class="cmt-info">
        <div class="cmt-name" @click="open(commentItem.profile.id)">{{commentItem.profile.name}}</div>
        <div class="cmt-comment">{{commentItem.text}}</div>
        <div class="cmt-time">{{commentItem.commentTime |time-formater-has-hour}}</div>
      </div>
    </div>
    <div class="second-lever-comment-wraper">
      <template  v-for="(item , index) in commentItem.replies">
        <secondComments :reply-item="item" v-if="index< maxLength"></secondComments>
      </template>
      
    </div>
    <div class="view-all-comment" v-if="maxLength < (commentItem.replies&&commentItem.replies.length)">
      <span @click="maxLength = (commentItem.replies&&commentItem.replies.length)">
        全部回复({{commentItem.replies.length}})
      </span>
    </div>
    <div class="sp-line"></div>
  </div>

</template>

<script>
  import secondComments from './secondComments'

  export default{
    props: ['commentItem'],
    data () {
      return {
        maxLength: 3
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
      secondComments
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .view-all-comment{
    font-size: 12px;
    color: #4F6D95;
    margin-top:8px;
    span{
      margin-left:89px;
      cursor: pointer;
    }
  }
  .second-lever-comment-wraper{
    margin-left:48px;
    border-left:1px solid #B0C1D4;
  }
  .sp-line{
    border-bottom:1px solid #DFE3EB;
    margin:20px 0 16px 0;
  }
  .comment-item{
    display: flex;
    align-items:center;
    
    .cmt-head{
      width:32px;
      height:32px;
      background: green;
      cursor: pointer;
    }
    .cmt-info{
      width:570px;
      margin-left:8px;
      .cmt-name{
        font-size: 13px;
        color: #5488F9;
        line-height: 18px;
        vertical-align: middle;
        cursor: pointer;
        display: inline-block;
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
