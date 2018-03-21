<template>
  <el-select class="account-select" :placeholder="placeholder">
    <el-option
      class="account-option"
      v-for="(item,index) in bindingList"
      :key="index"
      :value="item.name"
      :class="item.type == 1 || item.type == 3?'homepage-option':''"
      v-bind:disabled="true">
      <div class="account-container" :class="item.checked ?'is-selected':''">
        <div :class="item.type == 1 || item.type == 3?'homepage-info':'personal-info'">
          <img :src="item.url">
          <p>{{item.name}}</p>
          <p>
            <span v-if="item.type == 0">
              <i class="icon-font iconFont-facebook">&#xe6d9;</i>
              <span class="channel">Facebook</span>
            </span>
            <span v-if="item.type == 1">
              <svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-Facebookgonggongzhuyetubiao"></use> </svg>
              <span class="channel">Facebook Page</span>
            </span>
            <span v-if="item.type == 4">
              <i class="icon-font iconFont-twitter">&#xe6d2;</i>
              <span class="channel">Twitter</span>
            </span>
            <span v-if="item.type == 2">
              <i class="icon-font iconFont-linkedIn">&#xe7ea;</i>
              <span class="channel">LinkedIn</span>
            </span>
            <span v-if="item.type == 3">
              <svg class="icon icon-active" abase.lessria-hidden="true"> <use xlink:href="#icon-linkedingongsi"></use> </svg>
              <span class="channel">LinkedIn Page</span>
            </span>
            <span v-if="item.type == 5">
              <i class="icon-font iconFont-pinterest">&#xe6ff;</i>
              <span class="channel">Pinterest</span>
            </span>
          </p>
        </div>
        <i class="icon-font right" @click="accountSelect($event,item,index)">&#xe626;</i>
      </div>
    </el-option>
  </el-select>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  export default{
    name: 'account-choose',
    data () {
      return {
        value: '',
        selectedList: [],
        channelType: '',
        flag: false
      }
    },
    mounted () {},
    computed: {
      bindingList () {
        return this.$store.state.develop.bindingList
      },
      placeholder () {
        return '社交账号筛选 ( ' + this.selectedList.length + '/' + this.bindingList.length + ' )'
      },
      accountId () {
        return this.$store.state.develop.accountId
      }
    },
    watch: {
      accountId () {
        if (this.flag) {
          this.selectedList = []
          this.bindingList.length = 0
          DevelopAPI.getChannelList({'queryUserId': this.accountId}).then(res => {
            if (res.data.code === 0) {
              let channelList = res.data.data
              let obj
              channelList.forEach((value, i) => {
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
                    // this.pinName = value.nickName
                    itemObj.type = 5
                    obj = itemObj
                  }
                }
              })
              if (obj) {
                this.bindingList.push(obj)
              }
              console.log(this.bindingList)
            }
          })
        } else {
          this.flag = true
        }
      }
    },
    methods: {
      accountSelect (event, value, index) {
        this.channelType = ''
        event.stopPropagation()
        let checkIndex = this.bindingList.indexOf(value)
        if (checkIndex !== -1) {
          let curItem = this.bindingList[checkIndex]
          if (typeof curItem.checked === 'undefined') {
            this.$store.commit('DEVELOP_CHANGEBINDLIST', { value: true, index: checkIndex })
          } else {
            this.$store.commit('DEVELOP_CHANGEBINDLIST', { value: !this.bindingList[checkIndex].checked, index: checkIndex })
          }
        }
        let selectListIndex = this.selectedList.indexOf(value)
        if (selectListIndex === -1) {
          this.selectedList.push(value)
        } else {
          this.bindingList.forEach((val, i) => {
            if (val.name === value.name && !val.checked) {
              this.selectedList.splice(selectListIndex, 1)
            }
          })
        }
        this.selectedList.forEach((val, i) => {
          this.channelType += val.type + ';'
        })
        this.$store.commit('DEVELOP_CHANNELTYPE', { channelType: this.channelType })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .el-select-dropdown.is-multiple{
    .account-option{
      &.selected::after{
        right: 17px;
        bottom: 18px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .account-select{
    ::-webkit-input-placeholder { /* WebKit browsers */
      color: @textColor !important;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: @textColor !important;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: @textColor !important;
    }
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: @textColor !important;
    }
    vertical-align: top;
    .el-select__tags{
      max-height: 30px;
      .el-tag{
        overflow: hidden;
        width: 39px;
        white-space: nowrap;
        .el-select__tags-text{
          overflow: hidden;
          display: inline-block;
          width: 12px;
        }
        .el-tag__close{
          top: -8px;
          width: 18px;
        }
      }
    }
    .el-input{
      width: 200px;
      .el-icon-caret-top:before {
        content: '\E609' !important;
      }
      .el-input__inner{
        height: 36px;
        font-size: 13px;
      }
    }
  }
  .el-select-dropdown__item.account-option{
    width: 280px;
    height: inherit;
    padding: 16px 16px 8px;
    &:hover{
      background: #FFF !important;
    }
    &.homepage-option{
      padding-top: 0;
    }
    &:first-child{
      padding-top: 16px;
    }
    &:last-child{
      padding-bottom: 16px;
    }
    .account-container{
      i.right{
        bottom: 12px;
        color: transparent;
      }
      &.is-selected{
        i.right{
          color: @activeBlue;
        }
      }
    }
    &.hover{
      background-color: @white;
      &.selected{
        background-color: @white;
      }
    }
    &.selected{
      color: inherit;
      background-color: @white;
    }
    &.is-disabled{
      cursor: pointer;
    }
    i.right{
      position: absolute;
      right: 16px;
      bottom: 15px;
      width: 250px;
      text-align: right;
      font-size: 20px;
      font-weight: inherit;
      color: @white;
    }
    .personal-info,.homepage-info{
      display: inline-block;
      img{
        float: left;
        width: 32px;
        height: 32px;
        margin-right: 8px;
        border-radius: 50%;
      }
      svg{
        font-size: 14px;
      }
      p{
        color: @textColor;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0;
        .channel{
          color: #7C98B6;
          font-weight: normal;
        }
      }
    }
    .homepage-info{
      padding-left: 24px;
    }
  }
</style>
