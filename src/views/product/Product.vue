<template>
  <div class="logistic-container prod-container">
    <div class="right-search2">
      <el-select v-model="form.productGroupId" placeholder="请选择" @change="searchForm">
        <el-option label="全部分组" value=""></el-option>
        <el-option-group
          v-for="group in groupList"
          :key="group.id">
          <el-option :label="group.name" :value="group.id">{{group.name}}
          </el-option>
          <el-option
            v-for="item in group.subGroup"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-option-group>
      </el-select>
      <!-- <div class="search-prod">
        <el-input placeholder="请输入产品名称" v-model="form.productName"></el-input>
        <a class="icon-search" href="javascript:;" @click="searchForm"></a>
      </div> -->
      <el-input
        placeholder="请输入产品名称"
        v-model="form.productName"
        class="input-sel-search">
        <el-button slot="append" icon="search" @click="searchForm"></el-button>
      </el-input>
      <router-link to="category/false/false" v-if="addBtnRight()"><el-button type="primary" class="addproduct">新增产品</el-button></router-link>
    </div>
    <div class="list-box prod-box">
      <div class="el-table opt-box" v-if="multipleSelection.length">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" >
          <thead>
            <tr>
              <!-- <th colspan="1" rowspan="1" class="el-table_1_column_1 el-table-column--selection is-leaf" width="55">
                <div class="cell">
                  <el-checkbox v-model="selectAll" @change="toggleSelection(products.records)"></el-checkbox>
                </div>
              </th> -->
              <th colspan="1" rowspan="1" class="el-table_1_column_1 el-table-column--selection is-leaf">
                <div class="cell chked-opt">
                  <label>已选中 {{multipleSelection.length}} 项</label>
                  <span class="icon-buttons">
                    <a href="javascript:;" @click="showGroup(true)" class="icon-button"><i class="icon-groupsort"></i>更改分组</a>
                    <a v-if="deleteBtnRight()" href="javascript:;"  @click="delProd(true)" class="icon-button"><i class="icon-trash"></i>删除</a>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <template>
        <el-table
          :data="products.records"
          border
          tooltip-effect="none"
          ref="multipleTable"
          style="width: 100%"
          class="product-tab"
          @selection-change="handleSelectionChange">
          <!-- :default-sort = "{prop: 'productName', order: 'descending'}" -->
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="productFirstPic"
            label="图片"
            width="100">
            <template scope="scope">
              <img class="" :src="scope.row.productFirstPicWhole+'?x-oss-process=image/resize,h_50,w_50'" alt="">
              }
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            width="460"
            sortable>
            <template scope="scope">
              <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                <p>{{scope.row.productName}}</p>
                <span slot="reference" class="name-wrapper">
                  <a :href="homepage + '/detail?productId='+scope.row.id+'&shopId='+scope.row.shopId" target="_blank">{{scope.row.productName}}</a>
                </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="所属分组"
            prop="cateName"
            sortable
            width="191">
            <template scope="scope">
              <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                <p>{{ scope.row.cateAllName }}</p>
                <span slot="reference" class="name-wrapper">
                  {{ scope.row.cateName }}
                </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="priceMin"
            sortable
            width="192"
            label="价格">
            <template scope="scope">
              <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                <p v-if="scope.row.priceMin !== scope.row.priceMax">
                  {{scope.row.priceUnit || 'USD'}} {{scope.row.priceMin|fenToYuan}}~{{scope.row.priceMax|fenToYuan}}
                </p>
                <p v-else>
                  {{scope.row.priceUnit}} {{scope.row.priceMin|fenToYuan}}
                </p>
                <span slot="reference" class="name-wrapper" v-if="scope.row.priceMin !== scope.row.priceMax">
                    {{scope.row.priceUnit || 'USD'}} {{scope.row.priceMin|fenToYuan}}~{{scope.row.priceMax|fenToYuan}}
                </span>
                <span slot="reference" class="name-wrapper" v-else>
                    {{scope.row.priceUnit || 'USD'}} {{scope.row.priceMin|fenToYuan}}
                </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            class="record-opt"
            width="200">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <a v-if="editRight()" @click="toEdit(scope.row.id, scope.row.productStatus)" href="javascript:;"><i class="icon-pen"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复制" placement="top-start" v-if="addBtnRight()">
                <a href="javascript:;" @click="copy(scope.row.id)"><i class="icon-copy"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="更改分组" placement="top-start">
                <a href="javascript:;" @click="showGroup(false, scope.row.id)"><i class="icon-groupsort"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <a href="javascript:;" v-if="deleteBtnRight()" @click="delProd(false, scope.row.id, scope.row.productName)"><i class="icon-trash"></i></a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="nodata" v-if="products.records &&!products.records.length">
        <img src="../../assets/img/empty-contact.png" alt="">        
        <div class="tips">暂无数据，请先新增产品</div>
      </div>
      <div v-if="loading" class="loading loading-circle"></div>
      <el-pagination v-if="products.records && products.records.length && products.totalCount > 10"
      layout="prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="listSizeChange"
      :page-size="pageSize"
      :total="products.totalCount"
      :current-Page="pageIndex"
       @current-change="pager"></el-pagination>
    </div>
    <el-dialog title="更改分组" v-model="groupModel" class="group-model">
      <el-form>
        <el-form-item label="请选择新的分组">
          <el-select v-model="newgroup">
            <el-option label="All Products" value=""></el-option>
            <el-option-group
              v-for="group in groupList"
              :key="group.id">
              <el-option :label="group.name" :value="group.id">{{group.name}}
              </el-option>
              <el-option
                v-for="item in group.subGroup"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否将产品置顶">
          <el-checkbox v-model="needFirst"></el-checkbox>
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button type="primary" class="confirm" @click="groupOk">确定</el-button>
        <el-button class="close"  @click="groupModel = false">取消</el-button>
      </div>
    </el-dialog>
    <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox>
  </div>
</template>
<script>

// import List from './cpnts/List.vue'
import { mapGetters } from 'vuex'
import proApi from '../../api/productApi'
import DialogBox from '../../components/box/dialogBox'
import Util from '@/common/Util'
import draggable from 'vuedraggable'
export default {
  name: 'Product',
  props: {
  },
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      search: {},
      groupList: [],
      // selectAll: false,
      needFirst: false,
      groupModel: false,
      newgroup: '',
      form: {
        productGroupId: '',
        productName: '',
        productStatus: -1
      },
      productIds: [],
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
      singleRecord: {
        id: ''
      },
      homepage: process.env.HOMEPAGE
    }
  },
  components: {
    DialogBox,
    draggable
  },
  methods: {
    /**
     * 增加按钮权限
     */
    addBtnRight () {
      return Util.hasRightByCode('AEB')
    },
    /**
     * 删除按钮权限
     */
    deleteBtnRight () {
      return Util.hasRightByCode('AEC')
    },
    /**
     * 查看权限
     */
    editRight () {
      return Util.hasRightByCode('AEA')
    },
    // 分页
    pager (pageIndex) {
      this.pageIndex = pageIndex
      Object.assign(this.form, {page: this.pageIndex})
      this.$store.dispatch('getProductList', this.form)
    },
    listSizeChange (size) {
      this.pageSize = size
      this.pageIndex = 1
      Object.assign(this.form, {size: this.pageSize})
      this.$store.dispatch('getProductList', this.form)
    },
    toEdit (id, productStatus) {
      this.$router.push({path: '/ProductModify/' + id + '/' + productStatus + '/1/false'})
    },
    // checkbox
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    searchForm () {
      this.form.page = 1
      this.$store.dispatch('getProductList', this.form)
    },
    // 分组及排序
    showGroup (isBatch, id) {
      this.isBatch = isBatch
      this.productIds = []
      if (isBatch) {
        this.multipleSelection.forEach((item) => {
          this.productIds.push(item.id)
        })
      } else {
        this.singleRecord = {id: id}
      }
      this.groupModel = true
    },
    // 分组及排序 Ok
    groupOk () {
      // if (!this.newgroup) {
      //   this.$message.error('请选择新分组')
      //   return
      // }
      let ids = this.isBatch ? this.productIds.join(',') : this.singleRecord.id
      let isTop = this.needFirst ? 1 : 0
      let params = {groupId: this.newgroup, productIds: ids, needFirst: isTop}
      proApi.topAndGroup(params).then(res => {
        if (!res.data.code) {
          this.groupModel = false
          this.$message({
            type: 'success',
            message: '分组调整成功'
          })
          this.$store.dispatch('getProductList', {page: 1})
        }
      })
    },
    // 删除弹框
    delProd (isBatch, id, pname) {
      this.isBatch = isBatch
      let name = []
      this.productIds = []
      if (isBatch) { // 批量
        this.multipleSelection.forEach((item) => {
          this.productIds.push(item.id)
          name.push(item.productName)
        })
        pname = name.join(',')
      } else {
        this.singleRecord = {id: id}
      }
      let notice = '确定删除以下产品:'
      if (name.length > 1) {
        notice = '确定删除多个商品吗？'
        pname = null
      }
      Object.assign(this.oconfig, {visible: true, theme: 'red', notice: notice, message: pname, flag: 0})
    },
    // 删除 确定
    confirmOk () {
      if (this.oconfig.flag) { // 复制
        proApi.prodCopy({productId: this.singleRecord.id}).then(res => {
          if (!res.data.code) {
            this.$message.success('复制成功')
            this.$store.dispatch('getProductList', {page: 1})
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        let ids = this.isBatch ? this.productIds.join(',') : this.singleRecord.id
        proApi.delProdBatch({productIds: ids}).then(res => {
          if (!res.data.code) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$store.dispatch('getProductList', {page: 1})
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    copy (id) {
      this.singleRecord = {id: id}
      Object.assign(this.oconfig, {visible: true, theme: 'red', notice: '确定要复制吗', flag: 1, message: ''})
    }
  },
  watch: {
  },
  computed: mapGetters({
    products: 'productList',
    loading: 'loading'
  }),
  created () {
    this.$store.commit('PROD_LOAD', {loading: true})
    this.$store.dispatch('getProductList', {page: this.pageIndex, productStatus: -1})
    proApi.getGroup().then(res => {
      this.groupList = res.data.data
    })
  }
}
</script>
<style lang='less' rel="stylesheet/less">
@import '../../assets/style/variable';
@import '../../assets/style/page';
@import '../../assets/style/loading.css';
@c-border1:#cbd6e3;
@c-toptitle: #33475B;
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
  .el-button.addproduct{
    vertical-align: top;
  }
  *{
    vertical-align: middle;
  }
}
.prod-container{
  min-height: calc(~'100vh - 207px');
  padding: 0;
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
  .prod-box{
    min-height: calc(~'100vh - 283px');    
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
    .el-input-group__append{
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
    padding-top: 20px;
    height: 100px;
    vertical-align: top;
  }
  // .scope-maxlength{
  //   max-width: 191px;
  //   display: inline-block;
  // }
  .el-table__body .cell{
    width: 80%;
    .text-ellipsis()
  }
  // .el-table__body .name-wrapper{
  //   width: 80%;
  //   .text-ellipsis()
  // }
  .el-table th:nth-child(3){
    text-align: center;
  }
}
.product-tab{
  [class^="icon"]{
    margin-left: 10px;
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
.prod-box.list-box{
  position: relative;
  .opt-box{
    position: absolute;
    top: 0;
    left: 42px;
    border-bottom: 0;
    border-left: 0;
    z-index: 99;
  }
  .chked-opt{
    label, a{
      padding: 0 15px 0 15px;
      margin: 0;
      color: @mainFontColor;
      font-weight: normal;
    }
    i{
      margin-right: 5px;
    }
  }
}
.group-model{
  .confirm-btn{
    text-align: center;
  }
}
.el-select-group{
  li{
    padding-left: 40px;
    color: @textColor;
  }
  li:nth-child(1){
    padding-left: 10px;
  }
}
.el-select-dropdown{
  .el-select-group__title{
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
  .caret-wrapper{
    height: 10px;
  }
  .sort-caret.ascending{
    top: -1px;
    border-bottom: 5px solid #B0C1D4
  }
  .sort-caret.descending{
    bottom: -1px;
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
