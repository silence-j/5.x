<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content">
      <div class="u-right multiple">
        <div class="head-section">
          <el-button @click="addAccount" v-if="childAccList.length < 10">添加账户</el-button>
          <span v-if="childAccList.length === 10" class="disabledBtn">添加账户</span>
          <!-- <span class="useStatistics" @click="linkToStatistics">查看子账号使用统计</span> -->
        </div>
        <div class="accountList" v-if="!childAccLoad">
          <div class="nodata" v-if="!isNodata">
            <div class="nodata-layout">
              <img src="../../../assets/img/empty-contact.png" alt="">
              <p>暂无数据，请先添加账号</p>
            </div>
          </div>
          <div v-else>
            <div class="list-item" v-for="(item,index) in childAccList">
              <img :src="item.avatar || defaultPhoto" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
              <p class="personName" :title="item.name">{{item.name}}</p>
              <p class="mailAddress" :title="item.loginAccount">{{item.loginAccount}}</p>
              <div class="operate">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <i class="icon-font" @click="editAccount(item)">&#xe68a;</i>
                </el-tooltip>
                <el-tooltip effect="dark" content="重置密码" placement="top">
                  <i class="icon-font" @click="resetPassword(item)">&#xe64b;</i>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <i class="icon-font" @click="deleteAccount(item)">&#xe6c5;</i>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="noAddAccount" v-if="noSetAccount && !childAccLoad">
          <img src="../../../assets/img/contact/email-empty.svg">
          <p>您尚未添加子账号</p>
        </div>
        <div class="loading loading-circle" v-if="childAccLoad"></div>
      </div>
    </div>
    <addAccountDialog :item="childAccUser"></addAccountDialog>
    <operateAccount :item="childAccUser"></operateAccount>
  </div>
</template>
<script>
  // import mulAccountApi from '@/api/mulAccountApi'
  import headLeft from '../systemIndex'
  import addAccountDialog from './addAccount'
  import operateAccount from './operateAccount'

  export default {
    name: 'setMulAccount',
    data () {
      return {
        isNodata: 0,
        defaultPhoto: '/static/img/default_avatar.jpg', // 保存默认头像
        noSetAccount: false, // 保存是否添加子账号的Boolean值
        childAccUser: {} // 保存当前操作的子账户
      }
    },
    mounted () {
      this.$store.dispatch('getChildAccList')
    },
    computed: {
      childAccLoad () {
        return this.$store.state.setting.childAccLoad
      },
      childAccList () {
        return this.$store.state.setting.childAccList
      }
    },
    watch: {
      childAccList (newVal, oldVal) {
        this.isNodata = newVal.length
      }
    },
    methods: {
      /*
      * 添加子账户
      * */
      addAccount () {
        // if (this.childAccList.length === 5) {
        //   this.$message({
        //     message: '您已达到子账号上限5个',
        //     type: 'error'
        //   })
        //   return
        // }
        this.$store.commit('SETTING_ADDACC', {dialogAddAcc: true, isEdit: false})
      },
      /*
      * 跳转子账号使用统计页
      * */
      linkToStatistics () {
        this.$router.push({path: '/accountStatistics'})
      },
      /*
      * 编辑子账户
      * */
      editAccount (user) {
        this.childAccUser = user
        this.$store.commit('SETTING_SELECTPOWER', {isSelectPower: true})
        this.$store.dispatch('getFuncList', {userId: user.id})
      },
      /*
       * 重置密码
       * */
      resetPassword (user) {
        this.childAccUser = user
        this.$store.commit('SETTING_RESETPASSWORD', {dialogResetPwd: true})
      },
      /*
       * 删除子账户
       * */
      deleteAccount (user) {
        this.childAccUser = user
        this.$store.commit('SETTING_DELETEACCOUNT', {dialogDeleteAcc: true})
      }
    },
    components: {
      headLeft,
      addAccountDialog,
      operateAccount
    }
  }

</script>

<style lang='less' rel="stylesheet/less">
  @import '../../../assets/style/list.less';
  @import '../../../assets/style/variable';
  .u-right{
    overflow: hidden;
    &.multiple{
      min-height: 624px !important;
      box-sizing: border-box !important;
    }
    .head-section{
      min-height: 34px;
      position: relative;
      padding: 9px 20px 24px;
      border-bottom: 1px solid @textBorderColor;
      .disabledBtn{
        color: #B0C1D4;
        background-color: #eaf0f6;
        border: 1px solid #dfe3eb;
        width: 100px;
        height: 34px;
        line-height: 34px;
        padding: 0;
        font-size: 13px;
        font-weight: 300;
        display: inline-block;
        white-space: nowrap;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        border-radius: 4px;
        cursor: no-drop;
        span {
          color: #B0C1D4;
        }
      }
      .el-button{
        width: 100px;
        height: 34px;
        line-height: 34px;
        padding: 0;
        font-size: 13px;
        font-weight: 300;
        background: @activeBlue;
        border: none;
        &:hover{
          background: rgb(118, 160, 250);
          border-color: rgb(118, 160, 250);
        }
        span {
          color: @white;
        }
      }
      .useStatistics{
        position: absolute;
        right: 20px;
        top: 16px;
        line-height: 18px;
        font-size: 13px;
        text-decoration: underline;
        color: @mainFontColor;
        cursor: pointer;
        &:hover{
          color: #5488F9;
        }
      }

    }
    .accountList{
      padding: 0 20px;
      .list-item{
        position: relative;
        padding: 16px 0;
        border-bottom: 2px solid @textBorderColor;
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
            margin-top: 1px;
            margin-bottom: 1px;
            font-size: 14px;
            color: @textColor;
          }
          &.mailAddress{
            line-height: 18px;
            color: @detailTextColor;
            font-size: 12px;
          }
        }
        .operate{
          position: absolute;
          right: 20px;
          top: 30px;
          i{
            margin-left: 16px;
            font-size: 14px;
            color: @disabledColor;
            cursor: pointer;
            &:hover{
              color: @activeBlue;
            }
          }
        }
      }
      .nodata{
        .nodata-layout{
          width: 190px;
          height: 190px;
          text-align: center;
          margin: 150px auto 0;
          img{
            width: 100px;
            height: auto;
          }
          p{
            font-size: 13px;
            margin-top: 10px;
          }
        }
      }
    }
    .noAddAccount{
      width: 112px;
      margin-top: 161px;
      margin-left: 50%;
      transform: translateX(-50%);
      text-align: center;
      img{
        width: 89px;
      }
      p{
        margin-top: 16px;
        font-size: 14px;
        color: #577ECE;
      }
    }
    .loading-circle{
      margin-top: 200px;
    }
  }
</style>
