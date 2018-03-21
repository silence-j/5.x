<template>
  <div>
    <el-pagination
    v-if="showData"
    :layout="layout"
    :current-page="config.page"
    :page-size="config.pageSize"
    :total="config.totalCount"
    :page-sizes="pageSizeSwitch"
    @current-change="currentChange"
    @size-change="sizeChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      layout: 'prev, pager, next, sizes, jumper',
      pageSizeSwitch: this.config.pageSizeOn ? this.config.pageSizeArray : [10, 20, 30, 40],
      recordData: this.config.records && this.config.records.length && this.config.totalCount > this.config.pageSize,
      showData: this.config.records ? this.recordData : true
    }
  },
  props: {
    config: {
      pageSizeOn: true,
      records: [],
      pageSize: 10,
      pageSizeArray: [10, 20, 30, 40],
      totalCount: 20,
      page: 1
    }
  },
  mounted () {
    this.pageSizeOn()
  },
  computed: {
  },
  components: {
  },
  methods: {
    pageSizeOn () {
      if (this.config.pageSizeOn === false) {
        this.layout = 'prev, pager, next, jumper'
      }
    },
    currentChange (page) {
      this.$emit('current-change', page)
    },
    sizeChange (size) {
      this.$emit('size-change', size)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
@import '../assets/style/page';
</style>
