<template>
  <div class="uploadEditor">
    <div class="top-container">
      <router-link to="/contact">
        <span class="back">
          <!--<span class="icon-font" style="font-size:16px;">&#xe600;</span>-->
          <span><img src="../../assets/img/left.png" alt="" class="left-back" /></span>
          <span>返回上一级</span>
        </span>
      </router-link>
    </div>
    <div class="uploadEdit_body">
      <!--顶部-->
      <div class="top_display">
        <div class="theme_title">导入</div>
        <el-button type="default" class="right_btn" @click="jumpSteps(4)" style="margin-left: 10px;">查看导入记录</el-button>
        <el-button type="primary" class="right_btn" @click="jumpSteps(3)" v-if="steps!=3"><i class="icon-font">&#xe6a7;</i>开始导入</el-button>
      </div>
      <!--进度条提示start-->
      <div class="uploadEdit_content" v-if="steps!=4">
        <div class="progress_display">
          <div class="process_desc">
            <div class="process_module">
              <p class="process_node process_line" :class="[steps==1 ? 'current':'current_after']"><i class="circle"></i></p>
              <p class="label">1.选择</p>
            </div>
            <div class="process_module">
              <p class="process_node process_line" v-if="steps==1"><i class="circle"></i></p>
              <p class="process_node process_line current" v-else-if="steps==2"><i class="circle"></i></p>
              <p class="process_node process_line current_after2" v-else><i class="circle"></i></p>
              <p class="label">2.准备</p>
            </div>
            <div class="process_module">
              <p class="process_node process_line" v-if="steps==1 || steps==2"><i class="circle"></i></p>
              <p class="process_node process_line current" v-else-if="steps==3"><i class="circle"></i></p>
              <p class="process_node process_line current_after2" v-else><i class="circle"></i></p>
              <p class="label">3.上传文件</p>
            </div>
            <div class="process_module">
              <p class="process_node" :class="[steps==4 ? 'current':'']"><i class="circle"></i></p>
              <p class="label">4.确认</p>
            </div>
          </div>
        </div>
      </div>
      <!--进度条提示end-->
      <!--选择阶段start-->
      <div class="display_content marginBottom151" v-if="steps==1">
        <div class="big_title center">选择导入类型</div>
        <div class="center" style="height:201px;">
          <span class="display_img marginRight8" v-if="selectType==0">
            <img src="../../assets/img/load/person_sel.png" alt="" />
          </span>
          <span class="display_img marginRight8" @click="selectLoadType('0')" v-else>
            <img src="../../assets/img/load/person.png" alt="" />
          </span>
          <span class="display_img" @click="selectLoadType('1')" v-if="selectType==0">
            <img src="../../assets/img/load/commpany.png" alt="" />
          </span>
          <span class="display_img" v-else>
            <img src="../../assets/img/load/commpany_sel.png" alt="" />
          </span>
        </div>
      </div>
      <!--选择阶段end-->
      <!--准备阶段start-->
      <div class="display_content marginBottom30" v-if="steps==2">
        <div class="big_title center">导入准备工作</div>
        <ul class="prepare-promp">
          <li>
            <p class="second_title">&bull;&nbsp;下载导入模板</p>
            <div class="second_desc">
              <p class="third_desc">文件为XLS文件</p>
              <p class="desc">请下载盈店通提供的导入模板，填入您需要导入的内容</p>
              <p class="text_btn"><a :href="selectType==0 ? '../../static/img/download/个人联系人模板.xlsx' : '../../static/img/download/公司联系人模板.xlsx'" target="_blank">下载导入模板</a></p>
            </div>
          </li>
          <li>
            <p class="second_title">&bull;&nbsp;数据输入注意</p>
            <div class="second_desc">
              <p class="third_desc">第一行（标题）不可删除</p>
              <p class="desc">盈店通将使用第一行标题与盈店通中的属性相匹配，删除后将无法识别，导致导入失败</p>
              <p class="third_desc" v-if="selectType==0">姓名分开输入，必须填写</p>
              <p class="desc" v-if="selectType==0">盈店通对联系人使用名字和姓氏分开的方式，请确保您在导入文件中分开填写，若姓名未填，将导致导入失败</p>
            </div>
          </li>
          <li>
            <p class="second_title">&bull;&nbsp;导入须知</p>
            <div class="second_desc">
              <p class="third_desc">邮箱相同的联系人将会合并</p>
              <p class="desc">{{selectType==0?'联系人':'公司'}}根据电子邮件地址进行去重，导入时若{{selectType==0?'联系人':'公司'}}邮箱相同，将会合并数据</p>
              <p class="third_desc">联系人导入超过1000部分认为导入失败</p>
              <p class="desc">单次导入请上传不超过1000条的记录，超过1000条的内容将不被导入</p>
              <p class="third_desc">日期格式必须符合规范</p>
              <p class="desc">日期类内容导入时请使用以下格式：YYYY-MM-DD、YYYY/MM/DD、YYYY.MM.DD，其他格式可能会导致导入后内容无法正确显示</p>
            </div>
          </li>
        </ul>
      </div>
      <!--准备阶段end-->
      <!--上传阶段start-->
      <div class="display_content" v-if="steps==3">
        <div class="big_title center">选择要上传的文件</div>
        <div class="display_load center">
          <div class="dispaly_logo">
            <i class="icon-font">&#xe6a4;</i>
          </div>
          <div class="load_limit"><i class="icon-font load_limit_logo">&#xe629;</i>请上传XLS类型文件</div>
          <div class="upload-demo center">
            <div class="el-upload-two" v-if="uploading">
              <el-button size="small" type="primary" class="loading">上传中...</el-button>
            </div>
            <el-upload
              :action="imgDomain+'/bshop/config/file/upload'"
              :on-success="loadSuccess"
              :before-upload="beforeUpload"
              :on-remove="loadRemove"
              :on-progress="filrIsloadFunc"
              :on-error="errorLimit"
              :file-list="fileList">
              <el-button size="small" type="primary" v-if="!uploading" :class="{'loading': uploading}">点击上传</el-button>
            </el-upload>
            </div>
        </div>
        <div class="load_add_tag center">
          <!--<span class="desc">添加标签：</span>
          <div class="tag_list">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              :closable="true"
              :close-transition="false"
              @close="handleClose(tag)"
              color="rgb(220,231,253)"
              v-if="dynamicTags.length>0">
              <p :title="tag">{{tag}}</p>
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>-->
        </div>
        <div class="load_hint">
          <div class="load_localize">
            <div class="hint_title"><i class="icon-font">&#xe6a5;</i>导入须知</div>
            <div class="hint_desc">
              <p>1.{{selectType==0?'联系人':'公司'}}根据电子邮件地址进行去重，导入时若{{selectType==0?'联系人':'公司'}}邮箱相同，将会合并数据</p>
              <p>2.要在CRM中将每列与其属性相匹配，请确保使用我们提供的导入模板。在此
                <a :href="selectType==0 ? '../../static/img/download/个人联系人模板.xlsx' : '../../static/img/download/公司联系人模板.xlsx'" target="_blank"><span>下载示例XLS文件</span></a>
              </p>
              <p>3.单次导入请上传不超过1000条的记录，超过1000条的内容将不被导入</p>
              <p>4.日期类内容导入时请使用以下格式：YYYY-MM-DD、YYYY/MM/DD、YYYY.MM.DD，其他格式可能会导致导入后内容无法正确显示。</p>
            </div>
          </div>
        </div>
      </div>
      <!--上传阶段end-->
      <!--完成阶段start-->
      <div class="display_content" v-if="steps==4">
        <div class="load_hint">
          <div class="load_localize">
            <div class="hint_title"><i class="icon-font">&#xe6a5;</i>导入须知</div>
            <div class="hint_desc">
              <p>1.{{selectType==0?'联系人':'公司'}}根据电子邮件地址进行去重，导入时若{{selectType==0?'联系人':'公司'}}邮箱相同，将会合并数据</p>
              <p>2.要在CRM中将每列与其属性相匹配，请确保使用我们提供的导入模板。在此<a :href="selectType==0 ? '../../static/img/download/个人联系人模板.xlsx' : '../../static/img/download/公司联系人模板.xlsx'" target="_blank"><span>下载示例XLS文件</span></a></p>
              <p>3.单次导入请上传不超过1000条的记录，超过1000条的内容将不被导入</p>
              <p>4.日期类内容导入时请使用以下格式：YYYY-MM-DD、YYYY/MM/DD、YYYY.MM.DD，其他格式可能会导致导入后内容无法正确显示。</p>
            </div>
          </div>
        </div>
        <div class="loadresult">
          <ul class="list_head">
            <li class="col-large">文件名称</li>
            <li class="col-mid2">导入时间</li>
            <li class="col-mid">类型</li>
            <li class="col-tiny">总量</li>
            <li class="col-tiny">成功</li>
            <li class="col-tiny">失败</li>
            <li >上传人</li>
          </ul>
          <div class="loading loading-circle" v-if="dataIsload"></div>
          <div class="loadresult_content" v-if="loadResultList.length>0 && !dataIsload">
            <ul class="loadresult_list" v-for="(item, index) in loadResultList">
              <li class="col-large"><p>{{item.filename}}</p></li>
              <li class="col-mid2"><p>{{item.createTime | time-formater-no-hour}}</p></li>
              <li class="col-mid"><p>{{item.importType==0?'联系人':'公司'}}</p></li>
              <li class="col-tiny"><p>{{item.totalCount}}</p></li>
              <li class="col-tiny"><p>{{item.successCount}}</p></li>
              <li class="col-tiny"><p>{{item.failCount}}</p></li>
              <li class="col-tiny"><p>{{item.uploadUserName}}</p></li>
              <li class="loadopt"><a href="javascript:;" @click="download(item.filesource)">下载</a></li>
            </ul>
          </div>
          <div class="empty-contact" v-else-if="!dataIsload">
            <img src="../../assets/img/empty-contact.png">
            <p>暂无数据</p>
          </div>
          <!--分页模块start-->
          <div class="paging-column" v-if="loadResultList.length > 0 && !dataIsload">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="size"
              :total="totalCount"
              :layout="layout">
            </el-pagination>
          </div>
          <!--分页模块end-->
        </div>
      </div>
      <!--完成阶段end-->
      <div class="mask_pop" v-if="isSubmitLoad">
        <div class="loading loading-circle load-position"></div>
      </div>
      <div class="bottom_opt" v-if="steps==1 || steps==2">
          <el-button type="default" size="large" @click="prevJump(steps)" v-if="steps!=1">上一步</el-button>
          <el-button type="primary" size="large" @click="nextJump(steps)">下一步</el-button>
      </div>
      <div class="bottom_opt" v-if="steps==3">
        <el-button type="default" size="large" @click="prevJump(steps)">上一步</el-button>
        <el-button type="primary" size="large" @click="loadSubmit" v-if="sendFile.length>0">开始导入</el-button>
        <el-button type="primary" size="large" v-else disabled="disabled">开始导入</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import fileUploadAPI from '../../../src/api/fileUploadAPI'
  import Util from '@/common/Util'
  export default{
    data () {
      return {
        selectType: this.$route.query.importType || 0,
        steps: this.$route.query.steps || 1,
        fileList: [],  // 上传文件列表
        sendFile: [],
        imgDomain: process.env.IMG_DOMAIN,
        uploading: false,
        dynamicTags: [],   // 标签列表
        inputValue: '',    // 当前标签输入内容
        inputVisible: false,
        loadResultList: [],
        page: 1,
        size: 10,
        totalCount: 10,
        dataIsload: true,
        layout: 'prev, pager, next, sizes, jumper, ->',
        isSubmitLoad: false,
        filrIsload: false
      }
    },
    computed: {
    },
    beforeRouteLeave (to, from, next) {
      if (this.filrIsload) {
        this.$confirm('请勿关闭浏览器，关闭浏览器可能会导致导入失败，或只导入部分数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next()
        }).catch(() => {
        })
      } else {
        next()
      }
    },
    mounted () {
      this.getImportRecordFunc()
      if (this.filrIsload) {
        window.onbeforeunload = function () {
          return '请勿关闭浏览器，关闭浏览器可能会导致导入失败，或只导入部分数据'
        }
      }
    },
    methods: {
      // 提示弹框
      limitPop (steps, type) {
        this.$confirm('请勿关闭浏览器，关闭浏览器可能会导致导入失败，或只导入部分数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (type === '1') { // 上一步
            this.jumpSteps(2)
          }
        }).catch(() => {
        })
      },
      filrIsloadFunc () {
        this.filrIsload = true
        this.uploading = true
      },
      // 上传失败提示
      errorLimit () {
        this.filrIsload = false
        this.uploading = false
        this.$message({
          message: '文件上传失败',
          type: 'error'
        })
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 文件导入上传提交
      loadSubmit () {
        if (this.sendFile.length > 0) {
          this.isSubmitLoad = true
          let fileData = this.fileList[0]
          let fileSize = fileData.fileSize
          let fileType = fileData.fileType
          let oriName = fileData.oriName
          let url = fileData.url
          let params = {
            filename: oriName,
            filesource: url,
            filetype: fileType,
            filesize: fileSize,
            importType: this.selectType
          }
          if (this.dynamicTags.length > 0) {
            params.tags = this.dynamicTags.join(',')
          }
          fileUploadAPI.fileImport(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '文件导入成功'
              })
              this.jumpSteps('4')
            }
            this.isSubmitLoad = false
          })
        } else {
          return
        }
      },
      // 获取关键字
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue !== '' && inputValue !== null && inputValue !== undefined) {
          this.dynamicTags.push(inputValue)      // 设置后
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      // 删除标签
      handleClose (tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      // 上传成功
      loadSuccess (res) {
        let result = res.data
        this.sendFile.push(result)
        this.fileList.push({name: result.oriName, url: result.url, fileSize: result.fileSize, fileType: result.fileType, oriName: result.oriName})
        this.uploading = false
        this.filrIsload = false
      },
      // 上传前验证
      beforeUpload (file) {
        if (!file) {
          this.uploading = false
          return false
        }
        let reg = /^.*\.(?:xls|xlsx|csv)$/i
        this.uploading = true
        if (!reg.test(file.name)) {
          this.$message.error('格式错误，请上传.xls类型的文件')
          this.uploading = false
          return false
        }
        if (this.fileList.length === 1) {
          this.$message.error('只支持单个文件上传')
          this.uploading = false
          return false
        }
        return true
      },
      loadRemove (file, updatelist) {
        this.sendFile = updatelist
        this.fileList = []
        updatelist.forEach((file, index) => {
          console.log(file)
          this.fileList.push({name: file.name, url: file.url, fileSize: file.fileSize, fileType: file.fileType, oriName: file.oriName})
        })
      },
      jumpSteps (type) {
        this.steps = parseInt(type)
        let url = window.location.href
        if (url.indexOf('importType') !== -1) {
          let oldselectType = this.$route.query.importType
          if (url.indexOf('steps') !== -1) {
            let oldsteps = this.$route.query.steps
            url = url.replace('steps=' + oldsteps, 'steps=' + type)
          } else {
            url = url + '&steps=' + type
          }
          url = url.replace('importType=' + oldselectType, 'importType=' + this.selectType)
          window.location.href = url
        } else {
          url = url + '?importType=0'
          if (url.indexOf('steps') !== -1) {
            let oldsteps = this.$route.query.steps
            url = url.replace('steps=' + oldsteps, 'steps=' + type)
          } else {
            url = url + '&steps=' + type
          }
          window.location.href = url
        }
      },
      // 下一步
      nextJump (type) {
        if (this.filrIsload) {
          this.limitPop(type, '2')
          return
        }
        type = parseInt(type)
        if (type < 4) {
          this.steps = type + 1
        }
        this.jumpSteps(this.steps)
      },
      // 上一步
      prevJump (type) {
        if (this.filrIsload) {
          this.limitPop(type, '1')
          return
        }
        type = parseInt(type)
        if (type > 1) {
          this.steps = type - 1
        }
        this.jumpSteps(this.steps)
      },
      // 上传类型选择
      selectLoadType (type) {
        let lxr = Util.hasRightByCode('DAD') // 联系人是否可导入
        let gs = Util.hasRightByCode('DBC') // 公司是否可导入
        console.log(lxr)
        console.log(gs)
        if (type === '0' && !lxr) {
          this.$message.error('该用户无联系人导入权限')
          return
        }
        if (type === '1' && !gs) {
          this.$message.error('该用户无公司导入权限')
          return
        }
        this.selectType = type
      },
      // 获取联系人导入记录
      getImportRecordFunc () {
        this.dataIsload = true
        let params = {
          page: this.page,
          size: this.size
        }
        fileUploadAPI.getImportRecord(params).then(res => {
          if (res.data.code === 0) {
            let result = res.data.data
            this.dataIsload = false
            if (result.records.length > 0) {
              this.totalCount = result.totalCount
              this.loadResultList = result.records
            }
          }
        })
      },
      // 分页每页条数改变回调方法
      handleSizeChange (val) {
        this.size = val
        this.page = 1
        this.getImportRecordFunc()
      },
      // 分页页码改变回调方法
      handleCurrentChange (val) {
        this.page = val
        this.getImportRecordFunc()
      },
      // 文件下载
      download (source) {
        let params = {
          filesource: source
        }
        fileUploadAPI.fileDownload(params).then(res => {
          if (res.data.code === 0) {
            window.open(res.data.message)
          }
        })
      }
    },
    watch: {
      steps () {
        if (this.steps === 4) {
          this.getImportRecordFunc()
        }
      }
    },
    components: {
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/page';
  .mask_pop{
    position: fixed;
    background: #000;
    width:100%;
    height:100%;
    top:0;
    left:0;
    opacity: 0.5;
    z-index: 999;
    .load-position{
      position: absolute;
      top: 50%;
      margin-top:-17px;
      left: 50%;
      margin-left:-17px;
    }
  }
  .uploadEditor{
    .display_load{
      .upload-demo{
        .el-upload{
          margin-bottom:20px;
          .el-button{
            width:200px;
            padding:10px 0 9px 0;
          }
          .loading{
            background: rgb(118, 160, 250);
            border-color: rgb(118, 160, 250);
            color:#fff;
          }
        }
        .el-upload-list{
          text-align: left;
          .el-upload-list__item{
            background: #F5F8FA;
            .el-icon-document{
              margin-left:10px;
            }
          }
          .el-upload-list__item:first-child{
            margin-top:0px;
          }
        }
      }
      .el-upload-two{
        margin-bottom:0px;
        .el-button{
          width:200px;
          padding:10px 0 9px 0;
        }
        .loading{
          background: rgb(118, 160, 250);
          border-color: rgb(118, 160, 250);
          color:#fff;
        }
      }
    }
    .load_add_tag{
      .tag_list{
        text-align: left;
        overflow:hidden;
        .no-data{
          color: #CBD6E2;
        }
        .el-tag{
          margin: 3px;
          height: 28px;
          line-height:13px;
          padding: 4px 10px 6px 10px;
          display: inline-block;
          font-size: 13px;
          color: #4F6D95;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid transparent;
          white-space: nowrap;
          p{
            max-width: 180px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 13px;
            color: #4F6D95;
            display: inline-block;
          }
          .el-tag__close{
            vertical-align: top;
          }
        }
        .input-new-tag{
          .el-input__inner{
            height: 34px;
          }
        }
        .el-button{
          vertical-align: top;
          margin-top: 3px;
        }
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/style/base";
  @import "../../assets/style/variable";
  .center{
    text-align: center;
  }
  .marginBottom151{
    margin-bottom:151px;
  }
  .marginBottom30{
    margin-bottom:30px;
  }
  .marginRight8{
    margin-right:8px;
  }
  .uploadEditor{
    padding: 20px;
    width:1200px;
    margin:0 auto;
    .top-container{
      margin-bottom:16px;
      .back{
        font-size: 14px;
        color: #7C98B6;
      }
    }
    .uploadEdit_body{
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
      .top_display{
        overflow:hidden;
        padding:16px;
        border-bottom:3px solid #DFE3EB;
        .theme_title{
          font-size: 20px;
          color: #33475B;
          font-weight: 600;
          display: inline-block;
          line-height: 36px;
        }
        .right_btn{
          float:right;
          .icon-font{
            margin-right:5px;
          }
        }
      }
      .uploadEdit_content{
        .progress_display{
          width:900px;
          margin: 0 auto;
          border-bottom:1px solid #DFE3EB;
        }
      }
      .loadresult{
        margin-top:8px;
        margin-bottom:20px;
        overflow:hidden;
        .loadresult_content{
          min-height: 461px;
        }
        .empty-contact{
          padding: 137px 0;
          text-align: center;
          p{
            margin-top: 24px;
          }
        }
        .list_head, .loadresult_list{
          li{
            float:left;
            text-align: left;
            padding: 13px 0;
            font-size: 13px;
            color: #33475B;
          }
          li:first-child{
            padding-left: 36px;
          }
        }
        .list_head{
          background: #F5F8FA;
          border: 1px solid #DFE3EB;
          overflow: hidden;
          li{
            line-height: 18px;
            font-weight: 600;
          }
        }
        .loadresult_list{
          padding: 4px 0;
          overflow: hidden;
          border-bottom: 1px solid #DFE3EB;
          li{
            padding: 14px 0;
            letter-spacing: 0;
            word-break: break-all;
            p{
              padding-right:10px;
            }
          }
          .loadopt a{
            color: #5488F9;
          }
        }
        .col-tiny{
          width: 128px;
        }
        .col-mid{
          width: 167px;
        }
        .col-mid2{
          width: 190px;
        }
        .col-large{
          width: 234px;
        }
      }
      .display_content{
        .load_hint{
          background: #F5F8FA;
          padding:25px 0 24px 0;
          .load_localize{
            width:900px;
            margin:0 auto;
            .hint_title{
              font-size: 16px;
              color: #33475B;
              line-height: 22px;
              font-weight: 600;
              i{
                color: #5488F9;
                font-size: 25px;
                margin-right:7px;
              }
            }
            .hint_desc{
              margin-top:8px;
              font-size: 13px;
              color: #33475B;
              letter-spacing: 0;
              line-height: 24px;
              padding-left: 32px;
              span{
                color: #5488F9;
                cursor: pointer;
              }
              span:hover{
                text-decoration:underline;
              }
            }
          }
        }
        .big_title{
          font-size: 20px;
          color: #33475B;
          font-weight: 600;
          padding:30px 0;
        }
        .display_load{
          width:640px;
          margin:0 auto;
          border: 1px dashed #CBD6E3;
          padding-top:37px;
          border-radius: 4px;
          .dispaly_logo{
            margin-bottom:16px;
            i{
              color: #DFE3EB;
              font-size: 34px;
            }
          }
          .load_limit{
            font-size: 12px;
            color: #7C98B6;
            line-height: 18px;
            .load_limit_logo{
              margin-right:4px;
              color: #FFA726;
              display: inline-block;
              vertical-align: bottom;
            }
          }
          .upload-demo{
            padding:8px 0;
          }
        }
        .load_add_tag{
          margin:16px 0 34px 0;
          .desc{
            line-height: 34px;
            display: inline-block;
            font-size: 13px;
            color: #33475B;
            vertical-align: top;
          }
          .tag_list{
            border: 1px solid #CBD6E3;
            border-radius: 4px;
            margin-left:5px;
            display:inline-block;
            width:240px;
            min-height:34px;
          }
        }
        .prepare-promp{
          width:900px;
          margin: 0 auto;
          li{
            margin-top:16px;
          }
          .second_title{
            font-size: 14px;
            color: #33475B;
            line-height: 18px;
          }
          .second_desc{
            margin-top:8px;
            margin-left:10px;
            .third_desc{
              font-size: 14px;
              color: #33475B;
              line-height: 24px;
            }
            .desc{
              font-size: 13px;
              color: #7C98B6;
              line-height: 24px;
            }
            .text_btn{
              font-size: 13px;
              line-height: 21px;
              margin-top:8px;
              a{
                color: #5488F9;
                cursor: pointer;
              }
              a:hover{
                text-decoration:underline;
              }
            }
          }
        }
      }
      .bottom_opt{
          border-top:1px solid #DFE3EB;;
          padding:16px 0;
          text-align: center;
          .el-button{
            padding:15px 46px;
          }
      }
      .process_desc{
        padding:30px 35px 48px 35px;
        overflow:hidden;
        .process_module:nth-child(1){
          width:21.3%;
        }
        .process_module:nth-child(4){
          width:21.3%;
        }
        .process_module{
          display: block;
          width:28.7%;
          box-sizing: border-box;
          float: left;
          font-size: 13px;
          color: #33475B;
          line-height: 18px;
          .label{
            margin-top:24px;
          }
          .process_line{
            position:relative;
          }
          .process_line:after{
            content: '';
            width: 269px;
            height: 6px;
            background: #EAF0F6;
            position: absolute;
            top: 7px;
          }
          .current_after,.after{
            .circle{
              background: #00B8CC;
            }
          }
          .current_after2,.after{
            .circle{
              background: #5488F9;
            }
          }
          .after.process_line:after{
            background:#00B8CC;
          }
          .current_after.process_line:after{
            background: -webkit-linear-gradient(left, #00B8CC , #5488F9); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(right, #00B8CC, #5488F9); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(right, #00B8CC, #5488F9); /* Firefox 3.6 - 15 */
            background: linear-gradient(to right, #00B8CC , #5488F9); /* 标准的语法 */
          }
          .current_after2.process_line:after{
            background:#5488F9;
          }
          .current{
            .circle{
              background: #5488F9;
            }
          }
          .circle{
            width:20px;
            height:20px;
            border-radius: 10px;
            display: inline-block;
            background: #EAF0F6;
          }
        }
        .process_module:nth-child(1){
          .circle{
            margin-left:13px;
          }
        }
        .process_module:nth-child(2){
          text-align: center;
        }
        .process_module:nth-child(3){
          text-align: center;
        }
        .process_module:nth-child(4){
          text-align: right;
          .circle{
            margin-right:13px;
          }
        }
      }
    }
  }
</style>
