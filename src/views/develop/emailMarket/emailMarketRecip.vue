<template>
    <div class="emailmRecip-container">
      <div class="emailmRecip-choose">
        <h3 class="recip-tit">
          <a @click="choseLinker(0)" href="javascript:;" :class="{'curr': choseType == 0}"><i class="icon-san"></i>联系人分组</a>
          <a @click="choseLinker(1)" href="javascript:;" :class="{'curr': choseType == 1}"><i class="icon-websitestyle"></i>联系人</a>
        </h3>
        <!-- <el-autocomplete placeholder="" v-model="searchText" >
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-autocomplete> -->
        <el-input v-show="choseType == 0 && (groups.length || canSearch2)" placeholder="请输入分组名称" v-model.trim="searchText2" class="search-text">
          <el-button slot="append" icon="search"></el-button>
        </el-input>
        <el-input v-show="choseType == 1 && (linkers.length || canSearch1)" placeholder="请输入联系人名称" v-model.trim="searchText" class="search-text">
          <el-button slot="append" icon="search"></el-button>
        </el-input>
        <div class="scroll-box" id="scroll-box">
          <ul class="emailmResult-list emailmResult-group" v-show="choseType == 0 && groups.length">
            <li class="tit">
              <span class="first-text">分组名称</span>
              <span class="three-text"></span>
              <a href="javascript:;" class="sec-text" @click="choseAllg">{{(groupAll && groups.length)?'取消全选':'全选'}}</a>
            </li>
            <li v-for="(val, key) in groups" :class="{'selected': val.selected}">
              <a href="javascript:;" class="first-text" :title="val.groupName"><span>{{val.groupName}}</span><em>({{val.contactsCount}})</em></a>
              <span class="three-text"><i class="icon-sendrate"></i></span>
              <span class="sec-text">
                <el-button type="primary" @click="toChoseng(val)">发送</el-button>
                <el-button class="btn-cancel" @click="removeChoseng(val)">取消发送</el-button>
              </span>
            </li>
          </ul>
          <ul class="emailmResult-list" v-show="choseType == 1 && linkers.length">
            <li class="tit">
              <span class="first-text">联系人</span>
              <span class="three-text"></span>
              <a href="javascript:;" class="sec-text" @click="choseAll">{{(linkerAll && linkers.length)?'取消全选':'全选'}}</a>
            </li>
            <li v-for="(val, key) in linkers" :class="{'selected': linkersc.indexOf(val.personId+',') != -1}">
              <a href="javascript:;" @click="showDetail(val)" class="first-text" :title="val.name">{{val.name}}&lt;{{val.mail}}&gt;</a>
              <span class="three-text"><i class="icon-sendrate"></i></span>
              <span class="sec-text">
                <el-button type="primary" @click="toChosen(val)">发送</el-button>
                <el-button class="btn-cancel" @click="removeChosen(val)">取消发送</el-button>
                <!-- <i class="icon-sendrate"></i> -->
              </span>
            </li>
          </ul>
          <div class="loading loading-circle" :class="!choseType||(choseType&&linkPage==1)?'':'load-no-first'" v-if="loading"></div>
          <div class="no-data no-more" v-if="noMore == 'linknoMore' && !loading">
            <div class="tips">没有更多了</div>
          </div>
          <div class="no-data emailm-nodata" v-if="!loading && ((!choseType&&!groups.length) || (choseType&&!linkers.length))">
            <!-- <div class="img"></div> -->
            <img src="../../../assets/img/monitor/noData.png">
            <div class="tips">暂无数据</div>
          </div>
        </div>
      </div>
      <div class="emailmRecip-chosen">
        <h3 class="recip-tit">发送给</h3>
        <div class="scroll-box">
          <!-- 选择的分组 -->
          <ul class="chosen-list chosen-group">
            <li v-for="(val, index) in groupsChosen">
              <em class="icon-sendrate"></em>
              <span :title="val.groupName">{{val.groupName}}({{val.contactsCount}})</span>
              <a href="javascript:;" class="icon-remove2" @click="removeGroup(index, val.groupId)"></a></li>
          </ul>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="linkerChosen">
              <template slot="title">
                <span class="tit"><em class="icon-sendrate"></em>独立联系人({{linkersChosen.length}})</span>
              </template>
              <!-- 选择的联系人 -->
              <ul class="chosen-list">
                <li v-for="(val, index) in linkersChosen">
                  <span :title="val.firstname+''+val.lastname+'&lt;'+val.address+'&gt;'">{{val.firstname}}{{val.lastname}}&lt;{{val.address}}&gt;</span>
                  <a href="javascript:;" class="icon-remove2" @click="removeLinker(index)"></a></li>
              </ul>
            </el-collapse-item>
          </el-collapse>
        </div>
        <h3 class="recip-num">收件人数量<em>{{allLinkerNum}}</em></h3>
      </div>
    </div>
</template>

<script>
  import emailmApi from '@/api/emailMarketApi'
  import Util from '@/common/Util'
  import { mapGetters } from 'vuex'
  export default{
    name: 'emailMarketRecip',
    data () {
      return {
        searchText: '',
        searchText2: '', // 分组搜索关键字
        linkers: [], // 左边列表
        linkersc: '', // 判断样式的字符串
        linkersChosen: [], // 左边选中放到右边的数组
        linkerAll: false, // 是否全选
        loading: true,
        oneCount: 100000, // 一次可发送的数量
        activeNames: ['linkerChosen'],
        oldQueryStr: '',
        choseType: 0,
        allLinkerNum: 0,
        groups: [],
        groupsChosen: [],
        groupAll: false, // 是否全选
        canSearch1: false,
        canSearch2: false,
        // groupPage: 1,
        linkPage: 1,
        noMore: ''
      }
    },
    computed: {
      ...mapGetters({
        linkerToMail: 'linkerToMail',
        sendInfo: 'sendInfo'
      })
    },
    watch: {
      // 搜索列表
      searchText () {
        this.canSearch1 = true
        let _this = this
        let oldQueryStr = _this.searchText
        setTimeout(() => {
          if (_this.searchText === oldQueryStr) {
            _this.linkPage = 1
            _this.linkers = []
            _this.getLinkers(true)
            // emailmApi.getLinker({keyword: this.searchText.replace(/(^\s*)|(\s*$)/g, ''), mail: true, size: 999, page: 1}).then(res => {
            //   if (!res.data.code) {
            //     _this.loading = false
            //     _this.linkers = res.data.data.records
            //   }
            // })
          }
        }, 320)
      },
      searchText2 () {
        this.canSearch2 = true
        let _this = this
        let oldQueryStr = _this.searchText2
        setTimeout(() => {
          if (_this.searchText2 === oldQueryStr) {
            _this.groups = []
            _this.getGroups()
          }
        }, 320)
      },
      // choseType () {
      //   if (this.choseType === 0) {
      //     this.getGroups(1)
      //   } else {
      //     this.getLinkers()
      //   }
      // },
      linkersChosen () {
        if (this.linkers.length === this.linkersChosen.length) {
          this.linkerAll = true
        } else {
          this.linkerAll = false
        }
        this.getLinkerNum()
      },
      groupsChosen () {
        if (this.groups.length === this.groupsChosen.length) {
          this.groupAll = true
        } else {
          this.groupAll = false
        }
        this.getLinkerNum()
      }
    },
    mounted () {
      // from 联系人页面
      if (this.linkerToMail) {
        this.choseType = 1
        this.getLinkers()
        this.scrollFresh()
      } else {
        this.getGroups()
        this.linkerChose() // 联系人选中
      }
      emailmApi.getSendNum().then(res2 => {
        if (!res2.data.code) {
          this.oneCount = res2.data.data.oneCount
        }
      })
      let activeMenu = this.$route.query.activeMenu
      if (activeMenu) {
        this.getEmailInfo()
      }
    },
    methods: {
      getEmailInfo () {
        let isEdit = this.$route.query.id
        emailmApi.getMarketDetail({mailMarketingId: isEdit}).then(res => {
          if (!res.data.code) {
            let editData = res.data.data
            // 编辑页面都不要second
            // {contactsIds: editData.receivers, contactsGroupIds: editData.groupReceivers}
            this.$store.commit('DEVELOP_SENDINFO', { first: editData, third: editData.content, four: {} })
            this.$store.commit('DEVELOP_EMAILCONTENTLIST', editData.contentArr)
            this.$emit('addValid', true)
            this.$emit('schTime', res.data.data.scheduleTime)
          }
        })
      },
      // 选择联系人还是分组
      choseLinker (flag) {
        if (flag === 0) {
          // this.groupPage = 1
          // this.groups = []
          this.getGroups()
        } else {
          this.linkPage = 1
          this.linkers = []
          this.getLinkers()
          this.scrollFresh()
        }
        this.noMore = ''
        this.choseType = flag
      },
      // 初始化联系人
      getLinkers (isSearch) {
        let _this = this
        _this.loading = true
        // 获取联系人列表
        emailmApi.getLinker({keyword: _this.searchText, mail: true, size: 20, page: _this.linkPage}).then(res => {
          if (!res.data.code) {
            _this.loading = false
            let records = res.data.data.records
            // _this.linkers = res.data.data.records
            // 关键字搜索
            if (isSearch) {
              _this.linkers = records
              _this.linkerChose()
              _this.noMore = ''
            } else {
              if (records.length) {
                _this.linkers = _this.linkers.concat(records)
                _this.linkerChose()
              } else {
                if (_this.linkPage !== 1) {
                  _this.noMore = 'linknoMore'
                }
              }
            }
          }
        })
      },
      // 初始化分组
      getGroups () {
        let _this = this
        _this.loading = true
        let info = this.sendInfo
        emailmApi.getGroups({groupName: _this.searchText2, hasEmail: true, size: 999, page: 1}).then(res => {
          if (!res.data.code) {
            _this.loading = false
            let records = res.data.data
            console.log(records)
            // if (records.length) {
            // _this.groups = _this.groups.concat(records)
            _this.groups = records
            if (info.second) {
              if (info.second.contactsGroupIds && info.second.contactsGroupIds.length) {
                _this.$emit('addValid', true)
                _this.groupsChosen = info.second.contactsGroupIds

                for (let i = 0, len = this.groupsChosen.length; i < len; i++) {
                  _this.doSelect(this.groupsChosen[i].groupId)
                }
              }
            }
            // }
            //  else {
            //   if (_this.groupPage !== 1) {
            //     _this.noMore = 'groupnoMore'
            //   }
            // }
          }
        })
      },
      /**
       * 联系人列表中选择联系人
       */
      toChosen (item) {
        // 列表中数据转化成最后一步要传的数据
        let obj = {personId: item.personId, companyId: item.companyId, firstname: item.firstName, lastname: item.lastName, personal: this.notNull(item.lastName) + this.notNull(item.firstName), address: item.mail}
        this.linkersChosen.push(obj)
        this.linkersc += item.personId + ','
        this.choseComm()
      },
      toChoseng (item) {
        this.doSelect(item.groupId)
        this.groupsChosen.push(item)
        this.choseComm()
      },
      choseComm () {
        this.$emit('addValid', true)
        this.$store.commit('DEVELOP_SETDIRTY', true)
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /**
       * 处理联系人右边选中的
       */
      linkerChose () {
        let info = this.sendInfo
        let _this = this
        if (info.second) {
          let cids = info.second.contactsIds || []
          // from 联系人列表 字段要转换的
          if (this.linkerToMail) {
            cids.forEach((item) => {
              _this.toChosen(item)
            })
            this.$store.commit('LINKER_TO_MAIL', {linkerToMail: false})
          } else {
            if (_this.$store.getters.ismenuclick) {
              if (cids && cids.length) {
                _this.linkersChosen = cids
              }
              // 左边列表中选中的
              if (_this.linkersChosen.length) {
                _this.$emit('addValid', true)
                _this.linkersChosen.forEach((item) => {
                  _this.linkersc += item.personId + ','
                })
              }
            }
          }
        }
      },
      /**
       * 选中联系人中删除
       */
      removeLinker (index) {
        this.linkersChosen.splice(index, 1)
        // 列表选中值
        this.linkersc = ''
        this.linkersChosen.forEach((item) => {
          this.linkersc += item.personId + ','
        })
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /**
       * 选中分组中删除
       */
      removeGroup (index, groupId) {
        this.groupsChosen.splice(index, 1)
        for (let i = 0, len = this.groups.length; i < len; i++) {
          if (groupId === this.groups[i].groupId) {
            delete this.groups[i].selected
          }
        }
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /**
       * 联系人取消发送
       */
      removeChosen (val) {
        // 列表选中值
        let choseindex = -1
        this.linkersc = ''
        this.linkersChosen.forEach((item, index) => {
          if (item.personId === val.personId) {
            choseindex = index
          } else {
            this.linkersc += item.personId + ','
          }
        })
        if (choseindex !== -1) {
          this.linkersChosen.splice(choseindex, 1)
        }
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /**
       * 取消发送
       */
      removeChoseng (val) {
        let len1 = this.groups.length
        let len2 = this.groupsChosen.length
        for (let i = 0; i < len1; i++) {
          if (val.groupId === this.groups[i].groupId) {
            delete this.groups[i].selected
          }
        }
        for (let j = 0; j < len2; j++) {
          if (val.groupId === this.groupsChosen[j].groupId) {
            this.groupsChosen.splice(j, 1)
          }
        }
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /*
       * 全选
       */
      choseAll () {
        if (this.linkers.length < 1) {
          return
        }
        let _this = this
        _this.linkersChosen = []
        if (!_this.linkerAll) { // 点击全选
          let arr = []
          _this.linkers.forEach((item) => {
            let obj = {personId: item.personId, companyId: item.companyId, firstname: item.firstName, lastname: item.lastName, personal: this.notNull(item.lastName) + this.notNull(item.firstName), address: item.mail}
            arr.push(obj)
            _this.linkersc += item.personId + ','
          })
          Object.assign(this.linkersChosen, arr)
          _this.$emit('addValid', true)
        } else { // 取消全选
          _this.linkersc = ''
        }
        _this.linkerAll = !_this.linkerAll
        // this.$store.commit('DEVELOP_SENDINFO', { second: this.linkersChosen })
        this.$store.commit('DEVELOP_SENDINFO', {second: {contactsIds: this.linkersChosen, contactsGroupIds: this.groupsChosen}})
      },
      /**
       * 分组全选
       */
      choseAllg () {
        if (this.groups.length < 1) {
          return
        }
        if (!this.groupAll) { // 全选
          this.groupsChosen = []
          for (let i = 0, len = this.groups.length; i < len; i++) {
            this.groups[i].selected = true
            this.groupsChosen.push(this.groups[i])
          }
        } else { // 取消全选
          for (let i = 0, len = this.groups.length; i < len; i++) {
            delete this.groups[i].selected
          }
          this.groupsChosen = []
        }
        this.groupAll = !this.groupAll
        this.choseComm()
      },
      /**
       * 选中联系人数量
       */
      getLinkerNum () {
        let second = this.sendInfo.second
        let contact = second.contactsIds
        let contactg = second.contactsGroupIds
        // let contact = this.linkerChosen
        // let contactg = this.groupsChosen
        let arr = []
        let arr2 = []
        if (!(contact && contact.length) && !(contactg && contactg.length)) {
          this.$emit('addValid', false)
        }
        if (contact && contact.length) {
          for (let i = 0, len = contact.length; i < len; i++) {
            arr.push(contact[i].personId)
          }
        }
        if (contactg && contactg.length) {
          for (let i = 0, len = contactg.length; i < len; i++) {
            arr2.push(contactg[i].groupId)
          }
        }
        emailmApi.getLinkerNum({contactsIds: arr.join(';'), contactsGroupIds: arr2.join(';')}).then(res => {
          if (!res.data.code) {
            this.allLinkerNum = res.data.data
            window.localStorage.recipercount = this.allLinkerNum
            if (this.oneCount < this.allLinkerNum) {
              this.$message.error('收件人不可超过' + this.oneCount)
              this.$emit('addValid', false)
            } else {
              this.$emit('addValid', true)
            }
          }
        })
      },
      /**
       * 查看权限
       */
      viewRight () {
        return Util.hasRightByCode('DAA')
      },
      /**
       * 去详情
       */
      showDetail (row) {
        // 无权限不跳转
        if (!this.viewRight()) {
          return
        }
        window.open('/#/contactDetail?contactId=' + row.personId + '&contactType=0')
      },
      notNull (val) {
        return val || ''
      },
      // 选中的加selected
      doSelect (id) {
        for (let i = 0, len = this.groups.length; i < len; i++) {
          if (id === this.groups[i].groupId) {
            this.groups[i].selected = true
          }
        }
      },
      // 下拉刷新
      scrollFresh () {
        console.log(9999)
        // let _this = this
        let scrollBox = document.getElementById('scroll-box')
        scrollBox.onscroll = function () {
          let scrop = scrollBox.scrollTop || 0
          let scroch = scrollBox.clientHeight || 0
          let scroh = scrollBox.scrollHeight || 0
          if (scrop + scroch >= scroh) {
            if (this.timer) {
              clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
              // 接口没有在pending
              if (!this.loading) {
                if (this.choseType === 1 && this.noMore !== 'linknoMore') {
                  this.linkPage++
                  this.getLinkers()
                }
                // if (this.choseType === 0 && this.noMore !== 'groupnoMore') {
                //   this.groupPage++
                //   this.getGroups()
                // } else if (this.choseType === 1 && this.noMore !== 'linknoMore') {
                //   this.linkPage++
                //   this.getLinkers()
                // }
              } else {
                return
              }
            }, 100)
          }
        }.bind(this)
      }
    },
    components: {
    },
    beforeDestroy () {
      // document.getElementById('scroll-box').onscroll = function () {}
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.emailmRecip-container{
  margin: 0 auto;
  height: 530px;
  width: 1040px;
  .loading{
    margin: 150px auto;
  }
  .load-no-first{
    margin: 10px auto;
  }
}
.emailmRecip-choose, .emailmRecip-chosen{
  display: inline-block;
  height: 100%;
  padding: 30px;
  padding-top: 0;
  background: white;
  box-shadow: 0 0 8px rgba(0,0,0,.08);
  border-radius: 4px;
  vertical-align: top;
}
.emailmRecip-choose{
  margin-right: 27px;
  width: 549px;
  // padding: 31px 28px 28px 29px;
  .recip-tit{
    // height: 50px;
    padding-left: 30px;
    margin: 0 -30px 15px -30px;
    font-size: 18px;
    font-weight: bold;
    background-color: #F5F8FA;
    a{
      display: inline-block;
      margin-right: 40px;
      height: 48px;
      line-height: 48px;
      color: #33475B;
    }
    .curr{
      border-bottom: 4px solid #5488F9;
    }
    i{
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .search-text{
    .el-input-group__append{
      padding: 0 5px;
      .el-button{
        margin: -5px;
        padding: 10px;
      }
      .el-input__inner{
        height: 34px;
      }
    }
  }
}
.text-ellipsis() {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.scroll-box{
  margin-top: 14px;
  margin-right: -8px;
  padding-right: 3px;
  height: 432px;
  overflow-y: auto;
  overflow-x: hidden;
}
.emailmRecip-chosen{
  width: 340px;
  .recip-tit{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #CBD6E3;
  }
  .el-collapse{
    margin-top: 14px;
    margin-right: -14px;
    // height: 400px;
    border: 0;
    // overflow-y: auto;
    .tit{
      color: #7C98B6;
    }
    .icon-sendrate{
      margin: 0 7px 0 -14px;
      color: #00B8CC;
    }
  }
  .el-collapse-item__header{
    position: relative;
    height: 24px;
    line-height: 24px;
    border-bottom: 0;
    letter-spacing: -1px;
  }
  .el-collapse-item__wrap{
    border-bottom: 0;
  }
  .el-icon-arrow-right{
    position: absolute;
    right: 6px;
    top: 4px;
    color: #00B8CC;
    font-weight: bold;
  }
  .recip-num{
    position: relative;
    padding-top: 20px;
    font-size: 18px;
    font-weight: bold;
    border-top: 1px solid rgb(223, 226, 236);
    border-bottom: 0;
    em{
      position: absolute;
      right: 3px;
      top: 21px;
      color: #7C98B6;
      font-size: 13px;
      font-weight: normal;
    }
  }
}
// .recip-tit{
//   font-size: 20px;
//   font-weight: bold;
// }
.emailmResult-list{
  // margin-top: 14px;
  border: 1px solid #CBD6E3;
  border-bottom: 0;
  li{
    height: 43px;
    line-height: 43px;
    font-size: 12px;
    border-bottom: 1px solid #CBD6E3;
    .first-text,.sec-text, .three-text{
      display: inline-block;
      color: #5488F9;
    }
    .el-button{
      width: 80px;
      padding: 6px 15px;
    }
    .icon-sendrate{
      display: none;
      color: #00B8CC;
    }
  }
  li:hover{
    background: #F5F8FA;
    .first-text,.sec-text{
      color: #4F6D95;
    }
  }
  .selected{
    background: #F5F8FA;
    .el-button{
      display: none;
    }
    i{
      display: block;
    }
    .first-text,.sec-text{
      color: #4F6D95;
    }
  }
  .tit{
    background: #F5F8FA;
    .first-text,.sec-text{
      color: #4F6D95;
    }
  }
  .first-text{
    padding-left: 20px;
    width: 196px;
    .text-ellipsis()
  }
  .sec-text, .three-text{
    width: 80px;
    text-align: center;
    vertical-align: top;
  }
  // .first-text{
  //   overflow: hidden;
  // }
  .three-text{
    padding-left: 10px;
    width: 206px;
    text-align: left;
  }
  .el-button.btn-cancel{
    display: none;
    padding: 6px 12px;
    color: #bec2d4;
    border: 1px solid #dfe3eb;
    background-color: #eaf0f6;
    &:hover{
      background-color: #fff;
    }
  }
  .el-button + .el-button{
    margin-left: 0;
  }
  .selected{
    .el-button--primary{
      display: none;
    }
    .btn-cancel{
      display: inline-block;
    }
    i{
      display: block;
    }
    .first-text,.sec-text{
      color: #4F6D95;
    }
  }
}
.emailmResult-group{
  .first-text{
    overflow: inherit;
    span{
      display: inline-block;
      max-width: 80%;
      .text-ellipsis()
    }
    em{
      vertical-align: top;
    }
  }
}
.chosen-list{
  li{
    position: relative;
    height: 24px;
    line-height: 24px;
    color: #4F6D95;
    span{
      display: inline-block;
      width: 95%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    .icon-remove2{
      position: absolute;
      right: -1px;
      top: 0;
      font-size: 12px;
      color: #CBD6E3;
    }
    .icon-sendrate{
      display: inline-block;
      margin-top: 2px;
      color: #00B8CC;
      vertical-align: top;
    }
  }
  // .tit{
  //   height: 50px;
  //   line-height: 50px;
  //   color: #7C98B6;
  // }
}
.chosen-group{
  li{
    span{
      width: 92%;
      color: #7C98B6;
    }
  }
}
.no-data.no-more{
  padding-top: 10px;
}
// .emailm-nodata{
//   .img{
//     width: 149px;
//     height: 153px;
//     background-size: 149px 153px;
//     background-image: url('../../../assets/img/monitor/noData.png');
//   }
// }
</style>
