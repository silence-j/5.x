<template>
  <div class="textArea-container" :class="isLimitOver?'limitOver':''">
    <span class="triangle-up" :class="{comment: (item.opportunityType == 4), isShare: (type == 2)}"></span>
    <span class="triangle-up white" :class="{comment: (item.opportunityType == 4), isShare: (type == 2)}"></span>
    <div class="area-header" v-for="account in item.socialAccounts" v-if="account.socialAccountType == item.socialAccountType">
      <img :src="account.accountAvatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
      <span>{{account.accountName}}</span>
    </div>
    <textarea @input="writeText" v-model="content"></textarea>
    <div class="limit-section">
      <span>
        <span>{{content.length}}</span>
        /
        <span>{{maxLength}}</span>
      </span>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        content: '',
        maxLength: 0,
        isLimitOver: false,
        timer: null,
        hasError: false
      }
    },
    props: {
      item: Object,
      type: Number
    },
    mounted () {
      // 定义 最大字符限制规则
      switch (this.item.socialAccountType) {
        case 0 : this.maxLength = 2000
          break
        case 1 : this.maxLength = 2000
          break
        case 2 : this.maxLength = 140
          break
        case 3 : this.maxLength = 1300
          break
        case 4 : this.maxLength = 1300
          break
      }
    },
    watch: {
      type () {
        if (this.type === 1 && this.item.socialAccountType === 2) {
          this.content = '@' + this.item.senderScreenName + ' '
        } else {
          this.content = ''
        }
        this.isLimitOver = false
        this.$store.commit('MONITOR_TEXTAREA', {textContent: this.content, isLimit: this.isLimitOver})
      },
      content () {
        if (this.content.length > this.maxLength) {
          this.content = this.content.substring(0, this.maxLength)
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
            this.hasError = true
          }
        }
      }
    },
    methods: {
      writeText () {
//        if (this.content.length > this.maxLength + 1) {
//          this.isLimitOver = true
//        } else {
//          this.isLimitOver = false
//        }
        this.$store.commit('MONITOR_TEXTAREA', {textContent: this.content, isLimit: this.isLimitOver})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .textArea-container {
    position: relative;
    width: 449px;
    height: 168px;
    margin-top: 20px;
    padding: 14px 12px;
    border: 1px solid @textareaBorder;
    border-radius: 4px;
    box-sizing: border-box;
    box-shadow: 0 0 2px rgba(2,170,170,0.20);
    &.limitOver {
      border: 1px solid red;
      .triangle-up {
        border-bottom:7px solid red;
      }
    }
    .triangle-up {
      position: absolute;
      top: -7px;
      left: 83px;
      width:0;
      height:0;
      border-left:7px solid transparent;
      border-right:7px solid transparent;
      border-bottom:7px solid @textareaBorder;
      z-index: 10;
      &.comment{
        left: 415px;
      }
      &.isShare{
        left: 150px;
      }
      &.white{
        top: -6px;
        border-bottom:7px solid @white;
        z-index: 11;
      }
    }
    .area-header{
      position: relative;
      padding-bottom: 10px;
      border-bottom: 1px solid @textBorderColor;
      img{
        width: 28px;
        height: 28px;
        border-radius: 50%;
        vertical-align: middle;
      }
      span{
        position: absolute;
        top: 7px;
        margin-left: 8px;
        font-size: 13px;
        color: @textColor;
        font-weight: bolder;
      }
    }
    textarea {
      width: 423px;
      height: 72px;
      line-height: 18px;
      padding: 8px 0;
      font-size: 13px;
      border:none;
      border-radius: 4px;
      color: @textColor;
      resize: none;
      outline: none;
    }
    .limit-section{
      text-align: right;
      font-size: 13px;
      color: @detailTextColor;
    }
    .words-num-limit {
      position: absolute;
      bottom: 13px;
      right: 10px;
      font-size: 12px;
      span {
        color: grey;
      }
      span.words-num {
        color: grey;
      }
      span.limit-over {
        color: red;
      }
      i {
        margin-left: 2px;
        font-size: 14px;
        color: grey;
      }
    }
  }
  .words-num-limit .item .el-tooltip__rel .el-button{
    width: 23px;
    height:20px;
    border:none;
    padding: 0;
  }
</style>
