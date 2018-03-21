<template>
  <div>
    <div class="probation" v-show="probation">
      试用到期时间 : {{probationDate | time-formater-no-hour}},  请联系0571-5658  1798开通正式服务
    </div>
    <div class="helper-wechat">
      <div class="helper" @click="downloadHelper">
        <i class="icon-font tip-icon">&#xe6d5;</i>
        <div class="tip-text">盈店小助手</div>
        <div class="tip-box">
          <p>点击安装 盈店小助手</p>
          <p>一键导入Facebook好友</p>
        </div>
      </div>
      <div class="we-app">
        <i class="icon-font tip-icon">&#xe6d3;</i>
        <div class="tip-text">盈店小程序</div>
        <div class="tip-box">
          <img src="../../assets/img/index/coding.jpg" alt="">
        </div>
      </div>
      <div class="to-top" @click="toTop">
        <i class="icon-font top-arrow">&#xe609;</i>
        <div class="tip-text">返回顶部</div>
      </div>
    </div>
    <div class="view-container">
      <div class="contact-conversion">
        <div class="contact-loading" v-if="isLoading.contact">
          <div class="c-l-body" v-if="isLoading.contact">
            <div class="c-l-body1" v-if="isLoading.contact && isLoading.contactLeft">
              <div class="c-l-body_funnel">
                <div class="c_funnel">
                  <div class="c_funnel_body c-loading"></div>
                </div>
                <div class="c_funnel">
                  <div class="c_funnel_body c-loading"></div>
                </div>
                <div class="c_funnel">
                  <div class="c_funnel_body c-loading"></div>
                </div>
                <div class="c_funnel">
                  <div class="c_funnel_body c-loading"></div>
                </div>
                <div class="c_funnel">
                  <div class="c_funnel_body c-loading"></div>
                </div>
              </div>
              <div class="c-l-number">
                <div class="c-l_p c-loading"></div>
                <div class="c-l_p c-loading"></div>
                <div class="c-l_p c-loading"></div>
                <div class="c-l_p c-loading"></div>
                <div class="c-l_p c-loading"></div>
              </div>
            </div>
            <div class="c-l-body2" v-if="isLoading.contact">
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
              <div class="c-l-data">
                <div class="loading loading-circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="filter-select">
            <el-select v-show="showAccout" class="fr" v-model="contactOption" placeholder="全部账号" @change="contactSelect">
              <el-option
                class="aco-option"
                v-for="(option,index) in accountTeamList"
                :label="option.name"
                :key="index"
                :value="option">
              </el-option>
            </el-select>
            <div class="fr select" id="contactDaysSelect">
              <div @click="changeContactDays(7)" class="flow-recent" :class="{'selected': contactDays === 7}">最近7天</div>
              <div @click="changeContactDays(30)" class="flow-recent" :class="{'selected': contactDays === 30}">最近30天</div>
            </div>
          </div>
          <div class="block-title">
            联系人转化
          </div>
          <div class="contact-wrap">
            <div class="funnel-wrap">
              <div id="funnel"></div>
              <ul class="funnel-number">
                <li>
                  <span class="f-number">
                    <span @click="toContactIndex(1)">{{contactListData.potential}}人</span>
                    <!-- <span class="f-n-change"><i v-if="contactListData.offsetPotential">+{{contactListData.offsetPotential}}</i>0</span> -->
                  </span>
                  <div class="f-line f-1"></div>
                </li>
                <li>
                  <span class="f-number">
                    <span @click="toContactIndex(2)">{{contactListData.intention}}人</span>
                    <!-- <span class="f-n-change"><i v-if="contactListData.offsetIntention">+{{contactListData.offsetIntention}}</i>0</span> -->
                  </span>
                  <div class="f-line f-2"></div>
                </li>
                <li>
                  <span class="f-number">
                    <span @click="toContactIndex(3)">{{contactListData.following}}人</span>
                    <!-- <span class="f-n-change"><i v-if="contactListData.offsetFollowing">+{{contactListData.offsetFollowing}}</i>0</span> -->
                  </span>
                  <div class="f-line f-3"></div>
                </li>
                <li>
                  <span class="f-number">
                    <span @click="toContactIndex(4)">{{contactListData.demo}}人</span>
                    <!-- <span class="f-n-change"><i v-if="contactListData.offsetDemo">+{{contactListData.offsetDemo}}</i>0</span> -->
                  </span>
                  <div class="f-line f-4"></div>
                </li>
                <li>
                  <span class="f-number">
                    <span @click="toContactIndex(5)">{{contactListData.won}}人</span>
                    <!-- <span class="f-n-change"><i v-if="contactListData.offsetWon">+{{contactListData.offsetWon}}</i>0</span> -->
                  </span>
                  <div class="f-line f-5"></div>
                </li>
              </ul>
            </div>
            <div class="funnel-data">
              <div class="contact-data">
                <div class="contact-number" @click="toContactType(0)">{{contactChangeData.won}}</div>
                <div class="contact-detail">最近转化
                  <el-tooltip effect="dark" content="最近联系人阶段获得提升的联系人数量" placement="top">
                    <i class="icon-font">&#xe6ed;</i>
                  </el-tooltip>
                </div>
              </div>
              <div class="contact-data">
                <div class="contact-number" @click="toContactType(1)">{{contactChangeData.potential}}</div>
                <div class="contact-detail">最近新增
                  <el-tooltip effect="dark" content="最近新增及被分配的联系人数量" placement="top">
                    <i class="icon-font">&#xe6ed;</i>
                  </el-tooltip>
                </div>
              </div>
              <div class="contact-data">
                <div class="contact-number" @click="toContactType(2)">{{contactChangeData.transferInto}}</div>
                <div class="contact-detail">最近转入
                  <el-tooltip effect="dark" content="最近被主账号分配的联系人数量" placement="top">
                    <i class="icon-font">&#xe6ed;</i>
                  </el-tooltip>
                </div>
              </div>
              <div class="contact-data">
                <div class="contact-number" @click="toHomeMonitor">{{contactChangeData.logined}}</div>
                <div class="contact-detail">最近登录</div>
              </div>
              <div class="contact-data">
                <div class="contact-number" @click="toInquiry">{{contactChangeData.msgProduct}}</div>
                <div class="contact-detail">最近询盘</div>
              </div>
              <div class="contact-data">
                <div class="contact-number" @click="toContactType(3)">{{contactChangeData.contactsTotal}}</div>
                <div class="contact-detail">联系人总数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--最近客户动态模块-->
      <div class="dynamic">
        <div class="loading-dy" v-if="isLoading.dynamic">
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
          <div class="loading-div"></div>
        </div>
        <div>
          <el-select class="filter-select" v-show="showAccout" v-model="dynamicOption" placeholder="全部账号" @change="dynamicSelect">
            <el-option
              class="aco-option"
              v-for="(option,index) in accountTeamList"
              :label="option.name"
              :key="index"
              :value="option">
            </el-option>
          </el-select>
          <div class="d-name">最近客户动态</div>
          <div class="d-data">
            <div class="d-title">
              <li class="recently">最近动态</li>
              <li class="name">联系人</li>
              <li class="stage">所属阶段</li>
              <li class="userName">所属人</li>
              <li class="time">时间</li>
            </div>
            <div class="d-list" v-if="dynamicPage.totalCount > 0" v-for="item in dynamicData" :key="item">
              <li class="recently" @click="toContactIt(item.contactId)">
                <!--邮件追踪-->
                <span v-if="item.socialType === 0">
                  <span v-if="item.socialContent.mailMarketingFlag && item.socialContent.trackType === 0">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 打开了营销邮件 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                  </span>
                  <span v-if="item.socialContent.mailMarketingFlag && item.socialContent.trackType === 1">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 点击了营销邮件中的链接 <span class="textColor" :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                  </span>
                  <span v-if="item.socialContent.mailMarketingFlag === false && item.socialContent.trackType === 0">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 打开了邮件 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                  </span>
                  <span v-if="item.socialContent.mailMarketingFlag === false && item.socialContent.trackType === 1">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 点击了邮件中的链接 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.emailTitle}}</span>
                  </span>
                </span>
                <!--邮件收发(发邮件)-->
                <span v-if="item.socialType===1&&(item.socialContent).emailType==1">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 发送了一封邮件给 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{(item.socialContent).contactName}}（{{(item.socialContent).contactEmail}}）</span>
                </span>
                <!--邮件收发(收邮件)-->
                <span v-if="item.socialType===1&&(item.socialContent).emailType==0">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 收到了一封邮件来自 <span class="textColor">{{(item.socialContent).contactName}}（{{(item.socialContent).contactEmail}}）</span>
                </span>
                <!--社交信息（facebook）-->
                <span v-if="item.socialType===2&&item.socialContent.actionType===2&&(item.socialContent.source===1||item.socialContent.source===2)">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'"><em class="icon-font icon-facebook"></em> {{item.firstName}}{{item.lastName}}</span>  在Facebook上给你发了1条私信
                </span>
                <!--社交信息（twitter@提到）-->
                <span v-if="item.socialType===2&&item.socialContent.source===3&&(item.socialContent.bindingAccount === item.socialContent.receiverId)">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'"><span class="icon-font" style="color:#48B3FE;">&#xe6d2;</span> {{item.firstName}}{{item.lastName}}(@{{item.socialContent.senderAccountName || ''}})</span> 在Twitter上@了
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.receiverAccountName}})</span>
                </span>
                <!--社交信息(我 @ 提到别人)-->
                <span v-if="item.socialType===2&&item.socialContent.source===3&&(item.socialContent.bindingAccount === item.socialContent.senderId)&&(item.socialContent.senderId!==item.socialContent.receiverId)">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.senderAccountName}})</span> 在Twitter上@了
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}(@{{item.socialContent.receiverAccountName || ''}})</span>
                </span>
                <!--社交信息（twitter私信 对方发我）-->
                <span v-if="item.socialType===2&&item.socialContent.source===4&&item.socialContent.bindingAccount === item.socialContent.receiverId">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">
                    <span class="icon-font" style="color:#48B3FE;">&#xe6d2;</span> {{item.firstName}}{{item.lastName}}(@{{item.socialContent.senderAccountName || ''}})</span>
                  <span> 在Twitter上给 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你(@{{item.socialContent.receiverAccountName}})</span> 发了一条私信</span>
                </span>
                <!--社交信息 (twitter私信 我发对方)-->
                <span v-if="item.socialType===2&&item.socialContent.source===4&&item.socialContent.bindingAccount === item.socialContent.senderId">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你 (@{{item.socialContent.senderAccountName}})</span> 在Twitter上给
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}(@{{item.socialContent.receiverAccountName}})</span> 发了一条私信
                </span>
                <!--询盘信息-->
                <span v-if="item.socialType === 3">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.detail.firstName}}{{item.socialContent.detail.lastName}}</span> 在 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.source}}</span> 提交了一份询盘
                </span>
                <!--备注-->
                <span v-if="item.socialType === 4">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">你</span> 记录了一份关于 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.contactName}}</span> 的备注
                </span>
                <!--合并记录-->
                <span v-if="item.socialType === 5">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.newName}}</span> 与 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.oldName}}（{{item.socialContent.oldEmail}}）</span> 合并
                </span>
                <!--阶段变更-->
                <span v-if="item.socialType === 6">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.contactName}}</span> 状态更改为 <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.status | stageFilter}}</span>
                </span>
                <!--系统消息-->
                <span v-if="item.socialType === 7">
                  <span v-if="item.socialContent.commercialOpportunityFlag">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span>
                    通过商机推荐被创建
                  </span>
                  <span v-else>
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span>
                    通过
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.socialContent.createSource}}</span>
                    被创建
                  </span>
                </span>
                <!--海关信息-->
                <span v-if="item.socialType === 8">
                    <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 有一条海关数据
                </span>
                <!--联系人待补全消息-->
                <span v-if="item.socialType === 9">
                  <span>多个数据字段有更新数据</span>
                </span>
                <!--联系人已补全消息-->
                <span v-if="item.socialType === 10">
                  <span>多个数据字段补充完成</span>
                </span>
                <!--访问了官网-->
                <span v-if="item.socialType === 11">
                  <span :class="item.readFlag === 0 ? 'textBold' : 'textColor'">{{item.firstName}}{{item.lastName}}</span> 访问了官网
                </span>
              </li>
              <li class="name" @click="toContactIt(item.contactId)">{{item.firstName}}{{item.lastName}}</li>
              <li class="stage">{{item.stage}}</li>
              <li class="userName">{{item.belongToUserName}}</li>
              <li class="time">{{item.createTime | time-formater-no-second}}</li>
            </div>
            <div class="dynamic-page page-center" v-if="dynamicPage.totalCount > 5">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="dynamicPageChange"
                :current-page="dynamicPage.page"
                :page-size="dynamicPage.pageSize"
                :total="dynamicPage.totalCount">
              </el-pagination>
            </div>
            <div class="no-data" v-if="!dynamicPage.totalCount">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- 邮件營銷效果 -->
      <div class="inquire-customer inquire-box" v-if="serverLevel !== '0'">
        <el-select class="filter-select" v-show="showAccout" v-model="mailOption" :placeholder="userName" @change="mailSelect">
          <el-option
            class="aco-option"
            v-for="(option,index) in accountList"
            :label="option.name"
            :key="index"
            :value="option">
          </el-option>
        </el-select>
        <div class="block-title mail-title">
          邮件营销效果
        </div>
        <div class="text-loading" v-if="isLoading.marketList">
          <div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
          </div>
        </div>
        <div class="none-data-tipBtn" v-if="marketListData.length === 0">
          <p class="none-data-p">暂无数据<span v-if="mailIsAccount">，请先<span class="viewMoreSpan" @click="viewMoreMail">创建营销邮件</span></span></p>
          <!-- <el-button class="index-button" @click="viewMoreMail">创建邮件营销</el-button> -->
        </div>
        <div class="table-tmpl table-tmpl-off" style="width: 592px;">
          <el-table
            :data="marketListData"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="营销邮件名称"
              width="190">
            </el-table-column>
            <el-table-column
              prop="arrivePer"
              label="送达率"
              width="94">
            </el-table-column>
            <el-table-column
              prop="readPer"
              label="阅读率"
              width="94">
            </el-table-column>
            <el-table-column
              prop="hitPer"
              label="点击率"
              width="92">
            </el-table-column>
            <el-table-column
              prop="queryName"
              label="所属人"
              width="120">
            </el-table-column>
          </el-table>
          <div class="view-more-link">
            <div v-if="marketListData.length > 0" class="condition-day view-more" @click="viewMoreMail">查看更多 ></div>
          </div>
        </div>
      </div>
      <!-- 活动营销统计 -->
      <div class="inquire-customer inquire-box right" v-if="serverLevel !== '0'">
        <el-select class="filter-select" v-show="showAccout" v-model="activityOption" placeholder="全部账号" @change="activitySelect">
          <el-option
            class="aco-option"
            v-for="(option,index) in accountTeamList"
            :label="option.name"
            :key="index"
            :value="option">
          </el-option>
        </el-select>
        <div class="block-title mail-title">
          活动营销统计
        </div>
        <div class="text-loading" v-if="isLoading.activityList">
          <div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
            <div class="loading-tr"></div>
          </div>
        </div>
        <div class="none-data-tipBtn" v-if="activityListData.length === 0">
          <p class="none-data-p">暂无数据<span v-if="activityIsAccount">，请先<span class="viewMoreSpan" @click="viewMoreActivity">创建营销活动</span></span></p>
          <!-- <el-button class="index-button" @click="viewMoreActivity">创建活动营销</el-button> -->
        </div>
        <div class="table-tmpl table-tmpl-off" style="width: 592px;">
          <el-table
            :data="activityListData"
            style="width: 100%">
            <el-table-column
              prop="activityTitle"
              label="营销活动名称"
              width="190">
            </el-table-column>
            <el-table-column
              prop="pv"
              label="pv"
              width="94">
            </el-table-column>
            <el-table-column
              prop="uv"
              label="uv"
              width="94">
            </el-table-column>
            <el-table-column
              prop="hits"
              label="点击数"
              width="92">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="所属人"
              width="120">
            </el-table-column>
          </el-table>
          <div class="view-more-link">
            <div v-if="activityListData.length > 0" class="condition-day view-more" @click="viewMoreActivity">查看更多 ></div>
          </div>
        </div>
      </div>
      <!--商机推荐start-->
      <div class="chance_recommend_list margin-top16 home-chance" v-if="chanceList.length>0 && ChanceRight() && serverLevel=='1'">
        <div class="block-title">
          商机推荐
        </div>
        <ChanceCarouselTwo :chanceList="chanceList" @updatePie="pieCount"></ChanceCarouselTwo>
        <div class="fr"><router-link to="/enquiriesIndex"><div class="condition-day view-more">查看更多 &gt;&gt;</div></router-link></div>
      </div>
      <!--商机推荐end-->
      <!--流量概览模块-->
      <div class="flow-browse">
        <div class="flow-title">
          <!--<a href="" class="title">流量概览</a>-->
          <router-link :to="{path: 'webCount'}"><span class="title">流量概览</span></router-link>
          <div class="fr select" id="browseSelect">
            <div @click="changeFlowDays(7)" class="flow-recent" :class="{'selected': flowDays === 7}">最近7天</div>
            <div @click="changeFlowDays(30)" class="flow-recent" :class="{'selected': flowDays === 30}">最近30天</div>
          </div>
        </div>
        <div class="flow-data" v-if="isLoading.flowLoading">
          <li><p class="data-loading"></p><p class="name">浏览次数(PV)</p><span class="line"></span></li>
          <li><p class="data-loading"></p><p class="name">独立访客(UV)</p><span class="line"></span></li>
          <li><p class="data-loading"></p><p class="name">平均访问时长(时:分:秒)</p><span class="line"></span></li>
          <li><p class="data-loading"></p><p class="name">平均浏览页数</p><span class="line"></span></li>
          <li><p class="data-loading"></p><p class="name">询盘量</p></li>
        </div>
        <div class="flow-data" v-if="!isLoading.flowLoading">
          <li><p class="data">{{pvVal}}</p><p class="name">浏览次数(PV)</p><span class="line"></span></li>
          <li><p class="data">{{uvVal}}</p><p class="name">独立访客(UV)</p><span class="line"></span></li>
          <li><p class="data">{{avgTime | time-formater-second-hour}}</p><p class="name">平均访问时长(时:分:秒)</p><span class="line"></span></li>
          <li><p class="data">{{avgPage}}</p><p class="name">平均浏览页数</p><span class="line"></span></li>
          <li><p class="data">{{quiryCount}}</p><p class="name">询盘量</p></li>
        </div>
      </div>
      <!-- 网站统计模块 -->
      <div class="web-info">
        <div class="block-title">
          <router-link :to="{path: 'webCount'}">网站统计</router-link>
          <el-tooltip class="item" effect="dark" content="统计您网站的流量" placement="top">
            <span class="icon-font title-icon">&#xe6ed;</span>
          </el-tooltip>
          <div class="fr select" id="webDaysSelect">
            <div @click="changeStaticsDays(7)" class="condition-day" :class="{'selected': webStaticDays === 7}">最近7天</div>
            <div @click="changeStaticsDays(30)" class="condition-day" :class="{'selected': webStaticDays === 30}">
              最近30天
            </div>
          </div>
        </div>
        <div class="text-loading" v-if="isLoading.webStatics">
          <div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-item">
              <div class="static-title"></div>
              <div class="static-content"></div>
            </div>
            <div class="static-chart"></div>
            <div class="static-chart"></div>
          </div>
        </div>
        <div class="static-all clearfix" v-if="!isLoading.webStatics">
          <div><label>访问</label><p>{{webStatics.uv}}</p></div>
          <div class="static-mid"><label>{{webStatics.conversionRate}} %</label><i class="icon-bgarr"></i></div>
          <div><label>询盘</label><p>{{webStatics.msgProductCount}}</p></div>
        </div>
        <div class="static-wraper" v-show="!isLoading.webStatics">
          <div id="web-chart" class="static-chart"></div>
          <div id="web2-chart" class="static-chart"></div>
        </div>
      </div>
      <!-- 当前在线模块 -->
      <div class="inquire-customer">
        <div class="block-title">
          当前在线
          <span class="small-tip">（{{sixty}}s后更新数据）</span>
        </div>
        <div class="text-loading online" v-if="isLoading.currOnline">
          <div class="curr-static">
            <em></em>
            <span></span>
            <p></p>
          </div>
          <div class="lastest-15">
            <p></p>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="curr-static" v-else>
          <em>最近1分钟({{currOnlineData.lastMinute}})</em>
          <span>您网站上有<i class="big-num">{{currOnlineData.uv}}</i>位独立访客</span>
          <p class="curr-static-high"><span>今日最高：<i>{{currOnlineData.maxUv}}</i>（发生时间:  {{currOnlineData.maxUvTime?currOnlineData.maxUvTime.split(' ')[1]: ''}}）</span></p>
        </div>
        <div class="lastest-15" v-if="!isLoading.currOnline">
          <p class="tiny-tit">最近15分钟</p>
          <span>浏览次数：<em>{{currOnlineData.pvInLastXmin}}</em></span>
          <span>独立访客：<em>{{currOnlineData.uvInLastXmin}}</em></span>
          <span>IP：<em>{{currOnlineData.ipInLastXmin}}</em></span>
        </div>
      </div>
      <!-- 生日提醒模块 -->
      <div class="birthday-block">
        <div class="block-title">
          生日提醒
          <el-tooltip class="item" effect="dark" content="很方便的了解您联系人的生日动态" placement="top">
            <span class="icon-font title-icon">&#xe6ed;</span>
          </el-tooltip>
        </div>
        <div class="text-loading birthday" v-if="isLoading.birthday">
          <div class="b-item" v-for="bItem in [1,2,3,4]" :key="bItem">
            <div class="b-close">
            </div>
            <div class="b-head">
            </div>
            <div class="b-name"></div>
            <div class="b-job"></div>
            <div class="b-job-title"></div>
            <div class="b-time"></div>
            <div class="b-mail-btn-bg">
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="birthdayList.length === 0">
          暂无数据
        </div>
        <div class="b-items" v-else>
          <div class="b-item" v-for="(bItem,bIndex) in birthdayList" :key="bIndex">
            <div class="b-close">
              <span @click="removeBirthdayInfo(bItem.id,bIndex)">&times;</span>
            </div>
            <div class="b-head">
              <img :src="bItem.contactLogUrl||'/static/img/default.png'" onerror="javascript:this.src='/static/img/default.png'" width="100%" @click="goToContact(bItem.contactId)">
            </div>
            <div class="b-name ellipsis">{{bItem.contactName}}</div>
            <div class="b-job ellipsis">{{bItem.contactCompany}}</div>
            <div class="b-job-title ellipsis">{{bItem.contactPosition}}</div>
            <div class="b-line"></div>
            <div class="b-time">
              <template v-if="bItem.afterDay===0">
                 今天生日
              </template>
              <template v-else>
                <span class="b-day">{{bItem.afterDay}}</span> 天后生日
              </template>
              <span class="b-date">({{bItem.realDay}})</span>
            </div>
            <template v-if="serverLevel==='1'">
              <div class="b-mail-btn" @click="sendEmail(bItem.contactId)" v-if="bItem.contactEmail">
                <span class="icon-font">&#xe614;</span>
                发送生日邮件
              </div>
              <div class="b-mail-btn" style="background:#EAF0F6;" v-else>
                <span class="icon-font">&#xe614;</span>
                发送生日邮件
              </div>
            </template>
          </div>
          <div class="page-center">
             <el-pagination
                small
                layout="prev, pager, next"
                @current-change="birthdayHandleCurrentChange"
                :current-page="birthDayPage.page"
                :page-size="birthDayPage.pageSize"
                :total="birthDayPage.totalCount">
              </el-pagination>
          </div>
        </div>
      </div>
      <!-- 盈店学堂模块 -->
      <div class="ying-class-block">
        <div class="block-title">
          盈店学堂
          <!-- <el-tooltip class="item" effect="dark" content="提供了丰富的社交外贸课程" placement="top">
            <span class="icon-font title-icon">&#xe6ed;</span>
          </el-tooltip> -->
        </div>
        <div class="text-loading ying" v-if="isLoading.school">
          <div class="y-items">
            <div class="y-item" v-for="sItem in [1,2,3,4]" :key="sItem">
              <div class="y-pic-wraper">
              </div>
              <div class="y-title"></div>
              <div class="y-about"></div>
            </div>
          </div>
        </div>
        <div class="none-data-tip" v-else-if="schoolList.length === 0">
          暂无数据
        </div>
        <div class="y-items" v-else>
          <div class="y-item" v-for="(sItem,sIndex) in schoolList" @click="goToArticleDetail(sItem.id)" :key="sIndex">
            <div class="y-pic-wraper">
              <img class="y-pic" :src="sItem.wholeImgUrl||'/static/img/index/yPic.jpg'" onerror="javascript:this.src='/static/img/index/yPic.jpg'" width="100%">
              <div class="readed">{{sItem.viewCount}}人已阅读</div>
            </div>
            <div class="y-title">{{sItem.title}}</div>
            <div class="y-about">{{sItem.summary}}</div>
          </div>
        </div>
        <div class="view-more-link">
          <div v-if="schoolList.length > 0" class="condition-day view-more" @click="viewMoreSchool">查看更多 ></div>
        </div>
      </div>
    </div>
    <el-dialog class="check-dialog" title="提示" v-model="checkVisible">
      <img src="../../assets/img/index/checkemail.png">
      <p class="check-text">{{notice}}</p>
      <p>请重新绑定您的邮箱</p>
    </el-dialog>
    <!-- <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox> -->
  </div>
</template>
<script>
import IndexAPI from '@/api/indexAPI'
// import LoginAPI from '@/api/loginAPI'
// import enquiriesAPI from '@/api/enquiriesAPI'
import echarts from 'echarts/lib/echarts'
import Util from '@/common/Util.js'
// import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/funnel'
// 提示框
import 'echarts/lib/component/tooltip'
import ChanceCarouselTwo from '@/components/ChanceCarouselTwo.vue'
// import Vue from 'vue'
export default {
  name: 'workspace',
  data () {
    return {
      userId: window.localStorage.userId,
      probationDate: '',
      mailIsAccount: true,
      activityIsAccount: true,
      probation: false,
      adsToken: '',
      adsUrl: process.env.ADS_DOMAIN + '/account?token=',
      // serverLevel: '1',
      serverLevel: window.localStorage.serverLevel,
      /**
       * 流量概览数据
      */
      pvVal: 0,
      uvVal: 0,
      avgTime: 0,
      avgPage: 0,
      quiryCount: 0,
      /**
       * 询盘权限
       * @type {Number}
       */
      recommandRight: 1,
      /**
       * 各个模块 是否正在加载数据
       * @type {Object}
       */
      isLoading: {
        webStatics: false,
        birthday: true,
        school: true,
        recommend: true,
        inquire: true,
        currOnline: true, // 当前在线
        clientSource: true, // 客户来源
        lead: true, // lead推荐
        market: true, // 营销邮件
        marketList: true, // 营销邮件排行
        flowLoading: true,
        dynamic: true,
        wake: true,
        activityList: true,
        contact: true,
        contactLeft: true
      },
      /**
       * 默认统计7天
       * @type {Number}
       */
      webStaticDays: 7,
      flowDays: 7,
      /**
       * 营销邮件默认统计7天
       * @type {Number}
       */
      // marketDays: 7,
      /**
       * 网站统计信息
       * @type {Object}
       */
      webStatics: {
        conversionRate: 0,
        msgProductCount: 0,
        uv: 0
        // pv: 0,
        // uv: 0,
        // inquire: 0,
        // expose: 0
      },
      /**
       * 询盘table
       * @type {Array}
       */
      inquireTableData: [],
      birthdayList: [],
      schoolList: [],
      recommendList: [],
      leadList: [],
      wakeList: [],
      wakeListTotal: [],
      currOnlineData: {},
      sixty: {type: Number},
      allpie0: false,
      browseData: [],
      /**
       * 询盘分页对象
       * @type {Object}
       */
      inquirePage: {
        page: 1,
        pageSize: 5,
        totalCount: 0
      },
      /**
       * 生日分页
       * @type {Object}
       */
      birthDayPage: {
        page: 1,
        pageSize: 4,
        totalCount: 0
      },
      intervalTimer: null,
      checkVisible: false,
      notice: '',
      // 最近动态数据
      latelyDy: [],
      /**
       *dynamic分页
       */
      dynamicPage: {
        page: 1,
        pageSize: 5,
        totalCount: 0
      },
      dynamicData: [],
      dynamicOption: {},
      dynamicUserId: '',
      /**
       * 客户唤醒分页
       */
      wakePage: {
        page: 1,
        pageSize: 4,
        totalCount: 0
      },
      wakeMaxLen: -1,
      nowWakeIndex: 4,
      chanceList: [],
      num: 0,
      /**
       * 邮件营销效果
      */
      marketListData: [],
      mailOption: {},
      mailUserId: '',
      /**
       * 活动营销统计
      */
      activityListData: [],
      activityOption: {},
      activityUserId: '',
      /**
       * 联系人转化
      */
      contactDays: 7,
      contactUserId: '',
      contactOption: {},
      contactListData: [],
      contactChangeData: []
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.intervalTimer)
    next()
  },
  mounted () {
    if (window.localStorage.isProbation === 'true') {
      this.probation = true
      this.probationDate = window.localStorage.probation
      this.$store.commit('ADSENTER', {adsEnter: false})
    }
    this.getAdsToken()
    /**
     * 获取用户权限
     * @type {[type]}
     */
    // this.serverLevel = window.localStorage.serverLevel
    this.recommandRight = JSON.parse(localStorage.user).hasActivity
    // 选中一级菜单
    this.$store.dispatch('setNavIndex', 0)
    /**
     * 初始化各种统计信息
     */
    this.getContactList(this.teamDefault)
    this.getContactChange(this.teamDefault)
    this.getWebStaticsInfo()
    this.getInquireInfo()
    this.getSchoolInfo()
    this.getBirthdayInfo()
    this.getCurrOnline()
    this.initFunnel()
    // this.getLeadInfo()
    this.getMarketList()
    this.getActivityList(this.teamDefault)
    this.isAds({'dictCode': 'SWITCH'})
    // this.mailCheck()
    // 流量概览
    this.flowBrowse()
    // 客户最近动态
    this.dynamic()
    // this.dynamic()
    // this.customerWake()
    // 商机推荐
    if (this.serverLevel === '1') {
      this.getChanceListFunc()
    }
  },
  destroyed () {
    let cycleObj = this.cycleObj
    clearInterval(cycleObj)
  },
  components: {
    ChanceCarouselTwo
  },
  computed: {
    userName () {
      let userInfo = JSON.parse(window.localStorage.user)
      return userInfo.name ? userInfo.name : userInfo.loginAccount
    },
    adsEnter () {
      if (window.localStorage.isAds) {
        if (window.localStorage.isAds === 'show') {
          return this.$store.state.index.adsEnter
        }
      }
    },
    accountList () {
      let userInfo = JSON.parse(window.localStorage.user)
      let sublist = userInfo.subUserList
      let account = [{name: userInfo.name ? userInfo.name : userInfo.loginAccount, id: userInfo.userId}]
      if (sublist && sublist.length) {
        account = account.concat(sublist)
      }
      return account
    },
    accountTeamList () {
      let userInfo = JSON.parse(window.localStorage.user)
      let sublist = userInfo.subUserList
      let account = [{name: userInfo.name ? userInfo.name : userInfo.loginAccount, id: userInfo.userId}]
      let team = [{name: '全部账号', id: ''}]
      if (sublist && sublist.length) {
        account = account.concat(sublist)
        team = team.concat(account)
      }
      if (this.showAccout) {
        return team
      } else {
        return sublist
      }
    },
    showAccout () {
      let userInfo = JSON.parse(window.localStorage.user)
      let parentId = userInfo.parentUserId
      if (!parentId && this.serverLevel === '1') {
        return true
      } else {
        return false
      }
    },
    teamDefault () {
      let userInfo = JSON.parse(window.localStorage.user)
      let parentId = userInfo.parentUserId
      if (parentId) {
        return this.userId
      } else {
        return null
      }
    }
  },
  methods: {
    pieCount () {
      this.initPie()
    },
    ChanceRight () {
      return Util.hasRightByCode('CC')
    },
    // 获取商机推荐列表
    getChanceListFunc () {
      let myDate = new Date()
      let myDate2 = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      let year = myDate.getFullYear()
      let year2 = myDate2.getFullYear()
      let month = (myDate.getMonth() < 9 ? '0' : '') + (myDate.getMonth() + 1)
      let month2 = (myDate2.getMonth() < 9 ? '0' : '') + (myDate2.getMonth() + 1)
      let day = (myDate.getDate() < 10 ? '0' : '') + myDate.getDate()
      let day2 = (myDate2.getDate() < 10 ? '0' : '') + myDate2.getDate()
      let datastr = year + '-' + month + '-' + day
      let datastr2 = year2 + '-' + month2 + '-' + day2
      let params = {
        page: 1,
        size: 10,
        startTime: datastr,
        endTime: datastr2
      }
      IndexAPI.getCommonEnquiries(params).then(res => {
        if (res.data.code === 0) {
          let records = res.data.data.records
          records.forEach((item) => {
            item.isShow = false
            item.enquiryType = 1
            item.isMining = false
            this.chanceList.push(item)
          })
        }
        // this.dataIsload = false
        IndexAPI.getMicroEnquiries(params).then(res => {
          if (res.data.code === 0) {
            let records = res.data.data.records
            records.forEach((item) => {
              item.isShow = false
              item.enquiryType = 2
              this.chanceList.push(item)
            })
            // this.updateChanceList()
          }
          this.dataIsload = false
        })
      })
    },
    showImgList (index) {
      this.imglistIsShow = true
    },
    isAds (param) {
      IndexAPI.isAds(param).then(res => {
        if (!res.data.code) {
          if (res.data.data[0].dictdataCode === '1') {
            if (window.localStorage.isProbation === 'false') {
              this.$store.commit('ADSENTER', {adsEnter: true})
            }
            this.$store.commit('ADSBAR', {adsBar: true})
          }
        }
      })
    },
    getAdsToken () {
      IndexAPI.getLoginToken().then(res => {
        if (res.data.data) {
          this.adsToken = res.data.data
          localStorage.token = res.data.data
        }
      })
    },
    // 关闭ads入口
    closeAds () {
      this.adsEnter = false
      this.$store.commit('ADSENTER', {adsEnter: false})
      window.localStorage.isAds = ''
    },
    /**
     * 验证邮箱有效性
     */
    mailCheck () {
      let _this = this
      IndexAPI.mailCheck().then((res) => {
        if (!res.data.code) {
        } else {
          _this.checkVisible = true
          _this.notice = res.data.message
        }
      })
    },
    /**
     * 客户最近动态
     *
     */
    dynamicSelect () {
      if (!this.dynamicOption.id) {
        this.dynamicUserId = null
      } else {
        this.dynamicUserId = this.dynamicOption.id
      }
      // this.dynamicPage.page = 1
      if (this.dynamicPage.page === 1) {
        this.dynamic(this.dynamicUserId)
      } else {
        this.dynamicPage.page = 1
      }
    },
    dynamic (userId) {
      this.isLoading.dynamic = true
      let searchByBelongTo = false
      if (userId) {
        searchByBelongTo = true
      } else {
        searchByBelongTo = false
      }
      let params = {
        size: this.dynamicPage.pageSize,
        page: this.dynamicPage.page,
        belongToUserId: userId,
        searchByBelongTo: searchByBelongTo
      }
      IndexAPI.dynamicRecent(params).then((res) => {
        if (!res.data.code) {
          this.isLoading.dynamic = false
          this.dynamicData = res.data.data.records
          for (var i = 0; i < this.dynamicData.length; i++) {
            let socail = this.dynamicData[i].socialContent
            this.dynamicData[i].socialContent = JSON.parse(socail)
            if (!this.dynamicData[i].stage) {
              this.dynamicData[i].stage = '-'
            }
          }
          this.dynamicPage.page = res.data.data.page
          this.dynamicPage.totalCount = res.data.data.totalCount
        }
      })
    },
    /**
     * 最近动态分页
     */
    dynamicPageChange (page) {
      this.dynamicPage.page = page
      this.dynamic(this.dynamicUserId)
    },
    /**
     * 跳转到最近登录
    */
    toHomeMonitor () {
      let params = {
        days: this.contactDays
      }
      this.$router.push({
        path: '/homeMonitor',
        query: params
      })
    },
    /**
     * 跳转到最近官网询盘
    */
    toInquiry () {
      let params = {
        t: 2,
        days: this.contactDays
      }
      this.$router.push({
        path: '/homeMonitor',
        query: params
      })
    },
    /**
     * 跳转到统计类型联系人
    */
    toContactType (type) {
      let params = {}
      if (type === 3) {
        params = {
          countType: type,
          id: this.showAccout ? this.contactOption.id || 0 : this.teamDefault
        }
      } else {
        params = {
          countType: type,
          days: this.contactDays,
          id: this.showAccout ? this.contactOption.id || 0 : this.teamDefault
        }
      }
      this.$router.push({
        path: '/contact',
        query: params
      })
    },
    /**
     * 跳转到筛选联系人
    */
    toContactIndex (type) {
      let params = {
        stage: type,
        countType: 3,
        id: this.showAccout ? (this.contactOption.id || 0) : this.userId
      }
      this.$router.push({
        path: '/contact',
        query: params
      })
    },
    /**
     * 跳转到联系人详情页
     */
    toContact (id) {
      let params = {
        contactId: id,
        actionType: -1,
        contactType: 0,
        messageType: 'mail'
      }
      this.$store.dispatch('setNavIndex', 5)
      this.$router.push({
        path: '/contactDetail',
        query: params
      })
    },
    /**
     *
     */
    toContactIt (id) {
      this.$store.dispatch('setNavIndex', 5)
      this.$router.push({
        path: '/contactDetail',
        query: {'contactId': id, 'contactType': 0}
      })
    },
    /**
     * 忽略该联系人
     */
    ignoreIt (id, index) {
      IndexAPI.customerWake({'paging': false}).then((res) => {
        if (!res.data.code) {
          for (var i = 0; i < res.data.data.records.length; i++) {
            if (res.data.data.records[i].avatar !== null && res.data.data.records[i].avatar !== '') {
              res.data.data.records[i].avatar = Util.checkUrl(res.data.data.records[i].avatar)
            }
          }
          this.wakeListTotal = res.data.data.records
          IndexAPI.customerignoreWake({'contactId': id}).then((res) => {
            if (!res.data.code) {
              this.nowWakeIndex = 4
              this.nowWakeIndex = this.nowWakeIndex * this.wakePage.page
              this.wakeMaxLen--
              if (this.nowWakeIndex < this.wakeListTotal.length) {
                this.wakeList.splice(index, 1, this.wakeListTotal[this.nowWakeIndex])
                this.wakePage.totalCount--
              } else {
                this.wakeList.splice(index, 1)
                this.wakePage.totalCount--
              }
            }
          })
        }
      })
    },
    /**
     * 网站统计
     * @return {[type]} [description]
     */
    initTable (arruv, arrinq) {
      let dataAxis = []
      let data2Axis = []
      let data = []
      let data2 = []
      if (!arruv) {
        return
      }
      if (!arrinq) {
        return
      }
      for (let key in arruv) {
        dataAxis.push(arruv[key].date)
        data.push(arruv[key].uv)
      }
      for (let key2 in arrinq) {
        data2Axis.push(arrinq[key2].date)
        data2.push(arrinq[key2].count)
      }
      /**
       * 阴影 为最大值
       * @param  {[type]} let item          of data [description]
       * @return {[type]}     [description]
       */
      // for (let item of data) {
      //   yMax = (item > yMax ? item : yMax)
      // }
      // var dataShadow = []
      // for (var i = 0; i < data.length; i++) {
      //   dataShadow.push(yMax)
      // }
      let interval = 1
      if (this.webStaticDays === 30) {
        interval = 8
      }
      let opt = this.chartOption(dataAxis, data, interval, ['#5488F9', '#f3f7ff'])
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('web-chart'))
      // 绘制图表
      myChart.setOption(opt)

      let opt2 = this.chartOption(data2Axis, data2, interval, ['#00B8CC', '#ebfdff'])
      var myChart2 = echarts.init(document.getElementById('web2-chart'))
      myChart2.setOption(opt2)
    },
    // 流量概览
    flowBrowse () {
      let param = {'recentDays': this.flowDays, 'platform': 0}
      IndexAPI.getFlowCount(param).then((res) => {
        this.isLoading.flowLoading = false
        if (!res.data.code) {
          // let obj = res.data.data
          this.pvVal = res.data.data.sumPv
          this.uvVal = res.data.data.sumUv
          this.avgTime = res.data.data.averageUvTime
          this.avgPage = res.data.data.averagePvNum
          this.quiryCount = res.data.data.msgProductCount
        }
      })
    },
    chartOption (dataAxis, data, interval, colorarr) {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(150,150,150,0)'
            }
          }
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            interval: interval,
            inside: false,
            textStyle: {
              color: '#7C98B6'
            },
            // rotate: 45,
            formatter: function (params) {
              return params.split('-')[1] + '-' + params.split('-')[2]
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        // color: colorarr,
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            margin: 1,
            textStyle: {
              color: '#7C98B6',
              fontSize: '12'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            /**
             * 宽度是这边调整的
             * @type {String}
             */
            // barCategoryGap: '85%',
            showSymbol: false,
            hoverAnimation: false,
            smooth: true,
            itemStyle: {
              // normal: {color: 'rgba(0,0,0,0.05)'}
              normal: {
                color: colorarr[0],
                areaStyle: {            // 系列级个性化折线样式，横向渐变描边
                  type: 'default',
                  color: colorarr[1]
                }
              }
            },
            data: data
          }
        ]
      }
      return option
    },
    /**
     * 跳转到公司/员工详情
     */
    toDevelopDetail (event, data) {
      if (event.target.getAttribute('href') !== 'javascript:;' && event.target.parentNode.getAttribute('class') === 'r-icons') {
        return
      }
      if (data.type === 1) { // 公司
        window.open('#/companyDetail?id=' + data.thirdAccountId + '&source=recommend&keywords=')
      } else {
        window.open('#/staffDetail?id=' + data.thirdAccountId + '&source=recommend&keywords=')
      }
    },
    /**
     * 去联系人那里
     * @param  {[type]} contactId [description]
     * @param  {[type]} type      [description]
     * @return {[type]}           [description]
     */
    goToContact (contactId, type) {
      window.open('#/contactDetail?contactId=' + contactId + '&contactType=0')
    },
    /**
     * 生日发送email 按钮
     * @param  {[type]} contactId [description]
     * @param  {[type]} type      [description]
     * @return {[type]}           [description]
     */
    sendEmail (contactId, type) {
      window.open('#/contactDetail?contactId=' + contactId + '&contactType=0&messageType=mail&actionType=0')
    },
    /**
     * 点击学堂 进入文章详情
     * @return {[type]} [description]
     */
    goToArticleDetail (id) {
      window.open('#/articleDetail/' + id)
    },
    /**
     * 查看更多学堂
     * @return {[type]} [description]
     */
    viewMoreSchool () {
      window.open('#/newsList')
    },
    viewMore2 () {
      // window.open('#/develop')
      this.$router.push({ path: '/develop' })
    },
    /**
     * 跳转查看联系人
    */
    viewContact () {
      this.$router.push({ path: '/contactSub' })
    },
    /**
     * 查看更多邮件
    */
    viewMoreMail () {
      let params = {
        id: this.mailUserId
      }
      this.$router.push({
        path: '/emailmarketing',
        query: params
      })
    },
    /**
     * 查看更多活动
    */
    viewMoreActivity () {
      let params = {
        id: this.activityUserId
      }
      this.$router.push({
        path: '/Activitymarketing',
        query: params
      })
    },
    /**
     * 分页钩子 生日
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    birthdayHandleCurrentChange (val) {
      this.birthDayPage.page = val
      this.getBirthdayInfo()
    },
    /**
     * 获取学堂信息
     * @return {[type]} [description]
     */
    getSchoolInfo () {
      let postObj = {
        page: 1,
        size: 4,
        paging: true
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.school = true
      IndexAPI.getSchoolInfo(postObj).then((res) => {
        this.isLoading.school = false
        this.schoolList = res.data.data.records
      })
    },
    /**
     * 移除生日信息
     * @return {[type]} [description]
     */
    removeBirthdayInfo (id, index) {
      let postObj = {
        id: id
      }
      IndexAPI.removeBirthdayInfo(postObj).then((res) => {
        if (res.data.code === 0) {
          /**
           * 刷新页 refreshMaxPage 为 根据 删除前的totalCount 算出来的最大页
           * @type {[type]}
           */
          let refreshMaxPage = parseInt((this.birthDayPage.totalCount - 2) / 4) + 1
          let refreshPage = this.birthDayPage.page <= refreshMaxPage ? this.birthDayPage.page : refreshMaxPage
          /**
           * 当前要刷新的页为 当前所在页 （当前页内容删除完之后，则刷新refreshMaxPage）
           * @type {[type]}
           */
          this.birthDayPage.page = refreshPage
          this.getBirthdayInfo()
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    /**
     * 获取生日
     * @return {[type]} [description]
     */
    getBirthdayInfo () {
      let postObj = {
        page: this.birthDayPage.page,
        size: this.birthDayPage.pageSize
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.birthday = true
      IndexAPI.getBirthdayInfo(postObj).then((res) => {
        this.isLoading.birthday = false
        this.birthdayList = res.data.data.records
        /**
         * 分页数据
         * @type {[type]}
         */
        this.birthDayPage.page = res.data.data.page
        this.birthDayPage.totalCount = res.data.data.totalCount
      })
    },
    /**
     * 当前在线
     */
    getCurrOnline () {
      let _this = this
      IndexAPI.currOnline({platform: 0}).then((res) => {
        if (!res.data.code) {
          _this.currOnlineData = res.data.data
          _this.sixty = 60
          _this.isLoading.currOnline = false
          _this.intervalTimer = setInterval(() => {
            if (_this.sixty === 0) {
              clearInterval(_this.intervalTimer)
              _this.getCurrOnline()
            } else {
              _this.sixty = _this.sixty - 1
            }
          }, 1000)
        }
      })
    },
    /**
     * LEAD推荐
     */
    getLeadInfo () {
      let postObj = {
        type: 1,
        page: 1,
        size: 4
      }
      IndexAPI.leadData(postObj).then((res) => {
        if (!res.data.code) {
          this.isLoading.lead = false
          this.leadList = res.data.data
          // let inlist = res.data.data.includeList
          this.leadList.forEach((item) => {
            let iconArr = []
            item.includeList.forEach((item2) => {
              let url = item2.url && item2.url.indexOf('http://') === -1 ? 'http://' + item2.url : item2.url
              switch (item2.value) {
                case 'facebook数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-facebook', url: url})
                  break
                case 'twitter数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-twitter', url: url})
                  break
                case '邮箱数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-message', url: url})
                  break
                case '海关数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-fill', url: url})
                  break
                case '员工数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-user', url: url})
                  break
                case '电话数据':
                  if (item2.included === 1) iconArr.push({icon: 'icon-tel', url: url})
                  break
              }
            })
            item.iconArr = iconArr
          })
        }
        // this.leadPage.page = res.data.data.page
        // this.leadPage.totalCount = res.data.data.totalCount
      })
    },
    /**
     * 获取询盘信息
     * @return {[type]} [description]
     */
    getInquireInfo () {
      /**
       * 计算得到开始时间和结束时间
       * @type {Date}
       */
      let newdate = new Date()
      let sDate = new Date()
      let endDate = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate()
      let startMillionTime = newdate.getTime() - ((30 - 1) * 24 * 60 * 60 * 1000)
      sDate.setTime(startMillionTime)
      let starttime = sDate.getFullYear() + '-' + (sDate.getMonth() + 1) + '-' + sDate.getDate()
      let postObj = {
        page: this.inquirePage.page,
        size: this.inquirePage.pageSize,
        startTime: starttime,
        endTime: endDate
      }
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.inquire = true
      IndexAPI.getInquireInfo(postObj).then((res) => {
        this.isLoading.inquire = false
        if (res.data.data) {
          this.inquireTableData = res.data.data.records
           /**
           * 分页数据
           * @type {[type]}
           */
          this.inquirePage.page = res.data.data.page
          this.inquirePage.totalCount = res.data.data.totalCount
        }
      })
    },
    /**
     * 改变统计天数
     * @param  {[type]} days [description]
     * @return {[type]}      [description]
     */
    changeStaticsDays (days) {
      if (days === 7) {
        document.getElementById('webDaysSelect').setAttribute('class', 'fr select')
      } else if (days === 30) {
        document.getElementById('webDaysSelect').setAttribute('class', 'fr select select2')
      }
      this.webStaticDays = days
      this.getWebStaticsInfo()
    },
    /**
     * 改变浏览概况
     * **/
    changeFlowDays (days) {
      if (days === 7) {
        document.getElementById('browseSelect').setAttribute('class', 'fr select')
      } else if (days === 30) {
        document.getElementById('browseSelect').setAttribute('class', 'fr select select2')
      }
      this.isLoading.flowLoading = true
      this.flowDays = days
      this.flowBrowse()
    },
    /**
     * 获取网站统计信息
     * @return {[type]} [description]
     */
    getWebStaticsInfo () {
      // let postObj = this.calDate(this.webStaticDays)
      let postObj = {recentDays: this.webStaticDays, platform: 0}
      /**
      /**
       * 开启loading
       * @type {Boolean}
       */
      this.isLoading.webStatics = true
      /**
       * 网站统计
       * @return {[type]} [description]
       */
      IndexAPI.getWebStaticInfo(postObj).then((res) => {
        this.isLoading.webStatics = false
        let data = res.data.data
        // this.webStatics.pv = res.data.data.shopPVCount
        // this.webStatics.uv = res.data.data.shopUVCount
        // this.webStatics.inquire = res.data.data.leaveMsgCount
        // this.webStatics.expose = res.data.data.productShowCount
        // let data =  msgProductCount: 0,
        // uv: 0,
        // conversionRate: 0,
        Object.assign(this.webStatics, data)
        /**
         * 初始化表格数据
         */
        setTimeout(() => {
          this.initTable(data.uvs, data.inquirys)
        }, 100)
      })
    },
    /**
     * 邮件营销效果
    */
    getMarketList (mailUserId) {
      let _this = this
      let userInfo = JSON.parse(window.localStorage.user).name
      let userAccount = JSON.parse(window.localStorage.user).loginAccount
      IndexAPI.getMarketList({page: 1, size: 5, queryUserId: mailUserId}).then((res) => {
        if (!res.data.code) {
          _this.marketListData = res.data.data.records
          _this.isLoading.marketList = false
        }
        _this.marketListData.forEach((item) => {
          if (!this.mailOption.id) {
            item.queryName = userInfo || userAccount
          } else {
            item.queryName = _this.mailOption.name || _this.mailOption.loginAccount
          }
          if (item.arrivePer) {
            item.arrivePer = item.arrivePer + '%'
          }
          if (item.readPer) {
            item.readPer = item.readPer + '%'
          }
          if (item.hitPer) {
            item.hitPer = item.hitPer + '%'
          }
        })
      })
    },
    mailSelect () {
      if (this.mailOption.id === this.userId) {
        this.mailIsAccount = true
      } else {
        this.mailIsAccount = false
      }
      this.isLoading.marketList = true
      this.mailUserId = this.mailOption.id
      this.getMarketList(this.mailUserId)
    },
    /**
     * 活动营销统计
    */
    getActivityList (activityUserId) {
      let _this = this
      IndexAPI.getactList({page: 1, size: 5, queryUserId: activityUserId}).then((res) => {
        if (!res.data.code) {
          _this.activityListData = res.data.data.records
          _this.isLoading.activityList = false
        }
        _this.activityListData.forEach((item) => {
          if (!item.pv) {
            item.pv = '-'
          }
          if (!item.uv) {
            item.uv = '-'
          }
          if (!item.hits) {
            item.hits = '-'
          }
          if (!item.userName) {
            item.userName = item.loginAccount || '-'
          }
        })
      })
    },
    activitySelect () {
      this.isLoading.activityList = true
      if (this.activityOption.id === this.userId) {
        this.activityIsAccount = true
      } else {
        this.activityIsAccount = false
      }
      if (!this.activityOption.id) {
        this.activityUserId = null
      } else {
        this.activityUserId = this.activityOption.id
      }
      this.getActivityList(this.activityUserId)
    },
    toTop () {
      scrollTo(0, 0)
    },
    downloadHelper () {
      window.open('https://chrome.google.com/webstore/detail/%E7%9B%88%E5%BA%97%E5%8A%A9%E6%89%8B/jbmgeokjjidieoppjegcdmmhpflmeijm/related?hl=zh-CN')
    },
    /**
     * 联系人转化
    */
    changeContactDays (days) {
      if (days === 7) {
        document.getElementById('contactDaysSelect').setAttribute('class', 'fr select')
      } else if (days === 30) {
        document.getElementById('contactDaysSelect').setAttribute('class', 'fr select select2')
      }
      this.contactDays = days
      this.contactUserId = this.contactUserId ? this.contactUserId : this.teamDefault
      this.getContactChange(this.contactUserId)
    },
    contactSelect () {
      this.isLoading.contact = true
      this.isLoading.contactLeft = true
      if (!this.contactOption.id) {
        this.contactUserId = null
      } else {
        this.contactUserId = this.contactOption.id
      }
      this.getContactList(this.contactUserId)
      this.getContactChange(this.contactUserId)
    },
    getContactList (contactId) {
      let search = false
      if (contactId) {
        search = true
      } else {
        search = false
      }
      let params = {
        recentDays: this.contactDays,
        searchByUserId: search,
        queryUserId: contactId
      }
      IndexAPI.getContact(params).then((res) => {
        if (!res.data.code) {
          this.contactListData = res.data.data
          this.isLoading.contactLeft = false
        }
      })
    },
    getContactChange (contactId) {
      let search = false
      if (contactId) {
        search = true
      } else {
        search = false
      }
      let params = {
        recentDays: this.contactDays,
        searchByUserId: search,
        queryUserId: contactId,
        platform: 0
      }
      let number = document.getElementsByClassName('contact-number')
      for (let i = 0; i < number.length; i++) {
        number[i].setAttribute('class', 'contact-number isloading')
      }
      setTimeout(() => {
        this.isLoading.contact = true
        IndexAPI.getContactChange(params).then((res) => {
          if (!res.data.code) {
            this.contactChangeData = res.data.data
            this.isLoading.contact = false
            for (let i = 0; i < number.length; i++) {
              number[i].setAttribute('class', 'contact-number')
            }
          }
        })
      }, 300)
    },
    initFunnel () {
      let _this = this
      let option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#415B77',
          padding: 10,
          textStyle: {
            fontSize: 12
          },
          position: function (point, params, dom) {
            return [ point[0], point[1] ]
          },
          formatter: function (data) {
            if (data.name === '已转化客户') {
              return '已下单客户'
            } else if (data.name === '待转化客户') {
              return '通过开发已经到达高意向度的客户'
            } else if (data.name === '开发中客户') {
              return '已通过社媒或者邮件至少联系过一次的客户'
            } else if (data.name === '待开发客户') {
              return '新联系人已添加上了邮箱或者社媒联系方式'
            } else if (data.name === '新增联系人') {
              return '后台新添加的客户资源'
            }
          }
        },
        calculable: true,
        series: [
          {
            name: '111',
            type: 'funnel',
            left: 10,
            top: 30,
            bottom: 30,
            right: 10,
            min: 20,
            max: 100,
            minSize: '20%',
            maxSize: '98%',
            gap: 2,
            sort: 'descending',
            label: {
              normal: {
                show: true,
                position: 'inside'
              },
              emphasis: {
                textStyle: {
                  fontSize: 12
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  width: 0,
                  type: 'solid'
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0
              },
              emphasis: {
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 6
              }
            },
            data: [
              {
                value: 20,
                name: '已转化客户',
                itemStyle: {
                  normal: {
                    color: '#2B68ED'
                  }
                }
              },
              {
                value: 40,
                name: '待转化客户',
                itemStyle: {
                  normal: {
                    color: '#2186EB'
                  }
                }
              },
              {
                value: 60,
                name: '开发中客户',
                itemStyle: {
                  normal: {
                    color: '#1A99E8'
                  }
                }
              },
              {
                value: 80,
                name: '待开发客户',
                itemStyle: {
                  normal: {
                    color: '#10AEE3'
                  }
                }
              },
              {
                value: 100,
                name: '新增联系人',
                itemStyle: {
                  normal: {
                    color: '#06C8E0'
                  }
                }
              }
            ]
          }
        ]
      }
      let myChart = echarts.init(document.getElementById('funnel'))
      myChart.setOption(option, true)
      myChart.on('click', function (data) {
        let type = 0
        if (data.name === '新增联系人') {
          type = 1
        } else if (data.name === '待开发客户') {
          type = 2
        } else if (data.name === '开发中客户') {
          type = 3
        } else if (data.name === '待转化客户') {
          type = 4
        } else if (data.name === '已转化客户') {
          type = 5
        }
        _this.toContactIndex(type)
      })
    }
    /**
     * 联系人转化end
    */
  }
}
</script>
<style lang="less" rel="stylesheet/less">
@import '../../assets/style/variable.less';
@import '../../assets/style/base.less';
@import "../../assets/style/chance";
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.index-button{
  color: #4F6D95;
  border-color: #CBD6E3;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.margin-top16{
  margin-top:16px;
}
.helper-wechat{
  cursor: pointer;
  position: fixed;
  right: 0;
  bottom: 80px;

  width: 76px;
  height: 220px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.10);
  z-index: 999;
  .helper, .we-app{
    position: relative;
    width: 60px;
    margin-left: 8px;
    text-align: center;
    border-bottom: 2px solid #eaeaea;
    padding: 13px 0 13px 0;
    .tip-icon{
      display: inline-block;
      margin-bottom: 8px;
      font-size: 30px;
      color: #888;
    }
    .tip-box{
      display: none;
      position: absolute;
      left: -190px;
      top: 2px;
      width: 168px;
      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.20);
      background-color: #fff;
      border-radius: 6px;
      padding: 9px;
      box-sizing: border-box;
      text-align: center;
      p{
        text-align: left;
        font-size: 12px;
        line-height: 1.5;
        color: #33475b;
        margin-bottom: 4px;
      }
      img{
        width: 150px;
        height: auto;
      }
      &:before{
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        top: 18px;
        right: -7px;
        border-top: 6px solid transparent;
        border-left: 10px solid #fff;
        border-bottom: 6px solid transparent;
      }
    }
    &:hover{
      .tip-icon{
       color: #5488F9;
      }
      .tip-text{
        color: #5488F9;
      }
    }
    &:hover .tip-box{
      display: block;
    }
  }
  .tip-text{
    font-size: 12px;
    color: #888;
  }
  .to-top{
    text-align: center;
    .top-arrow{
      position: relative;
      top: 5px;
      font-size: 35px;
      color: #888;
    }
    &:hover{
      .top-arrow{
       color: #5488F9;
      }
      .tip-text{
        color: #5488F9;
      }
    }
  }
}
.ads-tip{
  position: relative;
  width: 100.4%;
  min-width: 1200px;
  height: 50px;
  line-height: 50px;
  font-size: 13px;
  color: #fff;
  background: #FDF8E6;
  text-align: center;
  background: url('../../assets/img/adsbg.png') no-repeat;
  background-size: cover;
  z-index: 99;
  // letter-spacing: 1px;
  .use-ads{
    display: inline-block;
    margin-left: 10px;
    width:100px;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    font-size: 13px;
    color: #5488F9;
    background: #FFF;
    font-weight: bold;
    cursor: pointer;
    i{
      // color: #fff;
      line-height: 34px;
      margin-right: 6px;
      font-weight: normal;
    }
  }
  .del-ads{
    position: absolute;
    right: 20px;
    color: #FFF;
    line-height: 50px;
    font-size: 14px;
    cursor: pointer;
  }
}
@-moz-document url-prefix() { /*Firefox*/
  .ads-tip{
    width: 101.1%;
  }
}
.probation{
  position: relative;
  width:100.1%;
  min-width: 1200px;
  height: 50px;
  line-height: 50px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background: #5488F9;
  background-size: cover;
  z-index: 99;
}
  .static-all{
    margin: 46px auto 0 auto;
    width: 450px;
    &>div{
      float: left;
      width: 67px;
      padding-left: 43px;
      text-align: left;
      label{
        font-size: 12px;
        color: #7C98B6;
      }
      p{
        margin-top: 10px;
        font-size: 40px;
      }
    }
    .static-mid{
      position: relative;
      margin: 0 55px;
      width: 88px;
      padding-left: 0;
      padding-top: 17px;
      text-align: center;
      label{
        position: absolute;
        top: 28px;
        left: 32%;
        width: 100%;
        z-index: 99;
      }
      i{
        color: #EAF0F6;
        font-size: 40.2px;
      }
    }

  }
  .static-wraper{
    position: relative;
  }
  .fixHeiht{
    height:405px;
  }
  .static-chart{
    display: inline-block;
    margin-left: 10px;
    width: 280px;
    height: 255px;
  }
  .client-chart{
    width: 100%;
    height: 405px;
  }
  .client-chart-nodata{
    margin: 22px auto 33px auto;
    // padding-top: 11px;
    width: 240px;
    height: 240px;
    line-height: 240px;
    text-align: center;
    font-size: 18px;
    border-radius: 100%;
    background-color: #EAF0F6;
    color: #7C98B6;
  }
  .forbid-client{
    .client-legend{
      position: absolute;
      bottom: 68px;
      left: 100px;
      &>p span{
        margin-right: 6px;
        margin-bottom: 10px;
        color: #4F6D95;
        i{
          display: inline-block;
          margin-right: 3px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          /*background-color: #FCA21D;*/
        }
      }
      .client-desc{
        margin-bottom: 10px;
      }
      .client-desc1{
        margin-left:28px;
      }
      &>.client-desc span:nth-child(5) i{
        background-color: #fd5656;
      }
      &>.client-desc1 span:nth-child(1) i{
        background-color: #2AE0E7;
      }
      &>.client-desc1 span:nth-child(2) i{
        background-color: #FFDC0D;
      }
      &>.client-desc1 span:nth-child(3) i{
        background-color:  #B3D517;
      }
      &>.client-desc1 span:nth-child(4) i{
        background-color:  #b1e182;
      }
      &>.client-desc span:nth-child(1) i{
        background-color: #5488F9;
      }
      &>.client-desc span:nth-child(2) i{
        background-color: #FB509F;
      }
      &>.client-desc span:nth-child(3) i{
        background-color: #00B8CC;
      }
      &>.client-desc span:nth-child(4) i{
        background-color: #FCA21D;
      }
    }
  }
  .curr-static{
    margin: 66px auto 70px auto;
    text-align: center;
    em,span,p{
      display: block;
    }
    em{
      color: #B0C1D4;
      font-size: 12px;
    }
    span{
      height: 53px;
      line-height: 40px;
      color: #4F6D95;
      font-size: 13px;
    }
    .curr-static-high{
      text-align: center;
      span{
        display: inline-block;
        min-width: 200px;
        height: 18px;
        line-height: 18px;
        font-size: 13px;
        color: #fff;
        background-color: #5488F9;
      }
      i{
        margin: 0 3px;
      }
    }
    .big-num{
      margin: 0 4px;
      font-size: 30px;
      color: #5488F9;
      font-weight: bold;
    }
  }
  .lastest-15{
    margin: 0 auto;
    width: 88%;
    padding-left: 46px;
    border-top: 1px solid #EAF0F6;
    span{
      display: inline-block;
      width: 192px;
      font-size: 16px;
      color: #4F6D95;
      em{
        font-weight: bold;
      }
    }
    /*span.nth-child(2){*/
      /*width: 222px;*/
    /*}*/
    span:last-child{
      width: 100px;
    }
  }
  .tiny-tit{
    margin: 27px 0 12px 0;
    color: #7C98B6;
    font-size: 13px;
  }
  .market-all{
    margin: 45px auto;
    text-align: center;
    &>div{
      float: left;
      margin-bottom: 106px;
      width: 39%;
      padding-left: 11%;
      text-align: left;
      label{
        font-size: 12px;
        color: #7C98B6;
      }
      p{
        margin-top: 10px;
        font-size: 40px;
        color: #333;
      }
    }
  }
  .flow-browse{
    padding:20px 0;
    height: 180px;
    width:1200px;
    margin: 20px auto 0;
    background: #FFFFFF;
    box-shadow: 0 1px 1px rgba(0,0,0,0.15);
    // box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
    border-radius: 4px;
    &:hover{
      box-shadow:0 0 14px rgba(84, 136, 249, 0.25)
    }
    .flow-title{
      padding:0 20px;
      margin-bottom: 50px;
      .title{
        font-size: 18px;
        color: #33475B;
        letter-spacing: 0;
      }
    }
    .flow-data{
      width:1200px;
      li{
        width:20%;
        float: left;
        .data-loading{
          display: inline-block;
          width:100px;
          height: 40px;
          /*background: #EAF0F6;*/
          position: relative;
          left:30%;
          background: #F5F8FA;
          .animation(loadingColor,1s,infinite);
        }
        .data{
          text-align: center;
          font-size: 40px;
          color: #33475B;
        }
        .line{
          width:2px;
          height: 60px;
          background: #EAF0F6;
          display: inline-block;
          position: relative;
          top: -69px;
          left:240px;
        }
        .name{
          text-align: center;
          font-size: 13px;
          color: #7C98B6;
          margin-top: 16px;
        }
      }
    }
  }
  .view-container{
    .filter-select{
      position: absolute;
      top: 12px;
      right: 18px;
      vertical-align: top;
    }
    width:1200px;
    min-width:1200px;
    margin: 0 auto;
    font-size: 0;
    // font-size: 13px;
    // loading 样式
    .text-loading{
      position:absolute;
      top:106px;
      left:0;
      right:0;
      bottom:0;
      background: white;
      border-radius: 4px;
      z-index: 30;
      &.online, &.birthday, &.ying{
        top:60px;
      }
      .loading-title{
        display: inline-block;
        width:97px;
        height: 18px;
        .loadbg()
      }
      // 网站统计loading部分
      .static-title{
        width:97px;
        height: 18px;
        margin: 0 auto;
        .loadbg()
      }
      .static-content{
        width:145px;
        height: 33px;
        margin: 0 auto;
        .loadbg()
      }
      .static-chart{
        margin: 35px 25px 0 25px;
        width: 240px;
        height: 140px;
        .loadbg();
      }
      .condition-day{
        width:47px;
        height: 18px;
        .loadbg()
      }
      // 询盘loading部分
      .loading-tr{
        margin:33px auto;
        width: 531px;
        height: 18px;
        .loadbg();
        &:first-child{
          // margin-top:76px;
        }
        &:nth-child(6){
          width:167px;
        }
      }
      // 精准推荐部分
      .r-head{
        .loadbg()
      }
      .r-name{
        height: 15px;
        width:158px;
        .loadbg()
      }
      .r-about{
        height: 15px;
        width:360px;
        .loadbg()
      }
      // 生日提醒
      .b-head{
        width:40px;
        height: 40px;
        .loadbg()
      }
      .b-name{
        width:91px;
        height: 12px;
        .loadbg()
      }
      .b-job{
        background: #F5F8FA;
        width:128px;
        height: 12px;
        margin:0 auto;
        .loadbg()
      }
      .b-job-title{
        width:68px;
        height: 12px;
        .loadbg()
      }
      .b-time{
        width:183px;
        height: 23px;
        margin: 0 auto;
        .loadbg()
      }
      .b-mail-btn-bg{
        width:145px;
        height: 33px;
        margin: 10px auto;
        .loadbg()
      }
      // 学堂部分
      .y-pic-wraper{
        width:252px;
        height: 170px;
        .loadbg()
      }
      .y-title{
        width:86px;
        height: 17px;
        .loadbg()
      }
      .y-about{
        width:252px;
        height: 14px;
        .loadbg()
      }
      // 当前在线
      .curr-static{
        em,p,span{
          margin: 20px auto 0 auto;
          width: 160px;
          height: 20px;
          .loadbg()
        }
      }
      .lastest-15{
        border-top: 0;
        p,span{
          margin-bottom: 10px;
          width: 80px;
          height: 20px;
          .loadbg()
        }
        span{
          width: 120px;
          margin-right: 50px;
        }
      }
      .static-pie{
        display: block;
        margin: 0 auto;
        width: 240px;
        height: 240px;
        border-radius: 100%;
        .loadbg()
      }
      .load-tr{
        /*text-align: center;*/
        display: inline-block;
        position: relative;
        top:14px;
        margin-left:77px;
      }
      .load-td{
        display: inline-block;
        margin: 0 80px 20px 20px;
        width: 60px;
        height: 20px;
        .loadbg()
      }
    }
    .text-load{
      position: relative;
    }
    .loadbg(){
      background: #F5F8FA;
      .animation(loadingColor,1s,infinite);
    }
    .none-data-tip{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      margin:auto;
      width:130px;
      height: 20px;
      color:#4F6D95;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
    }
    .none-data-tipBtn{
      position:absolute;
      top:106px;
      left:0;
      right:0;
      bottom:0;
      margin:auto;
      width:100%;
      color:#4F6D95;
      background: #fff;
      z-index: 29;
      font-size: 12px;
      text-align: center;
      .none-data-p{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
        letter-spacing: 0;
        position:absolute;
        top:106px;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
        .viewMoreSpan{
          color: #5488F9;
          text-decoration: underline;
          cursor: pointer;
          padding: 0 5px;
        }
      }
    }
    .loading{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      margin:auto;
    }
    .table-tmpl{
      /*position: relative;*/
      .el-dropdown{
        position: absolute;
        z-index: 8;
        left: 55%;
        top: 19px;
      }
      .el-table__header-wrapper{
        height: 44px;
          border-bottom: 1px solid #EAF0F6;
        .is-leaf{
          .cell{
            color:#7C98B6;
            font-weight: 400;
          }
        }
      }
      .el-table__header-wrapper thead div, .el-table th{
        background: #F5F8FA;
      }
      .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #F5F8FA;
      }
      .el-table{
        border: 1px solid #EAF0F6;
        border-bottom:none;
      }
      .el-table th.is-leaf, .el-table td {
          border-bottom: 1px solid #EAF0F6;
      }
      .el-table th, .el-table td{
        height: 50px;
      }
      .el-table .cell {
        color:#33475B;
        white-space: nowrap;
        text-overflown:ellipsis;
        overflow-x: hidden;
        font-size: 13px;
        .inquire-name{
         color:#33475B;
        }
      }
    }
    .page-center{
      text-align: center;
      position: relative;
      width:100%;
      z-index: 100;
      /*bottom:24px;*/
      .el-pager li.active {
        margin-top:-1px;
        border:1px white solid;
        background: none;
        color:#5488F9;
        font-weight: bolder;
      }
      .el-pagination li, .el-pagination li.active + li {
          border: none;
      }
      .el-pagination{
        color:#4F6D95;
        margin:0px;
        text-align: center;
        .btn-prev, .btn-next{
          border:none;
        }
        button{
          color:#4F6D95;
        }
        button.disabled{
          color: #e4e4e4;
        }
      }
    }
    .block-title{
      padding: 20px;
      height: 20px;
      color:@font-title-color;
      font-size: 18px;
      line-height: 20px;
      border-radius: 4px;
      // padding:20px;
      a{
        color:@font-title-color;
      }
      .title-icon{
        color:#7C98B6;
        margin-top:-3px;
        font-size:14px;
        font-weight: 500;
        cursor: pointer;
      }
      .fr{
        float: right;
        margin-right: 11px;
      }
      .condition-day{
        display: block;
        float: left;
        color: @detailTextColor;
        font-size: 13px;
        line-height: 20px;
        margin-left: 12px;
        cursor: pointer;
      }
      .condition-day:hover{
        color:#5488F9;
      }
      .selected{
        // border-bottom: 2px solid @activeBlue;
        color:@activeBlue;
      }
      .small-tip{
        margin-left: -6px;
        font-size: 12px;
        color: #B0C1D4;
      }
      &.mail-title{
        height: 20px;
      }
    }
    .static-item{
      text-align: left;
      display: inline-block;
      width:290px;
      overflow: hidden;
      &:nth-child(-n+4):not(:nth-child(-n+2)){
        margin-top:92px;
      }
      .static-title{
        color:#7C98B6;
        font-size: 13px;
      }
      .static-content{
        font-family: HelveticaNeueLTPro-Th;
        font-weight: 300;
        letter-spacing: 0;
        color:#333333;
        font-size: 40px;
        margin-top:20px;
      }
    }
    .web-info, .inquire-customer{
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.15);
      display:inline-block;
      width:590px;
      height: 420px;
      margin-top:20px;
      vertical-align: top;
      font-size: 14px;
      position: relative;
    }
    .client-source, .inquire-box, .market-mail{
      margin-top: 20px;
    }
    .inquire-customer{
      margin-left: 20px;
    }
    .inquire-customer.inquire-box{
      margin-left: 0;
      height: 410px;
    }
    .inquire-customer.inquire-box.right{
      margin-left: 20px;
    }
    .birthday-block, .ying-class-block{
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.15);
      display:inline-block;
      width: 590px;
      height: 644px;
      margin-top:20px;
      vertical-align: top;
      font-size: 14px;
      margin-bottom:30px;
      position: relative;
    }
    .ying-class-block{
      margin-left:20px;
      .y-items{
        .y-item{
          cursor: pointer;
          vertical-align: top;
          display: inline-block;
          margin-top:45px;
          margin-left:21px;
          width:253px;
          &:hover {
            .y-pic {
             transform:scale(1.2);
            }
            .y-title{
              color:@activeBlue;
            }
          }
          &:nth-child(1){
            margin-top:10px;
          }
          &:nth-child(2){
            margin-left:44px;
            margin-top:10px;
          }
          &:nth-child(4){
            margin-left:44px;
          }
          .y-title{
            font-size: 16px;
            color:@textColor;
            margin-top:8px;
            font-weight: bolder;
            transition:all 1s;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .y-about{
            color:@detailTextColor;
            font-size: 13px;
            line-height: 18px;
            margin-top:4px;
            height: 36px;
            overflow: hidden;
            letter-spacing: 1px;
          }
          .y-pic-wraper{
            overflow: hidden;
            height: 170px;
            position: relative;
            .y-pic{
              transition:all 1s;
            }

            .readed{
              font-size: 13px;
              box-sizing: border-box;
              position: absolute;
              bottom:0px;
              background: rgba(0, 0, 0, 0.37);
              background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0),rgba(0, 0, 0, 0.7));
              width:100%;
              height: 40px;
              line-height: 40px;
              padding-left:8px;
              color:white;
            }
          }
        }
      }

    }
    //最近动态部分
    .dynamic{
      .no-data{
        color: #333;
        padding: 120px 0 80px 0;
      }
      position: relative;
      width:100%;
      margin-top: 20px;
      background: #FFFFFF;
      box-shadow: 0 1px 1px rgba(0,0,0,0.15);
      // box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
      border-radius: 4px;
      font-size: 13px;
      &:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
      }
      .loading-dy{
        width:100%;
        height: 257px;
        position: absolute;
        left: 0;
        top: 112px;
        background-color: #fff;
        padding-top: 33px;
        z-index: 200;
        .loading-title{
          width:110px;
          height: 18px;
          margin-top: 10px;
          margin-bottom: 33px;
          .loadbg()
        }
        .loading-div{
          width:inherit;
          height: 18px;
          margin-bottom: 33px;
          .loadbg()
        }
      }
      .d-name{
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        color: #33475B;
        padding-left: 20px;
      }
      .d-data{
        height: 343px;
        .d-title{
          width:99.9%;
          height: 50px;
          line-height: 50px;
          background: #F5F8FA;
          border: 1px solid #EAF0F6;
          color: #7C98B6;
        }
        .dynamic-nodata{
          text-align: center;
          margin-top: 90px;
        }
        .d-list{
          width:99.9%;
          height: 44px;
          line-height: 44px;
          background: #FFF;
          border-bottom: 1px solid #EAF0F6;
          color: #7C98B6;
          &:hover{
            background: #F5F8FA;
          }
        }
        .noread{
          color: #33475B;
          font-weight: bold;
          width:99.9%;
          height: 44px;
          line-height: 44px;
          background: #FFF;
          border-bottom: 1px solid #EAF0F6;
          &:hover{
            background: #F5F8FA;
          }
        }
        li{
          float: left;
        }
        .recently,.name,.time,.stage,.userName{
          height: inherit;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          padding: 0 10px;
        }
        .recently{
          width:526px;
          padding-left: 20px;
          .textColor{
            color: #33475B;
          }
          .textBold{
            font-weight: bold;
            color: #33475B;;
          }
          em{
          }
          .fb{
            color: #577ECE;
          }
          .tw{
            color: #48B3FE;
          }
        }
        .name{
          width:180px;
        }
        .stage{
          width:120px;
        }
        .userName{
          width:120px;
        }
        .time{
          width:142px;
        }
      }
      .dynamic-page{
        text-align: center;
        padding: 20px ;
        .el-pagination{
          text-align: center;
        }
      }
    }
    .birthday-block {
      .b-item{
        &:hover{
          background: #F5F8FA;
        }
        box-sizing: border-box;
        width:260px;
        display: inline-block;
        margin:10px 15px;
        text-align: center;
        vertical-align: top;
        height: 249px;
        .b-close{
          text-align: right;
          color:@detailTextColor;
          font-size: 17px;
          position: relative;
          height: 20px;
          width:100%;
          span{
            position: absolute;
            right:6px;
            top:6px;
            margin:15px;
            cursor: pointer;
          }
        }
        .b-head{
          width:40px;
          height:40px;
          margin: 5px auto;
          border-radius: 50%;
          overflow: hidden;
          img{
            cursor: pointer;
          }
        }
        .b-name{
          font-size: 13px;
          color:@textColor;
          font-weight: bold;
          margin:8px auto;
        }
        .b-job{
          font-size: 12px;
          color:@detailTextColor;
          height: 14px;
          line-height: 14px;

        }
        .b-job-title{
          font-size: 12px;
          line-height: 14px;
           color:@detailTextColor;
           margin:4px auto 16px auto;
           height: 14px;

        }
        .b-line{
          width:100%;
          height: 0;
          border-bottom: 1px solid #EAF0F6;
        }
        .b-time{
          font-size: 18px;
          margin-top:16px;
          color:@detailTextColor;
          .b-day{
           color:@textColor;
          }
          .b-date{
           color:@textColor;
          }
        }
        .b-mail-btn{
          font-size: 13px;
          width:140px;
          height: 28px;
          line-height: 28px;
          margin:20px auto;
          background: #5488F9;
          color:white;
          border-radius: 4px;
          cursor: pointer;
          .icon-font{
            font-size: 18px;
          }
        }
      }
    }
    .recommend-block-r{
      height: 266px;
    }
    // 精准推荐样式
    .recommend-block{
      background: white;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(0,0,0,.06);
      display:inline-block;
      width:1200px;
      /*height: 266px;*/
      margin-top:16px;
      position: relative;
      padding-bottom: 8px;
      .recommend-item{
        position: relative;
        display: inline-block;
        margin-left:10px;
        margin-right: 35px;
        // margin-left: 6px;
        height: 74px;
        width:550px;
        padding:20px 10px;
        box-sizing: border-box;
        .r-head{
          margin-top: -8px;
          width:40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
        }
        .r-info{
          display: inline-block;
          margin-left:8px;
          margin-top: -4px;
          width:450px;
          max-height: 53px;
          font-size: 13px;
          overflow: hidden;
          vertical-align: top;
          .r-name{
            color:#33475B;
            font-weight: bold;
            cursor: pointer;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            i{
              margin-right: 5px;
              color: #B0C1D4;
            }
            .wake-name{
              font-size: 13px;
              color: #7C98B6;
            }
            .wake-line{
              display: inline-block;
              width:1px;
              height: 15px;
              vertical-align: middle;
              margin-left: 3px;
              margin-right: 3px;
              background: #DFE3EB;
            }
            .wake-company{
              font-size: 12px;
              color: #7C98B6;
            }
            .light{
              color:#B0C1D4;
              position: relative;
              &:after{
                content: '';
                position: absolute;
                top:6px;
                right:2px;
                width:5px;
                height:8px;
                border-left:1px solid #DFE3EB;
              }
            }
          }
          .wake-day{
            font-size: 16px;
            color: #33475B;
            margin-top: 2px;
            span{
              font-size: 20px;
              color:  #4990E2;
            }
          }
          .r-about{
            cursor: pointer;
            line-height: 18px;
            margin-top:8px;
            color:#7C98B6;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            .key-word,.type{
              color:#00B8CC;
              margin-left:5px;
              margin-right:5px;
              &:first-child{
                margin-left:0px;
              }
            }
          }
        }
        .r-icons{
          position: absolute;
          right: 0;
          top: 31px;
          .operation{
            font-size: 13px;
            color: #4990E2;
          }
          a, i{
            margin-right: 10px;
            font-size: 13px;
          }
          .icon-message{
            color: #00B8CC;
          }
          .icon-pinterest2{
            color: #F9645F;
          }
          .icon-fill{
            color: #00A8FF;
          }
          .icon-user{
            color: #00A8FF;
          }
          .icon-tel{
            color: #5388f9;
          }
        }
      }
      .recommend-item:hover{
        background: #F5F8FA;
      }
    }
    .lead-box{
      .recommend-item{
        .r-info{
          margin-top: -4px;
          width: 350px;
        }
      }
    }
    .birthday-block:hover, .ying-class-block:hover,.recommend-block:hover,.web-info:hover, .inquire-customer:hover{
        box-shadow: 0 0 14px rgba(84, 136, 249,.25);
    }
  }
  div.check-dialog{
    .el-dialog{
      width: 620px;
      height: 320px;
      .el-dialog__header{
        padding-bottom: 15px;
        border-bottom: 1px solid #DFE3EB;
        .el-dialog__title{
          color: #33475B;
        }
      }
      .el-dialog__body{
        text-align: center;
        img{
          margin-top: 15px;
          width: 96px;
        }
        p{
          margin-top: 18px;
          color: #4F6D95;
          font-size: 13px;
        }
        .check-text{
          margin-top: 28px;
          color: #33475B;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
.el-dropdown-menu{
  background: #FFFFFF;
  border: 1px solid #CBD6E2;
  box-shadow: 0 2px 4px 0 rgba(51,71,91,0.20);
  border-radius: 8px;
}
.el-dropdown-menu__item{
  font-size: 13px;
  color: #33475B;
  letter-spacing: 0;
}
.el-dropdown-menu__item:not(.is-disabled):hover{
  background: #F4F6F8;
}
.fr{
  float:right;
  margin-right:10px;
  .flow-recent{
    display: block;
    float: left;
    font-size: 13px;
    color: #7C98B6;
    line-height:20px;
    margin-left: 12px;
    cursor: pointer;
    &:hover{
      color: #5488F9;
    }
  }
  .selected{
    // border-bottom: 2px solid #5488F9;
    color: #5488F9;
  }
  &.select{
    position: relative;
    &:after{
      content: '';
      display: block;
      width: 46px;
      height: 2px;
      background: #5488F9;
      position: absolute;
      bottom: -2px;
      left: 11px;
      transition-duration: .2s
    }
    &.select2{
      &:after{
        width: 54px;
        left: 71px;
      }
    }
  }
  &.el-select{
    margin: 0;
  }
}
.view-more-link{
  position: absolute;
  right:20px;
  bottom: 20px;
}
.view-more{
  color:#7C98B6;
  cursor: pointer;
}
.view-more:hover{
  text-decoration: underline;
  color:#5488F9;
}
.contact-conversion{
  position: relative;
  width:100%;
  height: 345px;
  margin-top: 20px;
  background: #FFFFFF;
  box-shadow: 0 1px 1px rgba(0,0,0,0.15);
  // box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
  border-radius: 4px;
  font-size: 13px;
  &:hover{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15);
    // box-shadow: 0 0 14px rgba(84, 136, 249, 0.25);
  }
  .block-title{
    padding: 20px 20px 10px 20px;
    border-radius: 4px;
    .fr{
      margin-right: 240px;
    }
  }
  .filter-select{
    .fr.select{
      margin: 7px 30px 0 0;
    }
  }
}
.contact-wrap{
  width: 100%;
  height: 300px;
}
.funnel-data{
  width: 560px;
  padding: 20px;
  float: right;
  .contact-data{
    width: 186px;
    height: 95px;
    float: left;
    padding-top: 27px;
  }
  .contact-number{
    font-family: HelveticaNeue-Medium;
    font-size: 40px;
    color: #5488F9;
    letter-spacing: 0;
    text-align: center;
    line-height: 45px;
    height: 45px;
    opacity: 1;
    transition-duration: .3s;
    cursor: pointer;
    &.isloading{
      opacity: 0;
    }
    &:hover{
      color: #4A77D9;
    }
  }
  .contact-detail{
    font-family: PingFangSC-Regular;
    font-size: 13px;
    line-height: 34px;
    color: #7C98B6;
    letter-spacing: 0;
    text-align: center;
    i {
      cursor: pointer;
      color: #7C98B6;
    }
  }
}
.funnel-wrap{
  width: 600px;
  height: 285px;
  position: relative;
  float: left;
  #funnel{
    width: 400px;
    height: 285px;
    position: absolute;
    z-index: 2;
    left: 25px;
  }
  .funnel-number {
    position: absolute;
    z-index: 1;
    width: 350px;
    right: 0;
    top: 20px;
    border-right: 2px solid #EAF0F6;
    padding: 8px 0px 20px 0;
    li {
      height: 45px;
      .f-line{
        display: block;
        float: right;
        height: 45px;
        background: url('../../assets/img/index/dashed.png') right center no-repeat;
        &.f-1{
          width: 45px;
        }
        &.f-2{
          width: 80px;
        }
        &.f-3{
          width: 115px;
        }
        &.f-4{
          width: 152px;
        }
        &.f-5{
          width: 178px;
        }
      }
      .f-number{
        padding-left: 10px;
        display: block;
        float: right;
        width: 140px;
        height: 45px;
        font: 16px/45px PingFangSC-Regula;
        color: #5488F9;
        .f-n-change{
          display: inline-block;
          height: 12px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          line-height: 12px;
          letter-spacing: 0;
          color: #bbc9da;
          border-left: 1px solid #adc6fc;
          padding: 0 8px;
          i{
            color: #2bd1e5;
          }
        }
        span:hover{
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
}
.contact-loading{
  width: 100%;
  height: 345px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  .c-loading{
    background: #F5F8FA;
    border-radius: 2px;
    animation: loadingColor 1s infinite;
    -webkit-animation: loadingColor 1s infinite;
    -moz-animation: loadingColor 1s infinite;
    -ms-animation: loadingColor 1s infinite;
    -o-animation: loadingColor 1s infinite;
  }
  .c-l-body{
    height: 240px;
    padding-top: 66px;
    .c-l-body1{
      width: 560px;
      float:left;
      padding: 11px 0 0 35px;
      background: #fff;
      overflow: hidden;
      .c-l-body_funnel{
        width: 375px;
        float: left;
        .c_funnel{
          margin: 0 auto;
          height: 45px;
          padding-bottom: 2px;
          &:nth-child(1){
            width: 370px;
            .c_funnel_body{
              width: 298px;
            }
          }
          &:nth-child(2){
            width: 298px;
            .c_funnel_body{
              width: 226px;
            }
          }
          &:nth-child(3){
            width: 226px;
            .c_funnel_body{
              width: 154px;
            }
          }
          &:nth-child(4){
            width: 154px;
            .c_funnel_body{
              width: 82px;
            }
          }
          &:nth-child(5){
            width: 82px;
            .c_funnel_body{
              width: 82px;
            }
            &:before{
             border:none
            }
            &:after{
             border:none
            }
          }
          .c_funnel_body{
            height: 45px;
            margin: 0 auto;
            float: left;
          }
          &:before{
            content: '';
            display: block;
            float:left;
            width:0;
            height:0;
            border-width: 21.5px 18px 21.5px 18px;
            border-style:solid;
            border-color: #F5F8FA #F5F8FA transparent transparent;
            animation: loadingColor 1s infinite;
            -webkit-animation: loadingColor 1s infinite;
            -moz-animation: loadingColor 1s infinite;
            -ms-animation: loadingColor 1s infinite;
            -o-animation: loadingColor 1s infinite;
          }
          &:after{
            content: '';
            display: block;
            float:right;
            width:0;
            height:0;
            border-width: 21.5px 18px 21.5px 18px;
            border-style:solid;
            border-color: #F5F8FA transparent transparent #F5F8FA;
            animation: loadingColor 1s infinite;
            -webkit-animation: loadingColor 1s infinite;
            -moz-animation: loadingColor 1s infinite;
            -ms-animation: loadingColor 1s infinite;
            -o-animation: loadingColor 1s infinite;
          }
        }
      }
      .c-l-number{
        width: 60px;
        float: left;
        padding: 18px 0 0 40px;
        .c-l_p{
          width: 60px;
          height: 18px;
          margin-bottom: 27px;
        }
      }
    }
    .c-l-body2{
      width: 560px;
      padding: 4px 20px 0 20px;
      float: right;
      .c-l-data{
        width: 186px;
        height: 38px;
        padding: 34px 0 0 0;
        margin-bottom: 50px;
        float: left;
        background: #fff;
        position: relative;
        .loading{
          top: 30px;
          width: 20px;
          height: 20px;
        }
        .loading-circle{
          border: 2px #5488F9 solid;
          border-style: solid solid none none;
        }
        // &:before{
        //   content: '';
        //   display: block;
        //   width: 60px;
        //   height: 33px;
        //   background: #F5F8FA;
        //   border-radius: 2px;
        //   margin: 0 auto 14px auto;
        //   animation: loadingColor 1s infinite;
        //   -webkit-animation: loadingColor 1s infinite;
        //   -moz-animation: loadingColor 1s infinite;
        //   -ms-animation: loadingColor 1s infinite;
        //   -o-animation: loadingColor 1s infinite;
        // }
      }
    }
  }
}
</style>
