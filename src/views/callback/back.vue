<template>
</template>
<script>
  export default {
    name: 'channelList',
    data () {
      return {
        failedMsg: this.$route.query.failedMsg,
        type: this.$route.params.type
      }
    },
    components: {
    },
    methods: {
    },
    created () {
      var uaa = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(uaa)) {
      } else if (/android/.test(uaa)) {
      } else { // PC 端
        if (this.failedMsg !== '') {  // 错误弹框
          this.$message.error(decodeURIComponent(this.failedMsg))
          setTimeout(function () { window.close() }, 3000)
        } else {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
          if (this.type !== '' && this.type !== null && this.type !== undefined) {
            if (this.type === '2') {
              window.opener.Fshop.redirection()
            } else {
              window.opener.Fshop.loginSuccess()
            }
          } else {
            window.opener.Fshop.loginSuccess()
          }
          setTimeout(function () { window.close() }, 1000)
        }
      }
    }
  }
</script>
