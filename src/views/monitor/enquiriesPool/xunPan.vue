<template>
  <div class="micro">
    <div class="xunpan-container" @click="showDetail">
      <div class="title">
        <h3>推荐来源:</h3>
        <div :style="{backgroundColor: itemOrigin.color}">
          <span :title="itemOrigin.originText" :style="{paddingRight: itemOrigin.canDel ? '28px' : '13px'}">
            {{itemOrigin.originText}}
            <i v-if="itemOrigin.canDel" @click="delRec" class="iconfont del-btn">&#xe65a;</i>
          </span>
        </div>
      </div>
      <div class="content-top">
        <p class="oriTitle" v-if="data.oriTitle !== null && data.oriTitle !== '' && data.oriTitle !== undefined" style="font-weight: bold;font-size: 16px">{{data.oriTitle}}</p>
        <p class="say-some" v-html="data.enquiryContent"></p>
        <el-button type="text" class="see-detail">查看详情</el-button>
        <p class="fenlei">分类: {{data.enquiryCatagory.localName || data.enquiryCatagory.oriName}}</p>
        <span class="what-time">
        <i class="icon-font">&#xe67f;</i>
        <span>{{data.enquiryTime | time-formater-has-hour}}</span>
        </span>
      </div>
      <div class="bottom-content">
        <div class="contact-you">
        <el-button type="primary" :disabled="true" v-if='isAddeSub === 0' >团队联系人</el-button>
        <el-button type="primary" v-else-if="!hasAdded && !addSuccess" @click="addContact"><i class="el-icon-plus"></i>联系人</el-button>
        <el-button type="primary" v-else @click="toContact">查看联系人</el-button>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      v-model="dialogVisible"
      class="dia-detail" lock-scroll="true">
      <div>
        <div class="top-box">
          <i class="iconfont close-btn" @click="dialogVisible = false">&#xe62c;</i>
          <h3>推荐来源:</h3>
          <div :style="{backgroundColor: itemOrigin.color}">
            <span :title="itemOrigin.originText" :style="{paddingRight: itemOrigin.canDel ? '28px' : '13px'}">
            {{itemOrigin.originText}}
            <i v-if="itemOrigin.canDel" @click="delRec"  class="iconfont del-btn">&#xe65a;</i>
          </span>
          </div>
        </div>
        <p class="oriTitle" v-if="data.oriTitle !== null && data.oriTitle !== '' && data.oriTitle !== undefined" style="font-weight: bold;font-size: 16px;margin:20px 0 0 20px">{{data.oriTitle}}</p>
        <div class="next-box">
          <p class="say-some" v-html="data.enquiryContent"></p>
          <ul class="connect">
            <li>公司: <span> {{this.data.enquiryCompany.name}}</span></li>
            <li>联系人: <span> {{this.data.enquiryPerson.firstname}}{{this.data.enquiryPerson.lastname || ''}}</span></li>
            <li>邮箱:
              <el-button
              class="dig-btn"
              type="primary"
              v-if="(this.data.enquiryCompany.mail === '' || !this.data.enquiryCompany.mail || !this.email) && this.data.enquiryCompany.domain"
              @click="digMail">邮箱深度挖掘</el-button>
              <span v-else> {{this.email || this.data.enquiryCompany.mail}}</span>
            </li>
            <li>国家: <span> {{this.data.enquiryCompany.addressCountry}}</span></li>
            <li>地址: <span> {{this.data.enquiryCompany.streetAddress}}</span></li>
            <li>电话: <span> {{this.data.enquiryCompany.telephone}}</span></li>
            <li>官网: <span> {{this.data.enquiryCompany.website}}</span></li>
            <li class="fenlei">分类: <span> {{data.enquiryCatagory.localName || data.enquiryCatagory.oriName}}</span></li>
          </ul>
          <span class="what-time">
          <i class="icon-font">&#xe67f;</i>
          <span>{{data.enquiryTime | time-formater-has-hour}}</span>
          </span>
          <div class="add-contact-box">
            <el-button type="primary" :disabled="true" v-if='isAddeSub === 0' >团队联系人</el-button>
            <el-button type="primary" v-else-if="!hasAdded && !addSuccess" @click="addContact"><i class="el-icon-plus"></i>联系人</el-button>
            <el-button type="primary" v-else @click="toContact">查看联系人</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <delDialog class="del-dialog" :config="delDialogConfig" @sure="confirmDel"></delDialog>
  </div>
</template>

<script>
import enquiriesAPI from '@/api/enquiriesAPI'
import delDialog from '@/components/box/dialogBox'
export default {
  data () {
    return {
      dialogVisible: false,
      addSuccess: false,
      personId: null,
      email: null,
      delDialogConfig: {
        visible: false,
        notice: `是否停止推荐来自搜索历史 ${this.data.keywords.length > 9 ? `${this.data.keywords.slice(0, 9)}...` : this.data.keywords} 的询盘？`,
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        popovercls: 'confirm-pop'
      }
    }
  },
  components: {
    delDialog
  },
  computed: {
    itemOrigin () {
      let originObj = {}
      if (this.data.keywordMatchs && this.data.keywordMatchs.length) {
        // let isMatched = this.data.keywordMatchs[0].isMatched
        let type = this.data.keywordMatchs[0].type
        switch (type) {
          case 'explore':
            originObj.originText = `搜索历史: ${this.data.keywords}`
            originObj.color = '#ffb1c5'
            originObj.canDel = true
            break
          case 'detective':
            originObj.originText = `搜索历史: ${this.data.keywords}`
            originObj.color = '#ffb1c5'
            originObj.canDel = true
            break
          case 'product':
            originObj.originText = `产品类型: ${this.data.keywords}`
            originObj.color = '#99e3eb'
            break
          case 'seo':
            originObj.originText = `SEO关键字: ${this.data.keywords}`
            originObj.color = '#ffdca8'
            break
          case 'system':
            originObj.originText = `系统关键字: ${this.data.keywords}`
            originObj.color = '#ffdca8'
            break
        }
        return originObj
      } else {
        return {
          originText: '',
          color: '#fff'
        }
      }
    },
    hasAdded () {
      return this.data.enquiryPerson.contactsPersonId || this.data.enquiryCompany.contactsCompanyId
    }
  },
  methods: {
    addContact (e) {
      e.stopPropagation()
      let name = `${this.data.enquiryPerson.firstname || ''}${this.data.enquiryPerson.lastname || ''}`
      let type = 0
      if (name.length === 0) {
        name = this.data.enquiryCompany.name
        type = 1
      }
      let params = {
        type,
        userId: this.data.userId,
        avatar: this.data.enquiryPerson.avatar,
        address: JSON.stringify([{
          type: 0,
          address: this.data.enquiryCompany.streetAddress,  // 详细地址
          city: this.data.enquiryCompany.addressRegion,   // 城市
          country: this.data.enquiryCompany.addressCountry,  // 国家
          postcode: this.data.enquiryCompany.postcode
        }]),
        remark: this.data.enquiryCompany.intro,
        industry: this.data.enquiryCompany.industry,
        website: this.data.enquiryCompany.website,
        companySize: this.data.enquiryCompany.size,
        mainProduct: this.data.enquiryCompany.product,
        tradRecommendId: this.data.recommendId,
        createSource: 'commercial_opportunity_create',
        name,
        companyName: this.data.enquiryCompany.name,
        telephone: JSON.stringify([{
          type: 8,
          telephone: this.data.enquiryCompany.telephone
        }])
      }
      enquiriesAPI.addCompany(params).then(res => {
        if (!res.data.code) {
          this.$message.success('添加成功')
          let id = res.data.data.id
          this.addSuccess = true
          this.personId = id
        } else {
          this.$message.error(res.data.message)
          if (res.data.message === '联系人已被他人添加') {
            this.isAddeSub = 0
          }
        }
      })
    },
    toContact () {
      let type = 0
      let name = `${this.data.enquiryPerson.firstname || ''}${this.data.enquiryPerson.lastname || ''}`
      if (name.length === 0) {
        type = 1
      }
      if (this.personId) {
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': type, 'contactId': this.personId}
        })
        return
      }
      let enquiryCompany = this.data.enquiryCompany
      let enquiryPerson = this.data.enquiryPerson
      if (enquiryPerson.firstname === '' || enquiryPerson.firstname === null) {  // 公司
        let id = enquiryCompany.contactsCompanyId
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 1, 'contactId': id}
        })
      } else {  // 联系人
        let id = enquiryPerson.contactsPersonId
        this.$router.push({
          path: '/contactDetail',
          query: {'contactType': 0, 'contactId': id}
        })
      }
    },
    digMail () {
      let params = {
        domain: this.data.enquiryCompany.domain,
        firstName: this.data.enquiryPerson.firstname,
        lastName: this.data.enquiryPerson.lastname
      }
      enquiriesAPI.emailPersonGig(params).then(res => {
        if (!res.data.code) {
          let mail = res.data.data.mail
          if (mail !== '' && mail !== null) { // 挖掘数据成功
            this.email = mail
          } else {   // 没有挖掘到数据
            this.$message.success('未找到联系人邮箱')
          }
        }
      })
    },
    confirmDel () {
      enquiriesAPI.deleteTag({ keywords: this.data.keywords }).then(res => {
        if (!res.data.code) {
          this.$emit('delTag', true)
          this.$message.success('删除成功')
        }
      })
    },
    delRec (e) {
      e.stopPropagation()
      this.delDialogConfig.visible = true
    },
    showDetail () {
      this.dialogVisible = true
    }
  },
  props: {
    data: {
      type: Object
    },
    isAddeSub: {
      type: Number
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
  .micro {
  display: inline-block;
  vertical-align: top;
  width: 380px;
  margin-bottom: 30px;
  background: #FFFFFF;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.10);
  border-radius: 2px;
  .xunpan-container{
    cursor: pointer;
  }
  .title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 48px;
  border-bottom: 1px solid #EAF0F6;
  h3 {
  font-weight: normal;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  margin-left: 20px;
  margin-right: 3px;
  }
  div:nth-of-type(1) {
  display: inline-block;
  height: 28px;
  margin-left: 7px;
  font-size: 13px;
  color: #33475B;
  letter-spacing: 0;
  background-color: rgba(255, 59, 110, 0.40);
  border-radius: 5px;
  span {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  line-height: 28px;
  padding: 0 13px;
  max-width: 260px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .del-btn{
    cursor: pointer;
    position: absolute;
    display: inline-block;
    font-size: 14px;
    top: 2px;
    right: 10px;
  }
  }
  }
  }
  .commonEnq{
    .pic-box{
    width: 80%;
    margin: auto;
  }
  }
  .content-top {
  box-sizing: border-box;
  padding: 16px 20px;
  .pic-box{
    width: 80%;
    margin: auto;
  }
  .top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  // .conpic{
  // height: 14px;
  // width: 13px;
  // display: inline-block;
  // background-image: url(../../../assets/xunpan/apic.svg);
  // background-size: 100% 100%;
  // }
  i {
  font-size: 13px;
  }
  span {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #33475B;
  letter-spacing: 0;
  margin: 0px 2px;
  }
  p {
  width: 290px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #444444;
  letter-spacing: 0;
  }
  }
  .say-some {
  margin-top: 8px;
  margin-bottom: 8px;
  font-family: HelveticaNeue;
  font-size: 14px;
  color: #888888;
  letter-spacing: 0;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* autoprefixer: off*/
  -webkit-box-orient: vertical;
  /* autoprefixer: on*/
  -webkit-line-clamp: 3;
  }
  .oriTitle {
    font-size: 16px;
    font-weight: bold;
  }
  .fenlei {
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  line-height: 20px;
  color: #444444;
  letter-spacing: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 8px;
  }
  .what-time {
  font-family: HelveticaNeue;
  font-size: 14px;
  color: #888888;
  letter-spacing: 0;
  line-height: 18px;
  }
  }
  .bottom-content {
  background-color: #F8F9FD;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 11px;
  .contact-you {
  width: 80px;
  height: 28px;
  background-color: transparent;
  margin-right: 20px;
  .el-button {
    padding: 6px 14px;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #FFFFFF;
    letter-spacing: 0;
  i {
    font-size: 10px;
    margin-right: 2px;
    position: relative;
    top: -1px;
  }
  }
  }
  .see-detail {
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: #666666;
  line-height: 21px;
  margin-right: 20px;
  }
  }
  .dia-detail{
    .el-dialog__header{
    display: none;
    }
    .el-dialog{
    width: 680px;
    height: 477px;
    overflow-y: scroll;
    }
    .el-dialog__body{
    padding: 0px;
    }
    .top-box{
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom:1px solid #EAF0F6;
    .close-btn{
      cursor: pointer;
      font-size: 40px;
      color: #b3b3b3;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    h3{
    font-family: "微软雅黑";
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    margin-left: 20px;
    margin-right: 6px;
    }
    div:nth-of-type(1) {
    display: inline-block;
    height: 28px;
    font-size: 13px;
    color: #33475B;
    letter-spacing: 0;
    background-color: rgba(255,59,110,0.40);
    border-radius: 5px;
    span {
    display: inline-block;
    max-width: 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    line-height: 28px;
    padding: 0 13px;
    .del-btn{
      cursor: pointer;
      position: absolute;
      display: inline-block;
      font-size: 14px;
      top: 2px;
      right: 7px;
    }
    }
    }
    }
    .next-box{
    width: 100%;
    height: 340px;
    box-sizing: border-box;
    padding: 20px;
    .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    // .conpic{
    // height: 18px;
    // width: 18px;
    // display: inline-block;
    // background-image: url(../../../assets/xunpan/apic.svg);
    // background-size: 100% 100%;
    // }

    span {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #33475B;
    letter-spacing: 0;
    margin: 0px 2px;
    margin-right: 5px;
    }
    p {
    width: 570px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: PingFangSC-Semibold;
    font-size: 18px;
    color: #444444;
    letter-spacing: 0;
    }
    }
    .say-some {
    margin-top: 17px;
    margin-bottom: 16px;
    font-family: HelveticaNeue;
    font-size: 14px;
    color: #888888;

    line-height: 20px;
    word-wrap: break-word;
    }
    .connect{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #888888;
    letter-spacing: 0;
    margin-bottom: 8px;
    .dig-btn{
      padding: 0 13px;
      span{
        color: #fff;
        font-size: 12px;
      }
    }
    span{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #000000;
    letter-spacing: 0;
    line-height: 24px;
    }
    .fenlei{
    margin-top: 21px;
    }
    }
    .what-time {
    font-family: HelveticaNeue;
    font-size: 14px;
    color: #888888;
    letter-spacing: 0;
    line-height: 18px;

    }
    .add-contact-box{
      width: 100%;
      height: 50px;
      border-top: 1px solid #EAF0F6;
      line-height: 50px;
      margin-top: 20px;
      .el-button{
        float: right;
        margin-top: 10px;
        padding: 7px 16px;
      }
    }
    }
  }
  .del-dialog{
     .el-dialog{
      .el-dialog__body{
        font-size: 14px;
        color: #444;
        line-height: 21px;
        .confirm-main{
          .icon-font{
            color: #ff3b6e;
            vertical-align: top;
          }
          span{
            vertical-align: top;
            display: inline-block;
            width: 236px;
            font-size: 14px;
            color: #444;
            line-height: 21px;
          }
        }
        .confirm-btn{
          .confirm{
            background-color: #ff3b6e;
          }
        }
      }
     }
  }

  }
</style>

