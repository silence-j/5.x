<template>
  <div class="operateAccount-dialog">
    <el-dialog title="删除账户" v-model="dialogDeleteAcc" class="dialog-normal" @close="closeDelete" top="20%">
      <div class="operate-box">
        <h4>您确定要删除以下用户吗？</h4>
        <div class="account-detail">
          <img :src="item.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
          <p class="personName" :title="item.name">{{item.name}}</p>
          <p class="mailAddress" :title="item.loginAccount">{{item.loginAccount}}</p>
        </div>
      </div>
      <span slot="footer" class="confirm-btn">
        <el-button @click="confirmDelete" class="confirm" :disabled="deleteButton">确定</el-button>
        <el-button @click="closeDelete" class="close">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="重置密码" v-model="dialogResetPwd" class="dialog-normal" @close="closeReset" top="20%">
      <div class="operate-box">
        <h4>您确定要重置以下用户的密码吗？</h4>
        <div class="account-detail">
          <img :src="item.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
          <p class="personName" :title="item.name">{{item.name}}</p>
          <p class="mailAddress" :title="item.loginAccount">{{item.loginAccount}}</p>
        </div>
      </div>
      <span slot="footer" class="confirm-btn">
        <el-button @click="confirmReset" class="confirm" :disabled="confirmButton">确定</el-button>
        <el-button @click="closeReset" class="close">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配提醒" v-model="dialogDistrWarn" class="dialog-normal dialog-distr" top="20%">
      <div class="operate-box">
        <h6>删除子账号前请将此账号负责的联系人及公司重新分配</h6>
        <el-select v-model="assignedUserId" placeholder="全部账号">
          <el-option :label="logUser.name || logUser.loginAccount" :value="logUser.id"></el-option>
          <el-option
            v-for="item in subUserList"
            :key="item.id"
            :label="item.name||item.loginAccount"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="confirm-btn">
        <el-button @click="okDistr" class="confirm" :disabled="distrBtn">确定</el-button>
        <el-button @click="dialogDistrWarn=false" class="close">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import mulAccountApi from '@/api/mulAccountApi'
  export default {
    name: 'addAccount',
    data () {
      return {
        defaultPhoto: '/static/img/default_avatar.jpg', // 保存默认头像
        deleteButton: false, // 保存删除按钮的禁用状态
        confirmButton: false, // 保存重置按钮的禁用状态
        distrBtn: false,
        dialogDistrWarn: false,
        subUserList: [],
        assignedUserId: '',
        logUser: {}
      }
    },
    props: {
      item: Object
    },
    mounted () {
      this.getSubList()
    },
    computed: {
      dialogDeleteAcc () {
        this.deleteButton = false
        return this.$store.state.setting.dialogDeleteAcc
      },
      dialogResetPwd () {
        this.confirmButton = false
        return this.$store.state.setting.dialogResetPwd
      }
    },
    methods: {
      // 主账号 获取子账号列表
      getSubList () {
        if (localStorage.isMainAccount) {
          let user = JSON.parse(localStorage.user)
          this.logUser = {id: user.userId, name: user.name, loginAccount: user.loginAccount}
          this.subUserList = user.subUserList
        }
      },
      /*
      * 关闭删除账户
      * */
      closeDelete () {
        this.$store.commit('SETTING_DELETEACCOUNT', {dialogDeleteAcc: false})
      },
      /*
       * 关闭重置密码
       * */
      closeReset () {
        this.$store.commit('SETTING_RESETPASSWORD', {dialogResetPwd: false})
      },
      /*
      * 确定删除子账户
      * */
      confirmDelete () {
        this.deleteButton = true
        let params = {
          userId: this.item.id
        }
        mulAccountApi.delChildAccount(params).then(res => {
          if (!res.data.code) {
            // 子账户下是否有联系人
            if (!res.data.data) {
              this.$message.success('删除子账户成功')
              this.closeDelete()
              this.$store.dispatch('getChildAccList')
            } else if (res.data.data.isExit) {
              this.closeDelete()
              this.dialogDistrWarn = true
            }
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          this.deleteButton = false
        })
      },
      /**
       * 分配ok
       */
      okDistr () {
        if (!this.assignedUserId) {
          this.$message.error('请选择账号')
          return
        }
        this.distrBtn = true
        mulAccountApi.redistr({assignedUserId: this.assignedUserId, userId: this.item.id}).then(res => {
          if (!res.data.code) {
            this.$message.success('删除子账户成功')
            this.dialogDistrWarn = false
            this.$store.dispatch('getChildAccList')
          } else {
            this.$message.error(res.data.message)
          }
          this.distrBtn = false
        })
      },
      /**
       * 确定重置密码
       */
      confirmReset () {
        this.confirmButton = true
        let params = {
          userId: this.item.id
        }
        mulAccountApi.sendResetMail(params).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '重置密码的邮件已发送至邮箱，请注意查收',
              type: 'success'
            })
            this.closeReset()
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
            this.confirmButton = false
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
  @import '../../../assets/style/dialog';
  .operateAccount-dialog{
    .el-dialog{
      width: 390px;
    }
    .el-dialog__body{
      padding: 0 30px;
    }
    .operate-box{
      h4, h6{
        line-height: 20px;
        margin: 15px 0 8px 0;
        font-size: 13px;
        font-weight: normal;
        color: @textColor;
      }
      .account-detail{
        padding: 16px 20px;
        background: @loadingColor;
        img{
          float: left;
          width: 40px;
          height: 40px;
          margin-right: 8px;
          border-radius: 50%;
        }
        p{
          &.personName{
            line-height: 20px;
            margin-top: 2px;
            margin-bottom: 1px;
            font-size: 14px;
            color: @facebookColor;
          }
          &.mailAddress{
            line-height: 18px;
            margin: 0;
            color: @detailTextColor;
            font-size: 12px;
          }
        }
      }
      h6{
        margin: 20px 0;
        color: lighten(@textColor, 0.6);
        /*color: rgba(51, 71, 91, .6);*/
      }
    }
    .el-dialog__footer{
      padding: 65px 35px 20px;
    }
  }
  .dialog-distr{
    .el-dialog__footer{
      padding-top: 40px;
    }

  }
</style>
