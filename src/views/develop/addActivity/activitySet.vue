<template>
  <div class="set-bg">
    <div class="set-content">
      <div class="form-item">
        <div class="left-title"><em style="color: red;">*</em>活动标题:</div>
        <div class="blog-right-content">
          <el-input v-model.trim="form.activityTitle" @change="formchange" class="input-xl b-title" :maxlength="50"></el-input>
        </div>
      </div>
      <div class="form-item">
        <div class="left-title">活动描述:</div>
        <div class="blog-right-content">
          <el-input 
          @change="formchange"
          v-model="form.activityDesc"
          type="textarea"
          :rows="20" 
          class="input-xl b-title" :maxlength="500"></el-input>
        </div>
      </div>
      <!-- <div class="form-item">
        <div class="left-title">活动地址:</div>
        <div class="blog-right-content">
          <el-input v-model="form.url" @change="formchange" :disabled="true" class="input-xl b-title" :maxlength="160"></el-input>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'activitySet',
    data () {
      return {
        // form: {
        //   activityTitle: '',
        //   description: '',
        //   url: ''
        // }
      }
    },
    computed: {
      form () {
        let third = this.$store.state.develop.activitySendInfo.third
        let form = {
          activityTitle: third.activityTitle,
          activityDesc: third.activityDesc,
          url: third.url || process.env.ACTIVITY
        }
        return form
      }
    },
    mounted () {
      // console.log(this.$store.state.develop.activitySendInfo)
      // console.log(this.$store.state.develop.activitySendInfo.third.activityTitle)
    },
    methods: {
      formchange () {
        this.$store.commit('DEVELOP_ACTIVITYSENDINFO', { third: this.form })
      }
    }
  }
</script>

<style lang="less">
  .set-bg{
    background-color: #ffffff;
    margin: 0 auto;
    width: 1200px;
    min-height: 800px;
    padding-top: 60px;
    margin-bottom: 20px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
  }
  .set-content{
    width: 800px;
    margin: 0 auto;
    .form-item{
      margin-top:24px;
      .left-title{
        margin-top:8px;
        vertical-align: top;
        text-align: right;
        display: inline-block;
        width:118px;
        color: #33475B;
        font-size: 14px;
      }
      .blog-right-content{
        display: inline-block;
        padding-left:16px;
        width:650px;
        .b-title{
          width:665px;
        }
        .mao-input{
          width:400px;
          height: 34px;
        }
        .el-textarea__inner{
          width:665px;
          height: 100px;
          border-radius: 4px;

        }
      }
    }
  }
</style>
