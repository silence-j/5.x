<template>
  <div class="container-1200">
    <div class="inner-top">
      <a href="javascript:;" @click="backToList">
      <!--<i class="icon-font icon-left"></i>-->
       <span><img src="../../../src/assets/img/left.png" alt="" class="left-back" /></span>
      返回订单物流</a>
    </div>
    <div class="logistic-container orderDetail-container">
      <div class="order-box">
        <div class="order-info">
          <h1>订单信息</h1>
          <ul class="info-list">
            <li>
              <label>订单编号：</label>
              <span>{{info.orderCode}}</span>
            </li>
            <li class="ui-buyer">
              <label>买 家：</label>
              <span>{{info.buyer?info.buyer.nickname:'-'}}</span>
            </li>
            <li>
              <label>创建时间：</label>
              <span v-if="info.createTime">{{info.createTime|time-formater-has-hour}}</span>
              <span v-else>-</span>
            </li>
            <li>
              <label>付款时间：</label>
              <span v-if="info.payTime">{{info.payTime|time-formater-has-hour}}</span>
              <span v-else>-</span>
            </li>
            <li>
              <label>发货时间：</label>
              <span v-if="info.deliverTime">{{info.deliverTime|time-formater-has-hour}}</span>
              <span v-else>-</span>
            </li>
            <li>
              <label>成交时间：</label>
              <span v-if="info.finishTime">{{info.finishTime|time-formater-has-hour}}</span>
              <span v-else>-</span>
            </li>
            <li class="tit">
              <label>收货信息：</label>
              <span><el-button type="text" id="copy" @click="zlip">复制</el-button></span>
            </li>
            <li class="ui-address" v-if="info.address">
              <textarea type="text" class="copy-txt" id="copyinput" readOnly>
              </textarea>
             </li>
            <li class="tit">
              <label>买家留言：</label>
              <span>{{info.message?info.message:'-'}}</span>
            </li>
          </ul>
        </div>
        <!-- 0待付款 -->
        <div class="order-state"  v-if="info.status==0">
          <div class="state-box">
             <h2 class="state-tit"><i class="icon-warn"></i>订单状态：商品已拍下，等待买家付款</h2>
             <p>如买家未在<i class="red-tip">{{restTime}}</i>内付款，订单将超时自动关闭</p>
             <el-button type="primary" class="btn-blue" @click="modPrice()">修改价格</el-button>
             <el-button class="btn-trans" @click="closeModel = true">关闭订单</el-button>
          </div>
          <div class="warm-tip">
            <label>温馨提醒：</label>请务必等待订单状态变更为“买家已付款，等待卖家发货” 后再进行发货。
          </div>
        </div>
        <!-- 1已付款待发货 -->
        <div class="order-state"  v-if="info.status==1">
          <div class="state-box">
             <h2 class="state-tit"><i class="icon-warn"></i>订单状态：买家已付款，等待商家发货</h2>
             <p>买家已付款，请尽快发货</p>
             <el-button type="primary" class="btn-blue" @click="deliverModel=true">发货</el-button>
             <!--deliverModel,priceModel -->
             <el-button v-if="info.refundTag!=0" class="btn-trans"  @click="fundModel = true">退款</el-button>
             <el-button v-else class="btn-trans" @click="closeModel=true">关闭订单</el-button>
             <p class="desc" v-if="info.refundTag!=0">您已对商品
              <a class="blue-link" href="#">“{{info.name}}”</a>
              进行了退款，退款金额：<i class="red-tip">{{info.amountUnit}} {{refund.refundAmount}}</i></p>
          </div>
          <div class="warm-tip">
            <label>温馨提醒：</label>如果无法发货，请尽快与买家联系，并说明情况后进行退款。
          </div>
        </div>
        <!-- 2已发货 -->
        <div class="order-state"  v-if="info.status==2">
          <div class="state-box">
             <h2 class="state-tit"><i class="icon-warn"></i>订单状态：商家已发货，等待买家收货</h2>
             <p>买家如在<i class="red-tip">30天</i>内确认收货，交易将自动完成</p>
             <el-button type="primary" class="btn-blue" @click="modLogic">修改物流</el-button>
             <!-- <el-button class="btn-trans" @click="fundModel = true">退款</el-button> -->
          </div>
          <div class="warm-tip">
            <label>温馨提醒：</label>请及时关注您的包裹物流状态，确保能配送至买家手中。如买家表示未收到货或者货物有问题，请及时联系买家积极处理，友好协商。
          </div>
        </div>
        <!-- 3交易成功 -->
        <div class="order-state"  v-if="info.status==3">
          <div class="state-box">
             <h2 class="state-tit"><i class="icon-ok"></i>订单状态：交易成功</h2>
             <!-- <el-button class="btn-trans pos" @click="refund()">退款</el-button> -->
          </div>
          <div class="warm-tip">
            <label>温馨提醒：</label>如果无法发货，请尽快与买家联系，并说明情况后进行退款。
          </div>
        </div>
        <!-- 4交易关闭 -->
        <div class="order-state"  v-if="info.status==4">
          <div class="state-box">
             <h2 class="state-tit"><i class="icon-fail"></i>订单状态：订单关闭</h2>
             <p v-if="info.refundTag">退款金额：<i class="red-tip">{{info.amountUnit}} {{refund.refundAmount}}</i></p>
          </div>
        </div>
      </div>
      <div class="order-list order-detail">
        <ul class="double-tab">
          <li class="double-header clearfix">
            <div class="double-span-item double-td">商品信息</div>
            <div class="double-td">单价(美元)</div>
            <div class="double-td">数量</div>
            <div class="double-td">状态</div>
            <div class="double-td">运费(美元)</div>
          </li>
          <!-- 物流信息 -->
          <li class="logistics-column clearfix" v-if="info.waybill">
            <p><b>包裹</b>
              <span>{{info.waybill.companyName}}</span>
              <label>运单号：</label>
              <span>{{info.waybill.waybillNumber}}</span>
              <i class="red-tip">{{info.waybill.posttime}} {{info.waybill.content}}</i>
              <!-- <el-popover v-if="info.waybill && info.waybill.waybillId"
                ref="popovers"
                placement="top-start"
                title=""
                width="620"
                trigger="click">
                <div class="fly-line">
                  <i class="icon-fly"></i>
                </div>
                <ul class="logist-list">
                  <li v-for="data in logisList" class="logist-item">
                    <div class="date">
                      <label>{{data.date|time-formater-no-hour}}</label>
                      <i>{{data.date|time-formater-only-hour}}</i>
                    </div>
                    <span>{{data.content}}</span>
                  </li>
                </ul>
              </el-popover>
              <el-popover v-else
                ref="popovers"
                placement="top-start"
                title=""
                width="342"
                trigger="click">
                <i class="icon-smile"></i>
                <p class="no-logist">无法检测物流状态，请到相应物流查询网站查询物流！</p>
              </el-popover> -->
              <!-- <el-button type="text" v-popover:popovers>更多<i class="icon-arrdown"></i></el-button> -->
              <el-button type="text" @click="showLogist(info.waybill.waybillNumber)">更多<i class="icon-arrdown"></i></el-button>
            </p>
            <div id="logist" class="logist-box">
            </div>
          </li>
          <li class="clearfix" v-for="(k,index) in info.itemList" >
            <div class="double-column">
              <div class="double-span-item double-td">
                <img class="" :src="k.img+'?x-oss-process=image/resize,h_64,w_64'" alt="">
                <div class="double-one">
                  <span class="tit">{{k.name}}</span>
                </div>
                <div class="double-two">
                  <span class="tit">{{k.specKey}}</span>
                </div>
              </div>
              <div class="double-td">{{info.amountUnit}} {{k.price}}</div>
              <div class="double-td">{{k.quantity}}</div>
              <div class="double-td">
                {{info.status?status[info.status]:status[0]}}
              </div>
              <div class="double-td all-feight" :class="{'last-feight':index==info.itemList.length-1}">
                <span v-if="index==0" >{{info.amountUnit}} {{info.totalCost}}</span>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="info.status==1&&info.refundTag==1" class="pay-fact">
          <p>应收金额：<label>{{info.amountUnit}} {{info.amount}}</label></p>
          <p>退款：<label>{{info.amountUnit}} {{info.amount}}</label></p>
          <p><label>实际总计：</label><i class="red-tip">{{info.amountUnit}} 94</i></p>
        </div>
        <div v-else class="pay-fact">
          <label>应收金额：</label>
          <i class="red-tip">{{info.amountUnit}} {{info.amount}}</i>
        </div>
      </div>
      <el-dialog title="修改价格" v-model="priceModel">
        <!-- <el-table  @header-click="explain" v-for="data in info.itemList">
          <el-table-column property="name" label="商品名称" width="150"></el-table-column>
          <el-table-column property="price" label="单价(美元)"></el-table-column>
          <el-table-column property="quantity" label="数量">
            <template scope="scope">
              x {{scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column property="" label="小计(美元)">
            <template scope="scope">
              {{scope.row.price*scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column property="updown" label="涨价或减价" class="updown">
            <template scope="scope">
              <el-input value="+0"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="address" label="运费(美元)">
            <template scope="scope">
              <el-input value="0"></el-input>
            </template>
          </el-table-column>
        </el-table> -->
        <div class="order-list">
          <ul class="double-tab price-tab">
            <li class="double-header clearfix">
              <div class="double-span-item double-td">商品名称</div>
              <div class="double-td">单价(美元)</div>
              <div class="double-td">数量</div>
              <div class="double-td">小计(美元)</div>
              <div class="double-td">涨价或降价</div>
              <div class="double-td">运费(美元)</div>
            </li>
            <li v-for="(data, index) in info.itemList" class="double-column clearfix">
              <div class="double-span-item double-td">
                <div class="double-one">
                  <span class="tit">{{data.name}}</span>
                </div>
              </div>
              <div class="double-td">{{data.price}}</div><!-- 原价 -->
              <div class="double-td">{{data.quantity}}</div>
              <div class="double-td">{{data.quantity*data.price}}</div>
              <div class="double-td">
                <el-input v-model="data.changePrice" @blur="caluActPay(index)"></el-input>
              </div><!--  info.itemList[index].pricespan-->
              <div class="double-td">
                <el-input v-if="index == 0" v-model="priceFeight" @blur="caluActPay(index)"></el-input>
              </div>
            </li>
          </ul>
        </div>
        <div class="modprice-info">
          <p><label>收货信息：</label>
             <span v-if="info.address">
              {{info.address1}}
              {{info.address2}}
                <!-- {{info.address.name}} ( {{info.address.telephone}} )
                {{info.address.detailAddress}}
                {{info.address.city}}
                {{info.address.provinceName}}
                {{info.address.countryName}}
                {{info.address.postcode}} -->
             </span>
          </p>
          <p><label>买家实付：</label>
             <span v-if="priceOPay">{{priceOPay}} + {{priceFeight}}<i class="red-tip">{{priceSpan}}</i> = {{priceLastPay}}</span>
          </p>
          <p class="tips76">(买家实付=原价+运费+涨价或减价)</p>
        </div>
        <div class="confirm-btn">
          <el-button type="primary" class="confirm" @click="modpriceOk">确定</el-button>
          <el-button class="close"  @click="priceModel = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 发货/修改物流 -->
      <el-dialog :title="logistmodelname" v-model="deliverModel">
        <el-table :data="info.itemList"  @select="selectProduct" @select-all="selectAll">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column property="name" label="商品" width="270">
            <template scope="scope">
              <el-popover trigger="hover" placement="right" popper-class="cate-pop">
                <p>{{scope.row.name}}</p>
                <span slot="reference" class="deliver-name">
                  {{scope.row.name}}
                </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column property="quantity" label="数量">
            <template scope="scope">
              x {{scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column property="" label="物流公司">
            <template scope="scope">
              {{logistother?formcompname:formcomp}}
            </template>
          </el-table-column>
          <el-table-column property="orderCode" label="单号">
            <template scope="scope">
              {{formlogistNum}}
            </template>
          </el-table-column>
        </el-table>
        <div class="modprice-info">
          <p><label>收货信息：</label>
             <span v-if="info.address">
              {{info.address1}}
              {{info.address2}}
             </span>
          </p>
          <p><label>物流公司：</label>
              <el-select v-model="formcomp" placeholder="请选择" @change="selectComp">
                <el-option v-for="d in comps" :key="d.id" :label="d.dictdataName" :value="d.dictdataName">
                </el-option>
              </el-select>
              <label>快递单号：</label>
              <el-input :maxlength=50 v-model="formlogistNum" class="ui-logist"></el-input>
              <label v-if="logistother">其他物流：</label>
              <el-input v-if="logistother" v-model="formcompname" class="ui-logist" placeholder="请输入物流公司名称"></el-input>
          </p>
        </div>
        <div class="confirm-btn">
          <el-button type="primary" class="confirm" @click="deliverOk">确定</el-button>
          <el-button class="close"  @click="deliverModel = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 退款 -->
      <el-dialog title="退款" v-model="fundModel">
        <div class="order-list">
          <ul class="double-tab refund-tab">
            <li class="double-header clearfix">
              <div class="double-span-item double-td">商品名称</div>
              <div class="double-td">价格(美元)</div>
              <div class="double-td">数量</div>
              <div class="double-td">单价(美元)</div>
            </li>
            <li v-for="(data, index) in info.itemList" class="double-column clearfix">
              <div class="double-span-item double-td">
                <div class="double-one">
                  <span class="tit">{{data.name}}</span>
                </div>
                <div class="double-two">
                  <span class="tit">{{data.specKey}}</span>
                </div>
              </div>
              <div class="double-td">{{data.quantity*data.price}}</div>
              <div class="double-td">
                <div class="calu-box">
                  <el-input v-model="info.itemList[index].formnum"></el-input>
                  <a href="javascript:;" class="icon-arrup" @click="addNum(index, data.quantity)"></a>
                  <a href="javascript:;" class="icon-arrdown" @click="reduceNum(index)"></a>
                </div>
              </div>
              <div class="double-td">{{data.price}}</div>
            </li>
          </ul>
        </div>
        <div class="totalcost-box clearfix">
          <div class="totalcost-right">
            <p class="calu-cost">小计：
              <label><i class="red-tip">{{info.amountUnit}} {{refundfm.refundAmountCal}}</i></label>
            </p>
            <p>可退金额：
              <label>- {{info.amountUnit}} {{info.amount}}</label>
            </p>
            <p>
              <el-checkbox></el-checkbox>退还运费：
              <label>{{info.amountUnit}} {{info.totalCost}}</label>
            </p>
          </div>
        </div>
        <el-form class="refund-form">
          <el-form-item label="">
            <label class="ui-lbl">手动修改库存金额</label>
            <el-checkbox v-model="refundfm.returnInvTag">库存返还</el-checkbox>
            <el-input placeholder="" v-model="refundfm.refundAmount">
            </el-input>
            <i class="unit-input"><i>|</i> 美元</i>
          </el-form-item>
          <el-form-item label="退款理由">
            <el-input placeholder="请输入退款理由" v-model="refundfm.refundReason">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="confirm-btn">
          <el-button type="primary" class="confirm" @click="deliverOk">确定</el-button>
          <el-button class="close"  @click="fundModel = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 关闭订单 -->
      <el-dialog title="关闭订单" v-model="closeModel" size="tiny">
        <el-select v-model="closedReason" class="one-sel" placeholder="请选择一个取消订单的理由">
          <!-- <el-option value="请选择一个取消订单的理由">请选择一个取消订单的理由</el-option> -->
          <el-option value="close_reason_1" label="无法联系上买家"></el-option>
          <el-option value="close_reason_2" label="买家误拍或者重拍了"></el-option>
          <el-option value="close_reason_3" label="买家无诚意完成交易"></el-option>
          <el-option value="close_reason_4" label="已经缺货无法交易"></el-option>
          <el-option value="close_reason_5" label="其他"></el-option>
        </el-select>
        <div class="confirm-btn">
          <el-button type="primary" class="confirm" @click="closeOk">确定</el-button>
          <el-button class="close"  @click="closeModel = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <template>
      <remote-js :js-url="'//www.17track.net/externalcall.js'" :js-load-call-back="loadRongJs"></remote-js>
    </template>
  </div>
</template>
<script>
import orderApi from '../../api/orderApi'
import Vue from 'vue'
// import Logist from './cpnts/logist.vue'
import { mapGetters } from 'vuex'
import remoteJs from '@/components/remoteJs'
// import $ from 'jquery'
// import ZeroClipboard from '../../assets/js/ZeroClipboard.js'
export default {
  name: 'orderDetail',
  props: {
  },
  data () {
    return {
      formcomp: '',
      formlogistNum: '',
      formcompname: '',
      formnum: 0,
      modLogis: false,
      logistother: 0,
      closedReason: '',
      priceOPay: '',
      priceSpan: '',
      priceFeight: '',
      priceLastPay: '',
      restTime: '',
      priceModel: false,
      deliverModel: false,
      fundModel: false,
      closeModel: false,
      logistmodelname: '商品发货',
      logistmodeltype: 0, // 0 发货, 1修改物流
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      status: ['待付款', '待发货', '已发货', '交易成功', '交易关闭', '待评价'], // 012345
      backstatus: ['', '部分退款', '全部退款'],
      selectarr: [],
      refundfm: {
        refundAmount: '',
        returnInvTag: 0,
        returnFreightTag: 0,
        refundReason: '',
        amountUnit: ''
        // detailList[0].itemId
        // detailList[0].returnNum
      },
      info: {
        orderCode: ''
      },
      countryMap: {'Tonga': '676', 'Togo': '228', 'Congo,  The Republic of Congo': '242', 'Papua New Guinea': '675', 'Canary Islands': '345', 'Falkland Islands (Malvinas)': '500', 'Swaziland': '268', 'Central African Republic': '236', 'Haiti': '509', 'Suriname': '597', 'Sweden': '46', 'South Africa': '27', 'Honduras': '504', 'El Salvador': '503', 'Singapore': '65', 'North Korea': '850', 'Brazil': '55', 'Saint Lucia': '1758', 'Kuwait': '965', 'Virgin Islands (British)': '1284', 'Russian Federation': '7', 'Mayotte': '269', 'Belarus': '375', 'Hungary': '36', 'Comoros': '269', 'Fiji': '679', 'Sri Lanka': '94', 'Morocco': '212', 'Tunisia': '216', 'Kenya': '254', 'Poland': '48', 'Grenada': '1473', 'Japan': '81', 'Algeria': '213', 'Palestine': '970', 'Guinea-bissau': '245', 'Afghanistan': '93', 'Turks and Caicos Islands': '1649', 'Mongolia': '976', 'Bermuda': '441', 'Ecuador': '593', 'Jamaica': '1876', 'Syrian Arab Republic': '963', 'Saint Helena': '290', 'Tuvalu': '688', 'Guam': '1671', 'Peru': '51', 'Gabon': '241', 'Cape Verde': '238', 'Costa Rica': '506', 'Zimbabwe': '263', 'Niue': '683', 'Curacao': '5999', 'Chile': '56', 'Serbia': '381', 'Switzerland': '41', 'Ascension Island': '247', 'Bosnia and Herzegovina': '387', 'Bahrain': '973', 'Latvia': '371', 'Montenegro': '382', 'Greenland': '45', 'Dominica': '1767', 'Dominican Republic': '1849', 'British Indian Ocean Territory': '246', 'Oman': '968', 'French Southern Territories': '33', 'Portugal': '351', 'Cayman Islands': '1345', 'Saudi Arabia': '966', 'Turkmenistan': '993', 'Niger': '227', 'Madagascar': '261', 'Congo,  The Democratic Republic Of The': '243', 'Libya': '218', 'Iceland': '354', 'Sao Tome and Principe': '239', 'Israel': '972', 'Tokelau': '690', 'Saint Barthelemy': '590', 'Pakistan': '92', 'Mauritius': '230', 'Colombia': '57', 'Timor-leste': '670', 'Yemen': '967', 'Burundi': '257', 'Norway': '47', 'Nepal': '977', 'Georgia': '995', 'Seychelles': '248', 'Nauru': '674', 'Netherlands': '31', 'United Arab Emirates': '971', 'Cambodia': '855', 'Samoa': '685', 'Malaysia': '60', 'Turkey': '90', 'Guatemala': '502', 'Belize': '501', 'Botswana': '267', 'New Zealand': '64', 'Macedonia': '389', 'Cook Islands': '682', 'Saint Kitts and Nevis': '1869', 'United Kingdom': '44', 'Faroe Islands': '298', 'Virgin Islands (U.S.)': '1340', 'Equatorial Guinea': '240', 'Denmark': '45', 'Cuba': '53', 'Nicaragua': '505', 'Kyrgyzstan': '996', 'Estonia': '372', 'New Caledonia': '687', 'Mauritania': '222', 'Cyprus': '357', 'Uganda': '256', 'Djibouti': '253', 'Greece': '30', 'Uruguay': '598', 'Gibraltar': '350', 'Albania': '355', 'Reunion': '262', 'Guinea': '224', 'Northern Mariana Islands': '1670', 'Spain': '34', 'Palau': '680', 'French Guiana': '594', 'Eritrea': '291', 'Christmas Island': '6724', 'Myanmar': '95', 'Mali': '223', 'Tanzania': '255', 'Czech Republic': '420', 'American Samoa': '684', 'United States': '1', 'Kazakhstan': '7', 'United States Minor Outlying Islands': '1', 'China': '86', 'Western sahara': '210', 'Solomon Islands': '677', 'Benin': '229', 'Italy': '39', 'Zambia': '360', 'Vanuatu': '678', 'Saint Martin（France）': '590', 'French Polynesia': '689', 'Malawi': '265', 'Netherlands Antilles': '599', 'Zanzibar': '259', 'Saint Vincent and the Grenadines': '1784', 'Thailand': '66', 'Micronesia': '691', 'Lesotho': '266', 'Uzbekistan': '998', 'Romania': '40', 'Mozambique': '258', 'Burkina Faso': '226', 'Qatar': '974', 'Lebanon': '961', 'Luxembourg': '352', 'Germany': '49', 'Jordan': '962', 'Malta': '356', 'Nigeria': '234', 'Panama': '507', 'Bulgaria': '359', 'Armenia': '374', 'Egypt': '20', 'Aruba': '297', 'Belgium': '32', 'Guadeloupe': '590', 'Gambia': '220', 'Ukraine': '380', 'Azerbaijan': '994', 'Argentina': '54', 'Chad': '235', 'Lithuania': '370', 'Martinique': '596', 'Ethiopia': '251', 'Croatia (local name:  Hrvatska)': '385', 'Tajikistan': '992', 'India': '91', 'St. Pierre and Miquelon': '508', 'Canada': '1', 'Australia': '61', 'Finland': '358', 'Sudan': '249', 'Montserrat': '664', 'Philippines': '63', 'France': '33', 'Wallis And Futuna Islands': '682', 'Svalbard and Jan Mayen': '47', 'Maldives': '960', 'Iraq': '964', 'Trinidad and Tobago': '1868', 'Cote D\'Ivoire': '225', 'Bahamas': '1242', 'Venezuela': '58', 'Vietnam': '84', 'Ghana': '233', 'Guyana': '592', 'Antigua and Barbuda': '268', 'Monaco': '377', 'Indonesia': '62', 'Somalia': '252', 'Slovenia': '386', 'Brunei Darussalam': '673', 'Barbados': '1246', 'Senegal': '221', 'Mexico': '52', 'Paraguay': '595', 'Cocos (Keeling) Islands': '61', 'Liberia': '231', 'Moldova': '373', 'Andorra': '376', 'Liechtenstein': '423', 'South Korea': '82', 'Puerto Rico': '1787', 'Iran (Islamic Republic of)': '98', 'Rwanda': '250', 'Norfolk Island': '6723', 'Ireland': '353', 'Bhutan': '975', 'Angola': '244', 'Namibia': '264', 'Bangladesh': '880', 'Austria': '43', 'Slovakia (Slovak Republic)': '421', 'Lao People\'s Democratic Republic': '856', 'Marshall Islands': '692', 'Anguilla': '264', 'Kiribati': '686', 'Sierra Leone': '232', 'Pitcairn Islands': '64', 'San Marino': '378', 'Vatican City State (Holy See)': '379'}
    }
  },
  components: {remoteJs},
  mounted () {
    let usid = localStorage.userId
    let avaiableTopMenue = JSON.parse(localStorage['topBar' + usid])
    console.log(avaiableTopMenue)
    for (let menu in avaiableTopMenue) {
      if (avaiableTopMenue[menu].title === '订单物流') {
        // 选中一级菜单
        this.$store.dispatch('setNavIndex', parseInt(menu))
      }
    }
  },
  methods: {
    // 关闭订单
    closeOk () {
      let _this = this
      if (!this.closedReason) {
        _this.$message.error('请选择一个取消订单的理由')
        return
      }
      let params = {
        closedReason: this.closedReason,
        orderCode: this.info.orderCode
      }
      orderApi.closeOrder(params).then(res => {
        _this.doResult(res, '关闭订单成功')
      })
    },
    // 修改价格
    modPrice () {
      this.priceModel = true
      // let list = this.info.itemList
      // let all = 0
      // for (let i = 0, len = list.length; i < len; i++) {
      //   all += list[i].price * list[i].quantity
      // }
    },
    // 修改物流
    modLogic () {
      let comp = this.info.logistCompany
      this.logistother = this.info.waybill ? this.info.waybill.isOtherLogist : 0
      if (this.logistother) {
        this.formcomp = '其他'
        this.formcompname = comp
      } else {
        this.formcomp = comp
      }
      this.formlogistNum = this.info.logistNum
      this.deliverModel = true
      this.logistmodelname = '修改物流'
      this.logistmodeltype = 1
    },
    // 退款
    refund () {
      console.log('refund')
    },
    explain (column, event) {
      // console.log(column, event)
    },
    // 修改价格 提交
    modpriceOk () {
      let list = []
      this.info.itemList.forEach((item) => {
        list.push({itemId: item.itemId, price: item.changePrice})
      })
      let params = {
        orderCode: this.info.orderCode
      }
      list.forEach((item, index) => {
        params['priceChangeList[' + index + '].itemId'] = item.itemId
        params['priceChangeList[' + index + '].price'] = item.price
        // params['priceChangeList[' + index + '].freight'] = item.pricefeight
      })
      params['freight'] = this.priceFeight
      orderApi.doModPrice(params).then(res => {
        this.doResult(res, '修改价格成功')
      })
    },
    // 发货 提交 | 修改物流 提交
    deliverOk () {
      let _this = this
      if (!_this.selectarr.length) {
        _this.$message({
          type: 'info',
          message: `请选择商品`
        })
        return
      }
      let params = {
        orderCode: _this.info.orderCode,
        logistNum: _this.formlogistNum,
        logistCompany: _this.logistother ? _this.formcompname : _this.formcomp
      }
      // 修改物流
      if (_this.logistmodeltype) {
        params.isOtherLogist = _this.logistother
        orderApi.doModLogist(params).then(res => {
          _this.doResult(res, '修改物流成功')
        })
      // 发货
      } else {
        orderApi.doDeliver(params).then(res => {
          _this.doResult(res, '发货成功')
        })
      }
    },
    // 发货选择商品
    selectProduct (selection) {
      this.selectarr = selection
    },
    selectAll (selection) {
      this.selectarr = selection
    },
    // 发货选择物流
    selectComp () {
      let _this = this
      if (_this.formcomp === '其他') {
        _this.logistother = 1
      } else {
        _this.logistother = 0
      }
    },
    // 数量加减
    addNum (index, max) {
      let obj = this.info.itemList[index]
      if (max > obj.formnum) {
        obj.formnum++
      }
      Vue.set(this.info.itemList, index, Object.assign(obj, {formnum: obj.formnum}))
      // this.$store.commit('ORDERINFO', {orderInfo: this.info})
      let all = 0
      this.info.itemList.forEach((item) => {
        all += item.price * item.formnum
      })
      this.refundfm.refundAmountCal = all
    },
    reduceNum (index) {
      let obj = this.info.itemList[index]
      if (obj.formnum > 0) {
        obj.formnum--
      }
      Vue.set(this.info.itemList, index, Object.assign(obj, {formnum: obj.formnum}))
      let all = 0
      this.info.itemList.forEach((item) => {
        all += item.price * item.formnum
      })
      this.refundfm.refundAmountCal = all
    },
    // 修改价格-计算实付价格
    caluActPay (index) {
      let orig = 0
      let span = 0
      let feig = Number(this.priceFeight)
      this.info.itemList.forEach((item) => {
        let allprice = item.quantity * item.price // item.changePrice ? item.changePrice : item.price
        if (Number(item.changePrice) + allprice < 0) { // 减价加原价 小于0
          item.changePrice = '+0'
        }
        orig = orig + Number(allprice)
        if (item.changePrice.indexOf('+') === -1 && item.changePrice.indexOf('-') === -1) { // 没有加减符号
          if (!isNaN(item.changePrice)) {
            span = span + (+item.changePrice)
          }
        }
        let add = item.changePrice.split('+')
        if (add.length) {
          if (!isNaN(add[1])) {
            span = span + (+item.changePrice)
          }
        }
        let reduce = item.changePrice.split('-')
        if (reduce.length) {
          if (!isNaN(reduce[1])) {
            span = span - Number(reduce[1])
          }
        }
      })
      this.priceLastPay = (orig + feig + span).toFixed(2)
      // this.priceFeight = feig
      this.priceSpan = span < 0 ? ' - ' + Math.abs(span) : ' + ' + Math.abs(span)
      this.priceOPay = orig
    },
    doResult (res, text) {
      if (!res.data.code) {
        this.$message({
          type: 'success',
          message: text
        })
        setTimeout(function () {
          location.reload()
        }, 1000)
      } else {
        this.$message.error(res.data.message)
      }
    },
    timeCount () {
      let _this = this
      let interval = 1000
      function ShowCountDown (year, month, day) {
        let now = new Date()
        let endDate = new Date(year, month - 1, day)
        let leftTime = endDate.getTime() - now.getTime()
        let leftsecond = parseInt(leftTime / 1000)
        let day1 = Math.floor(leftsecond / (60 * 60 * 24))
        let hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600)
        let minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60)
        let second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60)
        // let cc = document.getElementById(divname)
        _this.restTime = day1 + '天' + hour + '小时' + minute + '分' + second + '秒'
      }
      if (!this.info.createTime) {
        _this.restTime = 0
        return
      }
      let d = _this.changeTime(this.info.createTime + 60 * 60 * 24 * 7 * 1000)
      if (d) {
        let interv = setInterval(function () {
          if (d[0] === 0 && d[1] === 0 && d[2] === 0) {
            clearInterval(interv)
          }
          ShowCountDown(d[0], +d[1], +d[2])
        }, interval)
      }
    },
    changeTime (value) {
      let time = new Date(value)
      let year = time.getFullYear()
      let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
      let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
      return [year, month, day]
    },
    zlip () {
      let input = document.getElementById('copyinput')
      input.select()
      document.execCommand('copy')
      this.$message.success('复制成功')
    },
    backToList () {
      this.$router.push({path: '/order'})
    },
    loadRongJs () {},
    // 查看物流
    showLogist (logNum) {
      /* eslint-disable */
      let logist = document.querySelector('#logist')
      if (logist.style.display === 'block') {
        logist.style.display = 'none'
      } else {
        YQV5.trackSingle({
            // 必须，指定承载内容的容器ID。
            YQ_ContainerId: 'logist',
            // 可选，指定查询结果高度，最大为800px，默认为560px。
            YQ_Height: 560,
            // 可选，指定运输商，默认为自动识别。
            YQ_Fc: '0',
            // 可选，指定UI语言，默认根据浏览器自动识别。
            YQ_Lang: 'en',
            // 必须，指定要查询的单号。
            YQ_Num: logNum
        })
      }
    }
  },
  watch: {
    info () {
      this.timeCount()
    }
  },
  computed: mapGetters({
    // info: 'orderInfo',
    comps: 'comps',
    logisList: 'logisList'
  }),
  created () {
    let _this = this
    orderApi.getInfo({orderCode: _this.$route.params.orderid}).then(res => {
      let rec = res.data.data
      let item = rec.itemList
      for (let i = 0, len = item.length; i < len; i++) {
        rec.itemList[i].formnum = 0
        // rec.itemList[i].pricespan = '+0'
        let cp = rec.itemList[i].changePrice
        rec.itemList[i].changePrice = cp < 0 ? cp : '+' + cp
        // rec.itemList[i].pricefeight = rec.totalCost
      }
      _this.priceFeight = rec.totalCost // 初始化运费
      _this.info = rec
      // if (rec.logistNum) { // 物流列表
      //   _this.$store.dispatch('getLogistList', rec.logistNum)
      //   // actions.getLogistList({ commit }, rec.logistNum)
      // }
      // 地址归类
      let addr = _this.info.address
      _this.info.address1 = addr.name +
          '(' + (_this.countryMap[addr.countryName] ? '+' + _this.countryMap[addr.countryName] : '') + ' ' + addr.telephone + ')'
      _this.info.address2 = addr.detailAddress + ',' +
          addr.city + ',' +
          addr.provinceName + ',' +
          addr.postcode + ',' +
          addr.countryName
      let inte = setInterval(() => {
        if (document.getElementById('copyinput')) {
          document.getElementById('copyinput').innerHTML = _this.info.address1 + '\n' +
          _this.info.address2
          clearInterval(inte)
        }
      }, 320)
    })
    this.$store.dispatch('getComp')
  }
}
</script>
<style lang='less'>
.el-table th{
  background-color: #f5f8fa;
  &>.cell{
    background-color: #f5f8fa;
  }
}
</style>
<style lang='less' scoped>
@import '../../assets/style/order.less';
@border: #dfe3eb;
// .router-view.order-detail-container{
//   margin: 68px auto 0 auto;
//   width: 1200px;
// }
.topMenu{
  display: none;
}
// 订单信息
.order-box{
  display: box;
  display: -webkit-box;
}
.order-info{
  width: 26%;
  box-flex: 1;
  -webkit-box-flex: 1;
  border-right: 1px solid @border;
  h1{
    padding: 14px 20px;
    font-size: 16px;
    background-color: #F5F8FA;
    color: @font-title-color;
    box-sizing: border-box;
  }
}
.order-state{
  width: 74%;
  box-flex: 1;
  -webkit-box-flex: 4;
}
.info-list{
  padding: 22px;
  color: @mainFontColor;
  font-size: 13px;
  li{
    min-height: 24px;
    line-height: 24px;
    p{
      line-height: 26px;
    }
    label{
      display: inline-block;
      width: 68px;
    }
  }
  .tit{
    margin-top: 20px;
    font-weight: bold;
  }
  span{
    text-align: left;
  }
  .ui-address{
  }
  .ui-buyer{
    margin: 20px 0;
    label{
      word-spacing: 21px;
    }
  }
}
.warm-tip{
  padding: 20px 15px;
  font-size: 13px;
  color: @mainFontColor;
  border-top: 1px solid @border;
  label{
    font-weight: bold;
  }
}
.state-box{
  position: relative;
  margin: 50px;
  padding-left: 40px;
  min-height: 288px;
  p{
    margin: 20px 0 30px 0;
    color: @mainFontColor;
  }
  .pos{
    margin-top: 30px;
  }
  .desc{
    line-height: 20px;
  }
  .el-button + .el-button{
    margin-left: -4px;
  }
}
.state-tit{
  font-size: 16px;
  [class^="icon"]{
    position: absolute;
    left: 0;
    top: -6px;
    font-size: 30px;
    font-weight: normal;
  }
  .icon-fail{
    color: #FF3B6E;
  }
  .icon-ok{
    color: #97D94E;
  }
  .icon-warn{
    color: @activeBlue;
  }
}
.btn-blue{
  margin-right: 10px;
}
.pay-fact{
  /*padding: 20px 30px 30px 0;*/
  padding: 14px 30px 14px 0;
  text-align: right;
  font-size: 14px;
  /*color: #f86563;*/
  label{
    color: @mainFontColor;
    font-size: 14px;
    font-weight: bold;
  }
  p{
    color: #33475B;
    line-height: 28px;
  }
  i{
    font-size: 16px;
  }
}
.order-list.order-detail{
  li{
    border-bottom: 0;
  }
  .double-tab{
    position: relative;
  }
  .double-td{
    width: 11%;
    min-height: 95px;
    border-right: 1px solid transparent;
    border-bottom: 1px solid @border;
  }
  .double-one{
    margin-bottom: 12px;
  }
  .double-span-item{
    width: 56%;
    padding: 20px 0 10px 99px;
  }
  .double-column{
    min-height: 95px;
    .double-td{
      padding-top: 16px;
    }
  }
  .double-header{
    .double-span-item{
      padding: 0 0 0 50px;
    }
    .double-td{
      min-height: 0;
      border-bottom: 0;
    }
  }
  .all-feight{
    /*position: relative;*/
    border-left: 1px solid @border;
    border-bottom: 0;
    span{
      position: absolute;
      top: 50%;
      right: 50px;
      margin-top: 15px;
    }
  }
  .last-feight{
    border-bottom: 1px solid @border;
  }
  /*.colspan{
    border-bottom: 1px solid @border;
  }*/
  // 订单详情的物流信息
  li.logistics-column{
    position: relative;
    padding-left: 20px;
    width: 87.4%;
    height: 35px;
    line-height: 35px;
    border-right: 1px solid @border;
    border-bottom: 1px solid @border;
    p{
      font-size: 13px;
    }
    span,b,i{
      margin-right: 10px;
    }
    .el-button--text i{
      margin-left: 10px;
    }
  }
}
.tit{
  .el-button--text{
    float: right;
  }
}
.blue-link{
  color: #5a8cf9;
}
.copy-txt{
  margin: -10px 0;
  min-height: 70px;
  height: auto;
  line-height: 24px;
  width: 100%;
  border: 0;
  text-align: left;
  overflow: hidden;
  color: #4F6D95;
  word-break: break-all;
  outline: none;
  resize: vertical;
  font-family: Source Han Sans CN Regular, PingFangSC-Regular, Microsoft YaHei;
}
.text-ellipsis(){
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.deliver-name{
  display: inline-block;
  width: 98%;
  /*.text-ellipsis()*/
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* autoprefixer: off*/
  -webkit-box-orient: vertical;
  /* autoprefixer: on*/
}
.orderDetail-container.logistic-container{
  overflow: inherit;
}
.logist-box{
  position: absolute;
  left: 280px;
  width: 500px;
  z-index: 9;
}
</style>
