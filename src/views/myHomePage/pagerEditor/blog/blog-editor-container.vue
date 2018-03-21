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
        let controlContainer = [
          ['#blog-bg-img', 'update-topBanner']
        ]
        this.loadEditor(controlContainer)
      },
      loadEditor (controlerBar) {
        controlerBar.forEach((elName) => {
          window.editorApi.crateEditTag(elName[0], () => {
            window.previewControl.editorControl(elName[1])
            this.$store.commit('SEL_MODEL', elName[0])
          })
        })
        let selmodel = this.$store.getters.selmodel
        if (selmodel === '' || selmodel === null || selmodel === undefined) {
          selmodel = '#profile-topBanner'
        }
        this.$store.commit('SEL_MODEL', '')
        window.editorApi.defaultClick('#blog-bg-img')
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .editor-container {
    float: right;
    width: calc(~'100% - 512px');
    iframe{
      height: 800px;
      width: 100%
    }

  }
</style>
