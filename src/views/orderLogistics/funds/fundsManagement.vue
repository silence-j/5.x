<template>
  <div v-if="isLoaded">
    <!--未绑定start-->
    <div class="no-data margintop16 n-bindAccount" v-if=" result=='' || result==null || result=='null'">
      <div class="no-contentPay">
        <p class="center display-img"><img src="../../../assets/img/orderLogistics/no_bindaccount.png" alt=""></p>
        <p class="center">
          <router-link :to="{ path: '/bindAccount'}">
            <el-button type="primary" class="sure-btn" style="margin-top:0px;padding: 12px 27px;">收款账户设置</el-button>
          </router-link>
        </p>
        <p class="center margintop16">
          <span>没有paypal账号,
            <a class="btn_once_free" style="color: #5488F9;" href="https://www.paypal.com/webapps/merchantboarding/webflow/externalpartnerflow?&amp;partnerId=8ZM22TTLAR2KW&amp;productIntentID=addipmt&amp;returnToPartnerUrl=http://www.loonxi.com&amp;partnerLogoUrl=&amp;permissionNeeded=EXPRESS_CHECKOUT&amp;displayMode=regular&amp;integrationType=T&amp;showPermissions=TRUE&amp;countryCode=&amp;merchantId=" target="_blank">立即免费获取</a>
          </span>
        </p>
      </div>
    </div>
    <!--未绑定end-->
    <!--已绑定start-->
    <div class="have-content margintop16" v-else>
        <div class="display-module">
            <div class="statistics">
              <p class="desc">累计收入(美元)</p>
              <p class="money ft-green" v-if="statisticsdata.totalAmountYuan != '0.00'">{{ statisticsdata.totalAmountYuan }}</p>
              <p class="money ft-green" v-else>暂无收入</p>
            </div>
            <div class="statistics">
              <p class="desc">昨日收入(美元)</p>
              <p class="money ft-green" v-if="statisticsdata.lastdayTotalAmountYuan != '0.00'">{{ statisticsdata.lastdayTotalAmountYuan }}</p>
              <p class="money ft-green" v-else>暂无收入</p>
            </div>
            <div class="statistics">
              <p class="desc">今日收入(美元)</p>
              <p class="money ft-red" v-if="statisticsdata.todayTotalAmountYuan != '0.00'">{{ statisticsdata.todayTotalAmountYuan }}</p>
              <p class="money ft-red" v-else>暂无收入</p>
            </div>
          <router-link :to="{ path: '/bindAccount'}">
            <el-button type="default" class="right-btn bg-blue">收款账户设置</el-button>
          </router-link>
        </div>
        <div class="search-module">
          <div class="title">交易记录</div>
          <div class="right-module" style="margin:0px">
          <!--搜索模块 start-->
          <el-input
            placeholder="请输入搜索内容"
            v-model="keyword"
            class="input-sel-search funds-search" style="width: 100px;">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
              <el-option value="0" label="订单号"></el-option>
              <el-option value="1" label="账号"></el-option>
            </el-select>
            <hr class="input-split" slot="prepend" >
            <el-button slot="append" icon="search" @click="search(keyword)"></el-button>
          </el-input>
          <!--搜索模块 end-->
          <div class="vertical-line"></div>
          <!--日期选择 start-->
          <div class="select-time">
            <el-date-picker
              v-model="period"
              type="daterange"
              align="center"
              @change="timeChage"
              :placeholder="timeTip"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <!--<span class="export" @click="exportEcel()"><i class="icon-exprot"></i></span>-->
          <!--日期选择 end-->
          </div>
        </div>
        <div class="data-list-seven" v-if="dataIsLoad">
          <!--表数据模块start-->
          <template>
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                label="创建时间"
                width="212">
                <template scope="scope">
                  <el-icon name="createTime"></el-icon>
                  <span>{{ scope.row.createTime | time-formater-has-hour}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="订单号"
                width="199">
                <template scope="scope">
                  <el-icon name="orderCode"></el-icon>
                  <span>{{ scope.row.orderCode }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="交易类型"
                width="132">
                <template scope="scope">
                  <el-icon name="type"></el-icon>
                  <span>{{ scope.row.type }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="来源"
                width="146">
                <template scope="scope">
                  <el-icon name="systemSource"></el-icon>
                  <span>{{ scope.row.systemSource }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="交易对象"
                width="171">
                <template scope="scope">
                  <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                    <p>{{ scope.row.otherAccount }}</p>
                    <span slot="reference" class="inblock-overhide">
                      {{ scope.row.otherAccount }}
                    </span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="账户"
                width="207">
                <template scope="scope">
                  <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                    <p>{{ scope.row.ownAccount }}</p>
                    <span slot="reference" class="inblock-overhide">
                      {{ scope.row.ownAccount }}
                    </span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="交易金额"
                width="132">
                <template scope="scope">
                  <el-icon name="amount"></el-icon>
                  <span>+US ${{ scope.row.amount }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!--表数据模块end-->
          <!--分页模块start-->
          <div class="paging-column" v-if="tableData.length > 0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="prev, pager, next, sizes, jumper"
              :total="transactionList.totalCount">
            </el-pagination>
          </div>
          <!--分页模块end-->
        </div>
    </div>
  </div>
</template>
<script>
import orderLogisticsAPI from '@/api/orderLogisticsAPI'
export default {
  name: 'fundsManagement',
  data () {
    return {
      timeTip: '开始时间 ~ 结束时间',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      statisticsdata: {},
      result: {},
      period: '',
      currentPage: 1,       // 当前页
      pageSize: 10,       // 每页显示条数
      isLoaded: false, // 是否已发送请求
      isNoData: false,
      dataIsLoad: false,
      keyword: '', // 关键字
      transactionList: '', // 交易记录列表
      tableData: [],   // 列表数据
      selectType: '0'    // 选中筛选类型
    }
  },
  components: {
    orderLogisticsAPI
  },
  watch: {
    period: function () {
      this.search(this.keyword)
    }
  },
  methods: {
    timeChage (e) {
      console.log(e)
      if (e) {
        this.timeTip = ''
      } else {
        this.timeTip = '开始时间 ~ 结束时间'
      }
    },
    // 分页每页条数改变回调方法
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.selectTransactionList({page: this.currentPage, size: val})
    },
    // 分页页码改变回调方法
    handleCurrentChange (val) {
      this.currentPage = val
      this.selectTransactionList({page: val, size: this.pageSize})
    },
    // 获取时间
    GetDateStr (datatime) {
      let dd = datatime
      if (datatime === '') {
        dd = new Date()
      }
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
      return y + '-' + m + '-' + d
    },
    // 搜索
    search (keyword) {
      let param = {
        page: this.currentPage,
        size: this.pageSize
      }
      if (this.selectType === '0') {
        param.orderCode = keyword
      } else {
        param.otherAccount = keyword
      }
      if (this.period !== '') {
        let starttime = this.GetDateStr(this.period[0])
        let endtime = this.GetDateStr(this.period[1])
        param.createTimeStart = starttime
        param.createTimeEnd = endtime
      }
      this.selectTransactionList(param)
    },
    // 导出
    exportEcel () {
      let parm = ''
      if (this.period !== '' && this.period !== undefined) {
        let starttime = this.GetDateStr(this.period[0])
        let endtime = this.GetDateStr(this.period[1])
        if (starttime !== '') {
          if (parm !== '') {
            parm = parm + '&startTime=' + starttime
          } else {
            parm = parm + 'startTime=' + starttime
          }
        }
        if (endtime !== '') {
          if (parm !== '') {
            parm = parm + '&endTime=' + endtime
          } else {
            parm = parm + 'endTime=' + endtime
          }
        }
      }
      if (this.selectType === '0' && this.keyword !== '' && this.keyword !== undefined) {
        if (parm !== '') {
          parm = parm + '&orderCode=' + this.keyword
        } else {
          parm = parm + 'orderCode=' + this.keyword
        }
      }
      if (parm !== '') {
        window.location.href = process.env.DOMAIN + '/bshop/capital/excel/export?' + parm
      } else {
        window.location.href = process.env.DOMAIN + '/bshop/capital/excel/export'
      }
    },
    // 交易记录查询
    selectTransactionList (param) {
      this.dataIsLoad = false
      orderLogisticsAPI.getTransactionList(param).then((res) => {
        this.transactionList = res.data.data
        let records = this.transactionList.records
        let obj = []
        for (let i = 0; i < records.length; i++) {
          let createTime = records[i].createTime
          let type = '收款'
          if (records[i].type === '1') {
            type = '退款'
          }
          let newrecord = {createTime: createTime, orderCode: records[i].orderCode, type: type, systemSource: records[i].systemSource, otherAccount: records[i].otherAccount, ownAccount: records[i].ownAccount, amount: records[i].amount}
          obj.push(newrecord)
        }
        this.tableData = obj
        this.dataIsLoad = true
      })
    }
  },
  created () {
    // 是否绑定账户数据获取
    orderLogisticsAPI.isBindAccount({payMethod: 'PAYPAL'}).then((res) => {
      this.result = res.data.data
      this.isLoaded = true
      console.log(this.result)
    })
    orderLogisticsAPI.getStatisticsData().then((res) => {
      this.statisticsdata = res.data.data
      // console.log(res.data.data)
    })
    this.selectTransactionList({page: 1, size: 10})
  }
}
</script>
<style lang='less'>
  @import '../../../assets/style/list.less';
  @import '../../../assets/style/page';
  .n-bindAccount{
    &.n-bindAccount{
      min-height: calc(~'100vh - 337px');
      padding: 150px 0 0 0;
    }
    .no-contentPay{
      width: 400px;
      left: 50%;
      margin: -150px 0 0 -200px;
      height: 300px;
      position: absolute;
      top: 50%;
    }
  }
  .margintop10{
    margin-top:10px;
  }
  .fundsManage_nodata{
    background: #fff;
    .header{
      background:#F5F8FA;
      overflow: hidden;
      padding: 19px 0;
      li{
        float: left;
        color: #33475b;
        color: #33475b;
      }
    }
  }
  .inblock-overhide{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width:171px;
    display: inline-block;
  }
  .data-list-seven .el-table th, .data-list-seven .el-table td {
    height:50px;
  }
  .right-module{
    .input-sel-search{
      .el-input {
        width: 86px;
        .el-input__inner{
          width: 86px;
        }
      }
      .el-input__inner{
        width:120px;
        border-right-width: 0;
        &:focus,&:hover{
          border-right-width: 1px;
        }
      }
      .el-input-group__append{
        padding:0 10px;
        background-color: #fff;
        .el-button{
          padding:0 9px;
          border: none;
          line-height: 36px;
        }
      }
      .input-split{
        left:99px;
      }
    }
  }
  .funds-search{
    width:340px;
    vertical-align: top;
  }
  .input-split {
    display: inline-block;
    width: 0;
    height: 17px;
    border: 0;
    border-left: 1px solid #cbd6e3;
  }
  .input-sel-search{
    margin-left: 2px;
    width: 310px;
  *{
    border-color: #CBD6E3;
  }
  .el-select{
    width: 100px;
  }
  .el-input__inner{
    width: 100px;
  }
  .el-input-group__prepend{
    background-color: transparent;
    border-right: 0;
  }
  .el-input__inner{
    width: 162px;
    border-left: 0;
  }
  .el-input{
    color: #333;
  }
  .input-split{
    position: absolute;
    left: 100px;
    top: 0;
  }
  }
  .search-module-input{
    display: inline-block;
    border-radius: 4px;
    float: left;
    height: 34px;
    line-height: 34px;
    overflow: hidden;
    border: 1px solid #CBD6E3;
  }
  .have-content{
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    .el-table__body-wrapper{
      min-height: calc(~'100vh - 378px');
    }
  }
  .data-list-seven{
    .cate-pop{
      display: inline-block;
      max-width: 600px;
      padding: 10px;
      p{
        line-height: 20px;
        text-align: center;
      }
    }
    .el-table__header-wrapper{
      .is-leaf{line-height: 44px;}
    }
    .el-table__header-wrapper{
      tr th{
        background: #F5F8FA;
        .cell{
          background: #F5F8FA;
        }
      }
    }
    .el-table__body-wrapper{
      .el-table__body{
        tr:hover{
          background: #F5F8FA;
        }
      }
      .el-table__empty-block{
        margin-top: 15%;
      }
    }
  }
  .btn_once_free{
    text-decoration: underline;
  }
</style>

