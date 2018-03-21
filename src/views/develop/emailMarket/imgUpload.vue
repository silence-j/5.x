<template>
  <div class="img-wrapper">
    <div class="img-box">
      <img :src="showFirst?imgUrl:imgSrc" v-if="!isLoading" alt="" id="img-box">
      <div class="loading-image load-center" v-else style="height:100px;width:300px;">
        <div class="loading loading-circle img-load"></div>
      </div>
      <div class="change-img">
        <span class="icon-font">&#xe68a;</span>
        更换
        <input type="file" class="file" @change="inputChange">
      </div>
    </div>
    <div class="tip">
      图片支持JPG,JPEG,PNG和GIF图片格式，大小支持10M以内
    </div>
  </div>
</template>

<script>
  import myWebSiteApi from '@/api/myWebSiteApi'
  export default {
    name: '',
    data () {
      return {
        imgSrc: '',
        showFirst: true,
        isLoading: false
      }
    },
    props: {
      imgUrl: {
        type: String,
        default: 'https://qiniu.onloon.co/maildefault.png'
      }
    },
    components: {

    },
    mounted: function () {

    },
    methods: {
      // inputChange (event) {
      //   let img = event.target.files[0]
      //   let reader = new FileReader()
      //   let res
      //   reader.onload = e => {
      //     let imgTag = document.getElementById('img-box')
      //     res = e.target.result
      //     imgTag.src = res
      //     this.$emit('imgChange', res)
      //   }
      //   reader.readAsDataURL(img)
      // }
      inputChange (e) {
        this.showFirst = false
        this.isLoading = true
        let files = e.target.files || e.dataTransfer.files
        let size = files[0].size
        if (!files.length) {
          return
        }
        if (size / 1024 / 1024 > 10) {
          this.$message.error('图片大小不能超过10M')
          this.isLoading = false
          return
        }
        let formData = new FormData()
        formData.append('picDir', 'shop')
        formData.append('picture', files[0])
        myWebSiteApi.uploadLogo(formData).then(res => {
          if (!res.data.code) {
            this.imgSrc = res.data.data.urlWhole
            this.isLoading = false
            this.$emit('imgChange', res.data.data.urlWhole)
            this.$message.success(res.data.message)
            this.showFirst = true
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .img-wrapper{
    .img-box{
      position: relative;
      width: 330px;
      height: 122px;
      padding: 10px 15px;
      text-align: center;
      box-sizing: border-box;
      background: url('../../../assets/img/mark.jpg');
      background-size: 8px 8px;
      margin-top: 20px;
      margin-left: 30px;
      border-radius: 4px;
      img{
        width: auto;
        max-width: 100%;
        height: 100%;
      }
      .change-img{
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(80,109,149,0.60);
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        text-align: right;
        color: #fff;
        font-size: 13px;
        padding-right: 16px;
        box-sizing: border-box;
        .icon-font{
          font-size: 18px;
          margin-right: 8px;
        }
        .file{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 40px;
          line-height: 40px;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
    .tip{
      color: #7c98b6;
      margin-top: 16px;
      padding: 0 30px;
      line-height: 21px;
      font-size: 13px;
    }
  }
</style>
