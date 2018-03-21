<template>
  <div class="saveImgExtension-container">
    <el-dialog title="保存到素材库" v-model="moveDialogVisible" size="tiny" class="move-wrapper" @close="cancelSave">
      <div class="tree-wrapper">
        <tree :data="folderData"></tree>
      </div>
      <span slot="footer" class="move-footer">
        <el-button @click="createNewFolder" icon="plus" class="float-left create-btn"><span style="color: #33475b;">新建文件夹</span></el-button>
        <span class="float-right">
          <el-button type="primary" @click="saveImg">确 定</el-button>
          <el-button @click="cancelSave">取 消</el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import materialAPI from '@/api/materialAPI.js'
  import tree from '../folderTree'
  import { mapGetters } from 'vuex'
  export default{
    name: 'addImgExtension',
    data () {
      return {
        moveDialogVisible: false,
        // 文件夹目录结构
        folderData: [],
        imageData: []
      }
    },
    computed: {
      isMoveDialogVisible () {
        return this.$store.state.develop.isMoveDialogVisible
      },
      ...mapGetters(['sendData'])
    },
    mounted () {
      // 初始化文件夹展开目录
      this.getFolderData()
    },
    watch: {
      isMoveDialogVisible () {
        this.moveDialogVisible = this.isMoveDialogVisible
      },
      sendData () {
        this.imageData = this.sendData
      }
    },
    methods: {
      getFolderData () {
        materialAPI.getDirTree().then(res => {
          if (!res.data.code) {
            this.folderData = res.data.data
          }
        })
      },
      createNewFolder () {
        let tar = this.$store.state.material.createTarget
        tar.showCreateBox = true
        tar.btnState = false
        tar.showChildren = true
      },
      // 存储图片
      saveImg () {
        let targetId = this.$store.state.material.createTarget.$props.options
        ? this.$store.state.material.createTarget.$props.options.dirId
        : '0'
        let imageData = this.imageData
        let params = {
          id: imageData.id,
          url: this.b64DecodeUnicode(imageData.previewURL),
          dirId: targetId
        }
        materialAPI.saveImg(params).then(res => {
          if (res.data.code === 0) {
            this.$message.success('保存图片成功')
            this.cancelSave()
            this.getFolderData()
          }
        })
      },
      cancelSave () {
        this.$store.commit('DEVELOP_SAVEIMGEXTENSION', { isMoveDialogVisible: false, sendData: this.imgData })
      },
      b64DecodeUnicode (str) {
        str = str.split('=')[1]
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      }
    },
    components: {
      tree
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.saveImgExtension-container{
  .move-wrapper{
    .el-dialog{
      .el-dialog__header{
        padding: 13px 16px;
        border-bottom: 2px solid #dfe3eb;
      }
      .el-dialog__body{
        height: 260px;
        padding: 0;
        overflow-y: scroll;
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
      }
      .el-dialog__footer{
        border-top: 2px solid #dfe3eb;
        padding: 16px;
      }
    }
    .move-footer{
      display: inline-block;
      width: 100%;
      height: 34px;
      .float-left{
        float: left;
        color: #b0c1d4;
      }
      .float-right{
        float: right;
        .el-button{
          padding: 9px 24px;
        }
      }
    }
  }
}
</style>
