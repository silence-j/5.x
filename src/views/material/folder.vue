<template>
  <div class="folder-wrapper" :class="isChecked ? 'checked' : ''">
    <el-checkbox class="check-item" v-model="isChecked"></el-checkbox>
    <img @dblclick="enterFolder" v-if="options.type!=='img'" :src="`/static/img/material/${options.type}.png`" alt="文件夹" class="pic 23">
    <div class="img-wrapper op" v-if="options.type==='img'" :style="{backgroundImage: 'url(' + options.src + '?x-oss-process=image/resize,h_65' + ')'}"></div>
    <div class="layout">
      <p class="folder-title" :title="options.name" v-show="!options.rename">{{options.name}}</p>
      <!-- 重命名模块 -->
      <div class="name-folder" v-show="options.rename">
        <input type="text" class="name-input" v-model="newName" @keyup.enter="reNameDone(newName, options.index)">
        <el-button icon="check" @click="reNameDone(newName, options.index)"></el-button>
        <el-button icon="close" @click="reNameDone(false, options.index)"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      isChecked: false,
      newName: ''
    }
  },
  props: {
    options: {
      type: Object,
      default: {
        type: 'folder',
        name: '官网装修',
        index: 0
      }
    }
  },
  mounted () {
    this.newName = this.options.name
  },
  watch: {
    isChecked (newVal, oldVal) {
      this.$emit('checkChange', newVal, this.options.index)
      this.newName = this.options.name
    }
  },
  computed: {

  },
  methods: {
    reNameDone (val, index) {
      val = val === this.options.name ? false : val
      this.$emit('reNameDone', val, index)
      this.newName = this.options.name
    },
    enterFolder () {
      if (this.options.type === 'folder') {
        this.$emit('enterFolder', true)
      }
      return
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .folder-wrapper{
    display: inline-block;
    position: relative;
    width: 122px;
    height: 113px;
    margin: 0 3px;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    vertical-align: top;
    border: 1px solid transparent;
    cursor: pointer;
    &.checked{
      border: 1px solid #5488f9;
      .check-item{
        display: inline-block;
      }
    }
    .check-item{
      position: absolute;
      top: 8px;
      right: 8px;
      display: none;
    }
    .pic{
      position: absolute;
      width: 66px;
      height: auto;
      bottom: 35px;
      left: 29px;
    }
    .img-wrapper{
      position: absolute;
      width: 66px;
      height: 66px;
      bottom: 35px;
      left: 29px;
      background-position: center;
      background-size: cover;
    }
    .layout{
      position: absolute;
      bottom: 2px;
      left: 29px;
      width: 100%;
      height: 28px;
      line-height: 28px;
      z-index: 999;
      .folder-title{
        font-size: 13px;
        color: #7c98b6;
        white-space: nowrap;
        overflow: hidden;
        max-width: 66px;
        text-overflow: ellipsis;
      }
      .name-folder{
        width: 166px;
        margin-left: -49px;
        .name-input{
          width: 90px;
          appearance: button;
          height: 22px;
          padding: 0 10px;
          line-height: 22px;
          border-radius: 4px;
          border: 1px solid #02aaaa;
          box-sizing: border-box;
        }
        .el-button{
          width: 22px;
          padding: 3px 2px;
          margin-left: 3px;
          font-size: 12px;
          color: #b0c1d4;
          &:hover{
            color: #5488f9;
          }
        }
      }
    }
    &:hover{
      background-color: #f5f8fa;
      .check-item{
        display: inline-block;
      }
    }
  }
</style>
