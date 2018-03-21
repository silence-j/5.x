<template>
  <div class="extension-container">
    <ul class="ex-left-menu">
      <li v-for="(menu,index) in menuList" v-text="menu.label" @click="chooseMenu(index)" :class="activeMenu == index?'active':''"></li>
    </ul>
    <div class="right-panel">
      <div class="operate-header">
        <!-- 搜索 账号 选择发帖 -->
        <el-input
          class="search-input"
          placeholder="请输入Post关键词搜索"
          icon="search"
          v-model="searchInput"
          @keyup.enter.native="handleIconClick"
          :on-icon-click="handleIconClick">
        </el-input>
        <div class="right-side">
          <el-select class="choose-aco" v-show="isShowAccount" :class="visibleChangeAco?'activeStyle':''" v-model="accountId" placeholder="全部账号" @visible-change="visibleChange('state')" @change="getExtensionList">
            <el-option
              class="aco-option"
              v-for="(option,index) in accountList"
              :label="option.name"
              :key="index"
              :value="option.id">
            </el-option>
          </el-select>
          <AccountChoose></AccountChoose>
          <el-button @click="addPost" v-if="bindingListNew.length != 0" type="primary">
            <i class="icon-font">&#xe68a;</i>发帖
          </el-button>
        </div>
      </div>
      <div class="list-section">
        <ul class="list-header">
          <li class="checkbox">
            <el-checkbox v-model="isChecked" @change="checkAll" :disabled="isNoData"></el-checkbox>
          </li>
          <li class="time" v-show="!hasChecked">发布时间</li>
          <li class="content" v-show="!hasChecked">帖子内容</li>
          <li class="check-num" v-show="hasChecked">
            <span class="number">
              已选中<b v-text="checkedNum"></b>项
            </span>
            <span class="delete icon-buttons" @click="deleteMes()">删除</span>
          </li>
        </ul>
        <div class="list-container" v-if="!isNoData && !isListLoading">
          <ul class="list-body" v-for="(item,index) in extensionList">
            <li class="checkbox">
              <el-checkbox v-model="item.checked" @change="checkMes(item)"></el-checkbox>
            </li>
            <li class="time">
              <p>{{item.postTime | time-formater-no-second}}</p>
            </li>
            <li class="content">
              <div class="personal-info" v-for="list in bindingList" v-if="list.type == item.channelType">
                <img :src="list.url">
                <p>{{list.name}}</p>
                <p>
                  <span v-if="list.type == 0">
                    <i class="icon-font iconFont-facebook">&#xe6d9;</i>
                    <span class="channel">Facebook</span>
                  </span>
                  <span v-if="list.type == 1">
                    <svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-Facebookgonggongzhuyetubiao"></use> </svg>
                    <span class="channel">Facebook Page</span>
                  </span>
                  <span v-if="list.type == 4">
                    <i class="icon-font iconFont-twitter">&#xe6d2;</i>
                    <span class="channel">Twitter</span>
                  </span>
                  <span v-if="list.type == 2">
                    <i class="icon-font iconFont-linkedIn">&#xe7ea;</i>
                    <span class="channel">LinkedIn</span>
                  </span>
                  <span v-if="list.type == 3">
                    <svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-linkedingongsi"></use> </svg>
                    <span class="channel">LinkedIn Page</span>
                  </span>
                  <span v-if="list.type == 5">
                    <i class="icon-font iconFont-pinterest">&#xe6ff;</i>
                    <span class="channel">Pinterest</span>
                  </span>
                </p>
              </div>
              <div class="content-detail" :class="item.productPicUrl?'has-image':''">
                <div class="content-left-side">
                  <ShowMore :text="item.content" :len="maxLength"></ShowMore>
                  <p class="error" v-show="item.status == 2">
                    <i class="icon-font icon-error">&#xe601;</i>
                    <span>发送失败，稍后重新发送</span>
                  </p>
                </div>
                <img v-if="item.productPicUrl" :src="item.productPicUrl">
                <div class="clearBoth"></div>
              </div>
            </li>
            <li class="operate">
              <el-tooltip effect="dark" content="编辑" placement="top">
                <i class="icon-font" @click="editMes(item)" v-for="bind in bindingList" v-if="item.status != 2 && item.channelType == bind.type">&#xe68a;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="重发" placement="top">
                <i class="icon-font reSend" v-for="bind in bindingList" v-if="item.status != 0 && item.status != 1 && item.channelType == bind.type" @click="reSendMes(item)">&#xe749;</i>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <i class="icon-font" @click="deleteMes(item)">&#xe679;</i>
              </el-tooltip>
            </li>
          </ul>
          <div class="page-container" v-if="recommendPage.totalCount > 10">
            <el-pagination
              layout="prev, pager, next, sizes, jumper"
              :page-sizes="[10, 20, 30, 40]"
              @size-change="sizeChange"
              @current-change="recommendCurrentChange"
              :current-page="recommendPage.page"
              :page-size="recommendPage.pageSize"
              :total="recommendPage.totalCount">
            </el-pagination>
          </div>
        </div>
        <div class="load-container" v-if="isListLoading">
          <div class="loading loading-circle"></div>
        </div>
        <div class="no-post" v-if="isNoData && !isListLoading">
          <div class="center-section" v-if="bindingList.length > 0">
            <img src="../../assets/img/monitor/noData.png" v-if="noKeyword">
            <img src="../../assets/img/develop/no-search-result.png" v-if="!noKeyword" style="width: 88px">
            <div class="publish-over" v-if="activeMenu == '0' && noKeyword">
              <p>暂无数据，请先发布帖子</p>
            </div>
            <div class="plan" v-if="activeMenu == '1' && noKeyword">
              <p>暂无数据</p>
            </div>
            <div class="publish-fail" v-if="activeMenu == '2' && noKeyword">
              <p>暂无数据</p>
            </div>
            <div class="no-keyword" v-if="!noKeyword">
              <p>抱歉！没有找到与<strong>“{{searchText || '关键词'}}”</strong>相关的帖子</p>
            </div>
          </div>
          <div class="center-section no-account" v-if="bindingList.length == 0">
            <img src="../../assets/img/monitor/social-noData.png">
            <div class="publish-over">
              <p>暂无数据，请先<span class="bindAccontStyle" @click="bindAccount"> 绑定社交账号</span></p>
            </div>
          </div>
        </div>
      </div>
      <AddExtension></AddExtension>
      <EditExtension></EditExtension>
      <DialogBox :config="reSendConfig" @sure="confirmReSend"></DialogBox>
      <DialogBox :config="deleteConfig" @sure="confirmDelete"></DialogBox>
    </div>
    <div class="clearBoth"></div>
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  import AddExtension from './extension/addExtension.vue'
  import EditExtension from './extension/editExtension.vue'
  import ShowMore from '../../components/showMore.vue'
  import DialogBox from '../../components/box/dialogBox.vue'
  import AccountChoose from './extension/account-choose.vue'

  export default{
    name: 'extension',
    data () {
      return {
        maxLength: 280,
        menuList: [{
          label: '已发布'
        },
        {
          label: '计划中'
        },
        {
          label: '发布失败'
        }],
        activeMenu: 0,
        searchInput: '',
        searchText: '',
        value: '',
        item: {}, // 保存当前操作的对象
        checkedNum: 0, // checkbox 选中数量
        hasChecked: false, // checkbox是否有被选中的
        isChecked: false,
        isNoData: false,
        noKeyword: true,
        extensionList: [],
        isListLoading: false,
        params: {},
        deleteParams: {
          spreadId: ''
        },
        deleteMultiple: false, // 是否是 header 删除按钮
        reSendConfig: {
          visible: false,
          notice: '您是否确认再次发送?',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          isLoading: false,
          showclosebtn: true
        }, // 重发弹窗配置
        deleteConfig: {
          visible: false,
          notice: '您是否确认删除?',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          showclosebtn: true
        }, // 删除弹窗配置
        recommendPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        }, // 分页初始配置
        isShowAccount: true,
        visibleChangeAco: false,
        accountId: '',
        threeClick: true
      }
    },
    computed: {
      bindingList () {
        return this.$store.state.develop.bindingList
      },
      bindingListNew () {
        return this.$store.state.develop.bindingListNew
      },
      channelType () {
        return this.$store.state.develop.channelType
      },
      isAddSuccess () {
        return this.$store.state.develop.isAddSuccess
      },
      sendType () {
        return this.$store.state.develop.sendType
      },
      isEditSuccess () {
        return this.$store.state.develop.isEditSuccess
      },
      accountList () {
        let sublist = JSON.parse(window.localStorage.user)
        this.accountId = sublist.userId
        let subUserList = sublist.subUserList
        let account = [{name: sublist.name ? sublist.name : sublist.loginAccount, id: sublist.userId}]
        if (subUserList && subUserList.length) {
          account = account.concat(subUserList)
        }
        return account
      }
    },
    watch: {
      channelType () {
        this.recommendPage.page = 1
        this.getExtensionList()
      },
      sendType () {
        this.activeMenu = this.sendType
        if (this.isAddSuccess) {
          this.getExtensionList()
        }
      },
      isAddSuccess () {
        if (this.isAddSuccess) {
          this.getExtensionList()
        }
      },
      isEditSuccess () {
        if (this.isEditSuccess) {
          this.getExtensionList()
        }
      }
    },
    mounted () {
      this.isShowAccountSelect()
    },
    methods: {
      /*
      * 判断账号筛选下拉框是否显示
      * */
      isShowAccountSelect () {
        if (localStorage.getItem('isMainAccount') === 'true') {
          this.isShowAccount = true
        } else {
          this.isShowAccount = false
        }
      },
      /**
       * 菜单选择
       */
      chooseMenu (index) {
        this.noKeyword = true
        this.searchInput = ''
        this.recommendPage.page = 1
        this.activeMenu = index
        this.isChecked = false
        this.getExtensionList()
      },
      /*
       * 绑定 社交账号跳转
       * */
      bindAccount () {
        this.$router.push({path: '/channelList'})
      },
      /*
      * 标题搜索功能
      * */
      handleIconClick (event) {
        this.searchText = this.searchInput.trim()
        this.recommendPage.page = 1
        this.getExtensionList()
      },
      /*
      * 发帖
      * */
      addPost () {
        this.$store.commit('DEVELOP_ADDEXTENSION', { isAddExtension: true })
        this.$store.commit('DEVELOP_ADDSUCCESS', { isAddSuccess: false, sendType: this.activeMenu })
      },
      /*
      * header 中 CheckBox的全选功能
      * */
      checkAll () {
        if (this.isChecked) {
          this.checkedNum = this.extensionList.length
          this.hasChecked = true
        } else {
          this.checkedNum = 0
          this.hasChecked = false
        }
        this.extensionList.forEach((item, index) => {
          item.checked = this.isChecked
          item.content.replace(item.searchInput, `<span style="color: red">${item.searchInput}</span>`)
        })
      },
      /*
       * body 中 CheckBox的选中功能
       * */
      checkMes (item) {
        if (item.checked) {
          this.checkedNum ++
        } else {
          this.checkedNum --
        }
        if (this.checkedNum === this.extensionList.length) {
          this.isChecked = true
          this.hasChecked = true
        } else {
          this.isChecked = false
          if (this.checkedNum > 0) {
            this.hasChecked = true
          } else {
            this.hasChecked = false
          }
        }
      },
      /*
      * 控制 select 被选中的状态
      * */
      visibleChange (type) {
        if (this.threeClick) {
          this.threeClick = false
          this.visibleChangeAco = true
        } else {
          this.threeClick = true
          this.visibleChangeAco = false
        }
      },
      /**
       * 营销推广列表
       * @return {[type]} [description]
       */
      getExtensionList () {
        this.params = {
          status: this.activeMenu,
          keyword: this.searchInput,
          channelType: this.channelType,
          queryUserId: this.accountId,
          page: this.recommendPage.page,
          size: this.recommendPage.pageSize
        }
        this.isListLoading = true
        this.checkedNum = 0
        this.hasChecked = false
        this.$store.commit('FIND_ACCOUNTID', { accountId: this.accountId })
        DevelopAPI.getExtensionList(this.params).then(res => {
          if (this.params.status === this.activeMenu) { // 保证连续切换menu时赋值正确的list
            if (res.data.code === 0) {
              this.isListLoading = false
              if (this.searchText) {
                res.data.data.records.forEach(value => {
                  value.content = value.content.replace(this.searchText, `<span style="color: red">${this.searchText}</span>`)
                })
              }
              this.extensionList = res.data.data.records
              this.recommendPage.page = res.data.data.page
              this.recommendPage.totalCount = res.data.data.totalCount
              this.extensionList.forEach((value, index) => {
                if (value.checked === undefined) {
                  this.$set(value, 'checked', false)
                }
              })
              if (this.extensionList.length > 0) {
                this.isNoData = false
              } else {
                this.isNoData = true
                if (this.params.keyword) {
                  this.noKeyword = false
                } else {
                  this.noKeyword = true
                }
              }
            }
          }
        })
      },
      /**
       * 重新发送信息
       */
      editMes (item) {
        let param = {
          spreadId: item.id
        }
        let editDetail = {}
        DevelopAPI.editDetail(param).then(res => {
          if (res.data.code === 0) {
            editDetail = res.data.data
            this.$store.commit('DEVELOP_EDITEXTENSION', { isEditExtension: true, detail: editDetail })
            this.$store.commit('DEVELOP_EDITSUCCESS', { isEditSuccess: false })
          }
        })
      },
      reSendMes (item) {
        this.item = item
        this.reSendConfig.visible = true
      },
      confirmReSend () {
        let params = {
          spreadId: this.item.id
        }
        this.reSendConfig.isLoading = true
        DevelopAPI.reSendMes(params).then(res => {
          if (res.data.code === 0) {
            this.reSendConfig.isLoading = false
            this.getExtensionList()
            this.$message({
              message: '重新发送成功',
              type: 'success'
            })
          } else {
            this.reSendConfig.isLoading = false
            // this.$message({
            //   message: '重新发送失败',
            //   type: 'error'
            // })
          }
        })
      },
      /**
       * 删除信息
       */
      deleteMes (item) {
        this.deleteParams.spreadId = ''
        if (item) {
          this.item = item
          this.deleteMultiple = false
          this.deleteParams.spreadId = item.id
        } else {
          this.deleteMultiple = true
          this.extensionList.forEach((value, index) => {
            if (value.checked) {
              this.deleteParams.spreadId += value.id + ';'
            }
          })
        }
        this.deleteConfig.visible = true
      },
      confirmDelete () {
        DevelopAPI.deleteMes(this.deleteParams).then(res => {
          if (res.data.code === 0) {
            this.getExtensionList()
            if (this.deleteMultiple || this.checkedNum === 1) {
              this.hasChecked = false
              this.isChecked = false
            }
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      },
      /*
      * currentPage 改变触发
      * */
      recommendCurrentChange (page) {
        this.recommendPage.page = page
        this.getExtensionList()
      },
      sizeChange (pageSize) {
        this.recommendPage.pageSize = pageSize
        this.getExtensionList()
      }
    },
    components: {
      AddExtension,
      EditExtension,
      ShowMore,
      DialogBox,
      AccountChoose
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  .iconFont-facebook{
    color: @facebookColor;
  }
  .iconFont-twitter{
    color: @twitterColor;
  }
  .iconFont-linkedIn{
    color: @linkedInColor;
  }
  .iconFont-pinterest{
    color: @pinterestColor;
  }
  .extension-container{
    margin-bottom: 20px;
    .clearBoth{
      clear: both;
    }
    .ex-left-menu{
      float: left;
      width: 200px;
      li{
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        font-size: 14px;
        color: @font-title-color;
        border-left: 3px solid transparent;
        cursor: pointer;
        &.active{
          color: @activeBlue;
          border-left: 3px solid @activeBlue;
          background: @white;
          box-shadow: 0 0 8px rgba(0,0,0,.08);
        }
      }
    }
    .right-panel{
      float: left;
      width: 960px;
      margin-left: 40px;
      border-radius: 4px;
      background: @white;
      min-height: calc(~'100vh - 187px');
      position: relative;
      box-shadow: 0 0 8px rgba(0,0,0,.08);
      .operate-header{
        overflow: hidden;
        height:60px;
        line-height: 60px;
        padding: 0px 20px;
        background: @white;
        .search-input{
          width: 240px;
          height: 36px;
          line-height: 18px;
          .el-input__icon{
            color: #CBD6E2;
          }
          .el-input__inner {
            padding-left: 8px;
            font-size: 12px;
            font-weight: 300;
            border: 1px solid @inputBorderColor;
            &:focus{
              border: 1px solid #02AAAA;
            }
          }
        }
        .right-side{
          float: right;
          font-size:0px;
          .el-input__inner{
            height: 36px;
          }
          .el-select{
            margin-top:12px;
            margin-left: 10px
          }
          .el-button{
            width: 120px;
            height: 36px;
            margin-left: 10px;
            color: @white;
            /*background: @activeBlue;*/
            font-size: 12px;
            font-weight: 300;
            border-radius: 4px;
            border: none;
            margin-top:12px;
            float: right;
            &:hover{
              background: rgb(118, 160, 250);
              border-color: rgb(118, 160, 250);
            }
            i{
              margin-right: 6px;
            }
          }
          .activeStyle{
            color: #02AAAA;
          }
        }
      }
      .list-section{
        overflow: hidden;
        .el-checkbox__inner{
          width: 14px;
          height: 14px;
          &::after{
            height: 6px;
            left: 2px;
            top: 0;
          }
        }
        .list-header li,.list-body li{
          padding-left: 20px;
          box-sizing: border-box;
          &.checkbox{
            width: 6%;
            text-align: center;
          }
          &.time{
            width: 16%;
            font-size: 13px;
            p{
              line-height: 18px;
            }
          }
          &.content{
            width: 66%;
          }
          &.check-num{
            .number{
              b{
                margin: 0 1px;
                color: @activeBlue;
              }
            }
            .delete{
              margin-left: 12px;
              padding:0 15px;
              cursor: pointer;
              font-size: 12px;
              font-weight: normal;
              i{
                margin-right: 2px;
                color: @disabledColor;
                vertical-align: top;
              }
            }
            .delete:hover{
              background: #5488F9;
              color: #ffffff !important;
            }
          }
          &.operate{
            width: 12%;
            text-align: center;
            i{
              font-size: 14px;
              cursor: pointer;
              &:first-child{
                margin-right: 10px;
              }
            }
          }
        }
        .list-header{
          height: 48px;
          line-height: 48px;
          border-top: 1px solid @textBorderColor;
          border-bottom: 1px solid @textBorderColor;
          background: #F5F8FA;
          li{
            font-size: 13px;
            float: left;
            font-weight: bolder;
            color: @textColor;
          }
        }
        .list-container{
          .list-body{
            overflow: hidden;
            position: relative;
            border-bottom: 1px solid @textBorderColor;
            &:hover{
              background: #F5F8FA;
              .operate{
                visibility: visible;
              }
            }
            li{
              float: left;
              margin: 16px 0;
              color: @textColor;
              &.checkbox{
                margin-top: 27px;
              }
              &.time{
                p{
                  width: 100px;
                  line-height: 18px;
                }
              }
              &.content{
                .personal-info{
                  img{
                    float: left;
                    width: 32px;
                    height: 32px;
                    margin-right: 8px;
                  }
                  p{
                    line-height: 17px;
                    font-size: 12px;
                    font-weight: bolder;
                    &:last-child{
                      font-weight: normal;
                      .channel{
                        color: #7C98B6;
                      }
                    }
                  }
                }
                .content-detail{
                  position: relative;
                  margin-top: 8px;
                  .error{
                    width: 190px;
                    height: 26px;
                    line-height: 26px;
                    margin-top: 8px;
                    padding-left: 10px;
                    border: 1px solid rgba(255,59,110,.15);
                    border-radius: 3px;
                    font-size: 12px;
                    color: #FF3B6E;
                    background: rgba(255,59,110,.05);
                    opacity: 0.9;
                    .icon-error{
                      color: #FF3B6E;
                    }
                  }
                  &.has-image{
                    .content-left-side{
                      float: left;
                      width: 490px;
                      .describe{
                        display: inline-block;
                      }
                    }
                    /*
                    img{
                      position: absolute;
                      right: 0;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 64px;
                      height: 64px;
                      border-radius: 0;
                    }
                    */
                    img{
                      float: right;
                      width: 64px;
                      height: 64px;
                      border-radius: 0;
                    }
                  }
                  .describe{
                    word-break: break-all;
                  }
                }
              }
              &.operate{
                visibility: hidden;
                position: absolute;
                top: 45%;
                right: 0;
                transform: translateY(-100%);
                i{
                  font-size: 16px;
                  color: @disabledColor;
                  &.reSend{
                    font-weight: bold;
                  }
                  &:hover{
                    color: @activeBlue;
                  }
                }
              }
              &.clearBoth{
                padding: 0;
              }
              img{
                width: 45px;
                height: 45px;
                border-radius: 50%;
                vertical-align: middle;
              }
            }
          }
          // .page-container{
          //   margin: 16px 0 30px;
          //   padding-right: 16px;
          //   text-align: right;
          //   .el-pagination{
          //     margin: 0;
          //     color: #4F6D95;
          //     .btn-prev{
          //       margin-right: 10px;
          //       border-right: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //     }
          //     .btn-next{
          //       margin: 0 10px 0 0;
          //       border-left: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //     }
          //     li{
          //       margin-right: 10px;
          //       border: 1px solid rgb(209, 213, 229);
          //       border-radius: 4px;
          //       &.active{
          //         border: none;
          //       }
          //     }
          //     .el-pager li.active + li {
          //       border-left: 1px solid rgb(209, 213, 229);
          //     }
          //   }
          // }
        }
        .load-container{
          margin: 120px 0 186px 0;
        }
        .no-post{
          width: 200px;
          height: 140px;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          .center-section{
            display: inline-block;
            text-align: center;
            // &.no-account{
            //   margin-top: 70px;
            // }
            p{
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 14px;
              color: @textColor;
            }
            span{
              color: #7C98B6;
            }
            .el-button{
              width: 100px;
              height: 34px;
              margin-top: 30px;
              padding: 0;
              font-size: 14px;
              font-weight: 100;
              /*background: @activeBlue;*/
              border: none;
              span{
                color: @white;
              }
            }
            .publish-over{
              font-size: 14px;
              .bindAccontStyle{
                display: inline;
                font-size: 14px;
                text-decoration: underline;
                color:#5488F9;
                cursor: pointer;
              }
              span{
                display: block;
              }
            }
          }
        }
      }
    }
    .clearBoth{
      clear: both;
    }
  }
</style>
