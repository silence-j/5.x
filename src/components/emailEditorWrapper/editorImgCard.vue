<template>
  <div class="edit-type">
    <div style="padding-left: 16px;">
      <div style="margin-bottom: 20px;text-align: center;">
        <el-button-group>
          <el-button 
          @click="changeCardType('imgCard1')"
          style="margin-left: 0;"
          :type="cardtype === 'imgCard1' ? 'primary' : ''">样式一</el-button>
          <el-button 
          @click="changeCardType('imgCard2')"
          :type="cardtype === 'imgCard2' ? 'primary' : ''"
          style="margin-left: 0;">样式二</el-button>
          <el-button 
          @click="changeCardType('imgCard3')"
          :type="cardtype === 'imgCard3' ? 'primary' : ''"
          style="margin-left: 0;">样式三</el-button>
        </el-button-group>
      </div>
      <imgUpload :defaultSrc="imgUrl" @imgChange="updateImg"></imgUpload>
      <p class="upload-tip">建议图片宽度为690像素，高度为292像素，JPG，PNG图片格式，2M以内为最佳显示效果</p>
    </div>
    <br>
    <editor 
      :content="text" 
      @change="updateText" 
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
    <div style="padding-left: 16px;">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
  import VueHtml5Editor from 'longxi-vue-html5-editor'
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  const editor = new VueHtml5Editor({
    name: 'vue-html5-editor',
    language: 'zh-cn',
    showModuleName: true,
    visibleModules: [
      'text',
      'color',
      'font',
      'align',
      'list',
      'link',
      'unlink',
      'tabulation',
      'hr',
      'eraser',
      'undo',
      'keyword'
    ],
    icons: {
      text: 'icon-edit',
      color: 'icon-Shape1',
      font: 'icon-wenzi',
      align: 'icon-alignleft',
      list: 'icon-list',
      link: 'icon-link',
      unlink: 'icon-unlink',
      tabulation: 'icon-table',
      hr: 'icon-hr',
      eraser: 'icon-delete',
      undo: 'icon-iconfresh',
      keyword: 'icon-tequan'
    }
  })
  export default {
    name: 'editorImgCard',
    props: {
      editData: Object,
      editorSave: Function,
      editorChange: Function
    },
    components: {
      imgUpload,
      editor
    },
    data () {
      return {
        imgUrl: '',
        text: '',
        cardtype: ''
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
      changeCardType (type) {
        this.cardtype = type
        this.changeValue()
      },
      updateText (val) {
        this.text = val
        this.changeValue()
      },
      tipErr (val) {
        this.$message.error(val)
      },
      tipSuc (val) {
        this.$message.success(val)
      },
      initData () {
        if (!this.editData.e) {
          return
        }
        this.cardtype = this.editData.item.type
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        this.imgUrl = wrapper.querySelector('.layout div img').currentSrc
        this.text = wrapper.querySelector('.layout div .content').innerHTML
      },
      updateImg (val) {
        this.imgUrl = val.urlWhole
        this.changeValue()
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        // let type = this.editData.item.type
        let type = this.cardtype
        let content = getTmplContent(type, {
          imgUrl: this.imgUrl,
          text: this.text
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
