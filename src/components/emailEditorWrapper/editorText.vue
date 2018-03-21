<template>
  <div class="edit-type">
    <editor 
      :content="layContent" 
      @change="updateText" 
      @errmessage="tipErr" 
      @sucmessage="tipSuc"></editor>
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
    name: 'editorText',
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
        layContent: ''
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
        this.layContent = wrapper.innerHTML
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          text: this.layContent
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
