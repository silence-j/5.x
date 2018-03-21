<template>
  <div class="edit-type">
    <editor 
      :content="text" 
      @change="updateText" 
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
    <div style="padding-left: 30px;">
      <h3 class="title"><span class="icon-font fb" :class="{'fbactive':fbLink}">&#xe6e7;</span>Facebook</h3>
      <el-input 
        v-model="fbLink" icon="close" :on-icon-click="()=>{this.clearInput('fbLink')}" 
        @change="changeValue" :maxlength="300"
        placeholder="请输入Facebook Url"></el-input>
      <h3 class="title"><span class="icon-font tw" :class="{'twactive':twLink}">&#xe6df;</span>Twitter</h3>
      <el-input 
      v-model="twLink" icon="close" :on-icon-click="()=>{this.clearInput('twLink')}" 
      @change="changeValue" :maxlength="300"
      placeholder="请输入Twitter Url"></el-input>
      <h3 class="title"><span class="icon-font in" :class="{'inactive':inLink}">&#xe6e6;</span>Linkedin</h3>
      <el-input 
      v-model="inLink" icon="close" :on-icon-click="()=>{this.clearInput('inLink')}" 
      @change="changeValue" :maxlength="300"
      placeholder="请输入Linkedin Url"></el-input>
      <h3 class="title"><span class="icon-font pin" :class="{'inactive':pinLink}">&#xe618;</span>Pinterest</h3>
      <el-input 
      v-model="pinLink" icon="close" :on-icon-click="()=>{this.clearInput('pinLink')}" 
      @change="changeValue" :maxlength="300"
      placeholder="请输入Pinterest Url"></el-input>
      <h3 class="title"><span class="icon-font you" :class="{'inactive':youLink}">&#xe8d0;</span>YouTube</h3>
      <el-input 
      v-model="youLink" icon="close" :on-icon-click="()=>{this.clearInput('youLink')}" 
      @change="changeValue" :maxlength="300"
      placeholder="请输入YouTube Url"></el-input>
      <div>
        <h3 class="title inline-title">背景颜色&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="bgColor" @change="changeValue"></el-color-picker>
      </div>
    </div>
    <el-button type="primary" @click="save">保存</el-button>
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
    name: 'editorFooter',
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
        text: '',
        fbLink: '',
        twLink: '',
        inLink: '',
        pinLink: '',
        youLink: '',
        bgColor: ''
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
      updateText (val) {
        this.text = val
        this.changeValue()
      },
      clearInput (linktype) {
        this[linktype] = ''
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
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        let footer = wrapper.querySelector('.footertext .fo')
        this.bgColor = footer.style.backgroundColor || '#F0F2F3'
        let content = wrapper.querySelector('.footertext div .content')
        this.text = content.innerHTML
        let fb = wrapper.querySelector('.footertext div a.fb')
        let tw = wrapper.querySelector('.footertext div a.tw')
        let linkin = wrapper.querySelector('.footertext div a.linkin')
        let pin = wrapper.querySelector('.footertext div a.pin')
        let you = wrapper.querySelector('.footertext div a.you')
        this.fbLink = fb ? fb.href : ''
        this.twLink = tw ? tw.href : ''
        this.inLink = linkin ? linkin.href : ''
        this.pinLink = pin ? pin.href : ''
        this.youLink = you ? you.href : ''
      },
      save () {
        this.editorSave()
      },
      fullLink () {
        if (this.fbLink && !this.fbLink.includes('https://www.facebook.com')) {
          this.fbLink = 'https://www.facebook.com/'
        }
        if (this.twLink && !this.twLink.includes('https://www.twitter.com')) {
          this.twLink = 'https://www.twitter.com/'
        }
        if (this.inLink && !this.inLink.includes('https://www.linkedin.com')) {
          this.inLink = 'https://www.linkedin.com/'
        }
        if (this.pinLink && !this.pinLink.includes('https://www.pinterest.com')) {
          this.pinLink = 'https://www.pinterest.com/'
        }
        if (this.youLink && !this.youLink.includes('https://www.youtube.com')) {
          this.youLink = 'https://www.youtube.com/'
        }
      },
      changeValue () {
        this.fullLink()
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          text: this.text,
          fbLink: this.fbLink,
          twLink: this.twLink,
          inLink: this.inLink,
          pinLink: this.pinLink,
          youLink: this.youLink,
          bgColor: this.bgColor
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
      .icon-font{
        font-size: 22px;
        margin-right: 5px;
        margin-left: 5px;
        color: #333;
      }
      .fb{
        color: #3B5798;
      }
      .tw{
        color: #00ACEE;
      }
      .in{
        color: #0071A1;
      }
      .pin{
        color: #B9252C;
      }
      .you{
        color: #E2222D;
      }
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
