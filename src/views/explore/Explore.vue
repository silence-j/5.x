<template>
  <div>
    
    <div class="ppcContainer">
      <div class="head">探索</div>
      <div class="search"><input type="text" class="in-text" placeholder="请输入要搜索的内容" v-model="searchText"><button class="en-search" @click="search">搜索</button></div>
      <div class="main">
        <div class="ppc-title"><h3 style="display: inline-block" @click="jump">PPC:</h3>
          <router-link :to="{ name: 'ppcList'}"><button>更多</button></router-link>
        </div>
       <div class="ppc-main">
         <ul class="ppcUl">
           <li v-for="items in (ppcData.records).slice(0,4)">
             <span class="icon-font icon-new" v-if="items.hasRead == 0">&#xe6f0;</span>
             <div class="cards">
               <div class="img-box">
                 <img src="" alt="">
               </div>
               <div class="info-box">
                 <p class="one-line sty"><span class="name">{{items.name}}</span>
                   <span class="add" @click="addPerson(items)">+</span>
                 </p>
                 <p class="sty char-limit"><span>{{items.position}}</span><span>{{items.department}}</span></p>
                 <p class="sty char-limit">{{items.companyName}}</p>
                 <p class="describe">{{items.showTitle}}
                   <span class="icon-font ppc-icon" v-if="items.type>=0 && items.type<=4">&#xe6a4;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == 5">&#xe6ae;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == 6">&#xe6fe;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == -1 && items.facebookUrl != null&& items.facebookUrl != ''">&#xe6a4;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == -1 && items.twitterUrl != null&& items.twitterUrl != ''">&#xe6ae;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == -1 && items.linkedinUrl != null&& items.linkedinUrl != ''">&#xe6fe;</span>
                   <span class="icon-font ppc-icon" v-if="items.type == -1 && items.pinterestUrl != null&& items.pinterestUrl != ''">&#xe6ff;</span>
                 </p>
               </div>
             </div>
           </li>
         </ul>
       </div>
        <div class="leads-title"><h3>LEADS:</h3></div>
        <div class="leads-main">
          <ul class="leadsUl">
            <li  v-for="(items,index) in leadData" :class="'li'+index">
              <div class="lead-card">
                <div class="lead-img">
                  <!--<div @click="portSea(items.recommendedName)">-->
                    <img :src="items.avatar" alt="" v-if="items.socialAccountType == 5" @click="portSea(items.recommendedName)">
                  <!--</div>-->
                  <img v-else :src="items.avatar"  alt="" >
                  <i class="icon-font lead-icon" v-if="items.socialAccountType == 0 || items.socialAccountType == 1">&#xe6a4;</i>
                  <i class="icon-font lead-icon" v-if="items.socialAccountType == 2">&#xe6ae;</i>
                  <i class="icon-font lead-icon" v-if="items.socialAccountType == 3 || items.socialAccountType == 4">&#xe6fe;</i>
                </div>
                <div class="lead-info">
                  <p class="first">
                    <span class="name">{{items.recommendedName}}</span><span class="port" v-if="items.socialAccountType == 5">海关</span>
                    <span class="operation">
                      <span class="del" @click="removePerson(items.recommendForUserId,index)">✖</span>
                      <span class="add" @click="addContact(items.recommendForUserId,items.socialAccountType)">✚</span>
                    </span>
                  </p>
                  <p class="describe">{{items.content}}</p>
                </div>
                <div class="lead-foot">
                  <div class="title">关键字</div>
                  <div class="keyword">
                    <span>{{items.keywords}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
    <div class="kind-dialog">
      <!--<el-dialog title="详情" v-model="showReturn">-->
        <!--<el-table>-->
          <!--<el-table-column label="来源国"></el-table-column>-->
          <!--<el-table-column label="产品描述"></el-table-column>-->
          <!--<el-table-column label="交易时间"></el-table-column>-->
          <!--<el-table-column label="重量"></el-table-column>-->
          <!--<el-table-column label="供应商"></el-table-column>-->
        <!--</el-table>-->
      <!--</el-dialog>-->
    </div>
  </div>
</template>
<script>

import exploreAPI from '@/api/exploreAPI'
export default {
  name: 'explore',
  data () {
    return {
      ppcData: {
        records: []
      },
      leadData: [],
      allList: [],
      telphone: [], // ppc中phone telphone fax
      mails: '', // ppc中的email
      sociaes: [], // ppc中社交网站列表
      display: true,
      nowIndex: 12,
      showReturn: false,
      searchText: ''
    }
  },
  components: { exploreAPI },
  mounted: function () {
//    ppc数据获取
    let params = {type: 1, page: 1, size: 10}
    this.ppcList(params)
//    海关数据LESDS获取
//    localStorage.getItem(userId)
//    console.log(123)
//    console.log(localStorage.getItem(userId));
    this.leadsList({userId: window.localStorage.userId})
  },
  methods: {
//    获取ppc数据
    ppcList (params) {
      console.log(88)
      exploreAPI.getPpcList(params).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.ppcData = res.data.data
          console.log(88)
          console.log(this.ppcData.records)
        }
      })
    },
//    获取海关leads数据
    leadsList (params) {
      console.log(params)
      exploreAPI.getLeads(params).then(res => {
        if (res.data.code === 0) {
          if (res.data.data !== null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].isAdded === 0) {
                this.allList.push(res.data.data[i])
              }
            }
//          this.leadData = res.data.data
            if (this.allList.length > 12) {
              this.leadData = this.allList.slice(0, 12)
            } else {
              this.leadData = res.data.data
            }
          }
        }
      })
    },
//    ppc添加联系人
    addPerson: function (data) {
      console.log(1)
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
        if (res.data.code === 1) {
          this.$message.success('添加成功')
        }
      })
    },
//    leads添加联系人
    addContact: function (id, type) {
      let params = {recommendForUserId: id, socialAccountType: type}
      exploreAPI.addLeads(params).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.$message.success('添加成功')
        } else {
          this.$message.error('添加失败')
        }
      })
    },
//    Lead海关移除联系人
    removePerson: function (id, index) {
      let params = {recommendForUserId: id, userId: window.localStorage.userId}
      exploreAPI.removeContact(params).then(res => {
        if (res.data.code === 0) {
          if (this.nowIndex < this.allList.length - 1) {
            this.leadData.splice(index, 1, this.allList[this.nowIndex])
            this.nowIndex++
          } else {
            this.leadData.splice(index, 1)
          }
          this.$message.success('移除成功')
        } else {
          this.$message.error('移除失败')
        }
      })
    },
    jump: function () {
      this.$router.push({path: '/ppcList'})
    },
//    公司搜索
    search: function () {
      if (this.searchText === '') {
        this.$message.warning('请输入内容')
      } else {
        this.$router.push({
          path: '/search',
          query: {searchText: this.searchText}
        })
      }
    },
    portSea: function (purchaser) {
      alert(111)
//      this.showReturn === true
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  body{
    margin: 0 auto;
    .ppcContainer{
      .head{
        padding-left: 20px;
        height: 60px;
        line-height: 60px;
        font-weight: bold;
        background-color: #ffffff;
        border-bottom: 1px solid #e4e4e4;
        font-size: 14px;
        /*position: fixed;*/
        /*top: 0;*/
        /*width: 100%;*/
        /*z-index: 100;*/
      }
      .search{
        margin: 10px auto 10px;
        background: #FFFFFF;
        border: 1px solid #D8D8D8;
        width: 1000px;
        .in-text{
          width: 880px;
          height: 50px;
          border: none;
        }
        .en-search{
          display: inline-block;
          height: 52px;
          width: 120px;
          background: #F0F0F0;
          padding: 0;
          border: none;
        }
      }
      .main{
        width: 100%;
        height: 3000px;
        background: #f0f0f0;
        padding: 10px 20px 0;
        .ppc-main{
          margin-top: 0;
          position: relative;
          height: 200px;
        }
        ul{
          list-style: none;
          padding: 0;
        }
        .ppc-main{
          .ppcUl{
            /*list-style: none;*/
            /*padding: 0;*/
            li{
              width: 24%;
              float: left;
              height: 100%;
              box-shadow: 1px 1px 2px #ccc;
              padding-bottom: 20px;
              background: #fff;
              margin-right: 0.5%;
              margin-left: 0.5%;
              margin-bottom: 22px;
              position: relative;
              overflow: hidden;
              /*height: 160px;*/
              .icon-new{
                position: absolute;
                color: #83c94a;
                font-size: 38px;
              }
              .cards{
                margin: 20px 20px 0 20px;
                overflow: hidden;
                position: relative;
                .img-box{
                  width: 40px;
                  height: 40px;
                  overflow: hidden;
                  cursor: pointer;
                  vertical-align: top;
                  background: pink;
                  position: absolute;
                  img{
                    /*width: 100%;*/
                  }
                }
                .info-box{
                  display: inline-block;
                  padding-left: 56px;
                  font-size: 12px;
                  p{
                    height: 14px;
                  }
                  .one-line{
                    margin-top: 0;
                    font-weight: 600;
                    .name{
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      line-height: 19px;
                      cursor: pointer;
                    }
                    .add{
                      position: absolute;
                      right: 0px;
                      top: 1px;
                      font-size: 20px;
                      color: red;
                      cursor: pointer;
                    }
                  }
                  .char-limit{
                    width: 80%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .describe{
                    margin-top: 10px;
                    word-break: break-all;
                    width: 94%;
                    max-height: 50px;
                    overflow: hidden;
                    min-height: 50px;
                    display: -webkit-box;
                    .ppc-icon{
                      color: #3B5998;
                      vertical-align: middle;
                    }
                    /*-webkit-box-orient: vertical;*/
                    /*-webkit-line-clamp: 3;*/
                  }

                }
              }

            }
          }
        }
        .leads-title{
          margin-top: 0;
          position: relative;
        }
        .leads-main{
          .leadsUl{
            li{
              width: 24%;
              float: left;
              height: 100%;
              box-shadow: 1px 1px 2px #ccc;
              padding-bottom: 20px;
              background: #fff;
              margin-right: 0.5%;
              margin-left: 0.5%;
              margin-bottom: 22px;
              position: relative;
              overflow: hidden;
              .lead-card{
                margin: 20px 20px 0 20px;
                overflow: hidden;
                position: relative;
                .lead-img{
                  width: 40px;
                  vertical-align: top;
                  position: absolute;
                  height: 40px;
                  cursor: pointer;
                  overflow: hidden;
                  background: pink;
                  img{
                    width: 100%;
                  }
                  .lead-icon{
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    background: #fff;
                    z-index: 22;
                    color: #3B5998;
                  }
                }
                .lead-info{
                  display: inline-block;
                  padding-left: 56px;
                  .first{
                    font-size: 12px;
                    font-weight: 600;
                    margin-top: 0;
                    .name{
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      line-height: 19px;
                      cursor: pointer;
                    }
                    .port{
                      width: 20px;
                      height: 12px;
                      background: orange;
                      border-radius: 6px;
                    }
                    .operation{
                      position: absolute;
                      right: 0px;
                      top: 1px;
                      .del{
                        font-size: 19px;
                        box-sizing: border-box;
                        cursor: pointer;
                        color: gray;

                      }
                      .add{
                        font-size: 19px;
                        box-sizing: border-box;
                        cursor: pointer;
                        color: red;
                        cursor: pointer;
                      }
                    }

                  }
                  .describe{
                    font-size: 12px;
                    margin-top: 10px;
                    word-break: break-all;
                    width: 94%;
                    max-height: 50px;
                    overflow: hidden;
                    min-height: 50px;
                    display: -webkit-box;
                    /* autoprefixer: off*/
                    -webkit-box-orient: vertical;
                    /* autoprefixer: on*/
                    -webkit-line-clamp: 3;
                  }
                }
                .lead-foot{
                  font-size: 12px;
                  border-top: 1px dotted #d8d8d8;
                  margin-top: 10px;
                  padding-top: 10px;
                  .title{
                    display: block;
                    float: left;
                    width: 20%;
                  }
                  .keyword{
                    display: block;
                    float: left;
                    width: 80%;
                    /*span{*/
                      /*max-width: 80px;*/
                      /*overflow: hidden;*/
                      /*display: inline-block;*/
                      /*white-space: nowrap;*/
                      /*text-overflow: ellipsis;*/
                    /*}*/
                  }
                }

              }
            }

          }
        }

      }

    }
  }
</style>
