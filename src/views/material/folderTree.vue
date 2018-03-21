<template>
  <div class="tree-wrapper">
    <div ref="header" class="show-all-btn" @click="checkIndex">
      <Btn @stateChange="handleShowChildren" :state="btnState"></Btn>
      全部文件
    </div>
    <div class="all-folder" v-show="showChildren">
      <!-- 选择文件夹树形结构,使用组件递归自身 -->
      <treeItem v-for="(item, index) in localData" :key="item.name" :options="Object.assign({}, item, { index: index, level: 1 })"></treeItem>
      <!-- 新建文件夹时 -->
      <div class="new-folder" v-if="showCreateBox">
        <span style="display: inline-block; width: 26px;"></span>
        <img src="/static/img/material/folder.png" class="folder-icon" alt="">
        <div class="name-folder">
          <input type="text" v-model="newName" class="name-input">
          <el-button icon="check" @click="createDone(newName)"></el-button>
          <el-button icon="close" @click="createDone(false)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Btn from './addBtn'
import treeItem from './treeItem'
import materialAPI from '../../api/materialAPI.js'
import commonFunc from './commonFunc.js'
export default {
  name: '',
  data () {
    return {
      showChildren: true,
      showCreateBox: false,
      localData: [],
      btnState: false,
      newName: '新建文件夹',
      nameMap: []
    }
  },
  watch: {
    data (newVal, oldVal) {
      this.localData = newVal
    }
  },
  mounted () {
    this.localData = this.data
    this.$store.commit('CREATETARGET', this)
    commonFunc.updateNameMap(this.nameMap, this.localData, true)
  },
  props: {
    data: {
      type: Array,
      default: [{ name: '空文件' }]
    }
  },
  components: {
    Btn,
    treeItem
  },
  methods: {
    handleShowChildren (val) {
      this.showChildren = !val
    },
    checkIndex () {
      let list = document.getElementsByClassName('tree-item-header')
      for (let item of list) {
        item.className = 'tree-item-header'
      }
      this.$nextTick(() => {
        this.$refs.header.className += ' checked'
        this.$store.commit('CREATETARGET', this)
      })
    },
    createDone (val) {
      if (val) {
        let name = commonFunc.mapName(val, this.nameMap)
        materialAPI.createDir({ parentId: '0', name }).then(res => {
          if (!res.data.code) {
            this.localData.push({
              dirId: res.data.data,
              dirName: name,
              children: []
            })
            commonFunc.updateNameMap(this.nameMap, this.localData)
          }
        })
      }
      this.showCreateBox = false
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .tree-wrapper{
    .show-all-btn{
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 13px;
      color: #33475d;
      font-size: 13px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover{
        background-color: #f5f8fa;
      }
      &.checked{
        background-color: #f5f8fa;
      }
    }
    .all-folder{
      .new-folder{
        width: 100%;
        height: 33px;
        line-height: 33px;
        box-sizing: border-box;
        text-indent: 22px;
        .folder-icon{
          width: 18px;
          height: auto;
          vertical-align: middle;
          margin-right: 5px;
        }
        .name-folder{
          display: inline-block;
          height: 28px;
          line-height: 28px;
          font-size: 0;
          text-indent: 0 !important;
          .name-input{
            width: 100px;
            appearance: button;
            height: 28px;
            padding: 0 10px;
            line-height: 28px;
            font-size: 13px;
            border-radius: 4px;
            border: 1px solid #02aaaa;
            box-sizing: border-box;
          }
          .el-button{
            width: 28px;
            padding: 6px 4px;
            margin-left: 4px;
            font-size: 13px;
            color: #b0c1d4;
          }
        }
      }
    }
  }
</style>
