$(".video-mask .close-btn").on("click", function () {
  $(".video-mask").hide()
  $("#video1")[0].pause()
  $("#video2")[0].pause()
})
$('.paly-left').on("click",function () {
  $(".mask-left").show()
  // $("#video")[0].play()
})
$('.play-right').on("click",function () {
  $(".mask-right").show()
  // $("#video")[0].play()
})