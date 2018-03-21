<template>
  <div class="text">
    <textarea v-model="message" placeholder="add multiple lines"></textarea>
    <div class="len-tip">
      {{maxLength}}
    </div>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        message: ''
      }
    },
    props: {
      text: String,
      maxLength: Number
    },
    methods: {
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  
</style>
