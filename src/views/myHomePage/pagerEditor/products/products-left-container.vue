<template>
  <div class="left-product">
    <div id="product-banner" class="top">
      <p class="title">背景图设置</p>
      <imgUpload v-if="!loadBannerImg" :defaultSrc="bannerSrc" @imgChange="changeBanner"></imgUpload>
      <p class="desc">
        {{bgTip}}
      </p>
      <div class="fail" v-show="display">
        <i class="icon-font fail-icon">&#xe605;</i>上传失败
        <p class="upload">请上传2M以内的图片</p>
      </div>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
  import myWebSiteApi from '../../../../../src/api/myWebSiteApi'
  import websiteStyleAPI from '@/api/websiteStyleAPI'
  import imgUpload from '../../../../components/imgUpload'
  export default{
    data () {
      return {
                 /**
         * 面料、辅料、皮革模板:15
          product:1920*250
          五金工具:11
          product:1920*250
          电子灯具模板:16
          product:1920*400
          医疗模板:13
          product:1920*300
          汽车用品模板:19
          product:1920*250
          户外运动：1
         * @type {Object}
         */
        bgTipArray: {
          '15': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '11': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '16': {
            'tip': '宽度为1920像素，高度为400像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '13': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '19': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '1': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '12': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '14': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '17': {
            'tip': '宽度为1920像素，高度为400像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '18': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '20': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          },
          '21': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果'
          }
        },
        bgTip: '',
        bannerSrc: '',
        shopId: window.localStorage.shopId,
        advertSysId: -1,
        details: [],
        display: false,
        picUrl: '',
        detailStr: [],
        id: '',
        loadBannerImg: false // 是否上传banner图
      }
    },
    components: {
      imgUpload
    },
    mounted () {
      this.getBannerImg({position: 'BACKGROUND'})
      this.getTempCode()
    },
    methods: {
      /**
       * 获取当前模板的 code
       * @return {[type]} [description]
       */
      getTempCode () {
        websiteStyleAPI.getTemplateList().then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            for (let templ of res.data.data) {
              if (templ.useTag === 1) {
                console.log('templ.templateCode:' + templ.templateCode)
                this.bgTip = this.bgTipArray[parseInt(templ.templateCode)].tip
              }
            }
          }
        })
      },
      getBannerImg (params) {
        myWebSiteApi.getContactImg(params).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            if (data !== null && data.length > 0) {
              this.bannerSrc = data[0].pircUrlWhole
              this.advertSysId = data[0].advertId
              this.picUrl = data[0].picUrl
              this.id = data[0].id
            }
          }
        })
      },
      changeBanner (val) {
        this.$store.commit('SET_DIRTY', true)
        this.display = false
        this.bannerSrc = val.urlWhole
        this.advertSysId = 1
        this.picUrl = val.urlWhole
      },
      save () {
        if (this.picUrl === '' || this.picUrl === null) {
          this.$message.error('背景图不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        this.detailStr = []
        this.detailStr.push({
          shopId: this.shopId,
          picUrl: this.picUrl
        })
        myWebSiteApi.productBanner({detailStr: JSON.stringify(this.detailStr)}).then(res => {
          if (!res.data.code) {
            window.editorApi.iframeLoad()
            this.$message.success('保存成功')
          } else {
            this.$message.warning(res.data.message)
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/base";
  @import "../../../../assets/style/variable";
  .left-product{
    .top{
      float: left;
      width: 420px;
      padding: 16px 28px 16px 32px;
      min-height: 760px;
      margin-right: 32px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      .title{
        font-size: 18px;
        color: #33475B;
        margin-bottom: 16px;
      }
      .banner-img {
        position: relative;
        width: 420px;
        height: 120px;
        margin-bottom: 15px;
        background: url('../../../../assets/img/mark.jpg');
        background-size: 8px 8px;
        overflow: hidden;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 100px;
        }
        .hidden-btn {
          display: none;
          position: absolute;
          bottom: 0;
          height: 40px;
          line-height: 40px;
          text-align: right;
          width: 100%;
          background-color: rgba(80, 109, 149, 0.60);
          color: @white;
          .file {
            width: 100%;
            height: 40px;
            line-height: 40px;
            opacity: 0;
          }
          p {
            position: absolute;
            top: 0;
            right: 0;
            z-index: -1;
            margin-right: 15px;
          }
        }
      }
      .banner-img:hover {
        .hidden-btn {
          cursor: pointer;
          display: block;
          z-index: 999;
        }
      }
    }
    .img-box{
      width: 422px;
      height: 122px;
    }
    .desc{
      margin-top: 20px;
      font-size: 13px;
      color: #7C98B6;
      line-height: 21px;
    }
    .fail{
      height: 35px;
      width: 380px;
      margin-top: 32px;
      padding: 20px;
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
    .top{
      .el-button{
        margin-top: 32px;
      }
    }
  }
</style>
