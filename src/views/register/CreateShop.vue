<template>
  <div class="createShop">
      <div class="head">
        <span class="img"><img src="../../assets/img/logo.svg" width="100"></span><span class="line"></span><em class="create">创建店铺</em>
        <div class="telphone">
          <em class="icon-font">&#xe6f5;</em>
          <span class="phone">0571-5658 1798</span>
        </div>
      </div>
    <div id="main">
      <input type="hidden" id="shopId" value="">
      <ul class="company double_row">
        <li class="title">
          <b></b>
          <strong>企业基本信息</strong>
          <small>请按照证书上的内容逐字填写</small>
        </li>
        <li class="license">
          <span>企业法人营业执照<b>*</b></span>
          <div class="btnAddQuali">
            <el-upload
              class="avatar-uploader"
              name="picture"
              :action="domain+'/bshop/config/pic/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            style="width:179px;height:118px;border: 1px dashed #ccc">
              <!--<img v-if="licenseUrl" :src="licenseUrl" class="avatar avatar-uploader-icon bg-avatar-uploader-two">-->
              <img v-if="licenseUrl != ''" :src="licenseUrl" class="avatar avatar-uploader-icon bg-avatar-uploader-two">
              <img v-else src="../../assets/img/register/icon.png" class="avatar avatar-uploader-icon bg-avatar-uploader-two">
              <!--<i v-else class="el-icon-plus avatar-uploader-icon bg-avatar-uploader-two"></i>-->
            </el-upload>
            <p>单张不超过10M,支持jpeg/jpg/png</p>
          </div>
          <strong><a class="upload_temp icon-font" @click="showBig1">&#xe607;</a></strong>
          <div class="firstCase" v-if="detailShow2">
            <b class="caseClose" @click="closeBig1">×</b>
            <p>营业执照原件照片范例</p>
            <span>确保证件信息清晰、完整、不可涂改和遮盖！</span>
            <img src="../../assets/img/register/yingye_03.png" alt="">
          </div>
        </li>
        <li class="tax">
          <span class="span">税务登记证<b>*</b></span>
          <div class="btnAddQuali">
            <el-upload
              class="avatar-uploader"
              :action="domain+'/bshop/config/pic/upload'"
              :show-file-list="false"
              name="picture"
              :on-success="handleAvatarSuccessTwo"
              :before-upload="beforeAvatarUpload"
              style="width:179px;height:118px;border: 1px dashed #ccc">
              <img v-if="taxCertUrl != ''" :src="taxCertUrl" class="avatar avatar-uploader-icon bg-avatar-uploader-one">
              <img v-else src="../../assets/img/register/shunwu.png" class="avatar avatar-uploader-icon bg-avatar-uploader-one">

              <!--<i v-else class="el-icon-plus avatar-uploader-icon bg-avatar-uploader-one"></i>-->
            </el-upload>
            <p>单张不超过10M,支持jpeg/jpg/png</p>
          </div>
          <strong><a class="upload_temp icon-font" @click="showBig2">&#xe607;</a></strong>
          <div class="secondCase" v-if="detailShow3">
            <b class="caseClose" @click="closeBig2">×</b>
            <p>税务登记证原件照片范例</p>
            <span>确保证件信息清晰、完整、不可涂改和遮盖！</span>
            <img src="../../assets/img/register/shili_04.png" alt="">
          </div>
        </li>
        <li>
          <span>企业名称（中文）<b>*</b></span>
          <input type="text" placeholder="请输出您的企业名称" v-model="shopName">
          <p v-show="nameShop" class="error">企业名称（中文）不能为空</p>
        </li>
        <li>
          <span>企业名称（英文）<b>*</b></span>
          <input type="text" placeholder="请输出您的企业名称" v-model="shopNameEn">
          <p v-show="enName" class="error">你输入的企业名称有误</p>
        </li>
        <li>
          <span>法人代表姓名<b>*</b></span>
          <input type="text" placeholder="请输出法人代表姓名" v-model="legalPerson">
          <p class="error" v-show="personLegal">法人代表姓名不能为空</p>
        </li>
        <li>
          <span>法人代表身份证号<b></b></span>
          <input type="text" placeholder="请输出法人代表身份证号" v-model="legalIdCard">
          <p class="error" v-show="cardPerson">法人身份证号不能为空</p>
          <p class="error" v-show="cardPersonNum">法人身份证号有误</p>
        </li>
        <li>
          <span>工商注册号<b></b></span>
          <input type="text" placeholder="工商注册号或统一社会信用代码" v-model="icRegNum">
          <p class="error" v-show="numReg">工商注册号不能为空</p>
        </li>
      </ul>

      <ul class="contact">
        <li class="title">
          <b></b>
          <strong>联系方式</strong>
          <small>请务必正确的填写正确的联系方式</small>
        </li>
        <li>
          <span>联系人姓名<b>*</b></span>
          <div>
            <input type="text" placeholder="请输入联系人名称" v-model="contactName">
            <p class="error" v-show="nameContact">工商注册号不能为空</p>
          </div>
        </li>
        <li>
          <span>联系人手机号<b>*</b></span>
          <div >
            <input type="text" placeholder="请输入联系人手机号" v-model="contactPhone" @blur="checkInfo(contactPhone)">
            <p class="error" v-show="phoneContact">手机号码不能为空</p>
            <p class="error" v-show="phoneContactNum">手机号码有误</p>
          </div>
        </li>
        <li>
          <span>业务联系邮箱<b>*</b></span>
          <input type="text" placeholder="请输入业务联系邮箱" v-model="contactEmail">
          <p class="error" v-show="emailContact">业务联系邮箱不能为空</p>
          <p class="error" v-show="emailContactNum">业务联系邮箱格式有误</p>
        </li>
        <li class="provinceCity">
          <span>所在地区<b>*</b></span>

          <el-select  v-model="provinceId" placeholder="请选择省份" @change="changeProvince" style="width: 194px;margin-right: 7px">
            <el-option
              v-for="(item,keyIndex) in provinceList"
              :label="item.name"
              :key="keyIndex"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="cityId" placeholder="请选择城市" style="width: 194px;">
            <el-option
              v-for="(item,keyIndex) in cityList"
              :label="item.name"
              :key="keyIndex"
              :value="item.id">
            </el-option>
          </el-select>
          <p class="error" v-show="idProvince">省份不能为空</p>
          <p class="error" v-show="idCity">城市不能为空</p>
        </li>
        <li>
          <span>街道地址<b>*</b></span>
          <input type="text" v-model="address">
          <p class="error" v-show="idAddress">街道不能为空</p>
        </li>
        <li></li>
      </ul>

      <div class="clause">
        <div class="checkClause">
          <a id="checkClause" class=""></a>
          <el-checkbox v-model="checked" @change="protocolPOP('1')"></el-checkbox>
          <span>我已仔细阅读并同意<strong @click="protocolPOP('1')">上述协议</strong></span>
        </div>
        <div class="safeguard" v-if="detailShow">
          <div class="safe_container">
          <h2>盈店平台服务协议</h2>
          <b class="closeClause" @click="protocolPOP('0')">×</b>
          <div class="mainText">
            <p>
              感谢您选择盈店平台服务（以下简称'本服务'）。本协议由您与盈店平台的经营者共同缔结，本协议具有合同效力。在您使用本服务前，您应当阅读并遵守本《盈店平台服务协议》（以下简称“本协议”）、以及相关业务规则（以下简称“盈店平台规则”），<span>请您务必审慎阅读、充分理解该等协议、规则各条款内容，特别是限制或免除责任的相应条款、争议解决和法律适用条款。</span>限制或免除责任条款可能将以<span>加粗字体</span>形式显示，提示您注意，您应重点阅读。</p>
            <p>
              除非您已阅读并接受该等协议（包括但不限于本协议）、规则的所有条款，否则您无权使用本服务的任何部分或全部。您对本服务的任何使用行为，包括但不限于注册、登录本服务均视为您已阅读并同意受本协议全部条款的约束，届时您不应以未阅读本协议的内容或者未获得盈店对您问询的解答等理由，主张本协议无效，或要求撤销本协议。如果您不同意盈店平台规则的约定，您应立即停止注册或停止使用盈店平台服务。如您对本协议有任何疑问，应根据本协议列明的联系方式联系盈店。
            </p>
            <h5>一、 定义</h5>
            <div>
              <span>盈店平台：</span>
              盈店平台网站及移动智能终端设备客户端系由杭州龙席网络科技股份有限公司（以下简称'龙席网络'）开发并运营的，网站域名为：onloon.net。（以下简称“盈店”）
            </div>
            <div>
              <span>盈店平台服务：</span>
              盈店基于互联网，在盈店网站、移动智能终端设备客户端向您提供的各项服务，包括但不限于创建店铺、店铺管理、商品管理、订单管理、分销推广、客户管理、账户管理等具体服务。本服务包含的具体服务以盈店提供的服务内容为准。
            </div>
            <div>
              <span>您/用户：</span>
              指使用本服务的用户，包括自然人用户以及非自然人用户（包括任何具备法人主体资格的机构或组织），且仅限在阅读并完全接受本协议、《盈店禁售商品管理规范》、《盈店卖家管理规范》、《盈店交易纠纷处理办法》等其他与本服务相关的其他协议、业务规则等（如有）的全部条款后，按照盈店平台注册页面提示填写手机号码，并于收到短信验证码后，填写验证码，完成全部注册程序后，便可获得盈店账户并成为盈店平台用户，使用本服务。
            </div>
            <div>
              <span>买家：</span>
              指在盈店买家版平台上浏览或购买商品/接受服务的自然人。
            </div>
            <div>
              <span>龙席平台：</span>
              包括但不限于有杭州龙席网络科技股份有限公司开发的盈店、盈店买家版、口袋购物、今日半价、盈店全球购以及将来可能发布的新的移动应用产品，本协议项下统称为龙席平台。
            </div>
            <h5>二、 本协议及/或本服务的变更</h5>
            <p>
              盈店有权根据需要不时地依照本协议约定方式就本协议的有关约定和/或本服务内容进行变更。一旦本协议和/或本服务内容发生变更，盈店将会在该变更内容确定后，以盈店客户端更新的方式向用户公布，您知悉并认可盈店无需另行单独通知您。
            </p>
            <p>
              <span>您应不时关注本协议及本服务有关内容，以便掌握任何变动情况。如果您不同意盈店变更的内容，您应主动停止使用本服务。如果您在变更内容通告后7天内未主动停止使用本服务，则视为您接受本协议和/或本服务的变更，变更内容通告后您如果仍继续使用本服务亦构成您对有关变更内容的接受与认可。如您针对变更内容有异议，您应立即停止使用全部本服务，且您应在上述约定期限内主动停止使用本服务。</span>
            </p>
            <p>
              同时，盈店将可能进一步扩充本服务功能（扩充的服务功能纳入本服务范畴，本协议同样适用于扩充的服务功能），针对该部分新增功能将有可能附带特别适用于该功能的协议内容，请您在使用该新增功能前，仔细阅读该功能所附带协议（如有）。届时您接受该项新增功能服务的前提为您同意该项新增功能服务所附带的所有法律文档，包括但不限于本协议及新增功能服务所附带的协议。如果您不接受该新增功能所附带协议，请切勿使用该新增功能，否则您的使用行为将被视为您对附带协议的完全接受。同时您知悉并同意如本协议与任何针对某项新增服务添加相关特别约定、协议不一致的，均优先适用针对新增功能所添加相关特别约定及协议的规定。
            </p>
            <h5>三、 账户与安全</h5>
            <h6>主体资格</h6>
            <p>
              您确认，在您注册或以其他盈店允许的方式实际使用盈店平台服务时，您应当是<span>具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。</span>若自然人用户不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且盈店有权注销或永久冻结您的账户，并向您及您的监护人索偿相应损失。
            </p>
            <h6>注册与使用</h6>
            <div>a）当您按照注册页面提示填写手机号、阅读并同意本协议且收到盈店发送的短信验证码后，由您填写验证码，完成全部注册程序后，或您以其他盈店允许的方式实际使用盈店平台服务时，您即受本协议约束。您可以使用您提供或确认的手机号码或者盈店允许的其它方式作为登录手段进入盈店平台。</div>
            <div>b）您知悉并同意，如您在盈店平台注册成功，您即可以获得盈店账号。您在此明确授权，您的账户注册信息在通过盈店注册成功时，已授权盈店披露给所有龙席平台使用，以使您更便捷的使用本服务。</div>
            <div>c）您的登录名和密码不得以任何方式买卖、转让、赠与或继承，除非有法律明确规定或司法裁定，并经盈店同意，且需提供盈店要求的合格的文件材料并根据盈店制定的操作流程办理。</div>
            <div>d）在注册或激活流程时，您应当依照法律法规要求，按相应页面的提示准确提供您的资料，并于资料信息变更时及时更新，以保证您所提交资料的真实、及时、完整和准确。<span>如有合理理由怀疑您提供的资料错误、不实、过时或不完整的，盈店有权向您发出问询及/或要求及时更正的通知，并有权直接做出删除相应资料的处理，甚至中止、终止对您提供部分或全部盈店平台服务。盈店对此不承担任何责任，由您自行承担因此产生的全部直接或间接损失及不利后果。</span></div>
            <div><span>e）您应当准确填写并及时更新您提供的联系电话等联系方式，以便盈店或其他用户与您取得联系，因通过这些联系方式无法与您取得联系，导致您在使用本服务过程中产生任何损失或承担任何法律责任的，应由您完全独自承担。您了解并同意，您有义务保证你提供的联系方式的真实性和有效性，如有变更的，您应按盈店的要求进行操作。</span></div>
            <h6>账户的注销</h6>
            <div><span>a）如您申请注销盈店账户的，您根据盈店要求提交资料，经盈店审核过后，办理注销账户事宜，同时盈店会终止您所有盈店平台服务。</span></div>
            <div><span> b）您同意并授权盈店，您如有任意的欺诈、发布或销售假冒伪劣、侵权商品、侵犯他人合法权益或其他违反法律法规、盈店平台规则等行为，盈店有权披露您的相关信息，且会导致您的账户可能被注销、不能再登录盈店平台，所有盈店平台服务及龙席平台服务同时终止。</span></div>
            <h6>账户安全</h6>
            <p><span>您应妥善保管您的账号和密码。因您保管不善而可能导致账号或密码失窃的，责任由您自行承担。且您须对在该登录名下发生的所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续签协议或购买服务等）承担责任。</span></p>
            <h6>您知悉并认可：</h6>
            <div>a）如发现任何账户安全问题，您应立即采取有效方式通知盈店，并授权盈店将该信息同步给龙席平台；您认可盈店对您的任何请求采取行动均需要合理的时间，除盈店存在过错外，盈店对在采取行动前已经产生的后果不承担任何责任。</div>
            <div>b）为确保您在每个上网时段结束时，以正确步骤离开网站、移动智能终端设备应用、服务。您理解并同意给予盈店合理的时间对您提出请求做出相应的处理及提供解决方案，盈店对在盈店采取行动前已经产生的任何后果（包括但不限于您遭受的任何损失及/或承担的责任）不承担任何法律责任。</div>
            <h5>四、 用户个人信息的保护</h5>
            <p>盈店深知您珍视个人隐私，并理解保护您个人信息的重要性。盈店将按照相关法律法规的规定收集、使用、保存、披露和保护您的个人信息。</p>
            <p>您在注册账号和使用本服务的过程中，可能需要填写一些必要的用户个人信息。您应当保证填写的身份信息为真实、完整的。您知悉并认可，若您填写的信息不完整，则无法使用本服务或在使用过程中受到限制。</p>
            <p>一般情况下，您可随时浏览、修改自己提交的相关信息，但出于安全性和身份识别的考虑，您可能无法自行修改注册时提供的手机号码。如有任何问题欢迎与盈店客服取得联系（联系方式请见本协议）。</p>
            <p>盈店将应用各种安全技术和程序建立完善的管理制度来保护您的个人信息以免遭受未经授权的访问、使用或披露。</p>
            <p>盈店非经您的许可或根据相关法律、法规的强制性规定，不会透露您的个人信息。如您涉嫌侵犯他人知识产权等合法权益，则经盈店初步审核确有涉嫌侵权行为存在的情况下，盈店有权向权利人提供您的相关个人信息。盈店承诺并保证这些信息仅且仅用于核实盈店的记录并向用户提供更适合需要的服务。</p>
            <p>盈店非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用本服务前，应事先取得您家长或法定监护人的书面同意。
              您声明并保证，您对您所发布的信息拥有相应、合法的权利。否则，盈店可对您发布的信息依法或依本协议进行删除或屏蔽。</p>
            <h5>五、商品及/或服务的销售与评价</h5>
            <p>您的销售行为应当基于真实的消费需求，不得存在对商品及/或服务实施刷单、恶意销售、恶意维权等扰乱盈店平台正常交易秩序的行为。基于维护盈店平台交易秩序及交易安全的需要，盈店发现上述情形时可主动执行关闭相关交易订单等操作。</p>
            <p>您有权在盈店平台提供的评价系统中对与您达成交易商品及/或服务进行评价回复。您的所有评价回复行为应遵守盈店平台规则的相关规定，评价回复内容应当客观真实，不应包含任何污言秽语、色情低俗、广告信息及法律法规与本协议列明的其他禁止性信息；您不应利用评价权利对其他用户实施威胁、敲诈勒索。盈店可按照盈店平台规则的相关规定对您实施上述行为所产生的评价信息进行删除或屏蔽。</p>
            <h5>六、本服务使用规范</h5>
            <h6>您承诺在使用本服务过程中，您应遵守以下约定：</h6>
            <div><span>a）实施的所有行为均应遵守国家法律、法规等规范性文件及盈店平台各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不偷逃应缴税费，不违反本协议及相关规则。您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保盈店平台免于因此产生任何损失。</span></div>
            <div><span>b）交易过程中，应遵守诚实信用原则，不采取不正当竞争行为，不扰乱网络交易的正常秩序，不从事与网络交易无关的行为。</span></div>
            <div><span>c）不发布国家明令禁止销售的或限制销售的商品或服务信息（除非获得合法且足够的许可）；不得发布涉嫌侵犯他人知识产权或其它合法权益的商品或服务信息；不发布违背社会公共利益或公共道德或盈店认为不适合在盈店平台上销售的商品或服务信息；不发布其它涉嫌违法或违反本协议及各类规则的信息。</span></div>
            <div><span>d）不以虚构或歪曲事实的方式贬低、诋毁其他用户，不采取不正当方式提升或试图提升自身的信用度。</span></div>
            <div><span>e）未经盈店书面许可，不得自行或允许第三方以任何形式抓取盈店的数据，不对盈店平台上的任何数据作商业性利用，包括但不限于在未经盈店事先书面同意的情况下，以复制、传播等任何方式使用盈店平台上展示的资料。</span></div>
            <div><span>f）不使用任何装置、软件或例行程序干预或试图干预盈店平台的正常运作或正在盈店平台上进行的任何交易、活动。您不得采取任何将导致不合理的庞大数据负载加诸盈店平台网络设备的行动。</span></div>
            <div><span>g）您的盈店商品信息，可通过社交网络、等进行转发，但因您转发内容导致的任何纠纷均由您自行承担。</span></div>
            <div><span>h）您同意按照盈店的交易规则，在您与买家完成商品订单后，您同意买家将商品价款支付到盈店账户，然后根据买家选择的交易模式和收货情况及交易履行情况，由盈店将交易款项转账到您在盈店注册时所留的银行卡账户上，因此转账交易发生的银行手续费，盈店有权根据实际需要自行决定是否收取，如收取该部分费用，费用标准以银行的收费标准为准。</span></div>
            <div><span>i）您了解并同意因买家根据《消费者权益保护法》提出的退货或换货、维修等事宜，由您与买家协商解决，盈店对此不承担任何责任，亦无义务负责双方之间的退换货事宜。</span></div>
            <div><span>j）您应该遵守《盈店禁售商品管理规范》，严禁通过盈店销售禁止销售的物品，同时盈店禁止任何虚假交易、禁止任何无真实标的物的交易行为以及其它盈店认为不适宜进行交易的行为，否则盈店一经发现有权没收您全部收入，同时有权立即查封您的盈店账户，且无需对此承担任何责任。</span></div>
            <div><span>
			            <div>k）您承诺在使用盈店平台时应遵守中华人民共和国相关法律法规及盈店平台规则等，不得从事任何非法交易或违反盈店平台相关规则的交易行为，如利用盈店平台进行信用卡套现、洗钱等行为，出现违约的，按照本协议承担违约责任。</div>
			            <div>您有权自行决定商品及/或服务的促销及推广方式，盈店亦为您提供了丰富的推广、促销、分销方式，您承诺您的促销推广行为应当符合国家相关法律法规及盈店平台规则的规定。</div>
			            <div>您在使用本服务过程中，您应对销售额/营业额超过法定免征额部分及时、足额地向税务主管机关缴纳应纳税款。</div>
			            </span></div>

            <h6>您了解并同意：</h6>
            <div><span>a）您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保盈店平台免于因此遭受任何损失或承担任何责任。</span></div>
            <div><span>b）基于维护盈店平台交易秩序及交易安全的需要，盈店有权在发生诈骗、售假、套现等扰乱市场正常交易秩序的情形下，对相关交易订单进行冻结、关闭等操作。</span></div>
            <div><span>c）经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者盈店根据自身的判断，认为您的行为涉嫌违反法律法规的规定或涉嫌违反本协议和/或盈店规则的条款的，盈店有权不经通知您即予以删除，且按照相关规则的规定对您进行处罚。盈店有权在盈店平台上公示您的该等涉嫌违法或违约行为及盈店已对您采取的措施。</span></div>
            <div><span>d）对于您违反本协议项下承诺，或您在盈店平台上实施的行为，包括您未在盈店平台上实施但已经对盈店平台及其用户产生影响的行为，盈店有权单方认定您行为的性质及是否构成对本协议及/或盈店规则的违反，并根据单方认定结果适用规则予以处理或终止向您提供服务，且无须征得您的同意或提前通知您。您应自行保存与您行为有关的全部证据，并应对无法提供充要证据而承担的不利后果。</span></div>
            <div><span>e）如您涉嫌违反有关法律或者本协议之规定，使盈店遭受任何损失，或导致任何第三方对盈店提起索赔，或使盈店遭受任何行政管理部门的处罚，您应当赔偿盈店因此产生的全部损失及或发生的费用，包括但不限于诉讼费、律师费以及盈店向第三方支付的赔偿金或违约金等。</span></div>
            <div><span>f）如您在盈店的交易行为或您与买家的交易行为被有关部门或盈店认定为属于信用卡套现的情形时，盈店平台有权按照该笔交易金额的1%收取违约金，且盈店有权冻结、取消该交易、关闭或注销您的盈店账户。</span></div>

            <h5>七、特别授权</h5>
            <p><span>您知悉并认可，您对本服务的实际使用行为，即视为同意盈店客户端向您发送商业信息，如您不希望收到盈店向您发送的商业信息，请您在自己的手机中设置关闭接受盈店发送信息的功能。</span></p>
            <p>您完全理解并不可撤销的授权盈店在您和买家发生交易纠纷后，盈店有权根据买家的请求向买家提供您的详细信息，由买家与您通过协商或诉讼方式处理纠纷。</p>
            <p>您亦可以选择使用盈店进行交易纠纷的调解处理服务，盈店会根据本协议及盈店规则的规定，处理您在盈店发生的所有交易及可能产生的交易纠纷。您同意接受盈店根据其所了解到的争议事实并依据盈店平台规则作出调解处理决定。您理解并同意，在争议调处服务中，盈店平台的客服并非专业人士，仅能以普通人的认知对用户提交的凭证进行判断。因此，除存在故意外，调处方对争议调处决定免责。如您对调处决定不满意，您仍有权采取其他争议处理途径解决争议，但通过其他争议处理途径未取得终局决定前，您仍应先履行调处决定。</p>
            <p>一旦您向盈店和/或其关联公司作出任何形式的承诺，且相关方已确认您违反了该承诺，则盈店有权立即按您的承诺或协议约定的方式对您的账户采取限制措施，包括中止或终止向您提供服务，并公示相关方确认的您的违约情况。您了解并同意，盈店无须就相关确认与您核对事实，或另行征得您的同意，且盈店无须就此限制措施或公示行为向您承担任何的责任。</p>
            <p>一旦您违反本协议，或与盈店签订的其他协议的约定，盈店有权以任何方式通知盈店关联公司，要求其对您的权益采取限制措施，包括但不限于将您账户内的款项支付给盈店指定的对象，要求盈店关联公司中止、终止对您提供部分或全部服务，且在其经营或实际控制的任何网站公示您的违约情况。</p>
            <p>对于您提供的资料及数据信息，您授予盈店、龙席平台及其关联公司独家的、全球通用的、永久的、免费的许可使用权利 (并有权在多个层面对该权利进行再授权)。此外，盈店及其关联公司有权(全部或部分地) 使用、复制、修订、改写、发布、翻译、分发、执行和展示您的全部资料数据（包括但不限于注册资料、交易行为数据及全部展示于盈店平台的各类信息）或制作其派生作品，并以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内。</p>
            <p>为方便您使用本服务，您同意并授权盈店将您在账户注册/激活、使用盈店平台服务过程中提供、形成的信息传递给向您提供龙席平台服务的组织或其他组织，或从提供龙席平台或其他组织获取您在注册/激活、使用其他服务期间提供、形成的信息。您同意不会因此追究龙席网络及其关联公司及其旗下所有平台的责任。</p>

            <h5>八、免责声明及有限保证</h5>
            <p><span>盈店负责按"现状"和"可得到"的状态向您提供盈店平台服务。盈店对本服务的适用性、完整性、持续性、准确性、可靠性以及满足用户的要求或符合用户的期望等不作任何担保，不论是明示的或默示的。同时，盈店也不对本服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、质量、稳定性、完整性和及时性作出任何承诺和保证。</span></p>
            <p><span>您了解盈店仅向您提供盈店平台服务，且盈店平台上的的信息均系用户自行发布，可能存在风险和瑕疵。盈店平台仅作为第三方交易平台。盈店平台仅作为您获取物品或服务信息、物色交易对象、就物品和/或服务的交易进行协商及开展交易的场所，但盈店无法控制交易所涉及的物品的质量、安全或合法性，商贸信息的真实性或准确性，以及交易各方履行其在贸易协议中各项义务的能力。因此，盈店不对用户行为的合法性、有效性、真实性作任何明示或默示的担保，对此您应谨慎判断。</span></p>
            <p><span>除非法律法规明确要求，或出现以下情况，否则，盈店没有义务对所有用户的信息数据、商品和服务信息、交易行为以及与交易有关的其它事项进行审查：</span></p>

            <div><span>a)盈店有合理的理由认为特定用户及具体交易事项可能存在重大违法或违约情形。</span></div>
            <div><span>b)盈店有合理的理由认为用户在盈店平台的行为涉嫌违法或不当。</span></div>

            <p><span>盈店有权基于您不可撤销的授权受理您与盈店消费者因交易产生的争议，并有权单方判断与该争议相关的事实及应适用的规则，进而作出处理决定，包括但不限于调整相关订单的交易状态。该处理决定对您有约束力。如您未在限期内执行处理决定的，则盈店有权利（但无义务）直接使用您在盈店的款项，或您向盈店交纳的保证金代为支付。您应及时补足保证金并弥补盈店及其关联公司的损失，否则盈店及其关联公司有权直接抵减您在其它合同项下的权益，并有权继续追偿。</span></p>
            <p><span>您理解并同意，盈店并非司法机构，仅能以普通人的身份对证据进行鉴别，盈店对争议的调处完全是基于您不可撤销得授权，其无法保证争议处理结果符合您的期望，也不对争议调处结论承担任何责任。如您因此遭受任何损失或承担任何法责任，均与盈店无关。</span></p>
            <p><span>尽管本协议中可能含有相反的规定，在适用法律允许的最大范围内，您了解并同意，盈店不对因您使用本服务引起的、或在任何方面与本服务有关的任何意外的、非直接的、特殊的利益损失承担责任，包括但不限于利润、商誉、使用、数据等方面的损失或其它无形的损失。（无论盈店是否已被告知该等损害赔偿的可能性)</span></p>
            <p><span>不论在何种情况下，盈店均不对由于信息网络正常的设备维护，信息网络连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。</span></p>

            <h5>九、知识产权归属</h5>
            <p>盈店所包含的全部智力成果包括但不限于数据库、网站设计、文字和图表、软件、照片、录像、音乐、声音及其前述组合，软件编译、相关源代码和软件 (包括小应用程序和脚本) 的知识产权权利均归龙席网络所有。用户不得为商业目的复制、更改、拷贝、发送或使用前述任何材料或内容。</p>
            <p>盈店名称中包含的所有权利，包括但不限于著作权、商标权等，均归龙席网络所有。用户在使用盈店服务过程中不得未经权利人的合法授权使用盈店或他人的合法知识产权权利。</p>

            <h5>十、侵权处理</h5>
            <p>如您认为盈店平台商家发布的商品侵犯了您的合法权利，您有权向盈店提交书面权利通知书，要求盈店删除相关涉嫌侵权的商品。权利通知书应包含的具体内容以及邮寄地址，请您根据本协议列明的客服热线联系盈店客服。</p>

            <h5>十一、客户服务</h5>
            <p>盈店建立专业的客服团队，并建立完善的客户服务制度，从技术、人员和制度上保障用户提问及投诉渠道的畅通，为用户提供及时的疑难解答与投诉反馈服务。</p>
            <div><span>客户热线：0571-5658 1798</span>（工作时间：周一至周五，早九点至晚九点）。</div>
            <div><span>客服电子邮箱：xiongyi@loonxi.com</span></div>
            <div><span>在线反馈：</span>登录盈店客户端，选择 “设置”图标，点击“帮助与反馈”。</div>

            <h5>十二、违约赔偿</h5>
            <p>如由于您使用本服务、违反本协议及其他相关协议、或您侵害他人合法权益而使盈店及其关联公司遭受任何损失（包括但不限于律师费、诉讼费），或导致任何第三人向盈店及其关联公司提出任何索赔或请求，或导致盈店及其关联公司遭受任何行政管理部门的处罚，您应使盈店及其关联公司不因此遭受任何损害，并保证承担由此引发的全部法律责任。</p>
            <p>如盈店平台发现您存在套现行为的，您应向盈店平台缴纳交易金额1%的违约金，由盈店平台直接从您的交易金额中扣取，并有权根据情节严重程度，对您处以警告、限制或禁止使用部分或全部功能、封禁或注销店铺账户等处罚。</p>

            <h5>十三、协议的中止与终止</h5>
            <p>您知悉并认可，盈店有权自行决定以合理的理由、在法律允许的最大范围内，并不经事先通知的中止、终止向您提供部分或全部盈店平台服务，暂时冻结或永久冻结（注销）您的账户在盈店平台的权限，且无须为此向您或任何第三方承担任何责任。</p>
            <div>出现以下任一情况时，盈店有权直接以注销账户的方式终止本协议，并有权永久冻结（注销）您的盈店账户的权限：</div>
            <div>a）盈店终止向您提供服务后，您涉嫌再一次直接或间接以他人名义注册为盈店用户的；</div>
            <div>b）您的账户名称、头像或简介涉嫌违反法律法规、包含不良信息、涉嫌冒用或关联机构或社会名人注册账户名称的；</div>
            <div>c）严重侵犯消费者的合法权益、不履行法律规定的相关义务（包括但不限于赔付、7天无理由退货等）；</div>
            <div>d）严重违反盈店规则；</div>
            <div>e）本协议（含规则）变更时，您明示并通知盈店不愿接受新的服务协议的；</div>
            <div>f）其它盈店认为应当终止服务的情况。</div>

            <p>您的账户服务被终止或者账户在盈店平台的权限被永久冻结（注销）后，盈店没有义务为您保留或向您披露您账户中的任何信息，也没有义务向您或第三方转发任何您未曾阅读或发送过的信息。</p>

            <div>您同意，您与盈店的协议关系终止后，盈店仍享有下列权利：</div>
            <div>a）继续保存您的用户信息及您使用盈店平台服务期间的所有交易信息；</div>
            <div>b）您在使用盈店平台服务期间存在违法行为或违反本协议和/或盈店规则的行为的，盈店仍可依据本协议向您主张权利。</div>

            <div>盈店中止或终止向您提供盈店平台服务后，对于您在服务中止或终止之前的交易行为依下列原则处理，您应独力处理并完全承担进行以下处理所产生的任何争议、损失或增加的任何费用，并应确保盈店免于因此遭受任何损失或承担任何法律责任：</div>
            <div>a）您在服务中止或终止之前已经上传至盈店平台的商品或服务尚未交易的，盈店有权在中止或终止服务的同时删除此项商品或服务的相关信息；</div>
            <div>b）您在服务中止或终止之前已经与消费者达成交易合意，但该交易尚未实际履行的，盈店有权删除该买卖合同及其交易商品或服务的相关信息；</div>
            <div>c）您在服务中止或终止之前已经与其他消费者达成交易合意且已部分履行的，盈店可以不删除该项交易，但盈店有权在中止或终止服务的同时将相关情形通知您的交易对方。</div>

            <h5>十四、法律适用与争议解决</h5>
            <p>本协议之订立、生效、解释、变更、终止、执行与争议解决均适用中华人民共和国大陆地区法律；如无相关法律规定的，则应参照通用国际商业惯例及/或行业惯例。</p>
            <p>本协议包含了所有您在使用本服务时须遵守的一般性规范，您在使用盈店某个具体服务时还需遵守适用于该具体服务的特殊性规范（具体请参见您使用该具体服务时签署的其他协议以及规则等）。如一般性规范与特殊性规范不一致或有冲突的，则以特殊性规范的约定为准。</p>
            <p>因本协议产生的一切争议应由您与盈店的经营者协商解决。协商解决不成的，您同意由杭州龙席网络股份有限公司所在地人民法院诉讼解决。</p>
          </div>
        </div>
        </div>
      </div>
      <input id="submit" type="button" value="提交" @click="createShop">
    </div>
  </div>
</template>

<script>
import createShopAPI from '@/api/createShopAPI'
export default {
  name: 'register',
  data () {
    return {
      licenseUrl: '', // 企业执照
      licenseUrl1: '', // 企业执照传值
      taxCertUrl: '', // 税务登记照
      taxCertUrl1: '', // 税务登记照传值
      detailShow: false,
      detailShow2: false,
      detailShow3: false,
      checked: false,
      checkPhone: true,
      dataCompany: {},
      dataShop: {},
      dataCompanyBusiness: {},

      shopId: window.localStorage.shopId,
      shopName: '',
      nameShop: false,
      shopNameEn: '',
      enName: false,
      legalPerson: '',
      personLegal: false,
      legalIdCard: '',
      cardPerson: false,
      cardPersonNum: false,
      icRegNum: '',
      numReg: false,
      contactName: '',
      nameContact: false,
      contactPhone: '',
      phoneContact: false,
      phoneContactNum: false,
      contactEmail: '',
      emailContact: false,
      emailContactNum: false,
      provinceId: '',
      provinceNowId: '',
      provinceIdFlag: '',
      idProvince: false,
      cityId: '',
      idCity: false,
      address: '',
      idAddress: false,
      companyId: '',
      provinceList: [],
      cityList: [],
      domain: process.env.IMG_DOMAIN
    }
  },
  components: {
    createShopAPI
  },
  mounted: function () {
    console.log(this.$route.query.modifyAgain)
    if (this.$route.query.modifyAgain === 'true') {
      this.companyDetail()
    }
  },
  watch: {
    provinceId: function () {
      if (this.provinceId !== this.provinceNowId && this.provinceIdFlag !== this.provinceId) {
        this.cityId = ''
      }
    }
  },
  methods: {
    changeProvince: function () {
      // 获取省份对应的市列表
      console.log(77)
      let param = {
        provinceId: this.provinceId
      }
      createShopAPI.getCityList(param).then((res) => {
        console.log(13123)
        this.cityList = res.data.data
        console.log(this.cityList)
      })
    },
    checkInfo: function (val) {
      console.log(val)
    },
    showBig1: function () {
      this.detailShow2 = true
    },
    closeBig1: function () {
      this.detailShow2 = false
    },
    showBig2: function () {
      this.detailShow3 = true
    },
    closeBig2: function () {
      this.detailShow3 = false
    },
    handleAvatarSuccess (res, file) {
      this.licenseUrl = res.data.urlWhole
      this.licenseUrl1 = res.data.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    handleAvatarSuccessTwo (res, file) {
      this.taxCertUrl = res.data.urlWhole
      this.taxCertUrl1 = res.data.url
//      this.taxCertUrl = URL.createObjectURL(file.raw)
    },
    // 协议弹框
    protocolPOP (type) {
      if (type === '0') {
        this.detailShow = false
      } else {
        this.detailShow = true
      }
    },
    xssCheck (val) {
      return val.replace(/(^\s*)|(\s*$)/g, '')
    },
    checkUndefined (val) {
      if (typeof (val) === 'undefined') {
        return false
      } else {
        return true
      }
    },
    // 身份证验证
    checkIDCard (Card) {
      if (Card === '') {
//        alert('请输入身份证号')
        return true
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(Card))) {
//        alert('身份证号码有误，请重填')
        return false
      }
      return true
    },
    // 手机号验证
    checkPhones (phone) {
      if (phone === '') {
//        alert('请输入手机号')
        return false
      }
      if (!(/^1[0-9]{10}$/.test(phone))) {
//        alert('手机号码有误，请重填')
        return false
      }
      return true
    },
    // 对电子邮件的验证
    fCheckEmail (strEamil) {
      var myreg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!myreg.test(strEamil)) {
        return false
      }
      return true
    },
    // 创建店铺
    createShop () {
      if (this.checked === false) {
        alert('请先同意相关协议')
        return
      }
      var shopName = this.xssCheck(this.shopName)
      var shopNameEn = this.xssCheck(this.shopNameEn)
      var licenseUrl = this.xssCheck(this.licenseUrl)
      var taxCertUrl = this.xssCheck(this.taxCertUrl)
      var legalPerson = this.xssCheck(this.legalPerson)
      var legalIdCard = this.xssCheck(this.legalIdCard)
      var icRegNum = this.xssCheck(this.icRegNum)
      var contactName = this.xssCheck(this.contactName)
      var contactPhone = this.xssCheck(this.contactPhone)
      var contactEmail = this.xssCheck(this.contactEmail)
      var provinceId = this.xssCheck(this.provinceId)
      var cityId = this.xssCheck(this.cityId)
      var address = this.xssCheck(this.address)

      if (!this.checkUndefined(licenseUrl)) {
        console.log(this.checkUndefined(licenseUrl))
        alert('企业法人营业执照不能为空')
        return false
      }
      if (!this.checkUndefined(taxCertUrl)) {
        console.log('税务登记证不能为空')
        return false
      }

      if (shopName === '') {
        console.log('企业名称（中文）不能为空')
        this.nameShop = true
        return false
      } else {
        this.nameShop = false
      }
      if (shopNameEn === '') {
        console.log('企业名称（英文）不能为空')
        this.enName = true
        return false
      } else {
        this.enName = false
      }

      if (legalPerson === '') {
        console.log('法人代表姓名不能为空')
        this.personLegal = true
        return false
      } else {
        this.personLegal = false
      }
      if (legalIdCard === '') {
//        console.log('法人代表身份证号不能为空')
//        this.cardPerson = true
//        return false
      } else {
//        this.cardPerson = false
      }
      if (icRegNum === '') {
//        console.log('工商注册号不能为空')
//        this.numReg = true
//        return false
      } else {
//        this.numReg = false
      }
      if (contactName === '') {
        this.nameContact = true
        console.log('联系人姓名不能为空')
        return false
      } else {
        this.nameContact = false
      }
      if (contactPhone === '') {
        this.phoneContact = true
        console.log('联系人手机号不能为空')
        return false
      } else {
        this.phoneContact = false
      }
      if (contactEmail === '') {
        this.emailContact = true
        console.log('业务联系邮箱不能为空')
        return false
      } else {
        this.emailContact = false
      }
      if (provinceId === '') {
        this.idProvince = true
        console.log('省份不能为空')
        return false
      } else {
        this.idProvince = false
      }
      if (cityId === '') {
        this.idCity = true
        console.log('城市不能为空')
        return false
      } else {
        this.idCity = false
      }
      if (address === '') {
        this.idAddress = true
        console.log('街道地址不能为空')
        return false
      } else {
        this.idAddress = false
      }
      // 验证身份证号码
      if (!this.checkIDCard(legalIdCard)) {
        console.log('5555')
        console.log('5555')
        this.cardPersonNum = true
        return false
      } else {
        this.cardPersonNum = false
      };
      // 验证手机号
      if (!this.checkPhones(contactPhone)) {
        this.phoneContactNum = true
        console.log('手机号码错误')
        return false
      } else {
        this.phoneContactNum = false
      };
      // 验证邮箱
      if (!this.fCheckEmail(contactEmail)) {
        this.emailContactNum = true
        console.log('您输入的邮箱格式有误')
        return false
      } else {
        this.emailContactNum = false
      }
      console.log(99)
      console.log(this.$route.query.modifyAgain)
      // 是否修改
      if (this.$route.query.modifyAgain === 'true') {
        let obj = {
          shopId: this.shopId,
          companyId: this.companyId,
          shopName: this.shopName,
          shopNameEn: this.shopNameEn,
          licenseUrl: this.licenseUrl1,
          taxCertUrl: this.taxCertUrl1,
          legalPerson: this.legalPerson,
          legalIdCard: this.legalIdCard,
          icRegNum: this.icRegNum,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          contactEmail: this.contactEmail,
          provinceId: this.provinceId,
          cityId: this.cityId,
          address: this.address
        }
        createShopAPI.updateShopfunc(obj).then(res => {
          if (res.data.code === 0) {
            this.$router.push('/certify')
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        let obj = {
          // shopId: this.shopId,
          // companyId: this.companyId,
          shopName: this.shopName,
          shopNameEn: this.shopNameEn,
          licenseUrl: this.licenseUrl1,
          taxCertUrl: this.taxCertUrl1,
          legalPerson: this.legalPerson,
          legalIdCard: this.legalIdCard,
          icRegNum: this.icRegNum,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          contactEmail: this.contactEmail,
          provinceId: this.provinceId,
          cityId: this.cityId,
          address: this.address
        }
        // 创建店铺
        createShopAPI.createShopfunc(obj).then((res) => {
          console.log(res)
          if (res.data.code === 0) {
            this.$router.push({path: '/certifyPass'})
//            let param = {}
//            LoginAPI.logOut(param).then((res) => {
//              let code = res.data.code
//              if (code === 0) {
//                console.log('555555')
//                this.$router.push({path: '/login'})
//              } else {
//                this.$message.error(res.data.message)
//              }
//            })
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    companyDetail: function () {
      createShopAPI.companyDetail().then(res => {
        if (res.data.code === 0) {
          this.dataCompany = res.data.data.company
          this.dataShop = res.data.data.shop
          this.dataCompanyBusiness = res.data.data.companyBusiness
          this.shopName = this.dataShop.shopName
          this.companyId = this.dataCompany.id
          this.shopNameEn = this.dataShop.shopNameEn
          this.legalPerson = this.dataCompany.legalPerson
          this.legalIdCard = this.dataCompany.legalIdCard
          this.icRegNum = this.dataCompany.icRegNum
          this.contactName = this.dataCompany.contactName
          this.contactPhone = this.dataCompany.contactPhone
          this.contactEmail = this.dataCompany.contactEmail
          this.provinceId = this.dataCompany.provinceId
          this.provinceIdFlag = this.dataCompany.provinceId
          this.cityId = this.dataCompany.cityId
          this.address = this.dataCompany.address
          this.licenseUrl = this.dataCompany.licenseUrlWhole
          this.licenseUrl1 = this.dataCompany.licenseUrl
          this.taxCertUrl = this.dataCompany.taxCertUrlWhole
          this.taxCertUrl1 = this.dataCompany.taxCertUrl
        }
      })
    }
  },
  created () {
    // 获取省份
    createShopAPI.getProvince().then((res) => {
      this.provinceList = res.data.data
    })
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// @import '../../assets/style/variable.less';
// @import '../../assets/style/base.less';
@import '../../assets/style/normalize.less';
// @import '../../assets/style/list.less';
#publics {
    .public () {
       width:1200px;
       margin:0 auto;
    }
}
.createShop{
  width:100%;
  overflow:hidden;
  background: #fff;
}
.head{
  #publics >.public();
  height:84px;
  .clearfix();
  span.img{
    flaot:left;
    width:300px;
    line-height:84px;
    img{
      vertical-align: middle;
    }
  }
  .create{
    font-size: 16px;
    color: #33475c;
    padding-left: 8px;
    vertical-align: middle;
  }
  .line{
    display: inline-block;
    height: 20px;
    border-left: 2px solid #D6D6D6;
    margin-bottom: -8px;
    margin-left: 5px;
  }
  .telphone{
    float:right;
    line-height:84px;
    em{
      color: #5488F9;
      font-size: 32px;
      vertical-align: top;
    }
    .phone{
      display: inline-block;
      font-size: 24px;
      font-weight: bold;
      color: #5488F9;
    }
  }

}
.main{
  #publics >.public();
  border:1px solid #ccc;
  .shop_box{
    h3{
      width:100%;
      height:40px;
      line-height:40px;
      background:#f4f8fa;
      margin-bottom:10px;
      b{
        display: inline-block;
        height: 16px;
        margin: 0 10px 0 10px;
        border-left: 3px solid #5488F9;
      }
      small{
        color: #7b97b7;
        display:inline-block;
        margin-left:10px;
        font-size:12px;
      }
    }
    ul{
      li{
        .clearfix();
        width:100%;
        span{
          float: left;
          display: inline-block;
          width: 145px;
          text-align: right;
          line-height: 34px;
          font-size:12px;
          margin-right:10px;
          b{
            color:#f00;
          }
        }
        .uploader{
          float:left;
          span{
            width:100%;
            display:block;
            font-size:12px;
            color:#ccc;
          }
        }
        span.smallImg{
          float:left;
          cursor:pointer;
          width:178px;
          margin-right:20px;
        }
        .firstCase{
          float:left;
          background: #fff none repeat scroll 0 0;
          box-shadow: 0 0 20px 3px #eaeaea;
          height: 430px;
          text-align: center;
          position:absolute;
          left:710px;
          width: 470px;
          z-index: 100;
          p{
            color: #000;
            font-size: 14px;
            line-height:30px;
            text-align:left;
            text-indent:6px;
          }
          label{
            font-size:12px;
            color:#ccc;
            line-height:30px;
          }
          b{
            background: #333 none repeat scroll 0 0;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            height: 18px;
            line-height: 18px;
            opacity: 0.7;
            position: absolute;
            right: -9px;
            top: -9px;
            width: 18px;
          }
        }
        .secondCase{
          top:150px;
        }
      }
    }
  }
}
.foot{
  #publics >.public()
}
.avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    line-height: 118px;
    text-align: center;
  }
  .bg-avatar-uploader-one{
    /*background: url(../../assets/img/register/icon2.png) center no-repeat;*/
  }
  .bg-avatar-uploader-two{
    /*background: url(../../assets/img/register/icon.png) center no-repeat;*/
  }
  .avatar {
    width: 178px;
    display: block;
    height: 118px;
  }











@c-title:#33475c;
body{
  font-size:13px;
}



#main{
  width:1198px;
  height:1108px;
  border:1px solid #F3F3F3;
  margin: 0 auto;
  .double_row li{
    width:50%;
    float: left;
  }
  ul{
    overflow: hidden;
    width:1140px;
    margin-top:10px;
    li{
      height:34px;
      margin-top: 20px;
      span>b{
        display: inline-block;
        vertical-align: middle;
        margin-left: 3px;
        margin-right: 10px;
        color: #E22B2B;
      }
      .error{
        color: #f00;
        padding-left: 153px;
      }
      input,select{
        width:400px;
        height:34px;
        box-sizing: border-box;
        padding-left:10px;
        outline: none;
      }
      select{
        width:194px;
        color: #4B4B4B;
      }
      .provinceCity{
        select{
          width:194px;
          color: #4B4B4B;
        }
      }
      select.province{
        margin-right: 10px;
      }
      .el-select{
        .el-input{
          .el-input__inner{
            width:194px;
          }
        }
      }
    }
    li>span{
      float:left;
      display: inline-block;
      width: 145px;
      text-align: right;
      line-height: 34px;
    }
    li.title{
      width:100%;
      height:40px;
      line-height:40px;
      background-color:#F4F8FA;
      text-align: left;
      b{
        display: inline-block;
        height:16px;
        margin:0 5px 0 10px;
        border-left:3px solid #5387F9;
      }
      strong{
        font-size:16px;
        margin-right:10px;
        color:@c-title;
      }
      small{
        color:#7b97b7;
      }
    }
    li.license{
      position: relative;
      width:100%;
      height:140px;
      height: 140px;
      line-height: 16px;
      float:left;
      p{
        width:187px;
        color: #7b98b7;
        white-space: nowrap;
      }
      .firstCase{
        position: absolute;
        left: 550px;
        width: 470px;
        height: 430px;
        text-align: center;
        background: #FFF;
        box-shadow: 0 0 20px 3px #EAEAEA;
        z-index: 100;
        b{
          position: absolute;
          top: -9px;
          right: -9px;
          display: inline-block;
          width: 18px;
          height: 18px;
          line-height: 18px;
          font-size: 14px;
          color: #FFF;
          background: #333;
          border-radius: 50%;
          opacity: 0.7;
          cursor: pointer;
        }
        p{
          margin-top: 20px;
          color: #000;
          font-size: 14px;
        }
        span{
          display: block;
          color: #999;
        }
        img{
          width: 436px;
          height: 306px;
          margin-top: 25px;
          margin-bottom: 15px;
          border: 1px solid #EDEDED;
        }
      }
    }
    li.tax{
      position: relative;
      width:100%;
      height:140px;
      .span{
        height: 140px;
        line-height: 16px;
      }
      p{
        width:187px;
        color: #9E9E9E;
        white-space: nowrap;
        color:#7b98b7;
      }
      .upload{
        width: 187px;
        height: 119px;
      }
      .secondCase{
        position: absolute;
        left: 550px;
        width: 470px;
        height: 430px;
        text-align: center;
        background: #FFF;
        box-shadow: 0 0 20px 3px #EAEAEA;
        z-index: 100;
        top:-160px;
        b{
          position: absolute;
          top: -9px;
          right: -9px;
          display: inline-block;
          width: 18px;
          height: 18px;
          line-height: 18px;
          font-size: 14px;
          color: #FFF;
          background: #333;
          border-radius: 50%;
          opacity: 0.7;
          cursor: pointer;
        }
        p{
          margin-top: 20px;
          color: #000;
          font-size: 14px;
        }
        span{
          display: block;
          color: #999;
          height: 18px;
          line-height: 18px;
        }
        img{
          width: 436px;
          height: 306px;
          margin-top: 25px;
          margin-bottom: 15px;
          border: 1px solid #EDEDED;
        }
      }
    }
    li.tax>div>a{
      display: inline-block;
      width: 187px;
      height: 119px;
      background: url(../../assets/img/register/icon2.png) center no-repeat;
    }
    li.license>span,li.tax>.span{
      height: 140px;
      line-height: 16px;
    }
    li.license>div,li.tax>div{
      float:left;
      height:140px;
    }
    li.license>div>a{
      display: inline-block;
      width: 187px;
      height: 119px;
      background: url(../../assets/img/register/icon.png) center no-repeat;
    }
    li.license>strong{
      float:left;
      position:relative;
      width: 187px;
      height: 118px;
      margin-left: 20px;
      background: url(../../assets/img/register/smallImg.jpg) center no-repeat;
      background-size: 187px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    li.tax>strong{
      float:left;
      position:relative;
      width: 187px;
      height: 118px;
      margin-left: 20px;
      background: url(../../assets/img/register/shuiwu01_03.png) center no-repeat;
      background-size:187px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    li.license>strong>a,li.tax>strong>a{
      position:absolute;
      right: 1px;
      bottom: 1px;
      width: 24px;
      height: 24px;
      font-size: 16px;
      background: #6B6B6B;
      color: #C4C4C4;
      vertical-align: middle;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
      /*background: url(../../images/icon.png) no-repeat -914px -811px;*/
    }
    li.license>strong>a.browse,li.tax>strong>a.browse{
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #e7e7e7;
      background: rgba(0,0,0,0.3);
      display: block;
    }
    .contact li{
      width:100%;
    }
  }
  /*
  * 信用保障协议相关样式
  * */
  .clause{
    cursor: pointer;
  .safeguard{
    position: absolute;
    left:50px;
    bottom:40px;
    width:1100px;
    height:440px;
    color:#333;
    background: #FFF;
    border: 1px solid #EBEBEB;
    box-shadow: 0 0 10px 3px #EBEBEB;
    z-index: 1000;
  }
  }
}

/*提交部分*/
#main>div{
  position: relative;
  text-align: center;
  margin-top: 70px;
  a{
    display: inline-block;
    width:16px;
    height:16px;
    vertical-align: bottom;
    margin-right: 2px;
    /*background: url(../../images/icon.png) no-repeat -50px -404px;*/
  }
  a.checked{
    /*background: url(../../images/icon.png) no-repeat -95px -404px;*/
  }
  div.safeguard{
      h2{
        text-align: center;
        margin-bottom: 30px;
      }
      .safe_container{
        margin:20px 40px 40px;
      }
      .closeClause{
        position: absolute;
        right:10px;
        top:16px;
        font-size: 24px;
        color: #9A9A9A;
        cursor: pointer;
      }
      .mainText{
        max-height: 325px;
        overflow-y: auto;
        text-align: left;
        line-height:20px;
        p{
          text-indent: 2em;
          margin-bottom: 8px;
        }
        h5{
          margin-bottom: 8px;
        }
        h6{
          margin-bottom: 8px;
        }
        span{
          margin: 0;
          padding: 0;
          font-weight: bold;
        }
      }
  }
}
/*
* 信用保障协议相关样式
* */
#main>input#submit {
  width:260px;
  height:50px;
  margin-top: 20px;
  margin-left: 465px;
  border-radius: 5px;
  border:none;
  font-size: 18px;
  color:#fff;
  background-color: #5387F9;
  outline: none;
}
#main>input#submit:hover{
  cursor: pointer;
}
</style>
