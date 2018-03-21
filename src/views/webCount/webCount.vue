<template>
  <div class="website-container">
    <!--流量概览-->
    <div class="count-flow">
      <div class="count-days">
        <em>流量概览:</em>
        <el-select v-model="flowDays" class="flow-source" @change="changeFlowDays">
          <el-option v-for="item in flowData"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="loading loading-circle" v-if="isLoading.flowLoading" style="position: relative;top: -150px; "></div>
      <div class="flow-data" v-if="!isLoading.flowLoading">
        <li><p class="data">{{pvSum}}</p><p class="name">浏览次数(PV)</p><span class="line"></span></li>
        <li><p class="data">{{uvSum}}</p><p class="name">独立访客(UV)</p><span class="line"></span></li>
        <li><p class="data">{{timeSum  | time-formater-second-hour}}</p><p class="name">平均访问时长(时:分:秒)</p><span class="line"></span></li>
        <li><p class="data">{{pageSum}}</p><p class="name">平均浏览页数</p><span class="line"></span></li>
        <li><p class="data">{{quirySum}}</p><p class="name">询盘量</p></li>
      </div>
    </div>
    <div class="line-chart">
      <div class="count-nodata" v-show="display1">
        <div class="nodata-tip">
          <img src="../../assets/img/monitor/no-post.png" alt="">
          <p>暂无数据</p>
        </div>
      </div>
      <div>
        <div class="data-line">
          <div class="line-title">
            <span class="date">{{dateDay}}</span>
            <span class="idp-uv"><i class="uv"></i>独立访客(UV)</span>
            <span class="borwse-pv"><i class="pv"></i>浏览次数(PV)</span>
          </div>
          <div class="loading loading-circle" v-if="isLoading.brokenLoading" style="position: relative; top: 50px;"></div>
          <div class="static-wraper" v-if="!isLoading.brokenLoading">
            <div id="borken-chart" class="static-chart"></div>
          </div>
        </div>
        <div class="data-table">
          <div class="count-nodata" v-show="display2">
            <div class="nodata-tip">
              <img src="../../assets/img/monitor/no-post.png" alt="">
              <p>暂无数据</p>
            </div>
          </div>
          <ul>
            <li class="top-title space-label"></li>
            <li class="top-title browse-count">浏览次数 (PV) </li>
            <li class="top-title idp-count">独立访客 (UV) </li>
            <li class="top-title ip">IP</li>
            <li class="top-title avr-time">平均访问时长(时:分:秒)</li>
            <li class="top-title avr-page">人均浏览页数</li>
          </ul>
          <div class="loading loading-circle" v-if="isLoading.tabletop" style="position: relative; top: 50px;"></div>
          <ul v-for="item in comprehensiveData" v-if="!isLoading.tabletop">
            <li class="top-val label-val">
              <span>{{item.type}}</span>
            </li>
            <li class="top-val browse-val">{{item.pv}}</li>
            <li class="top-val idp-val">{{item.uv}}</li>
            <li class="top-val ip-val">{{item.ip}}</li>
            <li class="top-val time-val">{{item.averageUvTime | time-formater-second-hour}}</li>
            <li class="top-val page-val">{{item.averagePvNum}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!--地区分布图-->
    <div class="map1-chart">
      <!--<div class="loading loading-circle" v-if="isLoading.flowMap" style="position: relative; top: 200px;"></div>-->
     <div >
       <div class="source">
         <em>地区分布:</em>
         <el-select v-model="mapValue" class="source-choose" @change="changeMapDays">
           <el-option v-for="item in mapData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
           </el-option>
         </el-select>
       </div>
       <div class="map-world">
         <div class="mapChart">
           <div class="static-wraper">
             <div class="map-chart" id="map-chart"></div>
           </div>
         </div>
         <div class="map-table">
           <div class="map-title">
             <li class="country">国家</li>
             <li class="present">占比</li>
             <li class="seeCount" v-show="showPU">浏览次数</li>
             <li class="seeCount" v-show="!showPU">独立访客</li>
           </div>
           <div class="map-data" v-for="item in countryCount">
             <li class="country-val">
               <div class="img">
                 <img :src="item.flag.flagSrc" alt="">
               </div>
               <span>{{item.name}}</span>
             </li>
             <li class="present-val" v-show="showPU">{{item.presentpv.present}}%</li>
             <li class="present-val" v-show="!showPU">{{item.presentuv.present}}%</li>
             <li class="see-val" v-show="showPU">{{item.pvCount}}</li>
             <li class="see-val" v-show="!showPU">{{item.uvCount}}</li>
           </div>
         </div>
       </div>
     </div>
    </div>
    <div class="pie-chart">
        <div class="source">
          <em>来源:</em>
          <el-select v-model="value" class="source-choose" @change="changeDay">
            <el-option v-for="item in sourceData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!--暂无数据-->
        <div class="bTable" v-show="displayBottom">
          <div class="nodata-tip">
            <img src="../../assets/img/monitor/no-post.png" alt="">
            <p>暂无数据</p>
          </div>
        </div>
        <div class="loading loading-circle" v-if="isLoading.cirLoading" style="position: relative; top: 100px;"></div>
        <div v-if="!isLoading.cirLoading">
          <!--饼状图-->
          <div v-if="cirNoData">
            <div class="cir-nodata">
              <span>暂无数据</span>
            </div>
          </div>
          <div class="cirChart">
            <div class="static-wraper">
              <div class="cir-chart" id="cir-chart"></div>
            </div>
          </div>
          <div class="table-chart">
            <ul>
              <li class="chart-label label1">来源</li>
              <li class="chart-label label2">浏览次数 (PV) </li>
              <li class="chart-label label3">独立访客 (UV) </li>
              <li class="chart-label label4">平均访问时长(时:分:秒)</li>
            </ul>
            <ul v-for="(item,index) in sourceCountData" class="ul-hover">
              <li class="chart-value val-source">
                <span v-if="index === 0"><i class="fb"></i>Facebook</span>
                <span v-if="index === 1"><i class="tw"></i>Twitter</span>
                <span v-if="index === 2"><i class="ln"></i>领英</span>
                <span v-if="index === 3"><i class="pt"></i>Pinterest</span>
                <span v-if="index === 4"><i class="qt"></i>其他</span>
              </li>
              <li class="chart-value val-browse">{{item.pv}}</li>
              <li class="chart-value val-visitor">{{item.uv}}</li>
              <li class="chart-value val-average">{{item.viewDuration | time-formater-second-hour}}</li>
            </ul>
          </div>
        </div>
    </div>
    <div class="productList">
      <div class="product-top">
        <em>产品流量:</em>
        <el-select v-model="productValue" class="source-choose" @change="changeProductDay">
          <el-option v-for="item in productData"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="loading loading-circle" v-if="isLoading.productLoading" style="position: relative; top: -100px;"></div>
      <div class="AllProduct" v-if="!isLoading.productLoading">
        <el-table class="p-table" width="100%" :data="flowProduct">
          <el-table-column label="产品名称" width="430">
            <template  scope="scope">
              <div class="P-name">
                <img :src="`${scope.row.productImg}?x-oss-process=image/resize,h_36`" alt="">
                <a :href="homepage + '/detail?productId='+scope.row.productId+'&shopId='+shopId" target="_blank"><span class="img-name">{{scope.row.productName}}</span></a>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="浏览次数(pv)" sortable prop="pv" width="195">
            <template scope="scope">
                <span  class="borwse browsePv">
                  {{scope.row.pv}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="独立访客(UV)" sortable prop="uv" width="225">
            <template scope="scope">
                <span class="borwse browseUv">
                  {{scope.row.uv}}
                </span>
            </template>
          </el-table-column>
          <el-table-column label="平均访问时长(时:分:秒)" sortable prop="averageUvTime" width="228">
            <template scope="scope">
                  <span class="borwse browseTime">
                    {{scope.row.averageUvTime | time-formater-second-hour}}
                  </span>
            </template>
         </el-table-column>
          <el-table-column label="询盘量" sortable width="121" prop="msgProductCount">
            <template scope="scope">
                <span class="borwse browseProduct">
                  {{scope.row.msgProductCount}}
                </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="product-page">
          <el-pagination v-if="flowProduct && flowProduct.length && flowPPage.totalCount > 10"
            layout="prev, pager, next"
            @current-change="productCurrentChange"
            :current-page="flowPPage.page"
            :page-size="flowPPage.pageSize"
            :total="flowPPage.totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  // import 'echarts/map/js/world'
  import 'echarts/lib/component/tooltip'
  import webCountApi from '@/api/webCountApi'
  import IndexAPI from '@/api/indexAPI'
  export default {
    name: 'webCount',
    data () {
      return {
        homepage: process.env.HOMEPAGE,
        shopId: window.localStorage.shopId,
//        流量概览
        pvSum: 0,
        uvSum: 0,
        timeSum: 0,
        pageSum: 0,
        quirySum: 0,
        cirNoData: false,
        display: false,
        display1: false,
        display2: false,
        displayBottom: false,
        showPU: true,
        isLoading: {
//          使用时为true
          flowMap: true,
          brokenLoading: true,
          cirLoading: true,
          tabletop: true,
          flowLoading: true,
          productLoading: true
        },
        sourceData: [{
          value: 0,
          label: '最近7天'
        }, {
          value: 1,
          label: '最近30天'
        }],
        productData: [{
          value: 0,
          label: '最近7天'
        }, {
          value: 1,
          label: '最近30天'
        }],
        flowData: [
          {
            value: 0,
            label: '最近7天'
          }, {
            value: 1,
            label: '最近30天'
          }],
        mapData: [
          {
            value: 0,
            label: '浏览次数(PV)'
          }, {
            value: 1,
            label: '独立访客(UV)'
          }],
        value: 0,
        flowDays: 0,
        mapValue: 0,
        productValue: 0,
        countryCount: [],
        comprehensiveData: [],
        sourceCountData: [],
        dateDay: new Date(),
        source: [],
        pvUvData: [],
        flowProduct: [],
        flowPPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        flowPDefault: 7,
        sumNum: 0,
        borwseFlow: [],
        currDayFlow: 7,
        flowPvSum: 0,
        flowUvSum: 0
      }
    },
    mounted () {
      this.dateDay = this.dateDay.getFullYear() + '年' + (this.dateDay.getMonth() + 1) + '月' + this.dateDay.getDate() + '日'
//      折线图获取数据
      let params = {platform: 0, recentDays: 30}
      this.brokenLine(params)
//      综合统计获取数据
      this.comprehensive(params)
//      来源统计获取数据
//      this.sourceCount(params)
      let param = {platform: 0, recentDays: 7}
      this.initPie(param)

//      流量概览
      this.flowSum()
//      产品流量
      this.flowAllProduct()
      console.log('PPPPPPPPP')
//      var rgx = /(\d+)(\d{3})/
      console.log(parseFloat(12).toLocaleString())
//      this.cutStr()
      // world插件太大，分割打包
      import('echarts/map/js/world').then(module => {
        this.MapCount()
      })
    },
    methods: {
      cutStr (str) {
        var newStr = new Array(str.length + parseInt(str.length / 3))
        var strArray = str.split('')
        newStr[newStr.length - 1] = strArray[strArray.length - 1]
        var currentIndex = strArray.length - 1
        for (var index = newStr.length - 1; index >= 0; index--) {
          if ((newStr.length - index) % 4 === 0) {
            newStr[index] = ','
          } else {
            newStr[index] = strArray[currentIndex--]
          }
        }
        return newStr.join('')
      },
//      页数改变触发
      productCurrentChange (page) {
        this.isLoading.productLoading = true
        this.flowPPage.page = page
        this.flowAllProduct()
      },
      changeProductDay (value) {
        if (value === 0) {
          this.flowPDefault = 7
        }
        if (value === 1) {
          this.flowPDefault = 30
        }
        this.isLoading.productLoading = true
        this.flowAllProduct()
      },
//      产品流量
      flowAllProduct () {
        let params = {
          recentDays: this.flowPDefault,
          platform: 0,
          page: this.flowPPage.page,
          size: this.flowPPage.pageSize
        }
        webCountApi.getAllProduct(params).then((res) => {
          this.isLoading.productLoading = false
          if (!res.data.code) {
            if (res.data.data.records.length > 0) {
              this.flowProduct = res.data.data.records
              this.flowPPage.totalCount = res.data.data.totalCount
            }
          }
        })
      },
//      流量概览
      flowSum () {
        if (this.flowDays === 0) {
          this.currDayFlow = 7
        } else {
          this.currDayFlow = 30
        }
        let param = {'recentDays': this.currDayFlow, 'platform': 0}
        IndexAPI.getFlowCount(param).then((res) => {
          this.isLoading.flowLoading = false
          if (!res.data.code) {
            let data = res.data.data
            this.pvSum = data.sumPv
            this.uvSum = data.sumUv
            this.timeSum = data.averageUvTime
            this.pageSum = data.averagePvNum
            this.quirySum = data.msgProductCount
          }
        })
      },
//      综合数据
      comprehensive (params) {
        webCountApi.getComphsive(params).then((res) => {
          this.isLoading.tabletop = false
          if (res.data.code === 0) {
            this.comprehensiveData = res.data.data
          } else {
            this.display2 = true
          }
        })
      },
//      获取来源统计
//      sourceCount (params) {
//        webCountApi.getSource(params).then((res) => {
//          this.isLoading.cirLoading = false
//          if (res.data.code === 0) {
//            console.log(res)
//            this.sourceCountData = res.data.data
//            let fb = this.sourceCountData[0].pv
//            let tw = this.sourceCountData[1].pv
//            let ln = this.sourceCountData[2].pv
//            let pt = this.sourceCountData[3].pv
//            let qt = this.sourceCountData[4].pv
//            this.initPie(fb, tw, ln, pt, qt)
//          }
//        })
//      },
//      更换天数
      changeDay (value) {
        this.isLoading.cirLoading = true
        let params = {platform: 0, recentDays: 7}
//        展示七天的数据
        // if (value === 0) {
        //   let params = {platform: 0, recentDays: 7}
        // }
//        展示30天的数据
        if (value === 1) {
          params.recentDays = 30
        }
        this.initPie(params)
      },
//      流量概览天数更改
      changeFlowDays (value) {
        this.isLoading.flowLoading = true
        this.flowDays = value
        this.flowSum()
      },
//      地区分布更改
      changeMapDays (value) {
        if (value === 0) {
          this.showPU = true
        }
        if (value === 1) {
          this.showPU = false
        }
        this.initMap(this.countryCount)
      },
      brokenLine (params) {
        webCountApi.getPvUv(params).then((res) => {
          this.isLoading.brokenLoading = false
          if (res.data.code === 0) {
            let curData = res.data.data
            for (var obj in curData) {
              this.pvUvData.push(curData[obj])
            }
            /**
             * 初始化表格数据
             */
            setTimeout(() => {
              this.initTable(this.pvUvData)
            }, 100)
          } else {
            this.display1 = true
          }
        })
      },
//      折线图统计
      initTable (pvUvData) {
        let dataAxis = []
        let data1 = []
        let data2 = []
        for (var i = 0; i < pvUvData.length; i++) {
          data1.push(pvUvData[i].pv)
          data2.push(pvUvData[i].uv)
          dataAxis.push(pvUvData[i].date)
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
        var myChart = echarts.init(document.getElementById('borken-chart'))
        // 绘制图表
        myChart.setOption(opt)
      },
      chartOption (dataAxis, dataShadow, data1, data2, colorarr, symbolSize) {
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
                  return params.value
                }
              }
            }
            // formatter: function (params) {
            //   var tar = params[1]
            //   console.log(params)
            //   return tar.value
            // }
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
              interval: function (index, value) {
                if (index % 2 === 0) {
                  return true
                }
                if (value === dataAxis[dataAxis.length - 1]) {
                  return true
                }
              },
//              rotate: 45
              formatter: function (params) {
                return params.split('-')[1] + '-' + params.split('-')[2]
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
//            max: 500,
//          plitNumber: 100,
            axisLabel: {
              margin: 10,
              textStyle: {
                color: '#7C98B6',
                fontSize: '12'
              }
            }
          },
//          dataZoom: [
//            {
//              type: 'inside'
//            }
//          ],
          series: [
            {
              name: '独立访客(UV)',
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
                // normal: {color: 'rgba(0,0,0,0.05)'}
                normal: {
                  color: colorarr[0]
//                  areaStyle: {            // 系列级个性化折线样式，横向渐变描边
//                    type: 'default',
//                    color: colorarr[1]
//                  }
                },
                emphasis: {
                  color: '#00B8CC',
                  borderColor: '#fff',
                  borderWidth: 4
                }
              },
              data: data2
            },
            {
              name: '浏览次数(PV)',
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
              data: data1
            }
          ]
        }
        return option
      },
//      获取地图统计数据
      MapCount () {
        webCountApi.getCountryCount().then((res) => {
          this.isLoading.flowMap = false
          if (!res.data.code) {
            for (var i = 0; i < res.data.data.length; i++) {
              this.flowPvSum += res.data.data[i].pvCount
              this.flowUvSum += res.data.data[i].uvCount
              console.log(this.flowPvSum)
            }
            for (var j = 0; j < res.data.data.length; j++) {
              let obj1 = {}
              let obj2 = {}
//              if (res.data.data.length === 1) {
//                obj1 = {'present': 100}
//                obj2 = {'present': 100}
//              } else {
              obj1 = {'present': ((res.data.data[j].pvCount / this.flowPvSum) * 100).toFixed(2)}
              obj2 = {'present': ((res.data.data[j].uvCount / this.flowUvSum) * 100).toFixed(2)}
//              obj1 = {'present': Math.round(((res.data.data[j].pvCount / this.flowPvSum) * 100) * 100 / 100)}
//              obj2 = {'present': Math.round(((res.data.data[j].uvCount / this.flowPvSum) * 100) * 100 / 100)}
//              }
              let obj3 = {'flagSrc': '../../../static/img/ImageFlag/' + res.data.data[j].nameEn + '.png'}
              res.data.data[j]['presentpv'] = obj1
              res.data.data[j]['presentuv'] = obj2
              res.data.data[j]['flag'] = obj3
            }
            if (res.data.data.length < 5) {
              this.countryCount = res.data.data
            } else {
              this.countryCount = res.data.data.slice(0, 5)
            }

            this.initMap(this.countryCount)
          }
        })
      },
//      地图统计
      initMap (obj) {
        let dataCountry = []
        let dataCountry1 = []
        for (var i = 0; i < obj.length; i++) {
          if (this.showPU === true) {
            dataCountry.push({'name': obj[i].nameEn, 'value': obj[i].pvCount})
            dataCountry1.push({'name': obj[i].nameEn, 'value': obj[i].presentpv.present + '%'})
          } else {
            dataCountry.push({'name': obj[i].nameEn, 'value': obj[i].uvCount})
            dataCountry1.push({'name': obj[i].nameEn, 'value': obj[i].presentuv.present + '%'})
          }
        }
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              var res = params.name + '<br/>'
              var myseries = option.series
              for (var i = 0, len = myseries.length; i < len; i++) {
                let item = myseries[i]
                for (var k = 0, len2 = myseries[i].data.length; k < len2; k++) {
                  if (item.data[k].name === params.name) {
                    res += item.name + ' : ' + item.data[k].value + '<br/>'
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
              name: '浏览',
              type: 'map',
              map: 'world',
              left: 75,
              top: 55,
              roam: false,
              zoom: 1,
              aspectScale: 0.75,
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
            },
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
              data: dataCountry1
            }
          ]
        }
        let myChart = echarts.init(document.getElementById('map-chart'))
        myChart.setOption(option)
      },
//      饼状图统计
      initPie (params) {
        let sourceArr = [0, 0, 0, 0, 0]
        this.sourceCountData = []
        this.isLoading.cirLoading = false
        webCountApi.getSource(params).then((res) => {
//          let sourceName = []
          if (!res.data.code) {
            this.source = res.data.data
//            this.sourceCountData = JSON.parse(this.sourceCountData)
            // this.sourceCountData.push(this.source['1'])
            // this.sourceCountData.push(this.source['2'])
            // this.sourceCountData.push(this.source['3'])
            // this.sourceCountData.push(this.source['4'])
            // this.sourceCountData.push(this.source['0'])
            this.sourceCountData = [this.source['1'], this.source['2'], this.source['3'], this.source['4'], this.source['0']]
            for (let i = 0; i < 5; i++) {
              if (this.source[i + ''].pv === 0) {
                this.sumNum++
                sourceArr[i] = undefined
              } else {
                sourceArr[i] = this.source[i + ''].pv
              }
            }
            // if (this.source['0'].pv === 0) {
            //   this.sumNum++
            //   sourceArr[0] = undefined
            // } else {
            //   sourceArr[0] = this.source['0'].pv
            // }
            // if (this.source['1'].pv === 0) {
            //   this.sumNum++
            //   sourceArr[1] = undefined
            // } else {
            //   sourceArr[1] = this.source['1'].pv
            // }
            // if (this.source['2'].pv === 0) {
            //   this.sumNum++
            //   sourceArr[2] = undefined
            // } else {
            //   sourceArr[2] = this.source['2'].pv
            // }
            // if (this.source['3'].pv === 0) {
            //   this.sumNum++
            //   sourceArr[3] = undefined
            // } else {
            //   sourceArr[3] = this.source['3'].pv
            // }
            // if (this.source['4'].pv === 0) {
            //   this.sumNum++
            //   sourceArr[4] = undefined
            // } else {
            //   sourceArr[4] = this.source['4'].pv
            // }
            let option = {
              tooltip: {
                trigger: 'item',
//                formatter: '{b} : ({d}%)'
                formatter: function (params) {
                  return params.name + ' : ' + params.value + ' (' + (params.percent - 0).toFixed(2) + '%)'
                }
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                show: false
//                data: ['Facebook', 'Twitter', '领英', 'Pinterest', '其他']
//                data: sourceName
              },
              toolbox: {
                show: false
              },
              calculable: true,
              series: [
                {
                  name: '2222',
                  type: 'pie',
//              控制区块的hover
                  showSymbol: true,
                  hoverAnimation: true,
                  radius: '65%',
                  center: ['50%', '48%'],
                  itemStyle: {
                    normal: {
                      label: {
                        show: function (value) {
                          if (value === 0) return false
                        },
                        // position: 'inner',
                        formatter: function (params) {
                          return (params.percent - 0).toFixed(2) + '%'
                        }
                      },
                      labelLine: {
                        show: function (value) {
                          if (value === 0) return false
                        }
                      }
                    }
                  },
                  data: [
                    {value: sourceArr[1], name: 'Facebook'},
                    {value: sourceArr[2], name: 'Twitter'},
                    {value: sourceArr[3], name: '领英'},
                    {value: sourceArr[4], name: 'Pinterest'},
                    {value: sourceArr[0], name: '其他'}
                  ],
                  color: ['#5488F9', '#00b8cc', '#FB509F', '#FCA21D', '#B3D517']  // 饼图颜色
                }
              ]
            }
            // let opt = this.chartOption(['#5488F9', '#f3f7ff'])
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('cir-chart'))
            // 绘制图表
            myChart.setOption(option)
            console.log(option)
            if (this.sumNum === 5) {
              this.cirNoData = true
            } else {
              this.cirNoData = false
            }
          } else {
            this.displayBottom = false
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import '../../assets/style/variable';
  @import '../../assets/style/page';
  // @import '../../assets/style/loading.css';
  .website-container {
    .count-nodata{
      width: 100%;
      height: 455px;
      .nodata-tip{
        text-align: center;
        padding-top: 300px;
        img{
          margin-bottom: 10px;
        }
      }
    }
    .count-flow{
      width:100%;
      height: 242px;
      margin-top: 16px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      .count-days{
        height: 66px;
        line-height: 66px;
        border-bottom: 1px solid #DFE3EB;
        padding-left: 30px;
        em{
          font-weight: bold;
          font-size: 16px;
          color: #33475B;
        }
        .flow-source{
          margin-left: 8px;
          .el-input{
            .el-input__inner{
              width: 160px;
              height: 34px;
            }
          }
        }
      }
      .flow-data{
        width:1200px;
        padding-top: 46px;
        li{
          width:20%;
          float: left;
          .data{
            text-align: center;
            font-size: 40px;
            color: #33475B;
          }
          .line{
            width:2px;
            height: 60px;
            background: #EAF0F6;
            display: inline-block;
            position: relative;
            top: -69px;
            left:240px;
          }
          .name{
            text-align: center;
            font-size: 13px;
            color: #7C98B6;
            margin-top: 16px;
          }
        }
      }
    }
    .line-chart{
      width: 100%;
      height: 870px;
      margin-top: 16px;
      margin-bottom: 30px;
      background: white;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      .data-line{
        width:100%;
        height: 455px;
        .line-title{
          width:100%;
          /*height: 46px;*/
          padding-top: 48px;
          text-align: center;
          font-size: 13px;
          color: #33475B;
          .date{
            padding-right: 29px;
          }
          .idp-uv{
            padding-right: 16px;
            .uv{
              display: inline-block;
              width:8px;
              height: 8px;
              border-radius: 50%;
              background: #00B8CC;
              margin-right: 10px;
            }
          }
          .borwse-pv{
            .pv{
              display: inline-block;
              width:8px;
              height: 8px;
              border-radius: 50%;
              background: #5488F9;
              margin-right: 10px;
            }
          }
        }
        .static-chart{
          width:100%;
          height: 395px;
          div{
            /*width:100px;*/
            /*height: 500px;*/
          }
        }
      }
      .data-table{
        width:100%;
        ul{
          .top-title{
            float: left;
            height: 44px;
            line-height: 44px;
            font-size: 13px;
            color: #4F6D95;
            background: #F5F8FA;
            font-weight: bold;
            border-top: 1px solid #DFE3EB;
          }
          .space-label{
            width:252px;
          }
          .browse-count{
            width:177px;
          }
          .idp-count{
            width:220px;
          }
          .ip{
            width:155px;
          }
          .avr-time{
            width:199px;
          }
          .avr-page{
            width:197px;
          }
          .top-val{
            float: left;
            height: 72px;
            line-height: 72px;
            font-size: 13px;
            color: #33475B;
            border-top: 1px solid #DFE3EB;
          }
          .label-val{
            width:252px;
            text-align: center;
            color: #5488F9;
          }
          .browse-val{
            width:85px;
            text-align: center;
            padding-right: 82px;
          }
          .idp-val{
            width:107px;
            text-align: center;
            padding-right: 84px;
          }
          .ip-val{
            width:90px;
            text-align: center;
            padding-right: 104px;
          }
          .new-val{
            width:65px;
            text-align: center;
            padding-right: 128px;
          }
          .time-val{
            width:98px;
            text-align: center;
            padding-right: 101px;
          }
          .page-val{
            width:78px;
            text-align: center;
            padding-right: 119px;
          }

        }
      }
    }
    .map1-chart{
      width:100%;
      height: 400px;
      margin-bottom: 16px;
      background: #FFFFFF;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      .source{
        height: 66px;
        line-height: 66px;
        border-bottom: 1px solid #DFE3EB;
        padding-left: 30px;
        em{
          font-weight: bold;
          font-size: 16px;
          color: #33475B;
        }
        .source-choose{
          margin-left: 8px;
          .el-input{
            .el-input__inner{
              width:160px;
              height: 34px;
            }
          }
        }
      }
      .map-world{
        width: 100%;
        height: 333px;
        .mapChart{
          width:50%;
          height: inherit;
          display: inline-block;
          .static-wraper{
            .map-chart{
              height: 333px;
              box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15)
            }
          }
        }
        .map-table{
          width:498px;
          height: 290px;
          display: inline-block;
          vertical-align: top;
          margin: 20px 40px 0 56px;
          .map-title{
            width:100%;
            height: 44px;
            line-height: 44px;
            background: #F5F8FA;
            border: 1px solid #DFE3EB;
            li{
              float: left;
              font-size: 13px;
              color: #33475B;
            }
            .country{
              width:200px;
              padding-left: 20px;
            }
            .present{
              width:135px;
              text-align: center;
              border-left: 1px solid #DFE3EB;
              border-right: 1px solid #DFE3EB;
            }
            .seeCount{
              width:132px;
              text-align: center;
            }
          }
          .map-data{
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
            .country-val{
              width:200px;
              padding-left: 20px;
              position: relative;
              .img{
                /*width:30px;*/
                /*height: 20px;*/
                /*overflow: hidden;*/
                border-radius: 8px;
                /*background: pink;*/
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
            .present-val{
              width:135px;
              text-align: center;
              border-left: 1px solid #DFE3EB;
              border-right: 1px solid #DFE3EB;
            }
            .see-val{
              width:132px;
              text-align: center;
            }
          }
        }
      }
    }
    .pie-chart{
      width: 100%;
      height: 370px;
      background: white;
      margin-bottom: 30px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      position: relative;
      .cir-nodata{
        position: absolute;
        top:110px;
        left:135px;
        width:200px;
        height: 200px;
        border-radius: 50%;
        background: #EAF0F6;
        color:  #7C98B6;
        font-size: 18px;
        span{
          position: absolute;
          top:45%;
          left:31%;
        }
      }
      .bTable{
        .nodata-tip{
         text-align: center;
         margin-top: 90px;
          p{
            margin-top: 10px;
          }
        }
      }
      .source{
        height: 66px;
        line-height: 66px;
        border-bottom: 1px solid #DFE3EB;
        padding-left: 30px;
        em{
          font-weight: bold;
          font-size: 16px;
          color: #33475B;
        }
        .source-choose{
          margin-left: 8px;
          .el-input{
            .el-input__inner{
              width:160px;
              height: 34px;
            }
          }
        }
      }
      .cirChart{
        width:480px;
        height: 302px;
        float: left;
        /*border-right:1px solid #DFE3EB;*/
        .cir-chart{
          width: 100%;
          height: 302px;
        }
      }
      .table-chart{
        float: right;
        width:709px;
        border-left: 1px solid #DFE3EB;
        ul{
          width:100%;
          .chart-label{
            float: left;
            height: 46px;
            line-height: 46px;
            background: #F5F8FA;
            font-size: 13px;
            color: #4F6D95;
            font-weight: bold;
          }
          .label1{
            width:168px;
            padding-left:57px;
          }
          .label2{
            width:160px;
          }
          .label3{
            width:172px;
          }
          .label4{
            width:152px;
          }
          .chart-value{
            height: 48px;
            line-height: 48px;
            font-size: 13px;
            color: #33475B;
            float: left;
            /*font-weight: bold;*/
            border-top: 1px solid #DFE3EB;
          }
          .val-source{
            padding-left: 30px;
            padding-right: 121px;
            span{
              width:74px;
              display: inline-block;
              text-align: center;
              i{
                display: inline-block;
                width:6px;
                height: 6px;
                border-radius: 2px;
                margin-right: 5px;
                position: relative;
                top:-1.5px;
              }
              .fb{
                background: #5488F9;
              }
              .tw{
                background: #00B8CC;
              }
              .ln{
                background: #FB509F;
              }
              .pt{
                background: #FCA21D;
              }
              .qt{
                background: #B3D517;
              }
            }
          }
          .val-browse{
            width:85px;
            text-align: center;
            padding-right: 63px;
          }
          .val-visitor{
            width:112px;
            text-align: center;
            padding-right: 72px;
          }
          .val-average{
            width:108px;
            height: 51px;
            text-align: center;
            padding-right: 44px;
          }
        }
      }
    }
    .productList{
      margin-bottom: 33px;
      width:100%;
      /*height: 950px;*/
      background: #FFFFFF;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      .product-top{
        width:1160px;
        height: 74px;
        line-height: 74px;
        margin: 0 20px;
        padding-left: 10px;
        border-bottom: 2px solid #EAF0F6;
        em{
          font-weight: bold;
          font-size: 16px;
          color: #33475B;
        }
        .source-choose{
          margin-left: 8px;
          .el-input{
            .el-input__inner{
              width:160px;
              height: 34px;
            }
          }
        }
      }
      .loadingbg{
        width:100%;
        height: 400px;
        background: #fff;
      }
      .AllProduct{
        margin-top: 22px;
        .el-table__header-wrapper{
          height: 44px;
        }
        .el-table__header-wrapper thead div, .el-table th{
          background: #F5F8FA;
          height: 30px;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #F5F8FA;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #F5F8FA;
        }
        .el-table{
          /*border: 1px solid #EAF0F6;*/
        }
        .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #EAF0F6;
        }
        .el-table th{
          height: 50px;
        }
        .el-table td{
          height: 72px;
        }
        .el-table .cell {
          color:#33475B;
          text-align: left;
        }
        .borwse{
          display: inline-block;
          text-align: center;
        }
        .browsePv{
          width:100px;
        }
        .browseUv{
          width:100px;
        }
        .browseTime{
          width:140px;
        }
        .browseProduct{
          width:50px;
        }
        .P-name{
            img{
              width:36px;
              height: 36px;
              position: absolute;
              top:20px;
            }
          /*}*/
          a{
            color: #33475B;
            .img-name{
              margin-left: 48px;
              width: 80%;
              overflow: hidden;
              line-height: 21px;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -ms-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }

        }
        .product-page{
          padding-bottom: 10px;
          .el-pagination {
            text-align: center;
          }
        }
      }
    }
  }

</style>
