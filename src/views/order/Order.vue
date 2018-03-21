<template>
  <div class="logistic-container order-container">
    <div class="search-box clearfix">
      <div class="">
        <el-button class="fresh-btn" @click="fresh"><i class="icon-fresh"></i></el-button>
          <!-- <el-select class="input-s" v-model="search.time">
            <el-option value="time" label="下单时间"></el-option>
          </el-select> -->
          <div class="time-sel">
            <el-select class="select-keyword" v-model="search.time">
              <el-option value="time" label="下单时间"></el-option>
            </el-select>
            <div class="select-time" id="timeSelect">
              <hr class="input-split">
              <el-date-picker
                v-model="search.period"
                type="daterange"
                align="center"
                @change="timeChage"
                :placeholder="timeTip">
              </el-date-picker>
            </div>
          </div>
          <!-- <el-date-picker
            v-model="search.createTimeStart"
            type="date"
            placeholder="开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="search.createTimeEnd"
            type="date"
            placeholder="结束时间"
            @change="timeValid">
          </el-date-picker> -->
      </div>
      <div class="right-search">
        <!-- <el-select class="" v-model="search.refundTag" placeholder="">
          <el-option value="" label="退款状态"></el-option>
          <el-option value="0" label="未退款"></el-option>
          <el-option value="1" label="部分已退款"></el-option>
          <el-option value="2" label="全部退款"></el-option>
        </el-select> -->
        <el-input
          placeholder="请输入搜索内容"
          v-model="search.keys"
          class="input-sel-search2">
          <el-select v-model="search.type" slot="prepend" placeholder="请选择">
            <el-option value="0" label="商品名称"></el-option>
            <el-option value="1" label="订单编号"></el-option>
          </el-select>
          <hr class="input-split" slot="prepend" >
          <el-button slot="append" icon="search" @click="searchForm"></el-button>
        </el-input>
      </div>
    </div>
    <template>
      <el-tabs v-model="activeName" @tab-click="tabSearch" class="ui-tab">
        <el-tab-pane label="所有状态" name="all"></el-tab-pane>
        <el-tab-pane label="待付款" name="waitpay"></el-tab-pane>
        <el-tab-pane label="待发货" name="waitsend"></el-tab-pane>
        <el-tab-pane label="已发货" name="send"></el-tab-pane>
        <!-- <el-tab-pane label="待评价" name="waitcomment"></el-tab-pane> -->
        <!-- <el-tab-pane label="退款中" name="refunding"></el-tab-pane> -->
        <el-tab-pane label="交易成功" name="success"></el-tab-pane>
        <el-tab-pane label="交易关闭" name="close"></el-tab-pane>
      </el-tabs>
    </template>
    <div class="order-list">
      <ul class="double-tab order-tab">
        <li class="double-header clearfix">
          <div class="double-span-item double-td">订单信息</div>
          <div class="double-td">买家</div>
          <div class="double-td">实收款</div>
          <div class="double-td">状态</div>
          <!-- <div class="double-td">退款</div> -->
          <div class="double-td">操作</div>
        </li>
        <li v-for="(data, idx) in orders.records" class="clearfix">
          <div class="double-th">
             <em>订单编号：{{data.orderCode}}</em>
             <em>下单时间：{{data.createTime|time-formater-no-hour}}</em>
             <em>订单来源：{{data.source}}</em></div>
          <div class="double-column clearfix" >
            <div class="double-span-item double-td"  v-bind:style="{'height': 96*(data.itemList.length)+'px'}">
              <div class="double-item" v-for="(k, index) in data.itemList" :class="{'bortop': index}">
                <img class="" :src="k.img+'?x-oss-process=image/resize,h_64,w_64'" alt="">
                <div class="double-one">
                  <el-popover trigger="hover" placement="top" popper-class="cate-pop">
                    <p>{{k.name}}</p>
                    <span slot="reference" class="name-wrapper">
                      <span class="tit">{{k.name}}</span>
                    </span>
                  </el-popover>
                  <span>x {{k.quantity}}</span>
                </div>
                <div class="double-two">
                  <span class="tit">{{k.specKey}}</span>
                  <span>{{data.amountUnit}} {{k.price}}</span>
                </div>
                <div class="double-two">
                  <span class="tit"></span>
                  <span>(单价)</span>
                </div>
              </div>
            </div>
            <div class="double-td" v-bind:style="{'height': 96*(data.itemList.length)+'px'}"><p>{{data.address.name}}</p><p>{{countryMap[data.address.countryName]?'+'+countryMap[data.address.countryName] : ''}}&nbsp;{{data.address.telephone}}</p></div>
            <div class="double-td" v-bind:style="{'height': 96*(data.itemList.length)+'px'}">
              <p>{{data.amountUnit}} {{data.amount}}</p>
              <p class="sub-tip">(含运费{{data.amountUnit}} {{data.totalCost}})</p>
            </div>
            <div class="double-td status-td" v-bind:style="{'height': 96*(data.itemList.length)+'px'}">
              <p>{{data.status?status[data.status]:status[0]}}</p>
              <p><el-button type="text" @click="doDetail(data.orderCode)">订单详情</el-button></p>
              <p><i class="red-tip">{{data.systemOrderStatus==1?"已冻结":""}}</i></p>
            </div>
            <!-- <div class="double-td" v-bind:style="{'height': 96*(data.itemList.length)+'px'}">{{data.refundTag?backstatus[data.refundTag]:backstatus[0]}}</div> -->
            <div class="double-td" v-bind:style="{'height': 96*(data.itemList.length)+'px'}">

              <el-button v-if="data.status==0" class="btn-trans" @click="doDetail(data.orderCode)">修改价格</el-button>
              <el-button v-if="data.status==1" type="primary" class="btn-blue" @click="doDetail(data.orderCode)">发货</el-button>
              <el-button v-if="data.status==0||data.status==1" class="btn-trans" @click="doDetail(data.orderCode)">关闭订单</el-button>
              <el-button v-if="data.status==2" class="btn-trans" @click="doDetail(data.orderCode)">修改物流</el-button>
              <!-- <el-popover v-if="data.logistNum"
                :popper-class="{'logist-pop': !logisList.length}"
                ref="popovers"
                placement="top-start"
                title=""
                width="620"
                trigger="click">
                <div v-if="!logisList.length">
                  <i class="icon-smile"></i>
                  <p class="no-logist">无法检测物流状态，请到相应物流查询网站查询物流！</p>
                </div>
                <div v-else>
                  <div class="fly-line">
                    <i class="icon-warn"></i>
                  </div>
                  <ul class="logist-list">
                    <li v-for="logs in logisList" class="logist-item">
                      <div class="date">
                        <label>{{logs.date|time-formater-no-hour}}</label>
                        <i>{{logs.date|time-formater-only-hour}}</i>
                      </div>
                      <span>{{logs.content}}</span>
                    </li>
                  </ul>
                </div>
                <div slot="reference" class="name-wrapper">
                    <el-button v-if="data.status==2||data.status==3||data.status==5" class="btn-trans" @click="showLogist(data.logistNum)">查看物流</el-button>
                </div>
              </el-popover> -->
              <el-button v-if="data.status==2||data.status==3||data.status==5" class="btn-trans"  @click="showLogist(idx, data.logistNum)">查看物流</el-button>
              <div :id="'logist'+idx" class="logist-box">
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="no-data order-no-data" v-if="orders.records &&!orders.records.length && !loading">
      <div class="img"></div>
      <div class="tips">暂无数据</div>
    </div>
    <div v-if="loading" class="loading loading-circle"></div>
    <div class="paging-column" v-if="orders.records && orders.records.length && orders.totalCount > 10">
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="transactionList.totalCount">
      </el-pagination> -->
      <el-pagination
      layout="prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="orders.totalCount"
      :current-Page="pageIndex"
       @current-change="pager"
       @size-change="sizeChange">
     </el-pagination>
    </div>
    <template>
      <remote-js :js-url="'//www.17track.net/externalcall.js'" :js-load-call-back="loadRongJs"></remote-js>
    </template>
  </div>
</template>
<script>

import { mapGetters } from 'vuex'
import remoteJs from '@/components/remoteJs'
export default {
  name: 'Order',
  props: {
  },
  data () {
    return {
      timeTip: '开始时间 ~ 结束时间',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      status: ['待付款', '待发货', '已发货', '交易成功', '交易关闭', '待评价'],
      backstatus: ['', '部分退款', '全部退款'],
      activeName: 'all',
      search: {
        period: '',
        refundTag: '',
        type: '0',
        keys: '',
        time: 'time',
        createTimeStart: '',
        createTimeEnd: ''
      },
      countryMap: {'Tonga': '676', 'Togo': '228', 'Congo,  The Republic of Congo': '242', 'Papua New Guinea': '675', 'Canary Islands': '345', 'Falkland Islands (Malvinas)': '500', 'Swaziland': '268', 'Central African Republic': '236', 'Haiti': '509', 'Suriname': '597', 'Sweden': '46', 'South Africa': '27', 'Honduras': '504', 'El Salvador': '503', 'Singapore': '65', 'North Korea': '850', 'Brazil': '55', 'Saint Lucia': '1758', 'Kuwait': '965', 'Virgin Islands (British)': '1284', 'Russian Federation': '7', 'Mayotte': '269', 'Belarus': '375', 'Hungary': '36', 'Comoros': '269', 'Fiji': '679', 'Sri Lanka': '94', 'Morocco': '212', 'Tunisia': '216', 'Kenya': '254', 'Poland': '48', 'Grenada': '1473', 'Japan': '81', 'Algeria': '213', 'Palestine': '970', 'Guinea-bissau': '245', 'Afghanistan': '93', 'Turks and Caicos Islands': '1649', 'Mongolia': '976', 'Bermuda': '441', 'Ecuador': '593', 'Jamaica': '1876', 'Syrian Arab Republic': '963', 'Saint Helena': '290', 'Tuvalu': '688', 'Guam': '1671', 'Peru': '51', 'Gabon': '241', 'Cape Verde': '238', 'Costa Rica': '506', 'Zimbabwe': '263', 'Niue': '683', 'Curacao': '5999', 'Chile': '56', 'Serbia': '381', 'Switzerland': '41', 'Ascension Island': '247', 'Bosnia and Herzegovina': '387', 'Bahrain': '973', 'Latvia': '371', 'Montenegro': '382', 'Greenland': '45', 'Dominica': '1767', 'Dominican Republic': '1849', 'British Indian Ocean Territory': '246', 'Oman': '968', 'French Southern Territories': '33', 'Portugal': '351', 'Cayman Islands': '1345', 'Saudi Arabia': '966', 'Turkmenistan': '993', 'Niger': '227', 'Madagascar': '261', 'Congo,  The Democratic Republic Of The': '243', 'Libya': '218', 'Iceland': '354', 'Sao Tome and Principe': '239', 'Israel': '972', 'Tokelau': '690', 'Saint Barthelemy': '590', 'Pakistan': '92', 'Mauritius': '230', 'Colombia': '57', 'Timor-leste': '670', 'Yemen': '967', 'Burundi': '257', 'Norway': '47', 'Nepal': '977', 'Georgia': '995', 'Seychelles': '248', 'Nauru': '674', 'Netherlands': '31', 'United Arab Emirates': '971', 'Cambodia': '855', 'Samoa': '685', 'Malaysia': '60', 'Turkey': '90', 'Guatemala': '502', 'Belize': '501', 'Botswana': '267', 'New Zealand': '64', 'Macedonia': '389', 'Cook Islands': '682', 'Saint Kitts and Nevis': '1869', 'United Kingdom': '44', 'Faroe Islands': '298', 'Virgin Islands (U.S.)': '1340', 'Equatorial Guinea': '240', 'Denmark': '45', 'Cuba': '53', 'Nicaragua': '505', 'Kyrgyzstan': '996', 'Estonia': '372', 'New Caledonia': '687', 'Mauritania': '222', 'Cyprus': '357', 'Uganda': '256', 'Djibouti': '253', 'Greece': '30', 'Uruguay': '598', 'Gibraltar': '350', 'Albania': '355', 'Reunion': '262', 'Guinea': '224', 'Northern Mariana Islands': '1670', 'Spain': '34', 'Palau': '680', 'French Guiana': '594', 'Eritrea': '291', 'Christmas Island': '6724', 'Myanmar': '95', 'Mali': '223', 'Tanzania': '255', 'Czech Republic': '420', 'American Samoa': '684', 'United States': '1', 'Kazakhstan': '7', 'United States Minor Outlying Islands': '1', 'China': '86', 'Western sahara': '210', 'Solomon Islands': '677', 'Benin': '229', 'Italy': '39', 'Zambia': '360', 'Vanuatu': '678', 'Saint Martin（France）': '590', 'French Polynesia': '689', 'Malawi': '265', 'Netherlands Antilles': '599', 'Zanzibar': '259', 'Saint Vincent and the Grenadines': '1784', 'Thailand': '66', 'Micronesia': '691', 'Lesotho': '266', 'Uzbekistan': '998', 'Romania': '40', 'Mozambique': '258', 'Burkina Faso': '226', 'Qatar': '974', 'Lebanon': '961', 'Luxembourg': '352', 'Germany': '49', 'Jordan': '962', 'Malta': '356', 'Nigeria': '234', 'Panama': '507', 'Bulgaria': '359', 'Armenia': '374', 'Egypt': '20', 'Aruba': '297', 'Belgium': '32', 'Guadeloupe': '590', 'Gambia': '220', 'Ukraine': '380', 'Azerbaijan': '994', 'Argentina': '54', 'Chad': '235', 'Lithuania': '370', 'Martinique': '596', 'Ethiopia': '251', 'Croatia (local name:  Hrvatska)': '385', 'Tajikistan': '992', 'India': '91', 'St. Pierre and Miquelon': '508', 'Canada': '1', 'Australia': '61', 'Finland': '358', 'Sudan': '249', 'Montserrat': '664', 'Philippines': '63', 'France': '33', 'Wallis And Futuna Islands': '682', 'Svalbard and Jan Mayen': '47', 'Maldives': '960', 'Iraq': '964', 'Trinidad and Tobago': '1868', 'Cote D\'Ivoire': '225', 'Bahamas': '1242', 'Venezuela': '58', 'Vietnam': '84', 'Ghana': '233', 'Guyana': '592', 'Antigua and Barbuda': '268', 'Monaco': '377', 'Indonesia': '62', 'Somalia': '252', 'Slovenia': '386', 'Brunei Darussalam': '673', 'Barbados': '1246', 'Senegal': '221', 'Mexico': '52', 'Paraguay': '595', 'Cocos (Keeling) Islands': '61', 'Liberia': '231', 'Moldova': '373', 'Andorra': '376', 'Liechtenstein': '423', 'South Korea': '82', 'Puerto Rico': '1787', 'Iran (Islamic Republic of)': '98', 'Rwanda': '250', 'Norfolk Island': '6723', 'Ireland': '353', 'Bhutan': '975', 'Angola': '244', 'Namibia': '264', 'Bangladesh': '880', 'Austria': '43', 'Slovakia (Slovak Republic)': '421', 'Lao People\'s Democratic Republic': '856', 'Marshall Islands': '692', 'Anguilla': '264', 'Kiribati': '686', 'Sierra Leone': '232', 'Pitcairn Islands': '64', 'San Marino': '378', 'Vatican City State (Holy See)': '379'}
    }
  },
  created () {
    let params = {page: this.pageIndex, size: this.pageSize}
    this.$store.commit('PROD_LOAD', {loading: true})
    this.$store.dispatch('getOrderList', params)
  },
  mounted () {
  },
  computed: mapGetters({
    orders: 'orderList',
    logisList: 'logisList',
    loading: 'loading'
  }),
  watch: {
  },
  components: {remoteJs},
  methods: {
    loadRongJs () {
    },
    /**
     * 时间改变
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    timeChage (e) {
      console.log(e)
      if (e) {
        this.timeTip = ''
      } else {
        this.timeTip = '开始时间 ~ 结束时间'
      }
    },
    // 分页
    pager (pageIndex) {
      this.pageIndex = pageIndex
      this.searchForm(pageIndex, this.pageSize)
      // this.$store.dispatch('getOrderList', this.pageIndex)
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.searchForm(this.pageIndex, this.pageSize)
    },
    tabSearch (tab, event) {
      let name = this.activeName
      let orderStatus = ''
      switch (name) {
        case 'waitpay': orderStatus = 0; break
        case 'waitsend': orderStatus = 1; break
        case 'send': orderStatus = 2; break
        case 'success': orderStatus = 3; break
        case 'close': orderStatus = 4; break
      }
      this.search.orderStatus = orderStatus
      this.searchForm()
       // 订单状态(0待付款,1买家已付款,2卖家已发货,3交易完成,4交易关闭)
    },
    fresh () {
      location.reload()
    },
    // 查看订单详情
    doDetail (orderid) {
      this.$router.push({path: '/orderDetail/' + orderid})
    },
    // 搜索
    searchForm (page, pageSize) {
      if (this.search.period && this.search.period[0]) {
        this.search.createTimeStart = this.changeDate(this.search.period[0])
        this.search.createTimeEnd = this.changeDate(this.search.period[1])
      }
      // if (this.search.createTimeStart) {
      //   this.search.createTimeStart = this.changeDate(this.search.createTimeStart)
      // }
      // if (this.search.createTimeEnd) {
      //   this.search.createTimeEnd = this.changeDate(this.search.createTimeEnd)
      // }
      if (this.search.type === '0') {
        this.search.productName = this.search.keys
      } else {
        this.search.orderCode = this.search.keys
      }
      isNaN(page) ? page = 1 : null
      let params = Object.assign(this.search, {page: page, size: pageSize})
      this.$store.dispatch('getOrderList', params)
    },
    changeDate (value) {
      let time = new Date(value)
      let year = time.getFullYear()
      let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
      let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
      return year + '-' + month + '-' + day
    },
    timeValid () {
      if (new Date(this.search.createTimeEnd) < new Date(this.search.createTimeStart)) {
        this.$message.error('结束时间不得大于开始时间')
        this.search.createTimeEnd = ''
      }
    },
    // 查看物流
    showLogist (idx, logNum) {
      /* eslint-disable */
      let logist = document.querySelector('#logist' + idx)
      if (logist.style.display === 'block') {
        logist.style.display = 'none'
      } else {
        YQV5.trackSingle({
          // 必须，指定承载内容的容器ID。
          YQ_ContainerId: 'logist' + idx,
          // 可选，指定查询结果高度，最大为800px，默认为560px。
          // YQ_Height: 560,
          // 可选，指定运输商，默认为自动识别。
          // YQ_Fc: '0',
          // 可选，指定UI语言，默认根据浏览器自动识别。
          // YQ_Lang: 'en',
          // 必须，指定要查询的单号。
          YQ_Num: logNum
        })
      }
    }
  }
}
</script>
<style lang='less'>
/*@import '../../assets/style/list.less';*/
@import '../../assets/style/order.less';
@import '../../assets/style/page.less';
@padleft: 50px;
// tab
.ui-tab{
  .el-tabs__item{
    /*margin-right: 10%;*/
    padding: 0 150px 0 0;
    width: 150px;
    font-weight: bold;
    color: #33475B;
  }
  .el-tabs__active-bar{
    width: 50px!important;
  }
  .el-tabs__nav{
    margin-left: @padleft;
  }
  .el-tabs__item.is-active{
    color: #33475B;
  }
  .el-tabs__header{
    margin: 0;
    border-bottom: 0;
  }
}
.el-popover.small{
  width: 342px!important;
}
.el-popover.cate-pop{
  padding: 10px;
}
.double-tab{
  .double-one>span:nth-child(1){
    display: inline-block;
    width: 410px;
  }
  .name-wrapper{
    max-width: 100%;
    display: inline-block;
    .tit{
      max-width: 306px;
      width: auto;
    }
  }
  .el-button--text{
    font-size: 13px;
  }
  .double-th>em{
    margin-right: 16px;
  }
}
.el-tabs{
  .el-tabs__item:after{
    position: absolute;
    top: 12px;
    left: 65%;
    content: '';
    width: 0;
    height: 17px;
    border: 0;
    border-left: 1px solid #EAF0F6;
  }
  .el-tabs__item:last-child:after{
    display: none;
  }
}
// .logist-pop.el-popover{
//   width: 342px!important;
// }
.order-no-data .img{
  background: url(../../assets/img/monitor/noData.png) center no-repeat;
}
.order-container.logistic-container{
  min-height: calc(~'100vh - 210px');
  overflow: inherit;
}
.logist-box{
  position: absolute;
  left: -400px;
  width: 500px;
  z-index: 9;
}
</style>
