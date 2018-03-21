<template>
  <div style="display: inline-block;">
    <micro @delTag="delTag" v-if="data.type === 0 || data.type === 2" :isAddeSub="data.isAddedStatusBySubUser" :keyword="keyword" :data="data.data" :vipType="data.type"></micro>
    <xunPan @delTag="delTag" v-else :isAddeSub="data.isAddedStatusBySubUser" :data="data.data" :vipType="data.type"></xunPan>
  </div>
</template>
<script>
import xunPan from './xunPan.vue'
import micro from './micro.vue'
export default {
  name: '',
  data () {
    return {}
  },
  mounted () {
    // console.log(this.data.type)
  },
  props: {
    data: {
      type: Object
    },
    keyword: String
  },
  computed: {

  },
  components: {
    xunPan,
    micro
  },
  methods: {
    delTag () {
      this.$emit('delTag', this.data.data.recommendId)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
