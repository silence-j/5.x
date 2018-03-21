<template>
  <div class="basic-info">
    <el-collapse accordion :value="selectName">
      <el-collapse-item title="基本信息" name="baseInfo">
        <div class="loading loading-circle" v-if="basicLoading"></div>
        <div class="info-msg"
          v-for="(basic,index) in basicInfo"
          v-if="basic.descrption!='邮箱可用性状态'&&!basicLoading"
          :style="editAble===basic.orderIndex?'border-bottom:1px solid #02AAAA':''">
          <!-- :style="editAble===basic.orderIndex?'border-bottom:1px solid #02AAAA':''" -->
          <!-- <p class="title" :style="editAble===basic.orderIndex?'transform: translateY(0);':''">{{basic.descrption}}</p> -->
          <p class="title" >{{basic.descrption}}</p>
          <p class="info" @click="chooseEditor(basic.orderIndex, $event, basic.readOnly)">
            <span :title="date[index].value" class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType===3">
              <span v-if="basic.items && date[index].value == item.value" v-for="item in basic.items">
                {{item.name}}
              </span>
              <!-- <span v-if="!date[index].hasCommon">
                {{date[index].value}}
              </span> -->
            </span>
            <span class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType==1">
              {{new Date(date[index].value).getTime()|time-formater-no-hour}}
            </span>
            <span :title="date[index].value" class="ellipsis" v-if="editAble!==basic.orderIndex&&basic.attrType!==1&&basic.attrType!==3">
              {{date[index].value}}
            </span>
            <el-input
              v-show="editAble===basic.orderIndex"
              @change="changePerson(basic.attrName, $event)"
              v-if="basic.attrType==0"
              class="info-input"
              :disabled="editAble!==basic.orderIndex"
              v-model="date[index].value">
            </el-input>
            <el-date-picker
              v-show="editAble===basic.orderIndex"
              v-if="basic.attrType==1"
              @change="changePerson(basic.attrName, $event)"
              v-model="date[index].value"
              type="date"
              placeholder="选择日期"
              :disabled="editAble!==basic.orderIndex">
            </el-date-picker>
            <el-switch
              v-show="editAble===basic.orderIndex"
              v-if="basic.attrType==2"
              :disabled="editAble!==basic.orderIndex"
              @change="changePerson(basic.attrName, $event)"
              v-model="date[index].value"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
            <el-select
              @change="changePerson(basic.attrName, $event)"
              v-if="basic.attrType==3 && editAble===basic.orderIndex"
              :disabled="editAble!==basic.orderIndex"
              v-model="date[index].value" placeholder="请选择">
              <el-option
                class="choose-option"
                v-for="item in basic.items"
                :key="item"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="icon-font icon-edit" style="font-size: 16px;"  v-if="!basic.readOnly" @click="chooseEditor(basic.orderIndex, $event)"></i>
          </p>
        </div>
        <div class="btn" v-if="!basicLoading">
          <el-button type="default" class="more gray-btn" @click="editorContacts">
            查看更多
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>

  export default{
    data () {
      return {
        activeNames: '1',
        editAble: '',
        editorPerson: {},
        date: [],
        selectName: 'baseInfo'
      }
    },
    methods: {
      chooseEditor (index, $event, isReadOnly) {
        if (isReadOnly) {
          return
        }
        let p = $event.target.parentElement
        $event.stopPropagation()
        this.editAble = index
        // input focus
        setTimeout(() => {
          let inner = p.querySelector('.el-input__inner')
          if (inner && inner.parentElement.getAttribute('class').indexOf('info-input') !== -1) {
            inner.focus()
          }
        }, 320)
      },
      editorContacts () {
        this.$emit('editorContacts', 'person')
      },
      changePerson (attrName, value) {
        if (this.editAble === '') return
        if (value.length >= 100) {
          this.$message.error('最多输入100个字符！')
          return
        }
        this.editorPerson.contactId = this.contactDetail.contactId
        this.editorPerson[attrName] = value
        this.$store.commit('CONTACT_EDITOR_PERSON', {editorPerson: this.editorPerson})
      }
    },
    mounted () {
      document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.getAttribute('class') !== 'el-input__icon el-icon-caret-top' && e.target.getAttribute('class') !== 'el-input__icon el-icon-caret-top is-reverse') {
          this.editAble = ''
        }
      })
    },
    watch: {
      // date () {
      //   this.$store.getters.personBasicInfo.forEach((param, index) => {
      //     if (param.attrType === 3) {
      //       if (param.items) {
      //         param.items.forEach(item => {
      //           if (this.date[index].value === item.value) {
      //             this.date[index].hasCommon = true
      //           }
      //         })
      //       }
      //     }
      //   })
      // }
    },
    computed: {
      basicInfo () {
        this.$store.getters.personBasicInfo.forEach(param => {
          this.date.push({
            attrName: param.attrName,
            group: param.group,
            value: ''
            // hasCommon: false
          })
        })
        this.date.forEach(date => {
          date.value = this.contactDetail[date.group] ? this.contactDetail[date.group][date.attrName] : ''
        })
        return this.$store.getters.personBasicInfo
      },
      contactDetail () {
        return this.$store.getters.contactDetail
      },
      basicLoading () {
        return this.$store.getters.basicLoading
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
      &.hover{
        background-color: #f4f6f8;
      }
      &.selected{
        color: @textColor;
        background-color: @selectedColor;
      }
    }
  }
  .basic-info{
    .el-collapse{
      border: none;
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
        border: none;
        background: #fff;
        .el-collapse-item__content{
          background: #fff;
          padding: 0;
        }
      }
    }
  }
  .info-msg{
    .info-input{
      display: inline-block;
      width: 320px;
      input{
        padding-left: 0;
        border-color: #fff;
      }
      input:focus{
        box-shadow: none;
        border-color: #fff;
      }
    }
    .info-input:hover{
      input{
        border-color: #fff;
      }
    }
    .info-input.is-disabled{
      input{
        border-color: #fff;
        background: #fff;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .basic-info{
    width: 350px;
    padding: 9px 20px 30px;
    background: @white;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .title{
      transition: .4s ease-in-out;
      transform: translateY(40%);
      i{
        color: @textareaBorder;
        margin-right: 5px;
      }
      span{
        font-size: 18px;
        font-weight: bold;
      }
    }
    .info-msg{
      padding-bottom: 5px;
      border-bottom: 1px dashed #DFE3EB;
      .title{
        font-size: 12px;
        color: @detailTextColor;
        margin-top: 20px;
      }
      .info{
        height: 40px;
        line-height: 40px;
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
    .info-msg:hover{
      i{
        display: inline-block;
      }
    }
    .btn{
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }

  }
</style>
