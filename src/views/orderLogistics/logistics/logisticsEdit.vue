<template>
  <div>
    <div class="logistic-edit-container">
     <div class="l-sub-title">
        运费模板:
        <input type="text" v-model="logisticsInfo.name" class="temp-input" placeholder="请输入运费模版名称">
      </div>
      <div class="from">发货地： china</div>
      <div class="table-temp" v-if="isLoaded">
        <el-table
          :data="vmTable"
          :show-header="false"
          style="width: 100%">
           <el-table-column
            prop="id"
            label="模板2">
             <template scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="receiveCountrys"
            width="600"
            label="运送到">
            <template scope="scope">
              <div class="countries-wrap">
                <show-more :text="scope.row.receiveCountrys" :len="260">
                </show-more>
              </div>
            </template>
          </el-table-column>
           <el-table-column
            prop="freightBear"
            label="模板">
            <template scope="scope">
              <span v-if="scope.row.freightBear === 1">卖家承担运费</span>
              <span v-if="scope.row.freightBear === 0">自定义运费</span>
            </template>
          </el-table-column>
         
           <el-table-column
            prop="id"
            label="操作">
            <template scope="scope">
              <span class="operate-btn" @click="setAddress(scope.$index)">编辑</span>
              <span class="operate-btn" @click="deleteFreight(scope.$index)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="add-temp" @click="addFreight">
        <span class="icon-font" style="color:black;">&#xe63e;</span>
        添加一个运费组合
      </div>
      <div class="add-tip">
        <span class="icon-font" style="color:#FFB822">&#xe629;</span>
      若买家不在我设定的运送国家或地区内，运费组合中不包含的国家/地区将设置为不发货。</div>
    </div>
    <div class="opt-btns">
      <div class="cancel-btn" @click="cancel">取消</div>
      <div class="save-btn" @click="save">保存</div>
    </div>
  </div>
</template>
<script>
import orderLogisticsAPI from '@/api/orderLogisticsAPI'
import showMore from '@/components/showMore'
import { mapGetters } from 'vuex'

export default {
  name: 'logisticsManagement',
  data () {
    return {
      tableData: [
      ],
      isLoaded: false,
      logisticsInfo: {}
    }
  },
  components: {
    showMore
  },
  mounted () {
    /**
     * 查询物流 模板信息
     * @param  {[type]} ).then((res [description]
     * @return {[type]}             [description]
     */
    orderLogisticsAPI.getLogisticsDetail({id: this.$route.params.lid}).then((res) => {
      this.isLoaded = true
      /**
       * 向vuex中 存储物流模板信息
       */
      this.$store.commit('SET_LOGISTICS_INFO', res.data.data)
      /**
       * 从vuex getters里取数据
       * 因为 模板编辑后 点击保存按钮 是把数据带回这个页面 然后点击保存按钮再进行保存操作的
       * @type {[type]}
       */
      this.tableData = this.logisticsInfoWrap.logistFreightDetails
      this.logisticsInfo = this.logisticsInfoWrap.logistFreight
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
  computed: {
    /**
     * vuex里取值
     * @type {String}
     */
    ...mapGetters({
      logisticsInfoWrap: 'logisticsInfo'
    }),
    /**
     * 过滤掉 deleteTag 是1的 运费组合
     * @return {[type]} [description]
     */
    vmTable: function () {
      let tableNoDelete = []
      for (let item of this.tableData) {
        if (!item.deleteTag) {
          tableNoDelete.push(item)
        }
      }
      return tableNoDelete
    }
  },
  methods: {
    /**
     * 取消
     * @return {[type]} [description]
     */
    cancel () {
      this.$router.push({ path: '/logisticsManagement' })
    },
    /**
     * 保存
     * @return {[type]} [description]
     */
    save () {
      // id  是 int 模板Id
      // name  是 string  模板名称
      // sendArea  是 string  发送地区
      // priceUnit 是 string  币种
      // logistFreightDetail[0].id 是 int 模板详情ID
      // logistFreightDetail[0].freightBear  是 int 运费承担方式(0买家承担,1卖家承担)
      // logistFreightDetail[0].receiveCountrys  是 string  收货国家列表(Canada:加拿大;Mexico:墨西哥;)
      // logistFreightDetail[0].settingMode  是 string  设置方式(0表示按件,1表示按重)
      // logistFreightDetail[0].firstNum 是 int 首件/首重数量
      // logistFreightDetail[0].firstAmount  是 int 首件/首重费用
      // logistFreightDetail[0].nextNum  是 int 续件/续重数量
      // logistFreightDetail[0].nextAmount 是 int 续件/续重费用
      // logistFreightDetail[0].deleteTag  是 int 0 未删除 1 删除
      let postObj = {
        id: this.logisticsInfo.id,
        name: this.logisticsInfo.name,
        sendArea: 'China',
        priceUnit: 'USD'
      }
      for (let itemIndex in this.tableData) {
        postObj['logistFreightDetail[' + itemIndex + '].id'] = this.tableData[itemIndex].id
        postObj['logistFreightDetail[' + itemIndex + '].freightBear'] = this.tableData[itemIndex].freightBear
        postObj['logistFreightDetail[' + itemIndex + '].receiveCountrys'] = this.tableData[itemIndex].receiveCountrys
        postObj['logistFreightDetail[' + itemIndex + '].settingMode'] = this.tableData[itemIndex].settingMode
        postObj['logistFreightDetail[' + itemIndex + '].firstNum'] = this.tableData[itemIndex].firstNum
        postObj['logistFreightDetail[' + itemIndex + '].firstAmount'] = this.tableData[itemIndex].firstAmount / 100
        postObj['logistFreightDetail[' + itemIndex + '].nextNum'] = this.tableData[itemIndex].nextNum
        postObj['logistFreightDetail[' + itemIndex + '].nextAmount'] = this.tableData[itemIndex].nextAmount / 100
        postObj['logistFreightDetail[' + itemIndex + '].deleteTag'] = this.tableData[itemIndex].deleteTag
      }
      /**
       * 保存运费模板信息
       * @param  {[type]} ).then((res [description]
       * @return {[type]}             [description]
       */
      orderLogisticsAPI.updateFreight(postObj).then((res) => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        })
        this.$router.push({ path: '/logisticsManagement' })
      })
    },
    /**
     * 编辑地址
     * @param {[type]} index [description]
     */
    setAddress (index) {
      this.$store.commit('SET_FROM_PAGE', 'edit')
      this.$store.commit('SET_EDIT_INDEX', index)
      this.$router.push({ path: '/logisticsSetAddress' })
    },
    /**
     * 增加一个运费组合
     */
    addFreight () {
      this.$store.commit('SET_FROM_PAGE', 'add')
      this.$router.push({ path: '/logisticsSetAddress' })
    },
    /**
     * 删除运费
     * @return {[type]} [description]
     */
    deleteFreight (index) {
      this.$store.commit('DELETE_TEMP_I', index)
    }
  }
}
</script>
<style lang='less'>
@import '../../../assets/style/variable.less';
  .opt-btns{
    text-align: center;
  }
  .logistic-edit-container{
    width:100%;
    min-height: 600px;
    background: white;
    box-shadow: 0px 0px 6px rgba(0,0,0,.06);
    border-radius: 6px;
    overflow: hidden;
    .l-sub-title{
      color:@font-title-color;
      font-size: 14px;
      margin:24px 15px;
    }
    .temp-input{
      height: 34px;
      width:240px;
      border-radius: 4px;
      border:1px solid #CBD6E3;
      padding-left:10px;
    }
    .from{
      color:@font-title-color;
      font-size: 14px;
      margin:30px;
    }
    .table-temp{
      margin:0 24px;
      .el-table__header-wrapper thead div, .el-table th{
        background: #F5F8FA;
      }
      .el-table td{
        vertical-align: top;
      }
      .el-table .cell {
        padding:16px;
        color:#33475B;
      }
      .operate-btn{
        color:#5488F9;
        font-size: 13px;
        margin-left:16px;
        cursor: pointer;
      }
    }
    .add-temp{
      color:#5488F9;
      font-size: 14px;
      text-align: center;
      border: 1px solid #DFE3EB;
      padding:31px 0;
      margin:0 24px;
      cursor: pointer;
      border-radius: 4px;
    }
    .add-tip{
      color:#B0C1D4;
      font-size: 13px;
      margin:8px 24px;
    }
  }
</style>
