<template><!--pop图片轮播弹框-->
  <div data-v-22c5ced8="" class="ip-roast-pop" v-if="imgPreview.show" @click="imgPreview.show=false">
    <div class="pop-content">
      <div style="text-align: center;">
        <span style="
            display: inline-block;
            position: relative;
        ">
        <i class="icon-font go go-left" @click.stop="go(-1)">&#xe60a;</i>
          <img class="preview-src" :src="src">
        <i class="icon-font go go-right" @click.stop="go(1)">&#xe613;</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      imgPreview: {
        show: false,
        imgs: [{}]
      }
    },
    data () {
      return {
      }
    },
    mounted () {
      console.log(this.imgPreview)
    },
    computed: {
      src () {
        let index = this.$store.state.monitor.index
        if (this.imgPreview.imgs[index] === undefined) {
          return ''
        }
        return this.imgPreview.imgs[index].url || this.imgPreview.imgs[index].address || this.imgPreview.imgs[index].imgUrl || this.imgPreview.imgs[index].href
      }
    },
    methods: {
      go (step) {
        let index = this.$store.state.monitor.index
        if (index + step < 0) index = this.imgPreview.imgs.length
        index = (index + step) % this.imgPreview.imgs.length
        this.$store.commit('MONITOR_IMGINDEX', {index})
        console.log(index)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../assets/style/variable';
  .ip-roast-pop{
    z-index: 999;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.6);
    top: 0px;
    left: 0px;
    .pop-content{
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      .preview-src{
        max-width: 1200px;
        max-height: 450px;
      }
      .go{
        cursor: pointer;
        position: absolute;
        top: 50%;
        margin-top: -40px;
        font-size: 80px;
        color: rgb(191, 196, 217);
      }
      .go-left{
        font-style: normal!important;
        left: -180px;
      }
      .go-right{
        font-style: normal!important;
        right: -180px;
      }
      .el-dialog{
        width: auto;
        background: rgba(255,255,255,0);
        box-shadow: 0 1px 3px rgba(0,0,0,0);
        border: none;
        .el-dialog__header{
          .el-dialog__headerbtn{
            position: absolute;
            color: @textColor;
            font-size: 30px;
            top:-40px;
            right: -220px;
          }
          .el-dialog__close{
            font-size: 30px;
          }
        }
      }
    }
  }
</style>
