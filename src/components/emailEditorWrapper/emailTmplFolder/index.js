/*
  *'/src/components/emailEditorWrapper/emailTmplFolder'
  *模版templateContent需要 type 和 preload 两个参数
  *type 是卡片类型， preload 是dom元素需要样式参数
  *参数查看： @common/TmplContent.js
  *需要富文本的参数，查看控制台里.text-box 下的innerHTML
  *主账号：13738101542  123456
  */

import defaultTmpl from './email-default'
import Tmp1 from './email-1'
import Tmp2 from './email-2'
import Tmp3 from './email-3'
import Tmp4 from './email-4'
import Tmp5 from './email-5'

const tmplArr = [
  defaultTmpl,
  Tmp1,
  Tmp2,
  Tmp3,
  Tmp4,
  Tmp5
]

export default tmplArr
