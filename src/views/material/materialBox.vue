<template>
	<div class="material-box">
		<div class="box-header">
    <!-- 返回上一级按钮 -->
      <span class="back-btn-wrapper" v-show="!isTop">
        <el-button :disabled="isUploading" @click="getFileList(parentId)" class="back-btn"><i class="icon-font">&#xe600;</i></el-button>
        <span class="back-name" :title="parentName">{{parentName}}</span>
      </span>
			<span class="material-btn-group">
          <span class="process-line">
            <span class="inner-line" :style="{ width: storageWidth + '%' }"></span>
          </span>
          <span class="process-number">{{storageText}} /<span style="color: #b7c7d8;"> {{totalSize / 1024 / 1024}}G</span></span>
				<el-button icon="plus" class="new-floder-btn" @click="isNodata=false;showNewFolder=true"><span class="new-folder-btn-text">新建文件夹</span></el-button>
        <!-- 上传按钮 -->
        <el-upload
        style="display: inline-block"
        name="picture"
        :multiple="true"
        :show-file-list="false"
        :with-credentials="true"
        :action="imgDomain + '/bshop/config/pic/upload'"
        :before-upload="beforeUpload"
        :on-progress="handleUploadProgress"
        :on-success="handleUploadSuccess"
        ref="upload">
          <el-button type="primary" icon="upload" class="upload-btn">上传文件</el-button>
        </el-upload>
			</span>
		</div>
		<!-- 下面是操作栏 -->
		<div class="operate-tab">
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="check-all-btn">全选</el-checkbox>
      <el-button-group v-show="showBtnGroup">
        <el-button class="btn-item" @click="moveDialogVisible=true">
          <i class="icon-font margin5">&#xe65d;</i>移动到
        </el-button>
        <el-button class="btn-item" @click="deleteFile" v-if="isCanDelete()">
          <i class="icon-font margin5">&#xe65a;</i>删除
        </el-button>
        <el-button class="btn-item" :disabled="!showDownBtn" @click="downLoadFile">
          <i class="icon-font margin5">&#xe65c;</i>下载
        </el-button>
        <el-button class="btn-item" :disabled="!showReName" @click="handleReName">
          <i class="icon-font margin5">&#xe65e;</i>重命名
        </el-button>
      </el-button-group>
      <span class="operte-tip">
        已选择<span style="color: #5488f9"> {{checkedList.length}} </span>个文件，共{{folderList.length + freezeFolderList.length}}个文件
      </span>
		</div>
    <!-- 没有数据时显示nodata图标 -->
    <div class="nodata" v-show="isNodata">
      <div class="nodata-layout">
        <img class="nodata-icon" src="../../assets/img/empty-contact.png" alt="">
        <p class="nodata-tip">暂无数据</p>
      </div>
    </div>
    <!-- container start-->
    <div class="folder-container" id="folder-container" v-show="!isNodata" v-loading="isLoading">
      <!-- 新建文件夹时显示 -->
      <newFolder @createDone="createDone" v-if="showNewFolder"></newFolder>
      <freezeFolder
      v-for="(item, index) in freezeFolderList"
      :key="item.id"
      :options="item"
      @enterFolder="getFileList(item.id)"></freezeFolder>
      <folder
      ref="folder"
      v-for="(item, index) in folderList"
      :key="item.name"
      :options="Object.assign({},item,{index})"
      @checkChange="checkChange"
      @reNameDone="reNameDone"
      @enterFolder="enterFolder(item.id)"></folder>
      <!-- 上传文件夹时显示 -->
      <upload v-for="(item, index) in uploadList" :key="item.name" :options="Object.assign({},item,{index})"></upload>
    </div>
    <!-- 删除弹窗 start -->
    <el-dialog v-model="dialogVisible" size="tiny" class="delete-wrapper">
      <div class="delete-tip">
        <div class="container">
          <span class="icon-font" style="color: #ff3b6e">&#xe629;</span>
          <span class="tip-content">若删除了店铺正在使用的文件，会造成店铺无法正常显示。<br><br>确定删除文件？</span>
        </div>
        <el-button class="delete-btn" type="danger" style="background-color: #ff3b6e" @click="confirmDeleteFile" v-if="isCanDelete()">删除</el-button>
        <el-button type = "text" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 移动文件夹弹窗 -->
    <el-dialog title="移动到" v-model="moveDialogVisible" size="tiny" class="move-wrapper">
      <div class="tree-wrapper">
        <tree :data="folderData"></tree>
      </div>
      <span slot="footer" class="move-footer">
        <el-button @click="createNewFolder" icon="plus" class="float-left create-btn"><span style="color: #33475b;">新建文件夹</span></el-button>
        <span class="float-right">
          <el-button type="primary" @click="moveFolder">确 定</el-button>
          <el-button @click="moveDialogVisible = false">取 消</el-button>
        </span>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import freezeFolder from './freezeFolder'
import folder from './folder'
import newFolder from './newFolder'
import tree from './folderTree'
import upload from '../../components/uploadFile.vue'
import commonFunc from './commonFunc.js'
import materialAPI from '../../api/materialAPI.js'
import Util from '@/common/Util'
export default {
  name: '',
  data () {
    return {
      storage: '0',
      totalSize: '5242880',
      checkAll: false,
      isIndeterminate: false,
      showBtnGroup: false,
      showDownBtn: false,
      showReName: false,
      folderList: [],
      // 默认文件夹列表
      freezeFolderList: [],
      checkedList: [],
      showNewFolder: false,
      // 防止创建同名文件夹，给每个文件名创建map
      nameMap: {},
      dialogVisible: false,
      isLoading: false,
      moveDialogVisible: false,
      // 上传列表
      uploadList: [],
      // 文件夹目录结构
      folderData: [],
      pathId: '',
      parentId: '',
      parentName: '',
      isTop: true,
      isNodata: false,
      // 是否正在上传文件，如在上传，禁用返回按钮
      isUploading: false,
      // 避免后台出错，先请求获取文件列表借口，成功之后再找文件夹借口
      isGetFoldeListReady: false,
      imgDomain: process.env.IMG_DOMAIN
    }
  },
  mounted () {
    // 初始化剩余空间
    this.getStorage()
    // 初始化文件夹信息
    this.getFileList('0')
  },
  computed: {
    storageWidth () {
      let size = this.storage
      let total = this.totalSize
      return 100 * (size / total)
    },
    storageText () {
      let storage = this.storage
      let num
      if (storage >= 1024 * 1024) {
        num = (storage / (1024 * 1024)).toFixed(2)
        return `${num}G`
      } else if (storage >= 1024) {
        num = (storage / 1024).toFixed(2)
        return `${num}M`
      } else {
        return `${storage}Kb`
      }
    }
  },
  components: {
    freezeFolder,
    folder,
    newFolder,
    tree,
    upload
  },
  watch: {
    checkedList (newVal, oldVal) {
      switch (newVal.length) {
        case 0:
          this.checkAll = false
          this.isIndeterminate = false
          this.showBtnGroup = false
          break
        case 1 :
          // 选中一个文件，但是该文件类型是folder的时候，也不显示下载按钮
          let isFolder = this.folderList[newVal[0]].type === 'folder'
          this.checkAll = false
          this.isIndeterminate = true
          this.showDownBtn = !isFolder
          this.showReName = true
          break
        case this.folderList.length:
          this.checkAll = true
          this.isIndeterminate = false
          this.showReName = false
          this.showDownBtn = false
          break
        default:
          this.checkAll = false
          this.isIndeterminate = true
          this.showReName = false
          this.showDownBtn = false
          break
      }
    },
    // 先选中一个，打开rename，再打开另一个的时候应该关掉rename框
    showReName (newVal, oldVal) {
      if (!newVal) {
        for (let item of this.folderList) {
          item.rename = false
        }
      }
    },
    parentId (newVal, oldVal) {
      if (newVal === null) {
        this.isTop = true
        return
      }
      this.isTop = false
    },
    isLoading (newVal, oldVal) {
      if (this.folderList.length === 0 && this.freezeFolderList.length === 0 && !newVal) {
        this.isNodata = true
        return
      }
      this.isNodata = false
    },
    isGetFoldeListReady (newVal, oldVal) {
      if (newVal) {
        this.getFolderData()
      }
    },
    folderList (newVal, oldVal) {
      if (newVal.length === 0 && this.freezeFolderList.length === 0 && !this.isLoading) {
        this.isNodata = true
        return
      }
      this.isNodata = false
    }
  },
  methods: {
    // 判断是否有删除素材权限
    isCanDelete () {
      return Util.hasRightByCode('FCA')
    },
    getFolderData () {
      materialAPI.getDirTree().then(res => {
        if (!res.data.code) {
          this.folderData = res.data.data
        }
      })
    },
    getFileList (num) {
      this.isLoading = true
      this.folderList = []
      this.freezeFolderList = []
      materialAPI.getFileList({ dirId: num }).then(res => {
        if (!res.data.code) {
          let folder = res.data.data.folders
          let file = res.data.data.files
          for (let item of folder) {
            if (item.type) {
              this.freezeFolderList.push({
                id: item.id,
                name: item.name
              })
            } else {
              this.folderList.push({
                id: item.id,
                type: 'folder',
                name: item.name,
                rename: false
              })
            }
          }
          for (let item of file) {
            this.folderList.push({
              id: item.id,
              type: commonFunc.fileType(item.fileType, item.fileName),
              name: item.fileName,
              src: item.fullUrl,
              rename: false
            })
          }
          this.checkedList = []
        }
        this.pathId = num
        this.isLoading = false
        this.isGetFoldeListReady = true
        // 防止正在上传时返回显示出错
        this.showNewFolder = false
        // 防止重名，生成nameMap
        commonFunc.updateNameMap(this.nameMap, this.folderList)
        this.parentName = res.data.data.parentName
        this.parentId = res.data.data.parentId
      })
    },
    getStorage () {
      materialAPI.getStorage().then(res => {
        if (!res.data.code) {
          this.storage = res.data.data.size
          this.totalSize = res.data.data.total
        }
      })
    },
    handleCheckAllChange () {
      for (let item of this.$refs.folder) {
        item.isChecked = this.checkAll
      }
      this.isIndeterminate = false
    },
    checkChange (val, index) {
      if (val) {
        this.checkedList.push(index)
        this.showBtnGroup = true
      } else {
        let i = this.checkedList.indexOf(index)
        this.checkedList.splice(i, 1)
        // 取消选中的时候关掉重命名框
        this.folderList[index].rename = false
      }
    },
    createDone (val) {
      if (val) {
        if (val.length > 140) {
          this.$message.error('新建文件夹名字不能超过140个字')
          return
        }
        this.isLoading = true
        let name = commonFunc.mapName(val, this.nameMap)
        materialAPI.createDir({ parentId: this.pathId, name }).then(res => {
          this.isLoading = false
          if (!res.data.code) {
            this.folderList.push({
              id: res.data.data,
              type: 'folder',
              name: name,
              rename: false
            })
            commonFunc.updateNameMap(this.nameMap, this.folderList)
            // 新建文件夹之后重新获取文件夹树形结构
            this.getFolderData()
          }
        })
      }
      this.showNewFolder = false
    },
    handleReName () {
      let index = this.checkedList[0]
      this.folderList[index].rename = true
    },
    reNameDone (val, index) {
      if (val) {
        if (val.length > 140) {
          this.$message.error('文件夹名字不能超过140个字')
          return
        }
        materialAPI.renameFile({ id: this.folderList[index].id, name: val }).then(res => {
          if (!res.data.code) {
            this.folderList[index].name = val
            this.$message.success('重命名成功')
            this.checkedList = []
          }
        })
      }
      this.folderList[index].rename = false
    },
    deleteFile () {
      this.dialogVisible = true
    },
    confirmDeleteFile () {
      let idString = ''
      // 用list做folderList的副本
      let list = Array.from(this.folderList)
      for (let item of this.checkedList) {
        idString += `${list[item].id},`
        list[item] = undefined
      }
      materialAPI.deleteFile({ ids: idString }).then(res => {
        if (!res.data.code) {
          // 删除之后重新获取进度条
          this.getStorage()
          // 删除文件之后重新去获取文件夹树形结构
          this.getFolderData()
          for (let i = 0; i < list.length; i++) {
            if (list[i] === undefined) {
              list.splice(i, 1)
              list.length - 1
              i--
            }
          }
          // 删除的同时取消该index的选中,清空选中list
          this.checkedList = []
          this.folderList = Array.from(list)
          this.dialogVisible = false
          this.$message.success('删除文件成功')
        }
      })
    },
    handleUploadProgress (event, file, fileList) {
      this.isUploading = true
      this.isNodata = false
      this.uploadList = fileList
    },
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt10M
    },
    handleUploadSuccess (res, file, fileList) {
      let flag = true
      if (res.code === 1) {
        this.$message.warning(res.message)
        return
      }
      for (let item of fileList) {
        if (item.status !== 'success') {
          flag = false
        }
      }
      if (flag) {
        let params = []
        // 全部上传成功后，重新获取剩余空间
        this.getStorage()
        this.isUploading = false
        for (let fileItem of fileList) {
          params.push({
            dirId: this.pathId,
            fileName: fileItem.name,
            fileSize: fileItem.raw.size,
            sourceType: 1,
            url: fileItem.response.data.url,
            fullUrl: fileItem.response.data.urlWhole,
            contentType: fileItem.raw.type
          })
        }
        materialAPI.uploadImg({files: JSON.stringify(params)}).then(result => {
          if (!result.data.code) {
            this.isNodata = false
            for (let resItem of JSON.parse(result.data.data)) {
              this.folderList.push({
                id: resItem.id,
                name: resItem.fileName,
                type: commonFunc.fileType(resItem.fileType, resItem.fileName),
                src: resItem.fullUrl,
                rename: false
              })
            }
          }
        })
        this.uploadList = []
        this.$refs.upload.clearFiles()
      }
    },
    createNewFolder () {
      let tar = this.$store.state.material.createTarget
      tar.showCreateBox = true
      tar.btnState = false
      tar.showChildren = true
    },
    moveFolder () {
      let targetId = this.$store.state.material.createTarget.$props.options
      ? this.$store.state.material.createTarget.$props.options.dirId
      : '0'
      let idString = ''
      for (let item of this.checkedList) {
        idString += `${this.folderList[item].id},`
      }
      materialAPI.moveDir({ sourceIds: idString, targetId }).then(res => {
        if (!res.data.code) {
          let list = Array.from(this.folderList)
          for (let item of this.checkedList) {
            list[item] = undefined
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i] === undefined) {
              list.splice(i, 1)
              list.length - 1
              i--
            }
          }
          this.checkedList = []
          this.folderList = Array.from(list)
          this.$message.success('移动文件成功')
          this.moveDialogVisible = false
          // 移动文件之后重新获取新的文件夹树形结构
          this.getFolderData()
        }
      })
    },
    downLoadFile () {
      let index = this.checkedList[0]
      // 走接口下载文件，5.0上线取消。
      // let fileId = this.folderList[index].id
      // window.location.href = `${process.env.DOMAIN}/bshop/fodder/download?fileId=${fileId}`
      window.open(this.folderList[index].src)
    },
    enterFolder (id) {
      if (this.isUploading) {
        this.$message.error('请等待当前页面文件上传完成')
        return
      }
      this.getFileList(id)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
	.material-box{
		width: 1200px;
    margin-top: 16px;
		border-radius: 4px;
		background-color: #fff;
    position: relative;
    min-height: calc(~'100vh - 187px');
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.08);
    margin-bottom: 16px;
		.box-header{
			width: 100%;
			height: 60px;
      .back-btn-wrapper{
        display: inline-block;
        padding-left: 16px;
        .back-btn{
          padding: 7px;
          font-weight: 600;
          i{
            color: #b0c1d4;
            font-size: 18px;
          }
          &:hover{
            i{
              color: #5488f9!important;
            }
          }
        }
        .back-name{
          display: inline-block;
          vertical-align: middle;
          font-size: 13px;
          color: #33475b;
          line-height: 60px;
          margin-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          max-width: 200px;
          text-overflow: ellipsis;
        }
      }
      &:after{
        content:"";
        display:block;
        height:0;
        clear:both;
      }
			.process-line{
				position: relative;
				display: inline-block;
				width: 240px;
				height: 10px;
				margin-left: 16px;
				margin-top: 25px;
				background-color: #eaf0f6;
				border-radius: 8px;
				.inner-line{
					height: 10px;
					position: absolute;
					top: 0;
					left: 0;
					background-color: #5488f9;
					border-radius: 8px;
				}
			}
			.process-number{
				font-size: 14px;
				line-height: 60px;
				color: #4f6d95;
				margin-left: 10px;
        margin-right: 40px;
			}
			.material-btn-group{
				float: right;
				font-size: 13px;
				margin-right: 16px;
				.new-floder-btn, .upload-btn{
					color: #b0c1d4;
					padding: 9px 15px;
          .new-folder-btn-text{
            color: #33475b;
          }
				}
        .new-floder-btn{
          margin-right: 5px;
          &:hover{
            i, .new-folder-btn-text{
              color: #5488f9;
            }
          }
        }
				.upload-btn{
					color: #fff;
				}
			}
		}
    // header end
    .operate-tab{
      width: 100%;
      height: 48px;
      line-height: 48px;
      padding: 0 19px;
      box-sizing: border-box;
      border-top: 1px solid #dfe3eb;
      border-bottom: 1px solid #dfe3eb;
      background-color: #f5f8fa;
      color: #7c98b6;
      .check-all-btn{
        vertical-align: top;
        /*margin-top: 13px;*/
        color: #7c98b6;
      }
      .el-button-group{
        vertical-align: top;
        margin-top: 10px;
        margin-left: 20px;
        .btn-item{
          padding: 6px 16px;
          color: #7c98b6;
          .margin5{
            margin-right: 5px;
          }
          &:hover{
            color: #5488f9;
          }
        }
      }
      .operte-tip{
        line-height: 44px;
        float: right;
      }
    }
    .nodata{
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 120px;
      width: 180px;
      box-sizing: border-box;
      background-color: #fff;
      .nodata-layout{
        text-align: center;
        .nodata-icon{
          width: 100px;
          height: auto;
        }
        .nodata-tip{
          padding-top: 15px;
          font-size: 14px;
          line-height: 21px;
          color: #4F6D95;          
        }
      }
    }
    .folder-container{
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
      font-size: 0;
      overflow-x: hidden;
      height: calc(~'100vh - 295px');
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
    }
    .delete-wrapper{
      .el-dialog{
        width: 416px;
        border-radius: 4px;
        .el-dialog__header{
          .el-dialog__headerbtn{
            display: none;
          }
        }
        .el-dialog__body{
          padding: 20px 20px 40px;
          .delete-tip{
            padding: 0 20px;
            .container{
              width: 340px;
              font-size: 14px;
              color: #33475b;
              font-weight: 600;
              text-align: left;
              margin-bottom: 22px;
              .icon-font{
                display: inline-block;
                vertical-align: top;
                font-size: 24px;
                margin-right: 10px;
                color: #ff4949;
              }
              .tip-content{
                width: 300px;
                line-height: 21px;
                display: inline-block;
                vertical-align: top;
              }
            }
            .el-button{
              padding: 8px 25px;
            }
            .delete-btn{
              margin-left: 34px;
            }
          }
        }
      }
    }
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
