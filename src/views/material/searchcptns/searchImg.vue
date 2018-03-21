<template>
  <div>
    <div class="item_content">
        <div class="item_hover">
            <div class="item-btn_wrap">
            <el-button class="item-btn" @click="saveImg">保存</el-button>
            <el-button class="item-btn" @click="addPost">发帖</el-button>
            </div>
        </div>
        <img class="item-img" :src="imgData.previewURL" :height="imgData.webformatHeight * 216 / imgData.webformatWidth">
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    },
    props: [
      'recordLess',
      'imgData'
    ],
    components: {
    },
    computed: {},
    methods: {
      saveImg () {
        this.$store.commit('DEVELOP_SAVEIMGEXTENSION', { isMoveDialogVisible: true, sendData: this.imgData })
      },
      addPost () {
        this.$store.commit('DEVELOP_ADDIMGEXTENSION', { isAddImgExtension: true, sendDatas: this.imgData })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.item_content {
  position: relative;
  display: block;
  background: currentColor;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
      transition-duration: .2s;
  .item_hover {
    width: 100%;
    height: 100%;
    position: absolute;
    visibility: hidden;
    transition: all linear 0.1s;
    overflow: hidden;
    .item-btn_wrap {  
      width: 80px;
      height: 104px;
      top: 50%;
      left: 50%;
      margin-left: -40px;
      margin-top: -52px;
      transition: all linear 0.1s;
      opacity: 0;
      position: absolute;
      .item-btn {
        display: block;
        width: 80px;
        height: 32px;
        margin: 10px 0;
        padding: 0px;
        border: none;
        background: #5488F9;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
        border-radius: 4px;
        font: 13px/32px PingFangSC-Regular;
        text-align: center;
        color: #fff;
        &:hover {
        background-color: #407AFB;
        }
      }
    }
  }
  &:hover {
    box-shadow: 0 0 5px #333;
    cursor: pointer;
    .item_hover {
      visibility: visible;
      background: rgba(0, 0, 0, .2);
      .item-btn_wrap {
        opacity: 1;
      }
    }
  }
  .item-img{
    background-color: #F5F8FA;
    display: block;
    width: 100%;
  }
}
</style>
