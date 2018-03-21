<template>
  <div>
    <contact-Header></contact-Header>
    <div class="news-list w-1200">
      <div class="llss">
        <dl v-for="record in reqResult.records">
          <dt>
            <router-link :to="{ name: 'articleDetail'+nameFoot, params:{ Id: record.id }}" class="bt">
             {{record.title}}
            </router-link>
            <span class="data"><em>{{ record.nickname }}</em>{{record.createTime | time-formater-no-hour}}发表</span>
            <p></p>
          </dt>
          <dd>
            <a> {{record.viewCount}}</a>
            <span><i class="icon-eye read-amount"></i>阅读量</span>
          </dd>
        </dl>
      </div>
      <dl class="fanye2" >
        <div class="paging-column">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="reqResult.totalCount">
          </el-pagination>
        </div>
        <!--分页模块end-->
      </dl>
    </div>
  </div>
</template>
<script>
import ContactHeader from './cpnts/newsHeader'
import schoolAPI from '@/api/schoolAPI'
export default {
  name: 'newinfo',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,       // 每页显示条数
      reqResult: '',
      nameFoot: process.env.ROUTE_NAME_FOOT
    }
  },
  components: {
    ContactHeader,
    schoolAPI
  },
  methods: {
    // 分页每页条数改变回调方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.selSchoolList({page: this.currentPage, size: val, paging: true})
    },
    // 分页页码改变回调方法
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(val)
      this.selSchoolList({page: val, size: this.pageSize, paging: true})
    },
    selSchoolList (senddata) {
      schoolAPI.getArticleList(senddata).then((res) => {
        this.reqResult = res.data.data
        console.log(res.data)
      })
    }
  },
  created () {
    this.selSchoolList({ page: 1, size: 10, paging: true })
  }
}
</script>
<style lang='less'>
@import '../../assets/style/school/school.less';
</style>
