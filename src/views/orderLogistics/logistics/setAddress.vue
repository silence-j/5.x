<template>
  <div>
    <div class="logistic-set-address-container">
      <div class="tb-item">
        <div class="left-block">
          运费模板:
        </div>
        <div class="right-block">
          <input type="text" class="temp-input" v-model="templateName" placeholder="请输入运费模版名称">
        </div>
      </div>
      <div class="tb-item">
        <div class="left-block">
          发货地:
        </div>
        <div class="right-block">
          <div class="from-country">
            china
          </div>
        </div>
      </div>

      <div class="tb-item">
        <div class="left-block">
          请选择国家地区:
        </div>
        <div class="right-block">
            <div class="country-location">
              <el-checkbox   v-model="checkAll" :disabled="checkAllDisable" @change="handleCheckAllChange">全部</el-checkbox>
              <div style="margin: 28px 0;"></div>
              <el-checkbox-group v-model="checkedZhous"  @change="handleCheckedZhousChange">
                <span v-for="(zhou,zindex) in zhous" class="chekbox-item">
                  <el-checkbox  :key="zindex" :label="zhou" :disabled="zhou.disable" @change="zhouCheckboxItemChange(zindex)">
                    {{zhou.name}}
                  </el-checkbox>
                    <span class="hide-show" v-if="zhou.showDetail" @click="showCountryDetail(zindex, false)">[隐藏]</span>
                    <span class="hide-show show-all" v-if="!zhou.showDetail" @click="showCountryDetail(zindex, true)">[显示全部]</span>
                </span>
              </el-checkbox-group>
              <div class="split-line" v-if="showDetailZhou.name">
                <div class="arr" :class="{'asia': showDetailZhou.name==='亚洲','europe': showDetailZhou.name==='欧洲','europe': showDetailZhou.name==='欧洲','africa': showDetailZhou.name==='非洲','na': showDetailZhou.name==='北美洲','sa': showDetailZhou.name==='南美洲','ocean': showDetailZhou.name==='大洋洲'}"></div>
              </div>
              <div class="countries" v-if="showDetailZhou.name">
                  <el-checkbox-group v-model="showDetailZhou.checkedCountries"  @change="handleCheckedCountriesChange">
                    <span class="country-item"  v-for="(country,cindex) in showDetailZhou.countrys">
                      <el-checkbox  :key="cindex" :disabled="country.disable" :label="country">
                        {{country.name}}
                      </el-checkbox>
                    </span>
                  </el-checkbox-group>
              </div>
            </div>
        </div>
      </div>

      <div class="tb-item">
        <div class="left-block">
          设置发货类型:
        </div>
        <div class="right-block">
             <el-select v-model="freightBear" placeholder="请选择">
              <el-option
                label="自定义运费"
                value="0">
              </el-option>
               <el-option
                label="卖家承担运费"
                value="1">
              </el-option>
            </el-select>
             <el-select class="sendType2" v-model="settingMode" placeholder="请选择" v-if="freightBear === '0'">
              <el-option
                label="按数量设置运费"
                value="0">
              </el-option>
            </el-select>
            <span class="tip">币种单位跟随添加商品时的货币单位</span>
            <div class="self-definition"  v-if="freightBear === '0'">
              <div class="de-item">
                 <div class="de-item-title">
                   首件：
                 </div>
                 <el-input-number v-model="firstNum" size="small" :min="0"></el-input-number>
                  <div class="de-item-title">
                   件
                 </div>
              </div>
               <div class="de-item">
                 <div class="de-item-title">
                   首件运费：
                 </div>
                 <el-input-number v-model="firstAmount" size="small" :min="0"></el-input-number>
                  <div class="de-item-title">
                   美元
                 </div>
              </div>
                <div class="de-item">
                 <div class="de-item-title">
                   续件：
                 </div>
                 <el-input-number v-model="nextNum" size="small" :min="0"></el-input-number>
                  <div class="de-item-title">
                   件
                 </div>
              </div>
               <div class="de-item">
                 <div class="de-item-title">
                   续件运费：
                 </div>
                 <el-input-number v-model="nextAmount" size="small" :min="0"></el-input-number>
                  <div class="de-item-title">
                   美元
                 </div>
              </div>
            </div>
        </div>
      </div>
      <div class="tb-item">
        <div class="left-block">
        </div>
        <div class="right-block">

        </div>
      </div>
    </div>
     <div class="opt-btns">
        <div class="cancel-btn" @click="cancel">取消</div>
        <div class="save-btn" @click="save">保存</div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import orderLogisticsAPI from '@/api/orderLogisticsAPI'
export default {
  name: 'logisticsManagement',
  data () {
    return {
      templateName: '',
      /**
       * 全选按钮
       * @type {Boolean}
       */
      checkAll: false,
      /**
       * 全选按钮禁用
       * @type {Boolean}
       */
      checkAllDisable: false,
      /**
       * 被选中的洲
       * @type {Array}
       */
      checkedZhous: [],
      /**
       * 所有的洲
       * @type {Array}
       */
      zhous: [],
      /**
       *  运费承担
       * @type {String}
       */
      freightBear: '0',
      /**
       * 设置方式(0表示按件,1表示按重)
       * @type {String}
       */
      settingMode: '0',
      firstNum: 0,
      firstAmount: 0,
      nextNum: 0,
      nextAmount: 0
    }
  },
  components: {
  },
  computed: {
    /**
     * vuex里取值
     * @type {String}
     */
    ...mapGetters({
      logisticsInfoWrap: 'logisticsInfo',
      fromPage: 'fromPage',
      vuexZhous: 'vuexZhous',
      editIndex: 'editIndex'
    }),
    /**
     * 显示隐藏所有国家 (选中的洲)
     * @return {[type]} [description]
     */
    showDetailZhou: function () {
      for (let zhou of this.zhous) {
        if (zhou.showDetail) {
          return zhou
        }
      }
      return {}
    }
  },
  mounted () {
    /**
     * 如果刷新导致vuex里没有数据，则后退一个页面
     * @param  {[type]} this.fromPage [description]
     * @return {[type]}               [description]
     */
    if (this.fromPage === '') {
      this.$router.go(-1)
    }
    /**
     * 不是新建，则需要渲染页面
     * @param  {[type]} this.fromPage !             [description]
     * @return {[type]}               [description]
     */
    if (this.fromPage !== 'new' && this.fromPage !== '') {
      this.templateName = this.logisticsInfoWrap.logistFreight.name
      /**
       * 若是点击编辑过来的
       * @param  {[type]} this.fromPage [description]
       * @return {[type]}               [description]
       */
      if (this.fromPage === 'edit') {
        this.freightBear = '' + this.logisticsInfoWrap.logistFreightDetails[this.editIndex].freightBear
        this.settingMode = '' + this.logisticsInfoWrap.logistFreightDetails[this.editIndex].settingMode
        this.firstNum = this.logisticsInfoWrap.logistFreightDetails[this.editIndex].firstNum
        this.firstAmount = this.logisticsInfoWrap.logistFreightDetails[this.editIndex].firstAmount / 100
        this.nextNum = this.logisticsInfoWrap.logistFreightDetails[this.editIndex].nextNum
        this.nextAmount = this.logisticsInfoWrap.logistFreightDetails[this.editIndex].nextAmount / 100
      }
    }
    // 非物流页面过来 的判断 by shaohuan
    if (this.$store.getters.vuexZhous && this.$store.getters.vuexZhous.length) {
      this.initdata()
    } else {
      this.$store.commit('SET_FROM_PAGE', 'new', 0)
      this.$store.commit('SET_LOGISTICS_INFO', {})
      orderLogisticsAPI.getZhouAndCountry().then((res) => {
        this.$store.commit('CACHE_ZHOUS', res.data.data)
        this.initdata()
      })
    }
    /**
     * 在页面初始化完成后 ，选中已选择的国家
     * 让其他模板已选择的按钮失效
     * @param  {[type]} ( [description]
     * @return {[type]}   [description]
     */
    Vue.nextTick(() => {
      this.selectCountries()
      this.disableCountries()
    })
  },
  methods: {
    /**
     * 获取 zhou 数据  通过JSON.stringify 和 JSON.parse 把 响应式数据变换成为正常数组
     * @param  {[type]} ).then((res [description]
     * @return {[type]}             [description]
     */
    initdata () {
      let noneReactiveZhous = JSON.stringify(this.$store.getters.vuexZhous)
      this.zhous = JSON.parse(noneReactiveZhous)
      for (let zhou of this.zhous) {
        this.$set(zhou, 'showDetail', false)
        this.$set(zhou, 'checkedCountries', [])
      }
    },
    /**
     * 保存按钮
     * @return {[type]} [description]
     */
    save () {
      /**
       * 输入验证
       * @param  {[type]} this.templateName [description]
       * @return {[type]}                   [description]
       */
      if (this.templateName === '') {
        this.$message.error('请填写运费模板名称！')
        return
      }
      if (this.getStringCountriesFromView() === '') {
        this.$message.error('至少选择一个国家')
        return
      }
      if (this.freightBear === '0') {
        if (this.firstAmount === 0) {
          this.$message.error('首件运费不能为0')
          return
        } else if (this.nextAmount === 0) {
          this.$message.error('续件运费不能为0')
          return
        } else if (this.firstNum === 0) {
          this.$message.error('首件数量不能为0')
          return
        } else if (this.nextNum === 0) {
          this.$message.error('续件数量不能为0')
          return
        }
      }
      let lftable = this.logisticsInfoWrap.logistFreightDetails
      /**
       * 新建物流模板操作
       * @param  {[type]} this.fromPage [description]
       * @return {[type]}               [description]
       */
      if (this.fromPage === 'new') {
        console.log('新建')
        let postObj = {
          name: this.templateName,
          sendArea: 'China',
          priceUnit: 'USD'
        }
        /**
         * 取最新修改的值
         */
        postObj['logistFreightDetail[0].freightBear'] = parseInt(this.freightBear)
        postObj['logistFreightDetail[0].settingMode'] = parseInt(this.settingMode)
        postObj['logistFreightDetail[0].firstNum'] = this.firstNum
        postObj['logistFreightDetail[0].firstAmount'] = this.firstAmount
        postObj['logistFreightDetail[0].nextNum'] = this.nextNum
        postObj['logistFreightDetail[0].nextAmount'] = this.nextAmount
        postObj['logistFreightDetail[0].receiveCountrys'] = this.getStringCountriesFromView()
        orderLogisticsAPI.addFreight(postObj).then((res) => {
          this.$message({
            message: '增加成功!',
            type: 'success'
          })
          this.$router.go(-1)
        })
        return
      }
      /**
       * 保存页面的修改
       */
      console.log('logisticsInfoWrap', this.logisticsInfoWrap)
      let postObj = {
        id: this.logisticsInfoWrap.logistFreight.id,
        name: this.templateName,
        sendArea: 'China',
        priceUnit: 'USD'
      }
      if (this.fromPage === 'add') {
        for (let itemIndex in lftable) {
          /**
           * 复制其他运费组合
           * @param  {[type]} itemIndex [description]
           * @return {[type]}           [description]
           */
          postObj['logistFreightDetail[' + itemIndex + '].id'] = lftable[itemIndex].id
          postObj['logistFreightDetail[' + itemIndex + '].freightBear'] = lftable[itemIndex].freightBear
          postObj['logistFreightDetail[' + itemIndex + '].receiveCountrys'] = lftable[itemIndex].receiveCountrys
          postObj['logistFreightDetail[' + itemIndex + '].settingMode'] = lftable[itemIndex].settingMode
          postObj['logistFreightDetail[' + itemIndex + '].firstNum'] = lftable[itemIndex].firstNum
          postObj['logistFreightDetail[' + itemIndex + '].firstAmount'] = lftable[itemIndex].firstAmount / 100
          postObj['logistFreightDetail[' + itemIndex + '].nextNum'] = lftable[itemIndex].nextNum
          postObj['logistFreightDetail[' + itemIndex + '].nextAmount'] = lftable[itemIndex].nextAmount / 100
          postObj['logistFreightDetail[' + itemIndex + '].deleteTag'] = lftable[itemIndex].deleteTag
        }
        let addIndex = lftable.length
        postObj['logistFreightDetail[' + addIndex + '].id'] = ''
        postObj['logistFreightDetail[' + addIndex + '].deleteTag'] = 0
        /**
         * 取最新修改的值
         */
        postObj['logistFreightDetail[' + addIndex + '].freightBear'] = parseInt(this.freightBear)
        postObj['logistFreightDetail[' + addIndex + '].settingMode'] = parseInt(this.settingMode)
        postObj['logistFreightDetail[' + addIndex + '].firstNum'] = this.firstNum
        postObj['logistFreightDetail[' + addIndex + '].firstAmount'] = this.firstAmount
        postObj['logistFreightDetail[' + addIndex + '].nextNum'] = this.nextNum
        postObj['logistFreightDetail[' + addIndex + '].nextAmount'] = this.nextAmount
        postObj['logistFreightDetail[' + addIndex + '].receiveCountrys'] = this.getStringCountriesFromView()
      } else if (this.fromPage === 'edit') {
        for (let itemIndex in lftable) {
          /**
           * 修改该运费组合的值，复制其他运费组合
           * @param  {[type]} itemIndex [description]
           * @return {[type]}           [description]
           */
          if (parseInt(itemIndex) === this.editIndex) {
            postObj['logistFreightDetail[' + itemIndex + '].id'] = lftable[itemIndex].id
            postObj['logistFreightDetail[' + itemIndex + '].deleteTag'] = lftable[itemIndex].deleteTag
            /**
             * 取最新修改的值
             */
            postObj['logistFreightDetail[' + itemIndex + '].freightBear'] = parseInt(this.freightBear)
            postObj['logistFreightDetail[' + itemIndex + '].settingMode'] = parseInt(this.settingMode)
            postObj['logistFreightDetail[' + itemIndex + '].firstNum'] = this.firstNum
            postObj['logistFreightDetail[' + itemIndex + '].firstAmount'] = this.firstAmount
            postObj['logistFreightDetail[' + itemIndex + '].nextNum'] = this.nextNum
            postObj['logistFreightDetail[' + itemIndex + '].nextAmount'] = this.nextAmount
            postObj['logistFreightDetail[' + itemIndex + '].receiveCountrys'] = this.getStringCountriesFromView()
          } else {
            postObj['logistFreightDetail[' + itemIndex + '].id'] = lftable[itemIndex].id
            postObj['logistFreightDetail[' + itemIndex + '].freightBear'] = lftable[itemIndex].freightBear
            postObj['logistFreightDetail[' + itemIndex + '].receiveCountrys'] = lftable[itemIndex].receiveCountrys
            postObj['logistFreightDetail[' + itemIndex + '].settingMode'] = lftable[itemIndex].settingMode
            postObj['logistFreightDetail[' + itemIndex + '].firstNum'] = lftable[itemIndex].firstNum
            postObj['logistFreightDetail[' + itemIndex + '].firstAmount'] = lftable[itemIndex].firstAmount / 100
            postObj['logistFreightDetail[' + itemIndex + '].nextNum'] = lftable[itemIndex].nextNum
            postObj['logistFreightDetail[' + itemIndex + '].nextAmount'] = lftable[itemIndex].nextAmount / 100
            postObj['logistFreightDetail[' + itemIndex + '].deleteTag'] = lftable[itemIndex].deleteTag
          }
        }
      }
      /**
       * 保存运费模板信息
       * @param  {[type]} ).then((res [description]
       * @return {[type]}             [description]
       */
      orderLogisticsAPI.updateFreight(postObj).then((res) => {
        this.$message({
          message: '修改成功!',
          type: 'success'
        })
        this.$router.go(-1)
      })
    },
    /**
     * 取消按钮
     * @return {[type]} [description]
     */
    cancel () {
      /**
       * 如果是物流模板页 新建过来的，就回到 物流模板页，不然路由后退，回到详情页
       * @param  {[type]} this.fromPage [description]
       * @return {[type]}               [description]
       */
      if (this.fromPage === 'new') {
        this.$router.push({ path: '/logisticsManagement' })
      } else {
        this.$router.go(-1)
      }
    },
    /**
     * 国家详情的展现
     * @param  {[type]} zindex [description]
     * @param  {[type]} ifShow [description]
     * @return {[type]}        [description]
     */
    showCountryDetail (zindex, ifShow) {
      for (let zhou of this.zhous) {
        zhou.showDetail = false
      }
      this.zhous[zindex].showDetail = ifShow
    },
    /**
     * 全选
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    handleCheckAllChange (event) {
      /**
       * 为了 让 zhous和checkedZhous 不联动,用新的对象去操作
       * @type {Array}
       */
      let zhous = [].concat(this.zhous)
      /**
       * 洲 全选
       * @type {[type]}
       */
      this.checkedZhous = event.target.checked ? zhous : []
      /**
       * 对应的所有 国家都要全选或者不选
       * @param  {[type]} let zhou          of this.zhous [description]
       * @return {[type]}     [description]
       */
      for (let zhou of this.zhous) {
        zhou.checkedCountries = event.target.checked ? zhou.countrys : []
      }
    },
    /**
     * 洲复选框 改变 group事件
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    handleCheckedZhousChange (value) {
      let checkedCount = value.length
      /**
       * 如果所有洲都被选中，那么全选勾上
       * @type {[type]}
       */
      this.checkAll = checkedCount === this.zhous.length
      // for (let item of value) {
      //   console.log(item)
      // }
    },
    /**
     * 当 国家选择框被选中的时候
     * @return {[type]} [description]
     */
    handleCheckedCountriesChange (value) {
      let checkedCount = value.length
      if (checkedCount === this.showDetailZhou.countrys.length) {
        console.log('push')
        this.checkedZhous.push(this.showDetailZhou)
      } else {
        let checkedIndex = this.checkedZhous.findIndex((item) => item.name === this.showDetailZhou.name)
        if (checkedIndex !== -1) {
          console.log('pop')
          this.checkedZhous.splice(checkedIndex, 1)
        }
      }
      /**
       * 每当国家变化的时候，去判断  最顶上的 全选选择框
       * @type {[type]}
       */
      this.checkAll = this.checkedZhous.length === this.zhous.length
    },
    /**
     * 当 洲 选择框被点击的时候
     * @param  {[type]} zindex [description]
     * @return {[type]}        [description]
     */
    zhouCheckboxItemChange (zindex) {
      let ifChecked = this.checkedZhous.find((item) => item.name === this.zhous[zindex].name)
      this.zhous[zindex].checkedCountries = ifChecked ? this.zhous[zindex].countrys : []
      // for (let country of this.zhous[zindex].countrys) {
      //   country
      // }
    },
    /**
     * 选中该选中的国家 初始化
     * @return {[type]} [description]
     */
    selectCountries () {
      /**
       * 增加运费模板 不需要默认选择任何国家
       * @param  {[type]} this.fromPage [description]
       * @return {[type]}               [description]
       */
      if (this.fromPage === 'add') { return }
      if (this.fromPage === 'new') { return }
      /**
       * 该运费组合对象
       * @type {[type]}
       */
      let lInfoTable = this.logisticsInfoWrap.logistFreightDetails
      if (lInfoTable.length === 0) {
        console.log('没有任何国家被选中')
        return
      }
      /**
       * 要选中的国家  ,遍历zhous数组，把receiveCountrys内的国家选中
       * @type {[type]}
       */
      let receiveCountrys = lInfoTable[this.editIndex].receiveCountrys
      for (let zhou of this.zhous) {
        for (let country of zhou.countrys) {
          /**
           * 字符串里有这个国家 那么选中它，并且判断是否该洲的国家全选了，全选的话就选中该洲
           * @param  {[type]}[description]
           * @return {[type]}                                       [description]
           */
          let fullCountryString = country.nameEn + ':' + country.name
          if (receiveCountrys.indexOf(fullCountryString) !== -1) {
            zhou.checkedCountries.push(country)
            if (zhou.checkedCountries.length === zhou.countrys.length) {
              this.checkedZhous.push(zhou)
              this.checkAll = this.checkedZhous.length === this.zhous.length
            }
          }
        }
      }
    },
    /**
     * disable国家按钮
     * @return {[type]} [description]
     */
    disableCountries () {
      let totalDisableCountriesString = ''
      let lftable = this.logisticsInfoWrap.logistFreightDetails
      if (this.fromPage === 'add') {
        /**
         * 循环得到 所有要禁止的按钮
         * @param  {[type]} let itemIndex     in lftable [description]
         * @return {[type]}     [description]
         */
        for (let itemIndex in lftable) {
          totalDisableCountriesString += lftable[itemIndex].receiveCountrys
        }
        /**
         * 遍历每个选择框 ，判断是否应该禁止
         * 一旦有一个国家复选框禁止，它的父亲们都禁用
         * @param  {[type]} let zhou          of this.zhous [description]
         * @return {[type]}     [description]
         */
        for (let zhou of this.zhous) {
          for (let country of zhou.countrys) {
            let fullCountryString = country.nameEn + ':' + country.name
            if (totalDisableCountriesString.indexOf(fullCountryString) !== -1) {
              this.$set(country, 'disable', true)
              this.$set(zhou, 'disable', true)
              this.checkAllDisable = true
            }
          }
        }
      } else if (this.fromPage === 'edit') {
        /**
         * 循环得到 所有要禁止的按钮 ,当前选择的不禁止
         * @param  {[type]} let itemIndex     in lftable [description]
         * @return {[type]}     [description]
         */
        for (let itemIndex in lftable) {
          if (this.editIndex !== parseInt(itemIndex)) {
            totalDisableCountriesString += lftable[itemIndex].receiveCountrys
          }
        }
        /**
         * 遍历每个选择框 ，判断是否应该禁止
         * 一旦有一个国家复选框禁止，它的父亲们都禁用
         * @param  {[type]} let zhou          of this.zhous [description]
         * @return {[type]}     [description]
         */
        for (let zhou of this.zhous) {
          for (let country of zhou.countrys) {
            let fullCountryString = country.nameEn + ':' + country.name
            if (totalDisableCountriesString.indexOf(fullCountryString) !== -1) {
              this.$set(country, 'disable', true)
              this.$set(zhou, 'disable', true)
              this.checkAllDisable = true
            }
          }
        }
      }
    },
    /**
     * 从页面中获取选中的所有国家字符串
     * @return {[type]} [description]
     */
    getStringCountriesFromView () {
      let countriesString = ''
      for (let zhou of this.zhous) {
        for (let country of zhou.checkedCountries) {
          countriesString += country.nameEn + ':' + country.name + ';'
        }
      }
      return countriesString
    }
  }
}
</script>
<style lang='less' scoped>
@import '../../../assets/style/variable.less';
  .opt-btns{
    text-align: center;
  }
  .logistic-set-address-container{
    width:100%;
    min-height: 600px;
    background: white;
    box-shadow: 0px 0px 6px rgba(0,0,0,.06);
    border-radius: 6px;
    overflow: hidden;
    .tb-item{
      margin-top:24px;
      .left-block,.right-block{
        display: inline-block;
        text-align: right;
        vertical-align: top;
        font-size: 14px;
      }
      .left-block{
        width:112px;
        color:@font-title-color;
        line-height: 38px;
        margin-right: 5px;
      }
      .right-block{
        text-align: left;
        width:88%;
        .from-country{
          line-height: 38px;
        }
        .sendType2{
          margin-left:16px;
        }
        .tip{
          font-size: 13px;
          color:#7C98B6;
          line-height: 38px;
        }
        .self-definition{
          background: #F5F8FA;
          padding:16px;
          margin-top:20px;
          .de-item{
            display: inline-block;
            margin:8px;
            .de-item-title{
              display: inline-block;
              line-height: 30px;
              vertical-align: top;
            }
          }
        }
        .country-location{
          background: #F5F8FA;
          padding:16px 20px;
          .hide-show{
            color:#5488F9;
            margin-right: 10px;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
         .chekbox-item{
          width:166px;
          height: 40px;
          display: inline-block;
         }
          .split-line{
            border-top:1px solid #DFE3EB;
            margin: -1px auto 13px auto;
            .arr{
              position: relative;
              left:40px;
              &:after{
                position:absolute;
                top:-1px;
                left:0;
                content:'';
                width:10px;
                height:10px;
                border:1px solid #DFE3EB;
                transform-origin: 0 0;
                transform: rotate(-45deg);
                border-bottom:none;
                border-left:none;
                background: #F5F8FA;
              }
            }
            .asia{
              left:40px;
            }
            .europe{
              left:200px;
            }
            .africa{
              left:370px;
            }
            .na{
              left:550px;
            }
            .sa{
              left:700px;
            }
            .ocean{
              left:880px;
            }

          }
          .el-checkbox + .el-checkbox {
              margin-left: 0;
          }
          .el-checkbox{
            margin: 5px 10px 0 0;
            color:#33475B;
          }
          .country-item{
            display: inline-block;
            width:200px;
            height: 40px;
            padding-left:14px;
            box-sizing: border-box;

          }
        }
      }
    }

    .temp-input{
      height: 34px;
      width:240px;
      border-radius: 4px;
      border:1px solid #CBD6E3;
      padding-left:10px;
    }

  }
</style>
