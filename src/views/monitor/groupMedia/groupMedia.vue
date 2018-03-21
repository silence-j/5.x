<template>
  <div class="logistic-container group-container" style="overflow:unset;position:relative;">
    <div class="box-header">
      <el-select v-model="group4" placeholder="选择小组" class="group-select" @change="chooseGroup">
        <el-option
          v-for="item in groups"
          :key="item.name"
          :label="item.name"
          :value="item.groupId"
          >
          <div style="position: relative">
            <img :src='item.avatar' alt="" style="position:absolute;width: 32px;height: 32px;border-radius: 50%">
            <span style="height: 36px;line-height:36px !important; padding-left: 42px">{{item.name}}</span>
          </div>
        </el-option>
      </el-select>
      <span style="position: relative;">
        <el-input class="group-input"
                  placeholder="请输入帖子名称"
                  suffix-icon="el-icon-date"
                  v-model="group3" @change="inputOne">
      </el-input>
        <i class="el-icon-search" style="position: absolute;right: 10px;color: #CBD6E2;top: 0;fontSize: 16px"></i>
      </span>
      <el-date-picker
        v-model="timerPicker"
        type="daterange"
        align="center"
        @change="timeChage"
        :placeholder='timeTip'
        style="margin-left: 8px">
      </el-date-picker>
      <el-button class="group-search" @click="searchGroup">搜索</el-button>
      <a href="https://chrome.google.com/webstore/detail/%E7%9B%88%E5%BA%97%E5%8A%A9%E6%89%8B/jbmgeokjjidieoppjegcdmmhpflmeijm/related?hl=zh-CN" target="_blank">
        <el-button class="add-blog" type="primary" style="width:90px;height:35px;">插件发帖</el-button>
      </a>
    </div>
    <div class="list-box prod-box">
      <div class="el-table opt-box" v-if="multipleSelection.length">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" >
          <thead>
          <tr>
            <th colspan="1" rowspan="1" class="el-table_1_column_1 el-table-column--selection is-leaf">
              <div class="cell chked-opt">
                <label>已选中 {{multipleSelection.length}} 项</label>
                <!--<a  href="javascript:;"  @click="delBlog(true)" class="icon-buttons butt" v-if="isCanDelete()"><i class="icon-trash"></i>删除</a>-->
                <a  href="javascript:;"  @click="delBlog(true)" class="icon-buttons butt"><i class="icon-trash"></i>删除</a>
              </div>
            </th>
            </th>
          </tr>
          </thead>
        </table>
      </div>
      <template>
        <el-table
          :data="blogListWrap.records"
          border
          tooltip-effect="none"
          ref="multipleTable"
          style="width: 100%"
          class="blog-tab"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="52">
          </el-table-column>
          <el-table-column
            label="小组"
            width="266">
            <template scope="scope">
              <div @click="jumpFacebook(scope.row.groupId)" class="blog-table-title" :title="scope.row.name" v-html="scope.row.name">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="帖子"
            width="364"
          >
            <template scope="scope">
              <div class="blog-table-content" >
                <ShowMore :maxHeight="60" class="post-group">
                  <div v-html="contentR(scope.row.content)"></div>
                </ShowMore>
                <!--<ShowMore class="post-group" :text="scope.row.content" :len="100"></ShowMore>-->
                <!--<span v-html="contentReturn5(scope.row.content)"></span>-->
                <!--<ShowMore class="post-group" :text="contentReturn(scope.row.content)" :len="50"></ShowMore>-->
                <img v-if="scope.row.pictures !== null && scope.row.pictures !== ''" class="imgTab" :src="scope.row.pictures" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="likeCount"
            width="101"
            label="点赞">
            <template scope="scope">
              {{scope.row.likeCount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="commentCount"
            width="101"
            label="评论">
            <template scope="scope">
              {{scope.row.commentCount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="directCount"
            width="138"
            label="跳转店铺">
            <template scope="scope">
              {{scope.row.directCount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="176"
            label="发布时间">
            <template scope="scope">
              {{scope.row.createTime|time-formater-no-second}}
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="no-data" v-if="!loading && blogListWrap.records &&!blogListWrap.records.length">
        <!-- <div class="img"></div> -->
        <img src="../../../assets/img/empty-contact.png" alt="">
        <div class="tips">暂无数据</div>
      </div>
      <div v-if="loading" class="loading loading-circle"></div>
      <el-pagination v-if="blogListWrap.records && blogListWrap.records.length && blogListWrap.totalCount > 10"
                     layout="prev, pager, next, sizes, jumper"
                     :page-sizes="[10, 20, 30, 40]"
                     @size-change="listSizeChange"
                     :page-size="pageSize"
                     :total="blogListWrap.totalCount"
                     :current-page="pageIndex"
                     @current-change="pager"></el-pagination>
    </div>
    <div v-show="ifShield" class="shieldDialog">
      <div class="Sdialog">
        <div style="margin-bottom: 60px">
          <span class="iconfont warning">&#xe629;</span>
          <span>确定是否确认删除？</span>
        </div>
        <div style="float: left;padding-left: 36px;text-align: center">
          <span class="okall ok" @click="confirmOk()">确定</span>
          <!--<span class="okall ok" @click="shieldThis()">确定</span>-->
          <span class="okall cancle" @click="ifShield = false">取消</span>
        </div>
      </div>
    </div>
    <!--<DialogBox :config="oconfig" @sure="confirmOk"></DialogBox>-->
  </div>
</template>
<script>
  import MonitorAPI from '@/api/monitorAPI'
  import ShowMore from '../../../components/newShowMore.vue'
//  import BlogAPI from '@/api/blogAPI'
//  import DialogBox from '../../../components/box/dialogBox'
//  import Util from '@/common/Util'
  export default {
    name: 'Blog',
    props: {
    },
    components: {
      ShowMore
    },
    data () {
      return {
        pageIndex: 1,
        pageSize: 10,
        loading: false,
        multipleSelection: [],
        blogListWrap: {
          records: [],
          totalCount: 0,
          size: 0
        },
        blogModel: false,
        blogIds: '',
        oconfig: {
          visible: false,
          notice: '',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          flag: 0,
          theme: 'red',
          popovercls: 'confirm-pop'
        },
        isBatch: false,
        homepage: process.env.HOMEPAGE,
        timeTip: '开始时间 ~ 结束时间',
        groups: [
//          {
//            src: 'http://img.souche.com/f2e/1255df2c0f7b4d4420e5334faaf8d05e.png',
//            name: 'wonder1'
//          },
//          {
//            src: 'http://img.souche.com/f2e/1255df2c0f7b4d4420e5334faaf8d05e.png',
//            name: 'wonder2'
//          },
//          {
//            src: 'http://img.souche.com/f2e/1255df2c0f7b4d4420e5334faaf8d05e.png',
//            name: 'wonder3'
//          }
        ],
        group1: '',
        group2: '',
        group3: '',
        group4: '',
        timerPicker: '',
        createTimeStart: '',
        createTimeEnd: '',
        ifShield: false
      }
    },
//    components: {DialogBox},
    methods: {
      contentR (str) {
        let reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&amp;:/~\\+#]*[\w\-\\@?^=%&amp;/~\\+#])?/g
        return str.replace(reg, function (a) {
          if (!a.indexOf('http')) {
            return ' <a href="' + a + '" target=_blank>' + a + '</a>'
          } else {
            return ' <a href="http://' + a + '" target=_blank>' + a + '</a>'
          }
        })
      },
      jumpFacebook (id) {
        console.log(id)
        window.open('https://www.facebook.com/groups/' + id)
      },
      inputOne (value) {
        this.group3 = value
      },
//      选择小组名称
      chooseGroup (val) {
        this.group4 = val
      },
//      搜索社交
      searchGroup () {
        this.group2 = this.group3
        this.group1 = this.group4
        if (this.timerPicker && this.timerPicker[0]) {
          this.createTimeStart = this.changeDate(this.timerPicker[0])
          this.createTimeEnd = this.changeDate(this.timerPicker[1])
        } else {
          this.createTimeStart = ''
          this.createTimeEnd = ''
        }
//        if (this.timerPicker && this.timerPicker[0]) {
//          this.createTimeStart = this.changeDate(this.timerPicker[0])
//          this.createTimeEnd = this.changeDate(this.timerPicker[1])
//        }
//        let params = {
//          groupId: this.group1,
//          keyword: this.group2,
//          startTime: this.createTimeStart,
//          endTime: this.createTimeEnd.length ? `${this.createTimeEnd} 23:59:59` : '',
//          page: this.pageIndex,
//          size: this.pageSize
//        }
        this.pageIndex = 1
        this.getGroupList()
      },
      timeChage (e) {
        if (e) {
          this.timeTip = ''
        } else {
          this.timeTip = '开始时间 ~ 结束时间'
        }
      },
      changeDate (value) {
        let time = new Date(value)
        let year = time.getFullYear()
        let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
        let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
        return year + '-' + month + '-' + day
      },
      // 内容去html标签处理
      contentReturn (strhtml) {
        let value = strhtml.replace(/<[^>]+>/g, '')
        return value
      },
//      // 判断是否有删除blog权限
//      isCanDelete () {
//        return Util.hasRightByCode('FBB')
//      },
      // 分页
      pager (pageIndex) {
        this.pageIndex = pageIndex
        this.getGroupList(1)
      },
      listSizeChange (size) {
        this.pageSize = size
        this.pageIndex = 1
        this.getGroupList(1)
      },
      // checkbox
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 删除弹框
      delBlog (isBatch) {
        this.ifShield = true
        this.isBatch = isBatch
        let name = []
        this.blogIds = ''
        if (isBatch) { // 批量
          this.multipleSelection.forEach((item) => {
            this.blogIds += item.id + ','
            name.push(item.id)
          })
          this.blogIds = this.blogIds.substring(0, (this.blogIds.length - 1))
        }
//        } else {
//          this.singleRecord = {ids: item.postid}
//        }
//        let notice = '删除后该条博客将不可见，请谨慎操作'
//        if (name.length > 1) {
//          notice = '确定删除多条博客吗？'
//        }
//        Object.assign(this.oconfig, {visible: true, theme: 'red', notice: notice, message: '', flag: 0})
//        Object.assign(this.oconfig, {visible: true, theme: 'red', message: '', flag: 0})
      },
      // 删除 确定
      confirmOk () {
        if (this.isBatch) {
          /**
           * 删除多条博客
           * @param  {[type]} res [description]
           * @return {[type]}     [description]
           */
          MonitorAPI.delPost({ids: this.blogIds}).then(res => {
            this.getGroupList()
          })
//          this.getGroupList()
//        } else {
//          /**
//           * 删除单条博客
//           * @param  {[type]} res [description]
//           * @return {[type]}     [description]
//           */
//          MonitorAPI.delPost({ids: this.singleRecord.ids}).then(res => {
//            this.getGroupList()
//          })
//        }
        }
        this.ifShield = false
      },
      getGroupList () {
//        if (this.timerPicker && this.timerPicker[0]) {
//          this.createTimeStart = this.changeDate(this.timerPicker[0])
//          this.createTimeEnd = this.changeDate(this.timerPicker[1])
//        } else {
//          this.createTimeStart = ''
//          this.createTimeEnd = ''
//        }
        let pageObj = {
          groupId: this.group1,
          keyword: this.group2,
          startTime: this.createTimeStart,
          endTime: this.createTimeEnd.length ? `${this.createTimeEnd} 23:59:59` : '',
          page: this.pageIndex,
          size: this.pageSize
        }
//        let pageObj = {}
//        if (params) {
//          pageObj = params
//        } else {
//          let object = {
//            paging: true,
//            page: this.pageIndex,
//            size: this.pageSize
//          }
//          pageObj = object
//        }
        this.blogListWrap.records = []
        this.loading = true
        MonitorAPI.getGroupPostList(pageObj).then(res => {
          this.loading = false
          this.blogListWrap = res.data.data
          this.pageIndex = res.data.data.page
        })
      },
      groupList () {
        MonitorAPI.getGroupList().then(res => {
          if (!res.data.code) {
            this.groups = res.data.data
          }
        })
      }
    },
    watch: {
    },
    mounted () {
      this.getGroupList()
      this.groupList()
    }
  }
</script>

<style lang='less' rel="stylesheet/less">
  @import '../../../assets/style/variable';
  @import '../../../assets/style/page';
  @import '../../../assets/style/loading.css';
  @c-border1:#cbd6e3;
  @c-toptitle: #33475B;
   .el-select-dropdown__item{
    height: 45px;
   }
  .el-date-editor .el-picker-panel{
    min-width: 516px;
  }
  .blog-table-title{
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: off*/
    -webkit-box-orient: vertical;
    /* autoprefixer: on*/
    -ms-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .blog-table-content{
    /*position: relative;*/
    /*min-height: 65px;*/
    /*height:25px;*/
    /*overflow: hidden;*/
    /*text-overflow:ellipsis;*/
    /*white-space: nowrap;*/
    .post-group{
      display: inline-block;
       width:248px;
       /*overflow: hidden;*/
       /*text-overflow: ellipsis;*/
       /*display: -webkit-box;*/
       /*-webkit-box-orient: vertical;*/
       /*-webkit-line-clamp: 3;*/
       line-height: 20px;
       padding: 5px 0;
    }
    .imgTab{
      position: absolute;
      width: 68px;
      height: 52px;
      right: 0;
      top: 7px;
    }
    p{
      height:25px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    /*img{*/
      /*vertical-align: top;*/
      /*display: none;*/
    /*}*/
  }
  .record-opt{
    text-align: center;
  }
  .text-ellipsis(){
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .right-search2{
    margin: 12px 10px;
    vertical-align: middle;
    text-align: right;
    .el-button{
      // vertical-align: top;
      font-size: 13px;
      vertical-align:initial;
      a{
        color: @white;
      }
    }
    /*.el-button.addproduct{
      vertical-align: top;
    }
    *{
      vertical-align: middle;
    }*/
  }
  .no-data a{
    color: @white;
  }
  .group-container{
    .shieldDialog{
      position: fixed;
      top: -100px;
      bottom: 0;
      left: 0;
      right: 0;
      /*text-align: center;*/
      z-index: 200;
      .Sdialog{
        width:260px;
        height: 115px;
        padding: 40px 0 32px 40px;
        font-size: 14px;
        color: #33475B;
        background: #FFFFFF;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.20);
        border-radius: 4px;
        margin: 25% auto 0;
        /*vertical-align: middle;*/
        .warning{
          font-size: 22px;
          color: #FF3B6E;
          margin-right: 8px;
          vertical-align: middle;
        }
        .okall{
          display: inline-block;
          width:80px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
        }
        .ok{
          background: #FF3B6E;
          border-radius: 4px;
          color: #fff;
        }
      }
    }
    .box-header{
      padding:12px 16px 13px 386px;
      /*overflow:hidden;*/
      .group-select{
        width:168px;
      }
      .group-input{
        width:168px;
        margin-left:8px;
      }
      .group-search{
        width:90px;
        background: #FFFFFF;
        border: 1px solid #CBD6E3;
        border-radius: 4px;
        margin-left:18px;
      }
      .add-blog{
        /*float:right;*/
      }
    }
    .input-sel-search{
      width: 240px;
      margin:0 10px;
      border: 1px solid #cbd6e3;
      border-radius: 4px;
      .el-input__inner{
        height: 34px;
        &:focus{
          border: 1px solid #02AAAA;
        }
      }
      *{
        border-color: #CBD6E3;
      }
      .el-button{
        width:33px;
        border:none;
        padding:0 0;
      }
      .el-input{
        color: #333;
      }
      .el-input__inner{
        // margin-right: -3px;
        width: 209px;
        border:none;
      }
      .el-input-blog__append{
        border:none;
        border-left: 1px solid #cbd6e3;
      }
      .el-icon-search{
        margin-top: 5px;
      }
    }
    .el-table th{
      height:48px;
      line-height: 48px;
    }
    .el-table th, .el-table__header-wrapper thead div{
      background-color: #F5F8FA;
    }
    .el-tooltip__popper.is-dark{
      background-color: #415b77;
    }
    .el-table--enable-row-hover .el-table__body tr{
      td:last-child a{
        display: none;
      }
      &:hover td{
        background-color: #F5F8FA;
      }
      &:hover td:last-child a{
        display: inline-block;
      }
    }
    .el-table--border th, .el-table--border td{
      border-right: 0;
    }
    .el-table td{
      height: 72px;
    }
    .el-table .el-table_1_column_78{
      cursor: pointer;
    }
    .el-table{
      .el-table__body-wrapper{
        .el-table_1_column_2{
          cursor: pointer;
        }
      }
    }
  }
  .blog-tab{
    [class^="icon"]{
      margin-left: 5px;
      font-size: 16.2px;
      color: #B0C1D4;
      &:hover{
        color: @activeBlue;
      }
    }
    a{
      color: @link;
    }
    img{
      width: 63px;
      height: 63px;
    }
  }
  .chked-opt{
    label, a{
      margin: 0 20px 0 10px;
      color: @mainFontColor;
      font-weight: normal;
    }
    .butt{
      padding: 0 15px;
    }
    i{
      margin-right: 5px;
    }
  }
  .prod-box.list-box{
    position: relative;
    .opt-box{
      position: absolute;
      top: 0;
      left: 42px;
      width:calc(~'100% - 40px');
      border-bottom: 0;
      border-left: 0;
      z-index: 99;
    }
  }
  .blog-model{
    .confirm-btn{
      text-align: center;
    }
  }
  .el-select-blog{
    li{
      padding-left: 40px;
      color: @textColor;
    }
    li:nth-child(1){
      padding-left: 10px;
    }
  }
  .el-select-dropdown{
    .el-select-blog__title{
      height: 0;
    }
  }
  .el-select-dropdown__item.selected{
    background-color: #e6f6f6;
    color: @textColor;
    &.hover{
      background-color: #f4f8fb;
    }
  }
  /*.name-wrapper{
    width: 60px;
  }*/
  .name-wrapper{
    display: inline-block;
    max-width: 440px;
    span{
      display: inline-block;
    }
  }
  .name-wrapper:hover{
    a{
      color:#5488F9;
    }
  }
  .cate-pop{
    display: inline-block;
    max-width: 600px;
    padding: 10px;
    p{
      line-height: 20px;
      text-align: center;
    }
  }
  .el-table__empty-block{
    display: none;
  }
  .el-table {
    .sort-caret.ascending{
      border-bottom: 5px solid #B0C1D4
    }
    .sort-caret.descending{
      border-top: 5px solid #B0C1D4
    }
    .descending .sort-caret.descending{
      border-top-color: #02AAAA;
    }
    .ascending .sort-caret.ascending{
      border-bottom-color: #02AAAA;
    }
  }
  .el-tooltip__popper.is-none{
    display: none;
  }
</style>
