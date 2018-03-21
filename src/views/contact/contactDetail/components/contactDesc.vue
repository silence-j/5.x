<template>
  <div class="contactDesc">
    <div class="loading loading-circle" v-if="descLoading"></div>
    <div class="top-header" v-else>
      <img class="avatar" v-if="avatar!==''&& avatar &&!type" :src="avatar" @click="avatarDialog=true" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
      <img class="avatar" v-if="avatar!==''&& avatar &&type" :src="avatar" @click="avatarDialog=true" onerror="javascript:this.src='/static/img/default_comp.png'">
      <img class="avatar" v-if="(avatar===''||!avatar)&&!type" src="../../../../assets/img/default_avatar.png" @click="avatarDialog=true">
      <img class="avatar" v-if="(avatar===''||!avatar)&&type" src="../../../../assets/img/default_comp.png" @click="avatarDialog=true">
      <span class="desc-detail">
        <span class="name" :title="desc.name">{{desc.name}}</span>
        <span v-if="$route.query.contactType == 0" class="desc" style="color:#33475B;" :title="desc.describe">{{desc.describe}}</span>
        <a v-else class="desc" :href="fullWebUrl" :title="desc.describe" style="color: #5488F9;" target="_blank">{{desc.describe}}</a>
      </span>
      <el-dropdown trigger="click" class="operate" @command="optEditDel">
        <el-button type="default" class="gray-btn">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="distrib" v-if="isMainAccount">分配</el-dropdown-item>
          <el-dropdown-item v-if="deleteRight()" command="del">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <span v-if="$route.query.contactType == 0" class="editor icon-font" style="font-size: 16px;" @click="editorPerson=true">&#xe68a;</span>
      <span v-else class="editor icon-edit icon-font" style="font-size: 16px;" @click="editorCompany=true"></span> -->
    </div>
    <el-dialog title="上传头像" v-model="avatarDialog" class="dialog-normal avatar-upload">
      <div class="upload-body">
        <img :src="preImg">
        <span class="avatar-info">
          <el-button @click="materialOptions.show=true">选择</el-button>
        </span>
      </div>
      <span slot="footer" class="confirm-btn">
        <el-button type="primary" @click="uploadAvatar" :disabled="avatarBtn">保存</el-button>
        <el-button @click="avatarDialog = false"  class="close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="type?'公司分配':'联系人分配'" v-model="dialogDistr" size="tiny" class="dialog-normal" >
      <el-select v-model="selAcc" placeholder="请选择目标账号">
        <el-option :label="logUser.name||logUser.loginAccount" :value="logUser.userId"></el-option>
        <el-option
          v-for="item in subUserList"
          :key="item.id"
          :label="item.name||item.loginAccount"
          :value="item.id">
        </el-option>
      </el-select>
      <el-checkbox class="check-text" v-model="isSync" v-if="type">同步分配公司在所有账号下的联系人</el-checkbox>
      <span slot="footer" class="confirm-btn">
        <el-button type="primary" @click="distrOk" class="confirm" :disabled="distrBtn">确定</el-button>
        <el-button @click="dialogDistr = false" class="close">取消</el-button>
      </span>
    </el-dialog>
  <uploadMaterial
  :options="materialOptions"
  @confirmInsert="confirmInsert"
  @cancelInsert="materialOptions.show=false">
  </uploadMaterial>
  <DialogBox :config="oconfig" @sure="deleteContact"></DialogBox>
  <el-dialog v-model="editorPerson" class="dialog-edit">
    <el-form :model="personForm" label-position="top" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="editor-name firstName" label="firstName" prop="firstName" >
        <el-input v-model="personForm.firstName" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item class="editor-name" label="lastName">
        <el-input v-model="personForm.lastName" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="personForm.position" :maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="confirm-btn">
      <el-button type="primary" :disabled="editPersonBtn" @click="updatePerson('ruleForm')">确 定</el-button>
      <el-button @click="editorPerson = false" class="close">取 消</el-button>
    </span>
  </el-dialog>
  <el-dialog v-model="editorCompany" class="dialog-edit">
    <el-form :model="companyForm" label-position="top" :rules="rulesCompany" ref="companyForm" label-width="100px" class="demo-ruleForm">
      <el-form-item class="editor-company-name" label="公司名称" prop="name">
        <el-input v-model="companyForm.name" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="公司官网" prop="url">
        <el-input v-model="companyForm.url" :maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="confirm-btn">
      <el-button type="primary" :disabled="companyForm.name===''||editCompBtn" @click="updateCompany('companyForm')">确 定</el-button>
      <el-button @click="editorCompany = false" class="close">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>
  <!-- <el-dialog v-model="deleteDialog" class="delete-dialog">
    <span>
      <i class="warning el-icon-warning"></i>
      <span class="text">确定删除以下{{type?'公司':'联系人'}}：</span>
    </span>
    <div class="content">
      <p :title="desc.name">{{desc.name}}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="deleteContact">删除</el-button>
      <el-button type="text" @click="deleteDialog = false">取消</el-button>
    </span>
  </el-dialog> -->
<script>
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  import Util from '@/common/Util.js'
  import uploadMaterial from '@/components/uploadMaterial'
  import DialogBox from '@/components/box/dialogBox'
  import compAvatar from '@/assets/img/default_comp.png'
  import linkAvatar from '@/assets/img/default_avatar.png'
  export default{
    data () {
      let validateFristName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.compError = false
          callback(new Error('firstName 不能为空'))
          callback()
        } else {
          this.compError = false
          callback()
        }
      }
      let validateUrl = (rule, value, callback) => {
        let rep = /^(http|https):\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/
        if (value === '' || value === null) {
          this.compError = true
          callback()
        } else {
          if (rep.test(value)) {
            this.compError = false
            callback()
          } else {
            this.compError = false
            callback(new Error('域名不合法'))
            callback()
          }
        }
      }
      return {
        deleteDialog: false,
        avatarDialog: false,
        dialogDistr: false,
        editorPerson: false,
        editorCompany: false,
        file: '',
        preImg: '',
        type: '',
        avatar: '',
        isMainAccount: false, // 是否是主账号
        selAcc: '',
        isSync: false,
        subUserList: [],
        logUser: {name: '', id: ''}, // 登陆主账号
        personForm: {
          contactId: '',
          firstName: '',
          lastName: '',
          position: ''
        },
        companyForm: {
          companyId: this.$route.query.contactId,
          name: '',
          url: ''
        },
        rules: {
          firstName: [
            { required: true, message: '请输入firstName', trigger: 'blur' },
            { validator: validateFristName, trigger: 'blur' }
          ]
        },
        rulesCompany: {
          name: [
            { required: true, message: '请输入companyName', trigger: 'blur' }
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
          ]
        },
        oconfig: {
          visible: false,
          notice: '',
          sureText: '删除',
          cancelText: '取消',
          callback: null,
          flag: 0,
          popovercls: 'confirm-pop'
        },
        materialOptions: {
          multiple: false,
          size: 10,
          type: 'img',
          show: false,
          reload: true
        },
        editPersonBtn: false,
        editCompBtn: false,
        distrBtn: false,
        avatarBtn: false
      }
    },
    mounted () {
      this.type = parseInt(this.$route.query.contactType)
      this.isMainAccount = this.distrIsShow()
      this.getSubList()
      console.log('desc')
      console.log(this.desc.url)
    },
    components: {
      uploadMaterial,
      DialogBox
    },
    methods: {
      // 是否显示 分配按钮
      distrIsShow () {
        if (localStorage.isMainAccount === 'true') {
          return true
        } else {
          return false
        }
      },
      getSubList () {
        // 主账号 获取子账号列表
        if (localStorage.isMainAccount) {
          let user = JSON.parse(localStorage.user)
          this.logUser = {userId: user.userId, name: user.name, loginAccount: user.loginAccount}
          this.subUserList = user.subUserList
        }
      },
      // 编辑/删除/分配
      optEditDel (flag) {
        if (flag === 'edit') {
          if (this.type) {
            this.editorCompany = true
          } else {
            this.editorPerson = true
          }
        } else if (flag === 'distrib') {
          this.dialogDistr = true
        } else {
          let type = this.type ? '公司' : '联系人'
          let text = `确定删除以下${type}`
          Object.assign(this.oconfig, {visible: true, notice: text, message: this.desc.name})
        }
      },
      // 分配联系人/公司
      distrOk () {
        this.distrBtn = true
        let _this = this
        if (this.selAcc) {
          if (this.type) {
            let isSync2 = this.isSync ? 1 : 0
            contactInfoApi.distribCompany({assignedUserId: this.selAcc, contactsId: this.companyForm.companyId, othersAssigned: isSync2}).then(res => {
              if (!res.data.code) {
                _this.$message.success('分配成功')
                // Object.assign(this.distrconfig, {visible: false})
                setTimeout(() => {
                  location.reload()
                }, 1000)
              } else {
                _this.$message.error(res.message)
              }
              _this.distrBtn = false
            })
          } else {
            contactInfoApi.distribLinker({assignedUserId: this.selAcc, contactsId: this.personForm.contactId}).then(res => {
              if (!res.data.code) {
                _this.$message.success('分配成功')
                // Object.assign(this.distrconfig, {visible: true})
                setTimeout(() => {
                  location.reload()
                }, 1000)
              } else {
                _this.$message.error(res.message)
              }
              _this.distrBtn = false
            })
          }
        } else {
          _this.$message.error('请选择目标账号')
          this.distrBtn = false
        }
      },
       /**
       * 删除权限
       */
      deleteRight () {
        if (this.type === 1) {  // 公司删除权限
          return Util.hasRightByCode('DBB')
        } else {
          return Util.hasRightByCode('DAB')
        }
      },
      /* deleteShow () {
        this.deleteDialog = true
      }, */
      updatePerson (formName) {
        this.editPersonBtn = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            contactInfoApi.contactPersonUpdate(this.personForm).then(res => {
              if (!res.data.code) {
                this.$message.success('更新联系人信息成功')
                this.editorPerson = false
                setTimeout(() => {
                  location.reload()
                }, 1000)
              }
              this.editPersonBtn = false
            })
          } else {
            this.editPersonBtn = false
            return false
          }
        })
      },
      updateCompany (formName) {
        this.editCompBtn = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            contactInfoApi.contactCompanyUpdate(this.companyForm).then(res => {
              if (!res.data.code) {
                this.$message.success('更新公司信息成功')
                this.editorCompany = false
                setTimeout(() => {
                  location.reload()
                }, 1000)
              } else {
                this.$message.error(res.data.message)
              }
              this.editCompBtn = false
            })
          } else {
            this.editCompBtn = false
            return false
          }
        })
      },
      deleteContact () {
        if (parseInt(this.$route.query.contactType)) {
          let params = [{
            contactsId: this.$route.query.contactId,
            contactsType: 1
          }]
          contactInfoApi.deleteCompanyList({contactses: JSON.stringify(params)}).then(res => {
            if (!res.data.code) {
              this.$message.success('删除公司成功')
              this.$router.push({path: '/contact', query: {type: this.type}})
            }
          })
        } else {
          contactInfoApi.deletePersonList({contactIds: this.$route.query.contactId}).then(res => {
            if (!res.data.code) {
              this.$router.push({path: '/contact', query: {type: this.type}})
              this.$message.success('删除联系人成功')
            }
          })
        }
      },
      /**
       * 修改头像
       * @param event
       */
      confirmInsert (file) {
        this.preImg = file.src
        this.materialOptions.show = false
      },
      uploadAvatar () {
        this.avatarBtn = true
        let formData = new FormData()
        formData.append('avatarUrl', this.preImg)
        formData.append('contactsId', this.$route.query.contactId)
        formData.append('contactsType', parseInt(this.$route.query.contactType))
        contactInfoApi.uploadAvatar(formData).then(res => {
          if (!res.data.code) {
            this.avatarDialog = false
            this.avatar = res.data.data.url
            this.$message.success('上传图片成功！')
          } else {
            this.$message.error('上传图片失败！')
          }
          this.avatarBtn = false
        })
      }
    },
    computed: {
      fullWebUrl () {
        if (this.desc.describe !== null && this.desc.describe !== '') {
          return Util.checkUrl(this.desc.describe)
        } else {
          return ''
        }
      },
      desc () {
        this.personForm = {
          contactId: this.$route.query.contactId,
          firstName: this.$store.getters.desc.firstName,
          lastName: this.$store.getters.desc.lastName,
          position: this.$store.getters.desc.describe
        }
        this.companyForm = {
          companyId: this.$route.query.contactId,
          name: this.$store.getters.desc.name,
          url: this.$store.getters.desc.describe
        }
        let infosrc = this.$store.getters.desc.avatar
        if (this.type === 1) {
          this.preImg = infosrc || compAvatar
          this.avatar = infosrc || compAvatar
        } else {
          this.preImg = infosrc || linkAvatar
          this.avatar = infosrc || linkAvatar
        }
        return this.$store.getters.desc
      },
      descLoading () {
        return this.$store.getters.descLoading
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/variable";
  @import '../../../../assets/style/dialog';
  .contactDesc{
    .loading{
      margin: 10px auto;
    }
  }
  .avatar-upload{
    .el-dialog {
      width: 436px;
    }
    .el-dialog__header{
      padding: 15px 20px;
      border-bottom: 1px solid @textBorderColor;
    }
    .el-dialog__body{
      padding: 20px;
      img{
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }
      .avatar-info{
        position: relative;
        margin-left: 20px;
        vertical-align: top;
        width: 290px;
        display: inline-block;
        button{
          padding: 10px 30px;
        }
        .file{
          position: absolute;
          top: 0;
          left: 0;
          border: 1px solid;
          width: 87px;
          height: 34px;
          opacity: 0;
        }
        .text{
          display: inline-block;
          margin-top: 20px;
          color: #7C98B6;
        }
      }
    }
    .el-dialog__footer{
      margin-top: 30px;
    }
  }
  .dialog-edit{
    .el-dialog {
      width: 395px;
    }
    .el-dialog__header{
      border: none;
    }
    .el-dialog__body{
      padding: 0 27px;
    }
    .el-dialog__footer{
      text-align: left;
      padding: 0 27px 30px 27px;
      button{
        padding: 9px 28px;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../assets/style/base";
  @import "../../../../assets/style/variable";
  .editor-name{
    width: 155px;
    display: inline-block;
    margin-bottom: 20px;
  }
  .editor-company-name{
    margin-bottom: 20px;
  }
  .firstName {
    margin-right: 20px;
  }
  .dropdown-menu{
    margin: 5px 0;
    padding: 6px 0;
    border-radius: 4px;
    .el-dropdown-menu__item{
      padding: 0 10px;
      &:not(.is-disabled):hover{
        background-color: #F4F6F8;;
      }
    }
  }
  .contactDesc{
    width: 350px;
    padding: 32px 20px;
    min-height: 56px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    background: @white;
    .avatar{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    /* .text-ellipsis(){
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    } */
    .desc-detail{
      display: inline-block;
      margin-left: 10px;
      width: 150px;
      font-size: 13px;
      vertical-align: top;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .name{
        width: 100%;
        line-height: 24px;
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
      }
      .desc{
        width: 250px;
        line-height: 20px;
        display: block;
        margin-top: 5px;
      }
    }
    /* .editor{
      float: right;
      color: #B0C1D4;
      cursor: pointer;
    } */
    .operate{
      float: right;
      margin-top: 10px;
      button{
        padding: 10px 0;
        width: 80px;
        i{
          font-size: 10px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
