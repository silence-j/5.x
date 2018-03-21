<template>
  <div class="edm-container">
    <div class="edm-wrapper">
      <div class="edm-main" 
      ref="wrapper"
      @dragover="outerover" 
      @dragleave="outerleave" 
      @drop="outerdrop" 
      >
        <draggable v-model="mailLayout" :options="dragOptions" @end="commitMailLayout">
          <transition-group type="transition" :name="'flip-list'">
            <div v-for="(item,index) in mailLayout" :key="index" :data-index="index"  class="layout-wrapper">
              <div class="tip-wrapper-top" :data-index="index" @dragleave="dragleave" @dragover="dragover" @drop="drop" v-show="item.topShow">松开在此处添加模块</div>
              <div class="edit-layout">
                <span class="icon-font move"
                @mousedown="mousedown" 
                @mouseup="mouseup" 
                @mouseout="mouseup">&#xe655;</span>
                <span class="icon-font delete" 
                title="删除"
                :data-index="index" 
                @click="deleteContent">&#xe679;</span>
                <span class="icon-font copy"
                title="复制" 
                :data-index="index" 
                :data-type="item.type" 
                @click="copyContent">&#xe688;</span>
                <span class="icon-font edit" 
                title="编辑"
                :data-index="index" 
                :data-type="item.type" 
                @click="editContent">&#xe68a;</span>
              </div>
              <div class="layout" :class="item.type" 
              :data-index="index" 
              :key="index" 
              @dragenter="dragenter" 
              @dragover="dragover" 
              @dragleave="dragleave" 
              @drop="drop" 
              v-html="item.content || ''">
              </div>
              <div class="tip-wrapper-bottom" 
              :data-index="index" 
              @dragleave="dragleave" 
              v-show="item.bottomShow">松开在此处添加模块</div>
            </div>
          </transition-group>
        </draggable>
        <el-dialog v-model="dialogVisible" size="tiny">
          <div class="delete-tip">
            <span class="icon-font">&#xe629;</span>
            <span class="tip-content">是否确认删除？</span>
            <div class="btn-wrapper">
              <el-button type="danger" @click="confirmDelete">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="edm-tmpl" v-show="!openEditor">
      <div class="edm-tmpl-title">模块</div>
      <ul class="tmpl-list">
        <li class="tmpl-item" 
        :draggable="item.dragAble" 
        v-for="(item,index) in tmplList" 
        @drag="drag" 
        @dragstart="dragstart" 
        @dragend="dragend" 
        :key="index" 
        :data-type="item.type">
          <div v-show="item.dragAble" class="item-cover">
            <span>拖动该模块至<br/>左侧任意区域</span>
          </div>
          <div v-if="!item.dragAble" class="dis-drg">
            <el-tooltip class="item" effect="dark" :content="item.disableTip || '组件不可用'" placement="top">
              <div>
                <div class="img" ><img :src="item.icon" :draggable="false" alt="1"></div>
                <!-- <span class="item-icon icon-font" v-html="item.icon"></span> -->
                <h3 class="item-name">{{item.name}}</h3>
              </div>
            </el-tooltip>
          </div>
          <div v-else>
            <div class="img"><img :draggable="false" :src="item.icon" alt="2"></div>
            <!-- <span class="item-icon icon-font" v-html="item.icon"></span> -->
            <h3 class="item-name">{{item.name}}</h3>
          </div>
        </li>
      </ul>
    </div>
    <div :class="editorType" class="editor-wrapper" v-show="openEditor">
      <div class="editor-title">{{editorTitle}}</div>
      <editorImg v-if="editorType == 'img'"
      :editorSave="saveEdit" 
      :editorChange="editorChange" 
      :editData="editData"/>
      <editorLineText v-else-if="editorType == 'linetext'"
      :editorSave="saveEdit" 
      :editorChange="editorChange" 
      :editData="editData"/>
      <editorImgText v-else-if="editorType == 'textImgBg' || editorType == 'textImgBtn'"
      :editorSave="saveEdit" 
      :editorChange="editorChange" 
      :editData="editData"/>
      <editorImgGroup v-else-if="editorType == 'imgGroup'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorLine v-else-if="editorType == 'line'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorButton v-else-if="editorType == 'btn' || editorType == 'message'"
      :homePageId="homePageId"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorSocial v-else-if="editorType == 'social'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorImgCard v-else-if="editorType == 'imgCard1' || editorType == 'imgCard2'  || editorType == 'imgCard3'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorProduct v-else-if="editorType == 'product'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorFooter v-else-if="editorType == 'footertext'"
      :editorSave="saveEdit"
      :editorChange="editorChange"
      :editData="editData"/>
      <editorText v-else
      :editorSave="saveEdit" 
      :editorChange="editorChange" 
      :editData="editData"/>
    </div>
  </div>
</template>
<script>
  import DevelopAPI from '@/api/developAPI'
  import draggable from 'vuedraggable'
  // 左侧列表的拖拽移位
  import VueHtml5Editor from 'longxi-vue-html5-editor'
  // 富文本编辑器
  import imgUpload from '../../../components/imgUpload'
  // 上传图片组件 @hansin
  import editorImg from '../../../components/emailEditorWrapper/editorImg'
  import editorText from '../../../components/emailEditorWrapper/editorText'
  import editorLineText from '../../../components/emailEditorWrapper/editorLineText'
  import editorImgText from '../../../components/emailEditorWrapper/editorImgText'
  import editorImgGroup from '../../../components/emailEditorWrapper/editorImgGroup'
  import editorLine from '../../../components/emailEditorWrapper/editorLine'
  import editorButton from '../../../components/emailEditorWrapper/editorButton'
  import editorImgCard from '../../../components/emailEditorWrapper/editorImgCard'
  import editorSocial from '../../../components/emailEditorWrapper/editorSocial'
  import editorProduct from '../../../components/emailEditorWrapper/editorProduct'
  import editorFooter from '../../../components/emailEditorWrapper/editorFooter'
  // 模板选择 @hansin
  import quicklyEmailTmpl from '../../../components/emailEditorWrapper/emailTmpl'
  // 获取各类型 @hansin
  import { getTmplContent, tmplContenToTable } from '@/common/TmplContent'
  import { emailTmplList, activityTmplList } from '@/components/emailEditorWrapper/emailTmplFolder/options'
  const editor = new VueHtml5Editor({
    name: 'vue-html5-editor',
    language: 'zh-cn',
    showModuleName: true,
    visibleModules: [
      'text',
      'color',
      'font',
      'align',
      'list',
      'link',
      'unlink',
      'tabulation',
      'hr',
      'eraser',
      'undo',
      'keyword'
    ],
    icons: {
      text: 'icon-edit',
      color: 'icon-Shape1',
      font: 'icon-wenzi',
      align: 'icon-alignleft',
      list: 'icon-list',
      link: 'icon-link',
      unlink: 'icon-unlink',
      tabulation: 'icon-table',
      hr: 'icon-hr',
      eraser: 'icon-delete',
      undo: 'icon-iconfresh',
      keyword: 'icon-tequan'
    }
  })
  export default {
    name: 'editMail',
    props: {
      tmplType: String
    },
    data () {
      return {
        tmplList: [],
        // 邮件编辑内容 以数组形式存储
        mailLayout: [],
        // dragenter事件进入左侧时，把这个块的位置存储下来
        enterOffset: 0,
        // flag 用来判断是不是draggable插件  如果不是才走自己的方法 否则会冲突
        notDraggable: false,
        // 移动icon是否被拖住
        moveIconDown: false,
        // 存储编辑框的类型
        editorType: '',
        // 控制是否显示右侧编辑器
        openEditor: false,
        // 点击编辑按钮时，记录你所要编辑的index
        editorIndex: 0,
        // 记录要删除的index
        deleteIndex: 0,
        // 删除弹出框
        dialogVisible: false,
        // 是否为图片编辑器
        imgUrl: '',
        editData: {
          content: '',
          index: null
        },
        homePageId: null
      }
    },
    components: {
      draggable,
      editor,
      imgUpload,
      editorImg,
      editorText,
      editorLineText,
      editorImgText,
      editorImgGroup,
      editorLine,
      editorButton,
      editorImgCard,
      quicklyEmailTmpl,
      editorSocial,
      editorProduct,
      editorFooter
    },
    watch: {
      openEditor (newVal, oldVal) {
        if (newVal === true) {
          this.$emit('openEditor', true)
        } else {
          this.$emit('openEditor', false)
        }
      }
    },
    computed: {
      activityContentList () {
        return this.$store.state.develop.activityContentList
      },
      emailContentList () {
        return this.$store.state.develop.emailContentList
      },
      dragOptions () {
        return {
          animation: 0,
          ghostClass: 'ghost',
          disabled: !this.moveIconDown
        }
      },
      // 使编辑器获取到你所要操作的内容
      layContent () {
        return this.mailLayout[this.editorIndex].content || ''
      },
      // 编辑器title
      editorTitle () {
        switch (this.editorType) {
          case 'text':
            return '文本'
          case 'linetext':
            return '带边框文本'
          case 'img':
            return '图片'
          case 'btn':
            return '按钮'
          case 'imgGroup':
            return '图片组'
          case 'imgCard1':
            return '图片卡片'
          case 'imgCard2':
            return '图片卡片'
          case 'imgCard3':
            return '图片卡片'
          case 'footer':
            return '底部'
          case 'textImgBg':
            return '背景+文本'
          case 'textImgBtn':
            return '背景+文本+按钮'
          case 'line':
            return '分隔线'
          case 'title':
            return '主标题'
          case 'social':
            return '社交关注'
          case 'product':
            return '产品展示'
          case 'message':
            return 'Facebook Message'
          case 'footertext':
            return '底部签名'
          default:
            return '未知'
        }
      }
    },
    beforeMount () {
      // 'activityTmpl'表示活动营销否则表示邮件模版
      let draftContentArr, emc
      this.tmplList = this.tmplType === 'activityTmpl' ? activityTmplList : emailTmplList
      emc = this.tmplType === 'activityTmpl' ? this.activityContentList : this.emailContentList
      if (emc && emc.length !== 0) {
        draftContentArr = JSON.parse(emc)
        this.mailLayout = draftContentArr
      }
      // 查询facebook是否已绑定
      DevelopAPI.getChannelList().then(res => {
        if (res.data.code === 0) {
          let list = res.data.data
          let tmplList = this.tmplList
          window.localStorage.setItem('channelList', JSON.stringify(list))
          list.forEach((item) => {
            if (item.channelId === 'FACEBOOK' && item.bindingTag === 1 && item.homePageId) {
              this.homePageId = item.homePageId
              for (let i = 0; i < tmplList.length; i++) {
                if (tmplList[i].type === 'message') {
                  tmplList[i].dragAble = true
                }
              }
            }
          })
          this.tmplList = tmplList
        }
      })
    },
    mounted: function () {
      this.commitMailLayout()
    },
    methods: {
      /*
      * event: e, include: parent className, list: get all parent or get first parent
      * @hansin
      */
      getParentByClass (event, include) {
        let parent = event.target.offsetParent
        if (parent && parent.className && parent.className === include) {
          return parent
        } else {
          return null
        }
      },
      dragstart (event) {
        // 开始drag 标记notdraggable为true 走自己写的方法
        this.notDraggable = true
        // 记录所拖拽的模块的type
        let type = event.target.dataset.type
        event.dataTransfer.setData('text/type', type)
      },
      drag (event) {
        // console.log(drag)
      },
      dragend (event) {
        // drag结束，notsraggable flag变为false
        this.notDraggable = false
        this.commitMailLayout()
      },
      dragenter (event) {
        if (this.notDraggable === true) {
          // 如果target是左侧元素的子元素，找到它们的祖先layout-wrapper
          // let layWrapper = $(event.target).parents('.layout-wrapper')[0]
          let layWrapper = this.getParentByClass(event, 'layout-wrapper')
          if (!layWrapper) return
          // 73是顶部的两个bar的高度 enterOffset现在就是wrapper的偏移量加上高度的一般 也就是上下变换的临界值
          this.enterOffset = layWrapper.offsetTop + 73 + (layWrapper.clientHeight / 2)
          event.dataTransfer.dropEffect = 'copy'
          event.preventDefault()
          // event.stopPropagation()
        }
      },
      dragover (event) {
        if (this.notDraggable === true) {
          let layWrapper = this.getParentByClass(event, 'layout-wrapper')
          if (!layWrapper) return
          let index = parseInt(layWrapper.dataset.index)
          // 获取container滚动条的高度
          let scrollOffset = this.$refs.wrapper.scrollTop
          // 鼠标的偏移量
          let mouseOffset = event.pageY + scrollOffset
          let klass = event.target.className
          event.dataTransfer.dropEffect = 'copy'
          // 如果鼠标在wrapper的上半部分 上方提示 反之 下方提示
          if (mouseOffset <= this.enterOffset && klass !== 'tip-wrapper-top') {
            this.mailLayout[index].bottomShow = false
            this.mailLayout[index].topShow = true
          } else if (mouseOffset > this.enterOffset && klass !== 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
            this.mailLayout[index].bottomShow = true
          } else if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].bottomShow = false
            this.mailLayout[index].topShow = true
          }
          event.preventDefault()
          // event.stopPropagation()
        }
      },
      dragleave (event) {
        if (this.notDraggable === true) {
          event.stopPropagation()
          let layWrapper = this.getParentByClass(event, 'layout-wrapper')
          if (!layWrapper) return
          let index = parseInt(layWrapper.dataset.index)
          let scrollOffset = this.$refs.wrapper.scrollTop
          let mouseOffset = event.pageY + scrollOffset - 60
          let klass = event.target.className
          if (mouseOffset > layWrapper.offsetTop + 73) {
            this.mailLayout[index].bottomShow = false
            this.mailLayout[index].topShow = false
          } else if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
          } else {
            this.mailLayout[index].topShow = true
          }
        }
      },
      drop (event) {
        if (this.notDraggable === true) {
          let layWrapper = this.getParentByClass(event, 'layout-wrapper')
          if (!layWrapper) return
          let index = parseInt(layWrapper.dataset.index)
          let content
          let scrollOffset = this.$refs.wrapper.scrollTop
          let mouseOffset = event.pageY + scrollOffset
          let klass = event.target.className
          let type = event.dataTransfer.getData('text/type')
          //  @hansin fun:getTmplContent参数type: 类型， 【params】:样式配置空值表示默认值
          // homepageid message need
          content = getTmplContent(type, {homePageId: this.homePageId})
          if (klass === 'tip-wrapper-top') {
            this.mailLayout[index].topShow = false
            this.mailLayout.splice(index, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          } else if (mouseOffset <= this.enterOffset) {
            this.mailLayout[index].topShow = false
            this.mailLayout.splice(index, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          } else if (mouseOffset > this.enterOffset) {
            this.mailLayout[index].bottomShow = false
            this.mailLayout.splice(index + 1, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          }
        }
      },
      mousedown (event) {
        this.moveIconDown = true
        this.openEditor = false
      },
      mouseup (event) {
        // this.openEditor = false
        this.moveIconDown = false
      },
      copyContent () {
        let index = event.target.dataset.index
        let copy = this.mailLayout[index]
        let layout = JSON.stringify(this.mailLayout)
        let arr = JSON.parse(layout)
        arr.splice(index, 0, copy)
        this.mailLayout = arr
      },
      editContent (event) {
        this.openEditor = true
        this.editorIndex = event.target.dataset.index
        this.editorType = event.target.dataset.type
        // hansin add
        this.editData = {
          index: this.editorIndex,
          item: this.mailLayout[this.editorIndex],
          e: event
        }
      },
      editorChange (data) {
        this.mailLayout[data.index].content = data.item.content
        // 改动就保存【yes/no】
        this.commitMailLayout()
      },
      saveEdit (event) {
        this.openEditor = false
        this.commitMailLayout()
      },
      commitMailLayout () {
        let tableContent
        if (this.tmplType === 'activityTmpl') {
          tableContent = tmplContenToTable(this.mailLayout, 'activity')
          this.$store.commit('DEVELOP_ACTIVITYCONTENTLIST', JSON.stringify(this.mailLayout))
          this.$store.commit('DEVELOP_ACTIVITYSENDINFO', {second: tableContent})
        } else {
          tableContent = tmplContenToTable(this.mailLayout, 'email')
          this.$store.commit('DEVELOP_EMAILCONTENTLIST', JSON.stringify(this.mailLayout))
          this.$store.commit('DEVELOP_SENDINFO', {third: tableContent})
        }
      },
      deleteContent (event) {
        this.deleteIndex = event.target.dataset.index
        this.editorIndex = 0
        this.openEditor = false
        if (this.mailLayout.length === 1) {
          this.$message.error('无法删除，内容不可为空')
        } else {
          this.mailLayout.splice(this.deleteIndex, 1)
          this.commitMailLayout()
        }
      },
      confirmDelete () {
        this.editorIndex = 0
        this.openEditor = false
        this.dialogVisible = false
        if (this.mailLayout.length === 1) {
          this.$message.error('无法删除，内容不可为空')
        } else {
          this.mailLayout.splice(this.deleteIndex, 1)
          this.commitMailLayout()
        }
      },
      tipErr (val) {
        this.$message.error(val)
      },
      tipSuc (val) {
        this.$message.success(val)
      },
      outerover (e) {
        if (this.notDraggable === true) {
          e.dataTransfer.dropEffect = 'copy'
          let a = e.target.className
          let b = e.offsetY
          let c = (e.target.childNodes[0] && e.target.childNodes[0].clientHeight) ? (e.target.childNodes[0].clientHeight + 20) : 0
          if (a === 'edm-main' && b > c) {
            this.mailLayout[this.mailLayout.length - 1].bottomShow = true
          }
          event.preventDefault()
        }
      },
      outerleave (e) {
        if (this.notDraggable === true) {
          let a = e.target.className
          let b = e.offsetY
          let c = (e.target.childNodes[0] && e.target.childNodes[0].clientHeight) ? (e.target.childNodes[0].clientHeight + 20) : 0
          if (a === 'edm-main' && b > c) {
            this.mailLayout[this.mailLayout.length - 1].bottomShow = false
          }
        }
      },
      outerdrop (e) {
        if (this.notDraggable === true) {
          this.mailLayout[this.mailLayout.length - 1].bottomShow = false
          let a = e.target.className
          let b = e.offsetY
          let c = e.target.childNodes[0] ? (e.target.childNodes[0].clientHeight + 20) : 0
          if ((a === 'edm-main' && b > c) || a === 'tip-wrapper-bottom') {
            let content
            let type = e.dataTransfer.getData('text/type')
            content = getTmplContent(type, {})
            this.mailLayout.splice(this.mailLayout.length, 0, {
              content,
              type,
              topShow: false,
              bottomShow: false
            })
          }
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .flip-list-move {
    transition: transform 0.2s;
  }
  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
  .tmpl-visible{
    font-size: 12px;
  }
  .edm-container{
    width: 1200px;
    margin: 0 auto;
    font-size: 0;
    .edm-wrapper{
      vertical-align: top;
      display: inline-block;
      width: 780px;
      margin-right: 30px;
      font-size: 12px;
      .edm-main{
        width: 100%;
        height: 686px;
        padding: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 8px rgba(0,0,0,0.08);
        overflow-y: scroll;
        text-align: center;
        .el-dialog{
          width: 360px;
          height: 180px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          .el-dialog__header{
            padding: 0;
            font-size: 0
          }
          .delete-tip{
            .icon-font{
              font-size: 27px;
              color: #ff3b6e;
              margin-right: 10px;
            }
            .tip-content{
              font-size: 14px;
              color: #33475b;
              font-weight: 600;
            }
            .btn-wrapper{
              margin-top: 36px;
              margin-left: 40px;
              .el-button--danger{
                background-color: #ff3b6e;
                padding: 9px 24px;
              }
              .el-button--default{
                border: none;
                padding: 0 9px;
                color: #4f6d95;
              }
            }
          }
        }
        .layout-wrapper{
          min-height: 44px;
          position: relative;
          border:3px solid transparent;
          &:hover{
            min-height: 46px;
          }
          .edit-layout{
            display: none;
            position: absolute;
            top: 0;
            color: #fff;
            width: 100%;
            height: 44px;
            box-sizing: border-box;
            background-color: rgba(80, 109, 149, 0.6);
            z-index: 2;
            .move{
              display: inline-block;
              width: 570px;
              font-size: 22px;
              padding-left:10px;
              padding-top: 13px;
              cursor: move;
              text-align: left;
            }
            .edit{
              display: inline-block;
              float: right;
              font-size: 16px;
              padding-right: 16px;
              margin-top: 16px;
              border-right: 1px solid #fff;
              cursor: pointer;
            }
            .copy{
              display: inline-block;
              float: right;
              font-size: 16px;
              padding-right: 16px;
              margin-left: 16px;
              margin-top: 16px;
              border-right: 1px solid #fff;
              cursor: pointer;
            }
            .delete{
              display: inline-block;
              float: right;
              font-size: 16px;
              padding-right: 16px;
              padding-top: 16px;
              margin-left: 16px;
              cursor: pointer;
            }
          }
          &:hover{
            border:3px dashed #5488f9;
            .edit-layout{
              display: block;
            }
          }
          .text{
            width: 100%;
            height: auto;
            font-size: 12px;
            line-height: 1.5;
            text-align: justify;
          }
          .img{
            text-align: center;
            width: 100%;
            height: auto;
          }
          .footer{
            width: 100%;
            height: auto;
            color: #324751;
            background-color: #f0f1f2;
            line-height: 1.5;
            box-sizing: border-box;
            text-align: center;
          }
          .layout{
            min-height: 44px;
            i{
              font-style: italic;
            }
            h1{
              font-size: 2em;
            }
            h2{
              font-size: 1.5em;
            }
            h3{
              font-size: 1.17em;
            }
            h4{
              font-size: 1em;
            }
            h5{
              font-size: 0.83em;
            }
            h6{
              font-size: 0.67em;
            }
            ol{
              padding-left: 20px;
              li{
                list-style: decimal;
              }
            }
            ul{
              padding-left: 20px;
              li{
                list-style: disc;
              }
            }
          }
          .tip-wrapper-top, .tip-wrapper-bottom{
            width: 100%;
            height: 50px;
            line-height: 50px;
            border: 1px dashed #333;
            font-size: 18px;
            color: #246e7b;
            text-align: center;
            background-color: #e3f3f5;
            opacity: 0.8;
          }
        }
      }
    }
    .edm-tmpl{
      vertical-align: top;
      width: 390px;
      min-height: 476px;
      display: inline-block;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0,0,0,0.08);
      .edm-tmpl-title{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #F5F8FA;
        font-size: 18px;
        color: #33475b;
        font-weight: 600;
        padding-left: 30px;
        box-sizing: border-box;
        .quickly-tmpl{
          float: right;
          margin-top: 8px;
          margin-right: 8px;
        }
      }
      .tmpl-list{
        display: flex;
        min-height: 626px;
        padding: 20px;
        box-sizing: border-box;
        flex-wrap: wrap;
        align-content: flex-start;
        .tmpl-item{
          width: 103px;
          height: 109px;
          border: 1px solid #cbd6e3;
          border-radius: 4px;
          margin-top: 10px;
          padding: 20px 10px;
          text-align: center;
          box-sizing: border-box;
          margin-right: 6px;
          margin-left: 6px;
          position: relative;
          overflow: hidden;
          .item-cover{
            position: absolute;
            top: 0;
            left: 0;
            font-size: 12px;
            color: #fff;
            line-height: 20px;
            vertical-align: middle;
            width: 100%;
            height: 100%;
            background: rgba(203,214,227,0.80);
            z-index: 1;
            opacity: 0;
            transition: opacity 0.1s;
            span{
              margin-top: 30px;
              display: inline-block;
            }
          }
          &:hover{
            transform: scale(1.05);
            .item-cover{
              opacity: 1;
            }
          }
          .dis-drg{
            cursor: no-drop;
            .item-name{
              color: #bdc1d3;
            }
          }
          .item-icon{
            display: block;
            margin-top: 8px;
            font-size: 48px;
            color: #bdc1d3;
          }
          .img{
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .item-name{
            width: 100px;
            position: absolute;
            left: 0;
            font-size: 13px;
            color: #32475a;
            line-height: 13px;
            margin-top: 5px;
          }
        }
      }
    }
    .editor-wrapper{
      vertical-align: top;
      width: 390px;
      height: 686px;
      display: inline-block;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0,0,0,0.08);
      .editor-title{
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-color: #F5F8FA;
        font-size: 18px;
        color: #33475b;
        font-weight: 600;
        padding-left: 30px;
        box-sizing: border-box;
      }
      .img-out {
        .img-box{
          margin-top: 20px;
          margin-left: 30px;
        }
      }
      .upload-tip{
        color: #7c98b6;
        margin-top: 16px;
        padding: 0 30px;
        line-height: 21px;
        font-size: 13px;
      }
      .vue-html5-editor{
        font-size: 12px;
        border:none;
        border-top-left-radius: 4;
        border-top-left-radius: 4;
        .toolbar{
          ul{
            border-bottom: 0;
            li{
              width: 92px;
              .icon{
                display: inline;
                vertical-align: top;
                font-size: 14px;
              }
            }
          }
        }
        .content{
          width: 330px;
          margin-left: 30px;
          border: 1px solid #dfe3eb;
          i{
            font-style: italic;
          }
          h1{
            font-size: 2em;
          }
          h2{
            font-size: 1.5em;
          }
          h3{
            font-size: 1.17em;
          }
          h4{
            font-size: 1em;
          }
          h5{
            font-size: 0.83em;
          }
          h6{
            font-size: 0.67em;
          }
          ol{
            padding-left: 20px;
            li{
              list-style: decimal;
            }
          }
          ul{
            padding-left: 20px;
            li{
              list-style: disc;
            }
          }
        }
      }
      .el-button{
        width: 90px;
        height: 34px;
        font-size: 13px;
        margin-top: 20px;
        margin-left: 30px;
      }
      .edit-type{
        height: 630px;
        overflow-y: auto;
        .el-button{
          margin-left: 30px;
        }
        .el-input{
          width: 335px;
        }
        .el-select{
          .el-input{
            width: 100%;
          }
        }
        .upload-tip{
          padding: 0 15px;
        }
        .img-box{
          margin-top: 5px;
          margin-left: 15px;
        }
        .title{
          font-size: 14px;
          height: 36px;
          line-height: 36px;
          margin-top: 16px;
        }
        .inline-title{
          display: inline-block;
        }
        .slider-i{
          margin-right: 10px;
          width: 240px;
          display: inline-block;
          position: relative;
          top: 10px;
        }
      }
    }
  }
</style>
