<template>
<div class="profile-main">
  <div>
    <!--收件人-->
    <div class="adressee">
      <div class="loading loading-circle" v-if="isLoading.addressee" style="position: relative"></div>
      <div v-if="!isLoading.addressee">
        <div class="ad-name">收件人</div>
        <div class="ad-content">
          <p class="number" @click="toAddresee('all')">{{addresseeData.addresseeCount}}</p>
          <p>收件人(人)</p>
        </div>
        <div class="ad-bottom">
          <li>
            <p class="count" v-if="addresseeData.readLetter === 0">{{addresseeData.readLetter}}</p>
            <p class="count" v-else @click="toAddresee('read')" style="cursor: pointer">{{addresseeData.readLetter}}</p>
            <p class="desc">阅读(封)</p></li>
          <li>
            <p class="count" v-if="addresseeData.hitLetter === 0">{{addresseeData.hitLetter}}</p>
            <p class="count" v-else="" @click="toAddresee('click')" style="cursor: pointer">{{addresseeData.hitLetter}}</p>
            <p class="desc">点击(封)</p></li>
          <li>
            <p class="count" v-if="addresseeData.backedLetter === 0">{{addresseeData.backedLetter}}</p>
            <p class="count" v-else @click="toAddresee('noArr')" style="cursor: pointer">{{addresseeData.backedLetter}}</p>
            <p class="desc">未送达(封)</p></li>
        </div>
      </div>
    </div>
    <!--送达率-->
    <div class="del-rate">
      <div class="loading loading-circle" v-if="isLoading.addressee" style="position: relative;"></div>
      <div v-if="!isLoading.addressee">
        <div class="arrive-rate">
          <p class="rate-one"><span class="one-title">送达率</span><span class="one-progress">{{aboutRate.arriveRate}}%</span></p>
          <el-progress :text-inside="true" :stroke-width="8" :percentage="aboutRate.arriveRate" status="success"></el-progress>
          <p class="rate-one gap-top gap-bottom"><span class="one-status">送达成功</span><span class="one-num">{{aboutRate.arrriveSuccessed}}</span></p>
        </div>
        <div class="arrive-rate">
          <p class="rate-one"><span class="one-title">阅读率</span><span class="one-progress">{{aboutRate.readRate}}%</span></p>
          <el-progress :text-inside="true" :stroke-width="8" :percentage="aboutRate.readRate" status="success"></el-progress>
          <p class="rate-one gap-top"><span class="one-status">阅读次数</span><span class="one-num">{{aboutRate.readCount}}</span></p>
          <p class="rate-one gap-bottom">
            <span class="one-status">最近阅读时间</span>
            <span class="one-num" v-if="aboutRate.readRecentTime !== null && aboutRate.readRecentTime !== null">{{aboutRate.readRecentTime | time-formater-no-second}}</span>
            <span class="one-num" v-else>-</span>
          </p>
        </div>
        <div class="arrive-rate">
          <p class="rate-one"><span class="one-title">点击率</span><span class="one-progress">{{aboutRate.hitRate}}%</span></p>
          <el-progress :text-inside="true" :stroke-width="8" :percentage="aboutRate.hitRate" status="success"></el-progress>
          <p class="rate-one gap-top"><span class="one-status">点击次数</span><span class="one-num">{{aboutRate.hitCount}}</span></p>
          <p class="rate-one">
            <span class="one-status">最近点击时间</span>
            <span class="one-num" v-if="aboutRate.hitRecentTime !== null && aboutRate.hitRecentTime !== ''">{{aboutRate.hitRecentTime | time-formater-no-second}}</span>
            <span class="one-num" v-else="">-</span>
          </p>
        </div>
      </div>
    </div>
    <!--统计表-->
    <div class="Statistical" v-if="!allKind">
      <div class="common-title">昨日24小时统计表</div>
      <div class="statistical-chart" v-if="!mapControlShow">
        <div class="static-wraper">
          <div id="statist-chart" class="statist-chart"></div>
        </div>
        <div class="chart-title">
          <span><em class="read"></em>阅读数</span>
          <span><em class="hit"></em>点击数</span>
        </div>
      </div>
      <div class="statistical-table">
        <div class="loading loading-circle" v-if="isLoading.addressee" style="position: relative;"></div>
        <div v-if="!isLoading.addressee">
          <!--阅读排行榜-->
          <div class="readSort" v-if="readTop.length > 0">
            <p class="read-title">阅读次数排行榜 <span @click="toAddresee('read')">查看更多</span></p>
            <li v-for="(readItem, rIndex) in readTop">
              <span @click="toContactOfTop(readItem.personId)"><em>{{rIndex + 1}}.</em><em>{{readItem.firstname}}{{readItem.lastname}}</em><em>({{readItem.address}})</em></span>
              <span>阅读次数：<em>{{readItem.readCount}}</em></span>
            </li>
          </div>
          <!--点击排行榜-->
          <div class="readSort clickSort" v-if="hitTop.length > 0">
            <p class="read-title">点击次数排行榜 <span @click="toAddresee('click')">查看更多</span></p>
            <li v-for="(hitItem, hIndex) in hitTop" >
              <span @click="toContactOfTop(hitItem.personId)"><em>{{hIndex + 1}}.</em><em>{{hitItem.firstname}}{{hitItem.lastname}}</em><em>({{hitItem.address}})</em></span>
              <span>点击次数：<em>{{hitItem.hitCount}}</em></span>
            </li>
          </div>
        </div>
      </div>
    </div>
    <!--地图阅读分布-->
    <div class="read-worldMmap" v-if="!displayMap">
      <div class="common-title">地域概况—阅读邮件</div>
      <div class="read-data">
        <!--<div class="readMap-nodata readMap" v-if="displayMap">-->
          <!--<img src="../../../assets/img/nodata.png" width="78">-->
          <!--<br>-->
          <!--<br>-->
          <!--暂无数据-->
        <!--</div>-->
        <div class="readMap">
          <div class="static-wraper">
            <div class="read-map" id="read-map"></div>
          </div>
          <div class="read-table">
            <p><span>国家</span><span>占比</span></p>
            <div class="map-val"  v-for="item in readCountryStatistic">
              <li class="unit-map" v-if="readCountryStatistic.length < 5">
                <div class="img">
                  <!--<img src="" alt="">-->
                  <img :src="item.flag.flagSrc" alt="">
                </div>
                <span>{{item.country}}</span>
              </li>
              <li class="uv-rate">{{item.percent}}%</li>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--设备统计-->
    <div class="equipment">
      <div class="common-title">设备统计-阅读</div>
      <div class="equipment-data">
        <div class="loading loading-circle" v-if="isLoading.addressee" style="position: relative;"></div>
        <div v-if="!isLoading.addressee">
          <li>
            <img src="../../../../static/img/iMac.png" alt="">
            <p>电脑: <em>{{pcLetter}} 次</em> <em>({{pcPercent}}%)</em></p>
          </li>
          <li >
            <img src="../../../../static/img/iPad.png" alt="">
            <p>平板: <em>{{ipadLetter}} 次</em> <em>({{ipadPercent}}%)</em></p>
          </li>
          <li >
            <img src="../../../../static/img/iPhone.png" alt="">
            <p>手机: <em>{{iphoneLetter}} 次</em> <em>({{iphonePercent}}%)</em></p>
          </li>
        </div>
      </div>
    </div>
  </div>

</div>
</template>
<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/map/js/world'
  import 'echarts/lib/component/tooltip'
//  import webCountApi from '@/api/webCountApi'
  import emailMarketApi from '@/api/emailMarketApi'
  export default{
    props: {
      profilemailId: 0
    },
    data () {
      return {
        isLoading: {
          addressee: true
        },
        readRate: [],
        readMapRate: [],
        mapCount: [],
//        阅读次数排行榜
        readTop: [],
//        点击次数排行榜
        hitTop: [],
//        地域阅读分布
        readCountryStatistic: [],
//        设备数据信息
        readDeviceStatistic: [],
//        24小时统计
        hourStatistic: [],
//        收件人部分数据
        addresseeData: {
          addresseeCount: 0,
          readLetter: 0,
          hitLetter: 0,
          backedLetter: 0
        },
        aboutRate: {
          arriveRate: 0,
          arrriveSuccessed: 0,
          readRate: 0,
          readCount: 0,
          readRecentTime: 0,
          hitRate: 0,
          hitCount: 0,
          hitRecentTime: 0
        },
        pcLetter: 0,
        pcPercent: 0,
        ipadLetter: 0,
        ipadPercent: 0,
        iphoneLetter: 0,
        iphonePercent: 0,
        emailTitle: '',
        displayMap: false,
        allKind: false,
        mapControlShow: false
      }
    },
    mounted () {
//      数据合集
      this.allSeriesMail()
//      let params = {platform: 0, recentDays: 30}
//      this.statatisLine(params)
//      地图阅读数据
//      this.readMap()
    },
    methods: {
//      跳转到联系人详情页
      toContactOfTop (id) {
        window.open('#/contactDetail?contactId=' + id + '&contactType=0')
//        this.$router.push({
//          path: '/contactDetail',
//          query: {contactId: id, contactType: 0}
//        })
      },
      //      跳转收件人列表
      toAddresee (val) {
        this.$emit('toAddresee', val)
      },
//      接口数据合集
      allSeriesMail () {
        emailMarketApi.getmailSeriesAll({'mailMarketingId': this.profilemailId}).then((res) => {
          if (!res.data.code) {
            this.isLoading.addressee = false
            this.emailTitle = res.data.data.mailMarketingTitle
            this.$emit('getTitle', this.emailTitle)
            this.addresseeData.addresseeCount = res.data.data.totalCount
            this.addresseeData.readLetter = res.data.data.readCount
            this.addresseeData.hitLetter = res.data.data.hitCount
            this.addresseeData.backedLetter = res.data.data.unarriveCount
            this.aboutRate.arriveRate = res.data.data.arrivePer
            this.aboutRate.arrriveSuccessed = res.data.data.arriveCount
            this.aboutRate.readRate = res.data.data.readPer
            this.aboutRate.readCount = res.data.data.totalReadCount
            this.aboutRate.readRecentTime = res.data.data.latestReadTime
            this.aboutRate.hitRate = res.data.data.hitPer
            this.aboutRate.hitCount = res.data.data.totalHitCount
            this.aboutRate.hitRecentTime = res.data.data.latestHitTime
            this.readTop = res.data.data.readTop
            this.hitTop = res.data.data.hitTop
            this.readDeviceStatistic = res.data.data.readDeviceStatistic
            if ((this.readTop === null || this.readTop.length === 0) && (this.hitTop === null || this.hitTop.length === 0) && (this.hourStatistic === null || this.hourStatistic.length === 0)) {
              this.allKind = true
            }
            if (this.readDeviceStatistic !== null) {
              for (var i = 0; i < this.readDeviceStatistic.length; i++) {
                if (this.readDeviceStatistic[i].device === 'COMPUTER') {
                  this.pcLetter = this.readDeviceStatistic[i].count
                  this.pcPercent = this.readDeviceStatistic[i].percent
                }
                if (this.readDeviceStatistic[i].device === 'TABLET') {
                  this.ipadLetter = this.readDeviceStatistic[i].count
                  this.ipadPercent = this.readDeviceStatistic[i].percent
                }
                if (this.readDeviceStatistic[i].device === 'MOBILE') {
                  this.iphoneLetter = this.readDeviceStatistic[i].count
                  this.iphonePercent = this.readDeviceStatistic[i].percent
                }
              }
            }
            this.hourStatistic = res.data.data.hourStatistic
            if (this.hourStatistic !== null && this.hourStatistic.length > 0) {
              setTimeout(() => {
                this.initBorkenLine(this.hourStatistic)
              }, 100)
            } else {
              this.mapControlShow = true
            }
            if (res.data.data.readCountryStatistic !== null && res.data.data.readCountryStatistic.length > 0) {
              for (var j = 0; j < res.data.data.readCountryStatistic.length; j++) {
                let obj = {'flagSrc': '../../../../static/img/ImageFlag/' + res.data.data.readCountryStatistic[j].key + '.png'}
                res.data.data.readCountryStatistic[j]['flag'] = obj
              }
            }
            this.readCountryStatistic = res.data.data.readCountryStatistic
            if (res.data.data.readCountryStatistic !== null && res.data.data.readCountryStatistic.length > 0) {
              this.initreadMap(res.data.data.readCountryStatistic)
            } else {
              this.displayMap = true
            }
          }
        })
      },
      initBorkenLine (rateData) {
        let dataAxis = []
        let data1 = []
        let data2 = []
        for (var i = 0; i < rateData.length; i++) {
          data1.push(rateData[i].readCount)
          data2.push(rateData[i].hitCount)
          dataAxis.push(rateData[i].hour)
        }
        var yMax = 0
        var symbolSize = 8
        /**
         * 阴影 为最大值
         * @param  {[type]} let item          of data [description]
         * @return {[type]}     [description]
         */
        for (let item of data1) {
          yMax = (item > yMax ? item : yMax)
        }
        var dataShadow = []
        for (var j = 0; j < data1.length; j++) {
          dataShadow.push(yMax)
        }
        let opt = this.chartOption(dataAxis, dataShadow, data1, data2, ['#00B8CC', '#5045FB'], symbolSize)
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('statist-chart'))
        // 绘制图表
        myChart.setOption(opt)
      },
      chartOption (dataAxis, dataShadow, data1, data2, colorarr, symbolSize) {
        // y坐标留整数
        function xaxisfunc (params, idx) {
          if (params % 1 === 0) {
            return params
          } else {
            return null
          }
        }
        let option = {
          grid: {
            left: '3%',
            right: '3%',
            bottom: '17%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(150,150,150,0)'
              },
              show: true,
              label: {
                formatter: function (params) {
                  return params.value + ' : 00'
                }
              }
            }
          },
          xAxis: {
            data: dataAxis,
            axisLabel: {
              inside: false,
              textStyle: {
                fontSize: '13px',
                color: '#7C98B6',
                marginLeft: 40
              },
              formatter: function (params) {
                return params + ': 00'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              onZero: false,
              lineStyle: {
                color: '#5793f3'
              }
            },
            z: 10
          },
          yAxis: {
//            interval: 1,
            minInterval: 1,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#EAF0F6'
              }
            },
            min: 0,
            axisLabel: {
              margin: 10,
              textStyle: {
                color: '#7C98B6',
                fontSize: '12'
              },
              formatter: function (params, idx) {
                return xaxisfunc(params, idx)
              }
            }
          },
          series: [
            {
              name: '阅读数',
              type: 'line',
              symbol: 'emptyCircle',
              symbolSize: symbolSize,
              /**
               * 宽度是这边调整的
               * @type {String}
               */
//              barCategoryGap: '85%',
              showSymbol: true,
              hoverAnimation: true,
              smooth: false,
              itemStyle: {
                normal: {
                  color: colorarr[0]
                },
                emphasis: {
                  color: '#00B8CC',
                  borderColor: '#fff',
                  borderWidth: 4
                }
              },
              data: data1
            },
            {
              name: '点击数',
              type: 'line',
              symbol: 'emptyCircle',
              symbolSize: symbolSize,
              /**
               * 宽度是这边调整的
               * @type {String}
               */
              // barCategoryGap: '85%',
              showSymbol: true,
              hoverAnimation: true,
              smooth: false,
              itemStyle: {
                // normal: {color: 'rgba(0,0,0,0.05)'}
                normal: {
                  color: colorarr[1]
//                  areaStyle: {            // 系列级个性化折线样式，横向渐变描边
//                    type: 'default',
//                    color: colorarr[1]
//                  }
                },
                emphasis: {
                  borderColor: '#fff',
                  borderWidth: 4,
                  color: '#5045FB'
                }
              },
              data: data2
            }
          ]
        }
        return option
      },
      //      地图统计
      initreadMap (obj) {
        // console.log('OOOOOOO')
        // console.log(obj)
        // console.log(obj.key)
        let dataCountry = []
        for (var i = 0; i < obj.length; i++) {
          dataCountry.push({'name': obj[i].key, 'value': obj[i].percent})
        }
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              var res = params.name + '<br/>'
              var myseries = option.series
              for (var i = 0; i < myseries.length; i++) {
                for (var k = 0; k < myseries[i].data.length; k++) {
                  if (myseries[i].data[k].name === params.name) {
                    res += myseries[i].name + ' : ' + myseries[i].data[k].value + '%' + '<br/>'
                  }
                }
              }
              return res
            },
            backgroundColor: '#415B77',
            label: {
              formatter: function (params) {
                return params.value
              }
            },
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          },
          visualMap: {
            show: false,
            inRange: {
              color: ['#00B8CC']
            }
          },
          series: [
            {
              name: '占比',
              type: 'map',
              map: 'world',
              left: 75,
              top: 35,
              roam: false,
              zoom: 1,
              aspectScale: 0.75,
              regions: [{
                name: '中国',
                itemStyle: {
                  normal: {
                    areaColor: 'red',
                    color: 'red'
                  }
                }
              }],
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                    }
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 0.5,
                  borderColor: '#E5E5E5',
                  areaColor: '#F2F2F2'
                },
                emphasis: {
                  borderWidth: 0.5,
                  borderColor: '#E5E5E5',
                  areaColor: '#00B8CC'
                }
              },
              data: dataCountry
            }
          ]
        }
        let myChart = echarts.init(document.getElementById('read-map'))
        myChart.setOption(option)
      }
    }
}
</script>
<style lang="less" rel="stylesheet/less">
  .profile-main{
    width:1200px;
    margin: 0 auto;
    .common-title{
      width: 1170px;
      height: 68px;
      line-height: 68px;
      padding-left: 30px;
      font-size: 16px;
      color: #33475B;
      font-weight: bold;
      border-bottom: 1px solid  #DFE3EB;
    }
    .adressee{
      display: inline-block;
      width:590px;
      height: 420px;
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
      border-radius: 4px;
      .ad-name{
        padding-left: 30px;
        height: 68px;
        line-height: 68px;
        font-size: 16px;
        color: #33475B;
        font-weight: bold;
        border-bottom: 1px solid #EAF0F6;
      }
      .ad-content{
        height: 166px;
        width:100%;
        text-align: center;
        .number{
          /*margin-top: 60px;*/
          width:50%;
          height: 90px;
          line-height: 90px;
          font-size: 64px;
          color: #5488F9;
          font-weight: bold;
          cursor: pointer;
          margin: 60px 25% 0 25%;
        }
      }
      .ad-bottom{
        border-top: 1px solid #eaf0f6;
        li{
          float: left;
          width:33.33%;
          text-align: center;
          padding: 30px 0 40px 0;
          .count{
            font-size: 24px;
            color: #33475B;
            font-weight: bold;
          }
          .desc{
            font-size: 13px;
            color: #7C98B6;
            margin-top: 10px;
          }
        }
      }
    }
    .del-rate{
      display: inline-block;
      width:538px;
      height: 372px;
      padding: 24px 30px 24px 22px;
      margin-left: 16px;
      vertical-align: top;
      background: #FFFFFF;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
      border-radius: 4px;
      .el-progress-bar__inner{
        border: 1px solid #DFE3EB;
        border-radius: 100px;
        background: #5488F9;
        .el-progress-bar__innerText{
          color: #5488F9;
          visibility: hidden;
        }
      }
      .arrive-rate{
        .rate-one{
          margin-bottom: 18px;
          .one-title{
            font-size: 16px;
            color: #33475B;
            font-weight: bold;
          }
          .one-progress{
            font-size: 13px;
            color: #5488F9;
            float: right;
          }
          .one-status{
            font-size: 13px;
            color: #7C98B6;
          }
          .one-num{
            font-size: 13px;
            color: #33475B;
            float: right;
          }
        }
        .gap-top{
          margin-top: 18px;
        }
        .gap-bottom{
          margin-bottom: 38px;
        }

      }
    }
    .Statistical{
      width:100%;
      background: #fff;
      margin-top: 16px;
      .hour-nodata{
        text-align: center;
        position: relative;
        top:130px;
        margin-bottom: 264.5px;
      }
      .statistical-chart{
        width:100%;
        height: 370px;
        .statist-chart{
          width:100%;
          height: 330px;
        }
        .chart-title{
          text-align: center;
          font-size: 13px;
          color: #33475B;
          span:first-child{
            margin-right: 30px;
          }
          em{
            display: inline-block;
            width:8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .read{
            background: #00B8CC;
          }
          .hit{
            background: #5488F9;
          }
        }
      }
      .statistical-table{
        width:1140px;
        overflow: hidden;
        /*height: 408px;*/
        margin-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
        .readSort{
          width:560px;
          /*height: 410px;*/
          vertical-align: top;
          display: inline-block;
          padding-bottom: 8px;
          .readHit-nodata{
            position: relative;
            top:100px;
            text-align: center;
          }
          .read-title{
            padding-left: 20px;
            padding-right: 20px;
            width:520px;
            height: 44px;
            line-height: 44px;
            background: #F5F8FA;
            border: 1px solid #DFE3EB;
            border-bottom: none;
            border-radius: 2px;
            font-size: 13px;
            color: #4F6D95;
            font-weight: bold;
            span{
              float: right;
              font-size: 13px;
              color: #7C98B6;
              cursor: pointer;
            }
          }
          li{
            height: 72px;
            line-height: 72px;
            padding-left: 20px;
            padding-right: 20px;
            width:520px;
            border-top: 1px solid #DFE3EB;
            span:first-child{
              cursor: pointer;
              em:first-child{
                font-size: 18px;
                color: #00B8CC;
                font-weight: bold;
              }
              em:nth-child(2){
                font-size: 13px;
                color: #33475B;
                font-weight: bold;
                margin-left: 2px;
                margin-right: 2px;
              }
              em:last-child{
                font-size: 13px;
                color: #003E00;
              }
            }
            span:last-child{
              float: right;
              em:first-child{
                font-size: 13px;
                color: #003E00;
              }
              em:last-child{
                font-size: 14px;
                color: #150000;
              }
            }
            &:hover{
              background: #F5F8FA;
            }
          }

        }
        .clickSort{
          margin-left: 16px;
        }
      }
    }
    .read-worldMmap{
      margin-top: 23px;
      background: #fff;
      .read-data{
        position: relative;
        .readMap-nodata{
          text-align: center;
          position: relative;
          top:100px;
        }
        .readMap{
          width:100%;
          height: 335px;
          display: inline-block;
          .read-map{
            width:50%;
            height: 335px;
          }
        }
        .read-table{
          width:500px;
          height: 44px;
          position: absolute;
          top:0;
          right: 0;
          line-height: 44px;
          margin-right: 40px;
          font-size: 13px;
          color: #33475B;
          p:first-child{
            width:100%;
            height: 44px;
            margin-top: 20px;
            line-height: 44px;
            background: #F5F8FA;
            border: 1px solid #DFE3EB;
            span:first-child{
              display: inline-block;
              width:298px;
              padding-left: 20px;
              border-right: 1px solid #DFE3EB;
            }
            span:last-child{
              display: inline-block;
              width:180px;
              text-align: center;
            }

          }
          .map-val{
            width:100%;
            height: 50px;
            line-height: 50px;
            border: 1px solid #DFE3EB;
            border-top: none;
            li{
              float: left;
              height: inherit;
              font-size: 13px;
              color: #33475B;
            }
            .unit-map{
              width:298px;
              padding-left: 20px;
              position: relative;
              .img{
                border-radius: 8px;
                position: absolute;
                top:5px;
                img{
                  display: inline-block;
                  width:30px;
                  height: 20px;
                }
              }
              span{
                padding-left: 38px;
              }
            }
            .uv-rate{
              width:179px;
              text-align: center;
              border-left: 1px solid #DFE3EB;
            }
          }
        }
      }
    }
    .equipment{
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      margin-top: 16px;
      margin-bottom: 30px;
      .equipment-data{
        width:100%;
        height: 174px;
        line-height: 174px;
        li{
          width:33.33%;
          text-align: center;
          float: left;
          vertical-align: middle;
          position: relative;
          p{
            position: relative;
            top: -150px;
            height: 30px;
            font-size: 13px;
            color: #7C98B6;
            em:first-child {
              font-size: 16px;
              color: #150000;
            }
            em:last-child {
              font-size: 12px;
              color: #003E00;
            }
          }
          }
        }
      }
    }

</style>
