<template>
  <div class="url-content">
    <div class="left">
      <img class="url-img" :src="imgUrl" alt="">
    </div>
    <div class="right">
      <div class="title">活动链接URL:</div>
      <div class="input-content">
        <textarea id="copyLinkUrl" style="opacity: 0;position: absolute;top:0">{{ url }}</textarea>
        <el-input v-model="url" :disabled="true" class="input-xl b-title" :maxlength="160"></el-input>
        <input class="hidden-input" :ref="'selectedInput'" type="text" v-model="url">
      </div>
      <el-button @click="copy">复制链接</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UrlActivity',
    data () {
      return {
        imgUrl: ''
      }
    },
    computed: {
      url () {
        return this.$store.state.develop.activitySendInfo.third.url || ''
      }
    },
    beforeMount () {
      // console.log(this.$store.state.develop.activitySendInfo.third.url)
      let url = this.$store.state.develop.activitySendInfo.third.url
      // TODO 调用生成二维码的接口 赋值给imgUrl
      // 获取二维码方法
      this.imgUrl = process.env.DOMAIN + '/bshop/index/getqrcode?content=' + url
    },
    methods: {
      copy () {
        let Url2 = document.getElementById('copyLinkUrl')
        console.log(Url2)
        Url2.select()    // 选择对象
        document.execCommand('Copy', false, null)     // 执行浏览器复制命令
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        // let sp = this.$refs.selectedInput
        // sp.focus()
        // sp.select()
        // try {
        //   if (document.execCommand('copy', false, null)) {
        //     this.$message.success('已复制到粘贴板')
        //   } else {
        //     // fail info
        //   }
        // } catch (err) {
        //   // fail info
        // }
      }
    }
  }
</script>
<style lang="less">
  .url-content{
    padding-top: 80px;
    .left{
      float: left;
      .url-img{
        width: 200px;
        margin-top: -20px;
      }
    }
    .right{
      float: right;
      width: 430px;
      .title{
        font-size: 14px;
        color: #333333;
        height: 30px;
        line-height: 24px;
      }
      .input-content{
        margin-bottom: 30px;
        .hidden-input{
          width: 0;
          height: 0;
          overflow: hidden;
          border: none;
          outline: none;
          visibility: hidden;
        }
      }
    }
  }
</style>

