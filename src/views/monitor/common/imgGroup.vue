<template>
  <div class="imgGroup-container">
    <div class="img-group" v-if="item.images && item.images.length>0">
      <img class="content-photo" v-for="(img,index) in item.images" v-if="img.imgUrl && index<2" :src="img.imgUrl" @click="previewImg(item.images,index)">
      <button class="img-btn" v-if="item.images.length>2" @click="previewImg(item.images,2)">+{{item.images.length-2}}</button>
    </div>
    <ImgPreview :imgPreview="imgPreview"></ImgPreview>
  </div>
</template>

<script>
  import ImgPreview from '../../../components/imgPreview.vue'

  export default{
    data () {
      return {
        imgPreview: {
          show: false,
          imgs: []
        }
      }
    },
    props: {
      item: Object
    },
    mounted () {
    },
    methods: {
      previewImg (images, index) {
        this.imgPreview.show = true
        this.imgPreview.imgs = images
        this.$store.commit('MONITOR_IMGINDEX', {index})
      }
    },
    components: {
      ImgPreview
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import '../../../assets/style/variable';
  .imgGroup-container{
    margin-top: 16px;
    .img-group{
      margin-top: 10px;
      div{
        display: inline-block;
      }
      img{
        margin-right: 8px;
        cursor: pointer;
      }
      .content-photo{
        width:80px;
        height:80px;
      }
      .img-btn{
        width: 80px;
        height: 80px;
        vertical-align: top;
        font-size: 24px;
        font-weight: 200;
        color: @white;
        background: @activeBlue;
        border: none;
        cursor: pointer;
      }
    }
  }
</style>
