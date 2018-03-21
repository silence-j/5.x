/**
 * 分配 联系人/公司 弹框
 */
<template>
  <el-dialog :title="config.type?'公司分配':'联系人分配'" v-model="config.visible" size="tiny" class="dialog-step" >
    <el-select v-model="config.selAcc" placeholder="全部账号">
      <el-option :label="logUser.name" :value="logUser.id"></el-option>
      <el-option
        v-for="item in subUserList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-checkbox class="check-text" v-model="config.isSync" v-if="config.type">同步分配公司在所有账号下的联系人</el-checkbox>
    <span slot="footer" class="confirm-btn">
      <el-button type="primary" @click="sure" class="confirm">确定</el-button>
      <el-button @click="close" class="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import editor from '../../../../components/SimEditor.vue'

  export default {
    data () {
      return {
        subUserList: [],
        logUser: {name: '', id: ''} // 登陆主账号
      }
    },
    props: {
      config: {
        type: '', // 公司/联系人
        visible: false,
        selAcc: '',
        isSync: false,
        callback: null
      }
    },
    mounted () {
      this.getSubList() // 子账号列表
    },
    watch: {
    },
    methods: {
      getSubList () {
        // 主账号 获取子账号列表
        if (localStorage.isMainAccount) {
          let user = JSON.parse(localStorage.user)
          this.logUser = {id: user.userId, name: user.name}
          this.subUserList = user.subUserList
        }
      },
      sure () {
        this.$emit('sure')
        if (this.config.callback) {
          this.config.callback()
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

</style>
