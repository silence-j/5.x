// preload: 生成content所需参数，参数详情：@common/emailTmplContent
export default {
  id: 0,
  templateName: '空白模版',
  templateCode: '0',
  templateCoverUrl: 'https://img.onloon.co/20180206154225252998726.png',
  templateContent: [
    {
      preload: {
        imgUrl: 'https://qiniu.onloon.co/maildefault.png'
      },
      type: 'img'
    },
    {
      preload: {
        text: `<div class="text-box" style="font-size:14px;text-align:justify;"><span style="font-size: 20px;">show your hot products</span></div><div class="text-box" style="font-size:14px;text-align:justify;">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ut, ipsam et, quae provident neque laborum! Nulla temporibus quidem et facere ducimus, repellendus id illo, dolorem. Consequuntur harum perferendis aut!</div>`
      },
      type: 'text'
    }
  ]
}
