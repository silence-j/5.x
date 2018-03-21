<template>
    <div>
      <div class="search-content" >
        <!--搜索结果小卡片-->
        <ul>
          <li class="info-social" v-if="searchList.socialList.length > 0" v-for="(item, index) in searchList.socialList">
            <!--上部显示-->
            <div class="person-info">
              <!--头像部分-->
              <div class="head-info">
                <div class="img" @click="jumpCompany(item.id)">
                  <a :href="linkJump(item)" target="_blank">
                  <div v-if="item.avatar == null || item.avatar == ''" class="companyDefault">
                    <em  class="icon-company"></em>
                  </div>
                  <!--<em class="default-avatar icon-font" v-if="item.avatar == '' || item.avatar == null">&#xe62d;</em>-->
                  <img v-else="" :src="item.avatar" alt="" >
                  </a>
                </div>
                <div class="name-info limit">
                  <p class="topdesc"><a :href="linkJump(item)" target="_blank" class="double_desc" :title="item.name">{{item.name}}</a>
                  </p>
                  <!-- <p class="atwho">
                    <span v-if="item.userName!='' && item.userName!=null" class="username" :title="item.userName">@{{ item.userName}}</span>
                    <em class="icon-font fb" v-if="searchList.socialType == '0'" style="margin-right:5px;">&#xe6d9;</em>
                    <em class="icon-font tw" v-if="searchList.socialType == 1" style="margin-right:5px;">&#xe621;</em>
                    <span class="data" v-if="searchList.socialType == '0'">FacebookPage </span>
                    <span class="data" v-if="searchList.socialType == '1'">Twitter</span>
                  </p> -->
                  <p class="icon-data">
                    <em class="icon-font fb" v-if="searchList.socialType == '0'" style="margin-right:5px;">&#xe6d9;</em>
                    <em class="icon-font tw" v-if="searchList.socialType == 1" style="margin-right:5px;">&#xe621;</em>
                    <span class="data" v-if="searchList.socialType == '0'">FacebookPage </span>
                    <span class="data" v-if="searchList.socialType == '1'">Twitter</span>
                  </p>
                </div>
              </div>
            </div>
            <!--横线部分-->
            <!-- <p class="line"></p> -->
            <!--industry-->
            <p class="describe" >
              <span v-if="item.desc !== null && item.desc !==''" :title="item.desc">{{item.desc}}</span>
              <span v-else class="no-desc">暂未添加任何简介</span>
            </p>
            <em v-if="(showAccout || item.isAddedStatusBySubUser === null) ? false : item.isAddedStatusBySubUser === 0" class="boder boderNone">团队联系人</em>
            <div v-else class="border-wrap">
              <el-button class="icon-font boder" v-if="item.isAdded==0" @click="addCompany(item, $event)" :disabled="disableBtn[index]">
                <em class="icon-font">&#xe6ad; 联系人</em>
              </el-button>
              <el-button class="icon-font boder" v-else @click="linkCompany(item)">
                <em>查看联系人</em>
              </el-button>
            </div>
          </li>
        </ul>
      </div>
      <div style="overflow: hidden; clear:both" v-show="recordLess">
        <ul style="overflow: hidden;">
          <li class="social-loading" v-for="item in 3">
            <div class="social-top">
              <p class="social-top-left c-bg-load"></p>
              <p class="social-top-left-right">
                <span class="c-bg-load"></span>
                <span class="c-bg-load"></span>
              </p>
            </div>
            <div class="social-bottom">
              <p class="social-bottom-model c-bg-load"></p>
              <p class="social-bottom-model c-bg-load"></p>
            </div>
          </li>
        </ul>
        <div class="up-download">
        </div>
      </div>
    </div>
</template>

<script>
  import exploreAPI from '@/api/exploreAPI'
  export default{
    name: '',
    props: {
      recordLess: Boolean,
      searchList: {
        socialType: String,
        socialList: Array,
        isMore: Boolean,
        isLoad: Boolean
      }
    },
    data () {
      return {
        keyword: '',
        userId: window.localStorage.userId,
        recommendListIsShow: false,
        disableBtn: []
      }
    },
    mounted () {
      this.keyword = this.$route.query.searchText
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
    components: { },
    watch: {
    },
    methods: {
      btnDisable (i, type) {
        let arr = this.disableBtn.slice(0)
        arr[i] = type
        this.disableBtn = arr
      },
      // 添加客户
      addCompany (item, event) {
        this.btnDisable(event, true)
        console.log(item)
        // target.setAttribute('disabled', 'disabled')
        let socialAccountId = item.socialAccountId
        let name = item.name // 用户名
        let userName = item.userName
        let socialType = this.searchList.socialType
        let contactsType
        let linkurl
        if (socialType === '0') { // facebook公司
          contactsType = 1
          linkurl = 'https://www.facebook.com/' + userName
          if (userName === '' || userName === 'null' || userName === null) {
            linkurl = 'https://www.facebook.com/' + socialAccountId
          }
        } else {  // twitter个人
          contactsType = 0
          linkurl = 'https://www.twitter.com/' + userName
          if (userName === '' || userName === 'null' || userName === null) {
            linkurl = 'https://www.twitter.com/' + socialAccountId
          }
        }
        let location = item.location   // 所在地
        let address = [{'address': location}]
        let mail = item.mail  // 邮箱
        let telephones
        if (item.telephone) {
          let telephone = item.telephone  // 电话
          telephones = [{'type': 8, 'telephone': telephone}]
        } else {
          telephones = ''
        }
        let industry = item.industry   // 行业类型
        let socialAccountType = item.socialAccountType
        let avatar = item.avatar   // 头像
        let desc = item.desc
        let params = {
          userId: this.userId,
          contactsType: contactsType,
          name: name,
          avatar: avatar,
          mail: mail,
          address: JSON.stringify(address),
          telephone: JSON.stringify(telephones),
          socialAccountId: socialAccountId,
          socialAccountType: socialAccountType,
          socialAccountName: userName,
          socialAccountUrl: linkurl,
          industry: industry,
          introduce: desc
        }
        if (socialType === '0') {
          params.createSource = 'social_search_facebook_create'
        } else {
          params.createSource = 'social_search_twitter_create'
        }
        exploreAPI.addCompanyNow(params).then(res => {
          if (res.data.code === 0) {
            this.$store.commit('FIND_COMPANYID', {companyId: res.data.data.id})
            item.isAdded = 1
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.data.message)
            if (res.data.message === '联系人已被他人添加') {
              this.$emit('refresh')
            }
          }
          this.btnDisable(event, false)
        })
      },
      linkCompany (item) {
        let type
        if (this.searchList.socialType === '0') {
          type = 1
        } else {
          type = 0
        }
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: item.contactId || this.$store.getters.companyId,
            contactType: type
          }
        })
      },
      // 链接获取
      linkJump (item) {
        let type = this.searchList.socialType
        let linkurl = ''
        let userName = item.userName
        let socialAccountId = item.socialAccountId
        if (type === '0') {  // facebook
          linkurl = 'https://www.facebook.com/' + userName
          if (userName === '' || userName === 'null' || userName === null) {
            linkurl = 'https://www.facebook.com/' + socialAccountId
          }
        } else {   // twitter
          linkurl = 'https://www.twitter.com/' + userName
          if (userName === '' || userName === 'null' || userName === null) {
            linkurl = 'https://www.twitter.com/' + socialAccountId
          }
        }
        return linkurl
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes loadingColor {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-ms-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  @-o-keyframes loadingColor{
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  .animation(@animation-name, @animation-duration, @animation-iteration-count){
    animation: @arguments;
    -webkit-animation: @arguments;
    -moz-animation: @arguments;
    -ms-animation: @arguments;
    -o-animation: @arguments;
  }
  .up-download{
    clear: both;
  }
</style>

