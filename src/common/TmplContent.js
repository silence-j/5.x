// @hansin 2018.1.20
/**
 * h标签在邮件中存在样式问题，尽量不实用h标签
 */
export const getTmplContent = (type, params) => {
  let defaultImg = 'https://qiniu.onloon.co/maildefault.png'
  let Lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!'
  let content = ''
  let fbPng = 'https://img.onloon.co/20180207144639888860045.png?x-oss-process=image/resize,h_30'
  let twPng = 'https://img.onloon.co/20180207144639940267178.png?x-oss-process=image/resize,h_30'
  let pinPng = 'https://img.onloon.co/20180207144639937613180.png?x-oss-process=image/resize,h_30'
  let inPng = 'https://img.onloon.co/20180207144639936461384.png?x-oss-process=image/resize,h_30'
  let youPng = 'https://img.onloon.co/20180207144639941282745.png?x-oss-process=image/resize,w_20'
  let shopId = window.localStorage.shopId || ''
  let buyerLink = process.env.HOMEPAGE + '/?shopId=' + shopId
  let channelId = getChannelId()
  switch (type) {
    // 分割线
    case 'line':
      let a = Object.assign({
        borderWidth: 3,
        borderType: 'solid',
        borderColor: '#eeeeee',
        marginTop: 8,
        marginBottom: 8,
        width: 100
      }, params)
      content = `<div 
        style="border-top:${a.borderWidth}px ${a.borderType} ${a.borderColor};margin-top: ${a.marginTop}px;margin-bottom: ${a.marginBottom}px;margin-right: auto;margin-left: auto;width: ${a.width}%">
      </div>`
      break
    // 富文本
    case 'text':
      let b = Object.assign({
        text: `<div class="text-box" style="font-size:14px;text-align:justify;"><span style="font-size: 20px;">show your hot products</span></div><div class="text-box" style="font-size:14px;text-align:justify;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!</div>`
      }, params)
      content = `<div class="text-box" style="font-size:14px;text-align:justify;word-break: break-word;">${b.text}</div>`
      break
    // 按钮
    case 'btn':
      params.link = (!params.link || params.link === '#') ? buyerLink : params.link
      let c = Object.assign({
        text: 'Go shopping',
        link: buyerLink,
        width: 25,
        height: 26,
        radius: 4,
        fontSize: 14,
        bgColor: '#5488F9',
        textColor: '#ffffff'
      }, params)
      content = `<div style="text-align: center;font-size:14px;">
        <a target="_blank" href="${c.link}" 
          style="text-decoration: none; user-select: none; font-size: ${c.fontSize}px;background-color: ${c.bgColor};border-radius: ${c.radius}px;display:inline-block;color: ${c.textColor};min-width:${c.width}%;padding-top: ${parseInt(c.height / 2)}px;padding-bottom: ${parseInt(c.height / 2)}px;line-height: 0;">${c.text}</a>
      </div>`
      break
    // 单图片
    case 'img':
      let d = Object.assign({
        imgUrl: defaultImg
      }, params)
      content = `<img src="${d.imgUrl}" class="cur-img" style="max-width: 100%;height:auto;" alt="" />`
      break
    // 图片组
    case 'imgGroup':
      let e = Object.assign({
        width: 50,
        imgGroupList: [
          {
            imgUrl: defaultImg
          },
          {
            imgUrl: defaultImg
          }
        ]
      }, params)
      content = `<div style="font-size:0;text-align: center;">`
      for (let i = 0; i < e.imgGroupList.length; i++) {
        content += `<div style="width:${e.width}%;display: inline-block;vertical-align: middle;text-align: center;margin-top: 10px;"><img style="width: 98%;" src="${e.imgGroupList[i].imgUrl}" alt="" /></div>`
      }
      content += `</div>`
      break
    // 卡片一
    case 'imgCard1':
      let f = Object.assign({
        imgUrl: defaultImg,
        text: Lorem
      }, params)
      content = `<div>
        <img src=${f.imgUrl} class="cur-img" style="max-width:100%;height:auto;" alt="" />
        <div class="content text-box" style="font-size:14px;line-height: 20px;margin-top: 8px;word-break: break-word;">${f.text}</div>
      </div>`
      break
    // 卡片二
    case 'imgCard2':
      let g = Object.assign({
        imgUrl: defaultImg,
        text: Lorem
      }, params)
      content = `<div style="width: 100%;display: flex;justify-content: center;align-items: center;box-sizing: border-box;font-size: 0;">
        <img src=${g.imgUrl} style="width:50%;vertical-align: top;" alt="" />
        <div class="content text-box img-text" style="display:inline-block;width:50%;box-sizing: border-box;font-size:14px;line-height: 20px;padding-left: 8px;word-break: break-word;">${g.text}</div>
     </div>`
      break
    // 卡片三
    case 'imgCard3':
      let h = Object.assign({
        imgUrl: defaultImg,
        text: Lorem
      }, params)
      content = `<div style="width: 100%;display: flex;justify-content: center;align-items: center;box-sizing: border-box;font-size: 0;">
        <div class="content text-box img-text" style="display:inline-block;width:50%;box-sizing: border-box;font-size:14px;line-height: 20px;padding-left: 8px;word-break: break-word;">${h.text}</div>
        <img src=${h.imgUrl} style="width:50%;vertical-align: top;" alt="" />
      </div>`
      break
    // 背景+文本
    case 'textImgBg':
      let i = Object.assign({
        imgUrl: defaultImg,
        text: `<div><br></div><div style="text-align: center;"><span style="font-size: 16px;">Lorem ipsum dolor sit amet</span></div><div><span style="font-size: 16px;"><br></span></div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!
        <div><br></div><div><br></div>`
      }, params)
      content = `<div class="e-bg" style="font-size:12px;background-image:url('${i.imgUrl}');background-size: cover;">
        <div class="content text-box" style="font-size:14px;max-width: 750px; margin: 0 auto;padding: 10px;word-break: break-word;">
          ${i.text}
        </div>
      </div>`
      break
    // 背景+文本 + 按钮
    case 'textImgBtn':
      params.btnLink = (!params.btnLink || params.btnLink === '#') ? buyerLink : params.btnLink
      let j = Object.assign({
        imgUrl: defaultImg,
        text: `<div><span style="font-size: 16px;"><br></span></div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!
        <div><br></div><div><br></div>`,
        btnText: 'Go shoppping',
        btnLink: buyerLink,
        btnWidth: 25,
        btnHeight: 30,
        btnRadius: 4,
        btnFontSize: 14,
        btnBgColor: '#5488F9',
        btnTextColor: '#ffffff'
      }, params)
      content = `<div class="e-bg" style="font-size:12px;background-image:url('${j.imgUrl}');background-size: cover;">
        <div style="padding: 10px;">
          <div class="content text-box" style="font-size:14px;max-width: 750px; margin: 0 auto;padding: 10px;word-break: break-word;">${j.text}</div>
          <div style="text-align: center;">
            <a class="btn" target="_blank" href="${j.btnLink}"
            style="text-decoration: none; user-select: none;font-size: ${j.btnFontSize}px;margin-bottom: 10px;background-color: ${j.btnBgColor};border-radius: ${j.btnRadius}px;display:inline-block;color: ${j.btnTextColor};min-width:${j.btnWidth}%;padding-top:${parseInt(j.btnHeight / 2)}px;padding-bottom: ${parseInt(j.btnHeight / 2)}px;line-height: 0;">${j.btnText}</a>
          </div>
        </div>
      </div>`
      break
    // 底部签名
    case 'footer':
      let k = Object.assign({
        text: `<p style="text-align: right;">-------签名</p>`,
        bgColor: '#324751'
      }, params)
      content = `<div class="content text-box" style="padding:20px;text-align:center;text-align:center;font-size:12px;line-height:18px;color: #324751;word-break: break-word;">
        ${k.text}
      </div>`
      break
    // 主标题
    case 'title':
      let l = Object.assign({
        text: `<span style="font-size: 18px;">SHOW COMPANY NAME</span>`
      }, params)
      content = `<div class="text-box" style="font-weight: bold;font-size: 18px;word-break: break-word;">${l.text}</div>`
      break
    // 社交关注
    case 'social':
      params.fbLink = params.fbLink === 'https://www.facebook.com/' ? ('https://www.facebook.com/' + channelId.fb) : params.fbLink
      params.twLink = params.twLink === 'https://www.twitter.com/' ? ('https://www.twitter.com/' + channelId.tw) : params.twLink
      params.inLink = params.inLink === 'https://www.linkedin.com/' ? ('https://www.linkedin.com/' + channelId.lk) : params.inLink
      if (!params.fbLink) { delete params.fbLink }
      if (!params.twLink) { delete params.twLink }
      if (!params.inLink) { delete params.inLink }
      let m = Object.assign({
        fbLink: 'https://www.facebook.com/' + channelId.fb,
        twLink: 'https://www.twitter.com/' + channelId.tw,
        inLink: 'https://www.linkedin.com/' + channelId.lk,
        pinLink: '',
        youLink: ''
      }, params)
      m.fb = m.fbLink ? `<a target="_blank" href="${m.fbLink}"
        class="fb" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;background-image:url('${fbPng}');background-size:cover;"></a>` : ``
      m.tw = m.twLink ? `<a target="_blank" href="${m.twLink}"
        class="tw" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${twPng}');background-size:cover;"></a>` : ``
      m.in = m.inLink ? `<a target="_blank" href="${m.inLink}"
        class="linkin" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${inPng}');background-size:cover;"></a>` : ``
      m.pin = m.pinLink ? `<a target="_blank" href="${m.pinLink}"
      class="linkin" 
      style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${pinPng}');background-size:cover;"></a>` : ``
      m.you = m.youLink ? `<a target="_blank" href="${m.youLink}"
      class="linkin" 
      style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image: url('${youPng}');background-repeat: no-repeat;background-position: center;"></a>` : ``
      content = `<div style="text-align: center;font-size: 12px;">
      ${m.fb}${m.tw}${m.in}${m.pin}${m.you}
      </div>`
      break
    // FBCEBOOK message
    case 'message':
      let n = Object.assign({
        homePageId: channelId.fb,
        text: 'Message Us',
        width: 25,
        height: 26,
        radius: 40,
        fontSize: 14,
        bgColor: '#5488F9',
        textColor: '#ffffff'
      }, params)
      content = `<div style="text-align: center;font-size: 12px;">
        <a target="_blank" href="https://m.me/${n.homePageId}" 
          style="text-decoration: none; user-select: none;font-size: ${n.fontSize}px;background-color: ${n.bgColor};border-radius: ${n.radius}px;display:inline-block;color: ${n.textColor};width:${n.width}%;padding-top: ${parseInt(n.height / 2 - n.fontSize / 2)}px;padding-bottom: ${parseInt(n.height / 2 - n.fontSize / 2)}px;line-height: 0;"><img src="https://img.onloon.co/20180207162951460111827.png?x-oss-process=image/resize,h_16" style="vertical-align: middle" > Message Us</a>
      </div>`
      break
    // 富文本
    case 'linetext':
      let o = Object.assign({
        text: '<div><br></div><div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!</div><div><br></div>',
        borderWidth: 3,
        borderType: 'solid',
        borderColor: '#cbd6e3',
        bgColor: '#F0F2F3'
      }, params)
      content = `<div style="border: ${o.borderWidth}px ${o.borderType} ${o.borderColor};background-color:${o.bgColor};font-size: 14px;padding: 8px 8px;word-break: break-word;">
        ${o.text}
      </div>`
      break
    // 产品
    case 'product':
      let p = Object.assign({
        productList: [
          {
            name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis commodi distinctio labore luptatibus adipisci.',
            link: buyerLink,
            imgUrl: defaultImg
          },
          {
            name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis commodi distinctio laboren luptatibus adipisci.',
            link: buyerLink,
            imgUrl: defaultImg
          }
        ]
      }, params)
      if (p.productList.length === 1) {
        content = `<div style="width: 100%; box-sizing: border-box;font-size: 0;">
          <img src=${p.productList[0].imgUrl} style="width:50%;vertical-align: top;" alt="" />
          <div class="content" style="color: #333333;display:inline-block;width:50%;box-sizing: border-box;font-size:14px;line-height: 20px;padding-left: 8px;text-align: left;">
            <a style="text-decoration: none; user-select: none;color: #333333;" href="${p.productList[0].link}">${p.productList[0].name}</a>
          </div>
       </div>`
      } else if (p.productList.length === 2) {
        content = `<div style="width: 100%; box-sizing: border-box;font-size: 0;display: flex;justify-content: stretch;">
          <div class="content" style="display:inline-block;width:50%;box-sizing: border-box;font-size:14px;line-height: 20px;padding-right: 3px;">
            <span style="display: flex;flex-direction: column;min-height: 100%;justify-content: space-between;color: #333333;">
              <img src=${p.productList[0].imgUrl}  style="width:100%;vertical-align: top;" alt="" />
              <a href="${p.productList[0].link}" target="_blank" style="padding: 10px;line-height: 20px;text-decoration: none; user-select: none;color: #333333;">
                ${p.productList[0].name}
              </a>
            </span>
          </div>
          <div class="content" style="display:inline-block;width:50%;box-sizing: border-box;font-size:14px;line-height: 20px;padding-left: 3px;">
          <span style="display: flex;flex-direction: column;min-height: 100%;justify-content: space-between;color: #333333;">
            <img src=${p.productList[1].imgUrl}  style="width:100%;vertical-align: top;" alt="" />
            <a href="${p.productList[1].link}" target="_blank" style="padding: 10px;line-height: 20px;text-decoration: none; user-select: none;color: #333333;">
              ${p.productList[1].name}
            </a>
          </span>
          </div>
       </div>`
      }
      break
      // 富文本
    case 'footertext':
      params.fbLink = params.fbLink === 'https://www.facebook.com/' ? ('https://www.facebook.com/' + channelId.fb) : params.fbLink
      params.twLink = params.twLink === 'https://www.twitter.com/' ? ('https://www.twitter.com/' + channelId.tw) : params.twLink
      params.inLink = params.inLink === 'https://www.linkedin.com/' ? ('https://www.linkedin.com/' + channelId.lk) : params.inLink
      if (!params.fbLink) { delete params.fbLink }
      if (!params.twLink) { delete params.twLink }
      if (!params.inLink) { delete params.inLink }
      let q = Object.assign({
        text: `<div><font color="#ffffff"><br></font></div><div><font color="#ffffff"><br></font></div><div style="text-align: center;"><font color="#ffffff" style="font-size: 16px;">Show company name</font></div><div style="text-align: center;"><font color="#ffffff"><br></font></div><div style="text-align: center;"><font color="#ffffff">Email address&nbsp; &nbsp; &nbsp; &nbsp;|&nbsp; &nbsp; &nbsp; Contact number</font></div><div style="text-align: center;"><br></div><div><br></div>`,
        fbLink: 'https://www.facebook.com/' + channelId.fb,
        twLink: 'https://www.twitter.com/' + channelId.tw,
        inLink: 'https://www.linkedin.com/' + channelId.lk,
        pinLink: '',
        youLink: '',
        bgColor: '#525354'
      }, params)
      q.fb = q.fbLink ? `<a target="_blank" href="${q.fbLink}"
        class="fb" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;background-image:url('${fbPng}');background-size:cover;"></a>` : ``
      q.tw = q.twLink ? `<a target="_blank" href="${q.twLink}"
        class="tw" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${twPng}');background-size:cover;"></a>` : ``
      q.in = q.inLink ? `<a target="_blank" href="${q.inLink}"
        class="linkin" 
        style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${inPng}');background-size:cover;"></a>` : ``
      q.pin = q.pinLink ? `<a target="_blank" href="${q.pinLink}"
      class="pin" 
      style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${pinPng}');background-size:cover;"></a>` : ``
      q.you = q.youLink ? `<a target="_blank" href="${q.youLink}"
      class="you" 
      style="text-decoration: none; user-select: none;display: inline-block;width: 24px;padding-top:24px;margin-left: 15px;background-image:url('${youPng}');background-repeat: no-repeat;background-position: center;"></a>` : ``
      content = `<div class="fo" style="background-color:${q.bgColor};font-size: 14px;padding: 16px 16px;">
        <div class="content text-box" style="max-width: 750px; margin: 0 auto;word-break: break-word;">${q.text}</div>
        <div style="text-align: center;">${q.fb}${q.tw}${q.in}${q.pin}${q.you}</div>
      </div>`
      break
  }
  return content
}

export const tmplContenToTable = (mailLayout, tmplType) => {
  let arr = ''
  let headArr = ''
  let footerArr = ''
  let len = mailLayout.length
  // header footer 需要占全宽
  for (let i = 0; i < len; i++) {
    let item = mailLayout[i]
    if (i === 0 && (item.type === 'textImgBg' || item.type === 'textImgBtn')) {
      headArr = `<tr><td valign="top" style="width:100%;">${item.content || ''}</td></tr><tr height="2"></tr>`
    } else if (i === len - 1 && item.type === 'footertext') {
      footerArr = `<tr><td valign="top" style="width:100%;">${item.content || ''}</td></tr><tr height="2"></tr>`
    } else {
      if (item.type === 'img') {
        arr += `<tr><td valign="top" style="width:100%;text-align:center;">${item.content || ''}</td></tr><tr height="2"></tr>`
      } else {
        arr += `<tr><td valign="top" style="width:100%;">${item.content || ''}</td></tr><tr height="2"></tr>`
      }
    }
  }
  let tableContent = `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 0;">
      <tbody>
        <tr>
          <td align="center" valign="top" bgcolor="#ffffff">
            <table border="0" cellspacing="0" cellpadding="0" bgcolor="#fff" style="text-align: center;width: 100%;">
              <tbody>
                <tr height="0"></tr>
                ${headArr}
                <tr height="0"></tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" valign="top" bgcolor="#ffffff">
            <table width="750" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff" style="text-align: center;max-width: 750px;">
              <tbody>
                <tr height="0"></tr>
                ${arr}
                <tr height="0"></tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" valign="top" bgcolor="#ffffff">
            <table border="0" cellspacing="0" cellpadding="0" bgcolor="#fff" style="text-align: center;width: 100%;">
              <tbody>
                <tr height="0"></tr>
                ${footerArr}
                <tr height="0"></tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>`.replace(/<a href=/, `<a target="_blank" href=`)
  // 如果是email需要替换href
  if (tmplType && tmplType === 'email') {
    tableContent = rqHref(tableContent)
  }
  return tableContent
}

export function getFirstImg (str) {
  let reg = new RegExp(/<img(.*?)src="(.*?)"(.*?)>/, 'i')
  let irr = str.match(reg)
  if (irr && irr.length) {
    let srcReg = new RegExp(/src=\S*/, 'i')
    let srr = irr[0].match(srcReg)
    if (srr && srr.length) {
      let src = srr[0].split('"')[1]
      return src
    } else {
      return null
    }
  } else {
    return null
  }
}

// href 替换
function rqHref (ostr) {
  let str = ostr
  let reg = new RegExp(/href=\S*/, 'gi')
  let mrr = str.match(reg)
  if (!mrr || !mrr.length) {
    return ostr
  }
  let drr = deleHave(mrr)
  for (let item of drr) {
    let istr = item
    if (item.includes('?')) {
      istr = 'href="' + item.slice(6, -1) + '&sourceType=1"'
      let _item = item.replace('?', '\\?')
      let sreg = new RegExp(_item, 'gi')
      str = str.replace(sreg, istr)
    } else {
      istr = 'href="' + item.slice(6, -1) + '?sourceType=1"'
      let sreg = new RegExp(item, 'gi')
      str = str.replace(sreg, istr)
    }
  }
  return str
}

// 数组去重
function deleHave (arr) {
  let darr = []
  for (let item of arr) {
    if (darr.indexOf(item) === -1) {
      darr.push(item)
    }
  }
  return darr
}

// 渠道列表
export const getChannelId = () => {
  let channelList = window.localStorage.channelList ? JSON.parse(window.localStorage.channelList) : []
  let channel = {
    fb: '',
    tw: '',
    lk: '',
    pin: '',
    ma: ''
  }
  channelList.forEach((item) => {
    if (item.channelId === 'FACEBOOK' && item.bindingTag === 1) {
      channel.fb = item.homePageId || ''
    } else if (item.channelId === 'TWITTER' && item.bindingTag === 1) {
      channel.tw = item.nickName || ''
    } else if (item.channelId === 'LINKEDIN' && item.bindingTag === 1 && item.homePageId) {
      channel.lk = 'company/' + item.homePageName || ''
    } else if (item.channelId === 'LINKEDIN' && item.bindingTag === 1) {
      // 此处需要获取用户lk-id
      // channel.tw = 'in/' + item.nickName.replace(' ', '-') + '-' + item.provideUserId
    }
  })
  return channel
}
