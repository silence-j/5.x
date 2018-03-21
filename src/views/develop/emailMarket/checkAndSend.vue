<template>
  <div class="check-wrapper">
    <div class="check-title">
      <h1>检查</h1>
      <p>(在发送您的营销邮件之前，请查看以下反馈)</p>
    </div>
    <div class="check-item">
      <span class="icon-font right" v-show="extendRight">&#xe650;</span>
      <span class="icon-font" v-show="!extendRight">&#xe651;</span>
      <div class="item-content">
        <h2 class="title">邮件推广名称</h2>
        <p>{{extendName}}</p>
      </div>
      <el-button @click="reEdit">编辑</el-button>
    </div>
    <div class="check-item">
      <span class="icon-font right">&#xe650;</span>
      <div class="item-content">
        <h2 class="title">发件人</h2>
        <p>{{senderName}}</p>
      </div>
    </div>
    <div class="check-item">
      <span class="icon-font right" v-show="titleRight">&#xe650;</span>
      <span class="icon-font" v-show="!titleRight">&#xe651;</span>
      <div class="item-content">
        <h2 class="title">邮件标题</h2>
        <p>{{mailTitle}}</p>
      </div>
      <el-button @click="reEdit">编辑</el-button>
    </div>
    <div class="check-item">
      <span class="icon-font right" v-show="recipRight">&#xe650;</span>
      <span class="icon-font" v-show="!recipRight">&#xe651;</span>
      <div class="item-content">
        <h2 class="title">收件人</h2>
        <div class="recip-wrapper">
          <h3>发送给:</h3>
          <!-- 联系人 -->
          <div class="recip-item" v-for="(item, index) in recipList" :key="index">
            <span class="icon-font">&#xe654;</span>
            <span class="recip-name">{{item.firstname}}{{item.lastname}}&lt;{{item.address}}&gt;</span>
          </div>
          <!-- 组 -->
          <div class="recip-item" v-for="(item, index) in recipList2" :key="index">
            <span class="icon-font">&#xe654;</span>
            <span class="recip-name">{{item.groupName}}({{item.contactsCount}})</span>
          </div>
        </div>
      </div>
      <el-button @click="backRecip">编辑</el-button>
    </div>
    <div class="recip-count">
      <h2 class="count-title">收件人数量</h2>
      <span class="count-number">{{recipNum}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        extendRight: false,
        titleRight: false,
        recipRight: false,
        // 发件人邮箱
        senderName: '',
        // 邮件推广名称
        extendName: '',
        // 邮件标题
        mailTitle: '',
        // 邮件内容的数组格式
        recipList: [],
        recipList2: [],
        recipNum: window.localStorage.recipercount
      }
    },
    components: {

    },
    mounted: function () {
      let sendInfo = this.$store.state.develop.sendInfo
      this.senderName = `${sendInfo.first.senderName}<${sendInfo.first.sender}>`
      // this.senderName = `${JSON.parse(localStorage.user).name}<${sendInfo.first.sender}>`
      if (sendInfo.first.title && !/^\s+$/.test(sendInfo.first.title)) {
        this.extendRight = true
        this.extendName = sendInfo.first.title
      }
      if (sendInfo.first.subject && !/^\s+$/.test(sendInfo.first.subject)) {
        this.titleRight = true
        this.mailTitle = sendInfo.first.subject
      }
      // if (sendInfo.second.length > 0) {
      //   this.recipRight = true
      //   this.recipList = sendInfo.second
      // }
      let contact = sendInfo.second.contactsIds
      let group = sendInfo.second.contactsGroupIds
      if (contact && contact.length) {
        this.recipRight = true
        this.recipList = contact
      }
      if (group && group.length) {
        this.recipRight = true
        this.recipList2 = group
      }
      if ((this.extendRight && this.titleRight && this.recipRight) === true) {
        this.$emit('ischeckWrong', true)
      } else {
        this.$emit('ischeckWrong', false)
      }
    },
    methods: {
      reEdit () {
        this.$emit('backCreate', 0)
      },
      backRecip () {
        this.$emit('backCreate', 1)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .check-wrapper{
    width: 1200px;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0,0,0,0.08);
    border-radius: 4px;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
    .check-title{
      width: 100%;
      height: 102px;
      text-align: center;
      border-bottom: 2px solid #eaf0f6;
      box-sizing: border-box;
      margin-bottom: 23px;
      h1{
        font-size: 24px;
        color: #33475b;
        padding-top: 32px;
        padding-bottom: 17px;
      }
      p{
        font-size: 13px;
        color: #7c98b6;
      }
    }
    .check-item{
      position: relative;
      padding: 24px 0 26px 22px;
      border-bottom: 1px dashed #dfe3eb;
      .el-button{
        position: absolute;
        top: 23px;
        right: 26px;
        padding: 7px 26px;
        font-size: 13px;
      }
      .icon-font{
        color: #ff3b6e;
        font-size: 29px;
        vertical-align: top;
      }
      .right{
        color: #5488f9;
      }
      .item-content{
        display: inline-block;
        vertical-align: top;
        margin-left: 14px;
        .title{
          font-size: 16px;
          color: #33475b;
          margin-bottom: 12px;
        }
        p{
          font-size: 13px;
          color: #4f6d95;
        }
        .recip-wrapper{
          padding-top: 5px;
          h3{
            font-size: 13px;
            color: #33475b;
            margin-bottom: 15px;
          }
          .recip-item{
            color: #4f6d95;
            margin-bottom: 9px;
            .icon-font{
              font-size: 14px;
              color: #4f6d95;
              vertical-align: top;
            }
            .recip-name{
              display: inline-block;
              vertical-align: top;
            }
          }
        }
      }
    }
    .recip-count{
      position: relative;
      width: 100%;
      height: 122px;
      padding: 33px 20px 26px 72px;
      box-sizing: border-box;
      .count-title{
        font-size: 16px;
        color: #33475b;
      }
      .count-number{
        position: absolute;
        top: 33px;
        right: 20px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
</style>
