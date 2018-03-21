<template>
  <div v-if="isLoaded">
    <div class="no-data margintop16 n-bindAccount" v-if=" result=='' || result==null || result=='null'">
      <div class="no-contentPay">      
        <p class="center display-img"><img src="../../../assets/img/orderLogistics/bind_paypal.png" alt=""></p>
        <p class="center">
          <span class="btn bluebg-whitefc-btn" @click="openPayPal()">开通</span>
        </p>
        <p class="center margintop16">
            <span>没有paypal账号,
              <a class="btn_once_free" style="color: #5488F9;" href="https://www.paypal.com/webapps/merchantboarding/webflow/externalpartnerflow?&amp;partnerId=8ZM22TTLAR2KW&amp;productIntentID=addipmt&amp;returnToPartnerUrl=http://www.loonxi.com&amp;partnerLogoUrl=&amp;permissionNeeded=EXPRESS_CHECKOUT&amp;displayMode=regular&amp;integrationType=T&amp;showPermissions=TRUE&amp;countryCode=&amp;merchantId=" target="_blank">立即免费获取</a>
            </span>
        </p>
      </div>
    </div>
    <div class="no-data margintop16 n-bindAccount" v-else>
      <p class="center display-img"><img src="../../../assets/img/orderLogistics/bind_img.png" alt=""></p>
      <p class="title_desc center">账户</p>
      <p class="bind_account center">{{ result.accountName }}</p>
      <p class="center">
        <el-button type="default" class="btn whitebg-blackfc-btn" @click="openPOP()">解除绑定</el-button>
      </p>
    </div>
  </div>
</template>
<script>
  import orderLogisticsAPI from '@/api/orderLogisticsAPI'
  export default {
    data () {
      return {
        resultUrl: '',
        isLoaded: false,
        result: {}
      }
    },
    components: {
      orderLogisticsAPI
    },
    methods: {
      // 开通绑定
      openPayPal () {
        window.open(this.resultUrl, '', 'height=300, width=500, toolbar =no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no')
      },
      // 解除绑定
      releaseBind () {
        orderLogisticsAPI.removeAccount().then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '解除绑定成功!'
            })
            location.reload()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      openPOP () {
        this.$confirm('确认取消绑定账号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.releaseBind()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    created () {
      window.Fshop = {
        redirection: function () {
          let url = location.protocol + '//' + window.location.host + '/#/fundsManagement'
          window.location.href = url
        }
      }
      // 是否绑定账户数据获取
      orderLogisticsAPI.isBindAccount({payMethod: 'PAYPAL'}).then((res) => {
        this.result = res.data.data
        this.isLoaded = true
        console.log(this.result)
      })
      // paypal绑定初始化
      orderLogisticsAPI.bindAccount().then((res) => {
        this.resultUrl = res.data.data
        console.log(this.resultUrl)
      })
    }
  }
</script>
<style lang='less'>
  @import '../../../assets/style/list.less';
</style>

