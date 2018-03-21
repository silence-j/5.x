<template>
  <div class="left-product">
    <!--banner修改 start-->
    <div id="update-topBanner" class="editor">
      <p class="title">背景图设置</p>
      <!-- <div class="banner-img"> -->
        <imgUpload v-if="!loadBannerImg" :defaultSrc="bannerSrc" @imgChange="avatarSuccess"></imgUpload>
      <!-- </div> -->
      <p class="desc">
        宽度为1920像素，高度为300像素，JPG，PNG图片格式，2M以内为最佳显示效果
      </p>
      <div class="fail" v-if="picUrl == 'error' && bannerErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>上传失败
        <p class="upload">{{ bannerErrorPrompt }}</p>
      </div>
      <div class="fail" v-if="picUrl != 'error' && bannerErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ bannerErrorPrompt }}</p>
      </div>
      <el-button type="primary" class="margintop32" @click="saveBannerFunc">保存</el-button>
    </div>
  
  </div>
</template>

<script>
  import myWebSiteApi from '../../../../../src/api/myWebSiteApi'
  import imgUpload from '../../../../components/imgUpload'
  export default{
    data () {
      return {
        imgDomain: process.env.IMG_DOMAIN,
        bgTip: '',
        descTip: '',
        bannerSrc: '',  // 有域名背景图片地址
        picUrl: '', // 无域名背景图片地址
        loadBannerImg: false,  // 是否上传banner图
        shopId: window.localStorage.shopId,
        bannerErrorPrompt: '',
        advertSysId: '',
        id: '',
        detailStr: []
      }
    },
    mounted () {
      myWebSiteApi.getAdvert({position: 'BLOG'}).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data
          if (data !== null && data.length > 0) {
            this.bannerSrc = data[0].pircUrlWhole
            this.advertSysId = data[0].advertId
            this.id = data[0].id
            this.picUrl = data[0].picUrl
          }
        }
      })
    },
    components: {
      imgUpload
    },
    methods: {
      setDirty () {
        this.$store.commit('SET_DIRTY', true)
      },
      // 背景图上传
      avatarSuccess (res) {
        if (!res.code) {
          this.$store.commit('SET_DIRTY', true)
          this.bannerSrc = res.urlWhole     // 图片地址 有域名
          // this.advertSysId = 1
          this.picUrl = res.urlWhole           // 图片地址  无域名
        } else {
          this.picUrl = 'error'
          this.bannerSrc = ''
          this.bannerErrorPrompt = res.message
        }
        this.loadBannerImg = false
      },
      // 背景图上传前验证
      beforeAvatarUpload (file) {
        console.log(file.type)
        this.loadBannerImg = true
        const isJPG = file.type
        const isLt10M = file.size / 1024 / 1024 < 10
        if (isJPG !== 'image/jpeg' && isJPG !== 'image/png') {
          // this.bannerErrorPrompt = '上传背景图片只能是JPG或PNG格式!'
          // this.loadBannerImg = false
          this.$message.error('上传背景图片只能是JPG或PNG格式!')
          this.loadBannerImg = false
          return false
        }
        if (!isLt10M) {
          // this.bannerErrorPrompt = '上传背景图片大小不能超过 2MB!'
          // this.loadBannerImg = false
          this.$message.error('上传背景图片大小不能超过 10MB!')
          this.loadBannerImg = false
          return false
        }
        if (!isJPG || !isLt10M) {
          this.picUrl = 'error'
          this.bannerSrc = ''
        }
        return isJPG && isLt10M
      },
      // 背景图修改保存
      saveBannerFunc () {
        if (this.picUrl === '' || this.picUrl === null || this.picUrl === undefined) {
          this.bannerErrorPrompt = '背景图不能为空'
          return
        }
        this.detailStr = []
        this.detailStr.push({
          shopId: this.shopId,
          picUrl: this.picUrl
        })
        this.$store.commit('SET_DIRTY', true)
        myWebSiteApi.saveBlogBanner({detailStr: JSON.stringify(this.detailStr)}).then(res => {
          if (res.data.code === 0) {
            this.bannerErrorPrompt = ''
            window.editorApi.iframeLoad()
            this.$message({
              message: '编辑背景图成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/base";
  @import "../../../../assets/style/variable";
  @import "../../../../assets/style/list";
  .margintop32{
    margin-top:32px;
  }
  .textarea-wraper{
    position: relative;
    .address{
      width:100%;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(203, 214, 227);
      outline:none;
      border-radius: 4px;
      height: 280px;
      padding:8px;
      box-sizing: border-box;
    }
    .address:focus {
      border: 1px solid #02AAAA;
      box-shadow: 1px 0 1px 0 #02AAAA;
    }
    .len-tip{
      color:#CCD6E2;
      position: absolute;
      bottom:16px;
      right:16px;
    }
  }
  .select-Info{
  .el-dialog__header{
    border:none;
  }
  }
  #update-topBanner{
    display:block;
  }
  .banner-img:hover{
    .hidden-btn{
      display:block;
    }
  }
  .banner-img{
    position: relative;
    width: 100%;
    height: 110px;
    margin-bottom: 15px;
    background: url(/static/img/mark.973c2ba.jpg);
    background-size: 8px 8px;
    overflow: hidden;
    border: 1px dashed #CBD6E3;
  .el-upload{
    width:100%;
    height:112px;
  }
  img{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    height: 100px;
  }
  .hidden-btn{
    display:none;
    position: absolute;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    text-align: right;
    width: 100%;
    background-color: rgba(80, 109, 149, 0.6);
    color: #fff;
    .file{
      width: 100%;
      height: 40px;
      line-height: 40px;
      opacity: 0;
    }
    p{
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 15px;
      i{
        margin-right:5px;
      }
    }
  }
  .hidden-btn-all{
    position: absolute;
    height: 112px;
    text-align: right;
    width: 100%;
    background-color:#fff;
    color: #fff;
    top:0;
  .file{
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  }
  .el-icon-plus{
    position: absolute;
    z-index: 999;
    top: 30%;
    left: 48%;
    color: #B0C1D3;
  }
  .uploda-desc{
    position: absolute;
    z-index: 999;
    top: 54%;
    left: 42%;
    color: #7D98B6;
  }
  }
  .remove-confirm{
    width:374px;
  .el-dialog__header{
    display:none;
  }
  .confirm-prompt{
    position:relative;
  .prompt-logo{
    position: absolute;
    color: #FF3B6E;
    font-size: 24px;
    top:0;
    left:17%;
    z-index: 99;
  }
  .desc{
    margin-left:30% ;
  }
  .desc-first{
    font-size: 14px;
    color: #33475B;
    line-height: 21px;
  }
  .desc-second{
    margin-top:8px;
  }
  }
  .center-btn{
    text-align: center;
  button{
    margin-top:0px;
  }
  }
  .red-btn{
  .el-button--primary{
    background:#FF3B6E;
    border:none;
  }
  }
  }
  .edit-pop{
    width:390px;
  .el-dialog__header{
    border: 1px solid #DFE3EB;
    padding-bottom: 13px;
  }
  .el-dialog__body{
    padding: 15px 20px;
    overflow: auto;
  .label-title{
    font-size: 13px;
    color: #33475B;
    line-height: 18px;
    margin-bottom:8px;
    margin-top:16px;
  }
  .input-display{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
  input{
    border:none;
    width:88%;
    padding:9px 0;
    text-indent: 16px;
  }
  .display{
    font-size: 13px;
    color: #CCD6E2;
    line-height: 18px;
  }
  }
  .upload{
  .el-upload{
    width:100%;
    border:1px dashed #CBD6E3;
    height:110px;
  .avatar{
    height:100px;
    margin-top:8px;
  }
  .el-icon-plus{
    margin-top:20px;
  }
  .uploda-desc{
    font-size: 12px;
    color: #7D98B6;
    line-height: 18px;
  }
  }
  }
  .prompt{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
    margin-top:8px;
  }
  }
  .left-btn{
    float:left;
  .el-button--primary{
    background: #EAF0F6;
    border: 1px solid #DFE3EB;
    color: #B0C1D4;;
  }
  }
  .el-dialog__footer{
    overflow:hidden;
  button{
    margin-top:0px;
  }
  .is-ok{
  .el-button--primary {
    color: #fff;
    background-color: #5488F9;
    border-color: #5488F9;
  }
  }
  }
  }
  .fail{
    height: 35px;
    width: 92%;
    margin-top: 32px;
    padding: 20px 4%;
    background: #FFEBF0;
    border: 1px solid rgba(255,255,255,0.80);
    border-radius: 4px;
    font-size: 14px;
    color: #404040;
  .fail-icon{
    font-size: 18px;
    vertical-align: top;
    padding-right: 8px;
    color: #FF3B6E;
  }
  .upload{
    padding-left: 25px;
    font-size: 12px;
    color: #666666;
  }
  }
  .left-product{
  .editor{
    float: left;
    width: 420px;
    padding: 16px 28px 16px 32px;
    min-height: 760px;
    max-height: 800px;
    overflow:auto;
    margin-right: 32px;
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    display: none;
  .bottom-prompt{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
    margin-top:16px;
  }
  .title{
    font-size: 18px;
    color: #33475B;
    margin-bottom: 16px;
  }
  .banner-img:hover {
  .hidden-btn {
    cursor: pointer;
    display: block;
    z-index: 999;
  }
  }
  .label-title{
    font-size: 13px;
    color: #32475A;
    line-height: 18px;
    margin-top:16px;
    margin-bottom:8px;
  }
  .input-module{
  .el-select{
    width:100%;
    height:34px;
  }
  .el-checkbox{
    width:33.3%;
    margin-left:0px;
    margin-top:11px;
    .el-checkbox__label{
      vertical-align: middle;
    }
  }
  .text-input{
    width:100%;
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    padding:8px 0;
    text-indent: 10px;
  }
  .el-date-editor{
    width:100%;
  }
  }
  .input-desc-module{
    width:100%;
    border: 1px solid #CBD6E3;
    border-radius: 4px;
  input{
    border:none;
  }
  .left-input{
    width:88%;
    padding:8px 0;
    text-indent: 8px;
    font-size: 13px;
    line-height: 18px;
  }
  span{
    width: 10%;
    text-align: center;
    display: inline-block;
    line-height: 19px;
    border-left: 1px solid #CAD6E2;
    font-size: 13px;
    color: #4F6D95;
  }
  }
  .have-word-count{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    overflow:hidden;
    width:413px;
  .textaaarea{
    border:none;
    width:393px;
    padding:5px 10px;
    font-size: 13px;
    color: #32475A;
  }
  .product{
    height:186px;
  }
  .address{
    height:120px;
  }
  p{
    font-size: 13px;
    color: #7C98B6;
    margin:8px 16px;
    float:right;
  }
  }
  .cert-model{
    border: 1px solid #DFE3EB;
    border-radius: 4px;
  .no-data{
    height:120px;
  }
  .second-title{
    background: #F5F8FA;
    border-radius: 4px;
    padding:11px 16px;
    font-size: 13px;
    color: #33475B;
    line-height: 22px;
    overflow:hidden;
  .cert-add{
    color: #B0C1D3;
    font-size:14px;
    float:right;
    cursor: pointer;
  }
  }
  .cert-list{
  .cert{
    display:block;
    overflow:hidden;
    padding:8px 16px;
    border-top:1px solid #DFE3EB;
    a{
      color: #33475B;
    }
  .cert-image{
    width:30px;
    height:40px;
    border:1px solid #DFE3EB;
  }
    .cart-logo{
      font-size: 26px;
      display: inline-block;
      margin-top: 10px;
    }
    .compress{
      color:#FFBA00 ;
    }
    .pdf{
      color: #EA545E;
    }
    .ppt{
      color:#e58830;
    }
    .word{
      color:#5488F9;
    }
    .shape{
      color:#7BD12C;
    }
    .weizhi{
      color:#B8C9D7;
    }
    .name{
      vertical-align:top;
      margin-left:20px;
      line-height: 40px;
      display: inline-block;
    }
    .operation{
      float:right;
      vertical-align:top;
      line-height: 40px;
      display:none;
      i{
        margin-left:10px;
        font-size: 15px;
        color: #B0C1D4;
        cursor: pointer;
      }
    }
  }
    .cert:hover{
      background: #F5F8FA;
      .operation{
        display:block;
      }
    }
  }
  }
  }
  .desc{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
  }
  .bottom-btn {
    .el-button{
      background: #EAF0F6;
      border: 1px solid #DFE3EB;
      color: #B0C1D4;
    }
  }
  .is-ok{
    .el-button {
      color: #fff;
      background-color: #5488F9;
      border-color: #5488F9;
    }
  }
  /*.el-button{
    margin-top: 32px;
  }*/
  .desc-input{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    overflow:hidden;
    margin-top:32px;
    margin-bottom:15px;
  .textaaarea{
    padding:23px 16px;
    width: 385px;
    height: 232px;
    font-size: 13px;
    color: #32475A;
    border:none;
  }
  p{
    font-size: 13px;
    color: #7C98B6;
    margin:8px 16px;
    float:right;
  }
  }
  }
</style>
