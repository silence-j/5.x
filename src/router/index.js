import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const routeNameFoot = process.env.ROUTE_NAME_FOOT
/**
 * 登录之后主路由
 * @param  {[type]} resolve [description]
 * @return {[type]}         [description]
 */
const pagination = resolve => require(['@/components/pagination'], resolve)
const UserIndex = resolve => require(['@/components/UserIndex'], resolve)
const OrderLogisticSub = resolve => require(['@/components/subNavBars/OrderLogisticsBar'], resolve)
const ContactSub = resolve => require(['@/components/subNavBars/ContactBar'], resolve)
const MonitorSub = resolve => require(['@/components/subNavBars/MonitorBar'], resolve)
const CustomerDevSub = resolve => require(['@/components/subNavBars/CustomerDevBar'], resolve)
const FormBar = resolve => require(['@/components/subNavBars/FormBar'], resolve)
const CreativeSub = resolve => require(['@/components/subNavBars/CreativeBar'], resolve)
const MyHomePageSub = resolve => require(['@/components/subNavBars/MyHomePageBar'], resolve)
const Contact = resolve => require(['@/views/contact/contact'], resolve)
const UploadAttachment = resolve => require(['@/views/contact/uploadAttachment'], resolve)
const Login = resolve => require(['@/views/login/Login'], resolve)
const Forgot = resolve => require(['@/views/login/Forgot'], resolve)
const ReFind = resolve => require(['@/views/login/ReFindPsd'], resolve)
const Register = resolve => require(['@/views/login/Register'], resolve)
const Index = resolve => require(['@/views/index/Index'], resolve)
const PageManagement = resolve => require(['@/views/myHomePage/PageManagement'], resolve)
const websiteStyle = resolve => require(['@/views/myHomePage/websiteStyle'], resolve)
const PagePreview = resolve => require(['@/views/myHomePage/PagePreview'], resolve)
const Explore = resolve => require(['@/views/explore/Explore'], resolve)
const EmailCenter = resolve => require(['@/views/emailExtension/emailCenter'], resolve)
const PpcList = resolve => require(['@/views/explore/cpnts/ppcList'], resolve)
const PpcDetail = resolve => require(['@/views/explore/cpnts/ppcDetail'], resolve)
const Search = resolve => require(['@/views/explore/cpnts/search'], resolve)
const companyDetail = resolve => require(['@/views/explore/cpnts/companyDetail'], resolve)
const Order = resolve => require(['@/views/order/Order'], resolve)
const orderDetail = resolve => require(['@/views/order/orderDetail'], resolve)
const Product = resolve => require(['@/views/product/Product'], resolve)
const Blog = resolve => require(['@/views/blog/blog'], resolve)
const AddBlog = resolve => require(['@/views/blog/addBlog'], resolve)
const EditBlog = resolve => require(['@/views/blog/editBlog'], resolve)
const webCount = resolve => require(['@/views/webCount/webCount'], resolve)
const Shield = resolve => require(['@/views/shield/shield'], resolve)
const ProductModify = resolve => require(['@/views/product/Modify'], resolve)
const ProductCategory = resolve => require(['@/views/product/Category'], resolve)
const Group = resolve => require(['@/views/group/Group'], resolve)
const newsList = resolve => require(['@/views/school/newsList'], resolve)
const articleDetail = resolve => require(['@/views/school/articleDetail'], resolve)
const CreateShop = resolve => require(['@/views/register/CreateShop'], resolve)
const Certify = resolve => require(['@/views/register/cpnts/certify'], resolve)
const CertifyPass = resolve => require(['@/views/register/cpnts/certifyPass'], resolve)
const Back = resolve => require(['@/views/callback/back'], resolve)
const socialMonitor = resolve => require(['@/views/monitor/socialMonitor'], resolve)
const mailMonitor = resolve => require(['@/views/monitor/mailMonitor'], resolve)
const homeMonitor = resolve => require(['@/views/monitor/homeMonitor'], resolve)
// const inquiryMonitor = resolve => require(['@/views/monitor/inquiryMonitor'], resolve)
const SocialMedia = resolve => require(['@/views/monitor/socialMedia/socialMedia'], resolve)
const GroupMedia = resolve => require(['@/views/monitor/groupMedia/groupMedia'], resolve)
const EnquiriesIndex = resolve => require(['@/views/monitor/enquiriesIndex'], resolve)
const Develop = resolve => require(['@/views/develop/findcptns/socialResult'], resolve)
// const ChanceRecommend = resolve => require(['@/views/develop/chanceRecommend'], resolve)
const SearchResult = resolve => require(['@/views/develop/findcptns/searchResult'], resolve)
const SocialResult = resolve => require(['@/views/develop/findcptns/socialResult'], resolve)
const CompanyDetail = resolve => require(['@/views/develop/findcptns/companyDetail'], resolve)
const StaffDetail = resolve => require(['@/views/develop/findcptns/staffDetail'], resolve)
const Extension = resolve => require(['@/views/develop/extension'], resolve)
const EmailMarketing = resolve => require(['@/views/develop/emailMarketing'], resolve)
const PreviewTemplate = resolve => require(['@/views/develop/emailMarket/previewTemplate'], resolve)
const ActivityMarketing = resolve => require(['@/views/develop/ActivityMarketing'], resolve)
const EmailTopMenu = resolve => require(['@/views/develop/emailMarket/emailTopMenu'], resolve)
const SearchList = resolve => require(['@/views/material/searchList'], resolve)
// const EmailMarketAdd = resolve => require(['@/views/develop/emailMarket/emailMarketAdd'], resolve)
// const EmailMarketRecip = resolve => require(['@/views/develop/emailMarket/emailmarketRecip'], resolve)
const BusnessSpy = resolve => require(['@/views/develop/busnessSpy'], resolve)
const BusnessSpyDetail = resolve => require(['@/views/develop/busnessSpy/busnessSpyDetail'], resolve)
const BusnessSpyItemDetail = resolve => require(['@/views/develop/busnessSpy/busnessSpyItemDetail/index'], resolve)
const TradeResult = resolve => require(['@/views/develop/busnessSpy/tradeResult'], resolve)
const TradeSearch = resolve => require(['@/views/develop/busnessSpy/tradeSearch'], resolve)

// const Creative = resolve => require(['@/views/creative/intellAuthor'], resolve)
const IntellAuthor = resolve => require(['@/views/creative/intellAuthor'], resolve)
const Form = resolve => require(['@/views/form/Form'], resolve)
const SetAccount = resolve => require(['@/views/systemSetting/setAccount'], resolve)
const SetMessenger = resolve => require(['@/views/systemSetting/setMessenger'], resolve)
const TrackManage = resolve => require(['@/views/systemSetting/trackManage'], resolve)
const SetCompany = resolve => require(['@/views/systemSetting/setCompany'], resolve)
const SetKeyWord = resolve => require(['@/views/systemSetting/setKeyWord'], resolve)
const ChannelList = resolve => require(['@/views/systemSetting/channelList'], resolve)
const SystemIndex = resolve => require(['@/views/systemSetting/systemIndex'], resolve)
const FundsManagement = resolve => require(['@/views/orderLogistics/funds/fundsManagement'], resolve)
const LogisticsManagement = resolve => require(['@/views/orderLogistics/logistics/logisticsManagement'], resolve)
const LogisticsEdit = resolve => require(['@/views/orderLogistics/logistics/logisticsEdit'], resolve)
const LogisticsSetAddress = resolve => require(['@/views/orderLogistics/logistics/setAddress'], resolve)
const BindAccount = resolve => require(['@/views/orderLogistics/funds/bindAccount'], resolve)
const PagerEditor = resolve => require(['@/views/myHomePage/pagerEditor/pagerEditor'], resolve)
const ContactDetail = resolve => require(['@/views/contact/contactDetail/contactDetail'], resolve)
const MailList = resolve => require(['@/views/mail/mailList'], resolve)
const MailDetail = resolve => require(['@/views/mail/mailDetail'], resolve)
const SetMulAccount = resolve => require(['@/views/systemSetting/multipleAccounts/setMulAccount'], resolve)
const AccountStatistics = resolve => require(['@/views/systemSetting/multipleAccounts/accountStatistics'], resolve)
// const editMail = resolve => require(['@/views/develop/emailMarket/editMail'], resolve)
const sendSuccess = resolve => require(['@/views/develop/emailMarket/sendSuccess'], resolve)
const addActivity = resolve => require(['@/views/develop/addActivity'], resolve)

// 素材库router
const materialIndex = resolve => require(['@/views/material/materialBox'], resolve)
export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录' + routeNameFoot,
      component: Login
    },
    {
      path: '/',
      name: '登录' + routeNameFoot,
      component: Login
    },
    {
      path: '/forgot',
      name: '忘记密码' + routeNameFoot,
      component: Forgot
    },
    {
      path: '/reFind',
      name: '重置密码' + routeNameFoot,
      component: ReFind
    },
    {
      path: '/register',
      name: '注册' + routeNameFoot,
      component: Register
    },
    {
      path: '/CreateShop',
      name: '创建店铺' + routeNameFoot,
      component: CreateShop
    },
    {
      path: '/certify',
      name: '认证' + routeNameFoot,
      component: Certify
    },
    {
      path: '/certifyPass',
      name: '认证' + routeNameFoot,
      component: CertifyPass
    },
    {
      path: '/newsList',
      name: '小学堂' + routeNameFoot,
      component: newsList
    },
    {
      path: '/articleDetail/:Id',
      name: 'articleDetail' + routeNameFoot,
      component: articleDetail
    },
    {
      path: '/preview',
      name: '预览' + routeNameFoot,
      component: PreviewTemplate
    },
    {
      path: '/userIndex',
      name: '登陆后主页模板' + routeNameFoot,
      component: UserIndex,
      children: [
        {
          path: '/busnessSpyItem',
          name: '外贸侦探详情' + routeNameFoot,
          component: BusnessSpyItemDetail
        },
        {
          path: '/contactDetail',
          name: '联系人管理' + routeNameFoot,
          component: ContactDetail
        },
        {
          path: '/pagerEditor',
          name: '官网编辑页' + routeNameFoot,
          component: PagerEditor
        },
        {
          path: '/ppcDetail',
          name: '精准推荐' + routeNameFoot,
          component: PpcDetail
        },
        {
          path: '/orderDetail/:orderid',
          name: '订单详情' + routeNameFoot,
          component: orderDetail
        },
        {
          path: '/ProductModify/:itemId/:status/:ismodify/:isback',
          name: '新增产品' + routeNameFoot,
          component: ProductModify
        },
        {
          path: '/category/:itemId/:name',
          name: '产品分类' + routeNameFoot,
          component: ProductCategory
        },
        {
          path: '/orderLogisticSub',
          name: '订单物流主页面' + routeNameFoot,
          component: OrderLogisticSub,
          children: [
            {
              path: '/fundsManagement',
              name: '资金管理' + routeNameFoot,
              component: FundsManagement
            },
            {
              path: '/logisticsManagement',
              name: '物流管理' + routeNameFoot,
              component: LogisticsManagement
            },
            {
              path: '/logisticsEdit/:lid',
              name: '编辑物流模板' + routeNameFoot,
              component: LogisticsEdit
            },
            {
              path: '/logisticsSetAddress',
              name: '编辑物流地址' + routeNameFoot,
              component: LogisticsSetAddress
            },
            {
              path: '/order',
              name: '订单管理' + routeNameFoot,
              component: Order
            },
            {
              path: '/bindAccount',
              name: 'BindAccount' + routeNameFoot,
              component: BindAccount
            }
          ]
        },
        {
          path: '/contactSub',
          name: '联系人管理 ' + routeNameFoot,
          component: ContactSub,
          children: [
            {
              path: '/contact',
              name: '联系人管理  ' + routeNameFoot,
              component: Contact
            }
          ]
        },
        {
          path: '/uploadAttachment',
          name: '上传附件' + routeNameFoot,
          component: UploadAttachment
        },
        {
          path: '/monitorSub',
          name: '全网监控二级菜单' + routeNameFoot,
          component: MonitorSub,
          children: [
            {
              path: '/socialMonitor',
              name: '社交监控' + routeNameFoot,
              component: socialMonitor
            },
            {
              path: '/homeMonitor',
              name: '官网监控' + routeNameFoot,
              component: homeMonitor
            },
            {
              path: '/mailMonitor',
              name: '邮件监控' + routeNameFoot,
              component: mailMonitor
            },
            {
              path: '/socialMedia',
              name: '社媒监控',
              component: SocialMedia
            },
            {
              path: '/groupMedia',
              name: '群组监控',
              component: GroupMedia
            }
          ]
        },
        {
          path: '/customerSub',
          name: '客户开发二级菜单' + routeNameFoot,
          component: CustomerDevSub,
          children: [
            {
              path: '/develop',
              name: '客户开发' + routeNameFoot,
              component: Develop
            },
            {
              path: '/extension',
              name: '社交推广' + routeNameFoot,
              component: Extension
            },
            {
              path: '/enquiriesIndex',
              name: '询盘池 ',
              component: EnquiriesIndex
            },
            {
              path: '/emailmarketing',
              name: '邮件推广' + routeNameFoot,
              component: EmailMarketing
            },
            {
              path: '/ActivityMarketing',
              name: '活动营销' + routeNameFoot,
              component: ActivityMarketing
            },
            {
              path: '/addActivity',
              name: '创建活动' + routeNameFoot,
              component: addActivity
            },
            {
              path: '/tradeDetect',
              name: '外贸侦探' + routeNameFoot,
              component: BusnessSpy
            }
            // {
            //   path: '/emailmarketAdd',
            //   name: '新建邮件推广',
            //   component: EmailMarketAdd
            // },
            // {
            //   path: '/emailmarketRecip',
            //   name: '联系人选择',
            //   component: EmailMarketRecip
            // }
          ]
        },
        {
          path: '/creativeSub',
          name: '创意中心' + routeNameFoot,
          component: CreativeSub,
          children: [
            {
              path: '/intellAuthor',
              name: '智能作家' + routeNameFoot,
              component: IntellAuthor
            },
            {
              path: '/blog',
              name: 'Blog' + routeNameFoot,
              component: Blog
            },
            {
              path: '/searchList',
              name: '图源搜索' + routeNameFoot,
              component: SearchList
            },
            {
              path: '/material',
              name: '素材库' + routeNameFoot,
              component: materialIndex
            }
          ]
        },
        {
          path: '/formSub',
          name: '统计报表' + routeNameFoot,
          component: FormBar,
          children: [
            {
              path: '/form',
              name: '统计报表' + routeNameFoot,
              component: Form
            }
          ]
        },
        {
          path: '/addBlog',
          name: '新增Blog' + routeNameFoot,
          component: AddBlog
        },
        {
          path: '/editBlog/:blogId',
          name: '编辑Blog' + routeNameFoot,
          component: EditBlog
        },
        {
          path: '/tradeDetectDetail',
          name: '外贸侦探详情' + routeNameFoot,
          component: BusnessSpyDetail
        },
        {
          path: '/tradeResult',
          name: '外贸搜索结果' + routeNameFoot,
          component: TradeResult
        },
        {
          path: '/tradeSearch',
          name: '外贸搜索结果页' + routeNameFoot,
          component: TradeSearch
        },
        {
          path: '/searchResult',
          name: '搜索结果页' + routeNameFoot,
          component: SearchResult
        },
        {
          path: '/socialResult',
          name: '社交搜索结果页' + routeNameFoot,
          component: SocialResult
        },
        {
          path: '/companyDetail',
          name: '公司详情页' + routeNameFoot,
          component: CompanyDetail
        },
        {
          path: '/staffDetail',
          name: '员工详情页' + routeNameFoot,
          component: StaffDetail
        },
        {
          path: '/myHomePageSub',
          name: '我的官网' + routeNameFoot,
          component: MyHomePageSub,
          children: [
            {
              path: '/product',
              name: '产品列表' + routeNameFoot,
              component: Product
            },
            // {
            //   path: '/ProductModify/:itemId/:status/:ismodify/:isback',
            //   name: '新增产品',
            //   component: ProductModify
            // },
            // {
            //   path: '/category/:itemId/:name',
            //   name: '产品分类',
            //   component: ProductCategory
            // },
            {
              path: '/group',
              name: '分组管理' + routeNameFoot,
              component: Group
            },
            {
              path: '/pageManagement',
              name: '页面管理' + routeNameFoot,
              component: PageManagement
            },
            {
              path: '/websiteStyle',
              name: '官网风格' + routeNameFoot,
              component: websiteStyle
            },
            {
              path: '/webCount',
              name: '官网统计' + routeNameFoot,
              component: webCount
            }
          ]
        },
        {
          path: '/pagePreview',
          name: 'PagePreview' + routeNameFoot,
          component: PagePreview
        },
        {
          path: '/index',
          name: '工作台' + routeNameFoot,
          component: Index
        },
        {
          path: '/explore',
          name: 'Explore' + routeNameFoot,
          component: Explore
        },
        {
          path: '/emailCenter',
          name: '邮件营销' + routeNameFoot,
          component: EmailCenter
        },
        {
          path: '/search',
          name: 'Search' + routeNameFoot,
          component: Search
        },
        {
          path: '/ppcList',
          name: 'ppcList' + routeNameFoot,
          component: PpcList
        },
        {
          path: '/companyDetail',
          name: 'companyDetail' + routeNameFoot,
          component: companyDetail
        },
        {
          path: '/back/:type',
          name: 'back' + routeNameFoot,
          component: Back
        },
        {
          path: '/setAccount',
          name: '账户设置' + routeNameFoot,
          component: SetAccount
        },
        {
          path: '/trackManage',
          name: '跟踪代码管理' + routeNameFoot,
          component: TrackManage
        },
        {
          path: '/setCompany',
          name: '公司设置' + routeNameFoot,
          component: SetCompany
        },
        {
          path: '/setKeyword',
          name: '关键字设置' + routeNameFoot,
          component: SetKeyWord
        },
        {
          path: '/setMessenger',
          name: 'Messenger管理' + routeNameFoot,
          component: SetMessenger
        },
        {
          path: '/channelList',
          name: '渠道列表' + routeNameFoot,
          component: ChannelList
        },
        {
          path: '/systemIndex',
          name: '系统设置' + routeNameFoot,
          component: SystemIndex
        },
        {
          path: '/setMulAccount',
          name: '多账号设置' + routeNameFoot,
          component: SetMulAccount
        },
        {
          path: '/accountStatistics',
          name: '子账号统计' + routeNameFoot,
          component: AccountStatistics
        },
        {
          path: '/mailList',
          name: '收件箱' + routeNameFoot,
          component: MailList
        },
        {
          path: '/mailDetail',
          name: '邮件详情' + routeNameFoot,
          component: MailDetail
        },
        {
          path: '/emailTopMenu',
          name: '联系人选择' + routeNameFoot,
          component: EmailTopMenu
        },
        {
          path: '/sendSuccess',
          name: '发送成功' + routeNameFoot,
          component: sendSuccess
        },
        {
          path: '/shield',
          name: '外贸侦探' + routeNameFoot,
          component: Shield
        },
        {
          path: '/pagination',
          name: '分页控件' + routeNameFoot,
          component: pagination
        }
      ]
    }
  ]
})
