<template>
  <transition name="slide">
    <div class="footer-save" v-show="JSON.stringify(editorPerson)!=='{}'||JSON.stringify(editorCompany)!=='{}'">
      <div class="container">
        <el-button type="primary" class="footer-btn" :disabled="editorBtn" @click="saveEditor">保存</el-button>
        <el-button class="footer-btn" @click="cancelEditor">取消</el-button>
        <span>联系人信息已更改</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  export default{
    props: {
      editor: ''
    },
    data () {
      return {
        contactId: '',
        editorBtn: false
      }
    },
    methods: {
      saveEditor () {
        this.editorBtn = true
        // 左侧编辑保存之后，实时更新右侧的时间线
        this.$store.dispatch('getTimeLine', {contactId: this.$route.query.contactId, socialType: '0;2;4;1;6;7;3;11;12;13'})
        if (JSON.stringify(this.editorCompany) !== '{}') {
          let emailRep = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          let urlRep = /^(http|https):\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/
          for (let key in this.editorCompany) {
            let val = this.editorCompany[key]
            if (val) {
              if (key === 'sonCompanyCount' && (isNaN(val) || val.length > 13)) {
                this.$message.error('子公司数量只能为0-12位数字')
                return false
              } else if (key === 'contactTime' && isNaN(val)) {
                this.$message.error('联系次数只能为数字格式')
                return false
              } else if (key === 'companySize' && (isNaN(val) || val.length > 13)) {
                // this.$message.error('员工数量只能为0-12位数字')
                // return false
              } else if (key === 'mail' && val && !emailRep.test(val)) {
                this.$message.error('邮箱格式错误')
                return false
              } else if (key === 'url' && val && !urlRep.test(val)) {
                this.$message.error('公司官网格式错误')
                return false
              }
            }
            // else if (key === 'income' && (isNaN(this.editorCompany[key]) || this.editorCompany[key].length > 13)) {
              // this.$message.error('年收入只能为0-12位数字')
              // return false
            // }
          }
          contactInfoApi.contactCompanyUpdate(this.editorCompany).then(res => {
            if (!res.data.code) {
              this.$message.success('保存成功！')
              this.$store.commit('CONTACT_EDITOR_COMPANY', {editorCompany: {}})
              let detailType = this.$route.query.contactType
              let contactId = this.$route.query.contactId
              this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
              this.$store.dispatch('getContactDetail', {contactId: contactId})
              this.$store.dispatch('getBasicInfo')
            } else {
              this.$message.error(res.data.message)
            }
            this.editorBtn = false
          })
        }
        if (JSON.stringify(this.editorPerson) !== '{}') {
          let emailRep = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
          for (let key in this.editorPerson) {
            if (key === 'mail' && this.editorPerson[key] && !emailRep.test(this.editorPerson[key])) {
              this.$message.error('邮箱格式错误')
              return false
            }
          }
          contactInfoApi.contactPersonUpdate(this.editorPerson).then(res => {
            if (!res.data.code) {
              this.$message.success('保存成功！')
              this.$store.commit('CONTACT_EDITOR_PERSON', {editorPerson: {}})
              let detailType = this.$route.query.contactType
              let contactId = this.$route.query.contactId
              this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
              this.$store.dispatch('getContactDetail', {contactId: contactId})
              this.$store.dispatch('getBasicInfo')
            } else {
              this.$message.error(res.data.message)
            }
            this.editorBtn = false
          })
        }
      },
      cancelEditor () {
        this.$store.commit('CONTACT_EDITOR_PERSON', {editorPerson: {}})
        this.$store.commit('CONTACT_EDITOR_COMPANY', {editorCompany: {}})
        this.$store.dispatch('getBasicInfo')
        this.$store.dispatch('getAllParams')
      }
    },
    computed: {
      editorPerson () {
        this.contactId = this.$store.getters.editorPerson.contactId
        return this.$store.getters.editorPerson
      },
      editorCompany () {
        this.contactId = this.$store.getters.editorCompany.contactId
        return this.$store.getters.editorCompany
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-leave-active {
    transition: all .3s ease;
  }

  .slide-enter, .slide-leave-active {
    transform: translateY(100%);
  }

  .footer-save {
    position: fixed;
    bottom: 0;
    background: #EAF0F6;
    width: 100%;
    border-top: 1px solid #CBD6E2;
    z-index: 6666;
    //transform: translateY(100%);
    .container {
      width: 1200px;
      padding: 22px 0;
      margin: 0 auto;
      box-sizing: border-box;
      font-size:0;
      .footer-btn {
        padding: 10px 45px;
      }
      span {
        margin-left: 10px;
        color: #7C98B6;
      }
    }
  }
</style>
