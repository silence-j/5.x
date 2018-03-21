<template>
  <div class="left-operation">
    <!--logo设置 start-->
    <div id="editor-logo" class="editor">
      <p class="title">LOGO设置</p>
      <imgUpload :defaultSrc="bannerSrc" @imgChange="changeLogo"></imgUpload>
      <p class="desc margintop16">
        <!-- LOGO最大宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果 -->
        {{tempSize[tempCode].logo}}
      </p>
      <el-button type="primary" @click="saveLogo">保存</el-button>
    </div>
    <!--logo设置 end-->
    <div id="editor-carousel" class="editor">
      <p class="title">轮播图设置</p>
      <div class="carousel-img">
        <div class="upload-carousel" @click="materialOptions.show=true" v-if="carousels.length<4">
          <div class="content">
            <i class="el-icon-plus" style="font-size:18px;left:3px;"></i>
            <br>
            <br>
            <p>上传图片</p>
          </div>
        </div>
        <div style="display: inline-block;">
          <uploadMaterial :options="materialOptions" @confirmInsert="mainCarouselChange" @cancelInsert="materialOptions.show=false"></uploadMaterial>
        </div>
        <draggable v-model="carousels" class="draggable">
          <transition-group class="t-group">
            <div v-for="(image, i) in carousels" :key="image"  style="position:relative;display:inline-block;vertical-align:top;">
              <span class="img" :style="{ background: 'url('+image.pircUrlWhole+')',backgroundSize:'cover',backgroundPosition:'center'}" @click="showEditor(image,i)">
              </span>
              <i class="icon-font" @click="removeImg(image, i)">&#xe6ec;</i>
            </div>
          </transition-group>
        </draggable>
        <div class="loading-image" v-if="loadLogoImage">
            <div class="loading loading-circle img-load"></div>
        </div>
      </div>
      <template >
        <div class="hidden-container">
          <imgUpload v-if="prevCarousel.index!==-1" @imgChange="changeCarousel" :defaultSrc="prevCarousel.img.pircUrlWhole"></imgUpload>
        </div>
        <p class="desc margintop16">
          <!-- 招牌图宽度为1920像素，高度为400像素，JPG，PNG图片格式，2M以内为最佳显示效果 -->
        {{tempSize[tempCode].carousels}}
        </p>
        <div class="hidden-container">
          <p>跳转类型</p>
          <el-select v-model="prevCarousel.value" @change="onJumpTypeChange" placeholder="请选择" style="width:160px">
           <el-option
              label="无跳转"
              value="-1">
            </el-option>
            <el-option
              label="外部链接"
              value="0">
            </el-option>
            <el-option
              label="内部产品"
              value="1">
            </el-option>
          </el-select>
          <p v-if="prevCarousel.value==='0'" class="p-address">链接地址</p>
          <p v-if="prevCarousel.value==='1'" class="p-address">请选择产品</p>
          <el-input v-if="prevCarousel.value==='0'" v-model="prevCarousel.img.linkUrl" class="linkUrl"></el-input>
          <div class="product-select">
            <el-select style="width:100%" v-if="prevCarousel.value==='1'" size="small" v-model="selectedSearchProduct"
                  ref="productSelectInput"
                  placeholder="请输入商品名称选择商品"
                  :remote-method="getSearchList"
                  @change="onSelectedProduct"
                  :clearable="true"
                  filterable
                  multiple
                  :multiple-limit="1"
                  remote>
              <el-option
                class="option-tag"
                v-for="item in productSearchList"
                :key="item.id"
                :label="item.productName"
                :value="item.id">
                <div class="recycle-box">
                  <img :src="item.productFirstPicWhole">
                  <span>{{item.productName}}</span>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
        <el-button type="primary" @click="saveCarousel" style="margin-top:20px;">保存</el-button>
    </div>
    <div id="editor-avert" class="editor">
      <p class="title">广告位设置</p>
      <div class="avert-img" v-for="(adv,aIndex) in advPosition" key="advert">
        <imgUpload v-if="adv && !loadAdvertising[aIndex]" @imgChange="changeAdvPic" :defaultSrc="adv.pircUrlWhole" :index="aIndex"></imgUpload>
        <el-select v-model="advert[aIndex].value" @change="advJumpTypeChange(aIndex)" placeholder="请选择" class="margintop8">
          <el-option
            v-for="item in advert[aIndex].options"
            key="item"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-show="advert[aIndex].value == '0'" v-model="advert[aIndex].linkUrl" placeholder="请输入链接地址"></el-input>
         <div class="product-select" style="margin-top:10px;">
            <el-select v-show="advert[aIndex].value == '1'" size="small" v-model="advert[aIndex].selectedProductArray"
                  ref="productSelectAdvInput"
                  placeholder="请输入商品名称选择商品"
                  :remote-method="getSearchList"
                  @change="onSelectedProductAdv"
                  :clearable="true"
                  filterable
                  multiple
                  :multiple-limit="1"
                  remote>
              <el-option
                class="option-tag"
                v-for="item in productSearchList"
                :key="item.id"
                :label="item.productName"
                :value="item.id">
                <div class="recycle-box">
                  <img :src="item.productFirstPicWhole">
                  <span>{{item.productName}}</span>
                </div>
              </el-option>
            </el-select>
          </div>
      </div>
      <p class="desc">
        <!-- 招牌图宽度为380像素，高度为300像素，JPG，PNG图片格式，2M以内为最佳显示效果 -->
         {{tempSize[tempCode].advert}}
      </p>
      <el-button type="primary" @click="saveAdv">保存</el-button>
    </div>
    <div id="editor-about-us" class="editor">
      <p class="title">公司描述</p>
      <imgUpload v-if="!loadDescImg" :defaultSrc="companyInfo.descImgUrlWhole" @imgChange="uploadAboutPic"></imgUpload>
      <p class="desc margintop16">
        <!-- 宽度为941像素，高度为472像素，JPG，PNG图片格式，2M以内为最佳显示效果 -->
         {{tempSize[tempCode].aboutUs}}
      </p>
      <div class="textarea-wraper">
        <textarea @change="setDirty" maxlength="1500" class="address" v-model="companyInfo.shopDesc" style="resize:none;" id="txtContenta" ></textarea>
        <div v-if="companyFoot.shopDesc" class="len-tip">{{companyInfo.shopDesc.length}}/1500</div>
      </div>
      <p class="desc margintop16">
        请简要描述您公司的核心优势，如：我们有20多年的设计研发经验
      </p>
      <div v-if="companyInfo.shopDesc">
       <el-button type="primary" @click="saveAbout">保存</el-button>
      </div>
      <div v-else>
       <div class="grey-btn">保存</div>
      </div>
    </div>
    <div id="editor-products" class="editor">
      <p class="title">产品推荐</p>
      <p class="desc">
        您可推荐8个产品，已推荐<span class="c-fc-red">{{productList.length}}</span>个产品
      </p>
      <ul class="products">
        <p class="product-title">产品名称
          <span class="icon-font icon-add" @click="addProduct" v-if="productList.length<8"></span>
          <!-- <span class="icon-font icon-add" v-else></span> -->
        </p>
        <draggable v-model="productList">
          <transition-group>
                <li v-for="(product,pid) in productList" :key="product.productName">
                  <img :src="product.wholeProductFirstPic">
                  <span class="p-name">{{product.productName}}</span>
                  <div class="opt">
                    <span class="icon-font" @click="deleteProduct(pid)">&#xe670;</span>
                    &nbsp;&nbsp;
                    <span class="icon-font">&#xe66e;</span>
                  </div>
                </li>
            </transition-group>
        </draggable>

      </ul>
      <el-button type="primary" @click="saveProducts">保存</el-button>
    </div>
    <div id="editor-footer" class="editor">
      <p class="title">底部导航设置</p>
      <el-form :model="companyFoot" :rules="rules" ref="companyFoot" class="demo-ruleForm">
        <el-form-item prop="contactTelephone" class="companyDetail">
          <p>联系电话*</p>
          <div class="el-input">
            <input @change="setDirty" v-model="companyFoot.contactTelephone" name="contactTelephone" v-validate="{ rules: { regex: /^[\S]+$/} }" :class="{'is-danger': errors.has('contactTelephone') }" class="el-input__inner">
          </div>
        </el-form-item>
        <el-form-item prop="contactEmail" class="companyDetail">
          <p>联系邮箱*</p>
           <div class="el-input">
            <input @change="setDirty" v-model="companyFoot.contactEmail" name="contactEmail" v-validate="{ rules: { required: true, email: true} }" :class="{'is-danger': errors.has('contactEmail') }" class="el-input__inner" placeholder="请输入公司联系邮箱">
          </div>
        </el-form-item>
        <el-form-item prop="address" class="companyDetail">
          <p>公司地址*</p>
            <div class="textarea-wraper">
              <textarea @change="setDirty" class="address" v-model="companyFoot.address" name="address" v-validate="{ rules: { required: true} }" :class="{'is-danger': errors.has('address') }"  rows="6" style="resize:none;" maxlength="200"></textarea>
              <div v-if="companyFoot.address" class="len-tip">{{companyFoot.address.length}}/200</div>
            </div>

          <!-- <el-input type="textarea" :rows="6" v-model="companyFoot.address"></el-input> -->
        </el-form-item>
        <el-form-item prop="facebookUrl" class="companyDetail">
          <p>公司Facebook地址</p>
          <el-input @change="setDirty" v-model="companyFoot.facebookUrl" placeholder="请输入公司Facebook地址"></el-input>
        </el-form-item>
        <el-form-item prop="twitterUrl" class="companyDetail">
          <p>公司Twitter地址</p>
          <el-input @change="setDirty" v-model="companyFoot.twitterUrl" placeholder="请输入公司Twitter地址"></el-input>
        </el-form-item>
        <el-form-item prop="linkedinUrl" class="companyDetail">
          <p>公司LinkedIn地址</p>
          <el-input @change="setDirty" v-model="companyFoot.linkedinUrl" placeholder="请输入公司LinkedIn地址"></el-input>
        </el-form-item>
      </el-form>
      <!--<p class="desc">-->
        <!--LOGO最大宽度为230像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果-->
      <!--</p>-->
      <div v-if="!errors.any()&&companyFoot.contactTelephone&&companyFoot.contactEmail&&companyFoot.address">
        <el-button type="primary" @click="saveFoot">保存</el-button>
      </div>
      <div v-else>
       <div class="grey-btn" @click="saveFootTip">保存</div>
      </div>
    </div>
    <el-dialog class="d-size"  size="small" v-model="addProductDialogTableVisible" >
        <span slot="title">
          <span class="select-product-title">选择产品</span>
          <span class="select-product-tip">&nbsp;&nbsp;&nbsp;您共可推荐8个产品，已推荐{{productList.length}}个产品</span>
        </span>
        <div v-if="goodsLoading" class="loading loading-circle"></div>
        <div class="none-data-tip" v-else-if="goods.length === 0">
          <img src="../../../assets/img/nodata.png" width="78">
          <div class="tip1">
            您还没有添加商品
          </div>
          <div class="tip2">
            请至产品管理添加商品
          </div>
        </div>
        <template v-else>
          <div class="table-temp">
              <el-table
                :data="goods">
                <el-table-column
                  label="产品名称"
                  width="380">
                   <template scope="scope">
                    <div class="img-wrap">
                     <img :src="scope.row.productFirstPicWhole">
                    </div>
                     <span class="desc-middel">{{scope.row.productName}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  width="120"
                  label="">
                  <template scope="scope">
                    <span class="choose-btn" @click="cancelChooseGood(scope.$index,scope.row.id)" v-if="scope.row.toIndex" >取消选择</span>
                    <span class="choose-btn" @click="chooseGood(scope.$index,scope.row.id)" v-else>选择</span>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:15px;">
                <el-pagination
                  small
                  layout="prev, pager, next"
                  @current-change="productHandleCurrentChange"
                  :current-page="addProductPage.page"
                  :page-size="addProductPage.pageSize"
                  :total="addProductPage.totalCount">
                </el-pagination>
              </div>
              <div slot="footer" class="dialog-footer" style="margin-top:32px;">
                <el-button @click="addProductDialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmChooseToIndex">确 定</el-button>
              </div>
          </div>
        </template>

    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import myWebSiteApi from '../../../../src/api/myWebSiteApi'
  import websiteStyleAPI from '@/api/websiteStyleAPI'
  import productApi from '../../../../src/api/productApi'
  import imgUpload from '../../../components/imgUpload'
  import uploadMaterial from '../../../components/uploadMaterial'
  export default{
    data () {
      return {
        // 素材库配置项
        materialOptions: {
          multiple: false,
          size: 10,
          type: 'img',
          show: false
        },
        onJumpTypeChangeTimes: 0,
        /**
         * 来识别 跳转类型 字段的改变 是直接切换跳转类型还是 点击轮播图切换跳转类型的。
         * 如果是 点击跳转类型 切换 ，那就清空 linkUrl  false
         * 如果 是点击图片切换的  ，不清空 linkUrl   true
         * @type {[type]}
         */
        jumpTypeChangeFlag: false,
        /**
         * 商品信息加载中
         * @type {Boolean}
         */
        goodsLoading: true,
        /**
         * 上传图片的 index
         * @type {Number}
         */
        advPicIndex: -1,
        /**
         * 搜索出来的产品列表
         * @type {Array}
         */
        productSearchList: [],
        /**
         * 产品搜索
         * @type {}
         */
        selectedSearchProduct: [],
        /**
         * 增加产品 商品列表
         * @type {Array}
         */
        goods: [],
        /**
         * 增加产品分页
         * @type {Object}
         */
        addProductPage: {
          page: 1,
          pageSize: 10,
          totalCount: 0
        },
        addProductDialogTableVisible: false,
        bannerSrc: '',
        bannerUrl: '',
        companyInfo: {},
        desc: '',
        size: 8,
        recordsCount: 0,
        /**
         * 轮播图
         * @type {Array}
         */
        carousels: [],
        /**
         * 编辑当前轮播图
         * value 被选中的 跳转类型
         * img 编辑的图片对象
         * index 编辑当前图片的索引，初始化为-1 ，不展现详情
         * @type {Object}
         */
        prevCarousel: {
          index: -1,
          value: '0',
          img: {}
        },
        shopId: window.localStorage.shopId,
        productList: [],
        /**
         * 三个广告位
         * @type {Array}
         */
        advPosition: [],
        advert: [
          {
            options: [{
              value: '-1',
              label: '无跳转'
            }, {
              value: '0',
              label: '外部链接'
            }, {
              value: '1',
              label: '我的产品'
            }],
            value: '',
            link: '',
            selectedProductArray: []
          },
          {
            options: [{
              value: '-1',
              label: '无跳转'
            }, {
              value: '0',
              label: '外部链接'
            }, {
              value: '1',
              label: '我的产品'
            }],
            value: '',
            link: '',
            selectedProductArray: []
          },
          {
            options: [{
              value: '-1',
              label: '无跳转'
            }, {
              value: '0',
              label: '外部链接'
            }, {
              value: '1',
              label: '我的产品'
            }],
            value: '',
            link: '',
            selectedProductArray: []
          }
        ],
        /**
         *  首页底部信息
         */
        companyFoot: {
        },
        /**
         * 表单校验规则
         */
        rules: {
          telPhone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ]
        },
        tempCode: '1',
        /**
         * 面料、辅料、皮革模板:15
             轮播：1920*550
             广告位：1100*270
             aboutUs:500*500
                logo:118*50
          五金工具:11
             轮播：1200*516
             广告位：1200*165
             aboutUs:480*240
                logo:212*80
          电子灯具模板:16
             轮播：1920*700
             广告位：400 ，315
             aboutUS:436*480
                logo:54*54
          医疗模板:13
             轮播：1920*640
             广告位：1200*546
             aboutUS:310px
                logo:316*58
          汽车用品模板:19
             轮播：1920*700
             广告位：366*366
             aboutUs：1258*600
                logo:214*55
          户外运动：1
             * @type {Object}
         */
        tempSize: {
          '15': {
            'logo': 'LOGO宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为550像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '第一张和第三张招牌图宽度为270像素，高度为270像素，第二张招牌图宽度为570像素，高度为270像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为590像素，高度为500像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '11': {
            'logo': 'LOGO宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1200像素，高度为520像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为370像素，高度为170像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为470像素，高度为240像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '16': {
            'logo': 'LOGO宽度为100像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为700像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为400像素，高度为315像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为490像素，高度为490像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '13': {
            'logo': 'LOGO宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为640像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '第一张招牌图宽度为555像素，高度为555像素，第二张和第三张招牌图宽度为555像素，高度为266像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为460像素，高度为460像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '19': {
            'logo': 'LOGO宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为700像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图第一张宽度为532像素，高度为390像素，第二张宽度为859像素，高度为390像素，第三张宽度为546像素，高度为390像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为1230像素，高度为590像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '1': {
            'logo': 'LOGO宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为400像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为380像素，高度为300像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为950像素，高度为470像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '12': {
            'logo': 'LOGO最大宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为600像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为380像素，高度为443像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为500像素，高度为350像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '14': {
            'logo': 'LOGO最大宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为750像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为600像素，高度为300像素，第二张和第三张招牌图宽度为300像素，高度为300像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为750像素，高度为450像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '17': {
            'logo': 'LOGO最大宽度为100像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为750像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为366像素，高度为366像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为540像素，高度为540像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '18': {
            'logo': 'LOGO最大宽度为100像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为700像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为366像素，高度为366像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为550像素，高度为550像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '20': {
            'logo': 'LOGO最大宽度为100像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为700像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为350像素，高度为350像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为550像素，高度为455像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          },
          '21': {
            'logo': 'LOGO最大宽度为300像素，高度为100像素，PNG透明图片格式，2M以内为最佳显示效果',
            'carousels': '招牌图宽度为1920像素，高度为600像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'advert': '招牌图宽度为380像素，高度为443像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'aboutUs': '宽度为500像素，高度为350像素，JPG，PNG图片格式，2M以内为最佳显示效果'
          }
        },
        loadBannerImage: false, // logo图片是否正在上传
        loadLogoImage: false,  // 轮播图片是否正在上传
        loadAdvertising: [false, false, false, false], // 广告图片是否正在上传
        loadDescImg: false // 简介图片是否正在上传
      }
    },
    components: {
      draggable,
      imgUpload,
      uploadMaterial
    },
    mounted () {
      /**
       * 产品列表
       */
      this.getProductList({})
      /**
       * 拿LOGO图 , 关于我们 公司描述
       */
      this.getLogo()
      /**
       * 轮播图
       * @type {[type]}
       */
      this.getCarousels({
        position: 'BANNAER'
      })
      /**
       * 广告位
       */
      this.getAdvPosition()
      /**
       * 产品列表下拉初始化
       */
      this.getSearchList()
      this.getTempCode()
    },
    methods: {
      /**
       * 获取当前模板的 code
       * @return {[type]} [description]
       */
      getTempCode () {
        websiteStyleAPI.getTemplateList().then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            for (let templ of res.data.data) {
              if (templ.useTag === 1) {
                this.tempCode = templ.templateCode
                window.tempCode = templ.templateCode
              }
            }
          }
        })
      },
      /**
       * 输入框出发change事件后，都要setDirty
       */
      setDirty () {
        this.$store.commit('SET_DIRTY', true)
      },
      /**
       * 选择产品 之后确定按钮出发 产品推荐列表刷新
       * @return {[type]} [description]
       */
      confirmChooseToIndex () {
        this.addProductDialogTableVisible = false
        // this.getProductList({})
      },
      /**
       * 设置广告索引
       */
      setAdvIndex (val) {
        this.advPicIndex = val
      },
      /**
       * 保存三个广告位
       * advIndex 为前端映射对象 ，advPosition为后端一致对象
       * 因为前端做下拉 要用到字符串对象和数组对象 ，所以得自建
       * @return {[type]} [description]
       */
      saveAdv () {
        if (this.advPosition.length === 0) {
          this.$message.error('广告图不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        /**
         * 格式验证
         * @type {Boolean}
         */
        let validate = true
        let invalidLinkTag = ''
        for (let advIndex in this.advPosition) {
          this.advPosition[advIndex].linkTag = parseInt(this.advert[advIndex].value)
          if (this.advert[advIndex].value === '1') {
            this.advPosition[advIndex].linkUrl = this.advert[advIndex].selectedProductArray[0]
            /**
             * 如果内部产品链接为空
             * @param  {[type]} !this.advPosition[advIndex].linkUrl [description]
             * @return {[type]}                                     [description]
             */
            if (!this.advPosition[advIndex].linkUrl) {
              validate = false
              invalidLinkTag = 1
            }
          } else if (this.advert[advIndex].value === '0') {
            this.advPosition[advIndex].linkUrl = this.advert[advIndex].linkUrl
            /**
             * 外链的时候 验证其合法性
             * @param  {[type]} this.advert[advIndex].linkUrl [description]
             * @return {[type]}                               [description]
             */
            let accordWithUrl = /^http*/g.test(this.advert[advIndex].linkUrl)
            if (!accordWithUrl) {
              validate = false
              invalidLinkTag = 0
            }
          } else {
            this.advPosition[advIndex].linkUrl = ''
          }
        }
        let postObj = {
          detailStr: JSON.stringify(this.advPosition)
        }
        if (!validate) {
          if (invalidLinkTag === 0) {
            this.$message.error('外部链接格式不正确!')
          } else {
            this.$message.error('广告位要跳转的商品不能为空!')
          }
          return
        }
        myWebSiteApi.saveAdv(postObj).then((res) => {
          if (!res.data.code) {
            window.editorApi.iframeLoad()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 广告位设置 切换跳转类型
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      advJumpTypeChange (index) {
        console.log('advJumpTypeChange')
        this.$store.commit('SET_DIRTY', true)
        this.advPosition[index].linkUrl = ''
      },
      /**
       * 切换 跳转链接选择
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      onJumpTypeChange (val) {
        console.log('onJumpTypeChange')
        /**
         * 页面初始化的时候会执行一次这个方法 ，所以要判断是否为脏，则需要把第一次 忽略
         * @param  {[type]} this.onJumpTypeChangeTimes !             [description]
         * @return {[type]}                            [description]
         */
        if (this.onJumpTypeChangeTimes !== 0) {
          this.$store.commit('SET_DIRTY', true)
        }
        this.onJumpTypeChangeTimes++
        if (this.carousels.length === 0) {
          return
        }
        let pIndex = this.prevCarousel.index
        this.carousels[pIndex].linkTag = parseInt(val)
        /**
         * 如果只是 点击下拉切换的
         * @param  {[type]} !jumpTypeChangeFlag [description]
         * @return {[type]}                     [description]
         */
        if (!this.jumpTypeChangeFlag) {
          console.log('下拉切换')
          this.carousels[pIndex].linkUrl = ''
          this.selectedSearchProduct = []
        } else {
          console.log('跳转切换')
        }
        this.jumpTypeChangeFlag = false
      },
      /**
       * 轮播图页面 选择商品后回调
       * @param  {[type]} v [description]
       * @return {[type]}   [description]
       */
      onSelectedProduct (sProductList) {
        this.$store.commit('SET_DIRTY', true)
        if (sProductList.length === 0) {
          return
        } else {
          /**
           * 在 没有选择产品==》选择了一个产品 这个动作时候 ， 把弹出框关闭
           * 在 选了一个产品==》取消选择， 弹出框任然留着
           * @param  {[type]} let selecti       of this.$refs.productSelectAdvInput [description]
           * @return {[type]}     [description]
           */
          this.$refs.productSelectInput.visible = false
        }
        this.$refs.productSelectInput.query = ''
        let pIndex = this.prevCarousel.index
        this.carousels[pIndex].linkUrl = sProductList[0]
      },
      /**
       * 广告位
       * @param  {[type]} sProductList [description]
       * @return {[type]}              [description]
       */
      onSelectedProductAdv (sProductList) {
        this.$store.commit('SET_DIRTY', true)
        for (let selecti of this.$refs.productSelectAdvInput) {
          selecti.query = ''
        }
        if (sProductList.length === 0) {
          return
        } else {
          /**
           * 在 没有选择产品==》选择了一个产品 这个动作时候 ， 把弹出框关闭
           * 在 选了一个产品==》取消选择， 弹出框任然留着
           * @param  {[type]} let selecti       of this.$refs.productSelectAdvInput [description]
           * @return {[type]}     [description]
           */
          for (let selecti of this.$refs.productSelectAdvInput) {
            selecti.visible = false
          }
        }
        // this.advert[pIndex].selectedProductArray = sProductList[0]
      },
      /**
       * 选择商品
       * @param  {[type]} gindex [description]
       * @return {[type]}        [description]
       */
      chooseGood (gindex, id) {
        this.$store.commit('SET_DIRTY', true)
        if (this.productList.length === 8) {
          this.$message.error('最多只能选择8个产品')
          return
        }
        let goodi = this.goods[gindex]
        goodi.toIndex = 1
        this.productList.push({
          createTime: goodi.createTime,
          deleteTag: 0,
          productFirstPic: goodi.productFirstPic,
          productId: goodi.id,
          productName: goodi.productName,
          shopId: goodi.shopId,
          updateTime: goodi.updateTime,
          wholeProductFirstPic: goodi.productFirstPicWhole
        })
      },
      /**
       * 取消选择
       * @param  {[type]} gindex [description]
       * @return {[type]}        [description]
       */
      cancelChooseGood (gindex, id) {
        this.$store.commit('SET_DIRTY', true)
        let goodi = this.goods[gindex]
        goodi.toIndex = 0
        /**
         * 取得首页产品列表索引
         * @type {[type]}
         */
        let pIndex = this.getIndexOfProduct(goodi)
        console.log(pIndex)
        this.productList.splice(pIndex, 1)
      },
      /**
       * 拿到 首页产品所以
       * @return {[type]} [description]
       */
      getIndexOfProduct (gd) {
        for (let productIndex in this.productList) {
          if (gd.id === this.productList[productIndex].productId) {
            return productIndex
          }
        }
        return -1
      },
      /**
       * 选择产品分页
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      productHandleCurrentChange (val) {
        this.addProductPage.page = val
        this.addProduct()
      },
      /**
       * 增加产品弹框
       */
      addProduct () {
        this.addProductDialogTableVisible = true
        let postObj = {
          page: this.addProductPage.page,
          size: this.addProductPage.pageSize
        }
        /**
         * 产品列表
         * @param  {[type]} postObj).then((res [description]
         * @return {[type]}                    [description]
         */
        productApi.getList(postObj).then((res) => {
          if (!res.data.code) {
            this.goodsLoading = false
            this.goods = res.data.data.records
            this.addProductPage.page = res.data.data.page
            this.addProductPage.totalCount = res.data.data.totalCount
            // 根据首页推荐的产品列表初始化选择产品列表
            for (let good of this.goods) {
              good.toIndex = this.isInArray(good, this.productList)
            }
            // console.log(this.isInArray({id: 14}, [{id: 1}, {id: 12}, {id: 13}]))
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 判断该对象 对应的id 是否存在于 数组中
       * @param  {[type]}  item     [description]
       * @param  {[type]}  itemList [description]
       * @return {Boolean}          [description]
       */
      isInArray (item, itemList) {
        let isIn = itemList.some(function (it) {
          return it.productId === item.id
        })
        return isIn ? 1 : 0
      },
      /**
       * 产品搜索下拉列表
       * @return {[type]} [description]
       */
      getSearchList (query) {
        let postObj = {
          page: 1,
          size: 100,
          productName: query
        }
        /**
         * 产品列表
         * @param  {[type]} postObj).then((res [description]
         * @return {[type]}                    [description]
         */
        productApi.getList(postObj).then((res) => {
          if (!res.data.code) {
            this.productSearchList = res.data.data.records
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 删除产品
       * @param  {[type]} pindex [description]
       * @return {[type]}        [description]
       */
      deleteProduct (pindex) {
        this.$store.commit('SET_DIRTY', true)
        this.productList.splice(pindex, 1)
      },
      /**
       * 保存轮播图
       * @return {[type]} [description]
       */
      saveCarousel () {
        if (this.carousels.length === 0) {
          this.$message.error('轮播图不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        /**
         * 判断所有外链合法
         * @type {Boolean}
         */
        let vFlag = true
        /**
         * 内部链接还是 外部链接
         * @type {String}
         */
        let thisLinkTag = ''
        let num = 0
        for (let cIndex in this.carousels) {
          let c = this.carousels[cIndex]
          if (c.linkTag === 0 && !(/^http*/g.test(c.linkUrl))) {
            vFlag = false
            num = cIndex
            thisLinkTag = 0
          } else if (c.linkTag === 1 && !c.linkUrl) {
            vFlag = false
            num = cIndex
            thisLinkTag = 1
          }
        }
        if (vFlag) {
          let postObj = {
            detailStr: JSON.stringify(this.carousels)
          }
          myWebSiteApi.saveCarousel(postObj).then((res) => {
            if (!res.data.code) {
              window.editorApi.iframeLoad()
              this.$message.success(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          if (thisLinkTag === 1) {
            this.$message.error('请选择第' + (parseInt(num) + 1) + '张轮播图要跳转的产品!')
          } else {
            this.$message.error('请保证第' + (parseInt(num) + 1) + '张轮播图的外部链接地址合法!')
          }
        }
      },
      /**
       * 保存产品新顺序
       * @return {[type]} [description]
       */
      saveProducts () {
        this.$store.commit('SET_DIRTY', true)
        let postObj = {
          productPositionFormStr: JSON.stringify(this.productList)
        }
        myWebSiteApi.saveProduct(postObj).then((res) => {
          if (!res.data.code) {
            window.editorApi.iframeLoad()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 保存页脚 灰色按钮提示
       * @return {[type]} [description]
       */
      saveFootTip () {
        if (this.errors.has('contactTelephone') || this.companyFoot.contactTelephone === '') {
          this.$message.error('联系电话格式不正确!')
        } else if (this.errors.has('contactEmail') || this.companyFoot.contactEmail === '') {
          this.$message.error('联系邮箱格式不正确!')
        } else if (this.companyFoot.address === '') {
          this.$message.error('公司地址不能为空!')
        }
      },
      /**
       * 保存页脚
       * @return {[type]} [description]
       */
      saveFoot () {
        // id  否 long  主键ID
        // shopId  是 string  店铺id
        // contactTelephone  是 string  联系电话
        // shopcontactEmailId  是 string  联系邮箱
        // address 是 string  联系地址
        // facebookUrl 是 string  facebook地址
        // twitterUrl  是 string  twitter地址
        // linkedinUrl 是 string  linkedin地址
        // descImgUrl  是 string  简介中配图的url
        // shopDesc  是 string  店铺简介
        let postObj = {
          id: this.companyFoot.id,
          shopId: this.companyFoot.shopId,
          contactTelephone: this.companyFoot.contactTelephone,
          contactEmail: this.companyFoot.contactEmail,
          address: this.companyFoot.address,
          facebookUrl: this.companyFoot.facebookUrl,
          twitterUrl: this.companyFoot.twitterUrl,
          linkedinUrl: this.companyFoot.linkedinUrl
        }
        if (this.companyFoot.facebookUrl && !(/^http*/g.test(this.companyFoot.facebookUrl))) {
          this.$message.error('Facebook地址不正确!')
          return
        }
        if (this.companyFoot.twitterUrl && !(/^http*/g.test(this.companyFoot.twitterUrl))) {
          this.$message.error('Twitter地址不正确!')
          return
        }
        if (this.companyFoot.linkedinUrl && !(/^http*/g.test(this.companyFoot.linkedinUrl))) {
          this.$message.error('LinkedIn地址不正确!')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        myWebSiteApi.saveFoot(postObj).then((res) => {
          if (!res.data.code) {
            window.editorApi.iframeLoad()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 三个广告位
       * @return {[type]} [description]
       */
      getAdvPosition () {
        myWebSiteApi.getAdvert({position: 'AD'}).then((res) => {
          if (!res.data.code) {
            // console.log(res.data.data)
            this.advPosition = res.data.data
            if (res.data.data === null || res.data.data.length === 0) {
              this.advPosition = [
              { shopId: this.shopId, picUrl: '', pircUrlWhole: '', linkUrl: '', linkTag: -1 },
              { shopId: this.shopId, picUrl: '', pircUrlWhole: '', linkUrl: '', linkTag: -1 },
              { shopId: this.shopId, picUrl: '', pircUrlWhole: '', linkUrl: '', linkTag: -1 }
              ]
            } else if (this.advPosition.length < 3) {
              let len = (3 - this.advPosition.length)
              for (let i = 0; i < len; i++) {
                this.advPosition.push({ shopId: this.shopId, picUrl: '', pircUrlWhole: '', linkUrl: '', linkTag: -1 })
              }
            }
            if (this.advPosition.length > 3) {
              this.$message.error('数据库广告位返回数量不能大于3个')
              return
            }
            /**
             * 初始化 advert 对象 ，用于实现页面逻辑
             * @param  {[type]} let advIndex      in this.advPosition [description]
             * @return {[type]}     [description]
             */
            for (let advIndex in this.advPosition) {
              this.advert[advIndex].value = '' + this.advPosition[advIndex].linkTag
              if (this.advPosition[advIndex].linkTag === 1) {
                this.advert[advIndex].selectedProductArray.push(this.advPosition[advIndex].linkUrl)
              } else {
                this.advert[advIndex].linkUrl = '' + (this.advPosition[advIndex].linkUrl || '')
              }
            }
          }
        })
      },
      /**
       * 保存logo
       * @return {[type]} [description]
       */
      saveLogo () {
        if (this.bannerUrl === '' || this.bannerUrl === null) {
          this.$message.error('背景图不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        myWebSiteApi.changeLogo({
          shopLogo: this.bannerUrl
        }).then(res2 => {
          if (res2.data.code === 1) {
            this.$message.error(res2.data.message)
          } else {
            window.editorApi.iframeLoad()
            this.$message.success(res2.data.message)
          }
        })
      },
      /**
       * 移除轮播图
       * @param img
       * @param i
       */
      removeImg (img, i) {
        this.$store.commit('SET_DIRTY', true)
        this.carousels.splice(i, 1)
        /**
         * 展现前一张
         */
        if (this.carousels.length === 0) {
          this.prevCarousel.index = -1
          this.prevCarousel.value = '' + 0
          this.prevCarousel.img.linkUrl = ''
        } else {
          this.showEditor(this.carousels[this.carousels.length - 1], (this.carousels.length - 1))
        }
      },
      /**
       * 显示轮播图片编辑
       * @param img
       */
      showEditor (img, index) {
        /**
         * 是点击轮播图后 进行切换type的
         * @type {Boolean}
         */
        this.jumpTypeChangeFlag = true
        this.prevCarousel.img = img
        this.prevCarousel.index = index
        this.prevCarousel.value = '' + img.linkTag
        if (img.linkTag === 1 && (img.linkUrl)) {
          let sArray = []
          sArray.push(img.linkUrl)
          this.selectedSearchProduct = sArray
        } else {
          this.selectedSearchProduct = []
        }
      },
      /**
       * 拿到产品
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
      getProductList (params) {
        myWebSiteApi.getProductList(params).then(res => {
          if (!res.data.code) {
            this.recordsCount = res.data.data.length
            this.productList = res.data.data
          }
        })
      },
      /**
       * 拿logo
       * @param  {[type]} shopId [description]
       * @return {[type]}        [description]
       */
      getLogo (shopId) {
        myWebSiteApi.getCompanyDetail().then((res) => {
          if (!res.data.code) {
            this.bannerSrc = res.data.data.shopLogoWhole
            this.bannerUrl = res.data.data.shopLogo
            this.companyFoot = res.data.data
            this.companyInfo = res.data.data
          }
        })
      },
      /**
       * 拿轮播图
       * @param  {[type]} params [description]
       * @return {[type]}        [description]
       */
      getCarousels (params) {
        myWebSiteApi.getAdvert(params).then((res) => {
          if (!res.data.code) {
            this.carousels = res.data.data
            if (this.carousels && this.carousels.length > 0) {
              this.showEditor(this.carousels[0], 0)
            } else {
              this.carousels = []
            }
          }
        })
      },
      /**
       * 保存公司描述
       * @return {[type]} [description]
       */
      saveAbout () {
        if (this.companyInfo.shopDesc === '' || this.companyInfo.shopDesc === null) {
          this.$message.error('简介不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        var postObj = {
          shopDesc: this.companyInfo.shopDesc,
          descImgUrl: this.companyInfo.descImgUrl,
          id: this.companyInfo.id
        }
        myWebSiteApi.saveFoot(postObj).then((res) => {
          if (!res.data.code) {
            window.editorApi.iframeLoad()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
       /**
       * 改logo
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      changeLogo (val) {
        this.$store.commit('SET_DIRTY', true)
        this.$store.commit('SET_DIRTY', true)
        this.bannerSrc = val.urlWhole
        this.bannerUrl = val.urlWhole
      },
      /**
       * 广告位上传图片
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      changeAdvPic (val, index) {
        this.$store.commit('SET_DIRTY', true)
        this.loadAdvertising.splice(index, 1, true)
        console.log(this.loadAdvertising)
        this.advPosition[index].pircUrlWhole = val.urlWhole
        this.advPosition[index].picUrl = val.urlWhole
        this.loadAdvertising.splice([index], 1, false)
      },
       /**
       * 上传 轮播图
       * @return {[type]} [description]
       */
      mainCarouselChange (val) {
        this.$store.commit('SET_DIRTY', true)
        this.carousels.push({pircUrlWhole: val.src, picUrl: val.src, shopId: this.shopId, linkTag: 0, linkUrl: ''})
        this.showEditor(this.carousels[this.carousels.length - 1], (this.carousels.length - 1))
        this.materialOptions.show = false
      },
      /**
       * 更换 轮播图
       * @return {[type]} [description]
       */
      changeCarousel (val) {
        this.$store.commit('SET_DIRTY', true)
        let preIndex = this.prevCarousel.index
        let preImg = this.prevCarousel.img
        this.carousels.splice(preIndex, 1, {pircUrlWhole: val.urlWhole, picUrl: val.urlWhole, shopId: this.shopId, linkTag: preImg.linkTag, linkUrl: preImg.linkUrl})
        this.prevCarousel.img.pircUrlWhole = val.urlWhole
        this.prevCarousel.img.picUrl = val.urlWhole
      },
      /**
       * 第一步上传照片
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      uploadAboutPic (val) {
        this.$store.commit('SET_DIRTY', true)
        this.companyInfo.descImgUrlWhole = val.urlWhole
        this.companyInfo.descImgUrl = val.urlWhole
      }
    }
  }
</script>
<style>
.product-select .el-select__tags .el-tag  .el-select__tags-text{
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 18px;
    height: 18px;
}

.product-select .el-select__tags .el-tag .el-tag__close{
    top:-4px;
  }
</style>
<style lang="less" rel="stylesheet/less">
.left-operation{
  .img-box{
    width: 422px;
    height: 122px;
  }
  .el-dialog__wrapper{
    .el-dialog--small{
      line-height: 21px;
      width: initial;
      .el-dialog__header{
        padding:14px 16px 13px 16px;
        .select-product-title {
          font-size: 14px;
        }
        .select-product-tip {
          color:#CCD6E2;
          font-size: 13px;
        }
      }
      .el-dialog__body{
        padding: 16px 40px 32px 40px;
        .el-table__header-wrapper{
          .is-leaf{
            background: #F5F8FA;
            padding: 11px 0;
            .cell{
              background: #F5F8FA;
              font-size: 13px;
              line-height: 22px;
            }
          }
        }
        .el-table__body-wrapper{
          .cell{
            .img-wrap{
              img{
                height:42px;
              }
            }
            .desc-middel{
              font-size: 13px;
              line-height: 21px;
              margin-left:78px;
              width: 200px;
              vertical-align: top;
              top: 50%;
              -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
              position: absolute;
              overflow: hidden;
              display: -webkit-box;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              /* autoprefixer: off*/
              -webkit-box-orient: vertical;
              /* autoprefixer: on*/
              -ms-box-orient: vertical;
              -webkit-line-clamp: 2;
              -moz-line-clamp: 2;
              -ms-line-clamp: 2;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  .margintop16{
    margin-top:16px;
  }
  .margintop8{
    margin-top:8px;
  }
  .draggable{
    display: inline;
  }
  .c-fc-red{
    color:#F86563;
  }
  .icon-edit-style{
    margin-right:5px;
  }
  .textarea-wraper{
    position: relative;
    .len-tip{
      color:#CCD6E2;
      position: absolute;
      bottom:16px;
      right:16px;
    }
  }
  .desc-input{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    overflow:hidden;
    margin-top:32px;
    margin-bottom:15px;
  .textaaarea{
    padding:23px 16px;
    width: 385px;
    height: 232px;
    font-size: 13px;
    color: #32475A;
    border:none;
  }
  p{
    font-size: 13px;
    color: #7C98B6;
    margin:8px 16px;
    float:right;
  }
  }
.grey-btn {
  background: #EAF0F6;
   color:#B0C1D4;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #DFE3EB;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-size: 14px;
    border-radius: 4px;
    width:100px;
    height: 34px;
    line-height: 34px;
}
  .address{
    width:100%;
     border-width: 1px;
    border-style: solid;
    border-color: rgb(203, 214, 227);
    outline:none;
    border-radius: 4px;
    height: 280px;
    padding:8px;
    box-sizing: border-box;
  }
  .address:focus {
    border: 1px solid #02AAAA;
    box-shadow: 1px 0 1px 0 #02AAAA;
  }

.el
  .left-operation .editor .avert-img .product-select .el-select {
    width: 300px;
  }
  .product-select{
    .el-select{
      width:300px;
    }
  }
  .option-tag{
      height: 35px;
      width:420px;
      &.selected.hover{
        background-color: #F5F8FA;;
      }
      &.hover{
        background-color: #F5F8FA;;
      }
      &.selected::after{
        bottom: 7px;
      }
      .recycle-box{
        img{
          width: 25px;
          height: 25px;
          margin-right: 16px;
          vertical-align: top;
        }
      }
    }
  .img-wrap{
    width:42px;
    height: 42px;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    img{
      width:100%;
    }
  }
  .none-data-tip{
      text-align: center;
      font-size: 12px;
      .tip1{
        color:#33475B;
        margin:15px auto 8px auto;
        font-size: 14px;
      }
      .tip2{
        color:#7D98B6;
      }
    }
    .table-temp{
      width:503px;
      margin:0 auto;
      .el-table__header-wrapper{
        height: 44px;
      }
      .el-table__header-wrapper thead div, .el-table th{
        background: #F5F8FA;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #F5F8FA;
      }
      .el-table{
        border: 1px solid #EAF0F6;
      }
      .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #EAF0F6;
      }
      .el-table th, .el-table td{
        height: 50px;
      }
      .el-table .cell {
        color:#33475B;
      }
      .choose-btn{
        display: inline-block;
        border:1px solid #CBD6E3;
        color:#4F6D95;
        width:80px;
        height: 32px;
        line-height: 32px;
        border-radius: 2px;
        text-align: center;
        margin:11px auto;
        cursor: pointer;
      }
    }
  .upload-carousel-input{
    position: absolute;
    display: block;
    width:87px;
    height: 87px;
    top:0;
    left:0;
    bottom:0;
    right: 0;
    opacity: 0;
    cursor: pointer;
  }
  .left-operation {
    float: left;
    width: 420px;
    padding: 16px 30px;
    background: @white;
    min-height: 760px;
    margin-right: 31px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    #editor-logo {
      display: block;
    }
    .editor {
      display: none;
      .companyDetail {
        margin-bottom: 30px;
        p {
          line-height: 18px;
          margin-bottom: 8px;
          font-size: 13px;
        }
      }
      .title {
        font-size: 18px;
        margin-bottom: 16px;
        line-height: 25px;
      }
      .logo-img:hover {
        .hidden-btn {
          cursor: pointer;
          display: block;
          z-index: 999;
        }
      }
      .carousel-img {
        width: 394px;
        margin-bottom: 16px;
        padding: 16px 16px 0 16px;
        background: #F4F8FB;
        border: 1px dashed #CAD6E2;
        i {
            cursor: pointer;
            position: absolute;
            top: -8px;
            right: 1px;
            font-size: 18px;
            opacity: 0.8;
          }
        .img {
          margin-bottom: 16px;
          display: inline-block;
          position: relative;
          width: 85px;
          height: 85px;
          overflow: hidden;
          border: 1px solid #CAD6E2;
          margin-right: 10px;
          vertical-align: top;
        }
        img {
          position: absolute;
          width: 85px;
          top:50%;
          transform:translateY(-50%)

        }
        .upload-carousel {
          color:#B0C1D3;
          margin-right: 7px;
          display: inline-block;
          border: 1px dashed #CAD6E2;
          height: 85px;
          width: 85px;
          text-align: center;
          position: relative;
          background: #fff;
          margin-bottom:16px;
          .content {
            position: absolute;
            top: 28px;
            left: 17px;
          }
        }
      }
      .avert-img {
        margin-bottom: 30px;
        .el-select {
          width: 420px;
        }
        .el-input {
          margin-top: 8px;
        }
      }
      .arrow-up {
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid #fff;
        position: absolute;
        margin-top: -30px;
        z-index: 99;
        left: 230px;
      }
      .logo-img {
        position: relative;
        width: 422px;
        height: 122px;
        background: url('../../../assets/img/mark.jpg');
        background-size: 8px 8px;
        overflow: hidden;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 100px;
        }
        .hidden-btn {
          display: none;
          position: absolute;
          bottom: 0;
          height: 40px;
          line-height: 40px;
          text-align: right;
          width: 100%;
          background-color: rgba(80, 109, 149, 0.60);
          color: @white;
          .file {
            width: 100%;
            height: 40px;
            line-height: 40px;
            opacity: 0;
          }
          p {
            position: absolute;
            top: 0;
            right: 0;
            margin-right: 15px;
          }
        }
      }
      .desc {
        color: #7C98B6;
        margin-bottom: 30px;
        line-height: 21px;
        font-size:13px;
      }
      .hidden-container {
        p {
          height: 18px;
          line-height: 18px;
          font-size: 13px;
          /*margin-top: 16px;*/
          margin-bottom: 8px;
        }
        .p-address{
          margin-top: 16px;
        }
        .linkUrl {
          margin-bottom: 20px;
        }
      }
      .el-textarea {
        margin-bottom: 15px;
      }
      .el-button {
        padding: 9px 35px;
      }
      .products {
        border: 1px solid #DFE3EB;
        width: 420px;
        margin-bottom: 30px;
        .product-title {
          background: #F5F8FA;
          padding: 11px 16px;
          line-height: 22px;
          font-size: 13px;
          span {
            float: right;
          }
        }
        li {
          border-top: 1px solid #DFE3EB;
          padding: 5px 20px;
          overflow: hidden;
          position: relative;
          img {
            width: 42px;
            height: 42px;
          }
          span.p-name {
            display: inline-block;
            width: 200px;
            vertical-align: top;
            margin-left: 50px;
            top: 50%;
            transform: translateY(-50%);
            position: absolute;
            /* autoprefixer: off*/
            -webkit-box-orient: vertical;
            /* autoprefixer: on*/
            -ms-box-orient: vertical;
            -webkit-line-clamp: 3;
            -moz-line-clamp: 3;
            -ms-line-clamp: 3;
            max-height: 37px;
            overflow: hidden;
            display: -webkit-box;
          }
          .opt{
            float: right;
            line-height: 40px;
            display: none;
            .icon-font{
              color:#CBD6E3;
              font-size: 18px;
              cursor: pointer;
            }
          }
          &:hover{
            .opt{
              display: block;
            }
          }
        }
      }
    }
  }
</style>
