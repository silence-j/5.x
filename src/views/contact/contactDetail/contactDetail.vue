<template>
  <div v-loading.fullscreen="fullscreenLoading">
    <div class="contactDetail">
      <div class="top">
        <span v-if="editor === ''" @click="backToList">
          <!--<span style="font-weight: bold;font-size: 19px;" class="icon-font icon-left"></span>-->
          <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
          返回{{$route.query.contactType == 1 ? '公司' : '联系人'}}列表</span>
        <span v-else @click="back">
          <!--<span style=" font-weight: bold;font-size: 19px;" class="icon-font icon-left"></span>-->
          <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
          返回{{$route.query.contactType == 1 ? '公司' : '联系人'}}详情</span>
      </div>
      <div v-if="editor === ''">
        <div class="left">
          <contactDesc></contactDesc>
          <basicInfo v-if="$route.query.contactType == 0" @editorContacts="editorContacts"></basicInfo>
          <companyInfo @editorContacts="editorContacts"></companyInfo>
          <staff v-if="$route.query.contactType == 1"></staff>
          <contactTags></contactTags>
        </div>
        <div class="right">
          <messageBox></messageBox>
          <records></records>
        </div>
      </div>
      <editorPerson v-if="editor!==''" :editor="editor">
      </editorPerson>
    </div>
    <footerSave :editor="editor"></footerSave>
  </div>
</template>
<script>
  import contactDesc from './components/contactDesc.vue'
  import basicInfo from './components/basicInfo.vue'
  import companyInfo from './components/companyInfo.vue'
  import contactTags from './components/contactTags.vue'
  import messageBox from './components/messageBox.vue'
  import records from './components/records.vue'
  import editorPerson from './components/editor/editorPerson.vue'
  import footerSave from './components/footerSave.vue'
  import staff from './components/staff.vue'
  export default{
    beforeRouteLeave (to, from, next) {
      if (JSON.stringify(this.editorPerson) !== '{}' || JSON.stringify(this.editorCompany) !== '{}' || !this.isEditOver) {
        this.$confirm('此页面还有内容未保存，确定离开吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreenLoading = true
          this.$store.commit('CONTACT_EDITOR_PERSON', {editorPerson: {}})
          this.$store.commit('CONTACT_EDITOR_COMPANY', {editorCompany: {}})
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
          next()
        }).catch(() => {
          next(false)
        })
      } else {
        next()
      }
    },
    data () {
      return {
        editor: '',
        fullscreenLoading: false
      }
    },
    computed: {
      editorPerson () {
        return this.$store.getters.editorPerson
      },
      editorCompany () {
        return this.$store.getters.editorCompany
      },
      isEditOver () {
        return this.$store.state.contact.isEditOver
      }
    },
    mounted () {
      this.$store.dispatch('setNavIndex', 5)
      let detailType = this.$route.query.contactType
      let contactId = this.$route.query.contactId
      this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
      this.$store.dispatch('getContactDetail', {contactId: contactId})
      this.$store.dispatch('getBasicInfo')
      this.$store.dispatch('getTimeLine', {contactId})
    },
    methods: {
      editorContacts (type) {
        this.editor = type
      },
      back () {
        let detailType = this.$route.query.contactType
        let contactId = this.$route.query.contactId
        this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
        this.editor = ''
      },
      backToList () {
        this.$router.push({path: '/contact', query: {type: this.$route.query.contactType}})
      }
    },
    watch: {
      $route () {
        let detailType = this.$route.query.contactType
        let contactId = this.$route.query.contactId
        this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
        this.$store.dispatch('getContactDetail', {contactId: contactId})
        this.$store.dispatch('getBasicInfo')
        this.$store.dispatch('getTimeLine', {contactId})
      }
    },
    components: {
      contactDesc,
      basicInfo,
      companyInfo,
      contactTags,
      messageBox,
      records,
      editorPerson,
      footerSave,
      staff
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/variable";
  .contactDetail{
    .left{
      .el-button.gray-btn{
        font-size: 13px;
        color: #4F6D95;
      }
      .el-button.gray-btn:hover{
        color: @activeBlue;
      }
    }
  }
</style>

<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  .contactDetail{
    width: 1200px;
    margin: 0 auto;
    .top {
      color: #7C98B6;
      margin-top: 30px;
      margin-bottom: 20px;
      span{
        font-size: 13px;
        cursor: pointer;
      }
      .icon-font{
        color: #7C98B6;
        margin-right: 10px;
      }
    }
    .left,.right{
      display: inline-block;
      vertical-align: top;
    }
    .right{
      margin-left:20px;
      z-index: auto;
    }
  }
</style>
