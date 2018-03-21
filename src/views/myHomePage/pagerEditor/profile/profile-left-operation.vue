<template>
  <div class="left-product">
    <!--banner修改 start-->
    <div id="update-topBanner" class="editor">
      <p class="title">背景图设置</p>
      <imgUpload v-if="bannerSrc && !loadBannerImg" :defaultSrc="bannerSrc" @imgChange="bgChange"></imgUpload>
      <p class="desc">
        <!-- 宽度为1920像素，高度为300像素，JPG，PNG图片格式，2M以内为最佳显示效果 -->
        {{bgTip}}
      </p>
      <div class="fail" v-if="picUrl == 'error' && bannerErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>上传失败
        <p class="upload">{{ bannerErrorPrompt }}</p>
      </div>
      <div class="fail" v-if="picUrl != 'error' && bannerErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ bannerErrorPrompt }}</p>
      </div>
      <el-button type="primary" class="margintop32" @click="saveBannerFunc">保存</el-button>
    </div>
    <!--banner修改 end-->
    <!--公司简介修改 start-->
    <div id="update-desc" class="editor">
      <p class="title">公司描述</p>
      <imgUpload v-if="descImgUrl && !loadDescImg" :defaultSrc="descImgUrl" @imgChange="descChange"></imgUpload>
      <p class="desc">
        {{descTip}}
      </p>
      <div class="textarea-wraper margintop32">
        <textarea class="address" v-model="compDesc" id="txtContenta" rows="6" style="resize:none;" maxlength="1500" @change="setDirty"></textarea>
        <div v-if="compDesc.length" class="len-tip">{{compDesc.length}}/1500</div>
        <div v-else class="len-tip">0/1500</div>
      </div>
      <p class="desc margintop16">
        请简要描述您公司的核心优势，如：我们有20年的设计研发经验
      </p>
      <div class="fail" v-if="descPicUrl == 'error' && descErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>上传失败
        <p class="upload">{{ descErrorPrompt }}</p>
      </div>
      <div class="fail" v-if="descPicUrl != 'error' && descErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ descErrorPrompt }}</p>
      </div>
      <div class="bottom-btn" :class="{'is-ok': compDesc}">
      <el-button type="primary" class="margintop32" @click="updateDescFunc">保存</el-button>
      </div>
    </div>
    <!--公司简介修改 end-->
    <!--公司信息编辑 start-->
    <div id="update-business" class="editor">
      <p class="title">公司信息设置</p>
      <p class="label-title">注册时间</p>
      <div class="input-module">
        <el-date-picker
          v-model="registeredTime"
          type="date"
          placeholder="选择日期"
          :editable="false"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions0">
        </el-date-picker>
      </div>
      <p class="label-title">主要产品</p>
      <div class="textarea-wraper">
        <textarea class="address" v-model="topProducts" id="txtContenta" rows="6" style="resize:none;height:230px;" maxlength="500" placeholder="请输入公司主要产品"></textarea>
        <div v-if="topProducts" class="len-tip">{{topProducts.length}}/500</div>
        <div v-else class="len-tip">0/500</div>
      </div>
      <p class="label-title">注册资金</p>
      <div class="input-module input-desc-module">
        <input type="text" class="left-input" placeholder="请输入公司注册资金" v-model="registeredCapitalWanYuan" maxlength="6" />
        <span class="right-desc">百万元</span>
      </div>
      <p class="label-title">公司地址</p>
      <div class="textarea-wraper">
        <textarea class="address" v-model="businessAddress" id="txtContenta" rows="6" style="resize:none;height:120px;" maxlength="500" @change="setDirty"></textarea>
        <div v-if="businessAddress" class="len-tip">{{businessAddress.length}}/500</div>
        <div v-else class="len-tip">0/500</div>
      </div>
      <p class="label-title">经营模式</p>
      <div class="input-module">
        <el-select v-model="businessType" placeholder="请选择公司业务模式" style="width:100%" @visible-change="setDirty">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div>
      <p class="label-title">员工人数</p>
      <div class="input-module">
        <el-select v-model="totalEmployees" placeholder="请选择公司员工人数" style="width:100%" @visible-change="setDirty">
          <el-option
            v-for="smployeesNum in smployeesNums"
            :key="smployeesNum.value"
            :label="smployeesNum.label"
            :value="smployeesNum.value"
            :disabled="smployeesNum.disabled"
          >
          </el-option>
        </el-select>
      </div>
      <p class="label-title">生产值</p>
      <div class="input-module input-desc-module">
        <input type="text" class="left-input" placeholder="请输入公司生产值" v-model="annualOutputValueWanYuan" maxlength="6" @change="setDirty" />
        <span>百万元</span>
      </div>
      <p class="label-title">年出口额</p>
      <div class="input-module input-desc-module">
        <input type="text" class="left-input" placeholder="请输入公司年出口额" v-model="totalExportRevenueWanYuan" maxlength="6" @change="setDirty" />
        <span>百万元</span>
      </div>
      <p class="label-title">年出口比例</p>
      <div class="input-module input-desc-module">
        <input type="text" class="left-input" placeholder="请输入公司年出口比例" v-model="exportPercentage" maxlength="3" @change="setDirty" />
        <span>%</span>
      </div>
      <p class="label-title">主要市场</p>
      <div class="input-module">
        <input type="text" class="text-input" placeholder="请输入公司主要市场" v-model="topMarkets" maxlength="100" @change="setDirty" />
      </div>
      <p class="label-title">平均交货时间</p>
      <div class="input-module input-desc-module">
        <input type="text" maxlength="5" class="left-input" placeholder="请输入公司平均交货时间" v-model="averageLeadTime" @change="setDirty" />
        <span>天</span>
      </div>
      <p class="label-title">出口许可证编号</p>
      <div class="input-module">
        <input type="text" class="text-input" placeholder="请输入公司出口许可证编号" v-model="exportLicenseNo" maxlength="50" @change="setDirty" />
      </div>
      <p class="label-title">支持货币种类</p>
      <div class="input-module">
        <template>
          <el-checkbox-group
            v-model="acceptPaymentCurrency"
            :min="1" @change="setDirty">
            <el-checkbox v-for="currency in currencyList" :label="currency.code" :key="currency.code">{{ currency.name }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
      <p class="label-title">接受付款方式</p>
      <div class="input-module">
        <template>
          <el-checkbox-group
            v-model="acceptedPaymentType" @change="setDirty">
            <el-checkbox v-for="pay in payList" :label="pay.id" :key="pay.id">{{ pay.name }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
      <div class="fail" v-if="companyInfoErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ companyInfoErrorPrompt }}</p>
      </div>
      <el-button type="primary" class="margintop32" @click="updateInfoFunc">保存</el-button>
    </div>
    <!--公司信息编辑 end-->
    <!--公司资质编辑列表 start-->
    <div id="update-cert" class="editor">
      <p class="title">证书/商标/其他资质</p>
      <div class="cert-model">
        <div class="second-title">名称<i class="icon-addthin cert-add" @click="addCertPop" v-if="certList.length < 20"></i></div>
        <ul class="cert-list" v-if="certList.length > 0">
          <draggable v-model="certList">
            <transition-group>
              <li v-for="(cert,index) in certList" :key="index" class="cert">
                <img :src="cert.urlWhole" class="cert-image" />
                <span class="name" :title="cert.name">{{cert.name | subString20}}</span>
                <span class="operation">
                   <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                     <a href="javascript:;" @click.stop="updateCertPop(cert,index)"><i class="icon-pen"></i></a>
                   </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                    <a href="javascript:;" @click.stop="selectCertPop(cert.urlWhole)"><i class="icon-search" style="font-size:21px;"></i></a>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <a href="javascript:;" @click.stop="removePop('cert',index)"><i class="icon-trash"></i></a>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="调整顺序" placement="top-start">
                    <a href="javascript:;"><i class="icon-adjust"></i></a>
                  </el-tooltip>
                </span>
              </li>
            </transition-group>
          </draggable>
        </ul>
        <div v-else class="no-data"><p class="desc">暂无资质</p></div>
      </div>
      <div class="fail" v-if="saveCertErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ saveCertErrorPrompt }}</p>
      </div>
      <el-button type="primary" class="margintop32" @click="saveCertListFunc">保存</el-button>
    </div>
    <!--公司资质编辑列表 end-->
    <!--下载管理 start-->
    <div id="update-file" class="editor">
      <p class="title">下载文件管理</p>
      <div class="cert-model">
        <div class="second-title">名称<i class="icon-addthin cert-add" @click="addDownLoadPopFunc()" v-if="fileList.length < 10"></i></div>
        <ul class="cert-list" v-if="fileList.length > 0">
          <li v-for="(file,index) in fileList" class="cert">
            <a :href="file.attachUrlWhole" :download="file.fileName">
            <i v-if="file.attachType == 'zip' || file.attachType == 'rar'" class="icon-compress cart-logo compress"></i>
            <i v-else-if="file.attachType == 'xls' || file.attachType == 'xlsx'" class="icon-shape cart-logo shape"></i>
            <i v-else-if="file.attachType == 'pdf'" class="icon-pdf cart-logo pdf"></i>
            <i v-else-if="file.attachType == 'ppt' || file.attachType == 'pptx'" class="icon-ppt cart-logo ppt"></i>
            <i v-else-if="file.attachType == 'doc' || file.attachType == 'docx'" class="icon-word cart-logo word"></i>
            <i v-else class="icon-weizhi cart-logo weizhi"></i>
            <span class="name" :title="file.fileName">{{ file.fileName | subString20}}</span>
            <span class="operation">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <a href="javascript:;" @click="removePop('dowload',index)"><i class="icon-trash"></i></a>
              </el-tooltip>
            </span>
            </a>
          </li>
        </ul>
        <div v-else class="no-data"><p class="desc">暂无下载文件</p></div>
      </div>
      <div class="bottom-prompt">请上传zip.rar,doc,docx,xls,xlsx,ppt,pptx,pdf格式的文件，大小不可超过10M</div>
      <div class="fail" v-if="saveFileErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ saveFileErrorPrompt }}</p>
      </div>
      <el-button type="primary" class="margintop32" @click="saveFileListFunc">保存</el-button>
    </div>
    <!--下载管理 end-->
    <!--资质信息修改弹框start-->
    <el-dialog title="资质信息" size="390px" v-model="editCertPop" custom-class="edit-pop">
      <div class="label-title">资质类型*</div>
      <template>
        <el-radio-group v-model="certType">
          <el-radio :label="1">商标</el-radio>
          <el-radio :label="2">专利</el-radio>
          <el-radio :label="3">进出口许可证</el-radio>
          <el-radio :label="4">其他资质</el-radio>
        </el-radio-group>
      </template>
      <div class="label-title">资质名称（英文）*</div>
      <div class="input-display">
        <input type="text" placeholder="请输入资质名称" v-model="certNameEn" maxlength="50" @change="setDirty" />
        <span v-if="certNameEn" class="display">{{ certNameEn.length }}/50</span>
        <span v-else class="display">0/50</span>
      </div>
      <div class="label-title">资质名称（中文）*</div>
      <div class="input-display">
        <input type="text" placeholder="请输入资质名称" v-model="certName" maxlength="50" @change="setDirty" />
        <span v-if="certName" class="display">{{ certName.length }}/50</span>
        <span v-else class="display">0/50</span>
      </div>
      <div class="label-title">资质编号*</div>
      <div class="input-display">
        <input type="text" placeholder="请输入资质编号" v-model="certCode" maxlength="50" @change="setDirty" />
        <span v-if="certCode" class="display">{{ certCode.length }}/50</span>
        <span v-else class="display">0/50</span>
      </div>
      <div class="label-title">资质证书图片*</div>
      <div class="upload">
        <div class="img-box">
          <img :src="imgWhole ? imgWhole : null" alt="" class="preview-img">
          <div class="change-img" @click="materialOptions.show = true">
            <span class="icon-font">&#xe68a;</span>
            更换
          </div>
        </div>
      </div>
      <div class="prompt">{{trademark}}</div>
      <div class="fail" v-if="imgUrl == 'error' && imgErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>上传失败
        <p class="upload">{{ imgErrorPrompt }}</p>
      </div>
      <div class="fail" v-if="imgUrl != 'error' && imgErrorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ imgErrorPrompt }}</p>
      </div>
      <div slot="footer" class="dialog-footer left-btn" :class="{'is-ok': certNameEn&&certName&&certCode&&certType&&imgWhole}">
        <el-button type="primary" @click="saveCertFunc()">保存</el-button>
        <el-button @click="editCertPop = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--资质信息修改弹框end-->
    <!--查看资质详情弹框start-->
    <el-dialog size="390px" custom-class="select-Info" v-model="selectInfoIsShow">
      <div class="confirm-prompt">
        <img :src="this.selectImageUrl" alt="" />
      </div>
    </el-dialog>
    <!--查看资质详情弹框end-->
    <!--删除确认弹框start (不需要使用了 直接使用了子组件dialogBox)-->
    <el-dialog size="390px" custom-class="remove-confirm" v-model="removePopIsShow">
      <div class="confirm-prompt">
        <div class="desc" v-if="removetype == 'cert'">
          <i class="icon-prompt prompt-logo"></i>
          <p class="desc-first">您即将删除资质文件,删除后将会</p>
          <p class="desc-second">无法在公司信息中展示该资质</p>
        </div>
        <div class="desc" v-else>
          <i class="icon-prompt prompt-logo"></i>
          <p class="desc-first">您即将下载文件,删除后将会</p>
          <p class="desc-second">无法在公司信息中展示该下载内容</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer center-btn red-btn">
        <el-button type="primary" @click="removeData()">确定</el-button>
        <el-button @click="removePopIsShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--删除确认弹框end (不需要使用了 直接使用了子组件dialogBox)-->
    <!--下载列表新增弹框start-->
    <el-dialog title="上传文件" size="390px" v-model="addDownLoadPop" custom-class="edit-pop">
      <div class="label-title">文件名称*</div>
      <div class="input-display">
        <input type="text" placeholder="请输入文件名称" v-model="fileName" maxlength="50" @change="setDirty" />
        <span class="display" v-if="fileName">{{ fileName.length }}/50</span>
        <span class="display" v-else>0/50</span>
      </div>
      <div class="label-title">附件上传*</div>
      <el-upload
        class="upload-demo"
        :action="imgDomain+'/bshop/config/file/upload'"
        name="file"
        :on-remove="handleRemove"
        :file-list="uploadList"
        :on-success="fileSuccess"
        :before-upload="beforeFileUpload">
        <el-button size="small" type="primary" style="margin-top:0;">点击上传</el-button>
      </el-upload>
      <div class="prompt">请上传zip.rar,doc,docx,xls,xlsx,ppt,pptx,pdf格式的文件，大小不可超过10M</div>
      <div class="fail" v-if="uploadList.length == 0 && errorPrompt != ''">
        <i class="icon-font fail-icon"></i>上传失败
        <p class="upload">{{ errorPrompt }}</p>
      </div>
      <div class="fail" v-if="uploadList.length != 0 && errorPrompt != ''">
        <i class="icon-font fail-icon"></i>保存失败
        <p class="upload">{{ errorPrompt }}</p>
      </div>
      <div slot="footer" class="dialog-footer left-btn" :class="{'is-ok': fileName && uploadList.length > 0}">
        <el-button type="primary" @click="saveFileFunc()">保存</el-button>
        <el-button @click="addDownLoadPop = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--下载列表新增弹框end-->
    <DialogBox :config="oconfig" @sure="removeData"></DialogBox>
    <uploadMaterial
    :options="materialOptions"
    @confirmInsert="confirmInsert"
    @cancelInsert="materialOptions.show=false"></uploadMaterial>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import myWebSiteApi from '../../../../../src/api/myWebSiteApi'
  import websiteStyleAPI from '@/api/websiteStyleAPI'
  import DialogBox from '../../../../components/box/dialogBox'
  import imgUpload from '../../../../components/imgUpload'
  import uploadMaterial from '../../../../components/uploadMaterial'
  export default{
    data () {
      return {
        pickerOptions0: {
          disabledDate (time) {
            // let date = new Date(time)
            // let year = date.getFullYear()
            return false
          }
        },
        /**
         * 面料、辅料、皮革模板:15
          product:1920*250
          436*480
          五金工具:11
          product:1920*250
          477*276
          电子灯具模板:16
          product:1920*400
          436*480
          医疗模板:13
          product:1920*300
          1620*400
          汽车用品模板:19
          product:1920*250
          580*600
          户外运动：1
         * @type {Object}
         */
        bgTipArray: {
          '15': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为450像素，高度为290像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '11': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为410像素，高度为270像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '16': {
            'tip': '宽度为1920像素，高度为400像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为450像素，高度为290像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '13': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为1920像素，高度为400像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '19': {
            'tip': '宽度为1920像素，高度为250像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为830像素，高度为540像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '1': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为940像素，高度为470像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为370像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '12': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为360像素，高度为360像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '14': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为500像素，高度为350像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '17': {
            'tip': '宽度为1920像素，高度为400像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为440像素，高度为480像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '18': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为550像素，高度为550像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '20': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为550像素，高度为455像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          },
          '21': {
            'tip': '宽度为1920像素，高度为300像素，JPG、PNG图片格式，2M以内为最佳显示效果',
            'descTip': '宽度为360像素，高度为360像素，JPG，PNG图片格式，2M以内为最佳显示效果',
            'trademark': '宽度为250像素，高度为327像素，JPG,PNG图片，2M以内为最佳显示效果'
          }
        },
        bgTip: '',
        descTip: '',
        trademark: '',
        bannerSrc: '',  // 有域名背景图片地址
        picUrl: '', // 无域名背景图片地址
        bannerErrorPrompt: '', // 背景图错误提示
        imgWhole: '',   // 资质弹框图片有域名
        imgUrl: '',     // 资质弹框图片无域名
        imgErrorPrompt: '', // 上传图片错误提示
        descImgUrl: '',  // 公司简介有域名图片
        descPicUrl: '', // 公司简介无域名图片
        descErrorPrompt: '', // 描述图错误提示
        shopId: window.localStorage.shopId,
        advertSysId: -1,
        details: [],
        display: false,
        displayOrder: 0,
        compDesc: '',  // 企业描述
        registeredTime: '', // 注册时间
        topProducts: '', // 主要产品
        annualOutputValueWanYuan: '0', // 年生产值
        averageLeadTime: '', // 平均交货期
        businessType: '', // 经营模式
        exportLicenseNo: '', // 出口许可证编号
        exportPercentage: '', // 年出口比例
        registeredCapitalWanYuan: '0', // 注册资金
        acceptPaymentCurrency: [],  // 接受支付货币
        topMarkets: '', // 主要市场
        totalEmployees: '', // 员工数量
        companyInfoErrorPrompt: '', // 公司信息提交错误提示
        smployeesNums: [
          {
            value: '1～5',
            label: '1～5'
          }, {
            value: '6～10',
            label: '6～10'
          }, {
            value: '11～50',
            label: '11～50'
          }, {
            value: '51～100',
            label: '51～100'
          }, {
            value: '101～200',
            label: '101～200'
          }, {
            value: '201～300',
            label: '201～300'
          }, {
            value: '301～500',
            label: '301～500'
          }, {
            value: '501～1000',
            label: '501～1000'
          }, {
            value: '1000+',
            label: '1000+'
          }
        ],
        totalExportRevenueWanYuan: '0', // 年出口额
        businessAddress: '', // 业务地址
        acceptedPaymentType: [], // 可接受付款方式
        currencyList: [], // 币种列表
        payList: [], // 支付列表
        certList: [],    // 资质列表
        updateCert: {}, // 修改资质
        saveCertErrorPrompt: '', // 保存资质错误错误提示
        saveFileErrorPrompt: '', // 保存下载列表错误提示
        fileList: [], // 下载文件列表
        options2: [
          {
            value: '0',
            label: '生产厂家'
          }, {
            value: '1',
            label: '经销批发'
          }, {
            value: '2',
            label: '招商代理'
          }, {
            value: '3',
            label: '商业服务'
          }, {
            value: '4',
            label: '其他'
          }
        ],
        imageUrl: '', // 证书图片
        editCertPop: false,  // 编辑资质弹框
        certId: '', // 资质id
        certCode: '', // 资质编号
        certType: '',       // 资质类型
        certNameEn: '', // 资质英文名称
        certName: '',   // 资质中文名称
        removetype: '',   // 删除类型
        removePopIsShow: false,  // 删除弹框是否展示
        selectInfoIsShow: false, // 查看详情弹框是否展示
        selectImageUrl: '', // 查看详情图片地址
        errorPrompt: '', // 错误提示
        operatingIndex: '', // 操作记录索引
        addDownLoadPop: false, // 添加下载列表弹框
        uploadList: [],
        fileName: '',  // 文件名称
        domain: process.env.DOMAIN,
        imgDomain: process.env.IMG_DOMAIN,
        loadBannerImg: false,  // 是否上传banner图
        loadDescImg: false,   // 是否上传简介图
        loadImgLoad: false,  // 是否上传资质图片
        oconfig: {
          visible: false,
          notice: '',
          sureText: '确定',
          cancelText: '取消',
          callback: null,
          flag: 0
        },
        materialOptions: {
          multiple: false,
          size: 20,
          type: 'img',
          show: false
        }
      }
    },
    mounted () {
      this.getTempCode()
      // 查看公司页面详情
      myWebSiteApi.findCompanyPage().then(res => {
        if (res.data.code === 0) {
          this.bannerSrc = res.data.data.compBackgroundWhole
          this.picUrl = res.data.data.compBackground
          this.descImgUrl = res.data.data.compDescImgWhole
          this.descPicUrl = res.data.data.compDescImg
          this.compDesc = res.data.data.compDesc
        }
      })
      // 企业信息
      myWebSiteApi.companydetail({shopId: this.shopId}).then(res => {
        if (res.data.code === 0) {
          let companyBusiness = res.data.data
          let companyId = companyBusiness.companyId
          localStorage.setItem('companyId', companyId)
          if (companyBusiness.registeredTime !== '' && companyBusiness.registeredTime !== null) {
            let newDate = new Date()
            newDate.setTime(companyBusiness.registeredTime)
            this.registeredTime = newDate.toString()
          }
          this.topProducts = companyBusiness.topProducts
          if (companyBusiness.registeredCapital !== '' && companyBusiness.registeredCapital !== null && companyBusiness.registeredCapital !== 0) {
            this.registeredCapitalWanYuan = companyBusiness.registeredCapital / 1000000
          } else {
            this.registeredCapitalWanYuan = ''
          }
          this.businessType = companyBusiness.businessType
          this.businessAddress = companyBusiness.businessAddress
          this.totalEmployees = companyBusiness.totalEmployees
          if (companyBusiness.annualOutputValue !== '' && companyBusiness.annualOutputValue !== null && companyBusiness.annualOutputValue !== 0) {
            this.annualOutputValueWanYuan = companyBusiness.annualOutputValue / 1000000
          } else {
            this.annualOutputValueWanYuan = ''
          }
          if (companyBusiness.totalExportRevenue !== '' && companyBusiness.totalExportRevenue !== null && companyBusiness.totalExportRevenue !== 0) {
            this.totalExportRevenueWanYuan = companyBusiness.totalExportRevenue / 1000000
          } else {
            this.totalExportRevenueWanYuan = ''
          }
        // 年出口比例
          if (companyBusiness.exportPercentage !== '' && companyBusiness.exportPercentage !== null && companyBusiness.exportPercentage !== '0') {
            this.exportPercentage = companyBusiness.exportPercentage
          } else {
            this.exportPercentage = ''
          }
          this.topMarkets = companyBusiness.topMarkets
          // 评价交货时间
          if (companyBusiness.averageLeadTime !== '' && companyBusiness.averageLeadTime !== null && companyBusiness.averageLeadTime !== '0') {
            this.averageLeadTime = companyBusiness.averageLeadTime
          } else {
            this.averageLeadTime = ''
          }
          this.exportLicenseNo = companyBusiness.exportLicenseNo
          // 接受支付货币
          if (companyBusiness.acceptPaymentCurrency) {
            this.acceptPaymentCurrency = companyBusiness.acceptPaymentCurrency.split(',')
          } else {
            this.acceptPaymentCurrency = []
          }
          // 可接受付款方式
          if (companyBusiness.acceptedPaymentType) {
            this.acceptedPaymentType = companyBusiness.acceptedPaymentType.split(',')
          } else {
            this.acceptedPaymentType = []
          }
        }
      })
      // 获取资质列表
      this.getCertListFunc()
      // 获取币种列表
      myWebSiteApi.getCurrencyList().then(res => {
        if (res.data.code === 0) {
          this.currencyList = res.data.data
        }
      })
      // 获取支付列表
      myWebSiteApi.getPayList().then(res => {
        if (res.data.code === 0) {
          this.payList = res.data.data
        }
      })
      // 获取下载列表
      this.getFileListFunc()
    },
    components: {
      draggable,
      DialogBox,
      imgUpload,
      uploadMaterial
    },
    filters: {
      subString20: function (value) {
        let str = value
        if (value.length > 18) {
          str = value.substring(0, 20) + '...'
        }
        return str
      }
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
                console.log('templ.templateCode:' + templ.templateCode)
                this.bgTip = this.bgTipArray[parseInt(templ.templateCode)].tip
                this.descTip = this.bgTipArray[parseInt(templ.templateCode)].descTip
                this.trademark = this.bgTipArray[parseInt(templ.templateCode)].trademark
              }
            }
          }
        })
      },
      setDirty () {
        this.$store.commit('SET_DIRTY', true)
      },
      // 背景图上传
      bgChange (val) {
        this.$store.commit('SET_DIRTY', true)
        this.bannerSrc = val.urlWhole
        this.picUrl = val.urlWhole
      },
      // 背景图上传前验证
      beforeAvatarUpload (file) {
        console.log(file.type)
        this.loadBannerImg = true
        const isJPG = file.type
        const isLt10M = file.size / 1024 / 1024 < 10
        if (isJPG !== 'image/jpeg' && isJPG !== 'image/png') {
          // this.bannerErrorPrompt = '上传背景图片只能是JPG或PNG格式!'
          // this.loadBannerImg = false
          this.$message.error('上传背景图片只能是JPG或PNG格式!')
          this.loadBannerImg = false
          return false
        }
        if (!isLt10M) {
          // this.bannerErrorPrompt = '上传背景图片大小不能超过 2MB!'
          // this.loadBannerImg = false
          this.$message.error('上传背景图片大小不能超过 10MB!')
          this.loadBannerImg = false
          return false
        }
        if (!isJPG || !isLt10M) {
          this.picUrl = 'error'
          this.bannerSrc = ''
        }
        return isJPG && isLt10M
      },
      // 描述图上传
      descChange (val) {
        this.$store.commit('SET_DIRTY', true)
        this.descImgUrl = val.urlWhole
        this.descPicUrl = val.urlWhole
      },
      confirmInsert (file) {
        console.log(file)
        this.$store.commit('SET_DIRTY', true)
        this.imgWhole = file.src
        this.imgUrl = file.url
        this.loadImgLoad = false
        this.materialOptions.show = false
      },
      beforeImgUpload (file) {
        this.loadImgLoad = true
        const isJPG = file.type
        const isLt10M = file.size / 1024 / 1024 < 10
        if (isJPG !== 'image/jpeg' && isJPG !== 'image/png') {
          // this.imgErrorPrompt = '上传图片只能是JPG或PNG格式!'
          // this.loadImgLoad = false
          this.$message.error('上传图片只能是JPG或PNG格式!')
          this.loadImgLoad = false
          return false
        }
        if (!isLt10M) {
          // this.imgErrorPrompt = '上传图片大小不能超过 2MB!'
          // this.loadImgLoad = false
          this.$message.error('上传图片大小不能超过 10MB!')
          this.loadImgLoad = false
          return false
        }
        if (!isJPG || !isLt10M) {
          this.imgUrl = 'error'
          this.imgWhole = ''
        }
        return isJPG && isLt10M
      },
      // 上传成功 callback
      fileSuccess (res) {
        if (res.code === 0) {
          this.$store.commit('SET_DIRTY', true)
          this.uploadList.push(res.data)
        } else {
          this.errorPrompt = res.message
          window.setTimeout(() => { this.errorPrompt = '' }, 3000)
        }
      },
      // 删除上传
      handleRemove (file, uploadList) {
        console.log(file, uploadList)
        this.uploadList = []
      },
      // 上传前验证
      beforeFileUpload (file) {
        if (this.uploadList.length === 0) {
          let filename = file.name
          let size = file.size / 1024 / 1024
          if (filename.lastIndexOf('.') > 0) {
            let filehz = filename.substring(filename.lastIndexOf('.'))
            if (filehz === '.rar' || filehz === '.zip' || filehz === '.doc' || filehz === '.docx' || filehz === '.xls' || filehz === '.xlsx' || filehz === '.ppt' || filehz === '.pptx' || filehz === '.pdf') {
              if (size < 10) {
                return true
              } else {
                this.errorPrompt = '上传文件不能超过10M'
                // this.$message.error('上传文件不能超过5M')
                window.setTimeout(() => { this.errorPrompt = '' }, 3000)
                return false
              }
            } else {
              this.errorPrompt = '上传失败，请上传zip.rar,doc,xls,ppt,pdf格式的文件'
              window.setTimeout(() => { this.errorPrompt = '' }, 3000)
              return false
            }
          } else {
            return true
          }
        } else {
          this.errorPrompt = '新增只能上传一个'
          window.setTimeout(() => { this.errorPrompt = '' }, 3000)
          this.$message.error('新增只能上传一个')
          return false
        }
      },
      selectCertPop (imgurl) {
        this.selectInfoIsShow = true
        this.selectImageUrl = imgurl
      },
      // 获取资质列表方法
      getCertListFunc () {
        myWebSiteApi.getCertList().then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data)
            this.certList = res.data.data
          }
        })
      },
      // 获取下载列表列表方法
      getFileListFunc () {
        myWebSiteApi.getFileList({page: 1, size: 10}).then(res => {
          if (res.data.code === 0) {
            this.fileList = res.data.data
          }
        })
      },
      // 上传图片(暂时不需要，改为element插件)
      changeBanner (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        let formData = new FormData()
        formData.append('picDir', 'shop')
        formData.append('picture', files[0])
        myWebSiteApi.uploadLogo(formData).then(res => {
          if (!res.data.code) {
            this.bannerSrc = res.data.data.urlWhole     // 图片地址 有域名
            this.advertSysId = 1
            this.picUrl = res.data.data.url           // 图片地址  无域名
            console.log(this.bannerSrc)
            console.log(this.picUrl)
          } else {
            this.picUrl = 'error'
            this.bannerSrc = ''
            this.errorPrompt = res.data.message
          }
          window.setTimeout(() => { this.errorPrompt = '' }, 3000)
        })
      },
      // 删除确认弹框
      removePop (type, index) {
        this.removetype = type
        // this.removePopIsShow = true
        this.operatingIndex = index
        let removedesc = ''
        if (type === 'cert') {  // 资质列表删除
          removedesc = '您即将删除资质文件，删除后将会'
        } else {  // 下载列表删除
          removedesc = '您即将删除下载文件，删除后将会'
        }
        Object.assign(this.oconfig, {visible: true, theme: 'red', notice: removedesc, message: '无法在公司信息中展示该资质'})
      },
      // 资质或者下载列表删除数据
      removeData () {
        if (this.removetype === 'cert') {   //  资质数据删除
          this.certList.splice(this.operatingIndex, 1)
        } else if (this.removetype === 'dowload') {   // 下载数据删除
          this.fileList.splice(this.operatingIndex, 1)
        }
        this.removePopIsShow = false
      },
      // 背景图修改保存
      saveBannerFunc () {
        if (this.picUrl === '' || this.picUrl === null || this.picUrl === undefined) {
          this.bannerErrorPrompt = '背景图不能为空'
          return
        }
        let params = {
          background: this.picUrl
        }
        this.$store.commit('SET_DIRTY', true)
        myWebSiteApi.companyBanner(params).then(res => {
          this.bannerErrorPrompt = ''
          this.requestPrompt(res, 'banner', '编辑背景图成功')
        })
      },
      // 修改资质弹框
      updateCertPop (cert, index) {
        this.updateCert = cert
        this.certId = cert.id
        this.certCode = cert.code
        this.certType = cert.type
        this.certNameEn = cert.nameEn
        this.certName = cert.name
        this.imgWhole = cert.urlWhole
        this.imgUrl = cert.url
        this.editCertPop = true
        this.errorPrompt = ''
        this.operatingIndex = index
      },
      // 添加资弹框
      addCertPop () {
        this.updateCert = ''
        this.certId = ''
        this.certCode = ''
        this.certType = ''
        this.certNameEn = ''
        this.certName = ''
        this.imgWhole = ''
        this.imgUrl = ''
        this.editCertPop = true
        this.errorPrompt = ''
      },
      // 资质列表变更数据保存
      saveCertListFunc () {
        this.$store.commit('SET_DIRTY', true)
        let certStrs = JSON.stringify(this.certList)
        let params = {
          detailStr: certStrs
        }
        myWebSiteApi.saveCertOrder(params).then(res => {
          if (res.data.code === 0) {
            window.editorApi.iframeLoad()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.saveCertErrorPrompt = res.data.message
          }
        })
      },
      // 下载列表变更保存
      saveFileListFunc () {
        this.$store.commit('SET_DIRTY', true)
        let filedata = JSON.stringify(this.fileList)
        let params = {
          details: filedata
        }
        myWebSiteApi.saveFileList(params).then(res => {
          if (res.data.code === 0) {
            window.editorApi.iframeLoad()
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.saveFileErrorPrompt = res.data.message
          }
        })
      },
      // 添加或修改资质
      saveCertFunc () {
        console.log(this.certType)
        this.imgErrorPrompt = ''
        if (this.certType === '' || this.certType === null) {
          console.log('资质类型不能为空')
          return
        }
        if (this.certName.replace(/\s+/g, '').length === 0) {
          // this.imgErrorPrompt = '资质中文名称不能为空'
          console.log('资质中文名称不能为空')
          return
        }
        if (this.certNameEn.replace(/\s+/g, '').length === 0) {
          // this.imgErrorPrompt = '资质英文名称不能为空'
          console.log('资质英文名称不能为空')
          return
        }
        if (this.certCode.replace(/\s+/g, '').length === 0) {
          // this.imgErrorPrompt = '资质编号不能为空'
          console.log('资质编号不能为空')
          return
        }
        if (this.imgUrl === '' || this.imgUrl === null) {
          // this.imgErrorPrompt = '资质证书图片不能为空'
          console.log('资质证书图片不能为空')
          return
        }
        this.$store.commit('SET_DIRTY', true)
        let senddata = {
          code: this.certCode,
          companyId: window.localStorage.companyId,
          name: this.certName,
          nameEn: this.certNameEn,
          type: this.certType,
          url: this.imgUrl,
          urlWhole: this.imgWhole
        }
        if (this.certId !== '') {   // 修改
          senddata.id = this.certId
          this.certList.splice(this.operatingIndex, 1, senddata)
        } else {    // 添加
          this.certList.push(senddata)
        }
        this.editCertPop = false
        console.log(this.certList)
      },
      // 公司编辑
      updateInfoFunc () {
        if (this.businessAddress === '' || this.businessAddress === null) {
          this.businessAddress = ''
        }
        if (this.exportLicenseNo === '' || this.exportLicenseNo === null) {
          this.exportLicenseNo = ''
        }
        if (this.exportPercentage === '' || this.exportPercentage === null) {
          this.exportPercentage = ''
        }
        // 主页市场
        if (this.topMarkets === '' || this.topMarkets === null) {
          this.topMarkets = ''
        }
        // 主要商品
        if (this.topProducts === '' || this.topProducts === null) {
          this.topProducts = ''
        }
        // 员工数量
        if (this.totalEmployees === '' || this.totalEmployees === null) {
          this.totalEmployees = ''
        }
        // 年产值
        let aOVWY
        if (this.annualOutputValueWanYuan === '' || this.annualOutputValueWanYuan === null || this.annualOutputValueWanYuan === undefined) {
          aOVWY = 0
        } else {
          console.log('111:' + this.annualOutputValueWanYuan)
          if (isNaN(this.annualOutputValueWanYuan)) {
            this.companyInfoErrorPrompt = '年生产值必须为数字'
            return
          } else {
            aOVWY = parseFloat(this.annualOutputValueWanYuan)
            if (aOVWY > 999999) {
              this.companyInfoErrorPrompt = '年生产值只能是1～999999'
              return
            }
          }
        }
        // 平均交货时间
        if (this.averageLeadTime === '' || this.averageLeadTime === null || this.averageLeadTime === undefined) {
          this.averageLeadTime = '0'
        } else {
          if (isNaN(this.averageLeadTime)) {
            this.companyInfoErrorPrompt = '平均交货时间必须为数字'
            return
          }
        }
        // 注册资金
        let rCWY
        if (this.registeredCapitalWanYuan === '' || this.registeredCapitalWanYuan === null || this.registeredCapitalWanYuan === undefined) {
          rCWY = 0
        } else {
          if (isNaN(this.registeredCapitalWanYuan)) {
            this.companyInfoErrorPrompt = '注册资金必须为数字'
            return
          } else {
            rCWY = parseFloat(this.registeredCapitalWanYuan)
            if (rCWY > 999999) {
              this.companyInfoErrorPrompt = '注册资金只能是1～999999'
              return
            }
          }
        }
        // 年出口额
        let tERWY
        if (this.totalExportRevenueWanYuan === '' || this.totalExportRevenueWanYuan === null || this.totalExportRevenueWanYuan === undefined) {
          tERWY = 0
        } else {
          if (isNaN(this.totalExportRevenueWanYuan)) {
            this.companyInfoErrorPrompt = '年出口额必须为数字'
            return
          } else {
            tERWY = parseFloat(this.totalExportRevenueWanYuan)
            if (tERWY > 999999) {
              this.companyInfoErrorPrompt = '年出口额只能是1～999999'
              return
            }
          }
        }
        // 年出口比例
        if (this.exportPercentage === '' || this.exportPercentage === null || this.exportPercentage === undefined) {
          this.exportPercentage = 0
        } else {
          if (isNaN(this.exportPercentage)) {
            this.companyInfoErrorPrompt = '年出口比例为数字'
            return
          } else {
            this.exportPercentage = parseFloat(this.exportPercentage)
            if (this.exportPercentage > 100) {
              this.companyInfoErrorPrompt = '年出口比例只能是1～100'
              return
            }
          }
        }
        // 可接受付款方式
        let acceptedPT
        if (this.acceptedPaymentType.length > 0) {
          acceptedPT = this.acceptedPaymentType.join(',')
        } else {
          acceptedPT = ''
        }
        // 接受支付货币
        let acceptedPC
        if (this.acceptPaymentCurrency.length > 0) {
          acceptedPC = this.acceptPaymentCurrency.join(',') + ''
        } else {
          acceptedPC = ''
        }
        // 创建时间
        let time
        if (this.registeredTime !== '' && this.registeredTime != null) {
          // time = Date.parse(this.registeredTime)
          let t = new Date(this.registeredTime)
          let year = t.getFullYear()
          let Month = t.getMonth() + 1
          let date = t.getDate()
          let hour = t.getHours()
          let minutes = t.getMinutes()
          let seconds = t.getSeconds()
          time = year + '-' + Month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds
        }
        if (this.averageLeadTime === '' || this.averageLeadTime === null || this.averageLeadTime === 'null' || isNaN(this.averageLeadTime)) {
          this.averageLeadTime = 0
        } else {
          this.averageLeadTime = parseInt(this.averageLeadTime)
        }
        let companyId = localStorage.getItem('companyId')
        let params = {
          acceptedPaymentType: acceptedPT,
          annualOutputValue: aOVWY * 1000000,
          annualOutputValueWanYuan: aOVWY,
          averageLeadTime: this.averageLeadTime,
          businessType: this.businessType,
          exportLicenseNo: this.exportLicenseNo,
          exportPercentage: this.exportPercentage,
          companyId: parseInt(companyId),
          registeredCapital: rCWY * 1000000,
          registeredCapitalWanYuan: rCWY,
          registeredTime: time,
          topMarkets: this.topMarkets,
          topProducts: this.topProducts,
          totalEmployees: this.totalEmployees,
          totalExportRevenue: tERWY * 1000000,
          totalExportRevenueWanYuan: tERWY,
          businessAddress: this.businessAddress,
          acceptPaymentCurrency: acceptedPC
        }
        this.$store.commit('SET_DIRTY', true)
        myWebSiteApi.updateInfo(params).then(res => {
          if (res.data.code === 0) {
            window.editorApi.iframeLoad()
            this.companyInfoErrorPrompt = ''
            this.$message({
              message: '编辑公司信息成功',
              type: 'success'
            })
          } else {
            this.companyInfoErrorPrompt = res.data.message
          }
        })
      },
      // 添加下载文件弹框
      addDownLoadPopFunc () {
        this.addDownLoadPop = true
        this.uploadList = []
        this.errorPrompt = ''
        this.fileName = ''
      },
      // 公司信息修改
      updateDescFunc () {
        if (this.compDesc !== '' && this.compDesc !== undefined && this.compDesc !== null) {
          this.$store.commit('SET_DIRTY', true)
          let companyId = window.localStorage.companyId
          let params = {
            compDesc: this.compDesc,
            compDescImg: this.descPicUrl,
            companyId: companyId
          }
          myWebSiteApi.updateDesc(params).then(res => {
            this.descErrorPrompt = ''
            this.requestPrompt(res, 'desc', '编辑公司成功')
          })
        } else {
          return
        }
      },
      // 接口请求提示
      requestPrompt (res, type, sucessdesc) {
        if (res.data.code === 0) {
          window.editorApi.iframeLoad()
          this.errorPrompt = ''
          this.$message({
            message: sucessdesc,
            type: 'success'
          })
        } else {
          if (type === '') {
            this.errorPrompt = res.data.message
            console.log(this.errorPrompt)
          } else if (type === 'banner') {
            this.bannerErrorPrompt = res.data.message
          } else if (type === 'desc') {
            this.descErrorPrompt = res.data.message
          } else {
            this.$message.error(res.data.message)
          }
        }
      },
      // 新增下载文件
      saveFileFunc () {
        if (this.uploadList.length === 0) {
          this.errorPrompt = '文件不能为空'
          return
        }
        if (this.fileName.trim() === '') {
          this.errorPrompt = '文件名不能为空'
          return
        }
        let attachOriName = this.uploadList[0].oriName
        let attachUrl = this.uploadList[0].url
        let attachType = attachUrl.substr(attachUrl.lastIndexOf('.') + 1)
        let fileSize = this.uploadList[0].fileSize      // 文件大小
        let senddata = {
          fileName: this.fileName,      // 文件名
          attachOriName: attachOriName,   // 原文件名
          attachUrl: attachUrl,
          attachType: attachType,
          fileSize: fileSize
        }
        this.fileList.push(senddata)
        this.addDownLoadPop = false
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/style/base";
  @import "../../../../assets/style/variable";
  @import "../../../../assets/style/list";
  .paper-upload{
    .img-box{
      width: 352px!important;
      height: 112px!important;
    }
  }
  .margintop32{
    margin-top:32px;
  }
  .textarea-wraper{
    position: relative;
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
    .len-tip{
      color:#CCD6E2;
      position: absolute;
      bottom:16px;
      right:16px;
    }
  }
  .select-Info{
  .el-dialog__header{
    border:none;
  }
  }
  #update-topBanner{
    display:block;
  }
  .banner-img:hover{
    .hidden-btn{
      display:block;
    }
  }
  .banner-img{
    position: relative;
    width: 100%;
    height: 110px;
    margin-bottom: 15px;
    background: url(/static/img/mark.973c2ba.jpg);
    background-size: 8px 8px;
    overflow: hidden;
    border: 1px dashed #CBD6E3;
  .el-upload{
    width:100%;
    height:112px;
  }
  img{
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    height: 100px;
  }
  .hidden-btn{
    display:none;
    position: absolute;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    text-align: right;
    width: 100%;
    background-color: rgba(80, 109, 149, 0.6);
    color: #fff;
    .file{
      width: 100%;
      height: 40px;
      line-height: 40px;
      opacity: 0;
    }
    p{
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 15px;
      i{
        margin-right:5px;
      }
    }
  }
  .hidden-btn-all{
    position: absolute;
    height: 112px;
    text-align: right;
    width: 100%;
    background-color:#fff;
    color: #fff;
    top:0;
  .file{
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  }
  .el-icon-plus{
    position: absolute;
    z-index: 999;
    top: 30%;
    left: 48%;
    color: #B0C1D3;
  }
  .uploda-desc{
    position: absolute;
    z-index: 999;
    top: 54%;
    left: 42%;
    color: #7D98B6;
  }
  }
  .remove-confirm{
    width:374px;
  .el-dialog__header{
    display:none;
  }
  .confirm-prompt{
    position:relative;
  .prompt-logo{
    position: absolute;
    color: #FF3B6E;
    font-size: 24px;
    top:0;
    left:17%;
    z-index: 99;
  }
  .desc{
    margin-left:30% ;
  }
  .desc-first{
    font-size: 14px;
    color: #33475B;
    line-height: 21px;
  }
  .desc-second{
    margin-top:8px;
  }
  }
  .center-btn{
    text-align: center;
  button{
    margin-top:0px;
  }
  }
  .red-btn{
  .el-button--primary{
    background:#FF3B6E;
    border:none;
  }
  }
  }
  .edit-pop{
    width:390px;
  .el-dialog__header{
    border: 1px solid #DFE3EB;
    padding-bottom: 13px;
  }
  .el-dialog__body{
    padding: 15px 20px;
    overflow: auto;
  .label-title{
    font-size: 13px;
    color: #33475B;
    line-height: 18px;
    margin-bottom:8px;
    margin-top:16px;
  }
  .input-display{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
  input{
    border:none;
    width:88%;
    padding:9px 0;
    text-indent: 16px;
  }
  .display{
    font-size: 13px;
    color: #CCD6E2;
    line-height: 18px;
  }
  }
  .upload{
  .img-box{
    width: 349px;
  }
  .el-upload{
    width:100%;
    border:1px dashed #CBD6E3;
    height:110px;
  .avatar{
    height:100px;
    margin-top:8px;
  }
  .el-icon-plus{
    margin-top:20px;
  }
  .uploda-desc{
    font-size: 12px;
    color: #7D98B6;
    line-height: 18px;
  }
  }
  }
  .prompt{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
    margin-top:8px;
  }
  }
  .left-btn{
    float:left;
  .el-button--primary{
    background: #EAF0F6;
    border: 1px solid #DFE3EB;
    color: #B0C1D4;;
  }
  }
  .el-dialog__footer{
    overflow:hidden;
  button{
    margin-top:0px;
  }
  .is-ok{
  .el-button--primary {
    color: #fff;
    background-color: #5488F9;
    border-color: #5488F9;
  }
  }
  }
  }
  .fail{
    height: 35px;
    width: 92%;
    margin-top: 32px;
    padding: 20px 4%;
    background: #FFEBF0;
    border: 1px solid rgba(255,255,255,0.80);
    border-radius: 4px;
    font-size: 14px;
    color: #404040;
  .fail-icon{
    font-size: 18px;
    vertical-align: top;
    padding-right: 8px;
    color: #FF3B6E;
  }
  .upload{
    padding-left: 25px;
    font-size: 12px;
    color: #666666;
  }
  }
  .left-product{
  .editor{
    float: left;
    width: 420px;
    padding: 16px 28px 16px 32px;
    min-height: 760px;
    max-height: 800px;
    overflow:auto;
    margin-right: 32px;
    background: #FFFFFF;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    display: none;
  .bottom-prompt{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
    margin-top:16px;
  }
  .title{
    font-size: 18px;
    color: #33475B;
    margin-bottom: 16px;
  }
  .banner-img:hover {
  .hidden-btn {
    cursor: pointer;
    display: block;
    z-index: 999;
  }
  }
  .label-title{
    font-size: 13px;
    color: #32475A;
    line-height: 18px;
    margin-top:16px;
    margin-bottom:8px;
  }
  .input-module{
  .el-select{
    width:100%;
    height:34px;
  }
  .el-checkbox{
    width:33.3%;
    margin-left:0px;
    margin-top:11px;
    .el-checkbox__label{
      vertical-align: middle;
    }
  }
  .text-input{
    width:100%;
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    padding:8px 0;
    text-indent: 10px;
  }
  .el-date-editor{
    width:100%;
  }
  }
  .input-desc-module{
    width:100%;
    border: 1px solid #CBD6E3;
    border-radius: 4px;
  input{
    border:none;
  }
  .left-input{
    width:88%;
    padding:8px 0;
    text-indent: 8px;
    font-size: 13px;
    line-height: 18px;
  }
  span{
    width: 10%;
    text-align: center;
    display: inline-block;
    line-height: 19px;
    border-left: 1px solid #CAD6E2;
    font-size: 13px;
    color: #4F6D95;
  }
  }
  .have-word-count{
    border: 1px solid #CBD6E3;
    border-radius: 4px;
    overflow:hidden;
    width:413px;
  .textaaarea{
    border:none;
    width:393px;
    padding:5px 10px;
    font-size: 13px;
    color: #32475A;
  }
  .product{
    height:186px;
  }
  .address{
    height:120px;
  }
  p{
    font-size: 13px;
    color: #7C98B6;
    margin:8px 16px;
    float:right;
  }
  }
  .cert-model{
    border: 1px solid #DFE3EB;
    border-radius: 4px;
  .no-data{
    height:120px;
  }
  .second-title{
    background: #F5F8FA;
    border-radius: 4px;
    padding:11px 16px;
    font-size: 13px;
    color: #33475B;
    line-height: 22px;
    overflow:hidden;
  .cert-add{
    color: #B0C1D3;
    font-size:14px;
    float:right;
    cursor: pointer;
  }
  }
  .cert-list{
  .cert{
    display:block;
    overflow:hidden;
    padding:8px 16px;
    border-top:1px solid #DFE3EB;
    a{
      color: #33475B;
    }
  .cert-image{
    width:30px;
    height:40px;
    border:1px solid #DFE3EB;
  }
    .cart-logo{
      font-size: 26px;
      display: inline-block;
      margin-top: 10px;
    }
    .compress{
      color:#FFBA00 ;
    }
    .pdf{
      color: #EA545E;
    }
    .ppt{
      color:#e58830;
    }
    .word{
      color:#5488F9;
    }
    .shape{
      color:#7BD12C;
    }
    .weizhi{
      color:#B8C9D7;
    }
    .name{
      vertical-align:top;
      margin-left:20px;
      line-height: 40px;
      display: inline-block;
    }
    .operation{
      float:right;
      vertical-align:top;
      line-height: 40px;
      display:none;
      i{
        margin-left:10px;
        font-size: 15px;
        color: #B0C1D4;
        cursor: pointer;
      }
    }
  }
    .cert:hover{
      background: #F5F8FA;
      .operation{
        display:block;
      }
    }
  }
  }
  }
  .desc{
    font-size: 13px;
    color: #7C98B6;
    line-height: 21px;
  }
  .bottom-btn {
    .el-button{
      background: #EAF0F6;
      border: 1px solid #DFE3EB;
      color: #B0C1D4;
    }
  }
  .is-ok{
    .el-button {
      color: #fff;
      background-color: #5488F9;
      border-color: #5488F9;
    }
  }
  /*.el-button{
    margin-top: 32px;
  }*/
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
  }
</style>
