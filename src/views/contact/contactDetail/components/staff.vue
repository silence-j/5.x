<template>
  <div class="staff">
    <el-collapse accordion :value="selectName">
      <el-collapse-item title="员工" name="staff">
        <div class="staff-container">
          <div class="staff-item" v-for="(staff,index) in staffList" v-show="index < 3" :key="staff">
            <img v-if="staff.avatar" :src="staff.avatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
            <img v-if="!staff.avatar" src="../../../../assets/img/default_avatar.png">
            <span class="info">
          <a
            :title="staff.firstName+(staff.lastName||'')"
            :href="'#/contactDetail?contactType=0&contactId='+staff.personId"
            class="name desc ellipsis">{{staff.firstName+(staff.lastName||'')}}</a>
          <span :title="staff.position" class="position desc ellipsis">{{staff.position}}</span>
          <span :title="staff.mail" class="email desc ellipsis">{{staff.mail}}</span>
        </span>
            <i class="el-icon-close" @click="deleteStaff(staff, index)"></i>
          </div>

          <p v-if="!staffList.length">{{desc.name}}还没有员工</p>
        </div>
        <div class="staff-btn" :class="!staffList.length?'staff-no-btn':''">
          <el-button v-if="staffList.length" @click="showStaff" class="gray-btn">查看全部</el-button>
          <el-button @click="addStaff=true" class="gray-btn">添加员工</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="添加员工" v-model="addStaff" :class="showSearch?'showStaff':'addStaff'">
      <div class="left">
        <span @keyup.enter="searchCompany">
           <el-input
             icon="search"
             v-model="search"
             :on-icon-click="searchCompany">
        </el-input>
        </span>
        <div class="search-result" v-show="showSearch">
          <p>结果：</p>
          <p v-if="searchList.length===0">无匹配员工</p>
          <el-checkbox-group v-model="checkList">
            <el-checkbox :label="person" v-for="person in searchList" :key="person">
              <img class="person-img" :src="person.avatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
              <span class="ellipsis staff-show" :title="person.mail?person.mail:''">
              {{person.firstName ? person.firstName : ''}}
              {{person.lastName ? person.lastName : ''}}
              {{person.mail?'('+person.mail+')':''}}
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="right hasSelect" v-show="showSearch">
        <p>已选择</p>
        <ul>
          <li v-for="(list,i) in checkList" :key="list">
            <img :src="list.avatar" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
            <span class="ellipsis staff-show" :title="list.mail?list.mail:''">
              {{list.firstName ? list.firstName : ''}}
              {{list.lastName ? list.lastName : ''}}
              {{list.mail?'('+list.mail+')':''}}
            </span>
            <i class="el-icon-close" @click="removeChecked(i)"></i>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStaff = false">取 消</el-button>
        <el-button type="primary" @click="addPerson" :disabled="!checkList.length">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  export default{
    data () {
      return {
        addStaff: false,
        search: '',
        searchList: [],
        showSearch: false,
        checkList: [],
        staffList: [],
        selectName: 'staff'
      }
    },
    mounted () {
      contactInfoApi.getContactPersonList({size: 20, companyId: this.$route.query.contactId}).then(res => {
        if (!res.data.code) {
          this.staffList = res.data.data.records
        }
      })
    },
    methods: {
      searchCompany () {
        contactInfoApi.getContactPersonList({keyword: this.search, excludeCompanyId: this.$route.query.contactId}).then(res => {
          console.log(res)
          if (!res.data.code) {
            this.searchList = res.data.data.records
            this.showSearch = true
          }
        })
      },
      removeChecked (i) {
        this.checkList.splice(i, 1)
      },
      addPerson () {
        let ids = []
        this.checkList.forEach((person) => {
          ids.push(person.personId)
        })
        contactInfoApi.addCompanyPerson({companyId: this.$route.query.contactId, contactsId: ids.join(';')}).then(res => {
          if (!res.data.code) {
            this.addStaff = false
            this.$message.success('添加联系人成功！')
            contactInfoApi.getContactPersonList({companyId: this.$route.query.contactId}).then(res => {
              if (!res.data.code) {
                this.staffList = res.data.data.records
              }
            })
          }
        })
      },
      showStaff () {
        this.$router.push({path: '/contact', query: {type: 0, companyId: this.$route.query.contactId}})
      },
      deleteStaff (staff, index) {
        contactInfoApi.addPersonCompany({contactIds: staff.personId}).then(res => {
          if (!res.data.code) {
            this.staffList.splice(index, 1)
            this.$message.success('删除员工成功！')
          } else {
            this.$message.error('删除员工失败！')
          }
        })
      }
    },
    computed: {
      desc () {
        return this.$store.getters.desc
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/variable";
  .staff{
    .el-collapse{
      border: none;
      .el-collapse-item__header{
        border: none;
        font-size: 18px;
        font-weight: bold;
        padding: 0;
        i{
          font-size: 16px;
          color: #02AAAA;
        }
      }
      .el-collapse-item__wrap{
        border: none;
        background: #fff;
        .el-collapse-item__content{
          background: #fff;
          padding: 0;
        }
      }
    }
  }
  .addStaff, .showStaff {
    .el-dialog {
      width: 700px;
    }
    .el-dialog__body {
      height: 210px;
      padding: 30px 40px;
      .left{
        display: inline-block;
        width: 350px;
      }
      .right{
        float: right;
        width: 210px;
        height: 210px;
        display: inline-block;
        border-left: 1px solid @textBorderColor;
        padding: 0 20px;
      }
    }
    .el-dialog__footer {
      text-align: left;
      padding: 0 27px 30px 27px;
      button {
        padding: 9px 28px;
      }
    }
  }
  .addStaff {
    .el-dialog {
      width: 440px;
      .el-dialog__body {
        height: 80px;
      }
      .el-dialog__footer{
        text-align: center;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .staff-show{
    display: inline-block;
    max-width: 150px;
  }
  .search-result{
    height: 175px;
    overflow-y: auto;
    p{
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    label{
      display: block;
      margin-left: 0;
      margin-bottom: 15px;
      span{
        margin-right: 5px;
      }
    }
    .person-img{
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: bottom;
    }
  }
  .hasSelect{
    z-index: 9;
    p{
      margin-bottom: 20px;
    }
    ul{
      height: 200px;
      overflow-y: auto;
    }
    li{
      img{
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-right: 10px;
      }
      span {
        color: @textareaBorder;
        vertical-align: top;
      }
      i{
        float: right;
        color: #ddd;
        cursor: pointer;
      }
    }
  }
  .staff {
    width: 350px;
    padding: 9px 20px 30px;
    background: @white;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .title {
      i {
        color: @textareaBorder;
        margin-right: 5px;
      }
      span {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .staff-item:hover {
      i {
        display: inline-block;
      }
    }
    .staff-container {
      .staff-item {
        position: relative;
        margin-top: 20px;
      }
      p{
        text-align: center;
        margin-bottom: -20px;
        color: #7C98B6;
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .info {
        width: 280px;
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        span {
          color: @detailTextColor;
          display: inline-block;
          width: 100%;
          margin-bottom: 2px;
        }
        .name {
          color: @textColor;
          font-size: 16px;
          line-height: 20px;
        }
        .position,.email{
          line-height: 14px;
        }
        .desc {
          width: 250px;
          display: inline-block;
        }
      }
      i {
        cursor: pointer;
        display: none;
        color: @detailTextColor;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
    .staff-btn {
      margin-left: 65px;
      padding-top: 40px;
    }
    .staff-no-btn{
      margin: 0 auto;
      width: 85px;
    }
  }
</style>
