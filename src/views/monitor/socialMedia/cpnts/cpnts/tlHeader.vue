<template>
  <div class="tl-content-wraper">
      <div class="tl-item-header">
        <div class="flex-left">
          <template v-if="timeLineType === 'facebook'" >
            <img class="tl-head-pic" :src="`${head}` || '/static/img/default_avatar.png'" onerror="javascript:this.src='/static/img/default_avatar.jpg'" alt="">
            <!--<div v-if="head" class="tl-head-pic" :style="'background:url(' + head+ ');background-size:cover;'"></div>-->
            <!--<div v-else class="tl-head-pic" :style="'background:url(../../../static/img/default_avatar.png);background-size:cover;'"></div>-->
          </template>
          <div class="name-and-tip">
            <div class="tl-user-name">{{name}}</div>
            <div class="tl-tip" v-if="timeLineType === 'facebook'">在Facebook上发布了新的贴子</div>
            <div class="tl-tip" v-if="timeLineType === 'purchase'">监测到一条新的采购记录</div>
          </div>
        </div>
        <div v-if="timeLineType === 'facebook'" class="flex-right home-page-introduce">主页介绍</div>
      </div>
  </div>
</template>

<script>

  export default{
    props: ['timeLineType', 'name', 'head', 'pagelink'],
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
        window.open(url)
      }
    },
    components: {
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.tl-content-wraper{
  .tl-item-header{
    display: flex;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid #DFE3EB;
    padding-bottom:10px;
    margin-bottom:11px;
    .flex-left{
      display: flex;
      .tl-head-pic{
        width:40px;
        height:40px;
        /*background: yellow;*/
      }
      .name-and-tip{
        margin-left:8px;
        .tl-user-name{
          font-size: 14px;
          line-height: 20px;
          vertical-align: middle;
          color: #5488F9;
        }
        .tl-tip{
          font-size: 13px;
          color: #33475B;
          margin-top:3px;
        }
      }
    }
    .home-page-introduce{
      background: #FFFFFF;
      border: 1px solid #CBD6E3;
      border-radius: 2px;
      width:60px;
      height: 22px;
      line-height: 22px;
      color: #4F6D95;
      text-align: center;
      cursor: pointer;
      align-self: flex-start;
    }
  }
}
</style>
