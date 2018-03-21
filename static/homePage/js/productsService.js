/**
 * Created by admin on 2017/9/21.
 */
// 球星动画
var screenHeight = $(document.body).height()
var windowHeight = $(window).height()
var boxOffset1 = $("#module1").offset().top
var boxOffset2 = $("#module2").offset().top
var boxOffset3 = $("#module3").offset().top
$(window).scroll(function () {
  var scrollOffset = $(document).scrollTop()
  if ((scrollOffset + windowHeight) > (boxOffset1 + 420)) {
    $("#module1").addClass("scroll-pos-undefined window-width-0-to-infinity transition")
  }
  if ((scrollOffset + windowHeight) > (boxOffset2 + 420)) {
    $("#module2").addClass("scroll-pos-undefined window-width-0-to-infinity transition")
  }
  if ((scrollOffset + windowHeight) > (boxOffset3 + 420)) {
    $("#module3").addClass("scroll-pos-undefined window-width-0-to-infinity transition")
  }
})
