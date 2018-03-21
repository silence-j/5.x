<template>
  <div class="ppc-bg">
    <div class="ppc-container">
      <div class="back">
      <span @click="back">
        <!--<span class="icon-font">&#xe600;</span>-->
        <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
        返回
      </span>
      </div>
      <div class="all-info">
        <div class="head-detail">
          <div class="ppc-detail-top">
            <div class="left">
              <img class="ppc-avatar" src="../../../assets/img/ppcDetail/default-head.png">
            </div>
            <div class="right">
              <div class="ppc-name">
                <span class="name" :title='name'>{{name}}</span>
                <a class="f-logo" v-if="facebookHomepage" :href="facebookHomepage" target="_blank">
                  <span class="icon-font">&#xe68d;</span>
                </a>
                <a class="t-logo" v-if="twitterHomepage" :href="twitterHomepage" target="_blank">
                  <span class="icon-font">&#xe621;</span>
                </a>
                <a class="in-logo" v-if="linkedinHomePage" :href="linkedinHomePage" target="_blank">
                  <span class="icon-font">&#xe616;</span>
                </a>
              </div>
              <div class="p-title">所属公司</div>
              <div class="p-info">{{poInfo.companyName}}</div>
              <div class="p-title">部门</div>
              <div class="p-info">{{department}}</div>
              <div class="p-title">职位</div>
              <div class="p-info">{{position}}</div>
              <br>
              <div class="p-title pad-title">邮箱</div>
              <div class="p-info">{{email}}</div>
              <div class="p-title">电话</div>
              <div class="p-info">{{telephone}}</div>

            </div>
           <div class="left-btn">
              <span v-if="!poInfo.hasAddContact"  class="look-person" @click="addContact">
                <span class="icon-font">&#xe684;</span>
                添加
              </span>
              <span v-if="poInfo.hasAddContact" class="look-person" @click="viewContact(poInfo.contactId)">
                <span class="icon-font">&#xe60c;</span>
                查看
              </span>
            </div>

          </div>
        </div>

      </div>
      </div>
      <div class="ppcs-wrap">
         <!-- 先遍历intentions 对象 -->
         <div v-if="intentions.length&&record.name" class="pcc-item" v-for="(record,index) in intentions">
           <!-- facebook fb -->
           <template v-if="record.type===0">
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在
               <span class="base-color">
              <a :href="record.name" target="_blank">
                同行主页
              </a>
              </span> 里表达过与
               <span class="base-color">
                #{{poInfo.tag}}#
              </span> 相关的直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook">
               </div>
             </div>
           </template>
           <template v-if="record.type===1">
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在
               <span class="base-color">
              <a :href="record.name" target="_blank">
                小组
              </a>
              </span> 里表达过与
               <span class="base-color">
                #{{poInfo.tag}}#
              </span> 相关的直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook">
               </div>
             </div>
           </template>
           <template v-if="record.type===2">
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在
               <span class="base-color">
                #{{poInfo.tag}}#
              </span> 相关的
               <span class="base-color">
              <a :href="record.name" target="_blank">
                地点
              </a>
              </span> 里表达过直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook">
               </div>
             </div>
           </template>
           <template v-if="record.type===3">
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在
               <span class="base-color">
                #{{poInfo.tag}}#
              </span> 相关的
               <span class="base-color">
              <a :href="record.name" target="_blank">
                活动
              </a>
              </span> 里表达过直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook">
               </div>
             </div>
           </template>
           <template v-if="record.type===4">
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在
               <span class="base-color">
                 <a :href="record.name" target="_blank">
                   {{record.name}}
                 </a>
              <!--{{record.name}}-->
              </span> 外贸主页里表达过与
               <span class="base-color">
                #{{poInfo.tag}}#
              </span> 相关的直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook">
               </div>
             </div>
           </template>

           <!-- facebook END -->
           <!-- twitter -->
           <template v-if="record.type===5">
             <div class="pcc-msg">
               {{record.name}}
             </div>
             <div class="pcc-sub-content">
               {{record.content}}
               <div class="arr"></div>
             </div>


             <div class="pcc-foot">
               {{poInfo.name}}
               在
               <span class="base-color">
              {{poInfo.tag}}
              </span>
               相关的推文里表达过直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/twitter-tiny.png" alt="twitter">
               </div>
             </div>
           </template>
           <!-- twitter END -->
           <!-- linkIn -->
           <template v-if="record.type===6">
             <div class="pcc-msg">
               {{record.name}}
             </div>
             <div class="pcc-sub-content">
               {{record.content}}
               <div class="arr"></div>
             </div>


             <div class="pcc-foot">
               {{poInfo.name}}
               在
               <span class="base-color">
              {{poInfo.tag}}
              </span>
               相关的领英动态里表达过直接采购意向
               <div class="platform-from">
                 来源平台：
                 <img src="../../../assets/img/ppcDetail/linkedIn-tiny.png" alt="linkin">
               </div>
             </div>
           </template>
           <!-- linkIn END -->

         </div>
         <!-- 列表循环 END -->
         <!-- 多平台匹配 -->
         <template  v-if="poInfo.facebookUrl||poInfo.twitterUrl||poInfo.linkedinUrl||poInfo.pinterestUrl">
           <div class="pcc-item pcc-url-item">
             <div class="white-wraper">
               <div class="pcc-info-item">
                 {{poInfo.name}} 在
                 <template v-if="poInfo.facebookUrl">Facebook &nbsp;</template>
                 <template v-if="poInfo.twitterUrl">Twitter &nbsp;</template>
                 <template v-if="poInfo.linkedinUrl">Linkedin &nbsp;</template>
                 <template v-if="poInfo.pinterestUrl">Pinterest</template>
                 中信息一致
                 <span style="float:right;margin-right:20px;">
                   <template v-if="poInfo.facebookUrl"> <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook" width="12px"> &nbsp;</template>
                   <template v-if="poInfo.twitterUrl"><img src="../../../assets/img/ppcDetail/twitter-tiny.png" alt="Twitter" width="12px"> &nbsp;</template>
                   <template v-if="poInfo.linkedinUrl"><img src="../../../assets/img/ppcDetail/linkedIn-tiny.png" alt="Linkedin" width="12px"> &nbsp;</template>
                   <template v-if="poInfo.pinterestUrl"> <i class="icon iconmoon icon-font" style="color:rgb(215,0,0);vertical-align: top;">&#xe6ff;</i></template>
                </span>
               </div>
             </div>
             <div class="pcc-foot" v-if="poInfo.facebookUrl">
               <img src="../../../assets/img/ppcDetail/facebook-tiny.png" alt="facebook" width="16px">
               Facebook链接：
               <a >
                 {{poInfo.facebookUrl}}
               </a>
             </div>
             <div class="pcc-foot" v-if="poInfo.twitterUrl" style="margin-top:2px;">
               <img src="../../../assets/img/ppcDetail/twitter-tiny.png" alt="Twitter" width="16px">
               Twitter链接：
               <a >
                 {{poInfo.twitterUrl}}
               </a>
             </div>
             <div class="pcc-foot" v-if="poInfo.linkedinUrl" style="margin-top:2px;">
               <img src="../../../assets/img/ppcDetail/linkedIn-tiny.png" alt="Linkedin" width="16px">

               Linkedin：
               <a >
                 {{poInfo.linkedinUrl}}
               </a>
             </div>
             <div class="pcc-foot" v-if="poInfo.pinterestUrl" style="margin-top:2px;">
               <i class="icon-font" style="color:rgb(215,0,0);vertical-align: bottom;font-size: 16px;">&#xe6ff;</i>
               Pinterest：
               <a >
                 {{poInfo.pinterestUrl}}
               </a>
             </div>

           </div>

         </template>
         <!-- 多平台匹配 END -->
         <!-- 遍历 activities 对象 -->
         <div v-if="activities.length&&record.activityName" class="pcc-item" v-for="(record,index) in activities">
           <!-- 报名 -->
           <template v-if="record.type===0">
             <div class="white-wraper">
               <div class="pcc-info-item">
                 <label>活动名称：</label><span>{{record.activityName}}</span>
               </div>
               <hr>
               <div class="pcc-info-item">
                 <label>活动链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}报名了与
               <span class="base-color">
                      #{{poInfo.tag}}#
                    </span> 相关的活动
             </div>
           </template>
           <!-- 报名 END-->
           <!-- 感兴趣 -->
           <template v-if="record.type===1">
             <div class="white-wraper">
               <div class="pcc-info-item">
                 <label>活动名称：</label><span>{{record.activityName}}</span>

               </div>
               <hr>
               <div class="pcc-info-item">
                 <label>活动链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}感兴趣了与
               <span class="base-color">
                       #{{poInfo.tag}}#
                    </span> 相关的活动
             </div>
           </template>
           <!-- 感兴趣 END-->

           <!-- 受邀 -->
           <template v-if="record.type===2">
             <div class="white-wraper">
               <div class="pcc-info-item">
                 <label>活动名称：</label><span>{{record.activityName}}</span>

               </div>
               <hr>
               <div class="pcc-info-item">
                 <label>活动链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}受邀了与
               <span class="base-color">
                       #{{poInfo.tag}}#
                    </span> 相关的活动
             </div>
           </template>
           <!-- 受邀 END-->
           <!-- 评论 -->
           <template v-if="record.type===3">
             <div class="yellow-wraper">
               <div class="pcc-info-item">
                 <label>活动名称：</label><span>{{record.activityName}}</span>
               </div>
               <hr>
               <div class="pcc-info-item">
                 <label>活动链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}评论了与
               <span class="base-color">
                       #{{poInfo.tag}}#
                    </span> 相关的活动
             </div>
           </template>
           <!-- 评论 END-->
           <!-- 发帖 -->
           <template v-if="record.type===4">
             <div class="yellow-wraper">
               <div class="pcc-info-item">
                 <label>活动名称：</label><span>{{record.activityName}}</span>
               </div>
               <hr>
               <div class="pcc-info-item">
                 <label>活动链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}发了与
               <span class="base-color">
                      #{{poInfo.tag}}#
                    </span> 相关的帖子
             </div>
           </template>
           <!-- 发帖 END-->
           <!-- 小组互动 -->
           <template v-if="record.type===5">
             <div class="yellow-wraper">

               <div class="pcc-info-item">
                 <label>小组链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在与
               <span class="base-color">
                       #{{poInfo.tag}}#
                    </span> 相关的小组
               <span class="base-color">
                     {{record.activityName}}
                    </span>进行互动
             </div>
           </template>
           <!-- 小组互动 END-->
           <!-- 签到地点互动 -->
           <template v-if="record.type===6">
             <div class="yellow-wraper">

               <div class="pcc-info-item">
                 <label>地点链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在与
               <span class="base-color">
                       #{{poInfo.tag}}#
                    </span> 相关的地点
               <span class="base-color">
                     {{record.activityName}}
                    </span>进行互动
             </div>
           </template>
           <!-- 签到地点互动 END-->
           <!-- 大型平台互动 -->
           <template v-if="record.type===7">
             <div class="yellow-wraper">

               <div class="pcc-info-item">
                 <label>平台链接：</label>
                 <a :href="record.activityUrl" target="_blank">
                   {{record.activityUrl}}
                 </a>
               </div>
             </div>
             <div class="pcc-msg">
               "{{record.content}}"
             </div>
             <div class="pcc-foot">
               {{poInfo.name}}在与
               <span class="base-color">
                      #{{poInfo.tag}}#
                    </span> 相关的贸易平台
               <span class="base-color">
                     {{record.activityName}}
                    </span>进行了留言或评论
             </div>
           </template>
           <!-- 大型平台互动 END-->
         </div>
         <!-- 遍历 activities 对象 END-->


        <!--<div class="loading" v-show="isLoad"></div>-->
        <div v-if="page >= totalPages && intentions.length" class="loadMore">无更多信息</div>
        <div v-if="page < totalPages && intentions.length" class="loadMore"><a @click="loadMore">加载更多</a></div>
      </div>
    </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  import Util from '@/common/Util.js'
  export default {
    data () {
      return {
        poInfo: {},
        intentions: [],
        activities: [],
        page: 1,
        totalPages: 1,
        maxLength: 100,
        position: '',
        department: '',
        name: '',
        telephone: '',
        email: '',
        facebookHomepage: '',
        twitterHomepage: '',
        linkedinHomePage: '',
        personId: ''
//        isLoad: false
      }
    },
    mounted () {
      /**
       * 重写上层滚动绑定事件
       * @return {[type]} [description]
       */
//      window.onscroll = function() {
//      }
      var postData = {
        poolId: this.$route.query.poolId
      }
      this.isLoad = true
      exploreAPI.getPpcDetail(postData).then(res => {
        console.log(res.data.code)
//          this.isLoad = false
        if (res && !res.data.code) {
          this.intentions = res.data.data ? res.data.data.intentions : []
          this.activities = res.data.data ? res.data.data.activities : []
          this.poInfo = res.data.data ? res.data.data : {}
          this.position = res.data.data.position
          this.department = res.data.data.department
          this.name = res.data.data.name
          this.telephone = res.data.data.telephone
          this.email = res.data.data.email
          this.facebookHomepage = res.data.data.facebookHomepage
          if (this.facebookHomepage !== '' && this.facebookHomepage !== null) {
            this.facebookHomepage = Util.checkUrl(this.facebookHomepage)
          }
          this.twitterHomepage = res.data.data.twitterHomepage
          if (this.twitterHomepage !== '' && this.twitterHomepage !== null) {
            this.twitterHomepage = Util.checkUrl(this.twitterHomepage)
          }
          this.linkedinHomePage = res.data.data.linkedinHomePage
          if (this.linkedinHomePage !== '' && this.linkedinHomePage !== null) {
            this.linkedinHomePage = Util.checkUrl(this.linkedinHomePage)
          }
          this.totalPages = res.data.data ? res.data.data.totalPages : 0
        }
      })
    },

    methods: {
      back () {
        this.$router.push({ path: '/index' })
      },
      /**
       * 增加联系人
       */
      addContact () {
        let telphoneList = []
        let telphoneListString
        let socialList = []
        let socialListString
        let mailString
        if (this.poInfo.phone !== null && this.poInfo.phone !== '') {
          let phoneStr = {type: 8, telephone: this.poInfo.phone}
          telphoneList.push(phoneStr)
        }
        if (this.poInfo.telephone !== null && this.poInfo.telephone !== '') {
          let telephoneStr = {type: 2, telephone: this.poInfo.telephone}
          telphoneList.push(telephoneStr)
        }
        if (this.poInfo.fax !== null && this.poInfo.fax !== '') {
          let faxStr = {type: 7, telephone: this.poInfo.fax}
          telphoneList.push(faxStr)
        }
        if (telphoneList.length > 0) {
          telphoneListString = JSON.stringify(telphoneList)
        }
        if (this.poInfo.email !== null && this.poInfo.email !== '') {
          let emailStr = {type: 0, mail: this.poInfo.email}
          mailString = JSON.stringify([emailStr])
        }
        if (this.facebookHomepage !== null && this.facebookHomepage !== '') {
          let fbStr = {platform: 0, url: this.facebookHomepage}
          socialList.push(fbStr)
        }
        if (this.twitterHomepage !== null && this.twitterHomepage !== '') {
          let twStr = {platform: 1, url: this.twitterHomepage}
          socialList.push(twStr)
        }
        if (this.linkedInHomepage !== null && this.linkedInHomepage !== '') {
          let lnStr = {platform: 2, url: this.linkedInHomepage}
          socialList.push(lnStr)
        }
        if (socialList.length > 0) {
          socialListString = JSON.stringify(socialList)
        }
        let paramsObj = {
          purchaserId: this.poInfo.purchaserId,
          firstName: this.poInfo.name,
          lastName: '',
          department: this.poInfo.department,
          companyName: this.poInfo.companyName,
          position: this.poInfo.position,
          telephones: telphoneListString,
          mails: mailString,
          sociaes: socialListString,
          createSource: 'ppc_create'
        }
        exploreAPI.addPpc(paramsObj).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success('添加成功')
            this.personId = res.data.data.personId
            this.poInfo.hasAddContact = 1
          } else {
            if (res.data.message !== null) {
              this.$message.error(res.data.message)
            }
          }
        })
      },
      /**
       * 查看联系人
       * @return {[type]} [description]
       */
      viewContact (contactId) {
        this.$router.push({
          path: '/contactDetail',
          query: {
            contactId: this.personId || contactId,
            contactType: 0
          }
        })
      }
//      loadMore() {
//        this.page++;
//        var postData = {
//          contactsId: this.$route.query.contactId,
//          contactsType: this.contactsType,
//          page: this.page
//        }
//        this.isLoad = true
//        exploreAPI.getPpcDetail(postData)
//          .then(res => {
//            this.isLoad = false;
//            if (res && !res.code) {
//              this.intentions = res.data ? this.intentions.concat(res.data.intentions) : this.intentions;
//            }
//          })
//      }

    },
    watch: {

    },
    components: {
      'showMore': (resolve) => {
        require(['../../../components/showMore.vue'], resolve)
      }

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  /*@import "../../../style/index.less";*/
  .ppc-bg{
    .ppc-container{
      .back{
        margin: 0 auto;
        margin-top:31px;
        width: 1200px;
        color: #7C98B6;
        span{
          font-size: 13px;
          cursor: pointer;
        }
        .icon-font{
          color: #7C98B6;
          font-weight: bold;
          font-size: 18px;
          margin-right: 10px;
        }
      }
      .all-info{
        margin: 0 auto;
        width: 1200px;
        position: relative;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        .ppc-detail-top{
          height: 177px;
          background: #fff;
          text-align: left;
          margin-top: 16px;
          padding:30px 34px;
          box-sizing: border-box;
          .left{
            display: inline-block;
            background: #fff;
            border-radius: 50%;
            vertical-align: top;
            img{
              width: 115px;
              height: 115px;
              border-radius: 50%;
              background: #ddd;
              margin-right:19px;
            }
          }
          .right{
            margin-top: 5px;
            display: inline-block;
            vertical-align: top;
            width:77%;
              .ppc-name{
                font-size: 24px;
                font-weight: bold;
                color:#33475B;
                margin-bottom: 20px;
                .name{
                  display: inline-block;
                  width:85%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .f-logo,.t-logo,.in-logo{
                  margin-left: 5px;
                  display: inline-block;
                  width:26px;
                  height: 26px;
                  line-height: 26px;
                  text-align: center;
                  border-radius: 50%;
                  box-shadow: 0 0 4px 0 rgba(84,136,249,0.20);
                  background: white;
                  text-decoration: none;
                  font-size: 12px;
                  position: relative;
                  top:-3px;
                  .icon-font{
                    display: inline-block;
                    transform: scale(0.6);
                  }
                }
                .f-logo{
                  color:#577ECE;
                  .icon-font{
                    transform: scale(0.7);
                  }
                }
                .t-logo{
                  color:#48B3FE;
                }
                .in-logo{
                  color:#2991CB;
                }
              }
              .p-title{
                color:#7C98B6;
                font-size: 13px;
                /*width:60px;*/
                margin-top:17px;
                display: inline-block;
                margin-right: 14px;
                overflow: hidden;
              }
              .pad-title{
                padding-right: 26px;
              }
              .p-info{
                display: inline-block;
                font-size: 13px;
                width:220px;
                color: #33475B;
                margin-top:17px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
          }
           .left-btn{
            float: right;
            .look-person{
              display: inline-block;
              width: 110px;
              height: 34px;
              line-height: 34px;
              text-align: center;
              color: #fff;
              background: #5488F9;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 10px;
              &:hover{
                background: rgb(118, 160, 250)
              }
            }
          }
        }

      }
      .blank-msg {
        text-align: center;
        margin-top: 50px;
        color:#999999;
      }
    }

    .ppcs-wrap{
      width:1200px;
      margin: 16px auto;
      background: white;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      padding:30px;
      box-sizing: border-box;
    }
    .pcc-item {
      width: 1140px;
      border: 1px solid #CBD6E3;
      margin-top: 20px;
      font-size: 12px;
      border-radius: 4px;
      .yellow-wraper {
        background: #FFF8EB;
        margin: 20px;
        .pcc-info-item {
          padding-left: 10px;
          height: 40px;
          line-height: 40px;
          // color: #666;
          label{
            color: #7C98B6;
          }
          a, span{
            color: #150000;
          }
        }
        hr {
          margin: 0 0 0 5px;
          height: 0px;
          border: none;
          border-top: 1px #D8D8D8 solid;
        }
      }
      .white-wraper {
        .pcc-info-item {
          padding-left: 10px;
          height: 40px;
          line-height: 40px;
          // color: #666;
          label{
            color: #7C98B6;
          }
          a, span{
            color: #150000;
          }
        }
        hr {
          margin: 0 0 0 10px;
          height: 0px;
          border: none;
          border-top: 1px #D8D8D8 solid;
        }
      }
      .pcc-msg {
        margin: 20px 20px 20px 10px;
        text-indent: 10px;
        word-break: break-all;
      }
      .pcc-sub-content {
        margin: 20px;
        // border: 1px solid #CBD6E3;
        padding: 20px;
        border-radius: 3px;
        position: relative;
        background-color: #eaf0f6;
        .arr {
          width: 9px;
          height: 9px;
          position: absolute;
          display: block;
          left: 25px;
          top: -4px;
          // background:url("../../assets/img/clue/feed-arrow.png") left top no-repeat;
          z-index: 1;
          // border-top: 1px solid #CBD6E3;
          // border-left: 1px solid #CBD6E3;
          transform: rotate(50deg) skew(15deg);
          // background: white;
          background-color: #eaf0f6;
        }
      }
      .pcc-foot {
        width: 100%;
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
        color: #4F6D95;
        background: #F5F8FA;
        box-sizing: border-box;
        a{
          color: #333;

        }
        .base-color {
          color: #5488F9;
          a{
            color: #5488F9;

          }
        }
        .platform-from {
          float: right;
          margin-right: 20px;
          img{
            margin-top: -1px;
            width: 16px;
            height: 16px;
            vertical-align: middle;
          }
        }
      }
    }
    .pcc-url-item{
      .pcc-foot{
        color: #7C98B6;
        a{
          color: #7C98B6;
        }
        img, .icon-font{
          margin-right: 5px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
