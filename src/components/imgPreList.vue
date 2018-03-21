<template>
  <div class="img-box">
    <img 
    :style="{width: options.size + 'px', height: options.size + 'px'}" 
    class="pre-img" 
    v-for="(item, index) in options.imgList" 
    @click="preViewImg(options.imgList, index)" 
    :src="item.imgUrl || item.url || item.address || item.href" 
    v-show="index < options.max || showAll" alt="">

    <span 
    :style="{width: options.size + 'px', height: options.size + 'px'}" 
    class="show-more-img" 
    @click="showAllImg" 
    v-show="!showAll && options.imgList.length > options.max">+{{options.imgList.length - options.max}}</span>

    <ImgRoastPop :imgPreview="imgPreview"></ImgRoastPop>
  </div>
</template>
<script>
import ImgRoastPop from '@/components/imgRoastPop.vue'
export default {
  name: '',
  data () {
    return {
      imgPreview: {
        show: false,
        imgs: []
      },
      showAll: false
    }
  },
  mounted () {

  },
  props: {
    options: {
      type: Object
    }
  },
  computed: {

  },
  components: {
    ImgRoastPop
  },
  methods: {
    showAllImg () {
      this.showAll = true
    },
    preViewImg (imgList, index) {
      this.imgPreview.show = true
      this.imgPreview.imgs = imgList
      this.$store.commit('MONITOR_IMGINDEX', {index})
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.img-box{
  font-size: 0;
  margin-bottom: 16px;
  margin-top: 16px;
  .pre-img{
    width: 80px;
    height: 80px;
    margin-right: 8px;
    vertical-align: top;
  }
  .show-more-img{
    display: inline-block;
    width: 80px;
    height: 80px;
    background-color: #5488f9;
    color: #fff;
    font-size: 24px;
    line-height: 80px;
    text-align: center;
  }
}
</style>
