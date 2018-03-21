<template>
  <div class="send-bg">
    <div class="send-content">
      <div class="center">
        <el-button-group>
          <el-button @click="type='social'" :type="type == 'social' ? 'primary':''">&nbsp;&nbsp;&nbsp;&nbsp;社交分享&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
          <el-button @click="type='link'" :type="type == 'social' ? '':'primary'">链接／二维码</el-button>
        </el-button-group>
      </div>
      <socialActivity v-if="type == 'social'"
      :activityUrl="activityUrl"
      :hiddenBtn="'hide'"
      :changSend="changSend"
      :sendIndex="sendIndex" />
      <UrlActivity v-if="type == 'link'"/>
    </div>
  </div>
</template>

<script>
  import socialActivity from './socialActivity'
  import UrlActivity from './UrlActivity'
  export default {
    name: 'activitySend',
    props: {
      sendIndex: Number,
      changSend: Function
    },
    data () {
      return {
        type: 'social',
        activityUrl: ''
      }
    },
    components: {
      socialActivity,
      UrlActivity
    },
    methods: {},
    mounted () {
      let sendInfo = this.$store.state.develop.activitySendInfo
      if (sendInfo.third) {
        this.activityUrl = sendInfo.third.url
      }
    }
  }
</script>

<style lang="less">
  .send-bg{
    background-color: #ffffff;
    margin: 0 auto;
    width: 1200px;
    padding-top: 30px;
    margin-bottom: 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
  }
  .send-content{
    width: 650px;
    min-height: 800px;
    margin: 0 auto;
    .center{
      text-align: center;
    }
  }
</style>
