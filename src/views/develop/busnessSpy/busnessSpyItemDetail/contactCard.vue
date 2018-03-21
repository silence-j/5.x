<template>
  <div class="card-wrapper">
    <p class="contact-name" :title="data.name">
      <i class="icon-font" :class="leftBtnText === '&#xe7ea;' ? 'in-color' : 'fb-color'" v-html="leftBtnText"></i>
      <a :href="data.socialInfoList[0].homepageUrl" style="color: #7c98b6;" target="_blank" v-if="data.socialInfoList !== null && data.socialInfoList !== '' && data.socialInfoList.length > 0">{{data.name}}</a>
      <a style="color: #7c98b6;" v-else="">{{data.name}}</a>
    </p>
    <div class="position">
      <p class="position" :title="data.position" v-if="data.source !== 6">{{data.position}}</p>
      <div v-else="">
        <el-button class="teamAdd" v-if="isMain === 'false' && this.data.isAddedStatusBySubUser !== null && this.data.isAddedStatusBySubUser === 0">
          团队联系人
        </el-button>
        <el-button v-else-if="!this.data.added && showAddBtn" icon="plus" class="add-btn" @click="addContactElse">联系人</el-button>
        <el-button v-else class="show-btn" @click="showContact"><i class="icon-font eye">&#xe60c;</i>查看</el-button>

        <p class="gap-pos" :title="data.mail">邮箱：<span v-if="data.mail !== null">{{data.mail}}</span></p>
        <p class="gap-pos" :title="data.telephone">电话：<span v-if="data.telephone !== null">{{data.telephone}}</span></p>
        <p class="gap-pos gap" :title="data.fax">传真：<span v-if="data.fax !== null">{{data.fax}}</span></p>
      </div>
    </div>
    <div class="card-btn-group" v-if="data.source !== 6">
      <!--<a :href="data.socialInfoList[0].homepageUrl" target="_blank" v-if="!this.data.added && showAddBtn">-->
      <a v-if="!this.data.added && showAddBtn">
        <!--<span class="left-btn" :class="(unlockShow && hasMail && company.website) ? '' : 'only-one'">{{leftBtnText}}</span>-->
        <span class="left-btn" :disabled="disabledAddBtn" @click="addContactElse" :class="(unlockShow && hasMail && company.website) ? '' : 'only-one'">
          <em class="icon-font" >&#xe6ad;</em> 联系人
        </span>
      </a>
        <span v-else-if="isMain === 'false' && this.data.isAddedStatusBySubUser !== null && this.data.isAddedStatusBySubUser === 0" class="left-btn" :class="(unlockShow && hasMail && company.website) ? '' : 'only-one'">团队联系人</span>
      <a v-else>
        <span class="left-btn" @click="showContact" :class="(unlockShow && hasMail && company.website) ? '' : 'only-one'">查看联系人</span>
      </a>
      <span class="right-btn" v-if="unlockShow && hasMail && company.website" @click="unlockOrSend">{{(typeof hasMail === 'string') ? hasMail : unlockShow}}</span>
    </div>
  </div>
</template>
<script>
import developAPI from '@/api/developAPI'
import exploreAPI from '@/api/exploreAPI'
export default {
  name: '',
  data () {
    return {
      hasMail: true,
      contactId: '',
      showAddBtn: true,
      sourceType: '',
      contactAdd: true,
      isMain: window.localStorage.getItem('isMainAccount')
    }
  },
  props: {
    data: {
      type: Object
    },
    company: {
      type: Object
    }
  },
  mounted () {
    this.contactId = this.data.contactsId
  },
  computed: {
    leftBtnText () {
      if (this.data.socialInfoList !== null && this.data.socialInfoList !== '') {
        console.log('opopp')
        if (this.data.socialInfoList.length > 0) {
          if (this.data.socialInfoList[0].homepageUrl.indexOf('facebook') >= 0) {
            this.sourceType = 'Facebook'
            return '&#xe6d9;'
          } else if (this.data.socialInfoList[0].homepageUrl.indexOf('linkedin') >= 0) {
            this.sourceType = 'Linkedin'
            return '&#xe7ea;'
          }
        }
        return false
      }
    },
    unlockShow () {
      if (this.data.mail) {
        return this.data.mail
      } else if (this.data.hasUnlocked) {
        return false
      } else {
        return '解锁邮箱'
      }
    }
  },
  components: {
  },
  methods: {
    unlockOrSend () {
      if (this.unlockShow !== '解锁邮箱') {
        window.location.href = 'mailto:' + this.unlockShow
      } else {
        let params = {
          relativeContactsId: this.data.id,
          platform: this.data.socialInfoList[0].platform,
          website: this.company.website,
          firstName: this.data.firstName,
          lastName: this.data.lastName
        }
        developAPI.unlockMailAdress(params).then(res => {
          if (!res.data.code) {
            if (res.data.data.mail) {
              this.hasMail = res.data.data.mail
            } else {
              this.hasMail = false
              this.$message.success('未找到联系人邮箱')
            }
          }
        })
      }
    },
//    判断公司联系人是否已经添加
    addContactElse () {
      if (this.$store.getters.addOrNot) {
        this.addContact()
      } else {
        this.$store.commit('ADD_COMPANYID', {id: ''})
        let type = this.$store.getters.addCompany + 1
        this.$store.commit('ADD_COMPANY', {type: type})
        let isVal = setInterval(() => {
          if (this.$store.getters.addCompanyId !== '') {
            clearInterval(isVal)
            this.addContact()
          }
        }, 500)
      }
    },
    addContact () {
//      let socialAccountType = this.leftBtnText === 'Facebook' ? 0 : 3
      let socialAccountType = -1
      if (this.data.source === 0) {
        socialAccountType = 0
      } else if (this.data.source === 2) {
        socialAccountType = 3
      } else if (this.data.source === 6) {
        socialAccountType = 6
      }
      let mail = typeof this.hasMail === 'string' ? this.hasMail : null
      let params = {
        type: 0,
        name: this.data.name,
//        avatar: this.data.socialInfoList[0].avatar,
        mail: this.data.mail || mail,
        socialAccountType,
        thirdAccountId: this.data.id,
        createSource: 'recommend_create',
        remark: this.data.remark,
        website: this.company.webUrl,
        companyId: this.$store.getters.addCompanyId,
        companyName: this.company.name,
        position: this.data.position,
        thirdInfoList: JSON.stringify(this.data.socialInfoList),
        detectiveFlag: true,
        experienceList: JSON.stringify(this.data.experienceList)
      }
      if (this.data.source === 6) {
        params.telephone = this.data.telephone
        params.fax = this.data.fax
      }
      if (this.contactAdd === true) {
        this.contactAdd = false
        exploreAPI.addContact(params).then(res => {
          if (!res.data.code) {
            this.contactAdd = true
            this.$message.success('添加联系人成功')
            this.showAddBtn = false
            this.contactId = res.data.data.id
          }
        })
      }
    },
    showContact () {
      window.open(`#/contactDetail?contactId=${this.contactId}&contactType=0`)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .card-wrapper{
    position: relative;
    width: 100%;
    /*height: 99px;*/
    margin-bottom: 16px;
    border: 1px solid #cbd6e3;
    border-radius: 4px;
    overflow: hidden;
    .add-btn, .show-btn{
      position: absolute;
      top: 19px;
      right: 16px;
      padding: 7px 9px;
    }
    .teamAdd{
      position: absolute;
      top: 19px;
      right: 16px;
      padding: 7px 9px;
      background: #EAF0F6;
      font-size: 13px;
      color: #B0C1D4;
      &:hover{
        border:#EAF0F6;
      }
    }
    .show-btn{
      padding: 7px 18px;
      .eye{
        margin-right: 3px;
      }
    }
    .contact-name{
      font-size: 14px;
      color: #475669;
      line-height: 14px;
      margin: 19px 0 6px 16px;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .fb-color{
        color: #4d7ce7;
      }
      .in-color{
        color: #007BB6;
      }
    }
    .position{
      font-size: 13px;
      color: #7c98b6;
      min-height: 22px;
      margin-left: 16px;
      max-width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .gap-pos{
        margin-bottom: 6px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .gap{
        margin-bottom: 10px;
      }
    }
    .card-btn-group{
      /*position: absolute;*/
      bottom: 0;
      height: 30px;
      width: 100%;
      background-color: #f5f8fa;
      color: #556f8a;
      line-height: 30px;
      text-align: center;
      border-top: 1px solid #cbd6e3;
      .left-btn, .right-btn{
        color: #556f6a;
        display: inline-block;
        vertical-align: top;
        width: 30%;
        font-size: 13px;
        cursor: pointer;
        /*&:hover{*/
          /*color: #fff;*/
          /*background-color: #76a0fa;*/
        /*}*/
      }
      .team-btn{
        display: inline-block;
        width:100%;
        background: #EAF0F6;
        color: #B0C1D4;
      }
      .only-one{
        width: 100%;
      }
      .right-btn{
        width: calc(~"70% - 1px");
        border-left: 1px solid #cbd6e3;
      }
    }
  }
</style>
