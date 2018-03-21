<template>
  <div class="send-success-wrapper">
    <div class="middle-box" v-if="!isTiming">
      <img src="../../../assets/img/develop/success.png" alt="">
      <h1>发送成功</h1>
      <p class="tip">您的营销邮件已在发送队列</p>
      <p class="reciper-count">(您的营销邮件将发送给“{{reciperCount}}”个人)</p>
      <el-button type="primary" @click="backList">返回邮件列表</el-button>
    </div>
    <div class="middle-box" v-if="isTiming">
      <img src="../../../assets/img/develop/timing-success.png" alt="">
      <h1>排期中</h1>
      <p class="tip">您的营销邮件已加入待发送队列</p>
      <p class="reciper-count">（您的营销邮件将于{{timeVal}}发送）</p>
      <el-button type="primary" @click="backList">返回邮件列表</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        isTiming: false,
        timeVal: '',
        reciperCount: 0
      }
    },
    components: {

    },
    mounted: function () {
      // 判断是立即发送还是定时发送
      if (this.$store.state.develop.isTiming.length > 0) {
        this.isTiming = true
        this.timeVal = this.$store.state.develop.isTiming
      } else if (window.localStorage.recipercount) {
        this.reciperCount = window.localStorage.recipercount
      }
    },
    methods: {
      backList () {
        this.$router.push({path: '/emailmarketing'})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .send-success-wrapper{
    width: 1200px;
    height: 660px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    margin: 31px auto 0 auto;
    background-color: #fff;
    text-align: center;
    .middle-box{
      width: 300px;
      height: 320px;
      margin: 0 auto;
      padding-top: 153px;
      h1{
        font-size: 24px;
        color: #33475b;
        margin: 20px 0;
      }
      .tip{
        font-size: 15px;
        color: #33475b;
        margin-bottom: 10px;
      }
      .reciper-count{
        font-size: 13px;
        color: #7c98b6;
        margin-bottom: 29px;
      }
      .el-button{
        padding: 10px 27px;
      }
    }
  }
</style>
