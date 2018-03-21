$(".header-logo").on("click",function() {
    $(".header-logo>a").attr("href","./homepage.html")
})
$(".home").on("click",function() {
    $(this).attr("href","./homepage.html")
})
$(".pro").on("click",function() {
    $(this).attr("href","./product.html")
})

$(".shc").on("click",function() {
    $(this).attr("href","./commercial.html")
})

$(".con").on("click",function() {
    $(this).attr("href","./contactUs.html")
})

$(".log").on("click",function() {
    $(this).attr("href","https://shop.onloon.cc/#/login")
})

$(".free").on("click",function() {
    $(this).attr("href","https://shop.onloon.cc/#/register")
})

$(".facebook").on("click",function() {
    $(".facebook>a").attr("href","detail/vedio1.html")
})

$(".twitter").on("click",function() {
    $(".twitter>a").attr("href","detail/vedio2.html")
})

$(".facebook").on("click",function() {
    $(".linkedin>a").attr("href","detail/vedio3.html")
})

 $(".index").on("click",function() {
     $(".index>a").attr("href","./homepage.html")
 })

 $(".product").on("click",function() {
     $(".product>a").attr("href","./product.html")
 })

 $(".school").on("click",function() {
     $(".school>a").attr("href","./commercial.html")
 })
 $(".contact").on("click",function() {
     $(".contact>a").attr("href","./contactUs.html")
 })

$(".free-try").on("click",function() {
  var phoneVal = $('.input-display').val()
  $(this).attr("href","https://shop.onloon.cc/#/register?phone=" + phoneVal)
})

