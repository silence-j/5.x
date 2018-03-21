<template>
    <div class="left-menu-small">
      <div class="big-title">设置
        <span class="tipStyle">
          <i class="icon-font">&#xe6eb;</i>
          多账号重置或绑定账号变更后，需退出并重新登录后生效
        </span>
      </div>
      <div class="menu">
        <router-link :to="{ path: '/setAccount' }" class="option">
          <p>账号设置</p>
        </router-link>
        <!--<router-link :to="{ path: '/setCompany' }" class="option">
          <p>公司设置</p>
        </router-link>-->
        <router-link v-if="keyWordRight()" :to="{ path: '/setKeyword' }" class="option">
          <p>关键字设置</p>
        </router-link>
        <router-link v-if="bindingRight()" :to="{ path: '/channelList' }" class="option">
          <p>绑定账号</p>
        </router-link>
        <router-link v-if="isFatherRight && trendCount" :to="{ path: '/setMulAccount' }" class="option">
          <p>多账号设置</p>
        </router-link>
        <router-link v-if="accountFollowRight()" :to="{ path: '/trackManage' }" class="option">
          <p>跟踪代码管理</p>
        </router-link>
        <router-link v-if="messageRight() && showAccout" :to="{ path: '/setMessenger' }" class="option">
          <p>Messenger管理</p>
        </router-link>
      </div>
    </div>
</template>
<script>

import Util from '@/common/Util'
export default {
  name: 'systemIndex',
  data () {
    return {
      serverLevel: '1',
      /**
       * 是否是主账号
       * @type {Boolean}
       */
      isFatherRight: true,
      trendCount: true
    }
  },
  components: {
  },
  computed: {
    showAccout () {
      let userInfo = JSON.parse(window.localStorage.user)
      let parentId = userInfo.parentUserId
      if (parentId) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    keyWordRight () {
      return Util.hasRightByCode('GA') && this.serverLevel === '1'
    },
    bindingRight () {
      return Util.hasRightByCode('GB')
    },
    accountFollowRight () {
      return Util.hasRightByCode('GC')
    },
    messageRight () {
      return Util.hasRightByCode('GE')
    }
  },
  created () {
    /**
     * 权限模块
     * 普通 0
     * 引航版/普及版2
     * 超级盈店1
     * 如果 是普通用户 ，点击客户开发直接跳转到的是 社交推广tab,(客户开发tab被隐藏)
     * @type {[type]}
     */
    this.serverLevel = window.localStorage.serverLevel
    let userInfo = JSON.parse(window.localStorage.user)
    let parentId = userInfo.parentUserId
    if (parentId) {
      this.isFatherRight = false
    } else {
      this.isFatherRight = true
    }
    if (this.serverLevel === 1 || this.serverLevel === '1') {
      this.trendCount = true
    } else {
      this.trendCount = false
    }
    // this.isFatherRight = (window.localStorage.subUserId === window.localStorage.userId) && (this.serverLevel === '1')
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/list.less';
  .tipStyle{
    display: block;
    width: 450px;
    position: absolute;
    top: 20px;
    left: 50px;
    font-size: 12px;
    color: #ea545e;
  }
</style>
