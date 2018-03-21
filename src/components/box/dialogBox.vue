<template>
  <el-dialog class="my-dialog"
             top="40%"
             v-bind:show-close="config.showclose"
             v-model="config.visible"
             :class="config.theme"
             :title="config.title"
             @close="close"
             >
    <div class="confirm-main">
      <i class="icon-font">&#xe629;</i>
      <span v-if="config.notice != '' ">{{config.notice}}</span>
    </div>
    <div  class="message">
      <el-popover  :popper-class="config.popovercls">
        <!-- <p>{{config.message}}</p> -->
        <div slot="reference" class="name-wrapper">
          {{config.message}}
        </div>
      </el-popover>
    </div>
    <div class="confirm-btn" v-if="!config.isLoading">
      <el-button class="confirm" type="primary" @click="sure">{{config.sureText}}</el-button>
      <el-button class="close" type="text" v-if="config.showclosebtn" @click="close">{{config.cancelText}}</el-button>
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
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        isLoading: false,
        showclose: false, // 叉叉
        showclosebtn: true, // 按钮取消
        popovercls: 'confirm-pop'
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
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/style/variable";
  .my-dialog {
    .el-dialog__header{
      border:none;
      padding-top:15px; 
    }
    .el-dialog {
      width: 360px;
      min-height: 188px;
      margin: 0;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(51,71,91,.6);
      .el-dialog__body {
        padding: 0;
      }
      .confirm-main {
        height: 24px;
        margin-top: 20px;
        margin-left: 30px;
        i {
          margin-right: 10px;
          font-size: 24px;
          color: #FEA000;
        }
        span {
          font-size: 16px;
          color: #33475b;
        }
      }
      .confirm-btn {
        /*margin-top: 35px;*/
        margin-left: 68px;
        .el-button {
          width: 80px;
          height: 32px;
          font-size: 13px;
          border-radius: 4px;
          padding: 0;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      .message{
        height: 16px;
        margin: 15px 0 36px 68px;
        font-size: 14px;
        color: #ababab;
      }
      .name-wrapper{
        line-height: 20px;
        max-width: 200px;
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  // 一颗按钮的弹框样式
  .width416{
    .el-dialog {
      width: 416px;
      .confirm-main span{
        font-size: 14px;
      }
    }
  }
  /*.red{ // 红色确认框  2018-1-29 章宇 要求全部弹框按钮为蓝色 所以注释
    .el-dialog {
      .el-dialog__body{
        .confirm-main{
          .icon-font{
            color: #FFA726;;
          }
          span{
            font-size: 14px;
            font-weight: bold;
          }
        }
        .confirm-btn {
          .confirm{
            background-color: #FF3B6E;
          }
        }
      }
    }
  }*/
  .confirm-pop{
    background-color: #FFFAEA;
    color: #7C98B6;
    border: 1px solid #ffebcd;
    .popper__arrow{
      display: none;
    }
  }
</style>
