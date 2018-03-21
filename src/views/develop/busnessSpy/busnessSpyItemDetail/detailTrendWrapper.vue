<template>
  <div class="trend-wrapper">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <h1 class="title">采购趋势</h1>
      <el-select v-model="timeQuantum" class="trend-select" @change="selectChange">
        <el-option v-for="item in selectMap"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <div id="trend-bar"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import developAPI from '@/api/developAPI'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      timeQuantum: 1,
      localData: [],
      selectMap: [
        {
          label: '最近12个月',
          value: 1
        },
        {
          label: '最近6个月',
          value: 2
        },
        {
          label: '2016年',
          value: 3
        },
        {
          label: '2015年',
          value: 4
        }
      ]
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal.name !== oldVal.name) {
        this.selectChange()
      }
    }
  },
  mounted () {
  },
  computed: {

  },
  props: {
    data: {
      type: Object
    }
  },
  components: {
  },
  methods: {
    selectChange () {
      let value = this.timeQuantum
      let startTime
      let startDate
      let endDate = this.timeToString(new Date())
      this.isLoading = true
      switch (value) {
        case 1:
          startTime = Date.parse(new Date()) - 365 * 24 * 60 * 60 * 1000
          startDate = this.timeToString(startTime)
          break
        case 2:
          startTime = Date.parse(new Date()) - 183 * 24 * 60 * 60 * 1000
          startDate = this.timeToString(startTime)
          break
        case 3:
          startDate = '2016-01-01'
          endDate = '2016-12-30'
          break
        case 4:
          startDate = '2015-01-01'
          endDate = '2015-12-30'
          break
        case 5:
          startDate = '2014-01-01'
          endDate = '2014-12-30'
          break
      }
      developAPI.getTrendBar({ companyName: this.data.name, companyCountry: this.data.baseInfo.address.country, startDate, endDate }).then(res => {
        if (!res.data.code) {
          this.localData = res.data.data.data
          this.isLoading = false
          this.$nextTick(() => {
            this.initBar()
          })
        }
      })
    },
    timeToString (val) {
      let time = new Date(val)
      let year = time.getFullYear()
      let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
      let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
      return `${year}-${month}-${day}`
    },
    initBar (params) {
      let axisName = []
      let ayisData = []
      for (let item of this.localData) {
        axisName.push(item.month)
        ayisData.push(item.count)
      }
      let options = {
        color: ['#20a0ff'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: axisName,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            nameTextStyle: {
              color: ['#7c98b6']
            }
          }
        ],
        series: [
          {
            name: '采购趋势',
            type: 'bar',
            barWidth: '60%',
            data: ayisData
          }
        ]
      }
      let myChart = echarts.init(document.getElementById('trend-bar'))
      // 绘制图表
      myChart.setOption(options)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .trend-wrapper{
    position: relative;
    width: 100%;
    height: 380px;
    padding: 20px 30px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    .loading{
      margin: 138px auto;
    }
    .title{
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 9px;
      color: #33475b;
    }
    .trend-select{
      position: absolute;
      top: 14px;
      right: 30px;
      width: 160px;
      height: 30px;
      z-index: 100;
    }
    #trend-bar{
      width: 720px;
      height: 340px;
      margin-top: -35px;
    }
  }
</style>
