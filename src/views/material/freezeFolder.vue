<!-- 因为默认文件夹不存在交互，checkedList不好操作，所以新建freezeFolder组件 -->
<template>
  <div class="folder-wrapper">
    <img @dblclick="enterFolder" src="/static/img/material/folder.png" alt="文件夹" class="pic">
    <div class="layout">
      <p class="folder-title" :title="options.name">{{options.name}}</p>
      <!-- 重命名模块 -->
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {}
  },
  props: {
    options: {
      type: Object
    }
  },
  methods: {
    enterFolder () {
      this.$emit('enterFolder', true)
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
    .pic{
      position: absolute;
      width: 66px;
      height: auto;
      bottom: 35px;
      left: 29px;
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
    }
    &:hover{
      background-color: #f5f8fa;
    }
  }
</style>
