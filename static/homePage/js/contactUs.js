
(function ($) {
    $.getUrlParam = function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

$(document).ready(function () {
    let urlT = $.getUrlParam('contact');
    if (urlT == 'khfw' || urlT == null){
        $('.server').css('display','block').siblings().css('display','none');
        $('.nav>li').eq(0).addClass("active").siblings().removeClass("active");
    }else if(urlT == 'zsdl'){
        $('.certification').css('display', 'block').siblings().css('display', 'none');
        $('.nav>li').eq(1).addClass("active").siblings().removeClass("active");
    }else if(urlT == 'schz'){
        $('.patner').css('display', 'block').siblings().css('display', 'none');     
        $('.nav>li').eq(2).addClass("active").siblings().removeClass("active");           
    }
})

$('.nav>li').on('click',function(){
    $(this).addClass("active").siblings().removeClass("active");
})
$(".client").on('click',function(){
    $('.server').css('display','block').siblings().css('display','none');
})
$(".agency").on('click',function(){
    $('.certification').css('display','block').siblings().css('display','none');
})
$(".bazaar").on('click',function(){
    $('.patner').css('display','block').siblings().css('display','none');
})

$("#sublime").on("click",function(){
    var name = $("#name").val();
    var mobile = $("#phoneNumber").val();
    var email = $("#email").val();
    var post = $("#post").val();
    var companyName = $("#companyName").val();
    var companyNumber = $("#companyNumber").val();
    var location = $("#location").val();
    var companyWebsite = $("#companyWebsite").val();
    var mainBusiness = $("#mainBusiness").val();
    var mobileReg=/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var emailReg=/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    var companyNumberReg=/^[1-9]\d*$|^0$/
    var companyWebsiteReg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
    if(name==''){
        console.log(1)
        $("#name").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#name").parent().find('.error').show()
        return;
    }else{
        $("#name").removeClass('borderStyle')
        $("#name").parent().find('.error').hide()
    }
    if(mobile==''){
        $("#phoneNumber").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#phoneNumber").parent().find('.error').show().html("手机号码不能为空!")
        return;
    }else if(mobile.length!=11||!mobileReg.test(mobile)){
        $("#phoneNumber").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#phoneNumber").parent().find('.error').show().html("请输入有效的手机号码!")
        return;
    }else{
        $("#phoneNumber").removeClass('borderStyle')
        $("#phoneNumber").parent().find('.error').hide()
    }
    if(email!=''&&!emailReg.test(email)){
        $("#email").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#email").parent().find('.error').show().html("请输入正确的邮箱号!")
        return;
    }else{
        $("#email").removeClass('borderStyle')
        $("#email").parent().find('.error').hide()
    }
    if(companyName==''){
        $("#companyName").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#companyName").parent().find('.error').show().html("公司名称不能为空!")
        return;
    }else{
        $("#companyName").removeClass('borderStyle')
        $("#companyName").parent().find('.error').hide()
    }
    if(companyNumber==''){
        $("#companyNumber").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#companyNumber").parent().find('.error').show().html("公司人数不能为空!")
        return;
    }else if(!companyNumberReg.test(companyNumber)){
        $("#companyNumber").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#companyNumber").parent().find('.error').show().html("公司人数必须为数字!")
        return;
    }else{
        $("#companyNumber").removeClass('borderStyle')
        $("#companyNumber").parent().find('.error').hide()
    }
    if(location==''){
        $("#location").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#location").parent().find('.error').show().html("所在地不能为空!")
        return;
    }else{
        $("#location").removeClass('borderStyle')
        $("#location").parent().find('.error').hide()
    }
    if(companyWebsite!=''&&!companyWebsiteReg.test(companyWebsite)){
        $("#companyWebsite").addClass('borderStyle').parent().siblings().find('input').removeClass('borderStyle')
        $("#companyWebsite").parent().find('.error').show().html("请输入正确的网址格式!")
        return;
    }else{
        $("#companyWebsite").removeClass('borderStyle')
        $("#companyWebsite").parent().find('.error').hide()
    }
    $.ajax({
        type: "GET",
        url: "//co.onloon.cc/add.php",
        data:{
            name:name,
            email:email,
            mobile:mobile,
            company_name:companyName,
            company_size:companyNumber,
            post:post,
            address:location,
            website:companyWebsite,
            description:mainBusiness
        },
        dataType: "json",
        success: function (json) {
            if (json.msg == "success") {
                alert("提交成功")
                $("#name").val('')
                $("#phoneNumber").val('')
                $("#email").val('')
                $("#post").val('')
                $("#companyName").val('')
                $("#companyNumber").val('')
                $("#location").val('')
                $("#companyWebsite").val('')
                $("#mainBusiness").val('')
            } else {
                alert("提交失败")
            }
        }
    });
})