<template>
  <div class="header-wrapper">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <div class="icon-group">
        <el-tooltip effect="dark" content="访问官网" placement="top">
          <a target="_blank" :href="websiteHref">
            <i class="icon-font social-icon" :class="data.website ? '' : 'nodata-icon'" style="font-size: 21px">&#xe65f;</i>
          </a>
        </el-tooltip>
        <el-tooltip effect="dark" content="访问Facebook" placement="top">
          <a target="_blank" :href="haveFacebook ? data.socialInfoList[haveFacebook].homepageUrl : null">
            <i class="icon-font social-icon" :class="haveFacebook ? '' : 'nodata-icon'">&#xe6d9;</i>
          </a>
        </el-tooltip>
        <el-tooltip effect="dark" content="访问Twitter" placement="top">
          <a target="_blank" :href="haveTwitter ? data.socialInfoList[haveTwitter].homepageUrl : null">
            <i class="icon-font social-icon twitter-icon" :class="haveTwitter ? '' : 'nodata-icon'">&#xe621;</i>
          </a>
        </el-tooltip>
        <el-tooltip effect="dark" content="访问Linkedin" placement="top">
          <a target="_blank" :href="haveLinkedin ? data.socialInfoList[haveLinkedin].homepageUrl : null">
            <i class="icon-font social-icon" :class="haveLinkedin ? '' : 'nodata-icon'">&#xe62b;</i>
          </a>
        </el-tooltip>
        <el-button
        v-if="!this.data.added && showAddBtn"
        icon="plus"
        type="primary"
        class="add-btn"
        :style="{display: hidAdd ? 'none' : 'inline-block'}"
        @click="addCompanyContact">公司联系人</el-button>
        <span v-if="this.data.added">
          <el-button
            v-if="isMain === 'false' && this.data.isAddedStatusBySubUser !== null && this.data.isAddedStatusBySubUser === 0"
            type="primary"
            class="add-team"
            style="color: #7C98B6;">
          团队联系人
        </el-button>
          <el-button
            type="primary"
            class="add-btn"
            v-else
            @click="showCompanyContact"><i class="icon-font eye">&#xe60c;</i>查看公司</el-button>
        </span>
      </div>
      <div>
        <h1 class="header-title" :title="data.name">{{data.name}}</h1>
        <div>
          <img
          v-if="data.baseInfo && data.baseInfo.address"
          :src="`../../../../../static/img/ImageFlag/${data.baseInfo.address.country}.png`" class="flag-icon" alt="">
          <span class="country-name" v-if="data.baseInfo && data.baseInfo.address">{{data.baseInfo.address.country}}</span>
        </div>
        <div class="header-content" :title="data.intro">
          {{data.intro}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Util from '@/common/Util.js'
import exploreAPI from '@/api/exploreAPI'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      showAddBtn: true,
      contactId: '',
      hidAdd: false,
      isMain: window.localStorage.getItem('isMainAccount'),
      addIt: false,
      addCompanyOrNot: true
    }
  },
  mounted () {
    this.hidAdd = Boolean(this.$route.query.hidAdd)
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal) {
        this.isLoading = false
        this.contactId = newVal.contactsId
      }
    },
    addCompany () {
      this.addIt = true
      this.addCompanyContact()
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    addCompany () {
      console.log('addCompany')
      return this.$store.getters.addCompany
    },
    haveFacebook () {
      if (this.data.socialInfoList && this.data.socialInfoList.length > 0) {
        for (let i in this.data.socialInfoList) {
          if (this.data.socialInfoList[i].platform === 0) {
            return i
          }
        }
      }
      return false
    },
    haveTwitter () {
      if (this.data.socialInfoList && this.data.socialInfoList.length > 0) {
        for (let i in this.data.socialInfoList) {
          if (this.data.socialInfoList[i].platform === 1) {
            return i
          }
        }
      }
      return false
    },
    haveLinkedin () {
      if (this.data.socialInfoList && this.data.socialInfoList.length > 0) {
        for (let i in this.data.socialInfoList) {
          if (this.data.socialInfoList[i].platform === 2) {
            return i
          }
        }
      }
      return false
    },
    websiteHref () {
      if (this.data.website) {
        return Util.checkUrl(this.data.website)
      }
      return null
    }
  },
  components: {
  },
  methods: {
    addCompanyContact () {
      let socialAccountType
      if (this.haveFacebook) {
        socialAccountType = 0
      } else if (this.haveTwitter) {
        socialAccountType = 1
      } else if (this.haveLinkedin) {
        socialAccountType = 3
      } else {
        socialAccountType = 6
      }
      let address = (this.data.baseInfo && this.data.baseInfo.address) ? JSON.stringify(this.data.baseInfo.address) : null
      let params = {
        type: 1,
        socialAccountType,
        name: this.data.name,
        address,
        thirdAccountId: this.data.centraId,
        createSource: 'recommend_search_create',
        thirdInfoList: JSON.stringify(this.data.socialInfoList),
        companySize: this.data.baseInfo ? this.data.baseInfo.companySize : null,
        sales: this.data.baseInfo ? this.data.baseInfo.sales : null,
        website: this.data.website,
        mainProduct: this.data.mainProduct,
        detectiveFlag: true,
        detectiveCompanyId: this.data.id,
        taskId: this.data.taskId,
        keywords: localStorage.getItem('taskName'),
        telephone: this.data.baseInfo ? this.data.baseInfo.telephone : null
      }
      if (this.addIt) {
        params.forContactsCompanyId = true
      }
      if (this.addCompanyOrNot === true) {
        this.addCompanyOrNot = false
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            this.addCompanyOrNot = true
            this.$message.success('公司联系人添加成功')
            this.$store.commit('ADD_ORNOT', {type: true})
            this.$store.commit('ADD_COMPANYID', {id: res.data.data.id})
            console.log('companyID:')
            console.log(this.$store.getters.addCompanyId)
            this.data.added = true
            this.showAddBtn = false
            this.contactId = res.data.data.id
          }
        })
      }
    },
    showCompanyContact () {
      window.open(`#/contactDetail?contactId=${this.contactId}&contactType=1`)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .header-wrapper{
    position: relative;
    width: 100%;
    height: 138px;
    padding: 20px 30px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 0 8px rgba(0,0,0,0.08);
    border-radius: 4px;
    .loading{
      margin: 30px auto;
    }
    .icon-group{
      position: absolute;
      top: 20px;
      right: 30px;
      height: 36px;
      line-height: 36px;
      a{
        display: inline-block;
        margin-right: 20px;
        .social-icon{
          color: #4d7ce7;
          font-size: 18px;
        }
        .twitter-icon{
          font-size: 16px;
        }
        .nodata-icon{
          color: #ddd;
        }
      }
      .add-btn{
        margin-left: 20px;
        .eye{
          margin-right: 5px;
        }
      }
      .add-team{
        background: #EAF0F6;
        border: 1px solid #DFE3EB;
        border-radius: 2px;
      }
    }
    .header-title{
      font-size: 18px;
      color: #33475b;
      margin-bottom: 9px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width:70%;
    }
    .flag-icon{
      width: 20px;
      height: auto;
      vertical-align: top;
    }
    .country-name{
      font-size: 13px;
      color: #4f6d95;
      margin-left: 10px;
    }
    .header-content{
      display: -webkit-box;
      width: 800px;
      font-size: 12px;
      color: #4f6d95;
      line-height: 18px;
      margin-top: 10px;
      text-overflow: ellipsis;
      /* autoprefixer: off*/
      -webkit-box-orient: vertical;
      /* autoprefixer: on*/
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
</style>
