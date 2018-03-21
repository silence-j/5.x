<template>
  <div class="edit-type">
    <h3 class="title"><span class="icon-font fb" :class="{'fbactive':fbLink}">&#xe6e7;</span>Facebook</h3>
    <el-input 
      v-model="fbLink" 
      @change="changeValue" 
      :maxlength="300"
      icon="close" :on-icon-click="()=>{this.clearInput('fbLink')}"
      placeholder="请输入Facebook Url"></el-input>
    <h3 class="title"><span class="icon-font tw" :class="{'twactive':twLink}">&#xe6df;</span>Twitter</h3>
    <el-input 
      v-model="twLink" 
      @change="changeValue" 
      :maxlength="300"
      icon="close" :on-icon-click="()=>{this.clearInput('twLink')}"
      placeholder="请输入Twitter Url"></el-input>
    <h3 class="title"><span class="icon-font in" :class="{'inactive':inLink}">&#xe6e6;</span>Linkedin</h3>
    <el-input 
      v-model="inLink" 
      @change="changeValue" 
      :maxlength="300"
      icon="close" :on-icon-click="()=>{this.clearInput('inLink')}"
      placeholder="请输入Linkedin Url"></el-input>
    <h3 class="title"><span class="icon-font pin" :class="{'inactive':pinLink}">&#xe618;</span>Pinterest</h3>
    <el-input 
      v-model="pinLink" 
      @change="changeValue" 
      :maxlength="300"
      icon="close" :on-icon-click="()=>{this.clearInput('pinLink')}"
      placeholder="请输入Pinterest Url"></el-input>
    <h3 class="title"><span class="icon-font you" :class="{'inactive':youLink}">&#xe8d0;</span>YouTube</h3>
    <el-input 
      v-model="youLink" 
      @change="changeValue" 
      :maxlength="300"
      icon="close" :on-icon-click="()=>{this.clearInput('youLink')}"
      placeholder="请输入YouTube Url"></el-input>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  export default {
    name: 'editorSocial',
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
        fbLink: '',
        twLink: '',
        inLink: '',
        pinLink: '',
        youLink: ''
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
        let fb = wrapper.querySelector('div a.fb')
        let tw = wrapper.querySelector('div a.tw')
        let linkin = wrapper.querySelector('div a.linkin')
        let pin = wrapper.querySelector('div a.pin')
        let you = wrapper.querySelector('div a.you')
        this.fbLink = fb ? fb.href : ''
        this.twLink = tw ? tw.href : ''
        this.inLink = linkin ? linkin.href : ''
        this.pinLink = pin ? pin.href : ''
        this.youLink = you ? you.href : ''
      },
      clearInput (linktype) {
        this[linktype] = ''
        this.changeValue()
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
        let content = getTmplContent('social', {
          fbLink: this.fbLink,
          twLink: this.twLink,
          inLink: this.inLink,
          pinLink: this.pinLink,
          youLink: this.youLink
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
    padding-left: 16px;
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
    .upload-tip{
      padding: 0 15px;
    }
    .el-button{
      margin-left: 15px;
    }
  }
</style>
