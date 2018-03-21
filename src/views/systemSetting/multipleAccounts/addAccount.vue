<template>
  <div class="addAccount-dialog">
    <el-dialog :title="dialogTitle"
     top="10%"
     v-model="dialogAddAcc" class="add-dialog" @close="closeAddAcc">
      <div class="setForm" v-if="!isEdit">
        <el-form label-position="top" :model="rulePersonForm" :rules="rules" ref="rulePersonForm">
          <p>填写以下信息，创建新账号</p>
          <el-form-item prop="mail">
            <el-input placeholder="请输入新账户邮箱" v-model="rulePersonForm.mail"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input placeholder="请输入新账户姓名" v-model="rulePersonForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="setPower" v-if="isEdit">
        <div class="power-header">
          <span>权限设置</span>
          <el-checkbox class="checkAll" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedPower" @change="CheckedItemChange" v-if="funcList.length> 0">
          <div class="checkbox-group" v-for="(list,index) in funcList">
            <h4 :label="list.code">{{list.name}}</h4>
            <template v-for="(parentNode,index) in list.childNodes">
              <el-checkbox :label="parentNode.code" :key="parentNode.code" :checked="parentNode.selected">{{parentNode.name}}</el-checkbox>
            </template>
            <div class="check-item" v-for="(parentNode,index) in list.childNodes" v-show="parentNode.childNodes.length > 0 && showHiddenMenu(parentNode.code)">
              <span class="triangle-up" :class="{'fir':parentNode.name == '联系人', 'sec':parentNode.name == '产品管理', 'blogs':parentNode.code == 'FB', 'matter':parentNode.code == 'FC'}" v-if="parentNode.code != 'FB' && parentNode.code == 'FC'"></span>
              <el-checkbox v-for="(childNode,index) in parentNode.childNodes" :label="childNode.code" :key="childNode.code" :checked="childNode.selected">{{childNode.name}}</el-checkbox>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="add-dialog-footer" v-if="!isEdit">
        <el-button type="primary" @click="nextToSecond" class="add-btn next" :disabled="emailError || personError">下一步</el-button>
      </span>
      <span slot="footer" class="add-dialog-footer" v-if="isEdit">
        <el-button type="primary" @click="prevToFirst" class="add-btn sec prev" v-if="!isSelectPower">上一步</el-button>
        <el-button type="primary" @click="sendCheck" class="add-btn sec send" :disabled="saveButton">{{!isSelectPower?'发送':'保存'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import mulAccountApi from '@/api/mulAccountApi'
  export default {
    name: 'addAccount',
    data () {
      let validEmail = (rule, value, callback) => {
        let rule1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (value === '') {
          this.emailError = true
          callback(new Error('邮箱 不能为空'))
          callback()
        } else if (!rule1.test(value)) {
          this.emailError = true
          callback(new Error('请输入正确邮箱'))
        } else {
          this.emailError = false
          callback()
        }
      }
      let validateName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.personError = true
          callback(new Error('姓名 不能为空'))
          callback()
        } else if (value.trim().length > 10) {
          this.personError = true
          callback(new Error('最多输入10个字符'))
        } else {
          this.personError = false
          callback()
        }
      }
      return {
        dialogTitle: '',
        emailError: true,
        personError: true,
        rulePersonForm: {
          name: '',
          mail: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          mail: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {validator: validEmail, trigger: 'blur'}
          ]
        },
        checkAll: false, // 保存全选按钮状态
        isIndeterminate: false, // 保存全选按钮样式类型
        checkedPower: [], // 保存勾选的选项
        childAccountId: '', // 保存当前新增子账号Id
        saveButton: false // 保存发送按钮的禁用状态
      }
    },
    props: {
      item: Object
    },
    mounted () {
    },
    computed: {
      dialogAddAcc () {
        return this.$store.state.setting.dialogAddAcc
      },
      isEdit () {
        let editStatus = this.$store.state.setting.isEdit
        if (editStatus) {
          this.isSelectPower ? this.dialogTitle = '编辑账号' : this.dialogTitle = '新增账号（2/3）'
        } else {
          this.dialogTitle = '新增账号（1/3）'
        }
        return this.$store.state.setting.isEdit
      },
      isSelectPower () {
        return this.$store.state.setting.isSelectPower
      },
      funcList () {
        return this.$store.state.setting.funcList
      },
      allSysPower () {
        return this.$store.state.setting.allSysPower
      }
    },
    watch: {
      isEdit () {
        if (this.isEdit) {
          this.checkAll = this.checkedPower.length === this.allSysPower.length
        }
      },
      isSelectPower () {
        this.isSelectPower ? this.saveButton = false : this.saveButton = true
      },
      checkedPower () {
        // this.showHiddenMenu()
        this.checkedPower.length === 0 ? this.saveButton = true : this.saveButton = false
      }
    },
    methods: {
      showHiddenMenu (code) {
        if (code) {
          if (this.checkedPower.indexOf(code) !== -1) {
            return true
          } else {
            return false
          }
        }
      },
      /*
       * 打开添加账户第一步
       * */
      prevToFirst () {
        this.personError = false
        this.emailError = false
        this.checkedPower = []
        this.$store.commit('SETTING_ADDACC', {dialogAddAcc: true, isEdit: false})
      },
      /*
      * 关闭添加账户
      * */
      closeAddAcc () {
        this.$store.commit('SETTING_ADDACC', {dialogAddAcc: false, isEdit: false})
        // 防止关闭时 标题变动
        setTimeout(() => {
          this.$store.commit('SETTING_SELECTPOWER', {isSelectPower: false})
        }, 1000)
        this.rulePersonForm = {
          name: '',
          mail: ''
        }
        this.checkedPower = []
        if (!this.isEdit) {
          this.$refs.rulePersonForm.resetFields()
        }
      },
      /*
      * 打开添加账户第二步
      * */
      nextToSecond () {
        console.log('next--')
        this.personError = true
        this.emailError = true
        this.saveButton = true
        // this.$store.dispatch('getFuncList', {userId: this.childAccountId})
        // 新增时清空表单
        this.$store.dispatch('getFuncList', {userId: null})
      },
      /*
      * 全选功能
      * */
      checkAllChange (event) {
        this.checkedPower = event.target.checked ? this.allSysPower : []
//        this.isIndeterminate = false
      },
      /*
       * checkbox选择功能
       * */
      CheckedItemChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.allSysPower.length
//        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allSysPower.length
      },
      /*
      * 发送勾选状态code
      * */
      sendCheck () {
        /*
        * 更新用户功能
        * 编辑：sendMail:false  新增 sendMail:true
        * */
        if (this.isSelectPower) {
          this.updateFunc()
        } else {
          let params = {
            mail: this.rulePersonForm.mail,
            name: this.rulePersonForm.name
          }
          mulAccountApi.addChildAccount(params).then(res => {
            if (res.data.code === 0) {
              this.childAccountId = res.data.data
              this.updateFunc()
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              })
              this.personError = false
              this.emailError = false
            }
          })
        }
      },
      /*
      * 发送 / 保存 事件
      * */
      updateFunc () {
        this.saveButton = true
        let selectCodes = ''
        this.checkedPower.forEach(item => {
          selectCodes += item + ';'
        })
        let sendParams = {
          userId: this.childAccountId || this.item.id,
          codes: selectCodes,
          sendMail: !this.isSelectPower
        }
        mulAccountApi.updateFuncList(sendParams).then(res => {
          if (res.data.code === 0) {
            let sendMessage = ''
            this.isSelectPower ? sendMessage = '编辑账户成功' : sendMessage = '邀请邮件已发送至邮箱，请注意查收'
            this.$message({
              message: sendMessage,
              type: 'success'
            })
            this.closeAddAcc()
            this.$store.dispatch('getChildAccList')
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.saveButton = false
          }
        })
      }
    },
    components: {
    }
  }

</script>

<style lang='less' rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .addAccount-dialog{
    .add-dialog{
      ::-webkit-input-placeholder {
        color: @inputBorderColor;
        font-size: 13px;
        font-weight: 100;
      }
      :-moz-placeholder {
        color: @inputBorderColor;
        font-size: 13px;
        font-weight: 100;
      }
      ::-moz-placeholder {
        color: @inputBorderColor;
        font-size: 13px;
        font-weight: 100;
      }
      :-ms-input-placeholder {
        color: @inputBorderColor;
        font-size: 13px;
        font-weight: 100;
      }
      .el-dialog{
        width: 640px;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0,0,0,.08);
      }
      .el-dialog__header{
        padding: 13px 16px;
        border-bottom: 1px solid #DFE3EB;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        span{
          line-height: 21px;
          color: @textColor;
          font-size: 14px;
          font-weight: normal;
        }
        .el-dialog__close{
          line-height: 21px;
          font-size: 14px;
          color: @detailTextColor;
        }
      }
      .el-dialog__body{
        padding: 0 30px;
        .setForm{
          margin-top: 24px;
        }
        .setPower{
          line-height: 18px;
          font-size: 13px;
          color: @textColor;
          .el-checkbox__inner{
            width: 14px;
            height: 14px;
            &::before{
              left: 2px;
              right: 2px;
            }
            &::after{
              width: 3px;
              height: 7px;
            }
          }
          .el-checkbox__label{
            font-size: 13px;
            color: @textColor;
          }
          .power-header{
            padding: 17px 0 16px;
            border-bottom: 1px solid #DFE3EB;
            .checkAll{
              float: right;
              span{
                line-height: 18px;
                font-size: 13px;
              }
            }
          }
          .checkbox-group{
            padding: 14px 0;
            font-size: 13px;
            border-bottom: 1px solid #DFE3EB;
            h4{
              font-size: 13px;
              font-weight: normal;
            }
            .el-checkbox{
              margin: 16px 30px 0 0;
            }
            .check-item{
              position: relative;
              height: 44px;
              margin-top: 11px;
              padding-left: 16px;
              background: @loadingColor;
              .el-checkbox{
                margin: 12px 28px 0 0;
              }
              .triangle-up {
                position: absolute;
                top: -7px;
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-bottom: 7px solid @loadingColor;
                z-index: 10;
                &.fir{
                  left: 30px;
                }
                &.sec{
                  left: 138px;
                }
               &.blogs{
                  left: 120px;
               }
              &.matter{
                 left: 200px;
               }
              }
            }
          }
        }
        p{
          line-height: 18px;
          margin-bottom: 8px;
          font-size: 12px;
          color: @detailTextColor;
        }
        .el-form-item{
          margin-bottom: 20px;
          input{
            height: 34px;
            border-radius: 2px;
          }
        }
      }
      .el-dialog__footer{
        overflow: hidden;
        padding: 40px 30px 30px !important;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        .add-btn{
          padding: 0;
          &.next{
            width: 330px;
            height: 34px;
          }
          &.sec{
            width: 120px;
            height: 32px;
            &.prev{
              float: left;
              color: @disabledColor;
              background: #FFF;
              border: 1px solid #DFE3EB;
            }
            &.send{
              float: right;
            }
          }
          span{
            line-height: 18px;
            font-size: 13px;
          }
        }
      }
    }
  }
</style>
