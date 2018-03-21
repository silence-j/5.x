<template>
  <div class="logistic-container blog-container" style="">
    <div class="box-header">
      <el-button class="add-blog" type="primary" @click="addBlog" style="width:110px;height:35px;" v-if="isCanAddBlog()">新增Blog</el-button>
    </div>
    <div class="list-box prod-box">
      <div class="el-table opt-box" v-if="multipleSelection.length">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" >
          <thead>
            <tr>
              <th colspan="1" rowspan="1" class="el-table_1_column_1 el-table-column--selection is-leaf">
                <div class="cell chked-opt">
                  <label>已选中 {{multipleSelection.length}} 项</label>
                  <a  href="javascript:;"  @click="delBlog(true)" class="icon-buttons butt" v-if="isCanDelete()">删除</a>
                </div>
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
            label="标题"
            width="166">
            <template scope="scope">
              <div class="blog-table-title" :title="scope.row.blogTitle" v-html="scope.row.blogTitle" @click="linkBlog(scope.row)">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="详情介绍"
            width="226"
            >
            <template scope="scope">
              <div class="blog-table-content" v-html="contentReturn(scope.row.blogContents)">
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="PV"
            prop="blogPV"

            width="64">
          </el-table-column>
          <el-table-column
            prop="blogUV"
            width="62"
            label="UV">
          </el-table-column>
          <el-table-column
            prop="blogMsgProduct"
            width="80"
            label="询盘数">
          </el-table-column>
          <el-table-column
            prop="blogAuthor"
            width="128"
            label="作者">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="160"
            label="发布时间">
            <template scope="scope">
              {{scope.row.publishTime|time-formater-no-second}}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            width="160"
            label="更新时间">
             <template scope="scope">
              {{scope.row.updateTime|time-formater-no-second}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            class="record-opt"
            width="100">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <!-- <router-link :to="'/editBlog/' + scope.row.id"> -->
                  <a href="javascript:;">
                    <i class="icon-edit" @click="editBlog(scope.row.id)"></i>
                  </a>


                  <!-- </router-link> -->
              </el-tooltip>
               <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="isCanDelete()">
                <a href="javascript:;"  @click="delBlog(false, scope.row.id)"><i class="icon-trash"></i></a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="nodata" v-if="!loading && blogListWrap.records && !blogListWrap.records.length">
        <!-- <div class="img"></div> -->
        <img src="../../assets/img/empty-contact.png" alt="">
        <div class="tips">暂无数据，请先新增Blog</div>
      </div>
      <div v-if="loading" class="loading loading-circle"></div>
      <el-pagination
      :layout="layout"
      :current-page="blogListWrap.page"
      :page-size="blogListWrap.pageSize"
      :total="blogListWrap.totalCount"
      @current-change="pager"
      v-if="!loading && blogListWrap.records && blogListWrap.records.length && blogListWrap.totalCount > 10">
      </el-pagination>
    </div>
    <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox>
  </div>
</template>
<script>

import BlogAPI from '@/api/blogAPI'
import DialogBox from '../../components/box/dialogBox'
import Util from '@/common/Util'
export default {
  name: 'Blog',
  props: {
  },
  data () {
    return {
      loading: false,
      multipleSelection: [],
      blogListWrap: {
        records: [],
        totalCount: 49,
        page: 1,
        pageSize: 10,
        pageSizeOn: false
      },
      mconfig: {},
      blogModel: false,
      blogIds: '',
      oconfig: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        flag: 0,
        popovercls: 'confirm-pop'
      },
      isBatch: false,
      homepage: process.env.HOMEPAGE
    }
  },
  components: {DialogBox},
  methods: {
    // 内容去html标签处理
    contentReturn (strhtml) {
      let value = strhtml.replace(/<[^>]+>/g, '')
      return value
    },
    linkBlog (row) {
      let id = row.id
      let shopid = window.localStorage.shopId
      window.open(process.env.HOMEPAGE + '/blog/' + shopid + '/' + id)
    },
    // 判断是否有添加blog权限
    isCanAddBlog () {
      return Util.hasRightByCode('FBA')
    },
    // 判断是否有删除blog权限
    isCanDelete () {
      return Util.hasRightByCode('FBB')
    },
    addBlog () {
      this.$router.push('/addBlog')
    },
    // 分页
    pager (page) {
      this.blogListWrap.page = page
      this.getBlogList()
    },
    // listSizeChange (size) {
    //   this.blogListWrap.pageSize = size
    //   this.blogListWrap.page = 1
    //   this.getBlogList()
    // },
    // checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 编辑博客
    editBlog (id) {
      this.$store.commit('FROMAUTHOR', false)
      this.$router.push('/editBlog/' + id)
    },
    // 删除弹框
    delBlog (isBatch, id) {
      this.isBatch = isBatch
      let name = []
      this.blogIds = ''
      if (isBatch) { // 批量
        this.multipleSelection.forEach((item) => {
          this.blogIds += item.id + ','
          name.push(item.id)
        })
        this.blogIds = this.blogIds.substring(0, (this.blogIds.length - 1))
      } else {
        this.singleRecord = {id: id}
      }
      let notice = '确定删除该条博客吗'
      if (name.length > 1) {
        notice = '确定删除' + name.length + '条博客吗？'
      }
      let message = '删除后将不可见，请谨慎操作'
      Object.assign(this.oconfig, {visible: true, theme: 'red', notice: notice, message: message, flag: 0, showclosebtn: true})
    },
    // 删除 确定
    confirmOk () {
      if (this.isBatch) {
         /**
         * 删除单条博客
         * @param  {[type]} res [description]
         * @return {[type]}     [description]
         */
        BlogAPI.batchDeleteBlog({blogIds: this.blogIds}).then(res => {
          this.getBlogList()
        })
        this.getBlogList()
      } else {
        /**
         * 删除单条博客
         * @param  {[type]} res [description]
         * @return {[type]}     [description]
         */
        BlogAPI.deleteBlog({id: this.singleRecord.id}).then(res => {
          this.getBlogList()
        })
      }
    },
    getBlogList () {
      let pageObj = {
        paging: true,
        page: this.blogListWrap.page,
        size: this.blogListWrap.pageSize,
        shopId: window.localStorage.shopId
      }
      this.blogListWrap.records = []
      this.loading = true
      BlogAPI.getBlogList(pageObj).then(res => {
        if (res.data.code === 0) {
          this.loading = false
          this.blogListWrap = res.data.data
          this.blogListWrap.page = res.data.data.page
          this.blogListWrap.totalCount = res.data.data.totalCount
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    }
  },
  watch: {
  },
  mounted () {
    this.getBlogList()
  }
}
</script>

<style lang='less' rel="stylesheet/less">
@import '../../assets/style/variable';
@import '../../assets/style/page';
@import '../../assets/style/loading.css';
@c-border1:#cbd6e3;
@c-toptitle: #33475B;
.logistic-container{
  margin-top: 16px;
}
.blog-table-title{
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
  height:25px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  p{
    height:25px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  img{
    vertical-align: top;
    display: none;
  }
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
.blog-container{
  margin-bottom: 16px;
  position: relative;
  overflow: unset;
  min-height: calc(~'100vh - 207px');
  .box-header{
    padding:12px 16px 13px 16px;
    overflow:hidden;
    .add-blog{
      float:right;
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
    height: 60px;
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
    color: @textColor;
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
    font-size: 12px;
  }
  i{
    margin-right: 5px;
  }
}
.prod-box.list-box{
  position: initial;
  .nodata{
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    width: 180px;
    box-sizing: border-box;
    background-color: #fff;
    text-align: center;
    .tips{
      color: #4F6D95;      
      padding-top: 15px;
      font-size: 14px;
    }
  }
  .opt-box{
    position: absolute;
    top: 60px;
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
