<template>
  <div class="records">
    <div class="time-line">
      <ul class="record">
        <el-select
          @change="onChangeTimeLineFilter"
          :placeholder="'筛选('+checkedConditions.length +'/'+recordFiltersByAuth.length+')'" class="record-filters">
          <div class="condition-wrap">
            <el-checkbox class="condition-item"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 14px 0 5px 0;border-bottom:1px solid #EAF0F6;"></div>
            <el-checkbox-group v-model="checkedConditions" @change="handleCheckedCitiesChange">
              <!-- 联系人不显示海关 -->
              <!-- 公司 不包含询盘 -->
              <!-- 公司不显示 询盘 合并记录 -->
              <!-- serverLevel 为0 不显示海关 -->
              <!-- 0 1 2 只在 serverLevel为1的时候可见 -->
              <el-checkbox
              class="condition-item"
              v-for="item in recordFiltersByAuth"
              :key="item.value"
              :label="item">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-option style="display:none;" value=""></el-option>
        </el-select>
        <div v-for="(timeRecord,tindex) in timeLine">
          <li class="top-time">
            <div>
              <p>{{timeMap[timeRecord.month]}}月&nbsp;&nbsp;{{timeRecord.year}}年 </p>
            </div>
          </li>
          <div v-for="(record,index) in timeRecord.container" :key="record">
              <component
              :is="itemList[record.socialType]"
              :data="Object.assign({}, record, {avatarUrl: myInfo.sysAvatarUrl, twAvatarUrl: myInfo.twAvatarUrl, accInfo: userInfoMap[record.socialContent.operUserId||record.userId], compAvatar: compAvatar, linkAvatar: linkAvatar, userInfoMap: userInfoMap})"
              ></component>
          </div>
        </div>
        <div v-if="!timeLine.length&&!recordLoading" style="padding-top:100px;">
          <div>
            <span class="nodata-add">
              <i class="icon-font icon-add"></i>
            </span>
            <p class="none-records">暂无任何信息</p>
          </div>
        </div>
      </ul>
    </div>
    <div class="loading loading-circle" v-if="recordLoading"></div>
  </div>
</template>

<script>
  import contactInfoApi from '@/api/contactInfoApi'
  // // 追踪邮件的状态
  // import mailStateItem from './recordsItem/mailStateItem'
  // import socialChatItemBox from './recordsItem/socialChatItemBox'
  // // 询盘信息Item
  // import enquiryDetailItem from './recordsItem/enquiryDetailItem'
  // // 备注联系人
  // import remarkContactItem from './recordsItem/remarkContactItem'
  // // 联系人合并item
  // import merageContactItem from './recordsItem/merageContactItem'
  // // 联系人阶段变更
  // import stateChangeItem from './recordsItem/stateChangeItem'
  // // 系统信息，联系人被创建
  // import sysInfoItemBox from './recordsItem/sysInfoItemBox'
  // // 海关信息item
  // import customInfoItem from './recordsItem/customInfoItem'
  // // 引入收发邮件的itemBox
  // import mailItemBox from './recordsItem/mailItemBox'
  // // 联系人信息补全完成
  // import contactAddDoneItem from './recordsItem/contactAddDoneItem'
  // // 联系人信息待补全
  // import contactInfoAddItem from './recordsItem/contactInfoAddItem'
  // // 买家动态item
  // import buyerInfoItem from './recordsItem/buyerInfoItem'
  // // 引入询盘模块item
  // import enquiryCreateItem from './recordsItem/enquiryCreateItem'
  // // 分配联系人/公司item
  // import distrItem from './recordsItem/distrItem'
  // // 主账号 修改联系人/公司item
  // import modifyItem from './recordsItem/modifyItem'
  import compAvatar from '@/assets/img/default_comp.png'
  import linkAvatar from '@/assets/img/default_avatar.png'
  export default{
    data () {
      return {
        itemList: [
          'mailStateItem',
          'mailItemBox',
          'socialChatItemBox',
          'enquiryDetailItem',
          'remarkContactItem',
          'merageContactItem',
          'stateChangeItem',
          'sysInfoItemBox',
          'customInfoItem',
          'contactInfoAddItem',
          'contactAddDoneItem',
          'buyerInfoItem',
          'distrItem',
          'modifyItem'
        ],
        timeLineByTime: [],
        serverLevel: '1',
        contactType: 0,
        /**
         * 选择条件
         * @type {Array}
         */
        checkedConditions: [],
        checkAll: true,
        remark: '',
        // showOperate: '',
        showDetail: false,
        showDetailArray: [],
        editors: [],
        recordFilters: [{
          label: '邮件追踪记录',
          value: '0'
        }, {
          label: '社交信息',
          value: '2'
        }, {
          label: '备注',
          value: '4'
        }, {
          label: '邮件收发记录',
          value: '1'
        }, {
          label: '阶段变更',
          value: '6'
        }, {
          label: '系统信息',
          value: '7'
        }, {
          label: '海关信息',
          value: '8'
        }, {
          label: '询盘信息',
          value: '3'
        }, {
          label: '消息补全',
          value: '100'    // 消息补全包括9，10
        }, {
          label: '访问记录',
          value: '11'    // 消息补全包括9，10
        }, {
          label: '分配记录',
          value: '12'
        }, {
          label: '修改详情记录',
          value: '13'
        }],
        // , {
        //   label: '修改详情记录',
        //   value: '13'
        // }
        timeMap: {1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九', 10: '十', 11: '十一', 12: '十二'},
        myInfo: {},
        dataUpdataIsmore: false,
        footprintDetailObj: {
          pv: '',
          uvTime: '',
          referrerVo: {},
          landUrlVo: [],
          productPageList: {}
        },
        footprintDetailisLoad: false,
        linkAvatar: linkAvatar,
        compAvatar: compAvatar
      }
    },
    beforeDestroy () {
      window.onscroll = function () {}
    },
    created () {
      this.$store.dispatch('getUserMap')
    },
    mounted () {
      this.contactType = parseInt(this.$route.query.contactType)
      this.serverLevel = window.localStorage.serverLevel
      this.checkedConditions = this.recordFiltersByAuth
      contactInfoApi.getAdv().then((res) => {
        this.myInfo = res.data.data
      })
      window.onscroll = function () {
        if (this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            console.log('进来1')
            // 接口没有在pending
            if (!this.recordLoading) {
              this.appendTimeline()
            } else {
              return
            }
          }, 100)
        }
      }.bind(this)
    },
    methods: {
      /**
       * 时间线 翻页
       * @return {[type]} [description]
       */
      appendTimeline () {
        let contactId = this.$route.query.contactId
        let socialTypeArray = []
        for (let checkItem of this.checkedConditions) {
          if (checkItem.value === '100') {
            socialTypeArray.push('9')
            socialTypeArray.push('10')
          } else {
            socialTypeArray.push(checkItem.value)
          }
        }
        if (socialTypeArray.length === 0) {
          this.$store.dispatch('appendTimeLine', {contactId: contactId, socialType: '-1'})
        } else {
          this.$store.dispatch('appendTimeLine', {contactId: contactId, socialType: socialTypeArray.join(';')})
        }
      },
      /**
       * 根据筛选条件请求数据
       * @return {[type]} [description]
       */
      getTimeLine () {
        let contactId = this.$route.query.contactId
        let socialTypeArray = []
        for (let checkItem of this.checkedConditions) {
          if (checkItem.value === '100') {
            socialTypeArray.push('9')
            socialTypeArray.push('10')
          } else {
            socialTypeArray.push(checkItem.value)
          }
        }
        if (socialTypeArray.length === 0) {
          this.$store.dispatch('getTimeLine', {contactId: contactId, socialType: '-1'})
        } else {
          this.$store.dispatch('getTimeLine', {contactId: contactId, socialType: socialTypeArray.join(';')})
        }
      },
      /**
       * 全选按钮
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      handleCheckAllChange (event) {
        this.checkedConditions = event.target.checked ? this.recordFiltersByAuth : []
        this.getTimeLine()
      },
      /**
       * 点击 单个筛选框框
       * @return {[type]} [description]
       */
      handleCheckedCitiesChange () {
        /**
         * 判断 全选状态
         * @type {[type]}
         */
        this.checkAll = this.checkedConditions.length === this.recordFiltersByAuth.length
        let contactId = this.$route.query.contactId
        if (this.checkAll) {
          this.$store.dispatch('getTimeLine', {contactId: contactId, socialType: '0;2;4;1;6;7;3;11;12;13'})
        } else {
          this.getTimeLine()
        }
      },
      /**
       * 改变筛选框框
       * @param  {[type]} v [description]
       * @return {[type]}   [description]
       */
      onChangeTimeLineFilter (v) {
        console.log('选择器改变' + v)
        let contactId = this.$route.query.contactId
        if (v === 'all') {
          this.$store.dispatch('getTimeLine', {contactId: contactId})
        } else {
          this.$store.dispatch('getTimeLine', {contactId: contactId, socialType: v})
        }
      },
      // 获取滚动条当前的位置
      getScrollTop () {
        let scrollTop = 0
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop
        } else if (document.body) {
          scrollTop = document.body.scrollTop
        }
        return scrollTop
      },
      // 获取当前可是范围的高度
      getClientHeight () {
        let clientHeight = 0
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
        } else {
          clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        }
        return clientHeight
      },
      // 获取文档完整的高度
      getScrollHeight () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
      }
    },
    computed: {
      /**
       * 筛选框 ，可选项总数
       *  <!-- 联系人不显示海关 -->
        <!-- 公司 不包含询盘 -->
        <!-- 公司不显示 询盘 合并记录 -->
        <!-- serverLevel 为0 不显示海关 -->
        <!-- 0 1 2 只在 serverLevel为1的时候可见 -->
       <!-- 消息补全 公司显示 联系人不展示 -->
       * @return {[type]} [description]
       */
      recordFiltersByAuth () {
        // (serverLevel==='1'||(item.value!=='0'&&item.value!=='1'&&item.value!=='2')&&(serverLevel!=='0'||item.value!=='8')) && (contactType!=='1'||(item.value!=='3'&&item.value!=='5')) && (contactType!=='0'||item.value!=='8')&& (contactType!=='1'||item.value!=='3')
        let recordFiltersByAuthControl = []
        for (let item of this.recordFilters) {
          if ((this.serverLevel === '1' || (item.value !== '0' && item.value !== '1' && item.value !== '2') && (this.serverLevel !== '0' || item.value !== '8')) && (this.contactType !== 1 || (item.value !== '3' && item.value !== '5' && item.value !== '11')) && (this.contactType !== 0 || (item.value !== '8' && item.value !== '100')) && (this.contactType !== 1 || item.value !== '3' || item.value !== '11')) {
            recordFiltersByAuthControl.push(item)
          }
        }
        return recordFiltersByAuthControl
      },
      timeLine () {
        this.timeLineByTime = []
        this.editors = []
        this.showDetailArray = []
        this.$store.getters.timeLine.forEach((record, i) => {
          {
            let initArray = []
            let editorsByMonth = []
            let showDetailArrayByMonth = []
            let year = (new Date(record.createTime)).getFullYear()
            let month = (new Date(record.createTime)).getMonth() + 1
            if (i === 0) {
              initArray.push(record)
              this.timeLineByTime.push({
                month: month,
                year: year,
                container: initArray
              })
              /**
               * 编辑按钮 仿timeline 初始化
               * @type {Boolean}
               */
              editorsByMonth.push({
                show: false,
                content: ''
              })
              this.editors.push({
                month: month,
                year: year,
                container: editorsByMonth
              })
              /**
               *  回复 状态数组
               * @type {Boolean}
               */
              showDetailArrayByMonth.push({
                show: false,
                showOperate: '',
                zanState: 0,
                // 推特聊天回复内容
                twChatContent: '',
                /**
                 * 推特回复内容
                 * @type {String}
                 */
                twContent: '@' + (record.socialContent.bindingAccount === record.socialContent.receiverId ? record.socialContent.senderAccountName : record.socialContent.receiverAccountName) + ' ',
                /**
                 * 推特转发内容
                 * @type {String}
                 */
                reTwContent: ''
              })
              this.showDetailArray.push({
                month: month,
                year: year,
                container: showDetailArrayByMonth
              })
            } else {
              this.timeLineByTime.forEach((timeRecord, j) => {
                if (i && timeRecord.year === year && timeRecord.month === month) {
                  timeRecord.container.push(record)
                } else if (j === (this.timeLineByTime.length - 1)) {
                  initArray.push(record)
                  this.timeLineByTime.push({
                    month: month,
                    year: year,
                    container: initArray
                  })
                }
              })
              /**
               * 遍历editor
               * @param  {[type]} (timeRecord [description]
               * @return {[type]}             [description]
               */
              this.editors.forEach((editorRecord, j) => {
                if (i && editorRecord.year === year && editorRecord.month === month) {
                  editorRecord.container.push({
                    show: false,
                    content: ''
                  })
                } else if (j === (this.editors.length - 1)) {
                  editorsByMonth.push({
                    show: false,
                    content: ''
                  })
                  this.editors.push({
                    month: month,
                    year: year,
                    container: editorsByMonth
                  })
                }
              })
              /**
               * 回复 状态数组
               * @param  {[type]} (editorRecord [description]
               * @return {[type]}               [description]
               */
              this.showDetailArray.forEach((item, j) => {
                if (i && item.year === year && item.month === month) {
                  item.container.push({
                    show: false,
                    showOperate: '',
                    // 推特聊天回复内容
                    twChatContent: '',
                    /**
                     * 推特回复内容
                     * @type {String}
                     */
                    twContent: '@' + (record.socialContent.bindingAccount === record.socialContent.receiverId ? record.socialContent.senderAccountName : record.socialContent.receiverAccountName) + ' ',
                    /**
                     * 推特转发内容
                     * @type {String}
                     */
                    reTwContent: ''
                  })
                } else if (j === (this.showDetailArray.length - 1)) {
                  showDetailArrayByMonth.push({
                    show: false,
                    zanState: 0,
                    showOperate: '',
                    // 推特聊天回复内容
                    twChatContent: '',
                    /**
                     * 推特回复内容
                     * @type {String}
                     */
                    twContent: '@' + (record.socialContent.bindingAccount === record.socialContent.receiverId ? record.socialContent.senderAccountName : record.socialContent.receiverAccountName) + ' ',
                    /**
                     * 推特转发内容
                     * @type {String}
                     */
                    reTwContent: ''
                  })
                  this.showDetailArray.push({
                    month: month,
                    year: year,
                    container: showDetailArrayByMonth
                  })
                }
              })
            }
          }
        })
        return this.timeLineByTime
      },
      recordLoading () {
        return this.$store.getters.recordLoading
      },
      // 账号id对应的信息
      userInfoMap () {
        return this.$store.getters.userInfoMap
      }
    },

    components: {
      mailStateItem: () => import('./recordsItem/mailStateItem'),
      socialChatItemBox: () => import('./recordsItem/socialChatItemBox'),
      enquiryDetailItem: () => import('./recordsItem/enquiryDetailItem'),
      remarkContactItem: () => import('./recordsItem/remarkContactItem'),
      merageContactItem: () => import('./recordsItem/merageContactItem'),
      stateChangeItem: () => import('./recordsItem/stateChangeItem'),
      sysInfoItemBox: () => import('./recordsItem/sysInfoItemBox'),
      customInfoItem: () => import('./recordsItem/customInfoItem'),
      mailItemBox: () => import('./recordsItem/mailItemBox'),
      contactAddDoneItem: () => import('./recordsItem/contactAddDoneItem'),
      contactInfoAddItem: () => import('./recordsItem/contactInfoAddItem'),
      buyerInfoItem: () => import('./recordsItem/buyerInfoItem'),
      enquiryCreateItem: () => import('./recordsItem/enquiryCreateItem'),
      distrItem: () => import('./recordsItem/distrItem'),
      modifyItem: () => import('./recordsItem/modifyItem')
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/variable";
  @import "../../../../assets/style/timeline";
  .condition-item{
    width:110px;
    color:#33475B;
  }
  .condition-wrap{
    width:380px;
    height: 163px;
  }
   .record-filters{
      .el-input{
        width: 140px;
      }
    }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .describe{
    word-wrap: break-word;
  }
  .condition-item{
    margin-left:15px;
    margin-top:15px;
  }
  .slide-enter-active {
    transition: all .3s ease;
  }
  .slide-enter {
    transform: translateY(-100%);
  }
  .record-operate{
    float: right;
  }
  .records {
    width: 780px;
    .time-line {
      .record {
        margin-left: 30px;
        list-style: none;
        border-left: 1px solid #B0C1D4;
        &>div:last-child{

          &>div:last-child{
            &>li:last-child{
              .record-type{

              }
              &:before{
                content: '';
                position: absolute;
                width:4px;
                height: 100%;
                left:-2px;
                top:30px;
                background: #f0f2f3;
              }
            }

          }
        }
        .record-filters{
          z-index: 99;
          margin-top: 35px;
          float: right;
          ::-webkit-input-placeholder { /* WebKit browsers */
            color: red!important;
          }
          ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #cbd6e2!important;
          }
        }
        .top-time {
          margin-bottom: 0;
          background: #f0f2f3;
          padding-bottom: 15px;
          padding-top: 34px;
          div {
            height: 40px;
            margin-left: 40px;
            p {
              line-height: 40px;
              display: inline-block;
              font-size: 24px;
            }
          }
        }
        .nodata-add{
          position: relative;
          top: 30px;
          left: -15px;
          text-align: center;
          line-height: 30px;
          color: #fff;
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #86abfa;
          box-shadow: 0 2px 6px rgba(84, 136, 249, 0.5);
        }
        .none-records{
          margin-left: 42px;
          font-weight: normal;
        }
      }
    }
  }
</style>
