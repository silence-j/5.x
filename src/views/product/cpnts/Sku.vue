<template>
  <div>
    <el-form-item label="" class="sku-input">
      <div class="sku-tit"><p>SKU 规格</p></div>
      <div class="skuspec-box" :class="{'skuspec-no':(!specs.skuInputs.length&&!specs.skuList.length)}">
        <div class="spec-input"><!--v-if="specs.skuInputs.length"-->
          <div class="spec-input-inner" v-show="isSkuEdit">
            <el-input placeholder="规格名，如“Size”" v-model="specs.specname" class="ui-name input-s" @blur="removeSign('specname')">
            </el-input>
            <em> : </em>
            <el-input v-for="(v,index) in specs.skuInputs" :placeholder="v.placed" v-model="specs.skuInputs[index].specval" :index="index" :key="index" class="input-s" @blur="removeSign(index)">
            </el-input>
            <el-button @click="moreSkuVal" type="text"><i class="icon-addcir"></i></el-button>
          </div>
          <el-button  v-show="isSkuEdit" @click="saveSku" type="primary" class="btn-blue">保存</el-button>
          <div v-for="(v,vindex) in specs.skuList" class="spec-show" :index="vindex">
            <label>{{v.name}} : </label>
            <span v-for="(data,index) in v.vals" :index="index" :key="index" class="show-close">{{data.specval}}
              <i class="icon-remove2" @click="skuShowDel(vindex,index)"></i>
            </span>
            <el-button type="text"  @click="skuEdit(vindex)">编辑</el-button>
          </div>
        </div>
        <div class="spec-btns" v-if="specs.skuList.length < 3">
            <el-button @click="moreSku" type="primary" class="btn-blue"><i class="icon-addthin"></i>添加规格</el-button>
            <span class="tip">最多可添加三组规格</span>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="货币单位" label-width="94px" required>
      <el-select v-model="priceUnitSku" placeholder="请选择">
        <el-option label="USD" value="USD">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="" class="sku-spec-tab" id="specTab" v-if="specs.skuTab.length">
      <ul v-for="(v,vindex) in specs.skuTab" class="sku-spec-tr clearfix" v-bind:style="{'width': specs.specTrWid}">
        <li class="tab-header">{{v.name}}</li>
        <li v-for="(data,index) in v.vals" v-bind:style="{'height': v.span+'px','line-height':v.span+'px'}" :title="data.specval">{{data.specval}}</li>
      </ul>
      <ul class="sku-spec-tr clearfix"  v-bind:style="{'width': specs.specTrWid}">
        <li class="tab-header">
          <span>
            库存 (<i v-if="unitMap">{{unitMap[form.productUnitEn]}}</i>)<el-checkbox class="pos" v-model="sameWholeNum" :disabled="chkAllDisabld"></el-checkbox>  全部相同
          </span>
        </li>
        <li v-for="(data,index) in specs.skuOpt1.vals" :index="index" :key="index" v-bind:style="{'height': specs.skuOpt1.span+'px','line-height':specs.skuOpt1.span+'px'}">

          <el-input  :maxlength=6 v-model="specs.skuOpt1.vals[index].opt" @blur="validInvent(index)"></el-input>
        </li>
      </ul>
      <ul class="sku-spec-tr clearfix"  v-bind:style="{'width': specs.specTrWid}">
        <li class="tab-header">
          <span>
            单价 ({{priceMap[form.priceUnitSku]}})
          </span>
        </li>
        <li v-for="(data,index) in specs.skuOpt2.vals" :index="index" :key="index" v-bind:style="{'height': specs.skuOpt2.span+'px','line-height':specs.skuOpt2.span+'px'}">

          <el-input v-model="specs.skuOpt2.vals[index].opt" class="red-text" @blur="validPrice(index)" :readonly="data.specNumSpan!=''&&data.specNumSpan!=null"></el-input>
          <el-popover
              placement="bottom-end"
              width="403"
              height="81"
              popper-class="sku-pop"
              trigger="click">
                <h6>批发价区间 <i class="red-tip">{{specs.skuOpt2.vals[index].specNumSpan}}</i></h6>
                <ul>
                  <li class="tab-header"><span>起订量(<i v-if="unitMap">{{unitMap[form.productUnitEn]}}</i>)</span> <span>价格</span></li>
                  <li class="">
                    <ul class="num-price-list">
                      <li v-for="(muld,idx) of specs.skuOpt2.vals[index].productSpecNums" :index="idx">
                        <label>≥ </label><el-input :maxlength=6 v-model="data.productSpecNums[idx].startNum" @blur="validStart(index, idx)"></el-input>
                        <hr class="hr">
                        <label>USD: </label><el-input :maxlength=7 v-model="data.productSpecNums[idx].price" @blur="showPriceSpan(index, idx)"></el-input>
                        <el-button v-if="idx" @click="deleteNumSku(index, idx)" type="text"> 删除</el-button>
                      </li>
                      <li v-if="specs.skuOpt2.vals[index].productSpecNums.length < 4">
                        <el-button @click="addMPriceNum(index)" type="text" class="add-span">
                          <i class="icon-addcir"></i>新增价格区间
                        </el-button>
                        <span class="tip">（最多设置4个价格区间）</span>
                      </li>
                    </ul>
                  </li>
                </ul>
                <!-- <div x-arrow="" class="popper__arrow" style="left: 0px;"></div> -->
                <div slot="reference" class="name-wrapper">
                  <a href="javascript:;" class="buymulti-flag">批</a>
                </div>
          </el-popover>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="运费计算方式" label-width="122px" class="freight-box" prop="freightBear">
      <el-radio label="0" v-model="form.freightBear">买家承担运费</el-radio>
      <el-radio label="1" v-model="form.freightBear">卖家承担运费</el-radio>
      <div class="freight-buyer" v-if="form.freightBear=='0'">
        <el-radio label="0" v-model="freightWay">统一运费</el-radio>
        <div class="input-wrap">
          <el-input v-model="form.freightPrice"></el-input>
          <i class="unit-input"><i>|</i>{{priceMap[form.priceUnitSku]}}</i>
        </div>
      </div>
      <div class="freight-buyer" v-if="form.freightBear=='0'">
        <el-radio label="1" v-model="freightWay">运费模板</el-radio>
        <el-select v-model="form.freightTemplate" placeholder="请选择" @visible-change="getFreAgain">
          <el-option v-for="place in freightList" :key="place.id" :label="place.name" :value="place.id">
          </el-option>
        </el-select>
        <a @click="toAddr()" href="javascript:;"><el-button type="primary" class="btn-blue">新增运费模板</el-button></a>
      </div>
    </el-form-item>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import proApi from '@/api/productApi'
import orderLogisticsAPI from '@/api/orderLogisticsAPI'
// import { VueEditor } from 'vue2-editor'
import Vue from 'vue'
export default {
  name: 'ProductModify',
  props: ['form', 'editSpec', 'unitMap', 'toBack', 'specback'],
  data () {
    return {
      specs: {
        skuList: [],
        skuInputs: [],
        productSpecs: {},
        specname: '',
        skuTab: [],
        skuOpt: [],
        skuOpt1: {},
        skuOpt2: {},
        sortSkuList: [],
        specTrWid: '30%'
      },
      priceUnitSku: 'USD',
      positiveInt: /^[1-9]\d*$/, // 正整数
      spanNum: /^\d{1,}(~\d{1,})?$/, // 区间数字
      freightWay: '0',
      isSkuEdit: true, // 显示规格输入框
      sameWholeNum: false, // 库存全部相同
      popov: [],
      defaultInputs: [
        {'placed': '规格值，如“S”', 'specval': ''},
        {'placed': '规格值，如“M”', 'specval': ''},
        {'placed': '规格值，如“L”', 'specval': ''},
        {'placed': '规格值，如“XL”', 'specval': ''}],
      // unitMap: {},
      priceMap: {'USD': '美元'},
      freightList: [], // 运费模板列表
      chkAllDisabld: true
      // rules: {
      //   freightBear: [
      //     { required: true, message: '请', trigger: 'change' }
      //   ]
      // }
    }
  },
  components: {},
  methods: {
    // 新建运费
    toAddr () {
      this.$store.commit('SET_FROM_PAGE', 'new', 0)
      this.$store.commit('SET_LOGISTICS_INFO', {})
      window.open('#/logisticsSetAddress')
      // this.$router.push({ path: '/logisticsSetAddress' })
    },
    // 去除特殊符号
    removeSign (flag) {
      if (flag === 'specname') {
        let name = this.specs.specname
        Vue.set(this.specs, 'specname', this.dealSign(name))
      } else {
        let name = this.specs.skuInputs[flag].specval
        Vue.set(this.specs.skuInputs[flag], 'specval', this.dealSign(name))
      }
    },
    dealSign (name) {
      if (name.indexOf(':') !== -1 || name.indexOf(';') !== -1) {
        name = name.replace(/:/g, '').replace(/;/g, '')
      }
      return name
    },
    // 验证库存
    validInvent (index) {
      let p = this.specs.skuOpt1.vals[index].opt
      if (isNaN(p) || p < 0 || !this.positiveInt.test(p)) {
        this.$message.error('库存必须为大于0的正整数')
        this.specs.skuOpt1.vals[index].opt = ''
        Vue.set(this.specs.skuOpt1, 'vals', this.specs.skuOpt1.vals)
      }
      this.stockIsEmp()
    },
    // 验证价格
    validPrice (index) {
      let p = this.specs.skuOpt2.vals[index].opt
      // let span = p.split('~')
      if (p.indexOf('~') === -1 && (isNaN(p) || p < 0 || p > 10000000)) {
        this.$message.error('单价必须为0-10000000之间的数字')
        this.specs.skuOpt2.vals[index].opt = ''
        Vue.set(this.specs.skuOpt2, 'vals', this.specs.skuOpt2.vals)
      }
      // if (p.indexOf('~') !== -1 && !this.spanNum.test(p)) {
      //   this.$message.error('区间价格有误')
      //   this.specs.skuOpt[vindex].vals[index].opt = ''
      //   Vue.set(this.specs.skuOpt, vindex, this.specs.skuOpt[vindex])
      // }
    },
    // 按SKU报价
    moreSku () {
      this.isSkuEdit = true
      this.specs.specname = ''
      this.specs.skuInputs = this.deepCopyArr(this.defaultInputs)
    },
    // 添加规格值input
    moreSkuVal () {
      this.specs.skuInputs.push({'placed': '规格值', 'specval': ''})
    },
    // 删除保存后的规格值
    skuShowDel (vindex, index) {
      let sku1 = this.specs.skuList[vindex]
      sku1['vals'].splice(index, 1)
      if (!sku1.vals.length) { // 删到没用属性值
        this.specs.skuList.splice(vindex, 1)
      }
      this.caluSku(this.specs.skuList, 'del')
    },
    // 点击编辑按钮
    skuEdit (vindex) {
      this.isSkuEdit = true
      let list = this.specs.skuList[vindex].vals
      this.specs.skuInputs = []
      list.forEach((item, index) => {
        let p = this.defaultInputs[index] ? this.defaultInputs[index].placed || '规格值' : '规格值'
        this.specs.skuInputs.push({'placed': p, 'specval': item.specval, idx: vindex})
      })
      this.specs.skuList.forEach((item2, index2) => {
        item2.idx = index2
      })
      this.specs.specname = this.specs.skuList[vindex].name
      this.specs.skuList.splice(vindex, 1)
      // this.caluSku(this.specs.skuList, 'del') // flag 是否保留操作列数据
    },
    // 临时保存规格
    saveSku () {
      let _this = this.specs
      let isRepeat = false
      let specvalNum = 0
      for (let j = 0, lens = _this.skuInputs.length; j < lens; j++) {
        if (!_this.skuInputs[j].specval) {
          specvalNum++
        }
      }
      if (!_this.specname) {
        this.$message.error('请填写规格名')
        return
      }
      if (specvalNum === _this.skuInputs.length) {
        this.$message.error('请填写规格值')
        return
      }
      for (let i = 0, len = _this.skuList.length; i < len; i++) {
        let vals = _this.skuList[i].vals
        if (_this.specname === _this.skuList[i].name) { // 当前规格名与旧规格名 重复
          isRepeat = true
          break
        }
        for (let x = 0, lenx = vals.length; x < lenx; x++) {
          if (_this.specname === vals[x].specval) { // 当前规格名与旧规格值 重复
            isRepeat = true
            break
          }
          for (let j = 0, len2 = _this.skuInputs.length; j < len2; j++) {
            if (_this.skuInputs[j].specval === vals[x].specval || _this.skuInputs[j].specval === _this.skuList[i].name) { // 当前规格值与旧规格值/名 重复
              isRepeat = true
              break
            }
          }
        }
      }
      if (isRepeat) {
        this.$message.error('规格请勿重复')
        return
      }
      let inputs = []
      for (let j = 0, len2 = _this.skuInputs.length; j < len2; j++) {
        if (_this.skuInputs[j].specval) {
          inputs.push(_this.skuInputs[j].specval)
        }
      }
      inputs = inputs.sort()
      for (let j = 0, len2 = inputs.length; j < len2 - 1; j++) {
        if (inputs[j] === inputs[j + 1]) {
          isRepeat = true
          break
        }
      }
      if (isRepeat) {
        this.$message.error('同组规格值之间请勿重复')
        return
      }
      let obj = {name: _this.specname, vals: []} // vals: 规格值
      let skulist = []
      _this.skuInputs.forEach(function (item, i) {
        if (item.specval) {
          obj.vals.push({'placed': item.placed, 'specval': item.specval})
        }
        // item.specval = ''
        // i > 3 ? _this.skuInputs.splice(i, 1) : null
      })
      // 处理数据后置空 还原输入状态
      _this.specname = ''
      // 点击编辑的 保存值 按初始化顺序
      if (typeof _this.skuInputs[0].idx !== 'undefined' && !isNaN(_this.skuInputs[0].idx)) {
        skulist[_this.skuInputs[0].idx] = obj
        _this.skuList.forEach(item => {
          if (!isNaN(item.idx)) {
            skulist[item.idx] = item
          }
        })
        _this.skuList = this.deepCopyArr(skulist)
      } else { // 新增一组规格
        _this.skuList.push(obj)
      }
      _this.skuInputs = this.deepCopyArr(this.defaultInputs)
      // skuList 规格显示列表
      this.caluSku(_this.skuList, 'doedit')
    },
    // 批 新增价格区间
    addMPriceNum (index) {
      let list = this.specs.skuOpt2.vals[index].productSpecNums
      if (list.length < 4) {
        list.push({price: '', startNum: ''})
        // Vue.set(this.specs.skuOpt2, 'vals', this.specs.skuOpt2.vals)
      }
    },
    // 批 删除区间
    deleteNumSku (index, idx) {
      let list = this.specs.skuOpt2.vals[index].productSpecNums
      list.splice(idx, 1)
      // Vue.set(this.specs.skuOpt2, 'vals', this.specs.skuOpt2.vals)
      this.showPriceSpan(index, idx, 'delone')
    },
    // 区间验证
    validStart (index, idx) {
      let p = this.specs.skuOpt2.vals[index]
      let item = p.productSpecNums[idx]
      let prev = p.productSpecNums[idx - 1]
      let next = p.productSpecNums[idx + 1]
      if (item.startNum === '') {
        this.showPriceSpan(index, idx)
        return
      }
      if (item.startNum < 0 || !this.positiveInt.test(item.startNum)) {
        this.$message.error('起订量必须为大于0的正整数')
        item.startNum = ''
        // Vue.set(this.specs.skuOpt2, this.specs.skuOpt2)
      }
      if (prev) {
        if (+item.startNum <= +prev.startNum) {
          this.$message.error('起订量必须大于上一个')
          item.startNum = ''
          // Vue.set(this.specs.skuOpt2, this.specs.skuOpt2)
        }
      }
      if (next && next.startNum) {
        if (+item.startNum >= +next.startNum) {
          this.$message.error('起订量必须小于下一个')
          item.startNum = ''
          // Vue.set(this.specs.skuOpt2, this.specs.skuOpt2)
        }
      }
      this.showPriceSpan(index, idx)
    },
    // 生成批发价区间
    showPriceSpan (index, idx, isDelone) {
      let p = this.specs.skuOpt2.vals[index]
      let arr = []
      if (isDelone !== 'delone') { // 如果本对象是删除了
        let thisprice = p.productSpecNums[idx].price
        if (isNaN(thisprice) || thisprice < 0 || thisprice > 10000000) {
          this.$message.error('规格单价必须为0-10000000之间的数字')
          p.productSpecNums[idx].price = ''
          return
        }
      }
      p.productSpecNums.forEach((item) => {
        if (item.price !== '') {
          arr.push(+item.price)
        }
      })
      // 清空批发区间
      if (arr.length === 0) {
        p.specNumSpan = ''
      } else {
        arr.sort(this.sortNum)
        p.specNumSpan = arr[0] + '~' + arr.pop()
      }
      p.opt = p.specNumSpan
      Vue.set(this.specs.skuOpt2, 'vals', this.specs.skuOpt2.vals)
    },
    // 点击重新加载运费列表
    getFreAgain (isvisble) {
      if (isvisble) {
        proApi.getFreight().then(res => {
          this.freightList = res.data.data
        })
      }
    },
    // 修改类目返回
    renderCateBack () {
      this.freightWay = this.form.freightWay
      Object.assign(this.specs, this.specback)
      // this.specs.skuInputs = this.deepCopyArr(this.defaultInputs)
    },
    // 新增渲染
    renderSkuAdd () {
      this.specs.skuInputs = this.deepCopyArr(this.defaultInputs)
    },
    // 编辑渲染
    renderSku () {
      let spec = this.editSpec
      if (this.specback.skuInputs) { // 新增改类目返回
        this.renderCateBack()
        return
      }
      if (spec && !spec.length) { // 新增返回
        this.renderSkuAdd()
        return
      }
      this.freightWay = this.form.freightWay
      let _this = this.specs
      // let obj = {name: _this.specname, vals: []} // vals: 规格值
      let specMap = {}
      // _this.skuOpt = [{vals: []}, {vals: []}]
      spec.forEach((item, index) => {
        let arr = item.specName.split(';')
        arr.forEach((item2) => {
          if (item2) { // 处理每个 规格名：值，值
            let nameval = item2.split(':')
            let name = specMap[nameval[0]]
            if (name && name.length) {
              let isExist = false
              for (let i = 0, len = name.length; i < len; i++) {
                if (name[i].specval === nameval[1]) {
                  isExist = true
                  break
                }
              }
              if (!isExist) {
                name.push({specval: nameval[1]})
              }
            } else {
              specMap[nameval[0]] = [{specval: nameval[1]}]
            }
          }
        })
      })
      let idx = 0
      for (let key in specMap) {
        _this.skuList.push({name: key, vals: specMap[key], idx: idx++})
      }
      this.caluSku(_this.skuList, 'renderEdit')
    },
    sortNum (a, b) {
      return a - b
    },
    fenToYuan (val) {
      return (parseFloat(val) / 100).toFixed(2)
    },
    deepCopyArr (arr) {
      return JSON.parse(JSON.stringify(arr))
    },
    // 修改/删除/编辑渲染 规格
    caluSku (skuList, skuOpt) {
      let $this = this
      let _this = this.specs
      _this.skuList = skuList
      _this.skuTab = []
      // skuList 复制skuTab来显示规格表
      _this.skuList.forEach(function (item, i) {
        _this.skuTab[i] = {}
        _this.skuTab[i].name = item.name
        _this.skuTab[i].vals = JSON.parse(JSON.stringify(item.vals))
      })
      _this.sortSkuList = $this.deepCopyArr(_this.skuTab)
      // skuTab 规格表格
      let tablen = _this.skuTab.length
      // 第一列 高的跨度
      let j0 = tablen - 1
      let all = 1
      while (j0 > -1) {
        let inj = _this.skuTab[j0].vals.length
        all = all * inj
        j0--
      }
      // 最小高度
      let span = 36
      // 第一列之后的跨度计算
      for (let i = 0; i < tablen; i++) {
        let item = _this.skuTab[i]
        let len2 = item.vals.length
        // let speckv = ''
        if (i === 0) {
          item.span = all * span / len2
        } else {
          item.span = _this.skuTab[i - 1].span / len2
          let prevlen = _this.skuTab[i - 1].vals.length
          let arr = []
          for (let j = 0; j < prevlen; j++) {
            for (let m = 0; m < len2; m++) { // 处理重复specval
              arr.push(item.vals[m])
            }
          }
          item.vals = arr
        }
        Vue.set(_this.skuTab, i, item)
      }
      if (tablen === 0) { // 没有规格
        // _this.skuOpt = []
        _this.skuOpt1 = {}
        _this.skuOpt2 = {}
        $this.$emit('skuToParent', _this)
        return
      }
      // 处理最后一列 作为操作列
      let lastv = _this.skuTab[tablen - 1]
      let arr2 = []
      let len3 = lastv.vals.length
      for (let m = 0; m < len3; m++) {
        lastv.vals[m].opt = '' // 输入价格和库存
        lastv.vals[m].productSpecNums = [{price: '', startNum: ''}]
        arr2.push(lastv.vals[m])
      }
      lastv.vals = arr2
      Vue.set(_this.skuTab, tablen - 1, lastv)
      // 计算 操作列对应的规格值
      let lastarr = ''
      let sku1 = _this.sortSkuList[0]
      let sku2 = _this.sortSkuList[1]
      let sku3 = _this.sortSkuList[2]
      let item = sku1.vals
      for (let m = 0, len2 = item.length; m < len2; m++) {
        if (!sku2) {
          lastarr = sku1.name + ':' + item[m].specval
          sku1.vals[0].strval ? sku1.vals[0].strval.push(lastarr) : sku1.vals[0].strval = [lastarr]
          continue
        }
        let item2 = sku2.vals
        for (let m2 = 0, len3 = item2.length; m2 < len3; m2++) {
          if (!sku3) {
            lastarr = [sku1.name + ':' + item[m].specval, sku2.name + ':' + item2[m2].specval].join(';')
            sku2.vals[0].strval ? sku2.vals[0].strval.push(lastarr) : sku2.vals[0].strval = [lastarr]
            continue
          }
          let item3 = sku3.vals
          for (let m3 = 0, len4 = item3.length; m3 < len4; m3++) {
            lastarr = [sku1.name + ':' + item[m].specval, sku2.name + ':' + item2[m2].specval, sku3.name + ':' + item3[m3].specval].join(';')
            if (sku3.vals[0].strval) {
              sku3.vals[0].strval.push(lastarr)
            } else {
              sku3.vals[0].strval = [lastarr]
            }
          }
        }
      }
      // 排好序的规格name值组合都放这里
      let sortdata = _this.sortSkuList[_this.sortSkuList.length - 1].vals[0].strval // 新值
      // 删除属性 保留原值
      if (skuOpt === 'del') {
        let optdata = _this.skuOpt2.vals // 旧值
        let copyopt = $this.deepCopyArr(optdata)
        // let copyInven = $this.deepCopyArr(_this.skuOpt1.vals)
        if (!optdata[0].strval) {
          $this.copyTab(lastv)
        } else {
          // $this.copyTab(lastv)
          // sortdata ["花花:44;发发:11", "花花:44;发发:22"]
          // let strarr = optdata[0].strval.split(';') // 参照的顺序[发发:22;花花:44]
          // let arr3 = []
          // sortdata.forEach((item) => {
          //   let inner = item.split(';')
          //   let arrin = []
          //   inner.forEach((item1, idx1) => {
          //     strarr.forEach((item2, idx2) => {
          //       if (item1.split(':')[0] === item2.split(':')[0]) {
          //         arrin[idx2] = inner[idx1]
          //       }
          //     })
          //   })
          //   arr3.push(arrin.join(';')) // 改顺序 ["发发:11;花花:44", "发发:22;花花:44"]
          // })
          // let spec = sortdata.join('-')
          // sortdata ['xx:yy;','1:2;'] old:'3:4;xx:yy;7:8;'=>true
          // 旧值包含新值的属性对
          let judgeOldNew = function (old) {
            let flag = false
            let curr = ''
            for (let m = 0, len = sortdata.length; m < len; m++) {
              let ad = sortdata[m].split(';')
              let all = 0
              for (let i = 0, len2 = ad.length; i < len2; i++) {
                if (old.indexOf(ad[i]) !== -1) {
                  all++
                }
              }
              if (all === ad.length) {
                curr = sortdata[m]
                flag = true
                break
              }
            }
            return [flag, curr]
          }
          for (let i = copyopt.length - 1; i > -1; i--) {
            let itv = copyopt[i]
            let rest = judgeOldNew(itv.strval)
            // if (sortdata.includes(itv.strval)) {
            //   _this.skuOpt1.vals[i] = copyInven[i]
            //   _this.skuOpt2.vals[i] = itv
            // }
            // 旧值与新值不一样 就制空
            if (!sortdata.includes(itv.strval)) {
              _this.skuOpt1.vals[i].opt = ''
              _this.skuOpt2.vals[i].opt = ''
              _this.skuOpt2.vals[i].productSpecNums = [{price: '', startNum: ''}]
              _this.skuOpt2.vals[i].strval = rest[1]
            }
            // 删除操作列某行条件：新值不等于旧值 并且 旧值不比新值多个属性对
            if (!sortdata.includes(itv.strval) && !rest[0] && copyopt.length !== sortdata.length) {
              _this.skuOpt2.vals.splice(i, 1)
              _this.skuOpt1.vals.splice(i, 1)
            }
          }
          if (_this.sortSkuList.length === 1 && _this.skuOpt1.vals.length === 0) { // 由多组 剩下一组
            $this.copyTab(lastv)
          }
        }
      }
      // 编辑属性 保留原值
      if (skuOpt === 'doedit') {
        if (!_this.skuOpt1.vals) { // 编辑的属性是新增产品第一次添加
          $this.copyTab(lastv)
          let optdata = _this.skuOpt2.vals
          optdata.forEach((itv, idx) => {
            optdata[idx].strval = sortdata[idx]
          })
        } else {
          // 保存好原有的值
          let copysku0 = $this.deepCopyArr(_this.skuOpt1)
          let copysku1 = $this.deepCopyArr(_this.skuOpt2)
          // let optdata = _this.skuOpt[1].vals // 旧值
          // 复制一批空白值
          $this.copyTab(lastv)
          let optdataNEW = _this.skuOpt2.vals
          optdataNEW.forEach((itv, idx) => {
            optdataNEW[idx].strval = sortdata[idx]
          })
          // 处理顺序
          // let strarr = optdata[0].strval.split(';') // 参照的顺序[发发:22;花花:44]
          // let arr3 = []
          // sortdata.forEach((item) => {
          //   let inner = item.split(';')
          //   let arrin = []
          //   inner.forEach((item1, idx1) => {
          //     strarr.forEach((item2, idx2) => {
          //       if (item1.split(':')[0] === item2.split(':')[0]) {
          //         arrin[idx2] = inner[idx1]
          //       }
          //     })
          //   })
          //   arr3.push(arrin.join(';')) // 改顺序 ["发发:11;花花:44", "发发:22;花花:44"]
          // })
          // 空白值和原值比较
          for (let i = 0, len = copysku1.vals.length; i < len; i++) {
            for (let j = 0, len2 = _this.skuOpt2.vals.length; j < len2; j++) {
              let curr = _this.skuOpt2.vals[j]
              let old = copysku1.vals[i]
              if (curr.strval === old.strval) {
                Object.assign(curr, old)
                _this.skuOpt1.vals[j] = copysku0.vals[i]
              }
            }
          }
        }
      }
      // 处理编辑的操作列传值
      if (skuOpt === 'renderEdit') {
        // 库存 单价的输入框
        $this.copyTab(lastv)
        // 把sortList处理好的值赋值给skuTab
        let optdata = _this.skuOpt2.vals
        optdata.forEach((itv, idx) => {
          optdata[idx].strval = sortdata[idx]
        })
        $this.editSpec.forEach((item, index) => {
          _this.skuOpt2.vals.forEach((opt2, index2) => { // 可能末尾差个分号
            if (opt2.strval === item.specName || opt2.strval + ';' === item.specName) {
              opt2.opt = $this.fenToYuan(item.specPrice)
              _this.skuOpt1.vals[index2].opt = item.invenory
              // 防止改变传入的editSpec
              let nums = $this.deepCopyArr(item.productSpecNums)
              if (nums.length === 0) {
                opt2.productSpecNums = [{price: '', startNum: ''}]
              } else {
                nums.forEach((data) => {
                  data.price = $this.fenToYuan(data.price)
                })
                opt2.productSpecNums = nums
                let intervArr = item.priceInterval.split('~')
                let interv = Number(intervArr[0]).toFixed(2) + '~' + Number(intervArr[1]).toFixed(2)
                opt2.opt = interv
                opt2.specNumSpan = interv
              }
            }
          })
        })
        $this.priceUnitSku = $this.editSpec[0].priceUnit
      }
      // 保存一个属性后 隐藏input
      this.isSkuEdit = false
      // tab每列宽度
      _this.specTrWid = (100 / (_this.skuTab.length + 2)) + '%'
      $this.$emit('skuToParent', _this)
    },
    copyTab (lastv) {
      let objs = {vals: this.deepCopyArr(lastv.vals), span: lastv.span, name: lastv.name}
      this.specs.skuOpt1 = this.deepCopyArr(objs)
      this.specs.skuOpt2 = this.deepCopyArr(objs)
    },
    unique (arr) {
      arr.sort() // 先排序
      let res = [arr[0]]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
          res.push(arr[i])
        }
      }
      return res
    },
    // 判断库存有无填写
    stockIsEmp () {
      let vals = this.specs.skuOpt1.vals
      let arr = 0
      for (let i = 0, len = vals.length; i < len; i++) {
        if (vals[i].opt !== '') {
          arr++
        }
      }
      if (arr) {
        this.chkAllDisabld = false
      } else {
        this.chkAllDisabld = true
      }
    }
  },
  computed: mapGetters({
  }),
  created () {
    proApi.getFreight().then(res => {
      this.freightList = res.data.data
    })
    orderLogisticsAPI.getZhouAndCountry().then((res) => {
      this.$store.commit('CACHE_ZHOUS', res.data.data)
    })
    if (this.$route.params.isback === 'true') {
      this.isSkuEdit = false
    }
    this.renderSku()
  },
  watch: {
    sameWholeNum () { // 库存全部相同
      if (this.sameWholeNum) {
        let v = this.specs.skuOpt1.vals
        let firstnotnull = ''
        for (let i = 0, len = v.length; i < len; i++) {
          if (v[i].opt !== '' && !firstnotnull) {
            firstnotnull = v[i].opt
            break
          }
        }
        for (let i = 0, len = v.length; i < len; i++) {
          v[i].opt = firstnotnull
        }
      }
    },
    priceUnitSku () {
      this.form.priceUnitSku = this.priceUnitSku
    },
    freightWay () {
      this.form.freightWay = this.freightWay
    },
    toBack () {
      if (this.toBack) {
        this.$emit('skuToParent', this.specs)
      }
    },
    'specs.skuOpt1.vals' () {
      this.stockIsEmp()
    }
  }
}
</script>
<style lang="less">
// @import '../../../assets/style/product.less';
// .sku-pop{
//   margin-left: -180px;
// }
.sku-show {
  .el-button{
    position: relative;
  }
  .icon-del{
    display: none;
    position: absolute;
    right: -5px;
    top: -5px;
  }
  .el-button:hover{
    .icon-del{
      display: block
    }
  }
}
.sku-spec-tabs{
  td{
    height: 30px;
    line-height: 30px;
    width: 100px;
    border: 1px solid #ccc;
  }
}
</style>
