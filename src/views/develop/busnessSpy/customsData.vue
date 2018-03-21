<template>
  <div>
  <div class="customs_data_List bottom_filter_result" >
    <div class="customs_data" v-for="record in customsChildObj.records" :key="record">
      <p class="info_line"><span class="label">Exporter</span><span class="read desc">{{record.exporter | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Arrival Date</span><span class="read desc">{{record.arrivalDate | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Ports</span><span class="desc">{{record.ports | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Unit</span><span class="desc">{{record.unit | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Product Description</span><span class="desc">{{record.productDescription | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Hs Code</span><span class="desc">{{record.hsCode | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Weight In Kg.</span><span class="desc">{{record.weightInKg | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Quantity</span><span class="desc">{{record.quantity | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Bill of Lading</span><span class="desc">{{record.billOfLading | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Master Bill of Lading</span><span class="desc">{{record.masterBillofLading | isNullDisplay}}</span></p>
      <p class="info_line"><span class="label">Carrier SASC Code</span><span class="desc">{{record.carrierSASCCode | isNullDisplay}}</span></p>
    </div>
    <!--暂无数据-->
    <div class="no-data" v-if="customsChildObj.records.length==0">
      <div class="no-info">
        <img src="../../../assets/img/monitor/no-post.png" alt="">
        <p style="margin-top: 10px;">暂无数据</p>
      </div>
    </div>
    <div class="loading loading-circle loading-top" v-if="isMore"></div>
  </div>
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  export default{
    name: 'CustomsDataPage',
    props: {
      customsChildObj: {
        records: Array,
        size: Number,
        totalCount: Number,
        totalPages: Number
      },
      companyIdChild: String
    },
    data () {
      return {
        isMore: false,
        isLoadIng: false,
        page: 1,
        pageSize: 10,
        taskId: this.$route.query.taskId
      }
    },
    computed: {

    },
    mounted () {
      if (this.page < this.customsChildObj.totalPages) {
        this.isMore = true
      }
      this.page = 1
      let _this = this
      let obj = document.getElementsByClassName('customs_data_List')[0]
      if (obj !== null && obj !== undefined) {
        obj.addEventListener('scroll', (event) => {
          if ((obj.scrollTop + obj.clientHeight) >= (obj.scrollHeight)) {
            if (_this.page === _this.customsChildObj.totalPages) {
              this.isMore = false
              return
            }
            if (!_this.isLoadIng && _this.isMore) {
              console.log('load....')
              _this.page = _this.page + 1
              _this.getCustomsListFunc()
            }
          }
        })
      }
    },
    methods: {
      // 获取公司海关列表
      getCustomsListFunc () {
        if (this.companyIdChild !== '') {
          this.isLoadIng = true
          let params = {
            taskId: this.taskId,
            companyId: this.companyIdChild,
            page: this.page,
            pageSize: this.pageSize
          }
          DevelopAPI.getCustomsList(params).then(res => {
            if (res.data.code === 0) {
              let records = res.data.data.records
              let oldrecords = this.customsChildObj.records
              this.customsChildObj.records = oldrecords.concat(records)
              this.isLoadIng = false
            } else {
              this.isLoadIng = false
            }
          })
        }
      }
    },
    filters: {
      isNullDisplay (value) {
        if (value === '' || value === null) {
          return '-'
        } else {
          return value
        }
      }
    }
  }
</script>
