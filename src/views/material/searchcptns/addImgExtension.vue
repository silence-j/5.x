<template>
  <div class="addExtension-container">
    <el-dialog class="add-dialog add-seachImg" v-model="addVisible" @close="cancelAdd">
      <span slot="title" class="dialog-header">
        <span>新增推广</span>
      </span>
      <div class="dialog-body">
        <div class="photo-section">
          <el-dropdown trigger="click" class="photo-dropdown" :class="isShowDropdown?'is-show':''" menu-align="start" @command="chooseMenu" v-bind:hide-on-click="false">
            <span class="el-dropdown-link" @click="showDropdown">
              <div class="result" v-if="!isShowAvatar">
                <i class="icon-font default-avatar">&#xe6b6;</i>
                <span class="default-text" v-if="bindingList.length">选择社交渠道</span>
                <span class="default-text" v-else>暂未绑定社交渠道</span>
              </div>
              <div class="result choosed" v-if="isShowAvatar" v-for="(item,index) in selectAvatarList" :key="item">
                <img :src="item.url">
                <i class="icon-font channel iconFont-facebook" v-if="item.type == 0">&#xe6d9;</i>
                <i class="icon-font channel" v-if="item.type == 1" style="color: #faa050;">&#xe6c1;</i>
                <i class="icon-font channel iconFont-twitter" v-if="item.type == 4">&#xe6d2;</i>
                <i class="icon-font channel iconFont-linkedIn" v-if="item.type == 2">&#xe7ea;</i>
                <!--<svg class="icon icon-active" abase.lessria-hidden="true" v-if="item.type == 3"> <use xlink:href="#icon-linkedingongsi"></use> </svg>-->
                <i class="icon-font channel iconFont-linkedIn" v-if="item.type == 3" style="color: #faa050;">&#xe7ea;</i>
                <i class="icon-font channel iconFont-pinterest" v-if="item.type == 5">&#xe6ff;</i>
                <span class="mask">
                  <i class="icon-font delete" @click="deleteAvatar($event,item,index)">&#xe62c;</i>
                </span>
              </div>
              <span class="right-icon">
                <i class="icon-font" :class="isShowDropdown?'is-reverse':'not-reverse'">&#xe608;</i>
              </span>
            </span>
            <el-dropdown-menu class="photo-menu" slot="dropdown">
              <div class="menu-list" v-if="!isShowPinterest">
                <el-dropdown-item v-for="(item,index) in bindingList" :disabled="item.type == 5?true:false" :command="JSON.stringify(item)" :key="item">
                  <div class="personal-info">
                    <img :src="item.url">
                    <p>{{item.name}}</p>
                    <p v-if="item.type == 0">
                      <i class="icon-font iconFont-facebook">&#xe6d9;</i>
                      <span>Facebook</span>
                    </p>
                    <p v-if="item.type == 1">
                      <i class="icon-font channel" style="color: #faa050;">&#xe6c1;</i>
                      <span>Facebook Page</span>
                    </p>
                    <p v-if="item.type == 4">
                      <i class="icon-font iconFont-twitter">&#xe6d2;</i>
                      <span>Twitter</span>
                    </p>
                    <p v-if="item.type == 2">
                      <i class="icon-font iconFont-linkedIn">&#xe7ea;</i>
                      <span>LinkedIn</span>
                    </p>
                    <p v-if="item.type == 3">
                      <i class="icon-font iconFont-linkedIn" style="color: #faa050;">&#xe7ea;</i>
                      <span>LinkedIn Page</span>
                    </p>
                    <p v-if="item.type == 5">
                      <i class="icon-font iconFont-pinterest">&#xe6ff;</i>
                      <span>Pinterest</span>
                    </p>
                  </div>
                </el-dropdown-item>
                <i v-for="item in bindingList" v-if="item.type == 5" class="icon-font right-arrow" @click="choosePinterest($event)">&#xe613;</i>
              </div>
              <div v-if="isShowPinterest">
                <div class="pinterest-data" v-show="!noPinterestData">
                  <el-dropdown-item v-for="(item,index) in boardList" :command="JSON.stringify(item)" :key="item">
                    <div class="personal-info">
                      <img :src="item.url">
                      <p>{{pinName}}</p>
                      <p>
                        <i class="icon-font iconFont-pinterest">&#xe6ff;</i>
                        <span>{{item.name}}</span>
                      </p>
                    </div>
                  </el-dropdown-item>
                </div>
                <div class="no-pinterest-data" v-show="noPinterestData">
                  <p>您没有画板，请先登录至Pinterest创建画板</p>
                </div>
                <div class="back-menu">
                  <p @click="isShowPinterest = false">
                    <i class="icon-font">&#xe600;</i>
                    <span>返回</span>
                  </p>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="content-section">
          <el-input type="textarea" name="content" placeholder="请输入推广内容" v-model="extensionText" :maxlength="maxLength"></el-input>
          <div class="upload-photo">
            <div class="limit-section" v-if="selectAvatarList.length > 0">
              <span>
                <span>{{extensionText.length}}</span>
                /
                <span>{{maxLength}}</span>
              </span>
            </div>
            <div class="insert-img">
               <i v-if="imageUrl" class="removeAvatar" @click="removeAvatar($event)">&times;</i>
               <img v-if="imageUrl" :src="imageUrl" class="avatar">
               <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
            </div>
          </div>
          <div class="choose-product" v-if="!sendDatas">
            <span class="icon-container">
              <i class="icon-font">&#xe627;</i>
            </span>
            <el-select
              ref="proSelect"
              class="select-tag"
              v-model="curProduct"
              multiple
              filterable
              remote
              placeholder="请输入商品名称选择商品"
              :multiple-limit="1"
              :remote-method="remoteMethod"
              :loading="loading"
              @change="chooseProduct">
              <el-option class="option-tag"
                v-for="item in productList"
                :key="item.id"
                :label="item.productName"
                :value="item">
                <div class="recycle-box">
                  <img :src="item.productFirstPicWhole">
                  <span>{{item.productName}}</span>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="preview-section" v-if="isPreview">
          <div class="preview-header">
            <span>预览：</span>
            <span v-for="(item,index) in selectAvatarList" @click="chooseChannel(item.type)">
              <span class="common-icon iconFont-facebook" v-if="item.type == 0">
                <i class="icon-font">&#xe6d9;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
              <span class="common-icon iconFont-twitter" v-if="item.type == 4">
                <i class="icon-font">&#xe6d2;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
              <span class="common-icon iconFont-linkedIn" v-if="item.type == 2">
                <i class="icon-font">&#xe7ea;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
              <span class="common-icon iconFont-pinterest" v-if="item.type == 5">
                <i class="icon-font">&#xe6ff;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
              <span class="common-icon iconFont-commonPage face" v-if="item.type == 1">
                <i class="icon-font channel">&#xe6c1;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
              <span class="common-icon iconFont-commonPage" v-if="item.type == 3">
                <!--<svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-linkedingongsi"></use> </svg>-->
                <i class="icon-font icon-active">&#xe7ea;</i>
                <i class="el-icon-caret-bottom curArrow" v-show="curChannel == item.type"></i>
              </span>
            </span>
            <div class="num-limit">
              <span>{{maxLength}}</span>
            </div>
          </div>
          <div>
            <div class="preview-body facebook" v-for="item in bindingList" v-if="(item.type == 0 || item.type == 1) && item.type == curChannel" :key="item">
              <div class="personal">
                <img class="avatar" :src="item.url">
                <span class="name">{{item.name}}</span>
              </div>
              <div class="content" v-if="extensionText">
                <span class="describe">{{extensionText}}</span>
              </div>
              <div class="detail" v-if="imageUrl">
                <img :src="imageUrl">
              </div>
            </div>
            <div class="preview-body twitter" v-for="item in bindingList" v-if="item.type == 4 && item.type == curChannel" :key="item">
              <div class="personal">
                <img class="avatar" :src="item.url">
              </div>
              <div class="content">
                <span class="name">{{item.name}}</span>
                <span class="describe" v-if="extensionText">{{extensionText}}</span>
              </div>
              <div class="detail" v-if="imageUrl">
                <img :src="imageUrl">
              </div>
            </div>
            <div class="preview-body linkedIn" v-for="item in bindingList" v-if="(item.type == 2 || item.type == 3) && item.type == curChannel" :key="item">
              <div class="personal">
                <img class="avatar" :src="item.url">
                <span class="name">{{item.name}}</span>
              </div>
              <div class="content" v-if="extensionText">
                <span class="describe">{{extensionText}}</span>
              </div>
              <div class="detail" v-if="imageUrl">
                <img :src="imageUrl">
              </div>
            </div>
            <div class="preview-body pinterest" v-for="item in bindingList" v-if="item.type == 5 && item.type == curChannel" :key="item">
              <div class="detail" v-if="imageUrl">
                <img :src="imageUrl">
              </div>
              <div class="content" v-if="extensionText">
                <span class="describe">{{extensionText}}</span>
              </div>
              <div class="personal">
                <img class="avatar" :src="item.url">
                <span class="name">{{item.name}}</span>
                <span class="board">{{pinBoardName}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="time-section">
          <div class="time-picker" v-show="isShowTime">
            <span>日期</span>
            <el-date-picker class="date-picker"
              v-model="timeValue"
              type="date"
              placeholder="请选择日期"
              @change="dateChange"
              :editable="false"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="time-selector">
            <span>{{isShowTime?'时间':'方式'}}</span>
            <el-select v-model="selectValue" placeholder="请选择方式" @change="selectTime" v-show="!isShowTime">
              <el-option class="time-option"
                v-for="item in timeSelectItem"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="time-send" v-show="isShowTime">
              <el-time-picker
                v-model="detailValue"
                :picker-options="{
                  selectableRange: disabledStamp
                }"
                @change="timeChange"
                :editable="false"
                placeholder="请选择时间">
              </el-time-picker>
              <div class="link-group">
                <span class="return-default" @click="returnDefault">返回默认</span>
                <el-popover
                  ref="timeData"
                  placement="bottom-end"
                  width="295"
                  class="time-popover"
                  trigger="hover">
                  <el-table :data="gridData" class="time-table">
                    <el-table-column width="142" property="location" label="参考时间"></el-table-column>
                    <el-table-column width="148" label="">
                      <template scope="scope">
                        <p v-text="getTimeString(timeValue, detailValue, scope.row.type)"></p>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-popover>
                <el-button v-popover:timeData>参考时间</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="disabledBtn" type="primary" @click="addImg" v-if="!isSending">发送
          <span v-if="selectAvatarList.length >0">({{selectAvatarList.length}})</span>
        </el-button>
        <el-button :disabled="disabledBtn" type="primary" v-else>
          <div class="loading loading-circle"></div>
        </el-button>
        <el-button class="cancelBtn" @click="cancelAdd">取消</el-button>
        <span>推广时请选择不大于5M的图片，过大文件会导致社交发帖失败</span>
      </span>
    </el-dialog>
    <!-- <uploadMaterial :options="materialOptions" @confirmInsert="confirmInsert" @cancelInsert="cancelInsert"></uploadMaterial> -->
  </div>
</template>

<script>
  // import Vue from 'vue'
  import materialAPI from '@/api/materialAPI.js'
  import DevelopAPI from '@/api/developAPI'
  import uploadMaterial from '../../../components/uploadMaterial'
  export default{
    name: 'addImgExtension',
    data () {
      return {
        materialOptions: {
          multiple: false,
          size: 10,
          type: 'img',
          show: false
        },
        domain: process.env.DOMAIN,
        imgDomain: process.env.IMG_DOMAIN,
        addVisible: false,
        firstClick: true,
        channelList: [], // 保存渠道列表
        bindingList: [], // 保存处理后的渠道列表
        pinName: '', // 保存Pinterest名称
        pinBoardName: '', // 保存Pinterest画板名称
        boardId: '', // 保存Pinterest画板id
        boardList: [], // 保存画板列表
        selectAvatarList: [], // 保存被选择的头像
        extensionText: '', // 保存多行文本域的内容
        isShowDropdown: false,
        isShowAvatar: false, // dropdown选择后头像显示
        isShowPinterest: false, // 是否展示Pinterest画板
        noPinterestData: true, // Pinterest没有画板
        isPreview: false, // 是否预览
        imageUrl: '',
        curProduct: [],
        productList: [], // 保存商品列表
        previewObj: [], // 保存预览店铺绑定渠道
        loading: false, // 是否正在从远程获取数据
        curChannel: -1,
        maxLength: 2000,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        timeValue: '',
        timeSelectItem: [{
          value: '立即发送'
        }, {
          value: '排期发送'
        }],
        selectValue: '立即发送',
        isShowTime: false,
        detailValue: '',
        curSendTime: '',
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
        isBuffer: false,
        curTimer: null,
        dateStamp: null,
        selectStamp: null,
        disabledStamp: null,
        firstChange: true, // 时间选择器的值是否第一次改变（保存初始选择的时间范围）
        isSending: false, // 保存是否正在 发送/保存 推广
        timer: null,
        hasError: false,
        initDate: '', // 保存选择排期发送时的初始化年月日毫秒数
        disableTime: true, // 保存是否需要禁用时间选择器的权限
        disabledBtn: false
      }
    },
    computed: {
      isAddImgExtension () {
        return this.$store.state.develop.isAddImgExtension
      },
      sendDatas () {
        return this.$store.state.develop.sendDatas
      }
    },
    mounted () {
      this.getChannelList()
    },
    watch: {
      isAddImgExtension () {
        this.addVisible = this.isAddImgExtension
      },
      sendDatas () {
        this.imageUrl = this.sendDatas.previewURL
      },
      selectAvatarList () {
        let hasTwitter = false
        let hasLinkedin = false
        let hasPinterest = false
        this.selectAvatarList.forEach((val, i) => {
          if (val.type === 4) {
            this.maxLength = 140
            hasTwitter = true
          } else if (val.type === 5 && !hasTwitter) {
            this.maxLength = 1000
            hasPinterest = true
          } else if ((val.type === 2 || val.type === 3) && !hasTwitter && !hasPinterest) {
            this.maxLength = 1300
            hasLinkedin = true
          } else if ((val.type === 0 || val.type === 1) && !hasTwitter && !hasPinterest && !hasLinkedin) {
            this.maxLength = 2000
          }
        })
      },
      extensionText () {
        if (this.extensionText) {
          this.isPreview = true
        } else {
          if (!this.imageUrl) {
            this.isPreview = false
          }
        }
      },
      imageUrl () {
        if (this.imageUrl) {
          this.isPreview = true
        } else {
          if (!this.extensionText) {
            this.isPreview = false
          }
        }
      }
    },
    methods: {
      /*
      * 参考时间 时区转换
      * */
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
      /*
      * 获取绑定渠道列表
      * */
      getChannelList () {
        DevelopAPI.getChannelList().then(res => {
          if (res.data.code === 0) {
            this.channelList = res.data.data
            let obj
            this.channelList.forEach((value, i) => {
              if (value.bindingTag === 1) {
                let itemObj = {
                  url: value.avatar,
                  type: -1,
                  name: value.nickName
                }
                let homeObj = {
                  url: value.homePageLogUrl,
                  type: -1,
                  name: value.homePageName
                }
                if (value.channelId === 'FACEBOOK') {
                  itemObj.type = 0
                  this.bindingList.push(itemObj)
                  if (value.homePageId) {
                    homeObj.type = 1
                    this.bindingList.push(homeObj)
                  }
                } else if (value.channelId === 'TWITTER') {
                  itemObj.type = 4
                  this.bindingList.push(itemObj)
                } else if (value.channelId === 'LINKEDIN') {
                  itemObj.type = 2
                  this.bindingList.push(itemObj)
                  if (value.homePageId) {
                    homeObj.type = 3
                    this.bindingList.push(homeObj)
                  }
                } else if (value.channelId === 'PINTEREST') {
                  this.pinName = value.nickName
                  itemObj.type = 5
                  obj = itemObj
                  // 特殊处理把PINTEREST数据房列表最后位置
                }
              }
            })
            if (obj) {
              this.bindingList.push(obj)
            }
            this.$store.commit('DEVELOP_BINDINGLIST', { bindingList: this.bindingList })
          }
          /*
           * 获取 画板列表
           * */
          this.bindingList.forEach((val, i) => {
            if (val.type === 5) {
              DevelopAPI.getBoardList().then(res => {
                if (res.data.code === 0) {
                  this.boardList = res.data.data
                  if (this.boardList.length > 0) {
                    this.noPinterestData = false
                  }
                  console.log(this.boardList)
                  this.$store.commit('DEVELOP_BOARDLIST', { boardList: this.boardList })
                }
              })
            }
          })
        })
      },
      /*
      * 头像选择下拉列表 显示 / 隐藏
      * */
      showDropdown () {
        if (this.firstClick) {
          this.firstClick = false
          this.isShowDropdown = true
        } else {
          this.firstClick = true
          this.isShowDropdown = false
        }
      },
      /*
      * 选择 dropdown-menu
      * */
      chooseMenu (item) {
        this.isShowDropdown = false
        this.isShowAvatar = true
        let itemObj = JSON.parse(item)
        if (itemObj.type === undefined) {
          this.boardId = itemObj.id
          this.pinBoardName = itemObj.name
          itemObj.type = 5
        }
        let hasCommon = false
        if (this.selectAvatarList.length > 0) {
          this.curChannel = this.selectAvatarList[0].type
          this.selectAvatarList.forEach((val, i) => {
            if (val.type === itemObj.type) {
              hasCommon = true
            }
          })
          if (!hasCommon) {
            this.selectAvatarList.push(itemObj)
          }
        } else {
          this.selectAvatarList.push(itemObj)
          this.curChannel = this.selectAvatarList[0].type
        }
      },
      /*
       * 删除头像
       * */
      deleteAvatar (event, avatar, index) {
        event.stopPropagation()
        this.selectAvatarList.splice(index, 1)
        if (this.selectAvatarList.length === 0) {
          this.isShowAvatar = false
        }
      },
      /*
       * 选择 pinterest 画板
       * */
      choosePinterest (event) {
        event.stopPropagation()
        this.isShowPinterest = true
      },
      /*
      * 上传头像成功 callback
      * */
      avatarSuccess (res) {
        this.imageUrl = res.data.urlWhole
      },
      // changeImg () {
      //   this.materialOptions.show = true
      // },
      /*
       * 移除头像 callback
       * */
      removeAvatar (event) {
        event.stopPropagation()
        this.imageUrl = ''
      },
      /*
      * 上传头像前的验证
      * */
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png'
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isJPG && isLt10M
      },
      /*
      * tag input输入值变化 callback
      * */
      remoteMethod (query) {
        let params = {
          productName: query
        }
        if (query !== '') {
          this.loading = true
          if (this.curTimer) {
            clearTimeout(this.curTimer)
          }
          this.curTimer = setTimeout(() => {
            DevelopAPI.getProductList(params).then(res => {
              if (res.data.code === 0) {
                this.loading = false
                this.productList = res.data.data.records
              }
            })
          }, 2000)
        } else {
          this.productList = []
        }
      },
      /*
      * tag input 选中值变化 callback
      * */
      chooseProduct () {
        if (this.curProduct.length > 0) {
          this.isPreview = true
          this.imageUrl = this.curProduct[0].productFirstPicWhole
          this.extensionText = this.curProduct[0].productName + '  ' + `${process.env.HOMEPAGE}/detail?shopId=` + this.curProduct[0].shopId + `&productId=` + this.curProduct[0].id
          this.$refs.proSelect.query = ''
        } else {
          this.productList = []
          this.isPreview = false
          this.imageUrl = ''
          this.extensionText = ''
        }
      },
      /*
      * 选择预览图片的渠道
      * */
      chooseChannel (channel) {
        this.curChannel = channel
      },
      /*
      * 清空 addExtension 数据
      * */
      cancelAdd () {
        this.selectAvatarList = []
        this.isShowAvatar = false
        this.isShowPinterest = false
        this.extensionText = ''
        this.productList = []
        this.curProduct = []
        this.selectValue = '立即发送'
        this.isShowTime = false
        this.curSendTime = ''
        this.firstChange = true
        this.$store.commit('DEVELOP_ADDIMGEXTENSION', { isAddImgExtension: false, sendDatas: this.sendDatas })
      },
      b64DecodeUnicode (str) {
        str = str.split('=')[1]
        return decodeURIComponent(atob(str).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      },
      addImg () {
        this.isSending = true
        this.disabledBtn = true
        this.saveImg()
      },
      saveImg () {
        materialAPI.getFileList({ dirId: '0' }).then(res => {
          if (res.data.code === 0) {
            let folder = res.data.data.folders
            let targetId = 0
            folder.forEach(element => {
              if (element.name === '营销素材') {
                targetId = element.id
              }
            })
            let imageData = this.sendDatas
            let params = {
              id: imageData.id,
              url: this.b64DecodeUnicode(imageData.previewURL),
              dirId: targetId
            }
            materialAPI.saveImg(params).then(res => {
              if (res.data.code === 0) {
                this.imageUrl = res.data.data.fullUrl
                this.confirmAdd()
              } else {
                this.isSending = false
                this.disabledBtn = false
                return
              }
            })
          }
        })
      },
      /*
      * 发布社交推广 confirm 函数
      * */
      confirmAdd () {
        let isComplete = true
        let params = {
          type: '',
          productId: '',
          content: '',
          pircUrls: this.imageUrl,
          isSchedule: -1,
          sendTime: '',
          boardId: ''
        }
        console.log(params.pircUrls)
        params.boardId = this.boardId
        if (this.curProduct.length > 0) {
          params.productId = this.curProduct[0].id
        }
        params.content = this.extensionText
        if (this.selectValue === '立即发送') {
          params.isSchedule = 0
          params.sendTime = Date.parse(new Date()) / 1000
        } else if (this.selectValue === '排期发送') {
          params.isSchedule = 1
          params.sendTime = this.curSendTime / 1000
        }
        if (this.selectAvatarList.length === 0) {
          this.$message({
            message: '请选择社交渠道',
            type: 'error'
          })
          this.isSending = false
          this.disabledBtn = false
          return
        } else {
          this.selectAvatarList.forEach((value, i) => {
            params.type += value.type + ';'
            if (value.type === 5) {
              if (!params.pircUrls) {
                this.$message({
                  message: '无法发送！请添加图片',
                  type: 'error'
                })
                this.isSending = false
                this.disabledBtn = false
                isComplete = false
              }
            } else {
              if (!params.pircUrls && !params.content) {
                this.$message({
                  message: '无法发送！请添加图片或内容',
                  type: 'error'
                })
                this.isSending = false
                this.disabledBtn = false
                isComplete = false
              }
            }
          })
        }
        if (this.selectValue === '排期发送') {
          if (!this.timeValue || !this.detailValue) {
            this.$message({
              message: '请选择排期时间',
              type: 'error'
            })
            this.isSending = false
            this.disabledBtn = false
            isComplete = false
            return
          }
        }
        let curDate = Date.parse(new Date())
        if (this.curSendTime < curDate && this.selectValue === '排期发送') {
          this.$message({
            message: '排期时间应选在当前时间之后',
            type: 'error'
          })
          this.isSending = false
          this.disabledBtn = false
          isComplete = false
          return
        }
        if (this.extensionText.length > this.maxLength) {
          isComplete = false
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.hasError = false
          }, 2000)
          if (!this.hasError) {
            this.$message({
              message: '输入内容不能超过字符数限制',
              type: 'error'
            }, 2000)
            this.isSending = false
            this.disabledBtn = false
            this.hasError = true
          }
        }
        if (isComplete) {
          DevelopAPI.publishPost(params).then(res => {
            //  收到res即可关闭loading
            this.isSending = false
            this.disabledBtn = false
            if (res.data.code === 0) {
              this.$message({
                message: '发帖成功',
                type: 'success'
              })
              this.$store.commit('DEVELOP_ADDSUCCESS', { isAddSuccess: true, sendType: params.isSchedule })
              this.cancelAdd()
            } else if (res.data.code === 1) {
              //  code 1 发送失败，message:twitter帖子 facebook新鲜事  推广失败。
              //  根据message 长度判断是否全部失败，不是全部失败就关闭窗口,type: "0;1;4;5;"
              let errorLen = res.data.message.split(' ').length
              let typeLen = params.type.split(';').length
              if (errorLen < typeLen) {
                this.$store.commit('DEVELOP_ADDSUCCESS', { isAddSuccess: true, sendType: params.isSchedule })
                this.cancelAdd()
              }
            }
          })
        }
      },
      /*
       * 选择 排期 / 立即 发送
       * */
      selectTime (value) {
        if (value === '排期发送') {
          this.isShowTime = true
          let yearDate = new Date()
          let curDate = Date.parse(new Date())
          let year = yearDate.getFullYear()
          let yearFormat = new Date(year + '-01-01').getTime()
          let secondFormat = curDate % (1000 * 60 * 60 * 24)
          this.timeValue = new Date(curDate - secondFormat)
          this.initDate = curDate - secondFormat
          this.detailValue = new Date(yearFormat + secondFormat)
        } else {
          this.isShowTime = false
          this.firstChange = true
        }
      },
      /*
      * 日期选择 input值 改变
      * */
      dateChange (date) {
        if (Date.parse(new Date(date)) > this.initDate) {
          this.disableTime = false
          this.disabledStamp = '00:00:00 - 23:59:59'
        } else {
          this.disableTime = true
          this.firstChange = true
          this.selectTime('排期发送')
        }
      },
      /*
       * 时间选择 input值 改变
       * */
      timeChange (time) {
        let yearDate = new Date()
        let curDate = Date.parse(new Date())
        let year = yearDate.getFullYear()
        let yearFormat = new Date(year + '-01-01').getTime()
        let secondFormat = curDate % (1000 * 60 * 60 * 24)
        let curTime = new Date(yearFormat + secondFormat)
        this.dateStamp = Date.parse(curTime)
        this.selectStamp = Date.parse(this.detailValue)
        if (this.firstChange) {
          if (this.disableTime) {
            this.disabledStamp = time + ' - 23:59:59'
          }
          this.firstChange = false
        }
      },
      /*
       * 返回默认 按钮
       * */
      returnDefault () {
        this.isShowTime = false
        this.selectValue = '立即发送'
      }
      // confirmInsert (val) {
      //   this.imageUrl = val.src
      //   this.materialOptions.show = false
      // },
      // cancelInsert () {
      //   this.materialOptions.show = false
      // }
    },
    components: {
      uploadMaterial
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
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
  .iconFont-commonPage{
    color: @commonPageColor;
  }
  .photo-menu{
    width: 216px;
    padding: 8px 0;
    border-radius: 4px;
    z-index: 6666 !important;
    .menu-list{
      position: relative;
      .right-arrow{
        position: absolute;
        right: 10px;
        bottom: 8px;
        height: 32px;
        line-height: 32px;
        color: @textColor;
        cursor: pointer;
      }
    }
    .el-dropdown-menu__item{
      padding: 8px 0 8px 16px;
      &.is-disabled{
        width: 180px;
      }
      &:not(.is-disabled):hover{
        background: #F5F8FA;
      }
      .personal-info{
        img{
          float: left;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
        svg{
          font-size: 14px;
        }
        p{
          line-height: 16px;
          font-size: 12px;
          &:last-child{
            span{
              color: @detailTextColor;
            }
          }
        }
      }
    }
    .no-pinterest-data{
      p{
        width: 143px;
        line-height: 18px;
        margin: 38px 36px 48px 37px;
        font-size: 12px;
        color: @detailTextColor;
      }
    }
    .back-menu{
      height: 13px;
      padding: 9px 0 0 8px;
      border-top: 1px solid @inputBorderColor;
      p{
        display: inline-block;
        cursor: pointer;
        i{
          color: @disabledColor;
        }
        span{
          font-size: 12px;
          color: @activeBlue;
        }
      }
    }
  }
  .el-select-dropdown.is-multiple{
    z-index: 6666 !important;
    .option-tag{
      height: 80px;
      &.selected.hover{
        background-color: #F5F8FA;;
      }
      &.hover{
        background-color: #F5F8FA;;
      }
      &.selected::after{
        bottom: 27px;
      }
      .recycle-box{
        max-width: 568px;
        overflow: hidden;
        img{
          width: 64px;
          height: 64px;
          margin-right: 3px;
          vertical-align: top;
        }
      }
    }
  }
  .time-option{
    height: 34px;
    &.hover{
      background-color: rgba(2,170,170,.1);
    }
    &.selected{
      color: @textColor;
      background-color: @white;
      &.hover{
        background-color: rgba(2,170,170,.1);
      }
    }
  }
  .el-popover{
    padding: 0;
    border: none;
    border-radius: 4px;
  }
  .time-table{
    ::-webkit-scrollbar{
      width: 5px;
    }
    ::-webkit-scrollbar-track{
      background-color: @white;
    }
    ::-webkit-scrollbar-thumb{
      background-color: #CBD6E2;
    }
    border-radius: 4px;;
    .cell{
      padding: 0 8px;
      font-size: 13px;
      font-weight: normal;
      color: #4F6D95;
    }
    .el-table__header-wrapper{
      .el-table th.is-leaf, .el-table td{
        border-bottom: none;
      }
      th{
        height: 28px;
        line-height: 28px;
        background: #F5F8FA;
      }
      thead div{
        background: #F5F8FA;
      }
    }
    .el-table__body-wrapper{
      max-height: 240px;
      overflow-y: auto;
      .el-table_1_column_2{
        text-align: left;
      }
    }
  }
  .addExtension-container{
    ::-webkit-input-placeholder {
      font-weight: 300;
    }
    :-moz-placeholder {
      font-weight: 300;
    }
    ::-moz-placeholder {
      font-weight: 300;
    }
    :-ms-input-placeholder {
      font-weight: 300;
    }
    .el-dialog__wrapper{
      right: -9px;        
    }
    .add-dialog{
      .el-dialog{
        width: 680px;
        border-radius: 4px;
        box-shadow: 0 0 6px rgba(0,0,0,.06);
        .el-dialog__header{
          height: 20px;
          line-height: 20px;
          padding: 13px 16px;
          font-size: 14px;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        .el-dialog__body{
          padding: 13px 16px;
          .photo-dropdown{
            width: 265px;
            height: 46px;
            border: 1px solid @inputBorderColor;
            border-radius: 3px;
            &.is-show{
              border: 1px solid @textareaBorder;
              box-shadow: 0 0 1px 0 @textareaBorder;
            }
            .el-dropdown-link{
              overflow: hidden;
              .result{
                display: inline-block;
                padding: 4px 0 6px 8px;
                .default-avatar{
                  display: inline-block;
                  font-size: 32px;
                  margin-top: 5px;
                  color: @base-weak;
                }
                .default-text{
                  vertical-align: super;
                }
                &.choosed{
                  position: relative;
                  padding: 8px 0 6px 8px;
                  &:hover{
                    .mask{
                      display: block;
                    }
                  }
                  i.channel,svg{
                    position: absolute;
                    bottom: 6px;
                    right: 0;
                    background: @white;
                  }
                  svg{
                    font-size: 13px;
                  }
                  .mask{
                    display: none;
                    position: absolute;
                    top: 8px;
                    right: 0;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(51,71,91,.3);
                    .delete{
                      position: absolute;
                      top: -1px;
                      left: 10px;
                      color: rgba(255,255,255,.7);
                      font-size: 14px;
                      cursor: pointer;
                    }
                  }
                }
                img{
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                span{
                  line-height: 34px;
                  font-size: 14px;
                  margin-left: 3px;
                  color: @textColor;
                }
              }
              .right-icon{
                position: relative;
                float: right;
                width: 24px;
                height: 45px;
                text-align: center;
                background: #F5F8FA;
                cursor: pointer;
                i{
                  position: absolute;
                  top: 40%;
                  right: 4px;
                  transition: transform .3s;
                  &.is-reverse{
                    transition: transform .3s;
                    transform: translateX(-2px) translateY(-10%) rotateZ(180deg);
                  }
                }
              }
            }
          }
          .content-section{
            width: 648px;
            margin-top: 16px;
            border: 1px solid @inputBorderColor;
            border-radius: 4px;
            textarea{
              box-sizing: border-box;
              width: 648px;
              height: 130px;
              padding: 8px;
              color: @textColor;
              font-size: 13px;
              border: none;
              border-radius: 4px;
              resize: none;
              outline: none;
            }
            .upload-photo{
              padding-left: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #DFE3EB;
              .limit-section{
                float: right;
                margin-top: 50px;
                margin-right: 10px;
                font-size: 14px;
                color: @detailTextColor;
              }
              .insert-img{
                position: relative;
                border: 1px dashed #CBD6E3;
                background: #F5F8FA;
                cursor: pointer;
                width: 64px;
                height: 64px;
                line-height: 64px;
                text-align: center;
                font-size: 26px;
                font-weight: 100;
                color: #B0C1D4;
                .removeAvatar{
                  position: absolute;
                  top: -6px;
                  right: -9px;
                  width: 15px;
                  height: 15px;
                  line-height: 15px;
                  border-radius: 50%;
                  font-size: 13px;
                  text-align: center;
                  color: #fff;
                  background: #B0C1D4;
                }
              }
              .avatar-uploader .el-upload {
                position: relative;
                border: 1px dashed @inputBorderColor;
                background: #F5F8FA;
                cursor: pointer;
                .removeAvatar{
                  position: absolute;
                  top: -6px;
                  right: -9px;
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  color: @white;
                  background: @disabledColor;
                }
              }
              .avatar-uploader .el-upload:hover {
                border-color: @activeBlue;
              }
              .avatar-uploader-icon {
                width: 64px;
                height: 64px;
                line-height: 64px;
                text-align: center;
                font-size: 26px;
                font-weight: 100;
                color: #B0C1D4;
              }
              .avatar {
                width: 64px;
                height: 64px;
                display: block;
              }
            }
            .choose-product{
              .icon-container{
                display: inline-block;
                height: 24px;
                padding: 0 16px;
                margin: 12px 0;
                border-right: 1px solid #B0C1D4;
                i{
                  font-size: 20px;
                  color: #B0C1D4;
                }
              }
              .select-tag{
                width: 590px;
                .el-input__inner{
                  border: none;
                }
                .el-tag{
                  height: 28px;
                  line-height: 28px;
                  .el-select__tags-text{
                    display: inline-block;
                    box-sizing: border-box;
                    max-width: 450px;
                    height: 18px;
                    line-height: 18px;
                    padding-top: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
          .preview-section{
            width: 648px;
            height: 418px;
            margin-top: 1px;
            border: 1px solid @inputBorderColor;
            border-radius: 4px;
            background: @textBorderColor;
            .preview-header{
              box-sizing: border-box;
              height: 44px;
              line-height: 20px;
              padding: 12px 16px;
              font-size: 14px;
              background: #F5F8FA;
              border-radius: 4px 4px 0 0;
              span{
                color: @cancel;
                &.common-icon{
                  position: relative;
                  display: inline-block;
                  height: 30px;
                  cursor: pointer;
                  i,svg{
                    font-size: 14px;
                    margin-right: 14px;
                    &.curArrow{
                      position: absolute;
                      top: 18px;
                      font-size: 10px;
                      color: @activeBlue;
                    }
                  }
                  &.face{
                    svg{
                      font-size: 16px;
                    }
                  }
                  svg{
                    font-size: 15px;
                    margin-right: 17px;
                  }
                  &.iconFont-facebook{
                    color: @facebookColor;
                  }
                  &.iconFont-twitter{
                    color: @twitterColor;
                  }
                  &.iconFont-linkedIn{
                    color: @linkedInColor;
                  }
                  &.iconFont-pinterest{
                    color: @pinterestColor;
                  }
                  &.iconFont-commonPage{
                    color: @commonPageColor;
                  }
                }
              }
              .num-limit{
                float: right;
              }
            }
            .preview-body{
              box-sizing: border-box;
              margin: 16px auto 0;
              font-size: 13px;
              border: 1px solid #D8D8D8;
              background: @white;
              .avatar{
                width: 42px;
                height: 42px;
                margin-right: 9px;
                vertical-align: top;
              }
              .name{
                color: #333;
                font-size: 13px;
                font-weight: bold;
              }
              .content{
                max-height: 120px;
                overflow-y: auto;
                line-height: 18px;
                font-size: 12px;
                word-break: break-all;
              }
              &.facebook{
                width: 333px;
                padding: 10px 30px 16px 10px;
                .content{
                  margin-top: 10px;
                }
                .detail{
                  overflow: hidden;
                  height: 135px;
                  margin-top: 10px;
                  img{
                    width: 293px;
                  }
                }
              }
              &.twitter{
                overflow: hidden;
                width: 334px;
                padding: 14px 14px 20px 14px;
                .personal{
                  float: left;
                  vertical-align: text-top;
                }
                .content{
                  float: right;
                  width: 250px;
                  .name{
                    display: block;
                    margin-bottom: 5px;
                  }
                }
                .detail{
                  overflow: hidden;
                  height: 135px;
                  float: right;
                  margin-top: 10px;
                  img{
                    width: 252px;
                  }
                }
              }
              &.linkedIn{
                width: 334px;
                padding: 10px 18px 20px 10px;
                .avatar{
                  border-radius: 50%;
                }
                .content{
                  margin-top: 10px;
                }
                .detail{
                  overflow: hidden;
                  height: 135px;
                  margin-top: 10px;
                  img{
                    width: 298px;
                  }
                }
              }
              &.pinterest{
                width: 246px;
                padding: 10px 10px 18px 10px;
                border-radius: 8px;
                .personal{
                  margin-top: 5px;
                  .avatar{
                    float: left;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                  }
                  .name{
                    display: block;
                    margin-bottom: 4px;
                  }
                  .board{
                    font-size: 12px;
                    color: #999;
                  }
                }
                .content{
                  margin-top: 10px;
                  .describe{
                    display: inline-block;
                    width: 222px;
                    overflow:hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                  }
                }
                .detail{
                  overflow: hidden;
                  height: 241px;
                  margin-top: 10px;
                  img{
                    width: 225px;
                    border-radius: 4px;
                  }
                }
              }
            }
          }
          .time-section{
            height: 28px;
            margin-top: 16px;
            margin-bottom: 14px;
            .time-picker{
              display: inline-block;
              color: @detailTextColor;
              span{
                margin-right: 4px;
              }
              .date-picker{
                width: 230px;
                height: 28px;
                .el-input__inner{
                  height: 28px;
                  font-size: 13px;
                }
              }
            }
            .time-selector{
              float: right;
              color: @detailTextColor;
              span{
                margin-right: 4px;
              }
              .el-select{
                width: 173px;
                height: 28px;
                vertical-align: middle;
                .el-input__inner{
                  height: 28px;
                  font-size: 13px;
                  &:focus,&:hover{
                    border: 1px solid @textareaBorder;
                  }
                }
                .resize-triggers > div{
                  overflow: hidden;
                }
              }
              .time-send{
                display: inline;
                width: 173px;
                height: 28px;
                .el-date-editor.el-input{
                  width: 173px;
                }
                .el-input__inner{
                  height: 28px;
                  font-size: 13px;
                }
                .link-group{
                  overflow: hidden;
                  margin-top: 8px;
                  padding-left: 40px;
                  color: @activeBlue;
                  font-size: 12px;
                  .return-default{
                     cursor: pointer;
                   }
                  .el-button{
                    float: right;
                    padding: 0;
                    border: none;
                    font-size: 12px;
                    color: @activeBlue;
                  }
                }
              }
            }
          }
        }
        .el-dialog__footer{
          text-align: left;
          padding-bottom: 30px;
          .el-button{
            position: relative;
            width: 80px;
            height: 34px;
            font-size: 13px;
            font-weight: 300;
            border: none;
            &.cancelBtn{
              margin-left: 0;
              font-weight: 400;
              color: @mainFontColor;
            }
            .loading{
              position: absolute;
              bottom: 8px;
              left: 30px;
              width: 14px;
              height: 14px;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
</style>
