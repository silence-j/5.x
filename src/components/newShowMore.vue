<template>
  <span class="describe">
    <div class="content" ref="content" :style="{maxHeight: contentHeight}">
      <slot></slot>
    </div>
    <a class="showmore" @click="showMore($event)" v-if="showBtn" v-text="showMoreText"></a>
  </span>
</template>
<script>
  export default{
    data () {
      return {
        contentHeight: '',
        showMoreText: '',
        showBtn: true
      }
    },
    props: {
      maxHeight: Number,
      showTip: {
        type: String,
        default: '展开'
      },
      hidTip: {
        type: String,
        default: '收起'
      }
    },
    mounted () {
      this.contentHeight = `${this.maxHeight}px`
      this.showMoreText = this.showTip
      // 如果本身就小于这个maxheight，不显示按钮
      let tarHeight = this.$refs.content.clientHeight
      if (tarHeight < this.maxHeight) {
        this.showBtn = false
      }
    },
    methods: {
      showMore (event) {
        event.stopPropagation()
        if (this.showMoreText === this.showTip) {
          this.contentHeight = 'initial'
          this.showMoreText = this.hidTip
        } else {
          this.showMoreText = this.showTip
          this.contentHeight = `${this.maxHeight}px`
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../assets/style/variable";
  .describe{
    line-height: 1.5;
    .content{
      overflow: hidden;
    }
    .showmore{
      font-size: 13px;
      display: inline-block;
      color: @link;
      text-decoration: none;
      cursor: pointer;
      /*margin-top: 16px;*/
    }
  }
</style>
