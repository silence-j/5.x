<template>
  <div class="ppc">
    <button @click="reBack">返回</button>
    <h3 style="margin-bottom: 15px;margin-top: 10px">ppc列表</h3>
    <div class="total">ppc数据共有 <span>{{ppcData.totalCount}}</span>条</div>
    <div class="ppc-container" v-for="items in ppcData.records">
      <i class="icon-font icon-new" v-if="items.hasRead == 0">&#xe6f0;</i>
      <div class="ppc-img" @click="showDetail(items.contactId)"><img src="" alt=""></div>
      <div class="info" >
        <button @click="add(items)">添加联系</button>
        <!--<button @click="add(items)" v-if="items.hasAddContact == 0">添加联系</button>-->
        <!--<button @click="show(items)" v-if="items.hasAddContact == 1">查看联系</button>-->
        <p class="name">{{items.name}}</p>
        <p class="company">
          <span class="position">{{items.position}}</span>
          <span class="department">{{items.department}}</span>
        </p>
        <p class="describe">{{items.showTitle}}</p>
        <span class="icon-font ppc-icon" v-if="items.type>=0 && items.type<=4">&#xe6a4;</span>
        <span class="icon-font ppc-icon" v-if="items.type == 5">&#xe6ae;</span>
        <span class="icon-font ppc-icon" v-if="items.type == 6">&#xe6fe;</span>
        <span class="icon-font ppc-icon" v-if="items.type == -1 && items.facebookUrl != null&& items.facebookUrl != ''">&#xe6a4;</span>
        <span class="icon-font ppc-icon" v-if="items.type == -1 && items.twitterUrl != null&& items.twitterUrl != ''">&#xe6ae;</span>
        <span class="icon-font ppc-icon" v-if="items.type == -1 && items.linkedinUrl != null&& items.linkedinUrl != ''">&#xe6fe;</span>
        <span class="icon-font ppc-icon" v-if="items.type == -1 && items.pinterestUrl != null&& items.pinterestUrl != ''">&#xe6ff;</span>
      </div>
    </div>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  export default {
    name: 'ppcList',
    data () {
      return {
        ppcData: {},
        telphone: [],
        mails: [],
        sociaes: []
      }
    },
    created: function () {
      console.log('created')
    },
    mounted: function () {
      let params = {type: 1, page: 1, size: 10}
      this.ppcList(params)
    },
    components: {
    },
    methods: {
      reBack: function () {
        window.history.back()
      },
      ppcList: function (params) {
        exploreAPI.getPpcList(params).then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            this.ppcData = res.data.data
          }
        })
      },
//      跳转详情页
      showDetail: function (contactId) {
        this.$router.push({
          path: '/ppcDetail',
          query: {
            contactId: contactId
          }
        })
      },
      //    ppc添加联系人
      add: function (data) {
        console.log(44)
        if (data.phone !== null && data.phone !== '') {
          let phoneStr = {type: 8, telephone: data.phone}
          this.telphone.push(phoneStr)
        }
        if (data.telephone !== null && data.telephone !== '') {
          let telephoneStr = {type: 2, telephone: data.telephone}
          this.telphone.push(telephoneStr)
        }
        if (data.fax !== null && data.fax !== '') {
          let faxStr = {type: 7, telephone: data.fax}
          this.telphone.push(faxStr)
        }
        if (this.telphone.length > 0) {
          this.telphone = JSON.stringify(this.telphone)
        }
        if (data.email !== null && data.email !== '') {
          let emailStr = {type: 0, telephone: data.email}
          this.mails = JSON.stringify([emailStr])
        }
        if (data.facebookHomepage !== null && data.facebookHomepage !== '') {
          let fbStr = {platform: 0, url: data.facebookHomepage}
          this.sociaes.push(fbStr)
        }
        if (data.twitterHomepage !== null && data.twitterHomepage !== '') {
          let twStr = {platform: 1, url: data.twitterHomepage}
          this.sociaes.push(twStr)
        }
        if (data.linkedInHomepage !== null && data.linkedInHomepage !== '') {
          let lnStr = {platform: 2, url: data.linkedInHomepage}
          this.sociaes.push(lnStr)
        }
        if (this.sociaes.length > 0) {
          this.sociaes = JSON.stringify(this.sociaes)
        }
        let paramsObj = {
          purchaserId: data.purchaerId,
          firstName: data.name,
          department: data.department,
          companyName: data.companyName,
          position: data.position,
          telephones: this.telphone,
          mails: this.mails,
          sociaes: this.sociaes,
          createSource: 'ppc_create'
        }
        exploreAPI.addPpc(paramsObj).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .ppc{
    .total{
      border-bottom: 1px solid #E7E7E7;
      padding-bottom: 10px;
    }
    .ppc-container{
      border-bottom: 1px solid #E7E7E7;
      position: relative;
      padding: 20px 20px 20px 14px;
      .icon-new{
        position: absolute;
        color: #83c94a;
        font-size: 38px;
        z-index: 9;
      }
      .ppc-img{
        background: pink;
        height:64px;
        width: 64px;
        display: inline-block;
        position: absolute;
      }
      .info{
        font-size: 12px;
        display: inline-block;
        margin-left: 10px;
        padding-left: 64px;
        button{
          position: absolute;
          width: 90px;
          height: 34px;
          color: #fff;
          background: pink;
          cursor: pointer;
          right: 0;
        }
        p{
          margin-bottom: 12px;
          height: 12px;
        }
        .name{
          font-weight: 600;
          height: 12px;
        }
        .describe{
          display: inline-block;
          .ppc-icon{
            color: #3B5998;
            vertical-align: middle;
          }
        }
      }
    }
  }

</style>
