<template>
  <div class="companyInfo">
    <el-collapse accordion :value="selectName">
      <el-collapse-item name="companyInfo">
        <template slot="title">
          <span>{{detailType==0?'所属公司信息':'公司信息'}}</span>
        </template>
        <div class="loading loading-circle" v-if="cmpBcLoading"></div>
        <div v-else>
          <div class="op" v-if="detailType==0&&showDel">
            <el-dropdown trigger="click" class="operate" @command="deleteCompany" v-if="compId">
              <span class="el-dropdown-link operate-link">
                操作
              </span>
              <el-dropdown-menu slot="dropdown" class="dropdown-menu">
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="company-info-title">
            <span v-if="detailType == 0">
              <div class="company-desc" v-if="compId">
                <img class="avatar" v-if="companyDetail.base.avatar!==''&&companyDetail.base.avatar" :src="companyDetail.base.avatar" onerror="javascript:this.src='/static/img/default_comp.png'">
                <img class="avatar" v-if="companyDetail.base.avatar===''||!companyDetail.base.avatar" src="../../../../assets/img/default_comp.png">
                <span class="desc-detail">
                  <a href="javascript:;" @click="linkToCompany(compId)" class="name" :title="companyDetail.base.name">{{companyDetail.base.name}}</a>
                  <a href="javascript:;" class="desc" target="_blank" :href="fullWebUrl" :title="companyDetail.base.url">{{companyDetail.base.url}}</a>
                </span>
              </div>
            </span>
          </div>
          <div class="info-msg"
            :style="editAble===basic.orderIndex?'border-bottom:1px solid #02AAAA':''"
            v-for="(basic,index) in basicInfo"
            :key="basicInfo"
            v-if="compId&&((detailType == 0&&showDel)||detailType != 0)">
            <!-- <p class="title" :style="editAble===basic.orderIndex?'transform: translateY(0);':''">{{basic.descrption}}</p> -->
            <p class="title">{{basic.descrption}}</p>
            <p class="info" @click="chooseEditor(basic.orderIndex, $event, basic.readOnly)">
              <span :title="date[index].value" class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType===3">
                <span v-for="item in basic.items" v-if="date[index].value==item.value">
                  {{item.name}}
                </span>
                <!-- <span v-if="!date[index].hasCommon">
                  {{date[index].value}}
                </span> -->

              </span>
              <span class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType==1">
                {{date[index].value|time-formater-no-hour}}
              </span>
              <span :title="date[index].value" class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType!==1&&basic.attrType!==3">
                {{date[index].value}}
              </span>
              <el-input class="info-input"
                        v-show="editAble===basic.orderIndex"
                        v-if="basic.attrType==0"
                        @change="changeCompany(basic.attrName, $event)"
                        :disabled="editAble!==basic.orderIndex"
                        v-model="date[index].value"></el-input>
              <el-date-picker
                v-show="editAble===basic.orderIndex"
                v-if="basic.attrType==1"
                @change="changeCompany(basic.attrName, $event)"
                v-model="date[index].value"
                type="date"
                placeholder="选择日期"
                :disabled="editAble!==basic.orderIndex">
              </el-date-picker>
              <el-switch
                v-show="editAble===basic.orderIndex"
                v-if="basic.attrType==2"
                :disabled="editAble!==basic.orderIndex"
                @change="changeCompany(basic.attrName, $event)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
              <el-select
                @change="changeCompany(basic.attrName, $event)"
                v-if="basic.attrType==3&&editAble===basic.orderIndex"
                :disabled="editAble!==basic.orderIndex"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  class="choose-option"
                  v-for="item in basic.items"
                  :label="item.name"
                  key="items"
                  :value="item.value">
                </el-option>
              </el-select>
              <i class="icon-font icon-edit" style="font-size: 16px;" v-if="!basic.readOnly" @click="chooseEditor(basic.orderIndex, $event)"></i>
            </p>
          </div>
          <div class="none-company"  v-if="!compId">
            <p>{{desc.name}}还没有所属公司</p>
            <el-button type="default" @click="addCompanyDialog=true" class="gray-btn">添加公司</el-button>
          </div>
          <div class="btn" v-if="compId&&((detailType == 0&&showDel)||detailType != 0)">
            <el-button type="default" class="more gray-btn" @click="editorContacts">
              查看全部
            </el-button>
          </div>
        </div>

      </el-collapse-item>
    </el-collapse>
    <el-dialog title="添加公司" v-model="addCompanyDialog" class="addCompanyDialog">
        <span @keyup.enter="searchCompany">
          <el-input
            icon="search"
            v-model.trim="search"
            :on-icon-click="searchCompany">
          </el-input>
        </span>
      <div class="search-result" v-show="showSearch">
        <p>结果：</p>
        <el-radio-group v-model="select" class="company-radio" @change="addCompany">
          <el-radio :label="company.companyId" v-for="company in searchList" key="searchList">
            <img class="company-img" :src="company.avatar" onerror="javascript:this.src='/static/img/default_comp.png'">
            <span class="ellipsis name" :title="company.name">{{company.name}}</span>
          </el-radio>
        </el-radio-group>
        <div v-if="!searchList.length">无匹配公司</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import contactInfoApi from '@/api/contactInfoApi'
  import Util from '@/common/Util.js'
  export default{
    data () {
      return {
        addCompanyDialog: false,
        search: '',
        select: '',
        showSearch: false,
        editAble: '',
        editorCompany: {},
        date: [],
        selectName: 'companyInfo',
        showDel: true, // 子账号是否有权看公司
        compId: ''
      }
    },
    mounted () {
      document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.getAttribute('class') !== 'el-input__icon el-icon-caret-top' && e.target.getAttribute('class') !== 'el-input__icon el-icon-caret-top is-reverse') {
          this.editAble = ''
        }
      })
    },
    methods: {
      canDelete (id) {
        let isdelete = Util.hasRightByCode('DBB')
        if (id !== '' && id !== null && isdelete) {
          return true
        } else {
          return false
        }
      },
      chooseEditor (index, $event, isReadOnly) {
        if (isReadOnly) {
          return
        }
        let p = $event.target.parentElement
        $event.stopPropagation()
        this.editAble = index
        // let tagipt = 'comptext' + index
        // let _this = this
        // setTimeout(() => {
        //   _this.$nextTick(_ => {
        //     console.log(_this.$refs[tagipt][0])
        //     _this.$refs[tagipt][0].$refs.input.focus()
        //   })
        // }, 320)
        // input focus
        setTimeout(() => {
          let inner = p.querySelector('.el-input__inner')
          if (inner && inner.parentElement.getAttribute('class').indexOf('info-input') !== -1) {
            inner.focus()
          }
        }, 320)
      },
      linkToCompany (id) {
        if (!this.showDel) {
          return
        }
        this.$router.push({path: '/contactDetail', query: {contactId: id, contactType: 1}})
      },
      searchCompany () {
        this.showSearch = true
        this.$store.dispatch('getContactCompanyList', {keyword: this.search})
      },
      editorContacts () {
        this.$emit('editorContacts', 'company')
      },
      changeCompany (attrName, value) {
        if (this.editAble === '') return
        if (value.length >= 100) {
          this.$message.error('最多输入100个字符！')
          return
        }
        this.editorCompany.companyId = this.compId
        this.editorCompany.name = this.companyDetail.base.name
        this.date.forEach((item, index) => {
          // if (item.value !== '' && item.value !== null) {
          let attrName = item.attrName
          this.editorCompany[attrName] = item.value
          // }
        })
        this.$store.commit('CONTACT_EDITOR_COMPANY', {editorCompany: this.editorCompany})
      },
      addCompany () {
        contactInfoApi.addPersonCompany({
          contactIds: this.$route.query.contactId,
          companyId: this.select
        }).then(res => {
          if (!res.data.code) {
            this.addCompanyDialog = false
            this.$message.success('添加公司成功')
            location.reload()
          } else {
            this.$message.error('添加公司失败')
          }
        })
      },
      deleteCompany () {
        contactInfoApi.addPersonCompany({contactIds: this.$route.query.contactId}).then(res => {
          if (!res.data.code) {
            this.$store.commit('CONTACT_COMPANY_DETAIL', {detail: {
              base: {},
              social: [],
              contact: [],
              stage: []
            }})
            this.$message.success('删除公司成功！')
          } else {
            this.$message.error('删除公司失败！')
          }
        })
      }
    },
    watch: {
      // date () {
      //   this.$store.getters.companyBasicInfo.forEach((param, index) => {
      //     if (param.attrType === 3) {
      //       param.items.forEach(item => {
      //         if (this.date[index].value === item.value) {
      //           this.date[index].hasCommon = true
      //         }
      //       })
      //     }
      //   })
      // }
    },
    computed: {
      fullWebUrl: function () {
        if (this.companyDetail.base.url) {
          return Util.checkUrl(this.companyDetail.base.url)
        } else {
          return ''
        }
      },
      desc () {
        return this.$store.getters.desc
      },
      detailType () {
        return this.$store.getters.detailType
      },
      basicInfo () {
        this.date = []
        this.$store.getters.companyBasicInfo.forEach(param => {
          this.date.push({
            attrName: param.attrName,
            group: param.group,
            value: ''
            // hasCommon: false
          })
        })
        this.date.forEach(date => {
          date.value = this.companyDetail[date.group] ? this.companyDetail[date.group][date.attrName] : ''
        })
        return this.$store.getters.companyBasicInfo
      },
      companyDetail () {
        let comp = this.$store.getters.companyDetail
        if (localStorage.isMainAccount === 'false') {
          // 登录人不属于该公司 无删除权限
          if (!this.$store.getters.contactDetail.base.companyBelongToCurrentUser) {
            this.showDel = false
          } else {
            this.showDel = true
          }
        }
        this.compId = comp.base.companyId
        return comp
      },
      searchList () {
        return this.$store.getters.contactCompanyList
      },
      cmpBcLoading () {
        return this.$store.getters.cmpBcLoading
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/variable";
  .el-select-dropdown{
    border-radius: 4px;
    .choose-option{
      padding-left: 10px;
      line-height: 36px;
      &:hover{
        background-color: #f4f6f8;
      }
    }
  }
  .addCompanyDialog{
    .el-dialog {
      width: 436px;
    }
    .el-dialog__body{
      height: 210px;
      padding: 30px 40px;
    }
    .el-dialog__footer{
      text-align: left;
      padding: 20px 27px 30px 27px;
      button{
        padding: 9px 28px;
      }
    }
  }
  .el-dropdown-menu.dropdown-menu{
    margin: 5px 0;
    padding: 6px 0;
    border-radius: 4px;
    .el-dropdown-menu__item{
      padding: 0 10px;
      &:not(.is-disabled):hover{
        background-color: #F4F6F8;;
      }
    }
  }
  .companyInfo{
    .op{
      position: absolute;
      top: 8px;
      right: 0;
      .operate-link{
        cursor: pointer;
        font-size: 13px;
        color: #5488F9;
        &:hover{
          color: @activeBlue;
        }
      }
    }
    .el-collapse{
      border: none;
      position: relative;
      .el-collapse-item__header{
        border: none;
        font-size: 18px;
        font-weight: bold;
        padding: 0;
        i{
          font-size: 16px;
          color: #02AAAA;
        }
      }
      .el-collapse-item__wrap{
        margin-top:-14px;
        border: none;
        background: #fff;
        .el-collapse-item__content{
          background: #fff;
          padding: 0;
        }
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .search-result{
    margin-top: 20px;
    height: 175px;
    overflow-y: auto;
    .name {
      display: inline-block;
      width: 200px;
    }
    p{
      margin-bottom: 10px;
      font-weight: bold;
    }
    .el-radio + .el-radio{
      margin-left: 0;
    }
    label{
      display: block;
      margin-left: 0;
      margin-bottom: 15px;
      span{
        margin-right: 5px;
      }
    }
    .company-img{
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
  .companyInfo{
    width: 350px;
    min-height: 118px;
    padding: 9px 20px 30px;
    background: @white;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .loading{
      margin: 30px auto;
    }
    .company-info-title{
      margin-bottom: 13px;
      i{
        color: @textareaBorder;
        margin-right: 5px;
      }
      span{
        .company-title{
          font-size: 18px;
          font-weight: bold;
        }
        .operate{
          cursor: pointer;
          float: right;
          color: @activeBlue;
          font-size: 13px;
          font-weight: normal;
        }
        .company-desc{
          margin-top: 20px;
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .desc-detail{
            width: 200px;
            display: inline-block;
            font-size: 13px;
            margin-left: 10px;
            .name{
              width: 200px;
              line-height: 18px;
              display: inline-block;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
              font-weight: bold;
              color: @activeBlue;
            }
            .desc{
              width: 200px;
              line-height: 18px;
              display: inline-block;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
              margin-top: 5px;
              color: #5488F9;
            }
          }
        }
      }
    }
    .info-msg{
      padding-bottom: 2px;
      border-bottom: 1px dashed #DFE3EB;
      .title{
        margin-bottom: 2px;
        // margin-top: 20px;
        transform: translateY(40%);
        transition: .4s ease-in-out;
        font-size: 12px;
        color: @detailTextColor;
      }
      .info:hover{
        i{
          display: inline-block;
        }
      }
      .info{
        margin-top: 2px;
        height: 38px;
        line-height: 38px;
        outline: none;
        span{
          display: inline-block;
          width: calc(~'100% -  40px');
        }
        i{
          color: @textareaBorder;
          display: none;
          cursor: pointer;
          float: right;
        }
      }
    }
    .none-company{
      text-align: center;
      margin-top: 40px;
      margin-bottom: 40px;
      p{
        font-size: 14px;
        margin-bottom: 15px;
        color: #4F6D95;
      }
    }
    .btn{
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }
  }
</style>
