<template>
  <div class="email-main">
    <div class="email-title">{{emailTitle}}</div>
    <div class="email-tab">
      <div class="back">
        <router-link to="emailmarketing">
          <img src="../../../src/assets/img/left.png" alt="" class="left-back" />
          <span>返回</span>
        </router-link>
      </div>
      <div class="tab-change">
        <span :class="showType == '1' ? 'isSelected':'data-profile'" @click="changeTab('profile')">数据概况</span>
        <span :class="showType == '0' ? 'isSelected' : ''" @click="changeTab('list')">收件人列表</span>
      </div>
    </div>
    <profileData v-if = "showType=='1'" :profilemailId="emailId" @toAddresee="jumpAddresee" @getTitle="getTitleFunc"></profileData>
    <addresseeList v-if = "showType=='0'" :mailId="emailId" :searchtype="type"></addresseeList>
  </div>
</template>
<script>
  import profileData from './subExtension/profileData.vue'
  import addresseeList from './subExtension/addresseeList.vue'
  export default{
    name: 'emailCenter',
    data () {
      return {
        profile: '1',
        defalutShow: true,
        emailId: this.$route.query.id,
        emailTitle: '',
        show: 1,
        type: 4,
        showType: this.$route.query.showType || '1'
      }
    },
    computed: {
    },
    watch: {

    },
    mounted () {

    },
    methods: {
//      响应父组件
      jumpAddresee (val) {
        if (val === 'read') {
          this.type = 2
        }
        if (val === 'click') {
          this.type = 3
        }
        if (val === 'noArr') {
          this.type = 5
        }
        if (val === 'all') {
          this.type = 4
        }
        console.log(val)
        this.showType = '0'
        this.profile = '0'
      },
//      切换tab
      changeTab (val) {
        let oldshowType = this.$route.query.showType
        if (val === 'profile') {
          this.profile = '1'
          this.showType = '1'
        } else {
          this.profile = '0'
          this.showType = '0'
        }
        let url = window.location.href
        if (url.indexOf('showType') !== -1) {
          url = url.replace('&showType=' + oldshowType, '&showType=' + this.showType)
        } else {
          url = url + '&showType=' + this.showType
        }
        window.location.href = url
      },
      getTitleFunc (title) {
        this.emailTitle = title
      }
    },
    components: {
      profileData,
      addresseeList
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/page';
  .email-main{
    width:1200px;
    margin: 0 auto;
    .email-title{
      margin-top: 17px;
      margin-bottom: 20px;
      font-size: 20px;
      color: #33475B;
      height: 20px;
    }
    .email-tab{
      position: relative;
      .back{
        position: absolute;
        font-size: 14px;
        img{
          color: #B0C1D4;
          vertical-align: middle;
        }
        span{
          color: #7C98B6;
        }
      }
      .tab-change{
        text-align: center;
        font-size: 13px;
        color: #4F6D95;
        border-bottom: 1px solid  #DFE3EB;
        padding-bottom: 16px;
        margin-bottom: 16px;
        span{
          cursor: pointer;
        }
        span:first-child{
          margin-right: 40px;
        }
        .isSelected{
          color: #5488F9;
          border-bottom: 4px solid;
          padding-bottom: 10px;
        }
      }
    }
  }
</style>
