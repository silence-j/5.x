<template>
  <div >
    <!-- 购买记录 -->
    <template v-if="type === 1">
        {{socialMediaItemJson.contentJson.arrivaldate | monthAndDay}}
        <br>
        {{socialMediaItemJson.contentJson.arrivaldate | minitAndSecondDay}}

    </template>
    <!-- facebook  -->
    <template v-if="type === 0">
      {{socialMediaItemJson.contentJson.postTime | monthAndDay}}
       <br>
      {{socialMediaItemJson.contentJson.postTime | minitAndSecondDay}}

    </template>
  </div>
</template>

<script>

  export default{
    props: ['socialMediaItem', 'type'],
    data () {
      return {
      }
    },
    mounted () {
    },
    computed: {
      socialMediaItemJson: function () {
        let smJson = {}
        Object.assign(smJson, this.socialMediaItem, {contentJson: JSON.parse(this.socialMediaItem.content) || {}})
        return smJson
      }
    },
    watch: {
    },
    methods: {
    },
    components: {
    },
    filters: {
      monthAndDay: function (value) {
        let time = new Date(value)
        return (time.getMonth() + 1) + '月' + time.getDate() + '日'
      },
      minitAndSecondDay: function (value) {
        let time = new Date(value)
        return (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ':' + (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes())
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>
