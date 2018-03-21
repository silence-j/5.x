<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content" >
      <div class="u-right">
        <div class="keyset-box">
          <h3 class="big-title">设置系统关键词
            <el-tooltip class="item" effect="dark" content="生效时间24小时" placement="top">
              <span class="icon-font">&#xe65b;</span>
            </el-tooltip>
          </h3>
          <p  class="small-title"> · 系统关键词将用于询盘池推荐；</p>
          <p  class="small-title"> · 请设置与您产品相关的关键词；</p>
          <p  class="small-title"> · 最多可设置20个关键词；</p>
          <div class="addkey-box">
            <el-input
              placeholder=""
              icon="del"
              :class="keyCancel"
              v-model="inputValue"
              @keyup.enter.native="updateKeywordFunc"
              :on-icon-click="cancelKey"
              >
            </el-input>
            <el-button type="primary" @click="updateKeywordFunc()" :disabled="canclick">确定</el-button>
          </div>
          <!-- <div class="bottom-setting" > -->
            <div class="key-box" v-if="!load">
              <el-tag
                v-for="(tag, index) in dynamicTags"
                :key="tag"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
                v-if="dynamicTags.length>0">
                <p :title="tag">{{tag}}</p>
              </el-tag>
              <!--<p class="no-data" v-if="dynamicTags.length==0">暂无关键词</p>-->
            </div>
            <div v-if="load" class="loading loading-circle"></div>
        </div>
        <div class="intell-box" v-if="serverLevel=='1'">
          <h3 class="big-title">智能作家关键字设置</h3>
          <p class="small-title">系统将会根据你所填写的每个关键字自动生成原创文章。你可以在创意中心的智能作家中查看已经生成的文章。更改关键字后文章将会在不超过24小时进行更新。
          </p>
          <div class="intellkey-box" v-if="!load2">
            <div class="key-msg" v-for="(data,index) in intellkeys" :key="index">
              <p class="title" :style="data.modify?'transform: translateY(0);':''">关键字{{index+1}}</p>
              <div class="key-wrap" @click="showEdit(index, $event)">
                <p class="key-name" v-show="!data.modify">{{data.name}}</p>
                <el-input class="key-input"
                          :maxlength=50
                          :ref="'intelltext'+index"
                          v-show="data.modify"
                          v-model="intellkeys[index].name"
                          @blur="blurEdit(index)"
                          @keyup.enter.native="saveIntellKey(index)"></el-input>
                <div class="key-opt">
                  <a href="javascript:;" class="icon-edit" v-if="!data.modify" @click="showEdit(index, $event)"></a>
                  <a href="javascript:;" class="icon-sendrate" v-else @click="saveIntellKey(index)"></a>
                  <a href="javascript:;" class="icon-remove2" v-if="data.modify" @click="cancelEdit(index)"></a>
                </div>
              </div>
            </div>
          </div>
          <div v-if="load2" class="loading loading-circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import systemSettingAPI from '@/api/systemSettingAPI'
import headLeft from './systemIndex'
export default {
  name: 'setKeyWord',
  data () {
    return {
      // popIsshow: false,
      dynamicTags: [],
      // inputVisible: false,
      inputValue: '',
      // temporaryValue: [],      // 关键字展示
      load: true,
      canclick: false, // 不能点 true
      intellkeys: [],
      load2: true,
      keyCancel: '', // 是否显示删除
      canSave: true,  // 保存按钮是否有效
      serverLevel: window.localStorage.serverLevel
      // intellModify: false
      // oldintellkeys: [] // 初始关键字
    }
  },
  components: {
    headLeft
  },
  watch: {
    inputValue () {
      if (this.inputValue) {
        this.keyCancel = 'cancel-show'
      } else {
        this.keyCancel = ''
      }
    }
  },
  methods: {
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.saveTags(true)
    },
    // showInput () {
    //   // this.inputVisible = true
    //   this.$nextTick(_ => {
    //     this.$refs.saveTagInput.$refs.input.focus()
    //   })
    // },
    // 关键字更新
    updateKeywordFunc () {
      let inputValue = this.inputValue
      let size = this.dynamicTags.length
      if (inputValue && inputValue.trim().length === 0) {
        this.$message.error('设置关键字不能全为空格')
        return
      }
      if (size > 19) {
        this.$message.error('设置关键字数量不能超过20')
        return
      }
      if (inputValue.indexOf(';') !== -1) {
        this.$message.error('关键字不能有;')
        return
      }
      if (inputValue.length > 30) {
        this.$message.error('关键字过长')
        return
      }
      if (this.dynamicTags.indexOf(inputValue) > -1) {
        this.$message.error('该关键词已存在，无需重复添加！')
        setTimeout(() => {
          location.reload()
        }, 1000)
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue) // 设置后
        this.inputValue = ''
        this.canclick = true
        this.saveTags()
      } else {
        this.$message.error('关键字不能为空')
        return
      }
    },
    saveTags (isDel) {
      let keywords = this.dynamicTags.join(';')
      // if (keywords.length === 0) {
      //   return
      // }
      if (keywords.length < 600) {
        let param = {keywords: keywords}
        systemSettingAPI.updateKeyword(param).then(res => {
          if (this.dynamicTags.length < 20) {
            this.canclick = false
          }
          if (res.data.code === 0) {
            if (isDel) {
              this.$message.success('关键字删除成功')
            } else {
              this.$message.success('关键字保存成功')
            }
          } else {
            this.canclick = false
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.canclick = false
        this.$message.error('关键字长度过长或超出限制')
      }
    },
    // 单个关键字
    handleInputConfirm () {
      let inputValue = this.inputValue
      let size = this.dynamicTags.length
      if (size > 19) {
        this.$message.error('设置关键字数量不能超过20')
        return
      }
      if (inputValue) {
        this.dynamicTags.push(inputValue) // 设置后
      }
      this.inputValue = ''
    },
    // 显示取消
    showCancel () {
      this.keyCancel = 'cancel-show'
    },
    // 取消关键字输入
    cancelKey () {
      this.inputValue = ''
    },
    // blog关键字设置
    saveIntellKey (index) {
      if (!this.canSave) {
        return
      }
      let k = this.intellkeys
      if (k[index].name && k[index].name.indexOf(';') !== -1) {
        this.$message.error('关键字不能有;')
        return
      }
      let arr = []
      if (k[index].name && k[index].name.replace(/(^\s+)|(\s+$)/g, '').length === 0) {
        k[index].name = null
      } else {
        for (let i = 0, len = k.length; i < len; i++) {
          if (k[i].name) {
            if (k[i].name && arr.indexOf(k[i].name) === -1) {
              arr.push(k[i].name)
            } else {
              this.$message.error('关键字不能重复')
              return
            }
          }
        }
      }
      this.canSave = false
      // this.oldintellkeys[index] = this.intellkeys[index].name
      systemSettingAPI.saveIntellKey({keywords: arr.join(';')}).then(res => {
        this.canSave = true
        if (res.data.code === 0) {
          // this.intellModify = false
          k[index].modify = false
          this.oldintellkeys = []
          for (let i = 0; i < 3; i++) {
            let n = arr[i] ? arr[i] : ''
            this.oldintellkeys.push(n)
          }
          this.$message.success('关键字保存成功')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 取消编辑
    cancelEdit (index) {
      Object.assign(this.intellkeys[index], {name: this.oldintellkeys[index], modify: false})
    },
    // 点击外部完成编辑
    blurEdit (index) {
      if (this.intellkeys[index].name.indexOf(';') !== -1) {
        this.$message.error('关键字不能有;')
        return
      }
      this.saveIntellKey(index)
    },
    // 显示编辑
    showEdit (index, event) {
      for (let j = 0; j < 3; j++) {
        if (this.intellkeys[j].name && this.intellkeys[j].name.indexOf(';') !== -1) {
          return
        } else {
          if (event.target.getAttribute('class').indexOf('icon-remove2') !== -1) {
            return
          }
          for (let i = 0; i < 3; i++) {
            let d = this.intellkeys[i]
            if (i === index) {
              d.modify = true
            } else {
              d.modify = false
            }
          }
          let tagipt = 'intelltext' + index
          this.$nextTick(_ => {
            this.$refs[tagipt][0].$refs.input.focus()
          })
        }
      }
    }
  },
  created () {
    // 智能关键字获取
    systemSettingAPI.getKeywords().then(res => {
      if (res.data.code === 0) {
        this.load = false
        if (res.data.data !== null) {
          let keywords = res.data.data.keywords
          if (keywords) {
            this.dynamicTags = keywords.split(';')
            if (this.dynamicTags.length > 19) {
              this.canclick = true
            }
          }
        }
      } else {
        this.$message.error(res.data.message)
      }
    })
    // blog关键字获取
    systemSettingAPI.getIntellKey().then(res => {
      if (!res.data.code) {
        this.load2 = false
        if (res.data.data) {
          let keyw = res.data.data.blogKeywords
          this.intellkeys = []
          this.oldintellkeys = []
          if (keyw) {
            let arr = keyw.split(';')
            for (let i = 0; i < 3; i++) {
              let n = arr[i] ? arr[i] : ''
              this.intellkeys.push({name: n, modify: false})
              this.oldintellkeys.push(n)
            }
          } else {
            for (let i = 0; i < 3; i++) {
              this.intellkeys.push({name: '', modify: false})
              this.oldintellkeys = ['', '', '']
            }
          }
        } else {
          for (let i = 0; i < 3; i++) {
            this.intellkeys.push({name: '', modify: false})
            this.oldintellkeys = ['', '', '']
          }
        }
      }
    })
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  // @import '../../assets/style/base.less';
  .prompt{
    font-size: 12px;
    color: #FFB822;
    line-height: 16px;
    span{
      margin-left:5px;
    }
  }
  .keyword-prompt{
    margin-top:4px;
  }
  .el-tag{
    background-color: rgb(220,231,253);
    color: #4F6D95;
    p{
      display: inline-block;
      max-width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: inherit;
    }
    &:hover{
      color: #5488F9;
      border: 1px solid #5488F9;
    }
  }
  .addkey-box{
    margin-top: 32px;
    .el-input{
      width: 328px;
    }
    .el-icon-del{
      display: none;
      font-size: 13px;
      color: #4F6D95;
      vertical-align: middle;
    }
    .el-button{
      margin-left: 10px;
      padding: 9px 25px;
    }
    .is-disabled{
      background: #EAF0F6;
      border: 1px solid #DFE3EB;
      color: #B0C1D4;
    }
    .cancel-show{
      .el-icon-del{
        display: block;
      }
    }
  }
  .right-content{
    .loading{
      margin: 50px auto;
    }
    div.u-right{
      min-height: 597px;
    }
    .big-title{
      font-size:16px;
      line-height: 22px;
      .icon-font{
        margin-left: 5px;
        color: #7C98B6;
      }
    }
    .small-title{
      margin: 10px 0;
      // padding:0 25px;
      color: #7C98B6;
      font-size: 13px;
      // em{
      //   color: #5488F9;
      // }
    }
    // .bottom-setting{
    //   margin-top:15px;
    //   // padding:0 25px;
    //   overflow:hidden;
    //   // .left-btn{
    //   //   text-align: center;
    //   //   width:20%;
    //   //   float:left;
    //   //   .center-btn{
    //   //     width:100px;
    //   //     color:#fff;
    //   //     background: #5488F9;
    //   //     border-radius: 4px;
    //   //     padding:7px 0;
    //   //     font-size:13px;
    //   //     line-height: 18px;
    //   //     display: inline-block;
    //   //     cursor: pointer;
    //   //     margin-right: -25px;
    //   //   }
    //   //   .center-btn:hover{
    //   //     opacity: 0.7;
    //   //   }
    //   // }
    // }
    .key-box{
      margin-top: 12px;
      width: 100%;
      min-height: 126px;
      // border-right: 1px solid #EAF0F6;
      overflow: hidden;
      .no-data{
        color: #CBD6E2;
      }
      .el-tag{
        margin: 5px 5px 8px 5px;
        height: 28px;
        line-height: 26px;
        padding: 0 8px;
        p{
          font-size: 13px;
        }
        .el-tag__close{
          top: -9px;
          color: #4F6D95;
        }
      }
    }
  }
  /*设置关键字弹框*/
  // .edit-keyword{
  //     width:390px;
  //     .desc{
  //       font-size: 12px;
  //       color: #7C98B6;
  //     }
  //     .key-box{
  //       margin-top:8px;
  //       border: 1px solid #CBD6E3;
  //       border-radius: 4px;
  //       padding:4px 4px;
  //       height:140px;
  //       overflow: auto;
  //       .el-input{
  //         margin-top:4px;
  //       }
  //       .el-tag{
  //         margin-left:4px;
  //         margin-top:4px;
  //         p{
  //           display:inline-block;
  //         }
  //         i{
  //           color: #4F6D95;
  //           line-height: 0px;
  //         }
  //       }
  //     }
  //     .el-dialog__body{
  //       padding:16px 20px;
  //     }
  //     .el-dialog__footer{
  //       padding: 0px 17px 23px;
  //       .dialog-footer{
  //         .el-button{
  //           width:100%;
  //           background:#EAF0F6;
  //           border: 1px solid #DFE3EB;
  //           color: #B0C1D4;
  //         }
  //       }
  //       .is-ok{
  //         .el-button{
  //           background: #5488F9;
  //           border:none;
  //           color: #fff;
  //         }
  //         .el-button:hover{
  //           opacity: 0.7;
  //         }
  //       }
  //     }
  //     .button-new-tag{
  //       vertical-align: top;
  //       margin-top: 3px;
  //     }
  // }
  // .is-ok{
  //   .el-button{
  //     background: #5488F9;
  //     border:none;
  //     color: #fff;
  //   }
  //   .el-button:hover{
  //     opacity: 0.7;
  //   }
  // }
  .intell-box{
    padding: 15px 25px;
    .intellkey-box{
      margin-top: 20px;
    }
  }
  .keyset-box{
    padding: 15px 25px;
  }
  .key-msg{
    position: relative;
    margin: 16px 0 0 0;
    width: 43%;
    height: 47px;
    // border-bottom: 1px dashed #333;
    border-bottom: 1px dashed #DFE3EB;
    .key-wrap{
      height: 20px;
    }
    .key-input{
      height: 34px;
      border-bottom:1px solid #02AAAA;
      .el-input__inner{
        margin-top: 6px;
        padding: 3px 0;
        height: 28px;
        border: 0;
        &:hover, &:focus{
          border: 0;
          box-shadow: none;
        }
      }
    }
    .key-name{
      margin-top: 14px;
      font-size: 13px;
      white-space: nowrap;
    }
    .title{
      color: #7C98B6;
      font-size: 13px;
      -webkit-transform: translateY(40%);
      transform: translateY(39%);
      -webkit-transition: 0.4s ease-in-out;
    }
    .key-opt{
      position: absolute;
      right: 10px;
      top: 9px;
      .icon-edit{
        font-size: 16px;
      }
      a{
        font-size: 14px;
        color: #00B8CC;
      }
      .icon-remove2{
        margin-left: 16px;
        color: #7C98B6;
      }
    }
  }
</style>

