/**
 * @author monkeywang
 * Date: 17/4/12
 */
import $ from 'jquery'
class EditorApi {
  constructor () {
    this.frame = ''
    this.editorBarStyle = {
      'border': '1px dashed #666',
      'background-color': 'rgba(0,0,0,0.1)',
      'z-index': '999',
      'position': 'absolute',
      'cursor': 'pointer',
      'top': '0',
      'left': '0',
      'right': '0',
      'bottom': '0'
      // 'height': '100%'
    }
    this.editorIconStyle = {
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'width': '50px',
      'height': '50px',
      'line-height': '50px',
      'text-align': 'center',
      'transform': 'translate(-50%, -50%)',
      'fontSize': '30px',
      'background': 'rgba(0,0,0,0.3)',
      'border-radius': '50%',
      'color': '#fff'
    }
  }
  /**
   * 创建编辑按钮
   * @param tagName
   *  ['#logo-img', 'editor-logo'],
      ['#carousel-inner', 'editor-carousel'],
      ['#guide-img', 'editor-avert'],
      ['#aboutUs', 'editor-about-us'],
      ['#productList', 'editor-products'],
      ['#footer-container', 'editor-footer']
      #logo-img
      #carousel-inner
      #guide-img
      #aboutUs
      #productList
      #footer-container
   * @param fn
   */
  crateEditTag (tagName, fn) {
    this.frame = window.frames['buyer-editor'].document
    let tempCode = window.tempCode
    console.log('crateEditTag:' + tempCode)
    let $tagName = $(tagName, this.frame) // 获取可编辑区域
    // 创建编辑按钮
    let $editBar = $('<span class="editor-bar"><i class="glyphicon glyphicon-edit editor-btn"></i></span>')
    /**
     * 给父元素 不等于 absolute 的元素 加 relative position
     * @param  {[type]} $tagName.parent().css('position') !             [description]
     * @return {[type]}                                   [description]
     */
    if ($tagName.parent().css('position') !== 'absolute') {
      $tagName.parent().css('position', 'relative')
    }
    $tagName.before($editBar)
    this.editorBarStyle.width = tagName === '#logo-img' ? '300px' : '100%'
    this.editorBarStyle.left = tagName === '#logo-img' ? '15px' : '0'
    /**
      面料、辅料、皮革模板:15
      五金工具:11
      电子灯具模板:16
      医疗模板:13
      汽车用品模板:19
      户外运动：1
      男装：12
      珠宝：14
      办公用品：17
      鞋靴：18
      3c：20
     * @param  {[type]} tempCode [description]
     * @return {[type]}          [description]
     */
    if (tempCode === '16') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '52px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '52px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '14px' : '0'
      if (tagName === '#carousel-inner') {
        this.editorBarStyle.height = ''
      }
    } else if (tempCode === '11') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '225px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '75px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '14px' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '23px' : '0'
    } else if (tempCode === '15') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '156px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '52px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '17px' : '0'
    } else if (tempCode === '19') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '165px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '55px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '17px' : '0'
    } else if (tempCode === '13') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '140px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '47px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '50%' : '0'
      this.editorBarStyle.transform = tagName === '#logo-img' ? 'translateX(-50%)' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '33px' : '0'
    } else if (tempCode === '12') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '135px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '45px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0px' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '42px' : '0'
    } else if (tempCode === '14') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '220px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '73.6px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '50%' : '0'
      this.editorBarStyle.transform = tagName === '#logo-img' ? 'translateX(-50%)' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '30.2px' : '0'
    } else if (tempCode === '17') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '78px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '78px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0px' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '42px' : '0'
      this.editorBarStyle.zIndex = tagName === '#logo-img' ? '1000' : '999'
    } else if (tempCode === '18') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '70px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '70px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '50%' : '0'
      this.editorBarStyle.transform = tagName === '#logo-img' ? 'translateX(-50%)' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '23px' : '0'
    } else if (tempCode === '20') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '66px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '66px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0px' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '18.5px' : '0'
      this.editorBarStyle.zIndex = tagName === '#logo-img' ? '1000' : '999'
    } else if (tempCode === '21') {
      this.editorBarStyle.width = tagName === '#logo-img' ? '135px' : '100%'
      this.editorBarStyle.height = tagName === '#logo-img' ? '45px' : '100%'
      this.editorBarStyle.left = tagName === '#logo-img' ? '0px' : '0'
      this.editorBarStyle.top = tagName === '#logo-img' ? '42px' : '0'
    }
    // if ()
    if (tagName === '#logo-img') {
      this.editorIconStyle.width = tagName === '#logo-img' ? '43px' : '50px'
      this.editorIconStyle.height = tagName === '#logo-img' ? '43px' : '50px'
      this.editorIconStyle['fontSize'] = tagName === '#logo-img' ? '21px' : '30px'
      this.editorIconStyle['lineHeight'] = tagName === '#logo-img' ? '43px' : '50px'
    } else if (tagName === '#carousel-inner') {
       /**
       * 轮播图
       * @type {[type]}
       */
      this.editorIconStyle.width = '119px'
      this.editorIconStyle.height = '119px'
      this.editorIconStyle['fontSize'] = '56px'
      this.editorIconStyle['lineHeight'] = '119px'
    } else if (tagName === '#guide-img') {
       /**
       * 广告位
       * @type {[type]}
       */
      this.editorIconStyle.width = '99px'
      this.editorIconStyle.height = '99px'
      this.editorIconStyle['fontSize'] = '47px'
      this.editorIconStyle['lineHeight'] = '99px'
    } else if (tagName === '#guide-img') {
       /**
       * 关于我们
       * @type {[type]}
       */
      this.editorIconStyle.width = '119px'
      this.editorIconStyle.height = '119px'
      this.editorIconStyle['fontSize'] = '56px'
      this.editorIconStyle['lineHeight'] = '119px'
    } else if (tagName === '#guide-img') {
       /**
       * 产品列表
       * @type {[type]}
       */
      this.editorIconStyle.width = '119px'
      this.editorIconStyle.height = '119px'
      this.editorIconStyle['fontSize'] = '56px'
      this.editorIconStyle['lineHeight'] = '119px'
    } else if (tagName === '#guide-img') {
       /**
       * 页脚
       * @type {[type]}
       */
      this.editorIconStyle.width = '99px'
      this.editorIconStyle.height = '99px'
      this.editorIconStyle['fontSize'] = '47px'
      this.editorIconStyle['lineHeight'] = '99px'
    }
    // 设置编辑按钮样式
    $editBar.css(this.editorBarStyle)
    // 设置图标样式
    $('i', $editBar).css(this.editorIconStyle)
    this.createEvent($($editBar), fn)
  }

  createEvent (el, fn) {
    let self = this
    el.on('click', function () {
      $('.editor-bar', self.frame).css({
        'border': '1px dashed #666'
      })
      $('i', $('.editor-bar', self.frame)).css({
        'background': 'rgba(0,0,0,0.3)'
      })
      $(this).css({
        'border': '4px dashed #359AF6'
      })
      $('i', this).css({
        'background': '#359AF6'
      })
      fn()
    })
  }

  defaultClick (el) {
    this.frame = window.frames['buyer-editor'].document
    let $tagName = $(el, this.frame) // 获取可编辑区域
    $($tagName).prev().find('i').trigger('click')
  }
  iframeLoad () {
    document.getElementById('iframepage').contentWindow.location.reload(true)
  }
}

window.editorApi = new EditorApi()
