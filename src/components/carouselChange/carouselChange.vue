<template>
  <div class="image_list_change">
    <p class="big_image_display">
      <span class="left_click_area" v-if="imageList.length>1"><i class="icon-font go go-left" @click.stop="go(-1)">&#xe60a;</i></span>
      <img :src="displayImage" alt="" style="height:200px"/>
      <span class="right_click_area" v-if="imageList.length>1"><i class="icon-font go go-right" @click.stop="go(1)">&#xe613;</i></span>
    </p>
    <div class="small_images_display" v-if="imageList.length>1">
      <span class="left_click_area" ><i class="icon-font go go-left" @click.stop="pagego(-1)">&#xe60a;</i></span>
      <div class="indicator_box">
        <p class="indicator" :style="'width:' + imageList.length*78 + 'px'">
          <span v-for="(image, index) in imageList" :key="image" class="small_image" @click.stop="changeImage(index)" :class="{curr: index===selectIndex}"><img :src="image.url" alt="" /></span>
        </p>
      </div>
      <span class="left_click_area" ><i class="icon-font go go-right" @click.stop="pagego(1)">&#xe613;</i></span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      imageList: Array
    },
    data () {
      return {
        selectIndex: 0,
        displayImage: this.imageList[0].url,
        page: 1
      }
    },
    watch: {
      selectIndex () {
        this.displayImage = this.imageList[this.selectIndex].url
      }
    },
    methods: {
      changeImage (index) {
        this.selectIndex = index
      },
      go (step) {
        let newindex = this.selectIndex + step
        if (newindex < 0) {
          return
        } else if (newindex > this.imageList.length - 1) {
          this.selectIndex = 0
        } else {
          this.selectIndex = newindex
        }
      },
      pagego (step) {
        let ys = this.imageList.length % 6
        let totalpage = 0
        if (ys === 0) {
          totalpage = parseInt(this.imageList.length / 6)
        } else {
          totalpage = parseInt(this.imageList.length / 6) + 1
        }
        let newpage = this.page + step
        if (newpage > totalpage) {
          return
        } else if (newpage < 1) {
          return
        } else {
          this.page = this.page + step
          document.getElementsByClassName('indicator')[0].style.right = 468 * (this.page - 1) + 'px'
        }
      }
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  .image_list_change{
    .big_image_display{
      position: relative;
      width:540px;
      border-radius: 2px;
      .left_click_area{
        display: inline-block;
        position: absolute;
        width: 100px;
        left: 0px;
        top: 0px;
        height: 100%;
        &:hover{
          .go{
            display: block;
          }
        }
      }
      .right_click_area{
        display: inline-block;
        position: absolute;
        width: 100px;
        right: 0px;
        top: 0px;
        height: 100%;
        &:hover{
          .go{
            display: block;
          }
        }
      }
      .go{
        cursor: pointer;
        display: none;
        font-size: 80px;
        color: #bfc4d9;
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      img{
        width:100%;
        border-radius: 2px;
      }
    }
    .small_images_display{
      margin-top:8px;
      .left_click_area{
        height:51px;
        display: inline-block;
        width:20px;
        background: #bfc4d9;
        vertical-align: top;
        position: relative;
        cursor: pointer;
        &:hover{
          background: #5488F9;
        }
      }
      .left_click_area{
        height:51px;
        display: inline-block;
        width:20px;
        background: #bfc4d9;
        vertical-align: top;
        position: relative;
        cursor: pointer;
        &:hover{
           background: #5488F9;
         }
      }
      .go{
        font-size: 13px;
        color: #fff;
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
      }
      .indicator_box{
        overflow: hidden;
        width:490px;
        display: inline-block;
      }
      .indicator{
        position: relative;
        height:51px;
        .small_image{
          width:70px;
          height:51px;
          display: inline-block;
          overflow: hidden;
          margin-left: 8px;
          border-radius: 2px;
          opacity: 0.6;
          &.curr{
             opacity: 1;
           }
          img{
            width:100%;
            height:100%;
            border-radius: 2px;
          }
        }
      }
    }
  }
</style>
