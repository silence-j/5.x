<template>
  <div class="logistic-container">
   <div class="l-title">
     物流管理
    </div>
    <div class="table-temp" v-if="isLoaded">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="模板名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sendArea"
          label="发货地"
          width="160">
        </el-table-column>
        <el-table-column
          prop="country"
          width="640"
          label="运送到">
          <template scope="scope">
              <div class="countries-wrap">
                <show-more :text="scope.row.country" :len="260">
                </show-more>
              </div>
            </template>
        </el-table-column>
         <el-table-column
          prop="id"
          width="220"
          label="操作">
          <template scope="scope">
            <span class="operate-btn" @click="edit(scope.row.id)">修改</span>
            <span class="operate-btn" @click="deleteTmpl(scope.row.id, scope.$index)">删除</span>
            <span class="operate-btn l-default" v-if="scope.row.defaultTag">默认</span>
            <span class="operate-btn l-set-default" v-if="!scope.row.defaultTag" @click="defaultTmpl(scope.row.id, scope.$index)">设置默认</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="add-temp" @click="newTemplate">
        <span class="icon-font" style="color:#CBD6E3;">&#xe682;</span>
        新增运费模板
      </div>
    </div>
    <div class="loading loading-circle" v-else></div>
  </div>
</template>
<script>
import orderLogisticsAPI from '@/api/orderLogisticsAPI'
import showMore from '@/components/showMore'

export default {
  name: 'logisticsManagement',
  data () {
    return {
      tableData: [
      ],
      isLoaded: false
    }
  },
  components: {
    showMore
  },
  mounted () {
    /**
     * [获取物流列表]
     * @param  {[type]} ).then((res [description]
     * @return {[type]}             [description]
     */
    orderLogisticsAPI.getLogisticsTmpl().then((res) => {
      this.isLoaded = true
      this.tableData = res.data.data
    })
    /**
     * 预先加载 洲 信息，放入vuex
     * @param  {[type]} ).then((res [description]
     * @return {[type]}             [description]
     */
    orderLogisticsAPI.getZhouAndCountry().then((res) => {
      this.$store.commit('CACHE_ZHOUS', res.data.data)
    })
  },
  methods: {
    /**
     * 变价
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    edit (id) {
      this.$router.push({ name: '编辑物流模板' + process.env.ROUTE_NAME_FOOT, params: {lid: id} })
    },
    /**
     * 新增运费模板
     * @return {[type]} [description]
     */
    newTemplate () {
      /**
       * 表明 我是从物流模板过来的
       */
      this.$store.commit('SET_FROM_PAGE', 'new', 0)
      this.$store.commit('SET_LOGISTICS_INFO', {})
      this.$router.push({ path: '/logisticsSetAddress' })
    },
    /**
     * 删除
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    deleteTmpl (id, index) {
      this.$confirm('你确定要删除该模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orderLogisticsAPI.deleteTmpl({id: id}).then((res) => {
          if (res.data.code === 0) {
            this.tableData.splice(index, 1)
            this.$message({
              message: '删除模板成功!',
              type: 'success'
            })
          }
        })
      }).catch(() => {
      })
    },
    /**
     * 默认模板
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    defaultTmpl (id, index) {
      orderLogisticsAPI.setDefaultTmpl({id: id}).then((res) => {
        if (res.data.code === 0) {
          for (let item of this.tableData) {
            item.defaultTag = 0
          }
          this.tableData[index].defaultTag = 1
          this.$message({
            message: '设置默认模板成功!',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style lang='less'>
@import '../../../assets/style/variable.less';
  .logistic-container{
    // width:100%;
    // min-height: 600px;
    // background: white;
    // box-shadow: 0px 0px 8px rgba(0,0,0,.08);
    // border-radius: 4px;
    // overflow: hidden;
    min-height: calc(~'100vh - 210px');
    .l-title{
      color:@font-title-color;
      font-size: 16px;
      margin:23px 15px;
      font-weight: bold;
    }
    .table-temp{
      .el-table__empty-block{
        height: 100px;
      }
      .el-table__header-wrapper thead div, .el-table{
        border-left:none;
        border-right:none;
      }
      .el-table__header-wrapper thead div, .el-table td{
        vertical-align: top;
      }
      .el-table__header-wrapper thead div, .el-table th{
        background: #F5F8FA;
        height: 48px;
      }
      .el-table .cell {
        padding:13px;
      }
      .operate-btn{
        color:#5488F9;
        font-size: 13px;
        margin-left:16px;
        cursor: pointer;
        &:first-child{
          margin-left:0px;
        }
        &:hover{
          text-decoration: underline;
        }
      }
      .l-set-default{
        color:#33475B;
      }
      .l-default{
        color:#7C98B6;
      }
    }
    .add-temp{
      color:@font-title-color;
      font-size: 14px;
      text-align: center;
      border: 1px dashed #CBD6E3;
      padding:30px 0;
      margin:24px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
</style>
