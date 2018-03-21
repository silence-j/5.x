<template>
  <div class="tree-item">
    <div ref="header" class="tree-item-header" :style="{ textIndent: localOptions.level*22 + 'px' }" @click="checkItem">
      <Btn v-if="localOptions.children&&localOptions.children.length>0" @stateChange="stateChange" :state="btnState"></Btn>
      <span v-else style="display: inline-block; width: 26px;"></span>
      <img src="/static/img/material/folder.png" class="folder-icon" alt="">
      <span class="folder-name" :title="localOptions.dirName">{{localOptions.dirName}}</span>
    </div>
    <div class="children-wrapper" v-show="showChildren">
      <treeItem v-for="(item, index) in localOptions.children" :key="item.name" :options="Object.assign({}, item, { index: index, level: localOptions.level+1 })"></treeItem>
      <!-- 新建文件夹显示 -->
      <div class="new-folder" v-if="showCreateBox" :style="{ textIndent: (localOptions.level+1)*22 + 'px' }">
        <span style="display: inline-block; width: 26px;"></span>
        <img src="/static/img/material/folder.png" class="folder-icon" alt="">
        <div class="name-folder">
          <input type="text" v-model="newName" class="name-input" @keyup.enter="createDone(newName)">
          <el-button icon="check" @click="createDone(newName)"></el-button>
          <el-button icon="close" @click="createDone(false)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Btn from './addBtn'
import materialAPI from '../../api/materialAPI.js'
import commonFunc from './commonFunc.js'
export default {
  name: 'treeItem',
  data () {
    return {
      showChildren: false,
      // 将props中的options转化为data
      localOptions: [],
      showCreateBox: false,
      newName: '新建文件夹',
      btnState: true,
      nameMap: []
    }
  },
  watch: {
    options (newVal, oldVal) {
      this.localOptions = newVal
    }
  },
  mounted () {
    // 因为新建文件夹时需要修改options数组，props不应当修改，所以转为datas
    this.localOptions = this.options
    commonFunc.updateNameMap(this.nameMap, this.localOptions.children, true)
  },
  computed: {

  },
  props: {
    options: {
      type: Object
    }
  },
  components: {
    Btn
  },
  methods: {
    stateChange (val) {
      this.showChildren = !val
    },
    checkItem () {
      let list = Array.from(document.getElementsByClassName('tree-item-header'))
      // 顶层的全部文件按钮
      let indexHeader = document.getElementsByClassName('show-all-btn')[0]
      for (let item of list) {
        item.className = 'tree-item-header'
      }
      this.$nextTick(() => {
        indexHeader.className = 'show-all-btn'
        this.$refs.header.className += ' checked'
        this.$store.commit('CREATETARGET', this)
      })
    },
    createDone (val) {
      if (val) {
        if (val.length > 140) {
          this.$message.error('新建文件夹名字不能超过140个字')
          return
        }
        let name = commonFunc.mapName(val, this.nameMap)
        materialAPI.createDir({ parentId: this.localOptions.dirId, name }).then(res => {
          if (!res.data.code) {
            this.localOptions.children.push({
              dirId: res.data.data,
              dirName: name,
              children: []
            })
            commonFunc.updateNameMap(this.nameMap, this.localOptions.children, true)
          }
        })
      }
      this.showCreateBox = false
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .tree-item{
    .tree-item-header{
      width: 100%;
      height: 33px;
      line-height: 33px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover{
        background-color: #f5f8fa;
      }
      &.checked{
        background-color: #f5f8fa;
      }
      .folder-icon{
        width: 18px;
        height: auto;
        vertical-align: middle;
        margin-right: 5px;
      }
      .folder-name{
        display: inline-block;
        text-indent: 0;
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 13px;
        color: #33475b;
        vertical-align: middle;
      }
    }
    .children-wrapper{
      .new-folder{
        width: 100%;
        height: 33px;
        line-height: 33px;
        box-sizing: border-box;
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
            &:hover{
              color: #5488f9;
            }
          }
        }
      }
    }
  }
</style>
