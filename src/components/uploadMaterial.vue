<template>
  <div>
    <el-dialog v-model="options.show" class="upload-matertal-wrapper" @open="reloadPage">
      <span slot="title">
        <h1 class="wrapper-name" v-show="isTop">素材库</h1>
        <div  v-show="!isTop" class="back-btn-wrapper">
          <el-button @click="getFileList(parentId)" class="back-btn"><i class="icon-font">&#xe600;</i></el-button>
          <span class="back-name" :title="parentName">{{parentName}}</span>
        </div>
      </span>
      <!-- 无数据时显示 -->
      <div class="nodata" v-show="isNodata">
        <div class="nodata-layout">
          <img class="nodata-icon" src="../assets/img/nodata2.png" alt="">
          <p class="nodata-tip">暂无数据</p>
        </div>
      </div>
      <div class="container" v-show="!isNodata" v-loading="isLoading">
        <div 
        class="folder-box" 
        :class="item.isChecked ? 'checked' : ''" 
        v-for="(item, index) in folderList"
        :key="item.id" 
        @click="checkItem(index)">
          <div class="layout">
            <img  @dblclick="enterFolder($event, item)" v-if="item.type!=='img'" :src="`/static/img/material/${item.type}.png`" class="pic" alt="">
            <div class="img-wrapper" v-if="item.type==='img'" :style="{backgroundImage: 'url(' + item.src + '?x-oss-process=image/resize,h_60)'}"></div>
            <p class="file-name" :title="item.name">{{item.name}}</p>
          </div>
        </div>
        <!-- 上传文件的时候显示 -->
        <upload v-for="(item, index) in uploadList" :key="item.name" :options="Object.assign({},item,{index})"></upload>
      </div>
      <span slot="footer" class="footer">
        <span class="float-left">
          <el-upload
          style="display: inline-block"
          :multiple="true"
          :show-file-list="false"
          :with-credentials="true"
          name="picture"
          :action="imgDomain + '/bshop/config/pic/upload'"
          :before-upload="beforeUpload"
          :on-progress="handleUploadProgress"
          :on-success="handleUploadSuccess"
          ref="upload">
            <el-button icon="upload" type="primary">上传文件</el-button>
          </el-upload>
          <el-button style="margin-left: 8px;" @click="deleteVisible = true">删除</el-button>
        </span>
        <span class="float-right">
          <el-button type="primary" @click="confirmInsert">确 定</el-button>
          <el-button @click="cancelInsert">取 消</el-button>
        </span>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog v-model="deleteVisible" size="tiny" class="delete-wrapper">
      <div class="delete-tip">
        <div class="container">
          <span class="icon-font" style="color: #ff3b6e">&#xe629;</span>
          <span class="tip-content">若删除了店铺正在使用的文件，会造成店铺无法正常显示。<br><br>确定删除文件？</span>
        </div>
        <el-button class="delete-btn" type="danger" style="background-color: #ff3b6e" :disabled="canDelete" @click="confirmDelete">删除</el-button>
        <el-button type = "text" @click="deleteVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import materialAPI from '../api/materialAPI.js'
import commonFunc from '../views/material/commonFunc.js'
import upload from './uploadFile'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      folderList: [],
      file: null,
      fileList: [],
      uploadList: [],
      pathId: 0,
      parentId: '',
      parentName: '',
      isTop: true,
      isNodata: false,
      deleteVisible: false,
      canDelete: true,
      imgDomain: process.env.IMG_DOMAIN
    }
  },
  mounted () {
    this.getFileList('0')
  },
  props: {
    /*
    /* size: Number 上传文件最大体积,
    /* show: Boolean 是否显示,
    /* multiple: Boolean 是否支持多选,
    /* type: String 指定可以选中的类型，如'img',
    /* maxCount: Number 多大可以选多少个文件
    */
    options: {
      type: Object
    },
    maxCount: {
      type: Number,
      default: 50
    }
  },
  watch: {
    parentId (newVal, oldVal) {
      if (newVal === null) {
        this.isTop = true
        return
      }
      this.isTop = false
    },
    isLoading (newVal, oldVal) {
      if (this.folderList.length === 0 && !newVal) {
        this.isNodata = true
        return
      }
      this.isNodata = false
    },
    file (newVal, oldVal) {
      if (newVal) {
        this.canDelete = false
      } else {
        this.canDelete = true
      }
    },
    fileList (newVal) {
      if (newVal) {
        this.canDelete = false
      } else {
        this.canDelete = true
      }
    }
  },
  components: {
    upload
  },
  methods: {
    getFileList (num) {
      this.isLoading = true
      this.folderList = []
      materialAPI.getFileList({ dirId: num }).then(res => {
        if (!res.data.code) {
          let folder = res.data.data.folders
          let file = res.data.data.files
          for (let item of folder) {
            this.folderList.push({
              id: item.id,
              type: 'folder',
              name: item.name,
              freeze: item.type,
              isChecked: false
            })
          }
          for (let item of file) {
            this.folderList.push({
              id: item.id,
              type: commonFunc.fileType(item.fileType, item.fileName),
              name: item.fileName,
              src: item.fullUrl,
              url: item.url,
              isChecked: false
            })
          }
        }
        this.pathId = num
        this.parentId = res.data.data.parentId
        this.parentName = res.data.data.parentName
        this.isLoading = false
        // 防止重名，生成nameMap
      })
    },
    checkItem (index) {
      // 筛选文件类型,默认接受全部类型
      if (this.options.type && (this.folderList[index].type !== this.options.type)) {
        console.log('不符合筛选类型')
        return
      }
      // 是否支持多选，默认不支持
      if (this.options.multiple && this.fileList.length < this.maxCount) {
        let isChecked = this.folderList[index].isChecked
        if (isChecked) {
          let i = this.fileList.indexOf(this.folderList[index])
          this.fileList.splice(i, 1)
        } else {
          this.fileList.push(this.folderList[index])
        }
        this.folderList[index].isChecked = !isChecked
      } else if (this.fileList.length === this.maxCount && this.folderList[index].isChecked) {
        let i = this.fileList.indexOf(this.folderList[index])
        this.folderList[index].isChecked = false
        this.fileList.splice(i, 1)
      } else if (!this.options.multiple) {
        for (let item of this.folderList) {
          item.isChecked = false
        }
        this.$nextTick(() => {
          this.folderList[index].isChecked = true
          this.file = this.folderList[index]
        })
      }
    },
    confirmInsert () {
      let file = this.options.multiple ? this.fileList : this.file
      this.$emit('confirmInsert', file)
      for (let item of this.folderList) {
        item.isChecked = false
      }
      this.fileList = []
      this.file = null
    },
    cancelInsert () {
      this.$emit('cancelInsert', true)
    },
    handleUploadProgress (event, file, fileList) {
      this.isNodata = false
      this.uploadList = fileList
    },
    beforeUpload (file) {
      const isltSize = file.size / 1024 / 1024 < this.options.size
      if (!isltSize) {
        this.$message.error(`上传文件大小不能超过 ${this.options.size}MB!`)
      }
      return isltSize
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
                url: resItem.url,
                isChecked: false
              })
              if (this.options.multiple) {
                this.checkItem(this.folderList.length - 1)
              }
            }
            if (!this.options.multiple) {
              this.checkItem(this.folderList.length - 1)
            }
          }
        })
        this.uploadList = []
        this.$refs.upload.clearFiles()
      }
    },
    enterFolder (event, item) {
      event.stopPropagation()
      if (item.type !== 'folder') {
        return
      }
      this.getFileList(item.id)
    },
    reloadPage () {
      if (this.options.reload) {
        this.getFileList(this.pathId)
      }
    },
    confirmDelete () {
      let idString = ''
      // 用list做folderList的副本
      let list = Array.from(this.folderList)
      for (let item of list) {
        if (item.isChecked) {
          idString += `${item.id},`
          item = undefined
        }
      }
      materialAPI.deleteFile({ ids: idString }).then(res => {
        if (!res.data.code) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].isChecked) {
              list.splice(i, 1)
              list.length - 1
              i--
            }
          }
          // 删除的同时取消该index的选中,清空选中list
          this.fileList = []
          this.file = null
          this.folderList = Array.from(list)
          this.deleteVisible = false
          this.$message.success('删除文件成功')
        }
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.upload-matertal-wrapper{
  .el-dialog--small{
    line-height: 1!important;
  }
  .el-dialog{
    width: 665px!important;
    border-radius: 4px;
    .el-dialog__header{
      padding: 13px 16px;
      border-bottom: 1px solid #dfe3eb;
      .el-dialog__headerbtn{
        margin-top: -16px;
        .el-dialog__close.el-icon-close{
          position: static;
          opacity: 1;
          font-size: 13px;
          top: 0;
          left: 0;
        }
      }
      .wrapper-name{
        font-size: 14px;
        line-height: 20px;
      }
      .back-btn-wrapper{
        height: 20px;
        line-height: 20px;
        .back-btn{
          width: auto;
          height: auto;
          margin: 0;
          margin-right: 5px;
          padding: 1px 3px;
          i{
            position: relative;
            top: -1px;
          }
        }
        .back-name{
          font-size: 13px;
          color: #666;
          display: inline-block;
          vertical-align: top;
          margin-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          max-width: 200px;
          text-overflow: ellipsis;
        }
      }
    }
    .el-dialog__body{
      padding: 0!important;
      .nodata{
        width: 100%;
        height: 260px;
        padding-top: 60px;
        box-sizing: border-box;
        background-color: #fcfcfc;
        .nodata-layout{
          text-align: center;
          .nodata-icon{
            width: 100px;
            height: auto;
          }
          .nodata-tip{
            font-size: 13px;
            line-height: 21px;
          }
        }
      }
      .container{
        height: 260px;
        overflow-y: scroll;
        font-size: 0;
        .folder-box{
          position: relative;
          display: inline-block;
          width: 122px;
          height: 113px;
          margin: 4px 3.6px;
          background-color: #fff;
          border-radius: 8px;
          text-align: center;
          vertical-align: top;
          border: 1px solid transparent;
          cursor: pointer;
          &:hover{
            background-color: #f5f8fa;
          }
          &.checked{
            border: 1px solid #5488f9;
          }
          .layout{
            position: absolute;
            left: 29px;
            bottom: 12px;
            .img-wrapper{
              position: static;
              top: 0;
              transform: none;
              width: 66px;
              height: 66px;
              margin-bottom: 12px;
              background-size: cover;
              background-position: center;
            }
            .pic{
              position: static;
              top: 0;
              transform: none;
              width: 66px;
              height: auto;
              margin-bottom: 12px;
            }
            .file-name{
              margin-bottom: 0;
              line-height: 1;
              height: auto;
              font-size: 13px;
              color: #7c98b6;
              white-space: nowrap;
              overflow: hidden;
              max-width: 66px;
              text-overflow: ellipsis;
            }
          }
        }
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
      }
    }
    .el-dialog__footer{
      border-top: 1px solid #dfe3eb;
      padding: 16px;
    }
  }
  .footer{
    display: inline-block;
    width: 100%;
    height: 34px;
    &:after{
      content: '';
      display: table;
      clear: both;
    }
    .float-left{
      float: left;
      .el-button{
        width: auto;
        height: auto;
        padding: 9px 24px;
        margin: 0;
        .el-icon-upload{
          position: static;
          opacity: 1;
          font-size: 13px;
          top: 0;
          left: 0;
        }
      }
    }
    .float-right{
      float: right;
      .el-button{
        width: auto;
        height: auto;
        padding: 9px 24px;
        margin: 0;
        margin-left: 8px;
      }
    }
  }
}
.delete-wrapper{
  .el-dialog{
    width: 416px;
    border-radius: 4px;
    overflow: hidden;
    .el-dialog__header{
      padding: 20px 20px 0;
      border-bottom: none;
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
</style>
