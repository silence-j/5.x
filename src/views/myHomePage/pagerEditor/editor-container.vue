<template>
  <div class="editor-container">
    <iframe id="iframepage" name="buyer-editor" :src="src" @load="load"></iframe>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        src: '',
        menu: '/'
      }
    },
    mounted () {
      this.menu = this.$store.getters.editorMenu
      this.src = window.location.protocol + `//${process.env.HOMEPAGE_DOMAIN}${this.$store.getters.editorMenu}?shopId=${window.localStorage.shopId}&editor=true`
    },
    methods: {
      load () {
        /**
         * 首页创建editor按钮
         */
        if (this.menu === '/') {
          let controlContainer = [
            ['#logo-img', 'editor-logo'],
            ['#carousel-inner', 'editor-carousel'],
            ['#guide-img', 'editor-avert'],
            ['#aboutUs', 'editor-about-us'],
            ['#productList', 'editor-products'],
            ['#footer-container', 'editor-footer']
          ]
          this.loadEditor(controlContainer)
        }
      },
      loadEditor (controlerBar) {
        controlerBar.forEach((elName) => {
          window.editorApi.crateEditTag(elName[0], () => {
            window.previewControl.editorControl(elName[1])
            this.$store.commit('SEL_MODEL', elName[0])
            // console.log('SET_DIRTY')
            // this.$store.commit('SET_DIRTY', true)
          })
        })
        // 设置选中点击
        let selmodel = this.$store.getters.selmodel
        if (selmodel === '' || selmodel === null || selmodel === undefined) {
          selmodel = '#logo-img'
        }
        this.$store.commit('SEL_MODEL', '')
        window.editorApi.defaultClick(selmodel)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .editor-container {
    float: right;
    width: calc(~'100% - 511px');
    iframe{
      height: 800px;
      width: 100%
    }

  }
</style>
