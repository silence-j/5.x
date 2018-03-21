<template>
  <ul class="operate-container">
    <li @click="approve($event)" :class="item.opportunityStatus == 1?'approve':''">
      <i class="icon-font">&#xe60e;</i>
      <span>赞</span>
    </li>
    <li @click="reply($event)">
      <i class="icon-font">&#xe62f;</i>
      <span>回复</span>
    </li>
    <li @click="share($event)" v-if="item.socialAccountType != 2 && item.opportunityType != 4 && item.opportunityType != 6 && item.opportunityType != 11">
      <i class="icon-font">&#xe692;</i>
      <span>转发</span>
    </li>
    <li @click="share($event)" v-if="item.socialAccountType == 2">
      <i class="icon-font">&#xe71a;</i>
      <span>转推</span>
    </li>
  </ul>
</template>

<script>
  export default{
    data () {
      return {
        isApprove: false
      }
    },
    props: {
      item: Object
    },
    methods: {
      approve (event) {
        event.stopPropagation()
        this.$emit('approve')
      },
      reply (event) {
        event.stopPropagation()
        this.$emit('reply')
      },
      share (event) {
        event.stopPropagation()
        this.$emit('share')
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .operate-container{
      overflow: hidden;
      list-style: none;
      margin-top: 16px;
      li{
        float: left;
        margin-right: 20px;
        font-size: 12px;
        color: @detailTextColor;
        cursor: pointer;
        i{
          margin-right: 5px;
          font-size: 14px;
        }
      }
      li:hover{
        color: @activeBlue;
      }
      li.approve{
        color: @activeBlue;
      }
    }
</style>
