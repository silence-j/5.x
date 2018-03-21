<template>
  <div class="allParams">
    <div class="title">所有属性</div>
    <div class="body">
      <div class="search-container">
        <span>
          <i class="icon-font icon-search" @click="filterParams"></i>
          <input @keyup.enter="filterParams" placeholder="请输入属性名称" v-model="searchText">
        </span>
        <el-checkbox v-model="checked">隐藏空属性</el-checkbox>
      </div>
      <el-collapse v-model="activeNames" class="editor-collapse">
        <el-collapse-item name="baseMessage">
          <span slot="title" class="collapse-title">基本信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
          v-if="params.group==='base'&&(contactDetail.base[params.attrName]||!checked)"
          :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                v-if="params.attrType==0"
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.base[params.attrName]"
                v-model="date[index].value">
              </el-input>
              <el-date-picker
                v-if="params.attrType==1"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                type="date"
                value-format="yyyy-MM-DD"
                placeholder="选择日期">
              </el-date-picker>
              <el-switch
                v-if="params.attrType==2"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
              <el-select
                @change="changePerson(params.attrName, $event, index)"
                v-if="params.attrType==3"
                :disabled="Boolean(params.readOnly)"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  v-for="item in params.items"
                  :label="item.name"
                  key="items"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit"  v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="联系信息" name="contactMessage">
          <span slot="title" class="collapse-title">联系信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
          v-if="params.group==='contact'&&(contactDetail.contact[params.attrName]||!checked)"
          :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                v-if="params.attrType==0"
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.contact[params.attrName]"
                v-model="date[index].value">
              </el-input>
              <el-date-picker
                v-if="params.attrType==1"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <el-switch
                v-if="params.attrType==2"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
              <el-select
                @change="changePerson(params.attrName, $event, index)"
                v-if="params.attrType==3"
                :disabled="Boolean(params.readOnly)"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  v-for="item in params.items"
                  key="items"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit" v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="阶段信息" name="stageMessage">
          <span slot="title" class="collapse-title">阶段信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
          v-if="params.group==='stage'&&(contactDetail.stage[params.attrName]||!checked)&&date[index].visible"
          :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                v-if="params.attrType==0"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.stage[params.attrName] | time-formater-no-hour"
                v-model="date[index].value">
              </el-input>
               <!--1 readOnly
                :disabled="Boolean(params.readOnly)"-->
              <el-date-picker
                v-if="params.attrType==1&&!params.readOnly"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <span
                v-if="params.attrType==1&&params.readOnly&&date[index].value">
                {{date[index].value | time-formater-no-hour}}
              </span>
              <el-switch
                v-if="params.attrType==2"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
              <el-select
                @change="changePerson(params.attrName, $event, index)"
                v-if="params.attrType==3"
                :disabled="Boolean(params.readOnly)"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  v-for="item in params.items"
                  key="items"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit" v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="社交信息" name="socialMessage">
          <span slot="title" class="collapse-title">社交信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
         v-if="params.group==='social'&&((contactDetail.social&&contactDetail.social[params.attrName])||!checked)"
         :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                v-if="params.attrType==0"
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.social?contactDetail.social[params.attrName]:''"
                v-model="date[index].value">
              </el-input>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit" v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="邮件信息" v-if="editor!=='company'" name="mailMessage">
          <span slot="title" class="collapse-title">邮件信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
         v-if="params.group==='mail'&&((contactDetail.mail&&contactDetail.mail[params.attrName])||!checked)&&params.descrption!='邮箱可用性状态'"
         :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                v-if="params.attrType==0"
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.mail[params.attrName]"
                v-model="date[index].value">
              </el-input>
              <el-date-picker
                v-if="params.attrType==1&&!params.readOnly"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <span
                v-if="params.attrType==1&&params.readOnly">
                {{date[index].value | time-formater-no-hour}}
              </span>
              <!--<el-switch
                v-if="params.attrType==2"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>-->
              <el-select
                @change="changePerson(params.attrName, $event, index)"
                v-if="params.attrType==3"
                :disabled="Boolean(params.readOnly)"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  v-for="item in params.items"
                  key="items"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit" v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="系统信息" name="systemMessage">
          <span slot="title" class="collapse-title">系统信息</span>
          <div class="param"
          v-for="(params,index) in allParams"
          v-if="params.group==='system'&&((contactDetail.system&&contactDetail.system[params.attrName])||!checked)"
          :style="editAble===params.orderIndex?'border-bottom:1px solid #02AAAA':''">
            <p class="param-info">{{params.descrption}}</p>
            <div class="param-value">
              <i class="icon-font icon-right" v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1"></i>
              <span class="hidden-span" v-else></span>
              <el-input
                v-if="params.attrType==0"
                @change="changePerson(params.attrName, $event, index)"
                @focus="editAble=params.orderIndex"
                @blur="editAble=''"
                class="info-input"
                :disabled="Boolean(params.readOnly)"
                :value="contactDetail.system[params.attrName]"
                v-model="date[index].value">
              </el-input>
              <el-date-picker
                v-if="params.attrType==1&&!params.readOnly"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <span
                v-if="params.attrType==1&&params.readOnly&&date[index].value">
                {{date[index].value | time-formater-no-hour}}
              </span>
              <el-switch
                v-if="params.attrType==2"
                :disabled="Boolean(params.readOnly)"
                @change="changePerson(params.attrName, $event, index)"
                v-model="date[index].value"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
              <el-select
                @change="changePerson(params.attrName, $event, index)"
                v-if="params.attrType==3"
                :disabled="Boolean(params.readOnly)"
                v-model="date[index].value" placeholder="请选择">
                <el-option
                  v-for="item in params.items"
                  key="items"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="param-operate">
              <i class="icon-font icon-edit" v-if="!params.readOnly" @click="editAble=params.orderIndex"></i>
              <el-button @click="queryShowDelete(params)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))!==-1&&len!=1">从详情中移除</el-button>
              <el-button @click="queryShowAdd(params, index)"
                         v-if="JSON.stringify(basicInfo).indexOf(JSON.stringify(params.descrption))===-1">添加到详情</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  import contactInfoApi from '../../../../../../src/api/contactInfoApi'
  export default{
    props: {
      editor: ''
    },
    data () {
      return {
        searchText: '',
        editAble: '',
        checked: true,
        activeNames: ['baseMessage'],
        editorPerson: {},
        editorCompany: {},
        date: [],
        len: ''
      }
    },
    computed: {
      isAdded () {
        return this.$store.getters.isAdded
      },
      basicInfo () {
        let basicInfo = this.editor === 'company'
          ? this.$store.getters.companyBasicInfo
          : this.$store.getters.personBasicInfo
        this.len = basicInfo.length
        return basicInfo
      },
      contactDetail () {
        let detail = this.editor === 'company'
          ? this.$store.getters.companyDetail
          : this.$store.getters.contactDetail
        this.date.forEach(date => {
          date.value = detail[date.group] ? detail[date.group][date.attrName] : ''
        })
        return detail
      },
      allParams () {
        this.$store.getters.allParams.forEach(param => {
          let visible = true
          if (param.group === 'stage') {
            let arr = 'failedTime, wonTime, demoTime, followingTime, intentionTime, potentialTime'
            if (arr.indexOf(param.attrName) !== -1) {
              visible = false
            }
          }
          this.date.push({
            attrName: param.attrName,
            group: param.group,
            value: '',
            visible: visible
          })
        })
        return this.$store.getters.allParams
      }
    },
    watch: {
      checked () {
        this.activeNames = []
        this.date.forEach(param => {
          let name = param.group + 'Message'
          if (this.activeNames.indexOf(name) === -1) {
            if (this.checked) {
              if (param.value) {
                this.activeNames.push(name)
              }
            } else {
              this.activeNames.push(name)
            }
          }
        })
      }
    },
    mounted () {
      let detailType = this.editor === 'company' ? 1 : 0
      let contactId = this.$route.query.contactId
      this.$store.commit('CONTACT_DETAIL_PARAMS', {contactId, detailType})
      this.$store.dispatch('getAllParams')
      document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.getAttribute('class') !== 'el-input__icon el-icon-caret-top' && e.target.getAttribute('class') !== 'icon-font icon-edit') {
          this.editAble = ''
        }
      })
    },
    methods: {
      dateChange () {
        this.date.forEach(param => {
          let name = param.group + 'Message'
          if (param.group === 'mail' && param.attrName === 'mailEnable') {
            if (param.value === 0) {
              param.value = false
            } else {
              param.value = true
            }
          }
          if (this.activeNames.indexOf(name) === -1) {
            if (this.checked) {
              if (param.value) {
                this.activeNames.push(name)
              }
            } else {
              this.activeNames.push(name)
            }
          }
        })
      },
      filterParams () {
        this.$store.commit('CONTACT_FILTER_TEXT', {filterText: this.searchText})
        this.$store.dispatch('getAllParams')
      },
      queryShowAdd (params, index) {
        contactInfoApi.queryShowAdd(params).then(res => {
          if (!res.data.code) {
            this.$store.dispatch('getBasicInfo')
            this.$store.commit('CONTACT_IS_ADDED', {type: true})
            this.$message.success('添加显示属性成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      queryShowDelete (params) {
        contactInfoApi.deleteParams(params).then(res => {
          if (!res.data.code) {
            this.$store.dispatch('getBasicInfo')
            this.$store.commit('CONTACT_IS_ADDED', {type: !this.isAdded})
            this.len--
            this.$message.success('删除显示属性成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      changePerson (attrName, value, idx) {
        // this.date[idx].value = value
        if (attrName === 'birthday' && value.length) {
          this.date[17].value = Date.parse(new Date(value))
          this.dateChange()
        }
        if (this.editor === 'company') {
          this.editorCompany.companyId = this.contactDetail.base.companyId
          this.editorCompany.name = this.contactDetail.base.name
          // if (attrName === 'companyCreateTime' && value.length) {
          //   this.date[idx].value = value
          // }
          // this.date.forEach((item, index) => {
          //   this.editorCompany[item.attrName] = item.value
          // })
          this.editorCompany[attrName] = value
          this.$store.commit('CONTACT_EDITOR_COMPANY', {editorCompany: this.editorCompany})
        } else {
          // if (attrName === 'position') {
          //   console.log('person2', attrName, value)
          // }
          this.editorPerson.contactId = this.contactDetail.contactId
          this.editorPerson[attrName] = value
          // this.date.forEach((item, index) => {
          //   console.log(2, item.attrName)
          //   this.editorPerson[item.attrName] = item.value
          //   // if (item.attrName === 'position') {
          //   //   console.log('PPP', item.attrName, item.value)
          //   // }
          // })
          this.$store.commit('CONTACT_EDITOR_PERSON', {editorPerson: this.editorPerson})
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../../assets/style/variable";
  .allParams {
    .el-checkbox{
      vertical-align: bottom;
    }
    .editor-collapse{
      margin-top: 30px;
      border: none;
      .el-collapse-item{
        .el-collapse-item__header{
          border: none;
          i{
            vertical-align: text-top;
            color: #00B8CC;
          }
          .collapse-title{
            font-size: 18px;
          }
        }
        .el-collapse-item__wrap{
          background-color: @white;
          border: none;
          .param:hover{
            .param-operate{
              display: block;
            }
          }
          .param{
            position: relative;
            padding: 10px;
            border-bottom: 1px dashed #DFE3EB;
            p{
              color: #7C98B6;
              padding-left: 15px;
            }
            .param-value{
              .hidden-span{
                width: 10px;
                display: inline-block;
              }
              i{
                color: #00B8CC;
                margin-left: -10px;
                margin-right: 10px;
              }
            }
            .param-operate{
              display: none;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0;
              i{
                cursor: pointer;
                color: #00B8CC;
                font-size: 16px;
              }
              button{
                margin-left: 20px;
                padding: 7px 15px;
              }
            }
          }
        }
      }
    }
  }
  .info-input{
    display: inline-block;
    width: 520px;
    .el-input__inner{
      padding-left: 0;
      border-color: #fff;
    }
    .el-input__inner:focus{
      box-shadow: none;
      border-color: #fff;
    }
  }
  .info-input:hover{
    .el-input__inner{
      border-color: #fff;
    }
  }
  .info-input.is-disabled{
    .el-input__inner{
      border-color: #fff;
      background: #fff;
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../../assets/style/variable";
  // @import "../../../../../assets/style/base";
  .allParams{
    width: 790px;
    background: @white;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .title{
      padding: 15px 24px;
      font-size: 20px;
      background: #F5F8FA;
    }
    .body{
      padding: 30px 20px;
      .search-container{
        span{
          width: 610px;
          display: inline-block;
          border-bottom: 1px solid #DFE3EB;
          padding-bottom: 10px;
          margin-right: 20px;
          color: #7C98B6;
          i{
            font-size: 20px;
          }
          input{
            height: 30px;
            width: 580px;
            border: none!important;
            outline: none;
          }
        }
      }
    }
  }
</style>
