<template>
  <el-dialog class="manyDisplay-dialog"
             top="15%"
             v-bind:show-close=false
             v-model="config.visible"
             :class="config.theme">
    <div class="confirm-main">
      <i class="icon-font">&#xe629;</i>
      <span v-if="config.notice != ''" class="delete-prompt">{{config.notice}}</span>
    </div>
    <div class="message">
      <div v-for="cont in config.message" :key="cont" v-if="config.message.length>0" style="display: block" class="limit">
        <span class="name-wrapper" :title="cont">
          {{cont | truncation30}}
        </span>
      </div>
    </div>
    <div class="confirm-btn" v-if="!config.isLoading">
      <el-button class="confirm red-btn" type="primary" @click="sure">{{config.sureText}}</el-button>
      <el-button class="close" type="text" @click="close">{{config.cancelText}}</el-button>
    </div>
    <div class="confirm-btn loading loading-circle" v-else></div>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      config: {
        theme: '', // 主题class 如red：红色弹框
        visible: false,
        notice: '',
        message: [],
        sureText: '删除',
        cancelText: '取消',
        callback: null,
        isLoading: false
      }
    },
    watch: {
      'config.isLoading' () {
        if (!this.config.isLoading) {
          this.close()
        }
      }
    },
    methods: {
      sure () {
        this.$emit('sure')
        if (this.config.callback) {
          this.config.callback()
        }
        if (!this.config.isLoading) {
          this.close()
        }
      },
      close () {
        this.$emit('close')
        this.config.visible = false
      }
    },
    filters: {
      truncation30 (value) {
        if (value.length > 30) {
          return value.substring(0, 9) + '...'
        } else {
          return value
        }
      }
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  .manyDisplay-dialog{
    .el-dialog{
      width:416px;
      top: 15%;
      .el-dialog__body{
        padding:21px 40px 48px 40px;
        .confirm-main{
          margin-bottom:16px;
          i{
            font-size:24px;
            margin-right:13px;
            color: #FF3B6E;
          }
          .delete-prompt{
            font-size: 14px;
            color: #33475B;
            line-height: 21px;
          }
        }
        .message{
          margin-left:40px;
          div{
            margin-bottom:4px;
          }
          .name-wrapper{
            margin-top:8px;
            font-size: 18px;
            color: #33475B;
            line-height: 21px;
            font-weight: 600;
          }
        }
        .confirm-btn{
          margin-left:40px;
          margin-top:30px;
          .red-btn{
            background: #FF3B6E;
          }
        }
      }
    }
  }
</style>
