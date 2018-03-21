<template>
  <div class="edit-type">
    <div style="padding-left: 30px;">
      <h3 class="title inline-title">上边距&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="marginTop" @change="changeValue" :min="0" :max="50" class="slider-i"></el-slider>
      <h3 class="title inline-title">下边距&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="marginBottom" @change="changeValue" :min="0" :max="50" class="slider-i"></el-slider>
      <h3 class="title inline-title">&nbsp;&nbsp;&nbsp;线条&nbsp;&nbsp;&nbsp;</h3>
      <el-select v-model="borderType" class="show-source">
        <el-option v-for="item in borderOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      <el-color-picker v-model="borderColor" @change="changeValue"></el-color-picker>
      <h3 class="title inline-title">&nbsp;&nbsp;&nbsp;线粗&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="borderWidth" @change="changeValue" :min="1" :max="10" class="slider-i"></el-slider>
      <h3 class="title inline-title">&nbsp;&nbsp;&nbsp;线宽&nbsp;&nbsp;&nbsp;</h3>
      <el-slider v-model="width" @change="changeValue" :min="5" :max="100" class="slider-i"></el-slider>
    </div>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  export default {
    name: 'editorImgText',
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
        borderColor: '',
        borderWidth: 1,
        borderType: '',
        width: 100,
        marginTop: 10,
        marginBottom: 10,
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
        ]
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
      dragleave (e) {
        // console.log(e)
      },
      initData () {
        if (!this.editData.e) {
          return
        }
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        let line = wrapper.querySelector('div')
        let borderTop = line.style.borderTop
        let arr = borderTop.split(' ')
        this.borderWidth = parseInt(arr[0]) || 3
        this.borderType = arr[1] || 'solid'
        this.borderColor = arr[2] + arr[3] + arr[4]
        this.width = parseInt(line.style.width) || 100
        this.marginTop = parseInt(line.style.marginTop) || 8
        this.marginBottom = parseInt(line.style.marginBottom) || 8
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
          marginTop: this.marginTop,
          marginBottom: this.marginBottom,
          width: this.width
        })
        let changeData = {
          item: {
            bottomShow: false,
            content: content,
            topShow: false,
            type: 'line'
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
    .slider-i{
      margin-right: 20px;
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
