<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content-module">
      <div class="edit_module">
        <p class="label">Google Analytics account</p>
        <p class="edit" v-if="!googleIsEdit">
          <span class="content" v-if="analysisInfo.google!='' && analysisInfo.google!=null">{{analysisInfo.google}}</span>
          <span class="content" v-else>暂未配置</span>
          <span class="operation" @click="googleIsEdit=true">编辑</span>
        </p>
        <div v-else class="operation_module">
          <p class="input_module"><input type="text" v-model="googleStr" class="edit_input" /></p>
          <p class="btn">
            <el-button type="default" class="edit_button" @click="editFunc('1')">保存</el-button>
          </p>
        </div>
      </div>
      <div class="edit_module">
        <p class="label">Facebook Pixel account</p>
        <p class="edit" v-if="!facebookIsEdit">
          <span class="content" v-if="analysisInfo.facebook!='' && analysisInfo.facebook!=null">{{analysisInfo.facebook}}</span>
          <span class="content" v-else>暂未配置</span>
          <span class="operation" @click="facebookIsEdit=true">编辑</span>
        </p>
        <div v-else class="operation_module">
          <p class="input_module"><input type="text" v-model="facebookStr" class="edit_input" /></p>
          <p class="btn">
            <el-button type="default" class="edit_button" @click="editFunc('2')">保存</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import systemSettingAPI from '@/api/systemSettingAPI'
import headLeft from './systemIndex'
export default {
  name: 'trackManage',
  data () {
    return {
      googleIsEdit: false,
      googleStr: '',
      facebookIsEdit: false,
      facebookStr: '',
      analysisInfo: {}
    }
  },
  components: {
    headLeft
  },
  filters: {
  },
  watch: {
  },
  methods: {
    getAnalysisInfoFunc () {
      systemSettingAPI.getAnalysisInfo().then(res => {
        if (res.data.code === 0) {
          this.analysisInfo = res.data.data
          this.googleStr = this.analysisInfo.google
          this.facebookStr = this.analysisInfo.facebook
        }
      })
    },
    editFunc (type) {
      // type:0：百度 1:谷歌 2:facebook
      let params = {
        type: type
      }
      if (type === '1') {
        params.code = this.googleStr
      } else if (type === '2') {
        params.code = this.facebookStr
      }
      systemSettingAPI.analysisUpdate(params).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          if (type === '1') {
            this.googleIsEdit = false
          } else {
            this.facebookIsEdit = false
          }
          this.getAnalysisInfoFunc()
        }
      })
    }
  },
  created () {
    this.getAnalysisInfoFunc()
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .right-content-module{
    margin-top: 64px;
    display: inline-block;
    width: 970px;
    margin-top: 64px;
  }
  .edit_module{
    border: 1px solid #dfe3eb;
    border-radius: 4px;
    background: #fff;
    padding: 15px 25px 30px 25px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    margin-bottom:16px;
    .label{
      font-size: 16px;
      line-height: 24px;
    }
    .operation_module{
      margin-top:16px;
      .edit_input{
        width: 70%;
        padding: 9px 0;
        text-indent: 8px;
        font-size: 13px;
      }
      .btn {
        margin-top:10px;
        .edit_button{
          color: #fff;
          background: #5488F9;
          text-align: center;
          padding: 7px 0;
          width:100px;
        }
        .edit_button:hover{
         background: rgb(118, 160, 250);
         border-color: rgb(118, 160, 250);
         color: #fff;
        }
      }
    }
    .edit{
      margin-top: 16px;
      word-wrap: break-word;
      .content{
        color: #4F6D95;
        line-height: 18px;
        font-size: 14px;
      }
      .operation{
        line-height: 18px;
        font-size: 14px;
        color:#5488F9;
        cursor: pointer;
        margin-left: 30px;
      }
      .operation:hover{
        text-decoration: underline;
      }
    }
  }
</style>

