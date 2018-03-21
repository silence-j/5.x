<template>
  <el-dialog v-model="config.visible" width="20%" class="already-box">
      <span class="connect">
        <i class="icon-font warn">&#xe629;</i>
        <span>{{config.text}}</span>
      </span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="yes">知道了</el-button>
      </span>
  </el-dialog>
</template>
<script>
  export default{
    props: {
      config: {
        visible: false,
        text: ''
      }
    },
    methods: {
      yes () {
        this.$emit('sure')
        this.config.visible = false
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .already-box{
    .el-dialog--small{
      width:30%;
    .connect{
      font-size: 14px;
      color: #33475B;
    .warn{
      margin-right: 10px;
      font-size: 24px;
      color: #FEA000;
    }
    }
    .el-button{
      width:80px;
      color: #fff;
      margin-left: 36px;
      background: #5488F9;
    }
    }
    .el-dialog__footer{
      text-align: left;
    }
  }
</style>
