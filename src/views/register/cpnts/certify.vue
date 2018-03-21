<template>
  <div id="container">
    <div id="header">
      <div class="left">
        <img src="../../../assets/img/logo.svg" alt="">
        <span class="line"></span>
        <span class="shop">创建店铺</span>
      </div>
      <div class="right">
        <b class="icon-font">&#xe676;</b>
        <span>0571-56581798</span>
      </div>
    </div>


    <div id="main" v-show="certifyIng" class="main">
      <div class="certify_result">
        <b class="certify icon-font">&#xe604;</b>
        <span>认证中</span>
      </div>
      <div class="bg_frame">
        <div class="message">
          <p class="certify_wait">
            您的认证已提交，将会在1-2个工作日内认证完成，请耐心等待！
          </p>
        </div>
        <div class="customer_service">
          任何疑问请联系客服，客服电话：0571-5658 1798
        </div>
      </div>
    </div>

    <div id="main2" v-show="certifyFail" class="main">
      <div class="certify_result">
        <b class="fault icon-font">&#xe605;</b>
        <span>认证失败</span>
      </div>
      <div class="bg_frame">
        <div class="message">
          <h4>很遗憾，您没有通过我们的企业认证</h4>
        </div>
        <div class="tip">
          <div>
            失败原因：
            <p class="fault_reason">{{faultReason}}</p>
          </div>
        </div>
        <input type="button" id="editShop" value="修改资料，再次提交" @click='again'>
        <div class="customer_service">
          任何疑问请联系客服，客服电话：0571-5658 1798
        </div>
      </div>
    </div>

    <div id="main3" v-show="certifySuc" class="main">
      <div class="certify_result">
        <b class="success icon-font">&#xe606;</b>
        <span>认证通过</span>
      </div>
      <div class="bg_frame">
        <div class="message">
          <h4>您已通过了我们的企业认证，付费开通后即可享受我们的服务</h4>
          <p >
            您的销售专员：<span class="sale_phone">0571-5658 1798</span>
          </p>
        </div>
        <div class="tip">
          <div>
            <p>(销售专员将会在1-2个工作日内与您联系。付款后即可开始跨境电商之旅！)</p>
          </div>
        </div>
        <input type="button" value="试用一下" id="doTry" @click="doTry">
        <!--
        <a href="javascript:;" id="doTry">试用一下</a>
        -->
        <div class="customer_service">
          任何疑问请联系客服，客服电话：0571-5658 1798
        </div>
      </div>
    </div>

    <!--账户到期（new）-->
    <div class="new-success" v-if="certifyNo">
      <div class="new-bg">
        <!--<img src="../../../assets/img/asset.png" class="img" alt="">-->
        <!--<p class="new-submit">很抱歉,你的账户已到期</p>-->
        <!--<p class="fourty">客户服务热线 : 400-780-5353</p>-->
        <!--&lt;!&ndash;<el-button class="tryIt">开始试用</el-button>&ndash;&gt;-->
        <!--<p class="line-today" style="margin-top: 154px;">销售专员将会在1-2个工作日内与你联系,付款后即可开始跨境电商之旅！若30个工作日未付款,系统将关闭您的账户</p>-->
        <img src="../../../assets/img/past.png" class="img" alt="">
        <p class="new-submit">认证进行中...</p>
        <p class="fourty"></p>
        <el-button class="tryAll"></el-button>
        <p class="line-today">感谢您提交公司认证，销售专员将会在1～2个工作日与您取得联系，再有一步即可开启外贸新时代。</p>
      </div>
    </div>
    <div id="footer">
      <div class="br"></div>
      <!--<p>百图之上位，业内之首席， 成就客户在互联网领域的新发展、新成功</p>-->
      <p>&copy; onLoon.cn版权所有</p>
      <!--<p>&copy;2013-2016 Loonxi.com版权所有 杭州龙席网络科技股份有限公司 浙ICP备13021125号-2</p>-->

    </div>
  </div>
</template>

<script>
  import registerApi from '@/api/registerApi'
  export default {
    name: 'certify',
    data () {
      return {
        certifyIng: false,
        certifySuc: false,
        certifyFail: false,
        certifyNo: true,
        shopStatus: -1,
        faultReason: ''
      }
    },
    mounted: function () {
//      企业信息查询接口
      this.Search()
    },
    methods: {
      again: function () {
        this.$router.push({
          path: '/CreateShop',
          query: {modifyAgain: 'true'}
        })
      },
      doTry: function () {
        console.log(999)
        if (this.shopStatus === 4) {
          this.$router.push('/index')
        } else {
          registerApi.FirstUse().then(res => {
            if (res.data.code === 0) {
              this.$router.push('/index')
            } else {
              console.log('申请失败')
            }
          })
        }
      },
      Search: function () {
        registerApi.SearchCertify().then(res => {
          if (res.data.code === 0) {
            console.log(res.data)
            this.shopStatus = res.data.data.shop.shopStatus
//            未认证
            if (this.shopStatus === 0) {
              this.$router.push('/CreateShop')
            }
//            认证中
            if (this.shopStatus === 1) {
              this.certifyIng = true
            } else {
              this.certifyIng = false
            }
//            认证失败
            if (this.shopStatus === 3) {
              this.faultReason = res.data.data.shop.refuseReason
              this.certifyFail = true
            } else {
              this.certifyFail = false
            }
//            认证成功
            if (this.shopStatus === 2 || this.shopStatus === 4) {
              this.certifySuc = true
              this.doTry()
            } else {
              this.certifySuc = false
            }
//            认证到期
            if (this.shopStatus === 5 || this.shopStatus === 7) {
              this.certifyNo = true
            } else {
              this.certifyNo = false
            }
//            认证正常
            if (this.shopStatus === 6) {
              this.$router.push('/index')
            }
          } else {
            alert(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  body {
    background: white;
    #container {
      width: 1200px;
      height: 768px;
      margin: 0 auto;
      .new-success{
        width:1200px;
        height: 668px;
        border: 1px solid #CBD6E2;
        background: #fff;
        .new-bg{
          width:884px;
          height: 504px;
          background: url(../../../assets/img/register/new-bg.png) no-repeat;
          text-align:center;
          margin: 100px auto 0;
          .img{
            margin-top: 60px;
          }
          .new-submit{
            margin-top: 25px;
            font-size: 20px;
            color: #1F2D3D;
          }
          .fourty{
            margin-top: 16px;
            font-size: 13px;
            color: #4F6D95;
          }
          .tryIt{
            margin-top: 65px;
            width:140px;
            height: 40px;
            background: #5488F9;
            border-radius: 4px;
            color: #fff;
          }
          .tryAll{
            margin-top: 65px;
            width:140px;
            height: 40px;
            border: none;
            background: none;
          }
          .line-today{
            margin-top: 54px;
            width:860px;
            height: 42px;
            line-height: 42px;
            text-align: center;
            background: #F2F2F2;
            font-size: 13px;
            color: #7C98B6;
            margin-left: 14px;
          }

        }
      }
    }
    #header {
      overflow: hidden;
      margin-bottom: 20px;
    }
    #header .left {
      float: left;
    }
    #header .left .line {
      display: inline-block;
      width:2px;
      height: 20px;
      background:  #CBD6E2;
      margin: 0 16px;
    }
    #header .left .shop {
      display: inline-block;
      font-size: 14px;
      color: #33475B;
      vertical-align: super;
    }
    #header .left img {
      display: inline-block;
      width: 23%;
      vertical-align: text-bottom;
      //height:50px;
      /*margin: 14px 10px 0 0;*/
      //background: url(../../../assets/img/logo.png) no-repeat;
    }
    #header .right {
      float: right;
      padding-top: 14px;
    }
    #header .right b {
      display: inline-block;
      /*width: 34px;*/
      /*height: 30px;*/
      /*margin-top: 42px;*/
      vertical-align: bottom;
      font-size: 18px;
      color: #5488F9;
      margin-right: 5px;
    }
    #header .right span {
      display: inline-block;
      font-size: 18px;
      /*font-weight: bold;*/
      color: #5488F9;
    }
    .main {
      width: 1198px;
      height: 595px;
      margin-top: 20px;
      border: 1px solid #F8F8F8;
    }
    .main .certify_result {
      width: 146px;
      margin: 35px auto 15px;
    }
    .main .certify_result b {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-right: 5px;
      vertical-align: bottom;
    }
    .main .certify_result .certify {
      font-size: 36px;
      color: #FF8E2B;
    }
    .main .certify_result .fault {
      font-size: 36px;
      color: #FC403F;
    }
    .main .certify_result .success {
      font-size: 36px;
      color: #54C472;
    }
    .main .certify_result b.success {
      // background: url(../../images/icon.png) no-repeat -630px -145px;
    }
    .main .certify_result b.fault {
      // background: url(../../images/icon.png) no-repeat -580px -203px;
    }
    .main .certify_result b.certify {
      // background: url(../../images/icon.png) no-repeat -580px -145px;
    }
    .main .certify_result b.maturity {
      //  background: url(../../images/icon.png) no-repeat -530px -203px;
    }
    .main .certify_result span {
      display: inline-block;
      height: 36px;
      line-height: 36px;
      font-size: 25px;
      font-weight: 500;
      color: #2D3238;
      vertical-align: bottom;
    }
    .main .bg_frame .message > p.certify_wait {
      padding-top: 120px;
      font-size: 14px;
      color: #424242;
    }
    .main .bg_frame {
      position: relative;
      width: 890px;
      height: 475px;
      text-align: center;
      color: #797979;
      background: url(../../../assets/img/register/bg-frame.png) no-repeat;
      margin: 0 auto;
    }
    .main .bg_frame .message {
      height: 115px;
    }
    .main .bg_frame h4 {
      padding-top: 60px;
      margin-bottom: 15px;
      color: #606060;
    }
    .main .bg_frame .message > p {
      font-size: 14px;
      color: #949494;
    }
    .main .bg_frame p .sale_phone {
      color: #363636;
    }
    .main .bg_frame div.tip {
      width: 700px;
      color: #666;
      border-top: 1px dashed #DCDCDC;
      margin: 0 auto;
    }
    .main .bg_frame div.tip div {
      margin-top: 10px;
    }
    .main .bg_frame div.tip p {
      display: inline-block;
      line-height: 20px;
    }
    .main .bg_frame div.tip .sale-staff {
      padding-top: 10px;
    }
    .main .bg_frame > input {
      width: 170px;
      height: 40px;
      line-height: 40px;
      margin-top: 50px;
      margin-bottom: 10px;
      font-size: 16px;
      color: #fff;
      border: none;
      border-radius: 4px;
      background-color: #3385ff;
      cursor: pointer;
    }
    .main .bg_frame > a {
      display: block;
      font-size: 14px;
      color: #666;
    }
    .main div.customer_service {
      position: absolute;
      left: 45px;
      bottom: 110px;
      width: 800px;
      height: 40px;
      line-height: 40px;
      color: #999;
      background-color: #F0F0F0;
    }

    #footer div.br {
      margin-top: 35px;
      border-top: 2px solid #E5E5E5;
    }
    #footer p {
      text-align: center;
      margin-top: 15px;
      color: #ADADAD;
    }
  }
</style>
