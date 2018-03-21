<template>
  <div class="edit-type">
    <div style="padding-left: 30px;">
      <div v-show="!inputDisable">
        <h3 class="title inline-title">按钮文字&nbsp;&nbsp;&nbsp;</h3>
        <el-input 
          v-model="text" 
          @change="changeValue" 
          :maxlength="30"
          class="edit-inline-input"></el-input>
      </div>
      <div v-show="!inputDisable">
        <h3 class="title inline-title">链接地址&nbsp;&nbsp;&nbsp;</h3>
        <el-input 
          v-model="link" 
          @change="changeValue" 
          :maxlength="300"
          :disabled="inputDisable"
          class="edit-inline-input"></el-input>
      </div>
      <div v-show="inputDisable">
        <h3 class="title inline-title"><span class="icon-font fb">&#xe6d9;</span>&nbsp;Facebook Message</h3>
        <el-input 
          v-model="link" 
          @change="changeValue" 
          :maxlength="30"
          :disabled="inputDisable"
          class="edit-inline-input"></el-input>
      </div>
      <h3 class="title inline-title">按钮宽度&nbsp;&nbsp;&nbsp;</h3>
      <el-slider 
        v-model="width" 
        @change="changeValue" 
        :min="15" :max="100" 
        class="slider-i"></el-slider>
      <h3 class="title inline-title">按钮高度&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="height" @change="changeValue" :min="20" :max="50" class="slider-i"></el-slider>
      <h3 class="title inline-title">按钮圆角&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="radius" @change="changeValue" :min="0" :max="50" class="slider-i"></el-slider>
      <h3 class="title inline-title">按钮字体&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="fontSize" @change="changeValue" :min="12" :max="36" class="slider-i"></el-slider>
      <div v-show="!inputDisable">
        <h3 class="title inline-title">按钮背景&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="bgColor" @change="changeValue"></el-color-picker>
      </div>
      <div v-show="!inputDisable">
        <h3 class="title inline-title">文字颜色&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="textColor" @change="changeValue"></el-color-picker>
      </div>
    </div>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  export default {
    name: 'editorButton',
    props: {
      editData: Object,
      editorSave: Function,
      editorChange: Function,
      homePageId: String
    },
    components: {
      imgUpload
    },
    data () {
      return {
        text: '',
        link: '',
        width: 25,
        height: 30,
        radius: 4,
        bgColor: '',
        textColor: '',
        fontSize: 12,
        inputDisable: false
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
        let a
        if (this.editData.item.type === 'message') {
          a = wrapper.querySelector('.message div a')
          this.inputDisable = true
        } else {
          // a = $(target).parents('.layout-wrapper').find('.btn div a')[0]
          a = wrapper.querySelector('.btn div a')
          this.inputDisable = false
        }
        this.text = a.innerText || '按钮文本'
        this.link = a.href || 'https://'
        let style = a.style
        this.width = parseFloat(style.minWidth) || 25
        this.height = parseInt(style.paddingTop) ? parseInt(style.paddingTop) * 2 : 26
        this.bgColor = style.backgroundColor
        this.textColor = style.color
        this.radius = parseInt(style.borderRadius) ? parseInt(style.borderRadius) : 4
        this.fontSize = parseInt(style.fontSize) ? parseInt(style.fontSize) : 12
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        if (!this.link.includes('http')) {
          this.link = 'https://' + this.link
        }
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          text: this.text,
          link: this.link,
          width: this.width,
          height: this.height,
          radius: this.radius,
          bgColor: this.bgColor,
          textColor: this.textColor,
          homePageId: this.homePageId,
          fontSize: this.fontSize
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
    .title{
      font-size: 16px;
      height: 30px;
      line-height: 30px;
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
<style lang="less">
  .edit-type{
    .img-box{
      margin-top: 5px;
      margin-left: 15px;
    }
    .upload-tip{
      padding: 0 15px;
    }
    .el-button{
      margin-left: 15px;
    }
  }
</style>
