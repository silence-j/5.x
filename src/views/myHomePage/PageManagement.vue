<template>
  <div>
    <leftMenu></leftMenu>
    <containerFream></containerFream>
  </div>
</template>
<script>
  import leftMenu from './cmp/left-menu.vue'
  import containerFream from './cmp/cotainer-fream.vue'
  export default{
    data () {
      return {
        activeName: 'first',
        options: [{
          value: 'domain1',
          label: '黄金糕'
        }, {
          value: 'domain2',
          label: '双皮奶'
        }],
        value: ''
      }
    },
    components: {
      leftMenu,
      containerFream
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
