<template>
  <div>
    <div class="login_header">
      <div class=" w-1200">
        <div class="module-overflow">
          <div class="logo">
            <img src="../../../assets/img/logo.svg" width="120px">
          </div>
          <a>商家社区</a>
            <ul class="ul" id="LoginInfo">
              <li class="lib">
                <img v-if="avatar" :src="avatar" alt="" />
                <img v-else src="../../../assets/img/default_avatar.jpg" alt="" />
                <span>手机用户</span>
                {{loginUser.loginAccount}}
                <i class="down-arrow" @click="outAccount(1)"></i>
              </li>
            </ul>
        </div>
        <div v-if="popIsShow" class="out-account-pop">
          <p class="account-display">
            <img v-if="avatar" :src="avatar" alt="" />
            <img v-else src="../../../assets/img/default_avatar.jpg" alt="" />
            <span>手机用户</span>
            {{loginUser.loginAccount}}
          </p>
          <i class="up-arrow" @click="outAccount(2)"></i>
          <p class="out-btn" @click="dropOut()">退出</p>
        </div>
      </div>
    </div>
    <div class="school_menu">
      <div class="w-1200">
        <router-link :to="{ path: '/index'}" class="bt">首页</router-link>
        <router-link :to="{ path: '/newsList'}" class="bt">小学堂</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import schoolAPI from '@/api/schoolAPI'
import LoginAPI from '@/api/loginAPI'
export default {
  name: 'newinfo',
  data () {
    return {
      loginUser: '',
      popIsShow: false,
      avatar: ''
    }
  },
  components: {
    schoolAPI
  },
  methods: {
    outAccount (type) {
      if (type === 1) {
        this.popIsShow = true
      } else {
        this.popIsShow = false
      }
    },
    // 退出登录
    dropOut () {
      let param = {}
      LoginAPI.logOut(param).then((res) => {
        let code = res.data.code
        if (code === 0) {
          this.$router.push({path: '/login'})
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
    schoolAPI.getLoginInfo().then((res) => {
      this.loginUser = res.data.data
      console.log(res)
    })
    LoginAPI.accountInfo().then(res => {
      if (res.data.code === 0) {
        this.avatar = res.data.data.avatar
      }
    })
  }
}
</script>
