<template>
  <div class="edit-type">
    <div style="padding-left: 16px;">
      <imgUpload :defaultSrc="imgUrl" @imgChange="updateImg"></imgUpload>
      <p class="upload-tip">建议图片宽度为690像素，高度为292像素，JPG，PNG图片格式，2M以内为最佳显示效果</p>
    </div>
    <div style="padding-left: 16px;">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'

  export default {
    name: 'editorImgCard',
    props: {
      editData: Object,
      editorSave: Function,
      editorChange: Function
    },
    components: {
      imgUpload
    },
    data () {
      return {
        imgUrl: ''
      }
    },
    computed: {
    },
    watch: {
      editData () {
        this.initData()
      }
    },
    beforeMount () {
      this.initData()
    },
    methods: {
      initData () {
        if (!this.editData.e) {
          return
        }
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        this.imgUrl = wrapper.querySelector('img').currentSrc
      },
      updateImg (val) {
        this.imgUrl = val.urlWhole
        this.changeValue()
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          imgUrl: this.imgUrl
        })
        let changeData = {
          item: {
            bottomShow: false,
            content: content,
            topShow: false,
            type: type
          },
          index: this.editData.index
        }
        this.editorChange(changeData, this.editData)
      }
    }
  }
</script>
<style lang="less" scoped>
  .edit-type{
    max-height: 630px;
    overflow-y: auto;
  }
  .edm-container{
    .editor-wrapper{
      .img-box{
        margin-top: 10px;
        margin-left: 15px;
      }
    }
  } 
</style>
