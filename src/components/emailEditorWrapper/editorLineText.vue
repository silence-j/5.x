<template>
  <div class="edit-type">
    <editor 
      :content="layContent" 
      @change="updateText" 
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
    <div style="padding-left: 30px;">
      <div>
        <h3 class="title inline-title">背景&nbsp;&nbsp;&nbsp;</h3>
        <el-color-picker v-model="bgColor" @change="changeValue"></el-color-picker>
      </div>
      <h3 class="title inline-title">边框&nbsp;&nbsp;&nbsp;</h3>
      <el-select v-model="borderType" class="show-source" style="width:140px;">
        <el-option v-for="item in borderOptions"
         :key="item.value"
         :label="item.label"
         :value="item.value">
        </el-option>
      </el-select>
      <el-color-picker v-model="borderColor" @change="changeValue"></el-color-picker>
      <br>
      <h3 class="title inline-title">粗细&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="borderWidth" :format-tooltip="formatTip" @change="changeValue" :min="0" :max="10" class="slider-i"></el-slider>
    </div>
    <br>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
  
</template>
<script>
  // 富文本编辑器
  import VueHtml5Editor from 'longxi-vue-html5-editor'
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
    name: 'editorLineText',
    props: {
      editData: Object,
      editorSave: Function,
      editorChange: Function
    },
    components: {
      editor
    },
    data () {
      return {
        borderOptions: [
          {
            label: 'solid',
            value: 'solid'
          },
          {
            label: 'dotted',
            value: 'dotted'
          },
          {
            label: 'dashed',
            value: 'dashed'
          }
        ],
        layContent: '',
        bgColor: '',
        borderColor: '',
        borderWidth: 1,
        borderType: ''
      }
    },
    watch: {
      editData () {
        this.initData()
      },
      borderType () {
        this.changeValue()
      }
    },
    beforeMount () {
      this.initData()
    },
    methods: {
      formatTip (val) {
        let f = val + 'px'
        return f
      },
      updateText (val) {
        this.layContent = val
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
        let textBox = wrapper.querySelector('div')
        let content = textBox.innerHTML
        let border = textBox.style.border || '3px solid rgb(238, 238, 238)'
        let arr = border.split(' ')
        this.borderWidth = parseInt(arr[0])
        this.borderType = arr[1]
        this.borderColor = arr[2] + arr[3] + arr[4]
        this.bgColor = textBox.style.backgroundColor || 'rgb(250, 250, 250)'
        this.layContent = content
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          borderColor: this.borderColor,
          borderWidth: this.borderWidth,
          borderType: this.borderType,
          text: this.layContent,
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
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      margin-top: 16px;
    }
    .inline-tile{
      display: inline-block;
    }
    .el-color-picker{
      top: -5px;
    }
  } 
</style>
