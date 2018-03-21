<template>
  <div class="logistic-container group-container">
    <router-link to="category/false/false" class="add-prod" v-if="addBtnRight()"><el-button type="primary" style="width:110px;height:35px;"><i class="icon-add"></i>新增产品</el-button></router-link>
    <div class="group-box">
      <div class="group-first">
        <h3>一级产品分组（{{groupList.length}}） <el-button @click="addGroup(0)" :disabled="initdisabled || groupList.length > 9" class="btn-white"><i>+</i>添加分组</el-button></h3>
        <ul id="group-fir-list">
          <li class="group-item group-item-first" :class="{'selected': curr1Id == -2}" @click="selectOne"><label>All Products</label></li>
          <draggable v-model="groupList" :options="{animation: 300,handle:'.icon-adjust'}" @start="drag=true" @end="drag=false" @sort="sort">
          <li class="group-item" v-for="(item, index) in groupList" :class="{'selected': item.id == curr1Id}" @click.stop="showSec($event, item.id, item.name)" :data-display="item.displayOrder">
            <label v-show="!groupList[index].edit">
            <el-popover trigger="hover" placement="top" popper-class="group-pop">
              <p>{{item.name}}</p>
              <span slot="reference" class="name-wrapper">
                {{item.name}}
              </span>
            </el-popover>
            </label>
            <div v-show="groupList[index].edit" class="edit-box">
              <el-input v-model="groupList[index].editname" :maxlength=35 class="input-s" ></el-input>
              <el-button type="primary" @click.stop="editOk(0, index, 0, $event)">确定</el-button>
              <el-button @click.stop="cancel(0, index)" v-if="!groupList[index].isNew">取消</el-button>
            </div>
            <div class="group-opt" v-if="item.id">
              <el-tooltip class="item" effect="dark" content="调整顺序" placement="top-start">
                <a href="javascript:;" ><i class="icon-adjust"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <a href="javascript:;" @click.stop="groupEdit(0, index)"><i class="icon-pen"></i></a>
              </el-tooltip>
              <el-tooltip v-if="!item.subGroup.length" class="item" effect="dark" content="删除" placement="top-start">
                <a href="javascript:;" @click.stop="del(0, index, item.name)"><i class="icon-trash"></i></a>
              </el-tooltip>
              <i class="icon-arright" v-if="item.subGroup && item.subGroup.length"></i>
            </div>
          </li>
          </draggable>
        </ul>
      </div>
      <div class="group-sec">
        <h3>二级产品分组（{{groupList2.length}}） <el-button @click="addGroup(1)" :disabled="initdisabled2 || groupList2.length > 9 || currId==-2" class="btn-white"><i>+</i>添加分组</el-button></h3>
        <ul id="group-sec-list">
          <draggable v-model="groupList2" :options="{animation: 300,handle:'.icon-adjust'}" @start="drag=true" @end="drag=false" @sort="sort2">
          <li class="group-item" v-for="(item, index) in groupList2" @click="showProd($event, item.id)" :data-display="item.displayOrder" :class="{'selected': item.id == curr2Id}">
            <label v-show="!groupList2[index].edit">
              <el-popover trigger="hover" placement="top" popper-class="group-pop">
                <p>{{item.name}}</p>
                <span slot="reference" class="name-wrapper">
                  {{item.name}}
                </span>
              </el-popover>
            </label>
            <div v-show="groupList2[index].edit" class="edit-box">
              <el-input v-model="groupList2[index].editname" :maxlength=35 class="input-s"></el-input>
              <el-button type="primary" @click.stop="editOk(1, index, item.parentId, $event)">确定</el-button>
              <el-button @click.stop="cancel(1, index)" v-if="!groupList2[index].isNew">取消</el-button>
            </div>
            <div class="group-opt" v-if="item.id">
              <el-tooltip class="item" effect="dark" content="调整顺序" placement="top-start">
                <a href="javascript:;"><i class="icon-adjust"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <a href="javascript:;" @click.stop="groupEdit(1, index)"><i class="icon-pen"></i></a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <a href="javascript:;" @click.stop="del(1, index, item.name)"><i class="icon-trash"></i></a>
              </el-tooltip>
              <!-- <a class="icon-arright" href="javascript:;" @click="showSec(item.id)"></a> -->
            </div>
          </li>
          </draggable>
          <li class="no-data" v-if="!groupList2.length">
            <div class="tips">点击右上角按钮添加新的二级分组</div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <h1>产品列表-{{currentGroup}}</h1> -->
    <div class="list-box" >
      <div class="el-table opt-box" v-if="multipleSelection.length">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" >
          <thead>
            <tr>
              <th colspan="1" rowspan="1" class="el-table_1_column_1 el-table-column--selection is-leaf">
                <div class="cell chked-opt">
                  <el-checkbox v-model="selectAll" @change="chkAll" :disabled="!products.records || !products.records.length"></el-checkbox>
                  <label>已选中 {{multipleSelection.length}} 项</label>
                  <a href="javascript:;" @click="showGroup(true)" class="icon-buttons butt"><i class="icon-groupsort"></i>更改分组</a>
                </div>
              </th>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <template>
        <div class="list-wrap">
          <ul class="list-header clearfix">
            <li class="chk-wrap"><el-checkbox v-model="selectAll" @change="chkAll" :disabled="!products.records || !products.records.length"></el-checkbox>排序</li>
            <li class="rec-pic">图片</li>
            <li class="rec-long">产品名称</li>
            <li >所属分组</li>
            <li class="rec-short">操作</li>
          </ul>
          <!-- <draggable v-model="products.records" :options="{animation: 300,handle:'.icon-adjust'}" @start="drag=true" @end="drag=false" @sort="sort3"> -->
          <ul v-for="(item, index) in products.records" class="list-record clearfix">
            <li class="chk-wrap">
              <el-checkbox v-model="products.records[index].chked" @change="chkOne(index)"></el-checkbox>
              {{index + 1}}
            </li>
            <li class="rec-pic">
              <img class="" :src="item.productFirstPicWhole+'?x-oss-process=image/resize,h_50,w_50'" alt="">
            </li>
            <li class="rec-long">
              <el-popover trigger="hover" placement="top" popper-class="group-pop">
                <p>{{ item.productName }}<p>
                <div slot="reference" class="name-wrapper">
                  <a :href="homepage + '/detail?productId='+item.id+'&shopId='+item.shopId" target="_blank">{{item.productName?item.productName:'&nbsp;'}}</a>
                </div>
              </el-popover>
            </li>
            <li>
              <el-popover trigger="hover" placement="top" popper-class="group-pop">
                <p>{{ item.cateAllName }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ item.cateName }}
                </div>
              </el-popover>
            </li>
            <li class="rec-short group-opt">
              <el-tooltip class="item" effect="dark" content="更改分组" placement="top-start">
                <a href="javascript:;" @click="showGroup(false, item.id)"><i class="icon-groupsort"></i></a>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="调整顺序" placement="top-start">
                <a href="javascript:;" ><i class="icon-adjust"></i></a>
              </el-tooltip> -->
            </li>
          </ul>
          <!-- </draggable> -->
        </div>
      </template>
      <div class="no-data" v-if="products.records &&!products.records.length">
        <div class="img"></div>
        <div class="tips">暂无数据</div>
      </div>
      <div v-if="loading" class="loading loading-circle"></div>
      <el-pagination v-if="products.records && products.records.length && products.totalCount > 10"
      layout="prev, pager, next, sizes, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="products.totalCount"
      :current-Page="pageIndex"
       @size-change="sizeChange"
       @current-change="pager"></el-pagination>
      <!-- jumper :page-sizes="[10, 20, 30, 40]"
      @size-change="listSizeChange" -->
    </div>
    <el-dialog title="更改分组" v-model="groupModel" class="group-model">
      <el-form>
        <el-form-item label="请选择新的分组">
          <el-select v-model="newgroup">
            <el-option label="全部分组" value=""></el-option>
            <el-option-group
              v-for="group in groupList"
              :key="group.id">
              <el-option :label="group.name" :value="group.id">{{group.name}}
              </el-option>
              <el-option
                v-for="item in group.subGroup"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="是否将产品置顶">
          <el-checkbox v-model="needFirst"></el-checkbox>
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button type="primary" class="confirm" @click="groupOk">确定</el-button>
        <el-button class="close"  @click="groupModel = false">取消</el-button>
      </div>
    </el-dialog>
    <DialogBox :config="oconfig" @sure="delOk"></DialogBox>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import groupApi from '../../api/groupApi'
import DialogBox from '../../components/box/dialogBox'
import Vue from 'vue'
import Util from '@/common/Util'
export default {
  name: 'Product',
  props: ['data'],
  data () {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      selectAll: false,
      products: {},
      groupList: [],
      groupList2: [],
      productIds: [],
      needFirst: false,
      isEdit: false,
      isBatch: false,
      groupModel: false,
      multipleSelection: [],
      currentGroup: 'Product',
      curr2Id: '-2', // 二级分组选中的
      curr1Id: '-2', // 一级分组选中的
      currId: '-2', // 当前选中的分组ID
      newgroup: '',
      oconfig: {
        visible: false,
        notice: '',
        sureText: '确定',
        cancelText: '取消',
        callback: null,
        popovercls: 'confirm-pop'
      },
      delObj: {},
      homepage: process.env.HOMEPAGE,
      initdisabled: true,
      initdisabled2: true,
      currevent: 0
    }
  },
  components: {DialogBox, draggable},
  methods: {
    /**
     * 增加按钮权限
     */
    addBtnRight () {
      return Util.hasRightByCode('AEB')
    },
    // 分页
    pager (pageIndex) {
      this.pageIndex = pageIndex
      this.freshProd()
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.freshProd()
    },
    // 刷新产品列表
    freshProd () {
      let _this = this
      let params = {page: this.pageIndex, size: this.pageSize, productGroupId: this.currId}
      groupApi.getList(params).then(res => {
        _this.products = res.data.data
        _this.products.records.forEach(item => {
          item.chked = false
        })
        this.selectAll = false
        this.multipleSelection = []
        this.$store.commit('PROD_LOAD', {loading: false})
      })
    },
    // prodyct
    selectOne () {
      this.pageIndex = 1
      this.currId = '-2'
      this.curr1Id = '-2'
      this.freshProd()
    },
    // 显示二级分组
    showSec (event, id, name) {
      if (event.target.getAttribute('class') === 'el-input__inner') {
        return
      }
      let elbtn = event.target.parentNode.getAttribute('class')
      if (elbtn && elbtn.indexOf('el-button') !== -1) {
        return
      }
      if (!id) {
        return
      }
      this.currId = id
      this.curr1Id = id
      groupApi.getGroupList({parentId: id}).then(res => {
        this.initdisabled2 = false
        this.groupList2 = res.data.data
      })
      this.pageIndex = 1
      this.freshProd()
    },
    // 点击二级分组
    showProd (event, id, name) {
      if (!id) { // 新建分组没有产品列表的
        return
      }
      if (event.target.getAttribute('class') === 'el-input__inner') {
        return
      }
      this.currId = id
      this.curr2Id = id
      this.pageIndex = 1
      this.freshProd()
    },
    // 取消新增/取消编辑
    cancel (flag, index, pid) {
      let p = this.groupList
      if (flag) {
        p = this.groupList2
      }
      p[index].edit = false
      Vue.set(p, index, p[index])
    },
    // 添加分组
    addGroup (flag) {
      this.isEdit = false
      this.currevent = 0
      let p = this.groupList
      let pareid = 'group-fir-list'
      if (flag) {
        p = this.groupList2
        pareid = 'group-sec-list'
      }
      let len = p.length
      let pid = this.currId
      if (p[0]) {
        pid = p[0].parentId
      }
      if (len > 0 && p[len - 1].edit === true) {
        this.$message.error('请先保存新建分组')
        return
      }
      p.push({name: '', editname: 'New Category', edit: true, isNew: true, parentId: pid})
      // 选中
      setTimeout(() => {
        document.getElementById(pareid).querySelectorAll('.input-s')[len].querySelector('.el-input__inner').select()
      }, 320)
      // this.$store.commit('GROUPLIST', this.$store.getters.groupList)
    },
    // 分组编辑
    groupEdit (flag, index) {
      this.currevent = 0
      this.isEdit = true
      // this.currId = itemId
      let p = this.groupList
      let pareid = 'group-fir-list'
      if (flag) {
        p = this.groupList2
        pareid = 'group-sec-list'
      }
      p[index].edit = true
      p[index].editname = p[index].name
      Vue.set(p, index, p[index])
      // 选中
      setTimeout(() => {
        document.getElementById(pareid).querySelectorAll('.input-s')[index].querySelector('.el-input__inner').select()
      }, 320)
    },
    // 分组编辑提交
    editOk (flag, index, pid, event) {
      let _this = this
      let p = this.groupList
      // let currevent = ''
      let currDom = event.target.parentNode
      currDom.setAttribute('disabled', 'disabled')
      if (flag) {
        p = this.groupList2
        pid = p[index].parentId
      }
      if (!p[index].editname) {
        _this.$message.error('请输入内容')
        return
      }
      setTimeout(() => {
        if (_this.currevent === 0) {
          if (_this.isEdit) {
            groupApi.modGroup({name: p[index].editname, id: p[index].id}).then(res => {
              currDom.removeAttribute('disabled')
              if (!res.data.code) {
                _this.$message.success('编辑成功')
                p[index].name = p[index].editname
                p[index].edit = false
                Vue.set(p, index, p[index])
              } else {
                _this.$message.error(res.data.message)
              }
            })
          } else {
            let params = {name: p[index].editname, parentId: pid, displayOrder: 1}
            groupApi.addGroup(params).then(res => {
              currDom.removeAttribute('disabled')
              if (!res.data.code) {
                _this.$message({
                  type: 'success',
                  message: '新增分组成功'
                })
                groupApi.getGroup().then(res => {
                  this.groupList = res.data.data
                })
                if (flag) {
                  groupApi.getGroupList({parentId: pid}).then(res => {
                    this.groupList2 = res.data.data
                  })
                }
              } else {
                _this.$message.error(res.data.message)
              }
            })
          }
        }
        _this.currevent++
      }, 320)
    },
    // 删除
    del (flag, index, name) {
      this.delObj = {flag: flag, index: index}
      Object.assign(this.oconfig, {visible: true, theme: 'red', notice: '确定删除以下分组吗', message: name})
    },
    // 删除确认
    delOk () {
      let _this = this
      let p = this.groupList
      if (this.delObj.flag) {
        p = this.groupList2
      }
      groupApi.delGroup({groupId: p[this.delObj.index].id}).then(res => {
        if (!res.data.code) {
          _this.$message.success('删除成功')
          _this.oconfig.visible = false
          p.splice(this.delObj.index, 1)
        }
      })
    },
    // 分组及排序
    showGroup (isBatch, id) {
      this.isBatch = isBatch
      this.productIds = []
      if (isBatch) {
        this.multipleSelection.forEach((item) => {
          this.productIds.push(item.id)
        })
      } else {
        this.singleRecord = {id: id}
      }
      groupApi.getGroup().then(res => {
        this.groupList = res.data.data
      })
      this.newgroup = ''
      this.groupModel = true
    },
    // 分组及排序 Ok
    groupOk () {
      // if (!this.newgroup) {
      //   this.$message.error('请选择新分组')
      //   return
      // }
      let ids = this.isBatch ? this.productIds.join(',') : this.singleRecord.id
      let isTop = this.needFirst ? 1 : 0
      let params = {groupId: this.newgroup, productIds: ids, needFirst: isTop}
      groupApi.topAndGroup(params).then(res => {
        if (!res.data.code) {
          this.groupModel = false
          this.$message.success('分组调整成功')
          this.freshProd()
        }
      })
    },
    /**
     * 一级分组排序
     * @param ev
     */
    sort (env) {
      // 取成功后移动对象 下一个的display
      let allEl = document.getElementById('group-fir-list').querySelectorAll('li.group-item')
      let newNextEl = allEl[env.newIndex + 2]
      let displayOrder = ''
      if (!newNextEl) { // 没有下一个 就上一个+1
        displayOrder = +allEl[env.newIndex].getAttribute('data-display') + 1
      } else {
        displayOrder = newNextEl.getAttribute('data-display')
      }
      this.sortfunc(0, env, displayOrder)
    },
    /**
     * 二级分组排序
     * @param ev
     */
    sort2 (env) {
      let allEl = document.getElementById('group-sec-list').querySelectorAll('li.group-item')
      let newNextEl = allEl[env.newIndex + 1]
      let displayOrder = ''
      if (!newNextEl) { // 没有下一个 就上一个+1
        displayOrder = +allEl[env.newIndex - 1].getAttribute('data-display') + 1
      } else {
        displayOrder = newNextEl.getAttribute('data-display')
      }
      this.sortfunc(1, env, displayOrder)
    },
    // sort3 (env) {
    //   let p = this.products.records
    //   let nindex = (this.pageIndex - 1) * this.pageSize + env.newIndex
    //   groupApi.productSort({
    //     'product[0].productId': p[env.newIndex].id,
    //     'product[0].orderIndex': nindex
    //   }).then(res => {
    //     if (!res.data.code) {
    //       this.$message.success('排序成功')
    //     } else {
    //       this.$message.error(res.data.message)
    //     }
    //   })
    // },
    sortfunc (flag, env, displayOrder) {
      let p = this.groupList
      if (flag) {
        p = this.groupList2
      }
      groupApi.groupSort({
        newIndex: displayOrder,
        groupId: p[env.newIndex].id
      }).then(res => {
        if (!res.data.code) {
          this.$message.success('排序属性成功')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    deepCopyArr (arr) {
      return JSON.parse(JSON.stringify(arr))
    },
    chkOne (index) {
      this.multipleSelection = this.products.records.filter((item) => {
        return item.chked === true
      })
      if (this.multipleSelection.length === this.products.records.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
    },
    chkAll () {
      let rec = this.products.records
      if (!rec.length) {
        return
      }
      if (this.selectAll) {
        rec.forEach(item => {
          item.chked = true
        })
        this.multipleSelection = rec
      } else {
        rec.forEach(item => {
          item.chked = false
        })
        this.multipleSelection = []
      }
    }
  },
  watch: {
  },
  computed: mapGetters({
    loading: 'loading'
  }),
  created () {
    this.$store.commit('PROD_LOAD', {loading: true})
    groupApi.getGroup().then(res => {
      this.initdisabled = false
      this.groupList = res.data.data
    })
    this.freshProd()
  },
  mounted () {
  }
}
</script>
<style lang='less' rel="stylesheet/less">
@import '../../assets/style/variable';
@import '../../assets/style/page';
@c-border1:#cbd6e3;
@c-toptitle: #33475B;
.group-container.logistic-container{
  position: relative;
  overflow: visible;
  margin-bottom: 30px;
}
.text-ellipsis(){
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.right-module{
  margin: 10px;
  vertical-align: middle;
  text-align: right;
  .el-button{
    a{
      color: @white;
    }
  }
}
.add-prod{
  position: absolute;
  right: 0;
  top: -70px;
  .icon-add{
    margin-right: 5px;
    display: inline-block;
    vertical-align: middle;
  }
  .el-button{
    width: 120px;
    height: 40px;
  }
  a{
    display: block;
    color: #fff;
  }
}
.no-data a{
  color: @white;
}
// 列表
.product-tab{
  [class^="icon"]{
    margin-left: 10px;
    font-size: 16px;
    color: #7C98B6;
    &:hover{
      color: @activeBlue;
    }
  }
  a{
    color: @textColor;
  }
}
.el-tooltip__popper.is-dark{
  background-color: #415b77;
}
/*.el-table--enable-row-hover .el-table__body tr{
  td:last-child a{
    display: none;
  }
  &:hover td:last-child a{
    display: inline-block;
  }
}*/
.list-box{
  position: relative;
  .opt-box{
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 0;
    border-left: 0;
    z-index: 99;
    .butt{
      padding: 0 15px;
    }
  }
  .chked-opt{
    margin-left: -4px;
    label, a{
      margin: 0 20px 0 10px;
      color: @mainFontColor;
      font-weight: normal;
    }
    i{
      margin-right: 5px;
    }
  }
  .el-table th{
    height: 48px;
    background-color: #F5F8FA;
  }
}
@border: #dfe3eb;
.list-header{
  border-top: 1px solid @border;
  border-bottom: 1px solid @border;
  background-color: #F5F8FA;
  overflow: hidden;
  li{
    height: 48px;
    line-height: 48px;
    font-weight: bold;
  }
}
.list-record{
  padding: 10px 0;
  height: 62px;
  border-bottom: 1px solid @border;
  background-color: #fff;
  li{
    height: 60px;
    line-height: 60px;
    p{
      line-height: 24px;
    }
  }
  .group-opt{
    position: static;
    display: none;
  }
  &:hover{
    background-color: #F5F8FA;
    .group-opt{
      display: inline-block;
    }
  }
}
.list-wrap{
  ul{
    width: 100%;
  }
  .el-checkbox{
    margin-right: 10px;
  }
  li{
    float: left;
    width: 23%;
    font-size: 13px;
    text-align: left;
  }
  .rec-long{
    padding-left: 4%;
    width: 43%;
    text-align: left;
    a{
      color: #33475B;
    }
    p{
      width: 500px;
      .text-ellipsis()
    }
  }
  .rec-short{
    width: 3%;
  }
  .rec-pic{
    width: 10%;
    img{
      width: 64px;
      height: 64px;
    }
  }
  .chk-wrap{
    width: 12%;
    padding-left: 2%;
    text-align: left;
  }
}
// 分组排序弹框
.group-model{
  .confirm-btn{
    text-align: center;
  }
}
.el-select-group{
  li{
    padding-left: 40px;
    color: @textColor;
  }
  li:nth-child(1){
    padding-left: 10px;
  }
}
.el-select-dropdown{
  .el-select-group__title{
    height: 0;
  }
}
.el-select-dropdown__item.selected{
  background-color: #e6f6f6;
  color: @textColor;
  &.hover{
    background-color: #f4f8fb;
  }
}
.name-wrapper{
  /*width: 100%;*/
  .text-ellipsis();
}
.list-record {
  .name-wrapper{
    display: inline-block;
    max-width: 75%;
    height: 20px;
    line-height: 20px;
  }
}
.el-table__empty-block{
  display: none;
}
// 分组
.group-box{
  display: -webkit-box;
  display: box;
  h3{
    padding-left: 20px;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    // font-weight: normal;
    background-color: #f5f8fa;
    border-bottom: 1px solid #DFE3EB;
    /*border-radius: 4px 4px 0 0;*/
    /*color: #33475B;*/
    .el-button{
      float: right;
    }
  }
  .selected{
    background-color: #e6f8fa;
    &:hover{
      background-color: #e6f8fa;
    }
  }
  .tips{
    margin-top: 100px;
    color: #CBD6E2;
  }
}
.group-pop.el-popover{
  padding: 10px;
  min-width: 20px;
  max-width: 600px;
  p{
    line-height: 20px;
    text-align: center;
  }
}
.group-first, .group-sec{
  height: 550px;
  flex: 1;
  -webkit-flex: 1;
  -webkit-box-flex: 1;
  // overflow: auto;
  ul{
    height: 508px;
    border-right: 1px solid @c-border1;
  }
}
.group-item-first{
  font-weight: bold;
}
.group-item{
  position: relative;
  padding-left: 20px;
  height: 44px;
  line-height: 44px;
  border-bottom: 1px solid @c-border1;
  .group-opt{
    .item{
      display: none;
    }
  }
  &:hover{
    background-color: #f5f8fa;
    .group-opt{
      .item{
        display: inline-block;
      }
    }
  }
  label{
    display: inline-block;
    max-width: 350px;
    font-size: 13px;
    color: @textColor;
    .text-ellipsis();
  }
  .el-input{
    margin-right: 10px;
  }
  .el-button{
    padding: 6px 20px;
  }
  .el-button--default{
    border: 0;
    color: #7c98b6;
    background-color: transparent;
    &:hover{
     color: @activeBlue;
    }
  }
}
.group-opt{
  position: absolute;
  right: 20px;
  top: 3px;
  [class^="icon"]{
    margin-left: 10px;
    font-size: 16.2px;
    color: #B0C1D4;
    &:hover{
      color: @activeBlue;
    }
  }
}
.input-s{
  width: 220px;
  .el-input__inner{
    height: 28px;
  }
}
.btn-white{
  margin: 10px 10px 0 0;
  padding: 6px 15px;
  border: 1px solid #CBD6E3;
  vertical-align: middle;
  i{
    margin-right: 5px;
    color: #b1c2d5;
  }
}
.icon-adjust{
  cursor: move;
}
// .icon-arright{
//   position: absolute;
//   right: 5px;
//   top: 3px;
// }
</style>
