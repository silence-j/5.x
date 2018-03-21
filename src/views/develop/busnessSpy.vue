<template>
  <div class="busness_spy">
    <!--新设计稿，需要再次修改未定，不删，不确定以后会不会用这个版本的设计-->
    <!--<div class="new-spy">-->
      <!--<div class="spy-top">-->
        <!--<router-link to="/shield?type=1">-->
          <!--<el-button class="already">-->
            <!--已添加公司 ({{addCount}})-->
          <!--</el-button>-->
        <!--</router-link>-->
        <!--<router-link to="/shield?type=2">-->
          <!--<el-button class="already">-->
            <!--已屏蔽公司 ({{ignoreCount}})-->
          <!--</el-button>-->
        <!--</router-link>-->
        <!--<span class="top-right">-->
          <!--<span class="recent-add" @click="menuShow = !menuShow">-->
            <!--<i class="icon-font icon-menu"></i>最近提交-->
          <!--</span>-->
          <!--<el-button type="primary" class="key" @click="ifShield = true">-->
            <!--<em class="el-icon-plus"></em>商品关键词-->
          <!--</el-button>-->
        <!--</span>-->
      <!--</div>-->
      <!--<div class="menu-sky" v-if="menuShow">-->
        <!--<span class="sky" :title="item" v-for="item in recentKeywords" @click="newHandItem(item)">{{item}}</span>-->
      <!--</div>-->
      <!--&lt;!&ndash;数据部分&ndash;&gt;-->
      <!--<div class="data-record">-->
        <!--<ul class="ul-title">-->
          <!--<li class="new-sky" style="padding-left:20px;line-height: 44px;">商品关键字</li>-->
          <!--<li class="new-com">公司</li>-->
          <!--<li class="new-rec">海关记录</li>-->
          <!--<li class="new-ln">LinkedIn联系人</li>-->
          <!--<li class="new-fb">Fackbook联系人</li>-->
          <!--<li class="new-run">自动运行-->
            <!--<el-tooltip class="item" effect="dark" content="开启后，24小时后自动开启搜索" placement="top">-->
              <!--<em class="el-icon-warning"></em>-->
          <!--</el-tooltip>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<div class="no-records" v-if="false">-->
          <!--<img src="../../assets/img/empty-contact.png" alt="">-->
          <!--<p>暂无数据,请先创建商品关键字</p>-->
        <!--</div>-->
        <!--<div class="data-list" v-for="busnessSpy in busnessSpyList" :key="busnessSpy">-->
          <!--<ul class="un-achieve" v-if="busnessSpy.status!=2">-->
            <!--<li class="new-sky list-common" style="padding-left:20px">-->
              <!--<p class="sky-name" :title="busnessSpy.keywords">{{busnessSpy.keywords}}</p>-->
              <!--<p class="sky-time">{{busnessSpy.createTime | time-formater-no-second}}</p>-->
            <!--</li>-->
            <!--<li class="new-com list-common dif-com1">-->
              <!--<span class="color-cir">-->
                <!--<span class="contect-cir">-->
                  <!--<span class="hidden-cir"></span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="text-word">分析中...</span>-->
            <!--</li>-->
            <!--<li class="new-rec list-common">-->
              <!--<span class="color-cir">-->
                <!--<span class="contect-cir">-->
                  <!--<span class="hidden-cir"></span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="text-word">分析中...</span>-->
            <!--</li>-->
            <!--<li class="new-ln list-common">-->
              <!--<span class="color-cir">-->
                <!--<span class="contect-cir">-->
                  <!--<span class="hidden-cir"></span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="text-word">分析中...</span>-->
            <!--</li>-->
            <!--<li class="new-fb list-common">-->
              <!--<span class="color-cir">-->
                <!--<span class="contect-cir">-->
                  <!--<span class="hidden-cir"></span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="text-word">分析中...</span>-->
            <!--</li>-->
            <!--<li class="new-run list-common">-->
              <!--<span class="auto-run">-->
                  <!--<el-switch-->
                    <!--:disabled="true"-->
                    <!--v-model="testSwitch"-->
                    <!--on-text=""-->
                    <!--off-text="">-->
                  <!--</el-switch>-->
                <!--</span>-->
            <!--</li>-->
          <!--</ul>-->
          <!--<ul class="achieve" v-else @click="isShow(busnessSpy.id, busnessSpy.keywords, busnessSpy, $event)">-->
            <!--<li class="new-sky list-common" style="padding-left:20px">-->
              <!--<p class="sky-name" :title="busnessSpy.keywords">{{busnessSpy.keywords}}</p>-->
              <!--<p class="sky-time">{{busnessSpy.createTime | time-formater-no-second}}</p>-->
            <!--</li>-->
            <!--<li class="new-com list-common">{{busnessSpy.dashboard.companySize}}</li>-->
            <!--<li class="new-rec list-common">{{busnessSpy.dashboard.customsSize}}</li>-->
            <!--<li class="new-ln list-common">{{busnessSpy.dashboard.linkedInSize}}</li>-->
            <!--<li class="new-fb list-common">{{busnessSpy.dashboard.facebookSize}}</li>-->
            <!--<li class="new-run list-common">-->
              <!--<span class="auto-run">-->
                  <!--<el-switch-->
                    <!--v-model="busnessSpy.switchTag"-->
                    <!--@change="changeSwitch(busnessSpy)"-->
                    <!--on-text=""-->
                    <!--off-text="">-->
                  <!--</el-switch>-->
                <!--</span>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <div :class="busnessSpyList.length !== 0  ? 'have-result input-contianer' : 'no-result input-contianer'">
      <el-input placeholder="商品英文关键字" v-model.trim="searchFor" @keyup.enter.native="handClickIcon(1)" style="height:60px;" :maxlength="160">
        <el-button type="primary" slot="append" @click="handClickIcon(1)" style="height:58px;width: 80px;background-image: linear-gradient(90deg, #5488F9  0%, #00B8CC 100%);border-radius: 0px 4px 4px 0;border: none">提交</el-button>
      </el-input>
      <div class="busness_prompt" v-if="!isLoading">
        <span class="show-flag">
          <span class="flag-sub">最近提交</span>
          <span class="flag-container">
            <span class="flag" :title="item" v-for="item in recentKeywords" @click="handItem(item)">{{item}}</span>
          </span>
        </span>
        <span class="have-task">剩余可提交<span class="task-num">{{remainNum}}</span>个侦探任务</span>
      </div>
    </div>
    <!--<div class="busness_spy_placeholder"></div>-->
    <div class="loading loading-circle loading-top" v-if="isLoading"></div>
    <!--<transition-group name="list">-->
      <div v-if="!isLoading">
        <span class="added-company">
          已添加公司
          <a href="/#/shield?type=1" class="added-count">{{addCount}}</a>
        </span>
        <span class="shield-company">
          已屏蔽公司
          <a href="/#/shield?type=2" class="shield-count">{{ignoreCount}}</a>
        </span>
        <div :class="submit === true ? 'spile busness_task_list' : 'busness_task_list'" v-for="busnessSpy in busnessSpyList" :key="busnessSpy">
          <!--任务处理未完成-->
          <div class="busness_task" v-if="busnessSpy.status!=2">
            <div class="task_name">
              <span class="progress">
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
                <span class="circle" style="background: #00B8CC;"><i class="el-icon-check"></i></span>任务创建
              </span>
              <span class="connect-line bg-ani"></span>
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
                <span class="circle" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);"><i class="el-icon-check"></i></span>线索采集
              </span>
              <span class="connect-line line-bg-gray"></span>
              <span class="progress-show bg-gray">
                <span class="circle line-bg-gray"></span>数据分析
              </span>
              <span class="connect-line line-bg-gray"></span>
              <span class="progress-show bg-gray">
                <span class="circle line-bg-gray"></span>任务完成
              </span>
            </span>
            </div>
            <!--<div class="task_name"><span class="left_desc">任务：{{busnessSpy.keywords}}</span>-->
            <!--<span class="right_desc">创建时间：{{busnessSpy.createTime | time-formater-no-second}}</span>-->
            <!--</div>-->
            <div class="task_info">
              <div class="taskName" >
                <div :title="busnessSpy.keywords" class="key-wrapper key-hover">
                  {{busnessSpy.keywords}}
                </div>
                <span class="task-create-time">{{busnessSpy.createTime | time-formater-no-second}}</span>
                <span class="auto-run">
                  <el-switch
                    :disabled="true"
                    v-model="testSwitch"
                    on-text=""
                    off-text="">
                  </el-switch>
                  <span class="switch-text">自动运行</span>
                </span>
                <!--<el-popover trigger="hover" placement="top" popper-class="group-popo">-->
                  <!--<p>{{busnessSpy.keywords}}</p>-->
                  <!--<span slot="reference" class="key-wrapper">-->
                  <!--{{busnessSpy.keywords}}-->
                <!--</span>-->
                <!--</el-popover>-->
                <!--<el-tooltip class="item" effect="dark" content="busnessSpy.keywords" placement="top">-->
                  <!--<span class="keywords">{{busnessSpy.keywords}}</span>-->
                <!--</el-tooltip>-->
              </div>
              <!--<div class="taskName" :title="busnessSpy.keywords">-->
                <!--{{busnessSpy.keywords}}-->
              <!--</div>-->
              <div class="task-line"></div>
              <div class="taskData">
                <div class="task_info_module">
                  <p class="num">
                    <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                  </p>
                  <p class="desc" style="position: relative; top: -15px;">公司</p>
                </div>
                <div class="task_info_module">
                  <p class="num">
                    <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                  </p>
                  <p class="desc" style="position: relative; top: -15px;">海关记录</p>
                </div>
                <div class="task_info_module">
                  <p class="num">
                    <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                  </p>
                  <p class="desc" style="position: relative; top: -15px;">Linkedin联系人</p>
                </div>
                <div class="task_info_module">
                  <p class="num">
                    <span class="color-cir"><span class="contect-cir"><span class="opp">分析中</span><span class="hidden-cir"></span></span></span>
                  </p>
                  <p class="desc" style="position: relative; top: -15px;">Facebook联系人</p>
                </div>
              </div>
            </div>
          </div>
          <!--任务处理已完成-->
          <div :class="busnessSpy.dashboard.companySize === 0 && busnessSpy.dashboard.customsSize === 0 && busnessSpy.dashboard.linkedInSize === 0 && busnessSpy.dashboard.facebookSize === 0 ? 'busness_task link_busness_info' : 'busness_task link_busness_info taskHover'" v-else @click="isShow(busnessSpy.id, busnessSpy.keywords, busnessSpy, $event)">
            <div class="task_name">
              <span class="progress">
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
                <span class="circle" style="background: #00B8CC;"><i class="el-icon-check"></i></span>任务创建
              </span>
              <span class="connect-line bg-ani"></span>
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);">
                <span class="circle" style="background-image: linear-gradient(-90deg, #15ACD7 0%, #1FA7DD 100%);"><i class="el-icon-check"></i></span>线索采集
              </span>
              <span class="connect-line" style="background-image: linear-gradient(-90deg, #00B8CC 0%, #5488F9 100%);"></span>
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);">
                <span class="circle" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);"><i class="el-icon-check"></i></span>数据分析
              </span>
              <span class="connect-line" style="background-image: linear-gradient(-90deg, #00B8CC 0%, #5488F9 100%);"></span>
              <span class="progress-show" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);">
                <span class="circle" style="background-image: linear-gradient(-90deg, #359BE8 0%, #3F93EE 100%);"><i class="el-icon-check"></i></span>任务完成
              </span>
            </span>
            </div>
            <div class="task_info">
              <div class="taskName">
                <div :title="busnessSpy.keywords" class="key-wrapper key-hover">
                  {{busnessSpy.keywords}}
                </div>
                <span class="task-create-time">{{busnessSpy.createTime | time-formater-no-second}}</span>
                <span class="auto-run">
                  <el-switch
                    v-model="busnessSpy.switchTag"
                    @change="changeSwitch(busnessSpy)"
                    on-text=""
                    off-text="">
                  </el-switch>
                  <span class="switch-text">自动运行</span>
                </span>
              </div>
              <div class="task-line"></div>
              <div class="taskData">
                <div class="task_info_module">
                  <p class="num">{{busnessSpy.dashboard.companySize}}</p>
                  <p class="desc">公司</p>
                </div>
                <div class="task_info_module">
                  <p class="num">{{busnessSpy.dashboard.customsSize}}</p>
                  <p class="desc">海关记录</p>
                </div>
                <div class="task_info_module">
                  <p class="num">{{busnessSpy.dashboard.linkedInSize}}</p>
                  <p class="desc">Linkedin联系人</p>
                </div>
                <div class="task_info_module">
                  <p class="num">{{busnessSpy.dashboard.facebookSize}}</p>
                  <p class="desc">Facebook联系人</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!--</transition-group>-->
    <!--新设计稿创建关键字对话框-->
    <!--<div v-show="ifShield" class="task-dialog">-->
      <!--<div class="Sdialog">-->
        <!--<div class="dia-title">-->
          <!--<span class="create">创建商品(英文)关键字</span>-->
          <!--<em class="el-icon-close del" @click="ifShield = false"></em>-->
        <!--</div>-->
        <!--<div class="task-input">-->
          <!--<el-input placeholder="请输入商品关键字" v-model.trim="searchFor" @keyup.enter.native="handClickIcon(1)" :class="error ? 'error' : ''"  :maxlength="160"></el-input>-->
          <!--<p class="last-task" v-if="taskTrue">剩余可提交<span>{{remainNum}}</span>个侦探任务</p>-->
          <!--<p class="last-task" v-else>-->
            <!--<span class="iconfont warning">&#xe629;</span>-->
            <!--此商品关键词已存在,请更换关键词-->
          <!--</p>-->
        <!--</div>-->
        <!--<div style="float: left;padding-left: 40px">-->
          <!--<span class="okall ok" @click="handClickIcon(1)">确定</span>-->
          <!--<span class="okall cancle" @click="ifShield = false">取消</span>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  export default{
    name: 'BusnessSpy',
    data () {
      this.$router.beforeEach((to, from, next) => {
        window.scrollTo(0, 0)
        next()
      })
      return {
        searchFor: '',
        page: 1,
        pageSize: 100,
        menuShow: false,
        busnessSpyList: [],   // 数据列表
        isLoading: true,
        display: false,
        remainNum: 3,
        totalCount: 0,
        timer: '',
        recentKeywords: [],
        submit: false,
        raise: false,
        noTab: 0,
        testSwitch: false,
        addCount: 0,
        ignoreCount: 0,
        recordLength: 0,
        ifShield: false,
        error: true,
        taskTrue: true
      }
    },
    computed: {
    },
    destroyed () {
      clearInterval(this.timer)
    },
    mounted () {
      this.page = 1
      this.getTaskListFunc()
      DevelopAPI.getAddedCount().then(res => {
        if (!res.data.code) {
          this.addCount = res.data.data.addCount
          this.ignoreCount = res.data.data.ignoreCount
        }
      })
      this.timer = setInterval(() => {
        if (this.recordLength !== 5 - this.remainNum) {
          this.page = 1
          this.getTaskListFunc()
        }
      }, 60000)
    },
    methods: {
//      // 分页每页条数改变回调方法
//      handleSizeChange (val) {
//        console.log(`每页 ${val} 条`)
//        this.pageSize = val
//        this.getTaskListFunc()
//      },
//      // 分页页码改变回调方法
//      handleCurrentChange (val) {
//        this.page = val
//        this.getTaskListFunc()
//      },
      handItem (val) {
        this.searchFor = val
      },
      newHandItem (val) {
        this.ifShield = true
        this.taskTrue = false
        this.searchFor = val
      },
      // 提交创建任务
      handClickIcon (val) {
        this.noTab = 0
        if (val === 1) {
          if (this.searchFor === '') {
            this.$message({message: '商品任务关键字不能为空', type: 'error'})
            return
          }
        } else {
          this.searchFor = val
        }
        let params = {
          keywords: this.searchFor
        }
        DevelopAPI.addTask(params).then(res => {
          if (res.data.code === 0) {
            this.ifShield = false
            this.remainNum--
            for (var i = 0; i < this.recentKeywords.length; i++) {
              if (this.searchFor !== this.recentKeywords[i]) {
                this.noTab++
              }
            }
            if (this.noTab === this.recentKeywords.length) {
              if (this.recentKeywords.length > 4) {
                this.recentKeywords.splice(4, 1)
                this.recentKeywords.unshift(this.searchFor)
              } else {
                this.recentKeywords.unshift(this.searchFor)
              }
            }
            this.submit = true
            this.page = 1
            let cur = {
              createTime: new Date(),
              dashboard: {
                companySize: 0,
                customsSize: 0,
                facebookSize: 0,
                relativeContactsSize: 0
              },
              keywords: this.searchFor
            }
            setTimeout(() => {
              this.submit = false
              this.busnessSpyList.unshift(cur)
              this.raise = false
            }, 800)

            this.searchFor = ''
//             this.getTaskListFunc()
//            setTimeout(() => {
//              this.submit = false
//              this.getTaskListFunc()
//            }, 500)
          } else {
            this.$message({message: res.data.message, type: 'error'})
          }
        })
      },
      linkBusness (id, keyword) {
        keyword = encodeURIComponent(keyword)
        let linkurl = '/tradeSearch?taskId=' + id + '&taskName=' + keyword
        this.$router.push({path: linkurl})
      },
      isShow (id, keyword, busnessSpy, e) {
        if (e.target.className.indexOf('el-switch__label') >= 0 || e.target.className.indexOf('el-switch__input') >= 0) {
          return false
        }
        if (busnessSpy.dashboard.companySize === 0 && busnessSpy.dashboard.customsSize === 0 && busnessSpy.dashboard.linkedInSize === 0 && busnessSpy.dashboard.facebookSize === 0) {
//          return
        } else {
          this.linkBusness(id, keyword)
        }
      },
      // 获取任务列表
      getTaskListFunc () {
        this.display = false
        this.isLoading = true
        let params = {
          page: this.page,
          pageSize: this.pageSize
        }
        DevelopAPI.getTaskList(params).then(res => {
          let resdata = res.data
          if (resdata.code === 0) {
            this.isLoading = false
            this.recordLength = 0
            this.busnessSpyList = resdata.data.records.map((item) => {
              if (item.dashboard !== null) {
                this.recordLength ++
              }
              return Object.assign({}, item, {switchTag: Boolean(+item.switchTag)})
            })
            this.totalCount = resdata.data.totalCount
            this.recentKeywords = resdata.data.recentKeywords
            this.remainNum = resdata.data.leftSubmitTimes
            if (this.totalCount === 0) {
              this.display = true
            }
          } else {
            this.display = true
          }
        })
      },
      changeSwitch (item) {
        let switchTag = item.switchTag ? 1 : 0
        let keywords = item.keywords
        DevelopAPI.switchAutoTask({ keywords, switchTag }).then(res => {
          if (!res.data.code) {
            this.$message.success('设置成功')
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  /*.ist-enter-active, .list-leave-active {*/
    /*transition: all 2s;*/
  /*}*/
  /*.list-enter, .list-leave-to {*/
    /*transform: translateY(0);*/
  /*}l*/
  body div.el-popover.group-popo {
    padding: 10px;
    min-width: 20px;
    background: #415b77;
    color: #fff;
    border-radius: 4px;
    .popper__arrow::after{
    border-bottom-color: #415b77;
    border-top-color: #415b77;
    }
  }
  .top_prompt{
    position: absolute;
    width:100%;
    left:0px;
    top:149px;
    background: #FDF8E6;
    padding:17px 0;
    text-align: center;
    font-size: 13px;
    color: #4F6D95;
    line-height: 18px;
    z-index: 20;
    .highlighted{
      font-size: 13px;
      color: #FFA726;
      margin:0 2px;
    }
  }
  .busness_spy_placeholder{
    width:100%;
    height:70px;
  }
  .busness_spy{
    .task-dialog{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      background: rgba(0, 0, 0, .4);
      z-index: 207;
      .Sdialog{
        position: relative;
        width:460px;
        height: 228px;
        font-size: 14px;
        color: #33475B;
        background: #FFFFFF;
        box-sizing: border-box;
        box-shadow: 0 0px 18px 0 rgba(0,0,0,0.20);
        border-radius: 4px;
        margin: 15% auto 0;
        vertical-align: middle;
        .dia-title{
          position: relative;
          font-size: 14px;
          color: #33475B;
          height: 48px;
          line-height: 48px;
          border-bottom: 1px solid #DFE3EB;
          .create{
            float: left;
            margin-left:16px;
          }
          .del{
            position: absolute;
            right: 15px;
            top: 16px;
            cursor: pointer;
            color: #c0ccda;
            font-size: small;
          }
        }
        .task-input{
          .el-input{
            .el-input__inner{
              width:380px;
              margin:24px auto 8px;
            }
            .error{
              border: 1px solid red;
            }
          }
          .last-task{
            width:380px;
            text-align: left;
            margin-left:40px;
            margin-bottom: 28px;
            .warning{
              font-size: 22px;
              color:  #FEA000;
              margin-right: 6px;
              vertical-align: middle;
            }
          }
        }
        .warning{
          font-size: 22px;
          color:  #FEA000;
          margin-right: 6px;
          vertical-align: middle;
        }
        .look{
          color: rgb(124, 152, 182);
          display: inline-block;
          margin: 20px 0 25px 0;
          padding-left: 30px;
        }
        .okall{
          display: inline-block;
          width:80px;
          height: 32px;
          line-height: 32px;
          cursor: pointer;
        }
        .ok{
          background: #5488F9;
          border-radius: 4px;
          color: #fff;
        }
      }
    }
    margin-bottom: 30px;
    .paging-column{
      float: right;
      padding: 20px;
    }
    .no-result{
      width:800px;
      margin: 160px auto 94px;
    }
    .input-contianer{
      .el-input{
        .el-input__inner{
          height:60px;
          width:720px;
          .el-input-group__append{
            background-image: linear-gradient(90deg, #00B8CC 0%, #5488F9 100%);
          }
        }
      }
      .el-input .el-input-group__append{
        /*background: #5488F9;*/
        color:#fff;
      }
    }
    .have-result{
      width:800px;
      margin: 60px auto 94px;
      transition:All 2.0s ease-in-out;
    }
    .added-company, .shield-company{
      display: inline-block;
      width: 115px;
      margin-right: 25px;
      vertical-align: top;
      font-size: 14px;
      color: #4F6D95;
      .added-count, .shield-count{
        text-decoration: underline;
        color: #419bf9;
      }
      .shield-count{
        color: #feaa2f;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  .taskHover{
    cursor: pointer;
  }
  .busness_spy{
    .new-spy{
      margin-top:16px;
      width:1200px;
      height:692px;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.08);
      border-radius: 4px;
      background: #fff;
      .spy-top{
        height:60px;
        padding:12px 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .already{
          min-width:120px;
          margin-right: 10px;
        }
        .top-right{
          float: right;
          .recent-add{
            font-size: 13px;
            cursor: pointer;
            color: #4F6D95;
            .icon-menu{
              margin-right: 5px;
            }
          }
          .key{
            margin-left: 40px;
            em{
              font-size: smaller;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .menu-sky{
      width:100%;
      height: 60px;
      background: #F5F8FA;
      padding: 15px 20px;
      box-sizing: border-box;
      border-bottom:1px solid #DFE3EB;
      .sky{
        height: 28px;
        display: inline-block;
        padding: 0 16px;
        line-height: 28px;
        font-size: 13px;
        color: #4F6D95;
        margin-right: 8px;
        cursor: pointer;
        background: #e4ecfe;
        border-radius: 4px;
      }
      .sky:last-child{
        margin-right: 0;
      }
    }
    .data-record{
      .no-records{
        padding-top: 180px;
        text-align: center;
        font-size: 14px;
        color: #33475B;
        img{
          margin-bottom: 30px;
        }
      }
      .ul-title{
        height: 40px;
        background: #F5F8FA;
      }
      ul{
        height: 60px;
        li{
          float: left;
          display: inline-block;
          font-size: 14px;
          box-sizing: border-box;
          color: rgba(51,71,91,0.80);
          height: 44px;
          line-height: 44px;
        }
        .new-sky{
          width:454px;
          .sky-name{
            height: 28px;
            font-size: 20px;
            color: #33475B;
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .sky-time{
            height: 24px;
            font-size: 14px;
            color: #7C98B6;
            line-height: 24px;
          }
        }
        .new-com{
          width:120px;
          text-align: center;
        }
        .new-rec{
          width:134px;
          text-align: center;
        }
        .new-ln{
          width:172px;
          text-align: center;
        }
        .new-fb{
          width:184px;
          text-align: center;
        }
        .new-run{
          width:136px;
          text-align: center;
          position: relative;
        }
      }
      .data-list{
        width: 1200px;
        height: 60px;
        line-height: 60px;
        background: #fff;
        border-bottom: 1px solid #DFE3EB;
        &:hover{
          background: #F5F8FA;
        }
        ul{
          .list-common{
            height:60px;
            line-height:60px;
            /*border-bottom:1px solid #DFE3EB;*/
            .text-word{
              font-size: 12px;
              color: #555555;
            }
            .color-cir{
              display: inline-block;
              vertical-align: text-bottom;
              width: 16px;
              height: 16px;
              margin-right: 3px;
              position: relative;
              background-image: linear-gradient(10deg, #00B8CC 0%, #5488F9 100%);
              border-radius: 50%;
              .contect-cir{
                display: inline-block;
                width: 12px;
                height: 12px;
                position: absolute;
                border-radius: 50%;
                background: #fff;
                top: 1.8px;
                left: 2px;
                .hidden-cir{
                  position: absolute;
                  display: inline-block;
                  width: 9px;
                  height: 9px;
                  background: #fff;
                  border-radius: 50%;
                  right: -3px;
                  bottom: -3px;
                }
              }
            }
            .auto-run{
              display: inline-block;
              position: absolute;
              top: -4px;
              right: 10px;
              width: 110px;
              height: 50px;
              .switch-text{
                line-height: 50px;
                color: #7c98b6;
                font-size: 12px;
              }
            }
          }
        }
        .un-achieve{
        }
      }
    }
    .busness_prompt{
      margin-top:10px;
      font-size: 13px;
      color: #4F6D95;
      letter-spacing: 0px;
      line-height: 18px;
      .show-flag{
        float: left;
        .flag-sub{
          vertical-align: top;
          display: inline-block;
          height: 24px;
          line-height: 24px;
        }
      }
      .have-task{
        float: right;
        .task-num{
          padding: 0 5px;
          font-size: 13px;
          color: #5488F9;
        }
      }
      .flag-container{
        display: inline-block;
        height: 24px;
        width:590px;
        .flag{
          display: inline-block;
          padding: 0 8px;
          height: 22px;
          line-height: 22px;
          font-size: 13px;
          margin-left: 8px;
          background: rgba(84,136,249,0.10);
          border: 1px solid rgba(84,136,249,0.20);
          border-radius: 4px;
          cursor: pointer;
          max-width: 94px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .busness_task_list:hover{
      box-shadow: 0 0 14px rgba(84, 136, 249,.25);
    }
    .spile{
      transform: translateY(258px);
      transition: all 1.0s ease-in-out;
    }
    .busness_task_list{
      /*transform: translateY(100px);*/
      margin-top:4px;
      .link_busness_info{
      }
      .busness_task{
        margin-top:20px;
        background: #FFFFFF;
        box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.08);
        border-radius: 4px;
        .task_name{
          padding: 12px 60px 12px 40px;
          background: #F5F8FA;
          border: 1px solid #DFE3EB;
          display: inline-block;
          width:1100px;
          border-left: 2px;
          border-radius: 4px 4px 0 0;
          .left_desc{
            display: inline-block;
            width:210px;
            font-size: 14px;
            color: #7C98B6;
          }
          .progress{
            .progress-show{
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              display: inline-block;
              width:80px;
              height: 22px;
              line-height: 22px;
              border-radius: 100px;
              font-size: 12px;
              color: #FFFFFF;
              .circle{
                display: inline-block;
                width:14px;
                height: 14px;
                margin-left: 6px;
                margin-right: 2px;
                vertical-align: text-bottom;
                border-radius: 50%;
                .el-icon-check{
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: #fff;
                  color: #fff;
                  font-size: 8px;
                  position: relative;
                  top:-5px;
                  left: 1px;
                  transform: scale(0.7);
                }
              }
            }
            .bg-color{
              background: #00B8CC;
            }
            .connect-line{
              display: inline-block;
              width:247px;
              height: 2px;
              vertical-align: middle;
            }
            .bg-gray{
              color: #B0C1D4;
              -webkit-text-fill-color: #B0C1D4;
            }
            .line-bg-gray{
              background-color: #B0C1D4;
            }
            .bg-ani{
              background-image: linear-gradient(90deg, #00B8CC 0%, #5488F9 100%);
            }
          }
          .right_desc{
            float:right;
            color: #7C98B6;
          }
        }
      }
      .task_info{
        overflow:hidden;
        height:112px;
        font-size: 0;
        border: 1px solid #fff;
        border-radius: 0 0 4px 4px;
        .taskName{
          display: inline-block;
          position: relative;
          width:399px;
          float: left;
          vertical-align: top;
          font-size: 20px;
          color: #33475B;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 34px 40px;
          .key-wrapper{
            width: 68%;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 26px;
            line-height: 26px;
          }
          .task-create-time{
            font-size: 12px;
            color: #7C98B6;
          }
          .auto-run{
            display: inline-block;
            position: absolute;
            top: 30px;
            right: 5px;
            width: 110px;
            height: 50px;
            .switch-text{
              line-height: 50px;
              color: #7c98b6;
              font-size: 12px;
            }
          }
          .key-hover:hover{
            color: #5488F9;
          }
          .keywords{
            width:100%;
            overflow: hidden;
            height: 22px;
            text-overflow: ellipsis;
            display: inline-block;
            margin: 60px 0;

          }
        }
        .task-line{
          margin-top: 24px;
          display: inline-block;
          width:1px;
          height: 64px;
          background: #DFE3EB;
        }
        .taskData{
          display: inline-block;
          vertical-align: top;
          height: 100%;
          width:708px;
        }
        .task_process{
          float:left;
          width:930px;
          height:100%;
          .process_desc{
            padding:50px 35px 68px 35px;
            overflow:hidden;
            .process_module{
              display: block;
              width:25%;
              box-sizing: border-box;
              float: left;
              font-size: 13px;
              color: #33475B;
              line-height: 18px;
              .label{
                margin-top:24px;
              }
              .process_line{
                position:relative;
              }
              .process_line:after{
                content: '';
                width: 265px;
                height: 6px;
                background: #EAF0F6;
                position: absolute;
                top: 7px;
              }
              .current_after,.after{
                .circle{
                  background: #00B8CC;
                }
              }
              .after.process_line:after{
                background:#00B8CC;
              }
              .current_after.process_line:after{
                background: -webkit-linear-gradient(left, #00B8CC , #5488F9); /* Safari 5.1 - 6.0 */
                background: -o-linear-gradient(right, #00B8CC, #5488F9); /* Opera 11.1 - 12.0 */
                background: -moz-linear-gradient(right, #00B8CC, #5488F9); /* Firefox 3.6 - 15 */
                background: linear-gradient(to right, #00B8CC , #5488F9); /* 标准的语法 */
              }
              .current{
                .circle{
                  background: #5488F9;
                }
              }
              .circle{
                width:20px;
                height:20px;
                border-radius: 10px;
                display: inline-block;
                background: #EAF0F6;
              }
            }
            .process_module:nth-child(1){
              .circle{
                margin-left:30px;
              }
            }
            .process_module:nth-child(2){
              text-align: center;
            }
            .process_module:nth-child(3){
              text-align: center;
            }
            .process_module:nth-child(4){
              text-align: right;
              .circle{
                margin-right:30px;
              }
            }
          }
        }
        .task_desc{
          float:left;
          width:269px;
          border-left: 1px solid #DFE3EB;
          height:100%;
          font-size: 20px;
          color: #7C98B6;
          line-height: 180px;
          text-align: center;
        }
        .task_info_module{
          width:25%;
          float: left;
          text-align: center;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
            .num{
              padding-top: 18px;
              font-size: 36px;
              color: #5488F9;
              line-height: 36px;
              margin-bottom:10px;
              .color-cir{
                display: inline-block;
                width: 48px;
                height: 48px;
                background-image: linear-gradient(10deg, #00B8CC 0%, #5488F9 100%);
                border-radius: 50%;
                .contect-cir{
                  font-size: 12px;
                  color: #C5D0DE;
                  display: inline-block;
                  width: 40px;
                  height: 40px;
                  background: #fff;
                  border-radius: 50%;
                  position: relative;
                  top: 4px;
                  .opp{
                    position: relative;
                    top:2px;
                    z-index: 99;
                  }
                  .hidden-cir{
                    display: inline-block;
                    width:25px;
                    height: 25px;
                    position: relative;
                    background: #fff;
                    top:-12px;
                    left: 14px;
                    border-radius: 50%;
                  }
                }
              }
            }
          .desc{
            font-size: 13px;
            color: #33475B;
            line-height: 18px;
          }
        }
      }
    }
  }
</style>
