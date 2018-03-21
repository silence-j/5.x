<template>
  <div class="landing-container addactivity">
    <div class="landing-top">
      <div class="inner-top">
        <a href="javascript:;"  @click="Backto">
         <span><img src="../../../assets/img/left.png" alt="" class="left-back" /></span>
        返回 活动列表</a>
      </div>
      <ul class="landing-top-menu">
        <li v-for="(menu,index) in menuList" @click="chooseMenu(index)" :key="menu.id" :class="activeMenu == index?'active':''">
          <span>{{ menu.label }}</span>
        </li>
      </ul>
      <div class="landing-group-btn">
        <el-button @click="toPreview" v-if="activeMenu==1&&!isPreview">预览</el-button>
        <el-button @click="quitPreview" v-if="isPreview">退出预览</el-button>
        <el-button @click="saveCurr" v-show="!isPreview && activeMenu == 2" :disabled='saveCurrLoading'>保存并退出</el-button>
        <el-button @click="Backto" v-show="!isPreview && activeMenu > 2" :disabled='saveCurrLoading'>退出</el-button>
        <el-button type="primary" @click="next" v-if="activeMenu==1&&!isPreview">下一步</el-button>
        <el-button type="primary" :disabled="takeEffect" @click="creatActivity" v-if="activeMenu==2&&!isPreview">生效活动</el-button>
        <el-button type="primary" @click="send" v-if="activeMenu==3&&!isPreview && !isSending" >发布帖子</el-button>
        <el-button type="primary"  v-if="isSending">
          <div class="loading loading-circle" style=" margin-top: 0px; margin-bottom: 0px; width: 9px; height: 9px;"></div>
        </el-button>
      </div>
    </div>
    <quicklyEmailTmpl
    v-if="activeMenu == 0&&!isPreview"
    :tmplList="tmplList"
    :tmplName="tmplName"
    :tmplId="activitySendInfo.first.tmplId || null"
    :tmplType="'activityTmpl'"
    :saveChoose="chooseEmailTmpl"
    :previewTmpl="previewTmpl"/>
    <editMail v-if="activeMenu == 1&&!isPreview" :tmplType="'activityTmpl'" @openEditor="checkEditorClose"></editMail>
    <previewContent v-if="isPreview" :tmplType="tmplType" :previewTmpl="previewTmpl"></previewContent>
    <activitySet v-if="activeMenu == 2 && !isPreview" />
    <activitySend :sendIndex="sendIndex" :changSend="changSend" v-if="activeMenu == 3 && !isPreview" />
    <el-dialog  @close="()=>{this.alginexamineDialog = false}" v-model='alginexamineDialog' class="dialogBox" title="" >
        <div class="confirm-main">
          <i class="icon-font">&#xe629;</i>
          <span >确定要退出编辑吗？</span>
        </div>
        <div  class="message">
          <span>现在退出会清空本次编辑的内容</span>
        </div>
        <div class="confirm-btn">
          <el-button class="confirm" type="primary" @click="sureDialog">保存</el-button>
          <el-button class="backto" type="text" @click="backto">退出</el-button>
          <!-- <el-button class="close" type="text" @click="calceldia">取消</el-button> -->
        </div>
	  </el-dialog>
  </div>
</template>
<script>
  import editMail from '../emailMarket/editMail.vue'
  import activityApi from '@/api/activityApi'
  import previewContent from '../emailMarket/previewContent.vue'
  import activitySet from './activitySet'
  import activitySend from './activitySend'
  // 获取各类型 @hansin
  import { getTmplContent, tmplContenToTable } from '@/common/TmplContent'
  // 模板选择 @hansin
  import quicklyEmailTmpl from '../../../components/emailEditorWrapper/emailTmpl'
  import tmplLocalList from '../../../components/emailEditorWrapper/emailTmplFolder'

  export default{
    name: 'pageCreate',
    data () {
      return {
        menuList: [
          {
            label: '选择模版'
          },
          {
            label: '编辑模板'
          },
          {
            label: '活动设置'
          },
          {
            label: '活动推广'
          }
        ],
        alginexamineDialog: false,
        takeEffect: false,
        isPreview: false,
        saveCurrLoading: false,
        activeMenu: 0,
        tmplType: 'activityTmpl',
        tmplList: [],
        tmplName: '',
        tmplId: null,
        sendIndex: 0,
        isSending: false
      }
    },
    components: {
      editMail,
      quicklyEmailTmpl,
      previewContent,
      activitySet,
      activitySend
    },
    computed: {
      activitySendInfo () {
        return this.$store.state.develop.activitySendInfo
      }
    },
    mounted () {
      // window.onbeforeunload = function (e) {
      //   this.$confirm('系统可能不会保存您所做的更改, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.next()
      //   }).catch(() => {
      //   })
      // }
      // console.log(this.$route.query)
      // this.activeMenu === this.$route.query.activityStage
      let actmenuindex = Number(this.$route.query.activityStage) + 1
      if (actmenuindex) {
        this.activeMenu = actmenuindex
      }
      let disabledTrue = this.$route.query.activityStatus
      if (disabledTrue === 'false') {
        this.takeEffect = false
      } else if (disabledTrue === 'true') {
        this.takeEffect = true
      }
      this.getEmailTmpl()
    },
    watch: {
    },
    beforeRouteLeave (to, from, next) {
      console.log(to)
      console.log(from)
      console.log(to.fullPath === '/Activitymarketing')
      if (to.fullPath === '/Activitymarketing') {
        // this.alginexamineDialog = true
      // } else {
        window.location.href = '#' + to.path
        window.location.reload()
      } else {
        this.$confirm('系统可能不会保存您所做的更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = '#' + to.path
          window.location.reload()
        }).catch(() => {
        })
      }
    },
    methods: {
      changSend (send) {
        this.isSending = send
      },
      sureDialog () {
        this.alginexamineDialog = false
        this.next()
      },
      backto () {
        this.alginexamineDialog = false
        this.$router.push('/Activitymarketing')
      },
      calceldia () {
        this.alginexamineDialog = false
      },
      getEmailTmpl () {
        if (this.tmplList && this.tmplList.length) return
        activityApi.getActmodelList().then((res) => {
          if (res && res.data.code === 0) {
            let list = res.data.data
            list.forEach((n) => {
              n.templateContent = JSON.parse(n.templateContent)
            })
            this.tmplList = [].concat(list).concat(tmplLocalList[0])
          }
        })
        //  用去调试
        // this.tmplList = tmplLocalList
      },
      chooseMenu (index) {
        if (this.isPreview) {
          this.isPreview = false
          this.tmplType = 'activityTmpl'
          // return
        }
        if (index < this.activeMenu) {
          this.activeMenu = index
        } else if (index === (this.activeMenu + 1)) {
          this.next()
        } else {
          this.next()
        }
      },
      Backto () {
        // this.alginexamineDialog = true
        // this.$router.push({path: '/Activitymarketing'})
        this.$confirm('系统可能不会保存您所做的更改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path: '/Activitymarketing'})
        }).catch(() => {
        })
      },
      clearForm () {
        this.$store.commit('DEVELOP_ACTIVITYSENDINFO', {first: {}, second: '', third: {}, four: {}})
        this.$store.commit('DEVELOP_ACTIVITYCONTENTLIST', JSON.stringify([]))
      },
      toPreview () {
        this.tmplType = 'activityTmpl'
        this.isPreview = true
      },
      quitPreview () {
        this.isPreview = false
        this.tmplType = 'activityTmpl'
        // this.$store.commit('DEVELOP_ISMENUCLICK', true)
      },
      checkEditorClose () {},
      // 模版预览
      previewTmpl (item) {
        let previewItem = []
        let contentList = item.templateContent
        contentList.forEach((n) => {
          let obj = {
            type: n.type,
            content: getTmplContent(n.type, n.preload),
            topShow: false,
            bottomShow: false
          }
          previewItem.push(obj)
        })
        let tableContent = tmplContenToTable(previewItem)
        this.$store.commit('DEVELOP_PREVIEWTABLE', tableContent)
        this.tmplType = 'previewTmpl'
        this.isPreview = true
      },
      chooseEmailTmpl (item, notAddMenu) {
        console.log(item)
        if (this.tmplName !== item.templateName) {
          this.tmplId = item.id
          this.tmplName = item.templateName
          let contentList = item.templateContent
          let mailChooseLayout = []
          contentList.forEach((n) => {
            let obj = {
              type: n.type,
              content: getTmplContent(n.type, n.preload),
              topShow: false,
              bottomShow: false
            }
            mailChooseLayout.push(obj)
          })
          this.mailLayout = mailChooseLayout
          console.log(this.mailLayout)
          this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { first: {tmplId: this.tmplId, tmplName: this.tmplName} })
          this.$store.commit('DEVELOP_ACTIVITYCONTENTLIST', JSON.stringify(this.mailLayout))
        }
        if (!notAddMenu) {
          this.next(item)
        }
      },
      next (item) {
        if (this.activeMenu === 0 && !this.tmplName) {
          this.chooseEmailTmpl(this.tmplList[0], true)
        } else if (this.activeMenu === 1) {
          let activityContentList = this.$store.state.develop.activityContentList
          if (activityContentList.indexOf('https://qiniu.onloon.co/maildefault.png') > 0) {
            this.$message.error('请确保所有图片已上传')
            this.canNext = false
            return
          } else if (this.openEditor === true) {
            this.$message.error('请确保所有内容已保存')
            this.canNext = false
            return
          }
          let pramas = {}
          pramas.activityDesc = this.$store.state.develop.activitySendInfo.third.activityDesc
          if (this.$store.state.develop.activitySendInfo.third.activityTitle) {
            pramas.activityTitle = this.$store.state.develop.activitySendInfo.third.activityTitle
          } else {
            let date = new Date()
            var Year = date.getFullYear()
            var Month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var Day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            var Hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            var Minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            var Second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            pramas.activityTitle = '活动' + Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second
          }
          this.$store.commit('DEVELOP_ACTIVITYSENDINFO', {third: pramas})
        } else if (this.activeMenu === 2) {
          // this.activeMenu ++
          let clickSure = this.$route.query.activityStatus
          // console.log(clickSure.activityStatus)
          if (clickSure === 'false') {
            // console.log('123')
          } else {
            this.creatActivity()
          }
          // console.log(this.$store.state.develop.activitySendInfo.third.url)
          return
        }
        if (this.activeMenu < 3) {
          this.activeMenu ++
        }
      },
      saveCurr () {
        this.saveCurrLoading = true
        // TODO 调用保存草稿接口
        // 从store里取出activitySendInfo
        let third = this.$store.state.develop.activitySendInfo.third
        if (!third || !third.activityTitle) {
          console.log(third.activityTitle)
          this.$message.error('请输入活动标题')
        } else {
          // TODO  调用生效活动接口
          let third = this.$store.state.develop.activitySendInfo.third
          let form = Object.assign(third, {
            activityStage: 1
          })
          let param = Object.assign(third, {
            activityContent: this.$store.state.develop.activitySendInfo.second,
            templateContent: this.$store.state.develop.activityContentList,
            templateId: this.$store.state.develop.activitySendInfo.first.tmplId
          })
          this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { third: form })
          if (this.$route.query.activityStage) {
            if (this.$route.query.activityStatus === 'true') {
              param.activityStatus = 1
            } else {
              param.activityStatus = 0
            }
            param.id = localStorage.getItem('updateId')
            activityApi.updateActivity(param).then(res => {
              console.log(res)
              if (res.data.code === 0 && res.data) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })
                this.saveCurrLoading = true
                form.url = process.env.ACTIVITY + res.data.data.unicode
                this.$router.push({path: '/Activitymarketing'})
              }
            })
            // this.saveCurrLoading = false
          } else {
            // this.saveCurrLoading = false
            activityApi.addActivity(param).then(res => {
              // console.log(res)
              if (res.data.code === 0 && res.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.saveCurrLoading = true
                form.url = process.env.ACTIVITY + res.data.data.unicode
                this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { third: form })
                this.$router.push({path: '/Activitymarketing'})
              }
            })
            // this.saveCurrLoading = false
          }
        }
      },
      creatActivity () {
        this.takeEffect = true
        let third = this.$store.state.develop.activitySendInfo.third
        if (!third || !third.activityTitle) {
          this.$message.error('请输入活动标题')
        } else {
          // TODO  调用生效活动接口
          let third = this.$store.state.develop.activitySendInfo.third
          let form = Object.assign(third, {
            activityStage: 1,
            activityStatus: 1
          })
          let param = Object.assign(third, {
            activityContent: this.$store.state.develop.activitySendInfo.second,
            templateContent: this.$store.state.develop.activityContentList,
            templateId: this.$store.state.develop.activitySendInfo.first.tmplId
          })
          if (this.$route.query.activityStage) {
            // console.log('update')
            param.id = localStorage.getItem('updateId')
            activityApi.updateActivity(param).then(res => {
              if (res.data.code === 0 && res.data) {
                form.url = process.env.ACTIVITY + res.data.data.unicode
                this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { third: form })
                if (this.activeMenu === 3) {
                } else {
                  this.activeMenu ++
                }
              }
              this.takeEffect = false
            })
          } else {
            activityApi.addActivity(param).then(res => {
              console.log(res)
              if (res.data.code === 0 && res.data && res.data.data) {
                form.url = process.env.ACTIVITY + res.data.data.unicode
                this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { third: form })
                if (this.activeMenu === 3) {
                } else {
                  this.activeMenu ++
                }
              }
              this.takeEffect = false
            })
          }
        }
      },
      send () {
        this.sendIndex ++
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
.userIndex{
  .topMenu{
    display: none
  }
}
.time-popover{
  width: 330px!important;
  // display: block!important;
  max-height: 275px;
  overflow-y: scroll;
  padding: 0;
  border: none;
  border-radius: 4px;
  &::-webkit-scrollbar{
    width: 3px;
    height: 3px;
  }
  .el-table{
    .el-table__header-wrapper table{
      width: 330px!important;
    }
    .el-table__body-wrapper table{
      width: 330px!important;
    }
  }
}
.landing-container{

  position: relative;
  margin: 20px auto 0;
  width: 1200px;
  // .el-dialog--small{
  //   height: 210px;
  //   width: 430px;
  //   .icon-font {
  //     margin-right: 10px;
  //     font-size: 24px;
  //     color: #FEA000;
  //   }
  //   span {
  //     font-size: 16px;
  //     color: #33475b;
  //   }
  //   .confirm-main{
  //     margin-left: 30px;
  //   }
  //   .confirm-btn {
  //       margin-top: 35px;
  //       margin-left: 68px;
  //       .el-button {
  //         width: 80px;
  //         height: 34px;
  //         font-size: 13px;
  //         border-radius: 4px;
  //         padding: 0;
  //       }
  //       .el-button + .el-button {
  //         margin-left: 10px;
  //       }
  //       .confirm {
  //         span{
  //         color: #ffffff;
  //         }
  //       }
  //       .backto {
  //         border: 1px solid #CBD6E3
  //       }
  //     }
  //     .message{
  //       height: 16px;
  //       margin: 15px 0 46px 70px;
  //       font-size: 14px;
  //       span{
  //         font-size:14px;
  //         color: #ababab;
  //       }
  //     }
  //     .name-wrapper{
  //       line-height: 20px;
  //       max-width: 200px;
  //       overflow:hidden;
  //       white-space: nowrap;
  //       text-overflow: ellipsis;
  //     }
  // }
  .inner-top {
    position: absolute;
    left: 3px;
    top: 19px;
    margin: 0;
    a{
      font-size: 14px;
      color: #7C98B6;
    }
    i{
      color: #7C98B6;
      font-weight: bold;
      font-size: 18px;
      margin-right: 10px;
    }
  }
  .send-dialog{
    .el-dialog{
      width: 700px;
      border-radius: 4px;
      .el-dialog__header{
        padding: 14px 16px;
        border-bottom: 2px solid #dfe3eb;
        .el-dialog__title{
          font-weight: 500;
        }
      }
      .el-dialog__body{
        padding: 39px 54px 50px 39px;
        .big-btn-wrapper{
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          .send-big-btn{
            width: 270px;
            height: 140px;
            border: 1px solid #eaf0f6;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
            img{
              margin-top: 26px;
            }
            h1{
              font-size: 18px;
              margin-top: 13px;
              margin-bottom: 8px;
              color: #33475b;
            }
            p{
              font-size: 13px;
              color: #7C98B6;
            }
          }
          .active{
            border: 3px solid #5488f9;
          }
        }
        .el-button{
          padding: 10px 27px;
        }
        .el-button--default{
          border: none;
          color: #4f6d95;
        }
        .time-wrapper{
          margin-bottom: 40px;
          .wrapper-title{
            font-size: 13px;
            color: #33475b;
            margin-bottom: 8px;
          }
          .el-date-editor--date{
            width: 200px;
            height: 28px;
            margin-right: 7px;
            .el-input__inner{
              height: 28px;
            }
          }
          .el-date-editor--time{
            width: 116px;
            height: 28px;
            .el-input__inner{
              height: 28px;
            }
          }
          .el-button--default{
            padding: 3px;
            vertical-align: bottom;
            color: #5488f9;
            font-size: 12px;
          }
        }
        .btn-loaders{
          background-color: #5488F9;
          width:80px;
          height:34px;
          display:inline-block;
          border-radius: 4px;
          position: relative;
          vertical-align: bottom;
          cursor: not-allowed;
          .loaders{
            position: relative;
            top: 11px;
            left: 23px;
            float: left;
          }
        }
      }
    }
  }
}
.landing-top-menu{
  margin: 10px auto 10px auto;
  width: 431px;
  li{
    position: relative;
    display: inline-block;
    margin: 0 20px;
    padding: 16px 0 4px 0;
    font-size: 13px;
    color: #4F6D95;
    cursor: pointer;
  }
  .active{
    color: #5488F9;
    font-weight: bold;
    border-bottom: 3px solid #5488F9;
  }
}
.landing-group-btn{
  position: absolute;
  font-size: 13px;
  right: -4px;
  top: 9px;
  .el-button{
    padding: 6px 19px;
  }
  .el-button--default{
    padding: 6px 22px;
    color: #32475A;
    border: 1px solid #DFE3EB;
    &:hover{
      color: #5488F9;
    }
  }
}
</style>
