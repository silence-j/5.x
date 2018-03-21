<template>
  <div class="register-container">
    <img class="bg-image" src="../../assets/img/login/register-bg.png">
    <div class="register-info">
      <div class="login-logo">
        <b class="logo"></b>
      </div>
      <div class="login-info">
        <div class="head">用户注册</div>
        <input name="telephone" v-validate="{ rules: { regex: /^1[0-9]{10}$/} }" :class="{'is-danger': errors.has('telephone') }" placeholder="手机号码" class="telphone input-style" v-model="phoneNum" >
        <div class="v-code">
          <input name="vcode" v-validate="{ rules: { regex: /^.{4}$/} }" :class="{'is-danger': errors.has('vcode') }" class="input-style code" placeholder="校验码"   v-model="vCode">
          <img class="vcode" @click="refreshVcodeUrl" :src="vCodeUrl" alt="">
        </div>
        <div class="tel-code">
          <input name="phoneVcode" v-validate="{ rules: { regex: /^.{4}$/} }" :class="{'is-danger': errors.has('phoneVcode') }" placeholder="手机验证码" class="input-style" v-model="phoneVcode" >
          <span @click="getPhoneVcode" v-show="stoped" class="coder">获取验证码</span>
          <span v-show="!stoped">{{timer + '秒后可重新发送'}}</span>
        </div>
        <div :class="{'is-danger': pwdIsOk=='error'}" class="password_input marginbottom16">
          <input name="password" v-validate="{ rules: { regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/} }" type="password" placeholder="请输入6到20位的密码，须同时含有数字和字母" class="input-style-two setting-psd" v-model="passwd" @blur="pwdValidation()" @focus="pwdValidationRest()" >
          <p class="input-bottom-remid" v-show="pwdIsOk=='error'"><i class="icon-remind"></i>请输入6到20位的密码，须同时含有数字和字母</p>
        </div>
        <div class="rempsd">
          <el-checkbox  v-model="iReadFlag"></el-checkbox>
          <span class="text-check">我已阅读并同意<span @click="showDetail('1')" class="agree-to">《盈店平台服务协议》</span></span>
          <div class="safeguard" v-if="detailShow">
            <div class="safe_container">
              <h2>盈店平台服务协议</h2>
              <b class="closeClause" @click="showDetail('0')">×</b>
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
                <p>因本协议产生的一切争议应由您与盈店的经营者协商解决。协商解决不成的，您同意由杭州龙席网络科技股份有限公司所在地人民法院诉讼解决。</p>
              </div>
            </div>
          </div>
        </div>
        <template v-if="fields.fields.password">
          <div :class="{'is-ok': !errors.any()&&!fields.fields.telephone.clean&&!fields.fields.password.clean&&!fields.fields.vcode.clean&&iReadFlag&&phoneNum&&vCode&&phoneVcode&&passwd}" class="jump-to" @click="register">注册</div>
        </template>
        <p class="register">
          已有账户? <router-link to="login"><span>立即登录>></span></router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginAPI from '@/api/loginAPI'
import '@/assets/js/security'

export default {
  name: 'register',
  data () {
    return {
      /**
       * rsa publickey 初始化参数
       * @type {String}
       */
      rediskey: '',
      exponent: '',
      modulus: '',
      detailShow: false,
      /**
       * 用户名 密码 验证码
       * @type {String}
       */
      phoneNum: this.$route.query.phone || '',
      phoneVcode: '',
      vCode: '',
      vCodeUrl: process.env.DOMAIN + '/bshop/register/captcha/get',
      passwd: '',
      iReadFlag: false,
      stoped: true,
      timer: 60,
      interval: null,
      secAndMore: false, // 第二次按发送按钮
      pwdIsOk: 'ok'
    }
  },
  components: {
  },
  mounted: function () {
    /**
     * 初始化公钥
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    LoginAPI.getRSAPublicKey().then(res => {
      if (res.data.code === 0) {
        let callbackData = res.data.data
        this.rediskey = callbackData.rediskey
        this.exponent = callbackData.exponent
        this.modulus = callbackData.modulus
      } else {
        console.log('初始化公钥失败')
      }
    })
  },
  methods: {
    // 密码验证
    pwdValidation () {
      let msg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (msg.test(this.passwd) === false) {
        this.pwdIsOk = 'error'
      } else {
        this.pwdIsOk = 'ok'
      }
    },
    // 密码验证重置
    pwdValidationRest () {
      this.pwdIsOk = ''
    },

//       协议弹框
    showDetail (type) {
      if (type === '0') {
        this.detailShow = false
      } else {
        this.detailShow = true
      }
    },
    /**
     * 注册
     * @return {[type]} [description]
     */
    register () {
      if (!(!this.errors.any() && !this.fields.fields.telephone.clean && !this.fields.fields.password.clean && !this.fields.fields.vcode.clean && this.iReadFlag && this.phoneNum && this.vCode && this.phoneVcode && this.passwd)) {
        console.log('前端输入验证不通过，点击按钮无效！')
        return
      }
      let postObj = {
        'captcha': this.vCode,
        'password': this.passwd,
        'smsCode': this.phoneVcode,
        'loginAccount': this.phoneNum
      }
      LoginAPI.register(postObj).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.$router.push({ path: '/CreateShop' })
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
     /**
     * 刷新验证码
     * @return {[type]} [description]
     */
    refreshVcodeUrl () {
      this.vCodeUrl = process.env.DOMAIN + '/bshop/register/captcha/get?v=' + new Date().getTime()
    },
    /**
     * 获取手机验证码
     * @return {[type]} [description]
     */
    getPhoneVcode () {
      let postObj = {
        'type': 1,
        'captcha': this.vCode,
        'mobile': this.phoneNum
      }
      LoginAPI.getPhoneVcode(postObj).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          if (this.secAndMore) {
            this.refreshVcodeUrl()
          }
          this.stoped = false
          this.secAndMore = true
          this.timer = 10
          let time = setInterval(() => {
            this.timer--
            if (this.timer < 1) {
              clearInterval(time)
              this.stoped = true
            }
          }, 1000)
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 返回登录页面
     * @return {[type]} [description]
     */
    back () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" >
  @keyframes boxSlideIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes bgSlideIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  .animation(@animation-name, @animation-duration, @animation-delay, @animation-iteration-count, @animation-fill-mode){
    animation: @arguments;
    -webkit-animation: @arguments;
    -moz-animation: @arguments;
    -ms-animation: @arguments;
    -o-animation: @arguments;
  }
  .marginbottom16{
    margin-bottom:16px;
  }
  .register-container{
    position: relative;
    .bg-image{
      position: absolute;
      width: 100%;
      height: 100%;
      .animation(bgSlideIn,3s,0s,1,none);
    }
  }
  .register-info{
    width: 480px;
    height: 100%;
    margin: 30px 0 0 50%;
    transform: translateX(-50%);
    .login-logo{
      text-align: center;
      margin-bottom: 40px;
      .animation(bgSlideIn,3s,0s,1,none);
      .logo{
        display: inline-block;
        width: 300px;
        height: 75px;
        background: url("../../assets/img/login/logo-small.png") no-repeat;
        background-size: contain;
      }
    }
    .login-info{
      width:398px;
      height: 525px;
      background: #FFFFFF;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      margin: 0 auto;
      padding: 33px 40px 0 40px;
      opacity: 0;
      .animation(boxSlideIn,1s,1s,1,forwards);
      .head{
        text-align: center;
        font-size: 18px;
        color: #33475B;
        letter-spacing: 0;
        margin-bottom: 40px;
      }
      .input-style-two{
        width: 396px;
        height: 56px;
        background: #F5F8FA;
        border-radius: 4px;
        font-size: 14px;
        color: #7C98B6;
        border: none;
        text-indent: 16px;
        border:1px solid #F5F8FA;
        box-sizing: border-box;
      }
      .input-style{
          width: 400px;
          height: 56px;
          background: #F5F8FA;
          border-radius: 4px;
          margin: 0 auto 16px;
          font-size: 14px;
          color: #7C98B6;
          border: none;
          padding-left:16px;
          border:1px solid #F5F8FA;
          box-sizing: border-box;
      }
      .input-style:focus{
          border:1px solid #02AAAA;
          outline: none;
      }
     .is-danger{
        border:1px solid #FF3B6E;
        border-radius: 4px;
      }
      .v-code{
        position: relative;
        .code{
          width: 280px;
        }
        .vcode{
          position: absolute;
          top: 0;
          height: 56px;
          width: 120px;
          right: -2px;
        }
      }
      .setting-psd{
        .el-input__inner{
          margin-bottom: 7px;
        }
      }
      .password_input{
        .input-bottom-remid{
          font-size: 12px;
          color: #FF3B6E;
          line-height: 16px;
          padding: 5px 0 7px 10px;
          background: #ffebf0;
        }
      }
      .tel-code{
        position: relative;
        .coder{
          cursor: pointer;
        }
        span{
          position: absolute;
          background: #5488F9;
          border-radius: 0 4px 4px 0;
          width: 120px;
          height: 54px;
          right: -1px;
          top: 1px;
          /* vertical-align: middle; */
          text-align: center;
          line-height: 56px;
          color: #fff;
        }
      }
      .forgotpsd{
        width: 400px;
        font-size: 14px;
        color: #33475B;
        text-align: right;
        padding: 4px 0 8px 0;
        margin: 0 auto;
        text-decoration: underline;
      }
      .rempsd{
        width: 400px;
        margin: 0 auto;
        position: relative;
        .el-checkbox__inner{
          border: 2px solid #CBD6E3;
          border-radius: 2px;
        }
        .text-check{
          font-size: 14px;
          padding-left: 5px;
          .agree-to{
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
      .jump-to{
        width:400px;
        height: 56px;
        line-height: 56px;
        margin: 24px auto 16px;
        background: #EAF0F6;
        border: 1px solid #DFE3EB;
        border-radius: 4px;
        font-size: 18px;
        color: #B0C1D4;
        text-align: center;
        cursor: pointer;
      }
      .jump-to.is-ok{
          background: #5488F9;
          color: #fff;
        }
      .register{
        width:270px;
        padding-left: 130px;
        font-size: 14px;
        color: #666666;
        span:last-child{
          color: #5488f9;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
  /*.login-wraper {*/
    /*width:350px;*/
    /*margin:200px auto;*/
    /*h3{*/
      /*text-align: center;*/
    /*}*/
  /*}*/
  .safeguard{
    position: absolute;
    left:-360px;
    bottom:40px;
    width:1100px;
    height:440px;
    color:#333;
    background: #FFF;
    border: 1px solid #EBEBEB;
    box-shadow: 0 0 10px 3px #EBEBEB;
    z-index: 1000;
  }
  div.safeguard{
    h2{
      text-align: center;
      margin-bottom: 30px;
    }
    .safe_container{
      margin:20px 40px 40px;
      h2{
        color: #5488F9;
      }
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
</style>
