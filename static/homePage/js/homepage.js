/**
 * Created by admin on 2017/9/21.
 */


$('.proactive-section-list').on('mouseleave',function () {
  $('.proactive-section-cards').attr("data-active-card", null)
  $('.proactive-list-item').removeClass('not-active')
})
$('.proactive-list .proactive-list-item').on('mouseenter',function () {
  var dqindex = $(this).index() + 1
  var objvalue = $(this).attr('data-value')
  console.log(objvalue)
  $('.proactive-section-cards').attr('data-active-card', dqindex)
  if (objvalue == 'zw') {
    $('.proactive-list-item').removeClass('not-active')
  } else {
    $('.proactive-list-item').addClass('not-active')
    $(this).removeClass('not-active')
  }
})
$('.proactive-list .proactive-list-item').on('mouseleave',function () {
  var dqindex = $(this).index() + 1
  var objvalue = $(this).attr('data-value')
  $('.proactive-section-cards').attr('data-active-card', dqindex)
  if (objvalue == 'zw') {
    $('.proactive-list-item').removeClass('not-active')
  } else {
    $('.proactive-list-item').addClass('not-active')
    $(this).removeClass('not-active')
  }
})
// 球型动画
var screenHeight = $(document.body).height()
var windowHeight = $(window).height()
var boxOffset = $(".outer-box").offset().top
$(window).scroll(function () {
  var scrollOffset = $(document).scrollTop()
  if ((scrollOffset + windowHeight) > (boxOffset + 450)) {
    $(".part1").addClass("ani1")
    setTimeout(function () {
      $(".part2").addClass("ani2")
      setTimeout(function () {
        $(".part3").addClass("ani3")
        setTimeout(function () {
          $(".part4").addClass("ani4")
        }, 500)
      }, 500)
    }, 500)
  }
})

// 主页swiper
// var mySwiper = new Swiper ('.swiper-container', {
//   // loop: true,
//   onlyExternal: true,
//   preventClicks : false,
//   // 如果需要前进后退按钮
//   nextButton: '.swiper-button-next',
//   prevButton: '.swiper-button-prev'
// })






// 主页视频弹窗控制
$('.video-mask .close-btn').on('click', function () {
  $('.video-mask').hide()
  $('#video')[0].pause()
})
$('.video-module .play-start').on('click', function () {
  $('.video-mask').show()
  // $("#video")[0].play()
})


$(document).ready(function () {
  $(".swiper-slide").eq(1).hide()
  var bannerChange = setInterval(ImgGo, 5000)
  $(".swiper-wrapper").hover(function () {
    clearInterval(bannerChange)
  }, function () {
    bannerChange = setInterval(ImgGo, 5000)
  })
  function ImgGo() {
    $('.swiper-slide.onActive').fadeOut(500).removeClass('onActive').siblings('.swiper-slide').fadeIn(500).addClass('onActive')
    let indexM = $('.swiper-slide.onActive').index()
    $('.swiper-icon').eq(indexM).removeClass('noActive').siblings('.swiper-icon').addClass('noActive')
  }
  $('.swiper-icon').click(function () {
    let indexI = $(this).index()
    $(this).removeClass('noActive').siblings('.swiper-icon').addClass('noActive')
    $(".swiper-slide").eq(indexI).fadeIn(500).addClass('onActive')
    $(".swiper-slide").eq(1 - indexI).fadeOut(500).removeClass('onActive')
  })
})