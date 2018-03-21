<template>
  <div class="home-monitor-cantiner">
    <!--官网登陆start-->
    <homeLogin v-if="show !== '2'" :showAccout="showAccout" :accountList="accountList"></homeLogin>
    <!--官网询盘start-->
    <inquiryMonitor v-else :showAccout="showAccout" :accountList="accountList"></inquiryMonitor>
  </div>
</template>

<script>
  import inquiryMonitor from './homePage/inquiryMonitor'
  import homeLogin from './homePage/homeLogin'
  export default{
    data () {
      return {
        show: '1'
      }
    },
    components: {
      inquiryMonitor,
      homeLogin
    },
    beforeMount () {
      let query = this.$route.query
      if (query.t) {
        this.show = String(query.t)
      } else {
        this.show = '1'
      }
    },
    computed: {
      showAccout () {
        let userInfo = JSON.parse(window.localStorage.user)
        let parentId = userInfo.parentUserId
        if (parentId) {
          return false
        } else {
          return true
        }
      },
      accountList () {
        let userInfo = JSON.parse(window.localStorage.user)
        let sublist = userInfo.subUserList
        let mainAccount = {
          name: userInfo.name,
          id: userInfo.userId,
          loginAccount: userInfo.loginAccount
        }
        let account = [{name: '全部账号', id: ''}, mainAccount]
        if (!userInfo.parentUserId && sublist && sublist.length) {
          account = account.concat(sublist)
        }
        account = account.concat({name: '未分配', id: '-1'})
        return account
      }
    },
    watch: {
      '$route' (to, from) {
        let query = this.$route.query
        if (query.t) {
          this.show = query.t
        } else {
          this.show = '1'
        }
      }
    },
    mounted () {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  .el-button + .el-button {
    margin-left: 3px;
  }
  .inquiry-monitor{
    margin-top:10px;
    margin-bottom: 20px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
    .text-bold{
      font-weight: bolder;
    }
    .clearBoth {
      clear: both;
    }
    .list-container{
      float: left;
      width: 1200px;
      min-height: calc(~'100vh - 250px');
      background: @white;
      border-radius: 4px;
    }
    .inquiry-panel{
      overflow: hidden;
      .inquiry-list{
        float: left;
        width: 1200px;
        .list-header li{
          font-weight: bold;
        }
        .list-header li,.list-body li{
          overflow: hidden;
          padding-left: 20px;
          font-size: 13px;
          color: @textColor;
          box-sizing: border-box;
          white-space:nowrap;
          text-overflow:ellipsis;
          &.contact{
            width: 230px;
            img{
              cursor: pointer;
            }
            p{
              line-height: 18px;
              cursor: pointer;
              &.personName{
                overflow: hidden;
                margin-top: 1px;
                margin-bottom: 2px;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bolder;
                &.line-name{
                  line-height: 38px;
                }
              }
              &.company{
                overflow: hidden;
                color: @detailTextColor;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &.dis-cli{
                color: #ddd;
                cursor: text;
              }
            }
            .c-text{
              cursor: text;
            }
          }
          &.email{
            width: 220px;
            font-weight: bolder;
            .icon-font{
              font-size: 16px;
            }
            .fb{
              -webkit-text-stroke-width: 0;
            }
            .gl{
              color: #eb4435;
            }
          }
          &.origin{
            width: 210px;
          }
          &.content{
            width: 340px;
          }
          &.time{
            width: 200px;
          }
          &.person{
            width: 140px;
          }
          &.opreat{
            width: 200px;
          }
          &.operate{
            width: 100px;
            visibility: hidden;
            text-align: center;
            color: @disabledColor;
            i{
              font-size: 16px;
              cursor: pointer;
              &:hover{
                color: @activeBlue;
              }
              &.iconFont-eye{
                font-size: 18px;
                margin-right: 16px;
              }
              &.iconFont-reply{
                vertical-align: top;
                &.disabled{
                  color: @disabledColor;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
        .list-header{
          height: 46px;
          line-height: 46px;
          background: #F5F8FA;
          font-size: 13px;
          border-top: 1px solid #DFE3EB;
          border-bottom: 1px solid #DFE3EB;
          li{
            float: left;
          }
        }
        .list-body{
          height: 40px;
          padding: 10px 0;
          border-bottom: 1px solid @textBorderColor;
          &:hover,&.clicked{
            background: #F5F8FA;
            .operate{
              visibility: visible;
            }
          }
          li{
            float: left;
            line-height: 40px;
            img{
              float: left;
              width: 40px;
              height: 40px;
              margin-right: 8px;
              border-radius: 50%;
              vertical-align: middle;
            }
          }
        }
        .load-container{
          margin: 150px 0 65px 0;
        }
        .no-data{
          padding: 0;
          height: auto;
          position: absolute;
          top: 50%;
          left: 0;
          .center-section{
            display: inline-block;
            width: 494px;
            text-align: center;
            p{
              margin-top: 24px;
              margin-bottom: 16px;
              font-size: 16px;
              color: @textColor;
            }
            span{
              display: inline-block;
              line-height: 18px;
              font-size: 13px;
              color: #7C98B6;
            }
            .el-button{
              width: 120px;
              height: 34px;
              line-height: 34px;
              padding: 0;
              margin-top: 40px;
              font-size: 13px;
              font-weight: 100;
              background: @activeBlue;
              border: none;
              span{
                color: @white;
              }
            }
            .publish-over{
              span{
                display: block;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less">

  .enquiries-login, .enquiries-home{
    .select-section{
      display: inline-block;
      float: right;
      .select-container{
        display: inline-block;
        margin-left: 10px;
      }
      .el-input--small .el-input__inner{
        height: 36px;
      }
    }
  }
  .home-monitor-cantiner{
    .add-tips{
      .el-dialog{
        width: 430px;
        height: 180px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        .el-dialog__header{
          padding: 12px 12px 0;
          border: none;
        }
        .delete-tip{
          .icon-font{
            font-size: 27px;
            color: #FEA000;
            margin-right: 10px;
          }
          .tip-content{
            font-size: 14px;
            color: #33475b;
            font-weight: 600;
          }
          .tip-text{
            height: 40px;
            line-height: 24px;
            padding-left: 40px;
            font-size: 12px;
            color: rgba(51,71,91,0.60);
          }
          .btn-wrapper{
            margin-top: 16px;
            margin-left: 40px;
            .el-button--danger{
              background-color: #ff3b6e;
              padding: 9px 24px;
            }
            .el-button--default{
              border: none;
              padding: 0 9px;
              color: #4f6d95;
            }
          }
        }
      }
    }
  }
</style>
