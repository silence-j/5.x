<template>
  <div class="relation-wrapper">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <h1 class="title">贸易关系图</h1>
      <el-select v-model="timeQuantum" class="relation-select" @change="selectChange">
        <el-option v-for="item in selectMap"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <div class="relation-no-data" v-show="localData.nodes.length === 0">
        <img src="../../../../assets/img/empty-contact.png" alt="">
        <p>暂无数据</p>
      </div>
      <div v-show="localData.nodes.length > 0">
        <div id="relation-schema"></div>
        <div class="sort-wrapper">
          <div class="sort-title">贸易{{isCountry ? '国家/地区' : '伙伴'}}排行</div>
          <ol>
            <li 
            class="sort-item" 
            :class="index < 3 ? 'sort-bold' : ''"
            v-for="(item, index) in localData.nodes.slice(1, 11)" 
            :key="index"
            :title="item.id"><span>{{item.id}}</span></li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/tooltip'
import developAPI from '@/api/developAPI'
import mock from './mock.json'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      localData: {
        nodes: [],
        edges: []
      },
      timeQuantum: 1,
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
      ],
      mockList: mock,
      isCountry: 0
    }
  },
  mounted () {
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal.name !== oldVal.name) {
        this.selectChange()
      }
    }
  },
  computed: {
  },
  components: {
  },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    selectChange () {
      let value = this.timeQuantum
      let startTime
      let startDate
      let endDate = this.timeToString(new Date())
      this.localData.nodes = []
      this.localData.edges = []
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
      }
      developAPI.getRelation({ companyName: this.data.name, companyCountry: this.data.baseInfo.address.country, startDate, endDate }).then(res => {
        if (!res.data.data.code) {
          this.isLoading = false
          let arr = res.data.data.data.companyList.length > 0 ? res.data.data.data.companyList : res.data.data.data.countryList
          this.isCountry = res.data.data.data.companyList.length > 0 ? 0 : 1
          if (arr.length > 0) {
            this.localData.nodes.push({
              id: arr[0].buyer,
              label: arr[0].buyer,
              x: this.mockList.nodes[arr.length].x,
              y: this.mockList.nodes[arr.length].y,
              color: this.mockList.nodes[arr.length].color,
              size: 15
            })
            for (let i in arr) {
              let supplier = arr[i].supplier || arr[i].country
              if (supplier !== arr[i].buyer && i < 15) {
                let size = arr[i].tradeCount === 1 ? 2 : arr[i].tradeCount
                this.localData.nodes.push({
                  id: supplier,
                  label: supplier,
                  x: this.mockList.nodes[i].x,
                  y: this.mockList.nodes[i].y,
                  color: this.mockList.nodes[i].color,
                  size: Math.log2(size) * 5
                })
                this.localData.edges.push({
                  sourceID: arr[i].buyer,
                  targetID: supplier
                })
              }
            }
          }
          this.$nextTick(() => {
            this.initGraph()
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
    initGraph (params) {
      if (this.localData.nodes.length === 0) {
        return
      }
      let myChart = echarts.init(document.getElementById('relation-schema'))
      let options = {
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            data: this.localData.nodes.map(function (item) {
              return {
                x: item.x,
                y: item.y,
                id: item.id,
                name: item.label,
                symbolSize: item.size,
                itemStyle: {
                  normal: {
                    color: item.color
                  }
                }
              }
            }),
            edges: this.localData.edges.map(function (item) {
              return {
                source: item.sourceID,
                target: item.targetID
              }
            }),
            label: {
              emphasis: {
                position: 'right',
                show: true
              }
            },
            roam: false,
            focusNodeAdjacency: true,
            lineStyle: {
              normal: {
                width: 0.5,
                curveness: 0.3,
                opacity: 0.7
              }
            }
          }
        ]
      }
      myChart.setOption(options, true)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .relation-wrapper{
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
      margin: 150px auto;
    }
    .title{
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 9px;
      color: #33475b;
    }
    .relation-no-data{
      width: 100%;
      height: 150px;
      position: relative;
      top: -90px;
      img{
        display: block;
        width: 100px;
        height: auto;
        margin: 178px auto 0;
      }
      p{
        text-align: center;
        font-size: 13px;
        line-height: 20px;
        color: #33475b;
      }
    }
    .relation-select{
      position: absolute;
      top: 14px;
      right: 30px;
      width: 160px;
      height: 30px;
      z-index: 100;
    }
    #relation-schema{
      display: inline-block;
      vertical-align: top;
      width: 470px;
      height: 300px;
    }
    .sort-wrapper{
      position: absolute;
      top: 80px;
      right: 30px;
      display: inline-block;
      vertical-align: top;
      width: 250px;
      height: 260px;
      .sort-title{
        font-size: 14px;
        color: #33475b;
        margin-bottom: 12px;
      }
      ol{
        list-style-type: decimal;
        padding-left: 20px;
        .sort-item{
          list-style-type: decimal;
          margin-bottom: 10px;
          font-size: 15px;
          line-height: 13px;
          color: #4f6d95;
          span{
            display: inline-block;
            height: 13px;
            max-width: 205px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow:ellipsis;
          }
        }
        .sort-bold{
          font-weight: 600;
        }
      }
    }
  }
</style>
