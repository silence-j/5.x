<template>
  <el-button :icon="isAdd ? 'plus' : 'minus'" @click="stateChange"></el-button>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      isAdd: true
    }
  },
  mounted () {
    this.isAdd = this.state
  },
  props: {
    state: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    state (newVal) {
      this.isAdd = newVal
    }
  },
  methods: {
    stateChange () {
      this.isAdd = !this.isAdd
      this.$emit('stateChange', this.isAdd)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .el-button{
    font-size: 12px!important;
    padding: 2px;
    color: #b0c1d4!important;
    margin-right: 8px;
  }
</style>
