<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content">
      <div class="u-right">
        <div class="messenger-desc">
          <div class="first-title">消息按钮</div>
          <div class="desc">在您的盈店里添加一个按钮，帮助用户与您进行信息交流</div>
        </div>
        <div class="edit-opt">
          <i class="icon-font messenger-logo">&#xe6aa;</i>
          <div class="middel-module">
            <p class="title">Messenger</p>
            <p class="desc">消息按钮<span class="read">{{value?'已打开':'已关闭'}}</span>，启用这个开关可以将聊天按钮添加到您盈店的每个页面上</p>
          </div>
          <div class="middel-opt" @click="prompting">
            <el-switch
              v-model="value"
              on-text=""
              off-text=""
              :disabled="facebookIsbind"
              @change="changeType">
            </el-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import channelAPI from '@/api/channelAPI'
import systemSettingAPI from '@/api/systemSettingAPI'
import headLeft from './systemIndex'
export default {
  name: 'setManage',
  data () {
    return {
      facebookIsbind: true,
      value: false
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
    // 提示
    prompting () {
      if (this.facebookIsbind) {
        this.$message.error('请先绑定facebook公共主页')
      }
    },
    changeType () {
      systemSettingAPI.saveMessageType().then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  },
  created () {
    // 获取渠道列表
    channelAPI.getAllChannel().then((res) => {
      if (res.data.code === 0) {
        let channelList = res.data.data
        channelList.forEach(item => {
          if (item.channelId === 'FACEBOOK' && item.homePageId !== '' && item.homePageId !== null && item.homePageId !== undefined) {
            this.facebookIsbind = false
          } else if (item.channelId === 'FACEBOOK') {
            this.facebookIsbind = true
          }
        })
      }
    })
    systemSettingAPI.getMessageType().then((res) => {
      if (res.data.code === 0) {
        let type = res.data.data
        if (type === 0) { // 未开启
          this.value = false
        } else {
          this.value = true
        }
      }
    })
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  .edit-opt{
    .el-switch {
      float: right;
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .messenger-logo{
    font-size: 36px;
    margin-right:8px;
    color: #5488F9;
  }
  .read{
    font-size: 12px;
    color: #FF3B6E;
    line-height: 17px;
  }
  .messenger-desc{
    padding:15px 32px 0 32px;
    .first-title{
      font-size: 16px;
      color: #33475B;
      line-height: 22px;
      font-weight: 600;
    }
    .desc{
      font-size: 13px;
      color: #7C98B6;
      line-height: 18px;
      margin-top:4px;
    }
  }
  .edit-opt{
    margin-top:40px;
    padding:0 32px;
    .middel-module{
      width: 80%;
      display: inline-block;
      .title{
        font-size: 14px;
        color: #33475B;
        line-height: 20px;
      }
      .desc{
        font-size: 12px;
        color: #7C98B6;
      }
    }
    .middel-opt{
      width: 14%;
      display: inline-block;
    }
  }
</style>

