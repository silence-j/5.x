<template>
  <div class="form-container">
    <div class="overView">
      <div class="view-title">
        <span class="use-view">使用概览</span>
        <span class="last-time">最后统计时间:  <span>{{lastReportTime}}</span></span>
        <span class="choose">
          <span class="recent" @click="Days(7)" :class="{active: recentDay == 7}">最近7天</span>
          <span class="recent" @click="Days(30)" :class="{active: recentDay == 30}">最近30天</span>
          <el-select v-model="chooseDays" v-show="isMain" @change="changeAccount">
            <el-option v-for="(DItem,DIndex) in subList"
                       :key="DIndex"
                       :label="DItem.name || DItem.loginAccount"
                       :value="DItem.id">
            </el-option>
          </el-select>
        </span>
      </div>
      <div class="view-data">
        <div class="loading loading-circle" style="margin-top: 0;" v-if="loading.TieLoading"></div>
        <ul v-else="">
          <li>
            <span class="data">{{count.countPost}}</span>
            <span class="explain">累计发帖数</span>
          </li>
          <li>
            <span class="data">{{count.countNew}}</span>
            <span class="explain">累计新增产品</span>
          </li>
          <li>
            <span class="data">{{count.countEmail}}</span>
            <span class="explain">累计邮件营销次数</span>
          </li>
          <li>
            <span class="data">{{count.countActive}}</span>
            <span class="explain">累计活动营销次数</span>
          </li>
          <li>
            <span class="data">{{count.countLogin}}</span>
            <span class="explain">累计登录次数</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="chart-bar" v-if="loading.BarLoading"><div class="loading loading-circle" style="padding-top: 0;"></div></div>
    <div class="chart-bar" v-else>
      <div class="change">
        <el-radio-group v-model="radio" @change="changeType">
          <el-radio-button label="累计发帖数"></el-radio-button>
          <el-radio-button label="累计新增产品"></el-radio-button>
          <el-radio-button label="累计邮件营销次数"></el-radio-button>
          <el-radio-button label="累计活动营销次数"></el-radio-button>
          <el-radio-button label="累计登录次数"></el-radio-button>
        </el-radio-group>
      </div>
      <div id="dataBar"></div>
      <div class="barTitle">
        <ul :class="userList.length > 6 ? '' : 'six-ul'">
          <li v-for="(item, index) in userList"><span class="circle" :class="'c' + index"></span><span class="account" :title="item">{{item}}</span></li>
        </ul>
      </div>
    </div>
    <div class="loadingcount subAccount" v-if="loading.LgLoading" style="padding-top: 100px">
      <div class="loading loading-circle" style="margin-top: 0;"></div>
    </div>
    <div class="subAccount" v-else="">
      <div>
        <div class="no-table" v-if="noData.noLg">
          <img src="../../assets/img/monitor/no-post.png" alt="">
          <p>暂无数据</p>
        </div>
        <ul v-else="">
          <li class="sub-li" v-for="item in recentlyData">
            <img :src="item.avatar || '/static/img/default_avatar.jpg'" alt="">
            <div class="sub">
              <span class="login">登录</span>
              <div class="tLg">
                <span class="login-to"><span>{{item.name}}</span>登录了系统</span>
                <span class="time" v-if="item.lastLoginTime !== null">{{item.lastLoginTime | time-formater-no-second}}</span>
              </div>
            </div>
          </li>
          <li style="height: 40px;border-left:1px solid #B0C1D4;"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import mulAccountApi from '@/api/mulAccountApi'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'
  export default{
    data () {
      return {
        chooseDays: '',
        noData: {
          noTie: false,
          noBar: false,
          noLg: false
        },
        loading: {
          TieLoading: true,
          BarLoading: true,
          LgLoading: true
        },
        recentDay: 7,
        choose: 0,
        radio: '累计发帖数',
        recentlyData: [],
        isMain: window.localStorage.getItem('isMainAccount'),
        subList: [],
        count: {
          countPost: 0,
          countNew: 0,
          countEmail: 0,
          countActive: 0,
          countLogin: 0
        },
//        累计发帖数
        bar: {
          post: [],
          new: [],
          email: [],
          active: [],
          login: []
        },
        transverseData: [],
        userList: [],
        params: {
          chooseUserId: '',
          days: 7
        },
        lastReportTime: ''
      }
    },
    mounted () {
      this.accountList()
      this.subAccount(this.params)
      this.reportCount(this.params)
    },
    methods: {
      paintBar (transverseData, countPost, radio) {
        this.loading.BarLoading = false
        this.$nextTick(() => {
          this.initNew(transverseData, countPost, radio)
        })
      },
      accountList () {
        if (window.localStorage.user) {
          let accountList = JSON.parse(window.localStorage.user)
          let main = [{name: accountList.name, id: accountList.userId, loginAccount: accountList.loginAccount}]
          if (accountList.subUserList) {
            let account = [{name: '全部账号', id: ''}].concat(main).concat(accountList.subUserList)
            this.subList = account
          } else {
            let mainAccount = [{name: '全部账号', id: ''}].concat(main)
            this.subList = mainAccount
          }
        }
      },
//      切换账号
      changeAccount (val) {
        this.params.chooseUserId = val
        this.subAccount(this.params)
        this.reportCount(this.params)
      },
      Days (val) {
        this.recentDay = val
        this.params.days = val
        this.subAccount(this.params)
        this.reportCount(this.params)
      },
      chooseType (val) {
        this.choose = val
      },
      changeType (val) {
        this.radio = val
        this.changeRadio()
      },
      changeRadio () {
        if (this.radio === '累计发帖数') {
          if (this.chooseDays !== '') {
            this.bar.post.forEach((item) => {
              item.barWidth = 40
            })
          }
          this.paintBar(this.transverseData, this.bar.post, this.radio)
        } else if (this.radio === '累计新增产品') {
          if (this.chooseDays !== '') {
            this.bar.new.forEach((item) => {
              item.barWidth = 40
              item.barMaxWidth = 40
            })
          }
          this.paintBar(this.transverseData, this.bar.new, this.radio)
        } else if (this.radio === '累计邮件营销次数') {
          if (this.chooseDays !== '') {
            this.bar.email.forEach((item) => {
              item.barWidth = 40
              item.barMaxWidth = 40
            })
          }
          this.paintBar(this.transverseData, this.bar.email, this.radio)
        } else if (this.radio === '累计活动营销次数') {
          if (this.chooseDays !== '') {
            this.bar.active.forEach((item) => {
              item.barWidth = 40
              item.barMaxWidth = 40
            })
          }
          this.paintBar(this.transverseData, this.bar.active, this.radio)
        } else if (this.radio === '累计登录次数') {
          if (this.chooseDays !== '') {
            this.bar.login.forEach((item) => {
              item.barWidth = 40
              item.barMaxWidth = 40
            })
          }
          this.paintBar(this.transverseData, this.bar.login, this.radio)
        }
      },
//      子账号统计
      subAccount (params) {
        this.loading.LgLoading = true
        mulAccountApi.userHistory(params).then((res) => {
          if (!res.data.code) {
            this.loading.LgLoading = false
            console.log(res.data.data.length)
            if (res.data.data.length > 0) {
              this.noData.noLg = false
              this.recentlyData = res.data.data
            } else {
              this.noData.noLg = true
            }
          }
        })
      },
//      统计概况
      reportCount (params) {
        this.loading.TieLoading = true
        this.loading.BarLoading = true
        mulAccountApi.reportCount(params).then((res) => {
          if (!res.data.code) {
            this.loading.TieLoading = false
            let allData = res.data.data
            this.lastReportTime = allData.lastReportTime
            this.count.countPost = allData.spredLogTotal
            this.count.countNew = allData.addProductTotal
            this.count.countEmail = allData.mailMarketingTotal
            this.count.countActive = allData.activityMarketingTotal
            this.count.countLogin = allData.loginTotal
            this.transverseData = allData.dateList
            this.bar.post = allData.spredLogList
            this.bar.new = allData.addProductList
            this.bar.email = allData.mailMarketingList
            this.bar.active = allData.activityMarketingList
            this.bar.login = allData.loginList
            this.userList = allData.userList
            this.changeRadio()
          }
        })
      },
      initNew (transverseData, countPost, radio) {
        let app = {}
//        var posList = [
//          'left', 'right', 'top', 'bottom',
//          'inside',
//          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
//          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
//        ]
        app.configParameters = {
          rotate: {
            min: -90,
            max: 90
          },
//          align: {
//            options: {
//              left: 'left',
//              center: 'center',
//              right: 'right'
//            }
//          },
//          verticalAlign: {
//            options: {
//              top: 'top',
//              middle: 'middle',
//              bottom: 'bottom'
//            }
//          },
//          position: {
//            options: echarts.util.reduce(posList, function (map, pos) {
//              console.log('*********')
//              console.log(posList)
//              console.log(map)
//              console.log(pos)
//              map[pos] = pos
//              return map
//            }, {})
//          },
          distance: {
            min: 0,
            max: 1000
          }
        }
        app.config = {
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          onChange: function () {
            var labelOption = {
              normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
              }
            }
            myChart.setOption({
              series: [{
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }]
            })
          }
        }
//        var labelOption = {
//          normal: {
//            show: true,
//            position: app.config.position,
//            distance: app.config.distance,
//            align: app.config.align,
//            verticalAlign: app.config.verticalAlign,
//            rotate: app.config.rotate,
//            formatter: '{c}  {name|{a}}',
//            fontSize: 16,
//            rich: {
//              name: {
//                textBorderColor: '#fff'
//              }
//            }
//          }
//        }
        let option = {
          color: ['#4979B3', '#B34947', '#93B354', '#8D6DB3', '#429CB3', '#CC7B39', '#CC5654', '#AACC60', '#A37ECC', '#4EB3CC', '#E69049'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
//            formatter: function (params) {
//              let trend = ''
//              params.forEach((res) => {
//                if (res.value !== undefined) {
//                  trend += res.seriesName + ':' + ' ' + res.value + '<br/>'
//                } else {
//                  trend += res.seriesName + ':' + ' ' + '-' + '<br/>'
//                }
//              })
//              return trend
//            }
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: {
            type: 'category',
//            横向坐标日期
            data: transverseData,
            axisTick: {show: false},
            axisLabel: {
              formatter: function (params) {
                return params.split('-')[1] + '-' + params.split('-')[2]
              }
            }
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: countPost
        }
        let myChart = echarts.init(document.getElementById('dataBar'))
        myChart.setOption(option)
      }
    }
//    watch: {},
//    computed: {},
//    created: {},
  }

</script>
<style lang='less' rel="stylesheet/less">
  .form-container{
    .overView{
      width:100%;
      height: 215px;
      box-sizing: border-box;
      background: #FFFFFF;
      padding: 20px 0 30px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      &:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      }
      .view-title{
        padding: 0 30px;
        width:100%;
        box-sizing: border-box;
        .use-view{
          font-weight: bold;
          font-size: 16px;
          color: #33475B;
        }
        .last-time{
          margin-left: 20px;
          font-size: 14px;
          color: rgba(51,71,91,0.60);
        }
        .choose{
          float: right;
          .recent{
            font-size: 13px;
            color: #7C98B6;
            padding: 5px;
            cursor: pointer;
            margin-right: 15px;
          }
          .recent:hover{
            color: #5488F9;
          }
          .active{
            color: #5488F9;
            border-bottom: 2px solid #5488F9;
          }
        }
        .el-select{
          .el-input__inner{
            width:200px;
            height: 36px;
            margin-left: 5px;
          }
        }
      }
      .view-data{
        margin-top: 65px;
        ul{
          li{
            display: inline-block;
            width:19.6%;
            box-sizing: border-box;
            border-right: 2px solid  #EAF0F6;
            span{
              display: block;
              text-align: center;
            }
            .data{
              font-size: 40px;
              color: #33475B;
            }
            .explain{
              font-size: 13px;
              margin-top: 10px;
              color: #7C98B6;
            }
          }
          li:last-child{
            border-right: none;
          }
        }
      }
    }
    .chart-bar{
      width:100%;
      height: 484px;
      padding-top: 20px;
      margin-top: 16px;
      background: #FFFFFF;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      &:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      }
      .change{
        box-sizing: border-box;
        width:622px;
        margin-left: 554px;
        font-size: 0;
        .el-radio-group{
          width:100%;
          .el-radio-button__inner{
            width:100%;
          }
        }
      }
      #dataBar{
        width:108%;
        height: 400px;
        position: relative;
        left:-3.4%;
      }
      .barTitle{
        margin: 0 auto;
        font-size: 13px;
        color: #33475B;
        position: relative;
        top:-6px;
        /*text-align: center;*/
        .six-ul{
          text-align: center;
        }
        ul{
          width:66%;
          display: inline-block;
          position: relative;
          left:50%;
          transform: translate(-50%);
          li{
            display: inline-block;
            /*margin-right: 30px;*/
            margin-bottom: 10px;
            width:16%;
            height: 16px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .circle{
              display: inline-block;
              width:8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 10px;
            }
            .c0{
            background: #4979B3;
             }
            .c1{
              background: #B34947;
            }
            .c2{
              background: #93B354;
            }
            .c3{
              background: #8D6DB3;
            }
            .c4{
              background: #429CB3;
            }
            .c5{
              background: #CC7B39;
            }
            .c6{
              background: #CC5654;
            }
            .c7{
              background: #AACC60;
            }
            .c8{
              background: #A37ECC;
            }
            .c9{
              background: #4EB3CC;
            }
            .c10{
              background: #E69049;
            }
          }
          li:last-child{
            /*margin-right: 0;*/
          }
        }

      }
    }
    .loadingcount{
      padding-top: 100px;
      height: 300px;
    }
    .subAccount{
      width:100%;
      max-height: 492px;
      overflow-y: auto;
      box-sizing: border-box;
      margin-top: 16px;
      margin-bottom: 30px;
      padding: 0 30px 0 50px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      &:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      }
      .no-table{
        height: 300px;
        img{
          margin: 80px 0 10px 0;
          position: relative;
          left:50%;
          transform: translate(-50%);
        }
        p{
          text-align: center;
        }
      }
      ul{
        .sub-li{
          height: 92px;
          position: relative;
          border-left:1px solid #B0C1D4;
          img{
            position: absolute;
            left:-22px;
            top:34px;
            width:40px;
            height: 40px;
            /*background: pink;*/
            border-radius: 50%;
          }
          .sub{
            padding-top: 40px;
            margin-left: 40px;
            .login{
              font-weight: bold;
              display: block;
              font-size: 14px;
              color: #33475B
            }
            .tLg{
              margin-top: 7px;
              font-size: 13px;
              padding-bottom: 19px;
              border-bottom:1px solid  #DFE3EB;
              color: rgba(51,71,91,0.60);
              .time{
                float: right;
              }
            }
          }
        }
      }
    }

  }
</style>
