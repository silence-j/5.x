<template>
  <div class="comment-container">
    <ShowMore :text="commentInfo.content" :len="148"></ShowMore>
    <div class="comment-text">
      <p>{{commentInfo.sendTime | time-formater-has-hour}}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import ShowMore from '../../../components/showMore.vue'
  import ImgGroup from './imgGroup.vue'
  import Operate from './operate.vue'

  export default{
    data () {
      return {
      }
    },
    props: {
      commentInfo: Object
    },
    components: {
      ShowMore,
      ImgGroup,
      Operate
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .comment-container{
    .describe{
      font-size: 14px;
      color: @detailTextColor;
    }
    .comment-text{
      margin-top: 9px;
      p{
        display: inline-block;
        font-size: 13px;
        color: @detailTextColor;
      }
    }
  }
</style>
