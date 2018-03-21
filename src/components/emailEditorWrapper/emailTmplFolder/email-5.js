// preload: 生成content所需参数，参数详情：@common/emailTmplContent
export default {
  id: 5,
  templateName: '销售产品',
  templateCode: '5',
  templateCoverUrl: 'https://img.onloon.co/20180209165057469221648.png',
  templateContent: [
    {
      preload: {
        imgUrl: 'https://img.onloon.co/20180125194616952615738.png'
      },
      type: 'img'
    },
    {
      preload: {
        text: `<div style="color: rgb(51, 51, 51); text-align: center; line-height: 1;"><br></div><div style="color: #333333;text-align: center;"><span style="fontsize: 20px;">CERAMIC STUDIO</span><br></div><div><span style="font-size: 24px;"><br></span></div>`
      },
      type: 'title'
    },
    {
      preload: {
        imgUrl: 'https://img.onloon.co/20180205181452581963183.png'
      },
      type: 'img'
    },
    {
      preload: {
        text: `<div style="text-align: center;"><span style="font-size: 18px; font-family: &quot;Noto Serif CJK SC&quot;, &quot;Noto Serif CJK&quot;, &quot;Source Han Serif SC&quot;, &quot;Source Han Serif&quot;, source-han-serif-sc, &quot;Source Han Sans CN Regular&quot;, PingFangSC-Regular, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue For Number&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><br></span></div><div style="text-align: center;"><span style="font-size: 18px; font-family: &quot;Noto Serif CJK SC&quot;, &quot;Noto Serif CJK&quot;, &quot;Source Han Serif SC&quot;, &quot;Source Han Serif&quot;, source-han-serif-sc, &quot;Source Han Sans CN Regular&quot;, PingFangSC-Regular, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue For Number&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">OUR COLLECTION</span></div><div style="text-align: center;"><span style="font-size: 14px; font-family: &quot;Noto Serif CJK SC&quot;, &quot;Noto Serif CJK&quot;, &quot;Source Han Serif SC&quot;, &quot;Source Han Serif&quot;, source-han-serif-sc, &quot;Source Han Sans CN Regular&quot;, PingFangSC-Regular, &quot;Microsoft YaHei&quot;, &quot;Helvetica Neue For Number&quot;, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">I"m a paragraph. Click here to add your own text and edit me. It’s easy. ust click “Edit Text” or double click me to add your own content and make changes to the font.&nbsp; I’m a great place for you to tell a story and let your users know a little more about you.</span><br></div><div style="text-align: center;"><span style="font-size: 14px;"><br></span></div><div style="text-align: center;"><span style="font-size: 14px;"><br></span></div>`
      },
      type: 'text'
    },
    {
      preload: {
        text: 'Shop Now',
        link: '#',
        width: 30,
        height: 40,
        bgColor: '#5488F9',
        textColor: '#ffffff'
      },
      type: 'btn'
    },
    {
      preload: {
        borderWidth: 3,
        borderType: 'solid',
        borderColor: '#ffffff',
        marginTop: 10,
        marginBottom: 10,
        width: 100
      },
      type: 'line'
    },
    {
      preload: {
        width: 50,
        imgGroupList: [
          {
            imgUrl: 'https://img.onloon.co/20180205181456020488895.png'
          },
          {
            imgUrl: 'https://img.onloon.co/20180205181453191888637.png'
          }
        ]
      },
      type: 'imgGroup'
    },
    {
      preload: {
        text: `<div style="text-align: center;"><font color="#996600"><br></font></div><div style="text-align: center;"><font color="#ffffff"><span style="font-size: 16px;">CERAMIC STUDIO</span><br></font></div><div><font color="#ffffff"><br></font></div><div style="text-align: center;"><span style="text-align: left;"><font color="#ffffff">info@my-domain.com</font></span><font color="#ffffff">&nbsp; |&nbsp;&nbsp;</font><span style="text-align: left;"><font color="#ffffff">+86 123-4567-8910</font></span></div><div style="text-align: center;"><font color="#996600"><br></font></div><div style="text-align: center;"><br></div>`,
        fbLink: 'https://www.facebook.com/',
        twLink: 'https://www.twitter.com/',
        inLink: 'https://www.linkedin.com/',
        pinLink: '',
        youLink: '',
        bgColor: '#333333'
      },
      type: 'footertext'
    }
  ]
}
