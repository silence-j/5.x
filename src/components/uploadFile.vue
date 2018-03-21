<template>
  <div class="upload-wrapper">
    <div class="layout">
      <img :src="pic" v-if="this.type!=='img'" alt="" class="file-img">
      <div class="img-wrapper" v-if="this.type==='img'" :style="{backgroundImage: 'url(' + pic + ')'}"></div>
      <!-- <el-progress :percentage="options.percentage" :show-text="false" :stroke-width="6"></el-progress> -->
      <div class="process-diy">
        <div class="inner"></div>
      </div>
      <p class="text-tip">上传中...</p>
    </div>
  </div>
</template>
<script>
import commonFunc from '../views/material/commonFunc.js'
export default {
  name: '',
  data () {
    return {
      pic: '',
      type: ''
    }
  },
  mounted () {
    this.type = commonFunc.fileType(this.options.raw.type, this.options.raw.name)
    this.pic = this.type === 'img' ? this.options.url : `/static/img/material/${this.type}ing.png`
  },
  computed: {
  },
  props: {
    options: {
      type: Object
    }
  },
  components: {
  },
  methods: {

  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @keyframes process
  {
    0%   {left: 0;}
    100% {left: 80%;}
  }
  .upload-wrapper{
    display: inline-block;
    position: relative;
    width: 124px;
    height: 115px;
    margin: 0 3.6px;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    vertical-align: top;
    .layout{
      width: 66px;
      position: absolute;
      bottom: 10px;
      left: 29px;
      .file-img{
        width: 66px;
        height: auto;
        margin-bottom: 5px;
        opacity: 0.5;
        background-color: #fff;
      }
      .img-wrapper{
        width: 66px;
        height: 66px;
        margin-bottom: 5px;
        opacity: 0.5;
        background-color: #fff;
        background-position: center;
        background-size: cover;
      }
      .process-diy{
        position: relative;
        width: 66px;
        height: 8px;
        border: 1px solid #5488f9;
        box-sizing: border-box;
        border-radius: 4px;
        .inner{
          position: absolute;
          width: 20%;
          height: 6px;
          background-color: #5488f9;
          animation: process 1s infinite;
        }
      }
      .text-tip{
        font-size: 13px;
        color: #7c98b6;
        margin-top: 3px;
      }
    }
  }
</style>
