<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content">
      <div class="u-right">
        <ul class="channel-item-list">
          <li :class="channelClass(channel.channelId)" class="channel-item" :id="channel.channelId" :data-value="channel.channelId" v-for="(channel,index) in channelList" v-if="channel.channelId!=='MAIL' ||serverLevel !== '0'" :key="channel"><!-- FACEBOOK -->
            <div class="chan-logo">
              <i class="icon-facebook u-logo" v-if="channel.channelId == 'FACEBOOK'"></i>
              <i class="icon-twitter u-logo" v-if="channel.channelId == 'TWITTER'"></i>
              <i class="icon-pinterest u-logo" v-if="channel.channelId == 'PINTEREST'"></i>
              <i class="icon-linkedin u-logo" v-if="channel.channelId == 'LINKEDIN'"></i>
              <i class="icon-email u-logo" v-if="channel.channelId == 'MAIL'"></i>
            </div>
            <div class="channel-desc">
              <div class="channel-type">
                {{ channel.channelId.toLowerCase() }}
              </div>
              <div class="chan-info">
                <p v-if="channel.channelId == 'FACEBOOK'">在全球最大的社交网络进行外贸营销，收获社交询盘。</p>
                <p v-else-if="channel.channelId == 'PINTEREST'">用高质量图片吸引潜在买家,图片营销的最佳去处。</p>
                <p v-else-if="channel.channelId == 'TWITTER'">在最专业的社交平台营销，提升企业形象，吸引高质量客户。</p>
                <p v-else-if="channel.channelId == 'LINKEDIN'">利用一切碎片时间触达潜在客户。</p>
                <p v-else-if="channel.channelId == 'MAIL'">用户是否查收邮箱，随时追踪邮箱状态。</p>
              </div>
            </div>
            <div class="chan-right">
              <!--渠道绑定展示 start-->
              <span class="bind-info-display width160 bindchannel-display" v-if=" channel.bindingTag == 1 && channel.channelId != 'MAIL'" :class="{'yellowbord':(channel.channelId == 'FACEBOOK' || channel.channelId == 'LINKEDIN') && (channel.homePageId == '' || channel.homePageId == null || channel.homePageId == undefined)}">
                <div class="display-image">
                  <img :src="channel.avatar" alt="" v-if="channel.avatar != '' && channel.avatar != null" />
                  <img src="../../assets/img/default_avatar.jpg" alt="" v-else />
                </div>
                <div class="display-desc">
                  <p class="nickname" v-if="channel.channelId.toLowerCase() == 'twitter'">{{ channel.realName}}</p>
                  <p class="nickname" v-else>{{ channel.nickName }}</p>
                  <p class="type" v-if="channel.channelId.toLowerCase() == 'twitter'" :title="channel.provideUserId"><i :class="logoShow(channel.channelId.toLowerCase())"></i>@{{ channel.nickName }}</p>
                  <p class="type" v-else><i :class="logoShow(channel.channelId.toLowerCase())"></i>{{ channel.channelId.toLowerCase() }}</p>
                </div>
                <div class="close" @click="unBundledPop(channel.channelId.toLowerCase(),index,'1')"><i class="icon-remove2"></i></div>
              </span>
              <!--渠道绑定展示 end-->
              <!--邮箱绑定展示 start-->
              <span class="bind-info-display width160 bindchannel-display" v-if=" channel.bindingTag == 1 && channel.channelId == 'MAIL'">
                <div class="display-image">
                  <img :src="channel.avatar" alt="" v-if="channel.avatar != '' && channel.avatar != null" />
                  <img :src="mailType(channel.realName)" alt="" v-else />
                </div>
                <div class="display-desc">
                  <p class="nickname">{{ channel.emailAddress }}</p>
                  <p class="type" v-if="channel.emailAddress.indexOf('gmail.com') > 0"><i></i>Gmail邮箱</p>
                  <p class="type" v-else><i></i>{{channel.realName}}</p>
                </div>
                <div class="close" @click="unBundledPop(channel.channelId.toLowerCase(),index,'1')"><i class="icon-remove2"></i></div>
              </span>
              <!--邮箱绑定展示 end-->
              <!--社交主页绑定展示 start-->
              <span class="bind-info-display width220 bindhome-display" v-if="channel.bindingTag == 1 && (channel.channelId == 'FACEBOOK' || channel.channelId == 'LINKEDIN') && channel.homePageId != '' && channel.homePageId != null && channel.homePageId != undefined">
                <div class="display-image">
                  <img :src="channel.homePageLogUrl" alt="" v-if="channel.homePageLogUrl != '' && channel.homePageLogUrl != null" />
                  <img src="../../assets/img/default_avatar.jpg" alt="" v-else />
                </div>
                <div class="display-desc">
                  <p class="nickname">{{ channel.homePageName }}</p>
                  <p class="type"><i></i>{{ channel.channelId.toLowerCase() }} page</p>
                </div>
                <div class="close"><i class="icon-edit editHomePage" @click="pageHomePopFunc(channel.channelId.toLowerCase(),index)"></i><i class="icon-remove2" @click="unBundledPop(channel.channelId.toLowerCase(),index,'2')"></i></div>
              </span>
              <!--社交主页绑定展示 end-->
              <button type="button" class="btn btn-white width160" v-if=" channel.bindingTag == 1 && channel.channelId == 'FACEBOOK' && (channel.homePageId == '' || channel.homePageId == null || channel.homePageId == undefined)" @click="pageHomePopFunc(channel.channelId.toLowerCase(),index)">绑定Facebook公共主页</button>
              <button type="button" class="btn btn-white width160" v-if=" channel.bindingTag == 1 && channel.channelId == 'LINKEDIN' && (channel.homePageId == '' || channel.homePageId == null || channel.homePageId == undefined)" @click="pageHomePopFunc(channel.channelId.toLowerCase(),index)">绑定Linkedin公司主页</button>
              <button type="button" class="btn btn-yell width120" @click="bindChannel(channel.channelId,index)" v-if="channel.bindingTag == 0 && channel.channelId != 'MAIL'">
               绑定{{ channel.channelId.toLowerCase() }}
              </button>
              <button type="button" class="btn btn-yell width120" @click="bindMailPopFunc" v-if="channel.bindingTag == 0 && channel.channelId == 'MAIL'">
                绑定{{ channel.channelId.toLowerCase() }}
              </button>
            </div>
            <div v-if="channel.channelId == 'FACEBOOK'" class="chan-tips">
              <span class="chan-tips-text" @click="toFbLable">前往添加主页标签</span>
              <el-tooltip class="item" effect="dark" content="在公共主页中添加一个标签页用于产品的展示" placement="top">
                <span class="icon-font chan-tips-icon">&#xe6ed;</span>
              </el-tooltip>
            </div>
          </li>
        </ul>
        <!--解绑确认弹框start-->
        <el-dialog :title="titleDisplay()" size="390px" v-model="unBindPop" custom-class="unBind-confirm" style="text-transform: capitalize;">
            <div class="title-second" v-if="dqchannelType == '1'">您即将解除{{ channelType }}账号绑定，解绑后将会</div>
            <div class="title-second" v-else>您即将解除{{ channelType }}公司主页绑定，解绑后将会</div>
            <ul class="prompt-list" v-if="channelType == 'mail'">
              <li>&bull;&nbsp;无法发送邮件至联系人</li>
              <li>&bull;&nbsp;无法接收联系人邮件</li>
            </ul>
            <ul class="prompt-list" v-else>
              <li>&bull;&nbsp;无法进行{{ channelType }}社交推广</li>
              <li v-if="channelType == 'facebook' || channelType == 'twitter'">&bull;&nbsp;无法进行{{ channelType }}社交监控</li>
              <li v-if="(channelType == 'facebook' || channelType == 'linkedin') && dqchannelType == '1'">&bull;&nbsp;无法进行{{ channelType }}公共主页绑定</li>
            </ul>
          <div slot="footer" class="dialog-footer left-btn">
            <el-button type="primary" @click="unBundledFunc(channelType,channelindex)" v-if="dqchannelType == '1'">解除绑定</el-button>
            <el-button type="primary" @click="unHomepageFunc(channelType,channelindex)" v-else>解除绑定</el-button>
            <el-button @click="unBindPop = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--解绑确认弹框end-->
        <!--绑定邮箱弹框start-->
        <el-dialog title="邮箱绑定（1/2）" size="390px" v-model="bindMailPop" custom-class="bind-Mail">
          <div class="bindEmail-sel">
            <div class="bindEmail-title">请选择需绑定的邮箱</div>
            <template>
              <el-radio-group v-model="bindEmailType">
                <el-radio :label="1"><img src="../../assets/img/system/bindemail_tx.png" alt="" style="height:20px;"/></el-radio>
                <el-radio :label="2"><img src="../../assets/img/system/bindemail_gmail.png" alt="" style="height:24px;" /></el-radio>
                <el-radio :label="3"><img src="../../assets/img/system/bindemail_wy.png" alt="" style="height:25px;" /></el-radio>
                <el-radio :label="4"><img src="../../assets/img/system/bindemail_al.png" alt="" style="height:16px;" /></el-radio>
                <el-radio :label="5"><span class="desc">其他"邮件"账户...</span></el-radio>
              </el-radio-group>
            </template>
          </div>
          <div slot="footer" class="dialog-footer lf-padding10 is-ok">
            <el-button type="primary" @click="bindEmailNextFunc">下一步</el-button>
          </div>
        </el-dialog>
        <el-dialog title="邮箱绑定（2/2）" v-model="bindEmailNext" size="390px" custom-class="bind-Mail">
          <div class="title-second">邮箱</div>
          <div class="input-verification input-verify" :class="{'input-is-danger': emailIsOk == 'error'}">
            <input type="text" placeholder="请输入您的邮箱号" class="input-whole" v-model="email" name="email" v-validate="{ rules: { regex: /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9_.-]{2,4})+$/}}"  :readonly="isloadding" @blur="emailValidation" @focus="emailValidationRest"/>
            <div class="input-bottom-remid" :class="{'is-show': emailIsOk == 'error'}"><i class="icon-remind"></i>邮箱格式错误，请重新输入</div>
          </div>
          <div class="title-second">邮箱密码</div>
          <div class="input-verification input-verify" :class="{'input-is-danger': verificationFailure}">
            <input type="password" placeholder="请输入邮箱密码" class="input-whole" v-model="password" />
          </div>
          <div v-if="bindEmailType=='5'">
            <div class="title-second">IMAP服务器</div>
            <div class="second-input">
              <input type="text" placeholder="请输入服务器地址" class="left-input input-text" v-model="imapUrl" />
              <span class="label"><el-checkbox disabled="true" checked="true" style="margin-right:5px;"></el-checkbox>SSL&nbsp;:</span>
              <input type="text" placeholder="端口" class="right-input input-text" v-model="imapPort" maxlength="4" />
            </div>
            <div class="title-second">SMTP服务器</div>
            <div class="second-input">
              <input type="text" placeholder="请输入服务器地址" class="left-input input-text" v-model="smtpUrl" />
              <span class="label"><el-checkbox disabled="true" checked="true" style="margin-right:5px;"></el-checkbox>SSL&nbsp;:</span>
              <input type="text" placeholder="端口" class="right-input input-text" v-model="smtpPort" maxlength="4" />
            </div>
          </div>
          <div class="caveat-module" v-if="verificationFailure">
            <p>
              <i class="icon-font icon-remind"></i>绑定邮箱失败，可能是
              <ul class="error-list">
                  <li>&bull;&nbsp;邮箱地址或密码错误</li>
                  <li>&bull;&nbsp;邮件IMAP服务未开启</li>
              </ul>
            </p>
          </div>
          <div class="steps-prompt" v-if="bindEmailType!='5'">
            <p class="steps-label">请完成以下步骤</p>
            <p class="steps-desc">&bull;&nbsp;开启IMAP / SMTPF服务</p>
            <p class="steps-desc">&bull;&nbsp;开启POP / SMTP服务</p>
            <p class="steps-desc text_btn"><a href="https://shop.onloon.cc/#/articleDetail/37" target="_blank">点击查看详细设置</a></p>
          </div>
          <div slot="footer" class="dialog-footer lf-padding10" :class="{'is-ok': email != '' && password != '' && emailIsOk == 'ok' && ((bindEmailType=='5' && imapUrl != '' && imapPort != '' && smtpUrl != '' && smtpPort != '') || bindEmailType!='5')}">
            <el-button @click="bindEmailBack" class="left-width120" v-if="!isloadding">上一步</el-button>
            <el-button type="primary" @click="bindEmailFunc()" v-if="!isloadding" class="right-width120">确 定</el-button>
            <div class="loading loading-circle" style="margin-top:0px"v-else></div>
          </div>
        </el-dialog>
        <!--绑定邮箱弹框end-->
        <!-- 渠道选择 start-->
        <el-dialog :title="homePageTitle(channelType)" size="390px" v-model="pageHomePop" custom-class="checkedHome" class="logo-pop">
          <el-radio-group v-model="checkRadio" v-if="!dataIsloadd && (facebookHomelist.length>0 || linkedinComlist.length>0)">

            <el-radio :label="index" v-if="channelType == 'facebook' && facebookHomelist.length > 0" v-for="(facebookhome,index) in facebookHomelist" :key="facebookhome">
                <div class="right-checked">
                  <img :src="facebookhome.avatar || '../../assets/img/default_avatar.jpg'" alt="" class="display-img"/>
                  <div class="display-desc">
                    <p class="title">{{ facebookhome.name }}</p>
                    <p class="type">{{ channelType }} page</p>
                  </div>
                </div>
            </el-radio>
            <el-radio :label="index" v-if="channelType == 'linkedin' && linkedinComlist.length > 0" v-for="(linkedinCom,index) in linkedinComlist" :key="linkedinCom">
              <div class="right-checked">
                <img :src="linkedinCom.logUrl || '../../assets/img/default_avatar.jpg'" alt="" class="display-img"/>
                <div class="display-desc">
                  <p class="title">{{ linkedinCom.name }}</p>
                  <p class="type">{{ channelType }} page</p>
                </div>
              </div>
            </el-radio>
          </el-radio-group>
          <i class="icon-facebook title-logo facek-color" v-if="channelType == 'facebook'"></i>
          <i class="icon-linkedin-two title-logo linkedin-color" v-else></i>
          <div class="no-homepage " v-if="!dataIsloadd && ((channelType == 'linkedin' && linkedinComlist.length == 0) || (channelType == 'facebook' && facebookHomelist.length == 0))">
            <div v-if="channelType=='facebook'">
              <div class="title-second">您尚未拥有任何Facebook公共主页，您可以</div>
              <p class="desc">&bull;&nbsp;登录Facebook创建Facebook公告主页</p>
            </div>
            <div v-else>
              <div class="title-second">您尚未拥有任何linkedin公司主页，您可以</div>
              <p class="desc">&bull;&nbsp;登录linkedin创建linkedin公司主页</p>
            </div>
          </div>
          <div class="loading loading-circle" v-if="dataIsloadd"></div>
          <div slot="footer" class="dialog-footer" :class="{'is-ok': checkRadio != -1}" v-if="!dataIsloadd">
            <el-button type="primary" v-if="!isloadding" @click="updateHomePage(channelType)">确 定</el-button>
            <div class="loading loading-circle" v-else></div>
          </div>
        </el-dialog>
        <!--渠道选择 end-->
        </div>
      </div>
  </div>
</template>
<script>
  import channelAPI from '@/api/channelAPI'
  import headLeft from './systemIndex'
  export default {
    name: 'channelList',
    data () {
      return {
        serverLevel: '1',
        facebookRes: '',
        linkedinRes: '',
        twitterRes: '',
        pinterestRes: '',
        channelList: [],
        popcss: 'height=300, width=500, toolbar =no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no',
        unBindPop: false, // 解绑弹框
        channelType: '',  // 解绑类型
        channelindex: '', // 解绑渠道所在数字索引
        dqchannelType: '',    // 当前渠道解绑类型1渠道解绑2主页解绑
        bindMailPop: false,
        email: '',
        password: '',
        verificationFailure: false,
        dataIsloadd: true, // 主页数据是否加载中
        isloadding: false,    // 请求是否加载中
        errordisplay: '', // 错误提示
        pageHomePop: false,
        checkRadio: -1,
        facebookHomelist: [], // facebook个人主页列表
        linkedinComlist: [],  // linkedin公司列表
        emailIsOk: '',
        bindEmailType: 1,    // 绑定邮箱类型
        bindEmailNext: false,   // 绑定邮箱是否下一步
        imapUrl: '',
        imapPort: '',
        smtpUrl: '',
        smtpPort: ''
      }
    },
    components: {
      headLeft,
      channelAPI
    },
    computed: {
    },
    watch: {
    },
    methods: {
      /**
       * 前往添加主页标签
      */
      toFbLable () {
        let n
        this.channelList.map((item) => {
          if (item.channelId === 'FACEBOOK') {
            n = item
          }
        })
        if (!n.homePageId) {
          this.$message({
            message: '请先绑定Facebook公共主页',
            type: 'warning'
          })
          return
        }
        let url = `https://www.facebook.com/dialog/pagetab?app_id=${process.env.FBAPP_ID}&redirect_uri=http%3A%2F%2Fwww.facebook.com%2F`
        window.open(url)
      },
      /*
       * 邮箱图标
       * */
      mailType (type) {
        switch (type) {
          case '谷歌邮箱' :
            return '/static/img/mail/gmail.png'
          case '网易企业邮箱' :
            return '/static/img/mail/wangyiMail.png'
          case '腾讯企业邮箱' :
            return '/static/img/mail/tencentMail.png'
          case '阿里企业邮箱' :
            return '/static/img/mail/aliMail.png'
        }
      },
      // 绑定邮箱上一步
      bindEmailBack () {
        this.bindEmailNext = false
        this.bindMailPop = true
        this.email = ''
        this.password = ''
        this.verificationFailure = false
      },
      // 绑定邮箱下一步
      bindEmailNextFunc () {
        this.bindEmailNext = true
        this.bindMailPop = false
      },
      titleDisplay () {
        let str = '解除' + this.channelType
        if (this.dqchannelType === '1') {
          str = str + '绑定'
        } else {
          if (this.channelType === 'facebook') {
            str = str + '公共主页绑定'
          } else {
            str = str + '公司主页绑定'
          }
        }
        return str
      },
      // 邮箱绑定弹框
      bindMailPopFunc () {
        this.bindMailPop = true
        this.emailIsOk = ''
        this.email = ''
        this.password = ''
        this.verificationFailure = false
      },
      homePageTitle (type) {
        if (type === 'facebook') {
          return 'Facebook公共主页'
        } else {
          return 'Linkedin公司主页'
        }
      },
      // 邮箱绑定弹框，邮箱验证
      emailValidation () {
        let msg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9_.-]{2,4})+$/
        console.log(msg.test(this.email))
        if (msg.test(this.email) === false) {
          this.emailIsOk = 'error'
        } else {
          this.emailIsOk = 'ok'
        }
      },
      emailValidationRest () {
        this.emailIsOk = ''
      },
      // 渠道类
      channelClass (Id) {
        if (Id === 'FACEBOOK') {
          return 'channel-facebook'
        } else if (Id === 'TWITTER') {
          return 'channel-twitter'
        } else if (Id === 'PINTEREST') {
          return 'channel-pinterest'
        } else if (Id === 'LINKEDIN') {
          return 'channel-linkedin'
        } else if (Id === 'MAIL') {
          return 'channel-email'
        }
      },
      logoShow (Id) {
        if (Id === 'facebook') {
          return 'icon-facebook'
        } else if (Id === 'twitter') {
          return 'icon-twitter-two'
        } else if (Id === 'pinterest') {
          return 'icon-pinterest'
        } else if (Id === 'linkedin') {
          return 'icon-linkedin-two'
        } else if (Id === 'mail') {
          return 'icon-email'
        }
      },
      // 渠道解除绑定
      unBundledFunc (type, index) {
        let typestr = type.toLowerCase()
        channelAPI.unBundled({ typestr: typestr }).then(res => {
          if (res.data.code === 0) {     // 设置未绑定
            this.channelList[index].bindingTag = 0
            this.unBindPop = false
            this.$message({
              message: '解除绑定成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 解绑渠道弹框
      unBundledPop (type, index, dqtype) {
        this.unBindPop = true
        this.channelType = type
        this.channelindex = index
        this.dqchannelType = dqtype
      },
      // 获取主页列表
      pageHomePopFunc (type, index) {
        this.dataIsloadd = true   // 数据加载中
        this.pageHomePop = true
        this.channelType = type
        this.channelindex = index
        if (type === 'facebook') {      // facebook加载个人主页
          channelAPI.selFacebookHomelist().then(res => {
            this.dataIsloadd = false
            if (res.data.code === 0) {
              this.facebookHomelist = res.data.data
              this.readioDefaultSelect(index)
            }
          })
        } else {  // linkedin加载个人主页
          channelAPI.selLinkedinComlist().then(res => {
            this.dataIsloadd = false
            if (res.data.code === 0) {
              this.linkedinComlist = res.data.data
              this.readioDefaultSelect(index)
            }
          })
        }
      },
      // 单选框设置默认选中
      readioDefaultSelect (index) {
        let homePageId = this.channelList[index].homePageId
        if (this.facebookHomelist.length > 0 && homePageId !== '' && homePageId !== null) {
          for (let i = 0; i < this.facebookHomelist.length; i++) {
            if (this.facebookHomelist[i].homepageId === homePageId) {
              this.checkRadio = i
            }
          }
        } else {
          this.checkRadio = -1
        }
      },
      // 主页解绑
      unHomepageFunc (type, index) {
        let typestr = type.toLowerCase()
        let channeltype = 0
        if (typestr === 'facebook') {
          channeltype = 0
        } else {
          channeltype = 1
        }
        let senddata = {
          type: channeltype
        }
        channelAPI.unHomepage(senddata).then(res => {
          if (res.data.code === 0) {     // 设置未绑定
            this.channelList[index].homePageId = ''
            this.unBindPop = false
            this.$message({
              message: '公共主页解绑成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 修改主页绑定
      updateHomePage (type) {
        if (this.checkRadio === -1) {
          console.log('无法提交')
          return
        }
        this.isloadding = true
        if (type === 'facebook') { // facebook绑定
          let facebookhome = this.facebookHomelist[this.checkRadio]
          console.log(facebookhome)
          let senddata = {
            pageId: facebookhome.homepageId,
            pageName: facebookhome.name
          }
          channelAPI.bindFacebookHome(senddata).then(res => {
            this.isloadding = false
            if (res.data.code === 0) {
              this.pageHomePop = false
              this.$message({
                message: 'Facebook主页绑定成功',
                type: 'success'
              })
              this.channelList[this.channelindex].homePageId = facebookhome.homepageId
              this.channelList[this.channelindex].homePageLogUrl = facebookhome.avatar
              this.channelList[this.channelindex].homePageName = facebookhome.name
              // setTimeout(function () { location.reload() }, 500)
            }
          })
        } else {  // linked绑定
          let linkedinCom = this.linkedinComlist[this.checkRadio]
          let senddata = {
            companyId: linkedinCom.id,
            companyName: linkedinCom.name,
            logUrl: linkedinCom.logUrl
          }
          channelAPI.bindLinkedinCom(senddata).then(res => {
            this.isloadding = false
            if (res.data.code === 0) {
              this.pageHomePop = false
              this.$message({
                message: 'Linkedin公司绑定成功',
                type: 'success'
              })
              this.channelList[this.channelindex].homePageId = linkedinCom.id
              this.channelList[this.channelindex].homePageLogUrl = linkedinCom.logUrl
              this.channelList[this.channelindex].homePageName = linkedinCom.name
              // setTimeout(function () { location.reload() }, 500)
            }
          })
        }
      },
      // 绑定渠道
      bindChannel (type, index) {     // 渠道绑定
        let typestr = type.toLowerCase()
        this.curIndex = index
        if (typestr === 'facebook') {
          window.open(this.facebookRes, '_blank', this.popcss)
        } else if (typestr === 'twitter') {
          window.open(this.twitterRes, '_blank', this.popcss)
        } else if (typestr === 'linkedin') {
          window.open(this.linkedinRes, '_blank', this.popcss)
        } else if (typestr === 'pinterest') {
          window.open(this.pinterestRes, '_blank', this.popcss)
        }
      },
      // 绑定邮箱
      bindEmailFunc () {
        if (this.errors.any() || (this.email === '' || this.password === '')) {
          console.log('无法提交')
          return
        }
        if (this.bindEmailType === 5 && (this.imapUrl === '' || this.imapPort === '' || this.smtpUrl === '' || this.smtpPort === '')) {
          console.log('无法提交')
          return
        }
        this.isloadding = true
        let codetype = ''
        let name = ''
        if (this.bindEmailType === 1) {   // 腾讯企业
          codetype = 'tecent_enter'
          name = '腾讯企业邮箱'
        } else if (this.bindEmailType === 2) {  // gmail
          codetype = 'gmail'
          name = '谷歌邮箱'
        } else if (this.bindEmailType === 3) {   // 网易
          codetype = 'neteasy_enter'
          name = '网易企业邮箱'
        } else if (this.bindEmailType === 4) { // 阿里邮箱
          codetype = 'ali_enter'
          name = '阿里企业邮箱'
        } else if (this.bindEmailType === 5) { // 其它
          codetype = 'other'
          name = '其它'
        }
        let senddata = {
          email: this.email,
          authCode: this.password,
          supplierCode: codetype
        }
        if (this.bindEmailType === 5) {
          senddata.imap_host = this.imapUrl
          senddata.imap_port_ssl = this.imapPort
          senddata.smtp_host = this.smtpUrl
          senddata.smtp_port_ssl = this.smtpPort
        }
        channelAPI.bindEmail(senddata).then(res => {
          if (res.data.code === 0) {
            this.isloadding = false
            this.bindMailPop = false
            this.bindEmailNext = false
            this.$message({
              message: '绑定邮箱成功',
              type: 'success'
            })
            this.channelList[4].bindingTag = 1
            this.channelList[4].emailAddress = this.email
            this.channelList[4].realName = name
          } else {
            this.verificationFailure = true
            this.errordisplay = res.data.message
            this.$message.error(res.data.message)
            this.isloadding = false
            this.timing = 60
          }
        })
      }
    },
    mounted () {
      /**
       * 权限模块
       * 普通 0
       * 引航版/普及版2
       * 超级盈店1
       * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
       * @type {[type]}
       */
      this.serverLevel = window.localStorage.serverLevel
      // this.$store.dispatch('getChannelList')
      channelAPI.oAuth({type: 'facebook', index: 0}).then(res => {
        this.facebookRes = res.data.data
      })
      channelAPI.oAuth({type: 'linkedin', index: 3}).then(res => {
        this.linkedinRes = res.data.data
      })
      channelAPI.oAuth({type: 'twitter', index: 2}).then(res => {
        this.twitterRes = res.data.data
      })
      channelAPI.oAuth({type: 'pinterest', index: 1}).then(res => {
        this.pinterestRes = res.data.data
        console.log('pinterest:' + this.pinterestRes)
      })
    },
    created () {
      window.Fshop = {
        loginSuccess: function () {
          window.location.href = '/#/channelList'
          window.location.reload()
        }
      }
      // 获取渠道列表
      channelAPI.getAllChannel().then((res) => {
        this.channelList = res.data.data
      })
    }
  }

</script>
<style lang='less'>
  @import '../../assets/style/list.less';
  .logo-pop{
    .el-dialog__header{
      .el-dialog__title{
        margin-left: 12px;
        display:inline-block;
      }
    }
    .title-logo{
      position: absolute;
      top: 24px;
      left: 14px;
    }
  }
  .facek-color{
    color:#577ECE;
  }
  .linkedin-color{
    color:#2991CB;
  }
  .lf-padding10{
    padding:0 10px;
  }
  .editHomePage{
    margin-right:8px;
  }
  .el-dialog__body{
    .no-homepage{
      .title-second{
        font-size: 14px;
        color: #33475B;
        line-height: 20px;
        margin-top:5px;
      }
      .desc{
        font-size: 12px;
        color: #7C98B6;
        line-height: 16px;
      }
    }
  }
  .checkedHome{
    width:390px;
    .el-dialog__body{
      padding: 15px 20px;
      height: 167px;
      overflow: auto;
      .el-radio-group{
      .el-radio{
        width:100%;
        margin-left:0;
        margin-bottom:17px;
        .el-radio__input{
          top:-10px;
        }
        .el-radio__label{
          display: inline-block;
            .right-checked{
              margin-left:16px;
              .display-img{
                width:32px;
                height: 32px;
                border-radius: 16px;
                margin-right:8px;
              }
              .display-desc{
                display: inline-block;
                .title{
                  font-size: 12px;
                  color: #33475B;
                  line-height: 17px;
                }
                .type{
                  font-size: 12px;
                  color: #7C98B6;
                  line-height: 17px;
                }
              }
            }
          }
        }
      }
    }
    .dialog-footer{
      .el-button{
        width:100%;
        background:#EAF0F6;
        border: 1px solid #DFE3EB;
        color: #B0C1D4;
      }
    }
    .is-ok{
      .el-button--primary{
        background: #5488F9;
        border:none;
        color: #fff;
      }
      .el-button--primary:hover{
        opacity: 0.7;
      }
    }
  }


  .u-right{
    overflow:hidden;
  }
  .channel-item-list{
    margin-top:-15px;
    margin-left:30px;
    margin-right:30px;
    .channel-item{
      border-bottom: 1px solid #EAF0F6;
      overflow: hidden;
      padding:30px 0px;
      position: relative;
      .chan-logo{
        width: 32px;
        height: 32px;
        display: inline-block;
        position: relative;
        top: -6px;
        margin-right:16px;
        .u-logo{
          font-size: 32px;
        }
      }
      .channel-desc{
        display:inline-block;
        .channel-type{
          font-size:16px;
          line-height: 22px;
          text-transform: capitalize;
        }
        .chan-info{
          font-size: 13px;
          color: #7C98B6;
          letter-spacing: 0;
          line-height: 18px;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .chan-right{
        float: right;
        .yellowbord{
          border-left: 4px solid #FFB822;
        }
        .bind-info-display{
          overflow: hidden;
          padding:9px 9px;
          float: left;
          border-radius: 4px;
          margin-left:17px;
          position:relative;
          .close{
            height: 12px;
            position: absolute;
            right:2px;
            top:2px;
            cursor: pointer;
            color:#7C98B6;
          }
          .display-image{
            width:32px;
            height:32px;
            display:inline-block;
            img{
              width:100%;
              border-radius:16px;
            }
          }
          .close{
            margin:4px 4px;
          }
          .display-desc{
            display:inline-block;
            vertical-align: top;
            white-space: nowrap;
            overflow: hidden;
            margin-left: 8px;
            p{
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .nickname{
              color: #33475B;
              letter-spacing: 0;
              line-height:17px;
            }
            .type{
              color: #7C98B6;
              letter-spacing: 0;
              line-height: 17px;
              text-transform: capitalize;
              i{
                margin-right:4px;
              }
            }
          }
        }
        .btn{
          margin-left:17px;
          color:#fff;
          border-radius: 4px;
          height:34px;
          line-height: 34px;
          text-align: center;
          border:none;
          margin-top: 10px;
          cursor: pointer;
        }
        .btn:hover{
          opacity: 0.7;
        }
        .width160{
          width:160px;
        }
        .width120{
          width:120px;
        }
        .width220{
          width:220px;
        }
      }
      .chan-tips{
        position: absolute;
        height: 0;
        right: 2px;
        bottom: 20px;
        cursor: pointer;
        .chan-tips-text{
          font-size: 12px;
          color: #5488F9;
          &:hover{
            text-decoration: underline;
          }
        }
        .chan-tips-icon{
          font-size: 12px;
          color: #D4D4D4;
        }
      }
    }
  }
  .bindhome-display{
    .display-desc{
      width:125px;
    }
  }
  .bindchannel-display{
    .display-desc{
      width:102px;
    }
  }
/*弹框样式*/
  .unBind-confirm{
      width:390px;
      .el-dialog__body{
        padding:13px 30px;
        .title-second{
          font-size: 13px;
          color: #33475B;
          line-height: 20px;
        }
        .prompt-list{
          font-size: 12px;
          color: #7C98B6;
          letter-spacing: 0;
          line-height: 20px;
          li{
            text-transform: capitalize;
          }
        }
      }
      .el-dialog__footer{
        margin-top: 20px;
        overflow:hidden;
        .left-btn{
          float:left;
        }
      }
  }
  .bind-Mail{
     width:390px;
    .bindEmail-sel{
      padding:2px 0 32px 0;
      .bindEmail-title{
        font-size: 13px;
        color: #33475B;
        line-height: 20px;
      }
      .el-radio-group{
        width: 100%;
        .el-radio{
          width:50%;
          /*float:left;*/
          margin-left:0px;
          margin-top:21px;
          .el-radio__input{
            margin-right:8px;
            vertical-align: top;
            margin-top: 2px;
          }
          .el-radio__label{
            overflow: hidden;
            display: inline-block;
          }
          .desc{
            font-size: 13px;
            color: #33475B;
            line-height: 20px;
          }
        }
        .el-radio:nth-child(2n){
          .el-radio__input{
            margin-left:15px;
          }
        }
      }
    }
    .el-dialog__body {
      padding: 13px 30px;
        .top_display{
          text-align: center;
          ul li{
            display: inline-block;
            margin-left:10px;
          }
          .bind_emailtype{
            width:80px;
          }
        }
        .title-second {
          font-size: 13px;
          color: #33475B;
          line-height: 18px;
        }
      .caveat-module{
        margin:16px 0 0 0;
        color: #FF3B6E;
        line-height: 16px;
        font-size: 12px;
        padding:9px 10px;
        background: #ffebf0;
        border: 1px solid #FF3B6E;
        border-radius:4px;
        i{
          margin-right:7px;
        }
      }
      .second-input{
        margin:10px 0px;
        .input-text{
          padding: 9px 0;
          text-indent: 8px;
          font-size: 13px;
        }
        .left-input{
          width:181px;
        }
        .right-input{
          width:60px;
        }
        .label{
          margin-left:12px;
          margin-right:7px;
        }
        .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner{
          border-color:#D1D5E5;
        }
      }
      .input-verification{
        margin:10px 0px;
        .input-text{
          width: 210px;
          padding: 9px 0;
          text-indent: 8px;
          font-size: 13px;
        }
        .input-whole{
          width: 100%;
          padding: 9px 0;
          text-indent: 8px;
          font-size: 13px;
          border:none;
        }
        .bluebg-whitefc-btn{
          background:#5488F9;
          color:#fff;
          border-radius: 4px;
        }
        .bluebg-whitefc-btn:hover{
          opacity: 0.7;
        }
      }
      .steps-prompt{
        background: #F5F8FA;
        border-radius: 2px;
        margin-bottom:17px;
        margin-top:18px;
        padding:16px 26px 20px 16px;
        line-height: 16px;
        .steps-label{
          font-size: 12px;
          color: #33475B;
        }
        .steps-desc{
          font-size: 12px;
          color: #33475B;
          letter-spacing: 0;
          margin-top:8px;
        }
        .text_btn{
          cursor: pointer;
          margin-left:8px;
          a{
            color:#4a90e2;
          }
        }
        .text_btn:hover{
          text-decoration: underline;
        }
      }
    }
    .dialog-footer{
      overflow:hidden;
      .el-button{
        width:100%;
        background:#EAF0F6;
        border: 1px solid #DFE3EB;
        color: #B0C1D4;
      }
      .el-button.left-width120{
        width:120px;
        float:left;
        background: #fff;
      }
      .el-button.right-width120{
        width:120px;
        float:right;
      }
    }
    .is-ok{
      .el-button--primary{
        background: #5488F9;
        border:none;
        color: #fff;
      }
      .el-button:hover{
        opacity: 0.7;
      }
    }
  }
@c-facebook:#577ECE;
@c-twitter:#48B3FE;
@c-pinterest:#EA545E;
@c-linkedin:#2991CB;
@c-email:#5488F9;

/*facebook*/
  .channel-facebook{
    .u-logo{
      color: @c-facebook;
    }
    .channel-type{
      color: @c-facebook;
    }
    .chan-right{
      .bind-info-display{
        border: 1px solid #EAF0F6;
        border-left:4px solid @c-facebook;
        .type i{
          color:@c-facebook;
        }
      }
      .btn{
        background:@c-facebook;
      }
    }
  }
/*twitter*/
  .channel-twitter{
    .u-logo{
      color: @c-twitter;
    }
    .channel-type{
      color: @c-twitter;
    }
    .chan-right{
      .bind-info-display{
        border: 1px solid #EAF0F6;
        border-left:4px solid @c-twitter;
        .type i{
          color:@c-twitter;
        }
      }
      .btn{
        background:@c-twitter;
      }
    }
  }
/*pinterest*/
  .channel-pinterest{
    .u-logo{
      color: @c-pinterest;
    }
    .channel-type{
      color: @c-pinterest;
    }
    .chan-right{
      .bind-info-display{
        border: 1px solid #EAF0F6;
        border-left:4px solid @c-pinterest;
        .type i{
          color:@c-pinterest;
        }
      }
      .btn{
        background:@c-pinterest;
      }
    }
  }
  /*linkedin*/
  .channel-linkedin{
    .u-logo{
      color: @c-linkedin;
    }
    .channel-type{
      color: @c-linkedin;
    }
    .chan-right{
      .bind-info-display{
        border: 1px solid #EAF0F6;
        border-left:4px solid @c-linkedin;
        .type i{
          color:@c-linkedin;
        }
      }
      .btn{
        background:@c-linkedin;
      }
    }
  }
  /*email*/
  .channel-email{
    .u-logo{
      color: @c-email;
    }
    .channel-type{
      color: @c-email;
    }
    .chan-right{
      .bind-info-display{
        border: 1px solid #EAF0F6;
        border-left:4px solid @c-email;
        .type i{
          color:@c-email;
        }
      }
      .btn{
        background:@c-email;
      }
    }
  }
</style>
