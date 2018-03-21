<template>
  <div>
    <div class="img-box">
      <img :src="newSrc ? newSrc.urlWhole : defaultSrc" alt="" class="preview-img">
      <div class="change-img" @click="changeImg">
        <span class="icon-font">&#xe68a;</span>
        更换
      </div>
    </div>
    <!-- 素材库弹窗 -->
    <uploadMaterial 
    :options="materialOptions"
    @confirmInsert="confirmInsert"
    @cancelInsert="cancelInsert"></uploadMaterial>
  </div>
</template>
<script>
import uploadMaterial from './uploadMaterial'
export default {
  name: '',
  data () {
    return {
      newSrc: null,
      materialOptions: {
        multiple: false,
        size: 10,
        type: 'img',
        show: false,
        reload: true
      }
    }
  },
  mounted () {
  },
  props: {
    defaultSrc: {
      type: String
    },
    index: {
      type: Number
    }
  },
  computed: {

  },
  components: {
    uploadMaterial
  },
  methods: {
    changeImg () {
      this.materialOptions.show = true
    },
    confirmInsert (file) {
      this.newSrc = {
        urlWhole: file.src,
        url: file.url,
        index: this.index || 0
      }
      let index = this.index ? this.index : 0
      this.$emit('imgChange', this.newSrc, index)
      this.newSrc = null
      this.materialOptions.show = false
    },
    cancelInsert (val) {
      this.materialOptions.show = false
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .img-box{
    position: relative;
    width: 330px;
    height: 122px;
    padding: 10px 15px;
    text-align: center;
    box-sizing: border-box;
    background: url(/static/img/mark.973c2ba.jpg);
    background-size: 8px 8px;
    border-radius: 4px;
    &:hover{
      .change-img{
        display: block;
        cursor: pointer;
      }
    }
    .preview-img{
      width: auto;
      max-width: 100%;
      height: 100%;
    }
    .change-img{
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      background: rgba(80, 109, 149, 0.6);
      width: 100%;
      height: 40px;
      line-height: 40px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: right;
      color: #fff;
      font-size: 13px;
      padding-right: 16px;
      box-sizing: border-box;
      .icon-font{
        font-size: 18px;
        margin-right: 8px;
      }
    }
  }
</style>
