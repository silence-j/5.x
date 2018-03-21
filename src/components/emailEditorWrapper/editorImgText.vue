<template>
  <div class="edit-type">
    <div style="padding-left: 16px;">
      <imgUpload :defaultSrc="imgUrl" @imgChange="updateImg"></imgUpload>
      <p class="upload-tip">建议JPG，PNG图片格式，2M以内为最佳显示效果</p>
    </div>
    <editor 
      :content="text" 
      @change="updateText" 
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
    <div style="padding-left: 30px;" v-show="type === 'textImgBtn'">
      <h3 class="title inline-title">按钮文字&nbsp;&nbsp;&nbsp;</h3>
      <el-input 
        v-model="btnText" 
        @change="changeValue" 
        :maxlength="100"
        class="edit-inline-input"></el-input>
      <h3 class="title inline-title">链接地址&nbsp;&nbsp;&nbsp;</h3>
      <el-input 
        v-model="btnLink" 
        @change="changeValue" 
        :maxlength="300"
        class="edit-inline-input"></el-input>
      <h3 class="title inline-title">按钮宽度&nbsp;&nbsp;&nbsp;</h3>
      <el-slider 
        v-model="btnWidth" 
        @change="changeValue" 
        :min="15" :max="100" 
        class="slider-i"></el-slider>
      <h3 class="title inline-title">按钮高度&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="btnHeight" @change="changeValue" :min="20" :max="50" class="slider-i"></el-slider>
      <h3 class="title inline-title">按钮字体&nbsp;&nbsp;&nbsp;</h3>
      <el-slider 
        v-model="btnFontSize" 
        @change="changeValue" 
        :min="12" :max="36" 
        class="slider-i"></el-slider>
      <div>
        <h3 class="title inline-title">按钮背景&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="btnBgColor" @change="changeValue"></el-color-picker>
      </div>
      <div>
        <h3 class="title inline-title">文字颜色&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="btnTextColor" @change="changeValue"></el-color-picker>
      </div>
    </div>
    <br>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
  // 富文本编辑器
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
    name: 'editorImgText',
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
        type: '',
        btnText: '',
        btnLink: '',
        btnWidth: 25,
        btnHeight: 30,
        btnRadius: 4,
        btnBgColor: '',
        btnTextColor: '',
        btnFontSize: 12
      }
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
        this.type = this.editData.item.type
        let wrapper = target.parentElement.nextElementSibling
        if (this.type === 'textImgBg') {
          this.text = wrapper.querySelector('.content').innerHTML
          let url = wrapper.querySelector('.e-bg').style.backgroundImage
          this.imgUrl = url.replace('url(', '').replace(')', '').replace(/"/ig, '')
        } else if (this.type === 'textImgBtn') {
          let btn = wrapper.querySelector('a.btn')
          let style = btn.style
          this.btnText = btn.innerText || '按钮文本'
          this.btnLink = btn.href || 'https://'
          this.btnWidth = parseFloat(style.minWidth) || 25
          this.btnHeight = parseInt(style.paddingTop) ? parseInt(style.paddingTop) * 2 : 26
          this.btnRadius = parseInt(style.borderRadius) ? parseInt(style.borderRadius) : 4
          this.btnFontSize = parseInt(style.fontSize) ? parseInt(style.fontSize) : 12
          this.btnBgColor = style.backgroundColor
          this.btnTextColor = style.color
          this.text = wrapper.querySelector('.content').innerHTML
          let url = wrapper.querySelector('.e-bg').style.backgroundImage
          this.imgUrl = url.replace('url(', '').replace(')', '').replace(/"/ig, '')
        }
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
      updateImg (val) {
        this.imgUrl = val.urlWhole
        this.changeValue()
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        if (!this.btnLink.includes('http')) {
          this.btnLink = 'https://' + this.btnLink
        }
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          imgUrl: this.imgUrl,
          text: this.text,
          btnText: this.btnText,
          btnLink: this.btnLink,
          btnWidth: this.btnWidth,
          btnHeight: this.btnHeight,
          btnRadius: this.btnRadius,
          btnBgColor: this.btnBgColor,
          btnTextColor: this.btnTextColor,
          btnFontSize: this.btnFontSize
        })
        let changeData = {
          item: {
            bottomShow: false,
            content: content,
            topShow: false,
            type: this.type
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
    .title{
      font-size: 16px;
      height: 30px;
      line-height: 30px;
    }
    .edit-inline-input{
      width: 250px;
    }
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
