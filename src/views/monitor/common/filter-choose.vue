<template>
  <el-select class="filter-select" :placeholder="placeholder">
    <el-checkbox class="check-all" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
    <el-option
      class="filter-option"
      v-for="(list,index) in dealList"
      :key="index"
      :value="list"
      v-if="list.type == 1 || list.type == 4"
      v-bind:disabled="true">
      <div class="account-container">
        <div class="personal-info">
          <img :src="list.url">
          <p>{{list.name}}</p>
          <p>
            <span v-if="list.type == 1">
              <i class="icon-font iconFont-facebook">&#xe6d9;</i>
              <span class="channel">Facebook</span>
            </span>
            <span v-if="list.type == 4">
              <i class="icon-font iconFont-twitter">&#xe6d2;</i>
              <span class="channel">Twitter</span>
            </span>
          </p>
        </div>
        <div class="check-section">
          <el-checkbox-group v-model="checkedFilters" @change="checkedFiltersChange">
            <el-checkbox checked v-for="(checkbox,index) in checkboxes" v-if="list.type == 1 && index < 3" :label="checkbox" :key="checkbox">{{checkbox.text}}</el-checkbox>
            <el-checkbox checked v-for="(checkbox,index) in checkboxes" v-if="list.type == 4 && index >= 3" :label="checkbox" :key="checkbox">{{checkbox.text}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script>
  import MonitorAPI from '@/api/monitorAPI'

  const filterOptions = [{text: '留言', id: 1, type: 6}, {text: '评论', id: 2, type: 4}, {text: '转发', id: 3, type: 5}, {text: '提到', id: 4, type: 9}, {text: '转推', id: 5, type: 10}, {text: '关注', id: 6, type: 7}]
  export default{
    name: 'filter-choose',
    data () {
      return {
        checkedFilters: [],
        checkboxes: filterOptions,
        isIndeterminate: false,
        channelList: [], // 保存渠道列表
        bindingList: [], // 保存处理后的渠道列表
        dealList: [],
        filtersNumber: 0 // 保存可筛选总数
      }
    },
    mounted () {
      this.getChannelList(this.queryId)
      // 默认全选
    },
    watch: {
    },
    computed: {
      placeholder () {
        return '社交账号筛选 ( ' + this.checkedFilters.length + '/' + this.filtersNumber + ' )'
      },
      checkAll () {
        return this.checkedFilters.length === this.dealList.length * 3
      },
      AllOption () {
        let AllOption = []
        this.dealList.forEach((value, i) => {
          if (value.type === 1) {
            AllOption.push(filterOptions[0])
            AllOption.push(filterOptions[1])
            AllOption.push(filterOptions[2])
          } else if (value.type === 4) {
            AllOption.push(filterOptions[3])
            AllOption.push(filterOptions[4])
            AllOption.push(filterOptions[5])
          }
        })
        return AllOption
      }
    },
    props: [
      'queryId'
    ],
    methods: {
      /*
       * 获取绑定渠道列表
       * */
      getChannelList (val) {
        MonitorAPI.getChannelList({'queryUserId': val}).then(res => {
          if (res.data.code === 0) {
            this.channelList = res.data.data
            this.bindingList = []
            this.dealList = []
            this.checkedFilters = []
            this.filtersNumber = 0
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
                  // itemObj.type = 0
                  // this.bindingList.push(itemObj)
                  if (value.homePageId) {
                    this.filtersNumber += 3
                    homeObj.type = 1
                    this.bindingList.push(homeObj)
                    this.dealList.push(homeObj)
                  }
                  console.log(this.bindingList)
                } else if (value.channelId === 'TWITTER') {
                  this.filtersNumber += 3
                  itemObj.type = 4
                  this.bindingList.push(itemObj)
                  this.dealList.push(itemObj)
                } else if (value.channelId === 'LINKEDIN') {
                  itemObj.type = 2
                  this.bindingList.push(itemObj)
                  if (value.homePageId) {
                    homeObj.type = 3
                    this.bindingList.push(homeObj)
                  }
                } else if (value.channelId === 'PINTEREST') {
                  itemObj.type = 5
                  this.bindingList.push(itemObj)
                }
              }
              if (value.channelId === 'MAIL') {
                this.$store.commit('MONITOR_BINDINGMAIL', { bindingMail: value })
              }
            })
            this.$store.commit('MONITOR_BINDINGLIST', { bindingList: this.bindingList })
            // this.checkAllChange(1)
          }
        })
        // console.log('bindingList')
        // console.log(this.bindingList)
        // console.log('dealList')
        // console.log(this.dealList)
      },
      checkAllChange (event) {
        if (event === 1) {
          this.checkedFilters = this.AllOption
        } else {
          this.checkedFilters = event.target.checked ? this.AllOption : []
        }
        this.isIndeterminate = false
        this.changeModel()
      },
      checkedFiltersChange (value) {
        let checkedCount = value.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dealList.length * 3
        this.changeModel()
      },
      changeModel () {
        let opportunityType = ''
        this.checkedFilters.forEach((value, index) => {
          opportunityType += value.type + ';'
        })
        if (this.checkedFilters.length === 0) {
          opportunityType = 'noChecked'
        }
        this.$emit('recommendPagePage')
        this.$store.commit('MONITOR_OPPORTUNITYTYPE', { opportunityType: opportunityType })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import '../../../assets/style/variable';
  .social-monitor{ /*modify by shaohuan*/
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
  }
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
  .filter-select{
    vertical-align: top;
    .el-input{
      width: 200px;
      .el-icon-caret-top:before {
        content: '\E609' !important;
      }
      .el-input__inner{
        height: 34px;
        font-size: 13px;
      }
    }
  }
  .filter-option{
    width: 460px;
    height: inherit;
    padding: 5px 16px;
    border-top: 1px solid #F5F8FA;
    &.is-disabled{
      cursor: default;
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
    .account-container{
      position: relative;
      .personal-info{
        display: inline-block;
        img{
          float: left;
          width: 32px;
          height: 32px;
          margin-top: 2px;
          margin-right: 8px;
          border-radius: 50%;
        }
        p{
          font-size: 12px;
          &:last-child{
            span{
              color: #7C98B6;
            }
          }
        }
        i.right{
          position: absolute;
          right: 0;
          bottom: 5px;
          font-size: 20px;
          font-weight: inherit;
          color: @activeBlue;
        }
      }
    }
  }
  .check-all{
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 16px;
    .is-indeterminate{
      .el-checkbox__inner::before{
        left: 2px;
        right: 2px;
      }
    }
    .el-checkbox__inner{
      width: 14px;
      height: 14px;
      &::after{
        left: 2px;
        top: -1px;
      }
    }
    .el-checkbox__label{
      font-size: 13px;
      color: @font-title-color;
    }
  }
  .check-section{
    position: absolute;
    right: 0;
    top: 0;
    line-height: 38px;
    .el-checkbox__inner{
      width: 14px;
      height: 14px;
      &::after{
        left: 2px;
        top: -1px;
      }
    }
    .el-checkbox__label{
      font-size: 13px;
      color: @font-title-color;
    }
  }
</style>
