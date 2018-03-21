<template>
  <div class="emailMarket-container">
    <div class="email-top">
      <div class="inner-top">
        <a href="javascript:;" @click="backToList">
         <span><img src="../../../assets/img/left.png" alt="" class="left-back" /></span>
        返回 邮件推广</a>
      </div>
      <ul class="email-top-menu">
        <li v-for="(menu,index) in menuList" @click="chooseMenu(index)" :class="activeMenu == index?'active':''">
          <span>{{ menu.label }}</span>
        </li>
      </ul>
      <div class="email-group-btn">
        <el-button @click="toPreview" v-if="activeMenu==3&&!isPreview">预览</el-button>
        <el-button @click="quitPreview" v-if="isPreview">退出预览</el-button>
        <el-button @click="saveCurr" v-show="!isPreview" :disabled='saveCurrLoading'>保存草稿并退出</el-button>
        <el-button type="primary" @click="next" v-if="activeMenu<4&&!isPreview">下一步</el-button>
        <el-button type="primary" @click="send" v-if="activeMenu==4&&!isPreview" :disabled="disSendBtn">发送</el-button>
      </div>
    </div>
    <!-- @addToParent="fromAdd" @addToParent="fromRecip"  -->
    <emailMarketAdd v-if="activeMenu == 0&&!isPreview" @changeMenu="chooseMenu"  @addValid="validAdd" @schTime="sendTime"></emailMarketAdd>
    <!--v-show 处理联系人列表问题-->
    <emailMarketRecip v-if="activeMenu == 1&&!isPreview" @addValid="validRecip"></emailMarketRecip>
    <quicklyEmailTmpl
    v-if="activeMenu == 2&&!isPreview"
    :tmplList="tmplList"
    :tmplName="tmplName"
    :tmplId="sendInfo.first.templateId || null"
    :saveChoose="chooseEmailTmpl"
    :tmplType="'emailTmpl'"
    :previewTmpl="previewTmpl"/>
    <editMail v-if="activeMenu == 3&&!isPreview" @openEditor="checkEditorClose" :tmplType="'emailTmpl'"></editMail>
    <previewContent v-if="isPreview" :tmplType="tmplType"></previewContent>
    <checkAndSend v-if="activeMenu == 4" @backCreate="backCreate" @ischeckWrong="checkSendState"></checkAndSend>
    <el-dialog title="发送邮件" v-model="sendBtnActive" class="send-dialog">
      <div class="big-btn-wrapper">
        <div class="send-big-btn" :class="!isTiming?'active':''" @click="sendNowBtn">
          <img v-show="!isTiming" src="../../../assets/img/develop/send-active.png" alt="">
          <img v-show="isTiming" src="../../../assets/img/develop/send.png" alt="">
          <h1>马上发送</h1>
          <p>您的邮件将会被立即发送出去</p>
        </div>
        <div class="send-big-btn" :class="isTiming?'active':''" @click="isTiming=true;showTimeWrapper=true;">
          <img v-show="isTiming" src="../../../assets/img/develop/timing-active.png" alt="">
          <img v-show="!isTiming" src="../../../assets/img/develop/timing.png" alt="">
          <h1>定时发送</h1>
          <p>您的邮件将会在您设置的时间发送出去</p>
        </div>
      </div>
      <div class="time-wrapper" v-show="showTimeWrapper">
        <p class="wrapper-title">请选择定时发送的时间</p>
        <el-date-picker type="date" placeholder="选择日期" v-model="dateVal" :picker-options="pickerOptions" :editable="false"></el-date-picker>
        <el-time-picker
          placeholder="选择时间"
          v-model="timeVal"
          :picker-options="{
            selectableRange: disabledStamp
          }">
          </el-time-picker>
        <el-popover
          ref="timeData"
          placement="bottom-end"
          width="295"
          popper-class="time-popover"
          trigger="hover">
          <el-table :data="gridData" class="time-table">
            <el-table-column width="142" property="location" label="参考时间"></el-table-column>
            <el-table-column width="148" label="">
              <template scope="scope">
                <p v-text="getTimeString(dateVal, timeVal, scope.row.type)"></p>
              </template>
            </el-table-column>
          </el-table>
        </el-popover>
        <el-button v-popover:timeData>参考时间</el-button>
      </div>
      <div v-show="!confirmBtnState">
        <el-button type="primary" @click="confirmSend">确定</el-button>
        <el-button @click="sendBtnActive=false">取消</el-button>
      </div>
      <span class="btn-loaders" v-show="confirmBtnState">
        <div class="loaders">
          <div class="loader">
            <div class="loader-inner ball-pulse-sync">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import emailMarketAdd from './emailMarketAdd.vue'
  import emailMarketRecip from './emailMarketRecip.vue'
  import editMail from './editMail.vue'
  import previewContent from './previewContent.vue'
  import checkAndSend from './checkAndSend.vue'
  import emailmApi from '@/api/emailMarketApi'
  // import emailmApi from '@/api/emailMarketApi'
  import { mapGetters } from 'vuex'
  // 获取各类型 @hansin
  import { getTmplContent, tmplContenToTable } from '@/common/TmplContent'
  // 模板选择 @hansin
  import quicklyEmailTmpl from '../../../components/emailEditorWrapper/emailTmpl'
  import tmplLocalList from '../../../components/emailEditorWrapper/emailTmplFolder'
  export default{
    name: 'emailTopMenu',
    data () {
      return {
        ifCommit: false,
        menuList: [{
          label: '新建'
        },
        {
          label: '收件人选择'
        },
        {
          label: '模版选择'
        },
        {
          label: '内容编辑'
        },
        {
          label: '发送'
        }],
        activeMenu: this.$route.query.activeMenu || 0,
        firstValid: false,
        secValid: false,
        canNext: true, // 是否能点击菜单进入其他步骤
        haveImgEmpty: true,
        isPreview: false,
        // 是否是定时发送邮件
        isTiming: false,
        confirmBtnState: false,
        // 发送按钮是否可点击
        disSendBtn: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        // 定时发送的时间和日期
        dateVal: '',
        timeVal: '',
        schTime: null,
        openEditor: false,
        // 是否显示定时下面的参考时间
        showTimeWrapper: false,
        // 是否点击了发送按钮
        sendBtnActive: false,
        sendData: {}, // 到最后一步发送的 所有内容
        saveCurrLoading: false,
        disabledStamp: '',
        gridData: [
          {
            location: '(中国)北京',
            type: 8
          }, {
            location: '(美国)旧金山',
            type: -8
          }, {
            location: '(墨西哥)墨西哥城',
            type: -6
          }, {
            location: '(美国)纽约',
            type: -5
          }, {
            location: '(巴拿马)巴拿马城',
            type: -5
          }, {
            location: '(加拿大)蒙特利尔',
            type: -5
          }, {
            location: '(古巴)哈瓦那',
            type: -5
          }, {
            location: '(英国)伦敦',
            type: 0
          }, {
            location: '(法国)巴黎',
            type: 1
          }, {
            location: '(德国)柏林',
            type: 1
          }, {
            location: '(意大利)罗马',
            type: 1
          }, {
            location: '(波兰)华沙',
            type: 1
          }, {
            location: '(瑞士)日内瓦',
            type: 1
          }, {
            location: '(捷克)布拉格',
            type: 1
          }, {
            location: '(匈牙利)布达佩斯',
            type: 1
          }, {
            location: '(罗马尼亚)布加勒斯特',
            type: 2
          }, {
            location: '(埃及)开罗',
            type: 2
          }, {
            location: '(俄罗斯)莫斯科',
            type: 3
          }, {
            location: '(印度)新德里',
            type: 5.5
          }, {
            location: '(斯里兰卡)科伦城',
            type: 5.5
          }, {
            location: '(印尼)雅加达',
            type: 7
          }, {
            location: '(新加坡)新加坡',
            type: 8
          }, {
            location: '(马拉西亚)吉隆坡',
            type: 8
          }, {
            location: '(菲律宾)马尼拉',
            type: 8
          }, {
            location: '(朝鲜)平壤',
            type: 9
          }, {
            location: '(日本)东京',
            type: 9
          }, {
            location: '(澳大利亚)悉尼',
            type: 11
          }
        ],
        mailLayout: [],
        tmplType: 'emailTmpl',
        tmplName: '',
        tmplList: null,
        clickedIndex: 0
      }
    },
    computed: {
      ...mapGetters({
        sendInfo: 'sendInfo',
        ismDirty: 'ismDirty',
        contentArr: 'emailContentList'
      })
    },
    watch: {
      schTime (newVal, oldVal) {
        let isEdit = this.$route.query.id
        if (isEdit && this.schTime) {
          let date = new Date(parseInt(this.schTime))
          let year = date.getFullYear()
          let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
          let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
          this.dateVal = `${year}-${month}-${day}`
          this.timeVal = date
        }
      },
      dateVal (newVal, oldVal) {
        let val = new Date(newVal)
        let dayVal = `${val.getFullYear()}-${(val.getMonth() < 9 ? '0' : '') + (val.getMonth() + 1)}-${(val.getDate() < 10 ? '0' : '') + val.getDate()}`
        let today = new Date()
        let todayVal = `${today.getFullYear()}-${(today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1)}-${(today.getDate() < 10 ? '0' : '') + today.getDate()}`
        if (dayVal !== todayVal) {
          this.disabledStamp = '00:00:00 - 23:59:59'
        } else {
          this.disabledStamp = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - 23:59:59`
        }
      }
    },
    mounted () {
      window.onbeforeunload = function (e) {
        var dialogText = '系统可能不会保存您所做的更改, 是否继续?'
        e.returnValue = dialogText
        return dialogText
      }
      let today = new Date()
      this.disabledStamp = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} - 23:59:59`
      this.isTiming = false
      this.$store.commit('DEVELOP_ISTIMING', '')
      this.getEmailTmpl()
    },
    beforeDestroy () {
      /**
       * 注销刷新页面时候的提示
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      window.onbeforeunload = function (e) {
      }
    },
    methods: {
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
      getEmailTmpl () {
        if (this.tmplList && this.tmplList.length) return
        emailmApi.searchTemplateList().then((res) => {
          if (res && res.data.code === 0) {
            let list = res.data.data
            list.forEach((n) => {
              n.templateContent = JSON.parse(n.templateContent)
            })
            // 调用接口
            this.tmplList = [].concat(list).concat(tmplLocalList[0])
          }
        })
        // 本地调试
        // this.tmplList = tmplLocalList
      },
      chooseEmailTmpl (item, notAddMenu) {
        let tmplId = this.sendInfo.first.templateId || null
        if (tmplId !== item.id) {
          tmplId = item.id
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
          this.$store.commit('DEVELOP_EMAILCONTENTLIST', JSON.stringify(this.mailLayout))
          let firstobj = Object.assign(this.$store.getters.sendInfo.first, {templateId: item.id})
          this.$store.commit('DEVELOP_SENDINFO', {first: firstobj})
        }
        if (!notAddMenu) {
          this.next()
        }
      },
      getEmailInfo () {
        // 此处逻辑迁移到emailMarketAdd.vue
        let isEdit = this.$route.query.id
        emailmApi.getMarketDetail({mailMarketingId: isEdit}).then(res => {
          if (!res.data.code) {
            let editData = res.data.data
            // 编辑页面都不要second
            // {contactsIds: editData.receivers, contactsGroupIds: editData.groupReceivers}
            this.$store.commit('DEVELOP_SENDINFO', {first: editData, second: {}, third: editData.content, four: {}})
            this.$store.commit('DEVELOP_EMAILCONTENTLIST', editData.contentArr)
            this.$emit('addValid', true)
            this.$emit('schTime', res.data.data.scheduleTime)
          }
        })
      },
      /**
       * 菜单选择
       */
      chooseMenu (index) {
        let emailContentList = this.$store.state.develop.emailContentList
        if (this.isPreview) {
          this.isPreview = false
          this.tmplType = 'emailTmpl'
          // return
        }
        if (index < this.activeMenu) {
          this.activeMenu = index
          this.$store.commit('DEVELOP_ISMENUCLICK', true)
        } else if (index === (this.activeMenu + 1)) {
          this.next()
        } else if (index === 3 && emailContentList) {
          this.activeMenu = index
        } else {
          this.next(true)
          if (!this.canNext) {
            return
          }
          let arr = ['first', 'second', 'third']
          if (index < 4) {
            if (index === 2) { // 联系人列表
              let contact = this.sendInfo['second'].contactsIds
              let contactg = this.sendInfo['second'].contactsGroupIds
              if ((contact && contact.length) || (contactg && contactg.length)) {
                this.activeMenu = index
                this.$store.commit('DEVELOP_ISMENUCLICK', true)
              }
            } else {
              // 有填写的内容才跳转
              if (this.sendInfo[arr[index]] && JSON.stringify(this.sendInfo[arr[index]]) !== '{}') {
                this.activeMenu = index
                this.$store.commit('DEVELOP_ISMENUCLICK', true)
              }
            }
          } else { // 如果想跳到第四步，只要第三步填内容了就行
            if (this.sendInfo['third'] && JSON.stringify(this.sendInfo['third']) !== '{}') {
              this.$store.commit('DEVELOP_ISMENUCLICK', true)
            }
            if (emailContentList.indexOf('https://qiniu.onloon.co/maildefault.png') > 0) {
              this.$message.error('请确保所有图片已上传')
              return
            } else if (this.openEditor === true) {
              this.$message.error('请确保所有内容已保存')
              return
            }
            this.activeMenu = index
          }
        }
      },
      backToList () {
        this.clearForm()
        this.$store.commit('DEVELOP_ISMENUCLICK', false)
        this.$router.push({path: '/emailmarketing'})
      },
      /**
       * 保存并退出
       */
      saveCurr () {
        this.ifCommit = true
        this.saveCurrLoading = true
        let params = {}
        // 保存第一步
        if (this.sendInfo['first'] && !this.sendInfo['first'].title) {
          this.sendInfo['first'].title = '邮件营销'
        }
        Object.assign(params, this.sendInfo['first'])
        // 保存第二步
        // if (this.sendInfo['second'] && this.sendInfo['second'].length) {
        //   Object.assign(params, {receivers: JSON.stringify(this.sendInfo['second'])})
        // }
        Object.assign(params, this.dealSecond(params))
        // 保存第三步
        Object.assign(params, {
          // sender: JSON.parse(localStorage.user).loginAccount,
          content: this.sendInfo['third'],
          contentArr: this.contentArr,
          templateId: this.sendInfo['first'].templateId || null
        })
        // 保存第四步
        let isEdit = this.$route.query.id
        let isagain = this.$route.query.activeMenu
        if (isEdit && (isagain === '' || isagain === null || isagain === undefined)) { // 修改到草稿箱
          Object.assign(params, {id: isEdit})
          emailmApi.updateDraft(params).then(res => {
            this.saveCurrLoading = false
            if (!res.data.code) {
              this.$message.success('保存成功')
              this.clearForm()
              this.$router.push({path: '/emailmarketing'})
            } else {
              this.$message.error(res.message)
            }
          })
        } else { // 添加到草稿箱
          emailmApi.addDraft(params).then(res => {
            this.saveCurrLoading = false
            if (!res.data.code) {
              this.$message.success('保存成功')
              this.clearForm()
              this.$router.push({path: '/emailmarketing'})
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      /**
       * 第一步新建输入的数据的验证
       */
      validAdd (data) {
        this.firstValid = data
      },
      /**
       * 第二步选择收件人的数据的验证
       */
      validRecip (data) {
        this.secValid = data
      },
      /**
       * 下一步
       * @param  {[type]}   flag [true:菜单点击, false:下一步点击]
       * @return {Function}      [description]
       */
      next (flag) {
        let emailContentList = this.$store.state.develop.emailContentList
        if (this.activeMenu === 0) {
          if (!this.firstValid) {
            let title = this.sendInfo.first.title
            if (!title || /^\s+$/.test(title)) {
              this.$message.error('请输入邮件推广名称！')
            } else {
              this.$message.error('请输入邮件标题！')
            }
            this.canNext = false
            return
          }
        } else if (this.activeMenu === 1) {
          if (!this.secValid) {
            let second = this.sendInfo.second
            let contact = second.contactsIds
            let contactg = second.contactsGroupIds
            if (!(contact && contact.length) && !(contactg && contactg.length)) {
              this.$message.error('请选择收件人')
            } else {
              this.$message.error('收件人选择过多')
            }
            this.canNext = false
            return
          } else {
            let second = this.sendInfo.second
            let contact = second.contactsIds
            let contactg = second.contactsGroupIds
            if (!(contact && contact.length) && !(contactg && contactg.length)) {
              this.$message.error('请选择收件人')
              this.canNext = false
              return
            }
          }
        } else if (this.activeMenu === 2 && (!emailContentList || !emailContentList.length || emailContentList === '[]')) {
          this.chooseEmailTmpl(this.tmplList[0], true)
        } else if (this.activeMenu === 3) {
          let emailContentList = this.$store.state.develop.emailContentList
          if (emailContentList.indexOf('https://qiniu.onloon.co/maildefault.png') > 0) {
            this.$message.error('请确保所有图片已上传')
            this.canNext = false
            return
          } else if (this.openEditor === true) {
            this.$message.error('请确保所有内容已保存')
            this.canNext = false
            return
          }
        }
        this.canNext = true
        // 菜单点击的只到这一步
        if (flag === true) {
          return
        }
        this.activeMenu++
        this.$store.commit('DEVELOP_ISMENUCLICK', true)
        // this.$store.commit('DEVELOP_SENDINFO', { data: this.sendData })
        // console.log(this.sendData)
      },
      getTimeString (date, time, timezone) {
        let curDate = ''
        let sendDate = ''
        function format (n) {
          if (n < 10) return '0' + n
          return '' + n
        }
        if (date) {
          date = new Date(date)
          let year = date.getFullYear()
          let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
          let day = (date.getDate() < 10 ? '0' : '') + date.getDate()
          curDate = year + '/' + month + '/' + day
          sendDate = year + '/' + month + '/' + day
        }
        if (time) {
          time = new Date(time)
          let hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
          let minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
          let second = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
          curDate += ' ' + hour + ':' + minute + ':' + second
          sendDate += ' ' + hour + ':' + minute
        }
        if (date && time) {
          let formatSendTime = new Date(sendDate)
          this.curSendTime = Date.parse(formatSendTime)
          let formatTime = new Date(curDate)
          let tz = formatTime.getTimezoneOffset()
          let dt = new Date()
          dt.setTime(formatTime.getTime() + tz * 60000 + timezone * 3600000)
          return format(dt.getFullYear()) + '-' + format(dt.getMonth() + 1) + '-' + format(dt.getDate()) + ' ' + format(dt.getHours()) + ':' + format(dt.getMinutes()) + ':' + format(dt.getSeconds())
        }
      },
      checkEditorClose (val) {
        this.openEditor = val
      },
      toPreview () {
        this.tmplType = 'emailTmpl'
        this.isPreview = true
      },
      quitPreview () {
        this.isPreview = false
        this.$store.commit('DEVELOP_ISMENUCLICK', true)
      },
      send () {
        this.sendBtnActive = true
      },
      sendNowBtn () {
        this.isTiming = false
        this.showTimeWrapper = false
        // 点击马上发送的时候清楚定时flag isTiming
        this.$store.commit('DEVELOP_ISTIMING', '')
      },
      sendTime (val) {
        this.schTime = val
      },
      checkSendState (val) {
        this.disSendBtn = !val
      },
      confirmSend () {
        this.ifCommit = true
        let isEdit = this.$route.query.id
        this.confirmBtnState = true
        let params = {}
        if (isEdit) {
          params['id'] = isEdit
        }
        // 保存第一步
        Object.assign(params, this.sendInfo['first'], {scheduleTime: null})
        // 保存第二步
        Object.assign(params, this.dealSecond(params))
        // if (this.sendInfo['second'] && this.sendInfo['second'].length) {
        //   let arr = []
        //   this.sendInfo['second'].forEach((item) => {
        //     arr.push(item)
        //   })
        //   Object.assign(params, {receivers: JSON.stringify(arr)})
        // }
        // 保存第三步
        Object.assign(params, {
          // sender: JSON.parse(localStorage.user).loginAccount,
          content: this.sendInfo['third'],
          contentArr: this.contentArr,
          templateId: this.sendInfo['first'].templateId || null
        })
        // 保存第四步
        // console.log(emailmApi)
        if (this.isTiming) {
          this.$store.commit('DEVELOP_ISTIMING', this.getTimeString(this.dateVal, this.timeVal, 8))
          if (this.dateVal === '') {
            this.$message.error('请选择定时发送的日期')
            this.confirmBtnState = false
            return
          } else if (this.timeVal === '') {
            this.$message.error('请选择定时发送的时间')
            this.confirmBtnState = false
            return
          }
          Object.assign(params, {scheduleTime: this.getTimeString(this.dateVal, this.timeVal, 8)})
        }
        // 判断是否超出了最大条数
        if (parseInt(window.localStorage.total) + parseInt(window.localStorage.recipercount) > parseInt(window.localStorage.max)) {
        // if (parseInt(window.localStorage.total) + this.sendInfo['second'].length > parseInt(window.localStorage.max)) {
          this.$message.error('发送邮件达到上限')
          this.confirmBtnState = false
          this.sendBtnActive = false
          return
        } else {
          // 发送成功页面统计收件人数
          // window.localStorage.recipercount = this.sendInfo['second'].length
          window.localStorage.total = parseInt(window.localStorage.total) + parseInt(window.localStorage.recipercount)
          let isagain = this.$route.query.activeMenu
          if (isEdit && (isagain === '' || isagain === null || isagain === undefined)) {
            // 修改发送
            emailmApi.updateMarketSend(params).then(res => {
              if (res.data.code === 1) {
                this.confirmBtnState = false
                this.sendBtnActive = false
                this.$message.error(res.data.message)
              } else {
                this.confirmBtnState = false
                this.sendBtnActive = false
                this.$router.push({path: '/sendSuccess'})
                this.clearForm()
              }
            })
          } else {
            // 添加发送
            emailmApi.addMarketSend(params).then(res => {
              if (res.data.code === 1) {
                this.confirmBtnState = false
                this.$message.error(res.data.message)
              } else {
                this.confirmBtnState = false
                this.sendBtnActive = false
                this.$router.push({path: '/sendSuccess'})
                this.clearForm()
              }
            })
          }
        }
      },
      // 清空四步数据
      clearForm () {
        this.$store.commit('DEVELOP_SENDINFO', {first: {}, second: {}, third: {}, four: {}})
        this.$store.commit('DEVELOP_EMAILCONTENTLIST', JSON.stringify(this.mailLayout))
      },
      // 处理SENDINFO的second
      dealSecond (params) {
        let second = this.sendInfo['second']
        let contact = second.contactsIds
        let contactg = second.contactsGroupIds
        if (second) {
          let arr = []
          let arr2 = []
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
          Object.assign(params, {contactsIds: arr.join(';'), contactsGroupIds: arr2.join(';')})
        }
        delete params.receivers
        delete params.groupReceivers
        return params
      },
      backCreate (val) {
        this.activeMenu = val
      }
    },
    components: {
      emailMarketAdd,
      emailMarketRecip,
      editMail,
      previewContent,
      checkAndSend,
      quicklyEmailTmpl
    },
    beforeRouteLeave (to, from, next) {
      if (this.ismDirty) {
        if (this.ifCommit) {
          this.$store.commit('DEVELOP_ISMENUCLICK', false)
          this.$store.commit('DEVELOP_SETDIRTY', false)
          next()
        } else {
          this.$confirm('系统可能不会保存您所做的更改, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            document.title = to.name
            this.$store.commit('DEVELOP_ISMENUCLICK', false)
            this.$store.commit('DEVELOP_SENDINFO', {first: {}, second: {}, third: {}, four: {}})
            this.$store.commit('DEVELOP_EMAILCONTENTLIST', JSON.stringify(this.mailLayout))
            this.$store.commit('LINKER_TO_MAIL', {linkerToMail: false})
            if (to.path === '/login') {
              next()
            } else {
              this.$store.commit('DEVELOP_SETDIRTY', false)
              next()
            }
          }).catch(() => {
            next(false)
          })
        }
      } else {
        next()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
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
.emailMarket-container{
  position: relative;
  margin: 20px auto 0;
  width: 1200px;
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
.email-top-menu{
  margin: 10px auto 10px auto;
  width: 430px;
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
.email-group-btn{
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
