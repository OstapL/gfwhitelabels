// здесь нужно писать все скрипты которые используются на сайте
$(function() {
// отдельный скрипт 
$('#toggle_click').click(function()
    {
        if ($(this).hasClass('opened')) {
            $('#toggle_menu').fadeOut('normal');
            $(this).removeClass('opened');
        }else{
            $('#toggle_menu').fadeIn('normal');
            $(this).addClass('opened');
        }
    });




});
$(document).ready(function(){

        var $menu = $(".tabs-scroll");

        $(window).scroll(function(){
            if ( $(this).scrollTop() > 100 && $menu.hasClass("navbar-default") ){
                $menu.fadeOut('fast',function(){
                    $(this).removeClass("navbar-default")
                           .addClass("menu-fixed transbg")
                           .fadeIn('fast');
                });
            } else if($(this).scrollTop() <= 100 && $menu.hasClass("menu-fixed")) {
                $menu.fadeOut('fast',function(){
                    $(this).removeClass("menu-fixed transbg")
                           .addClass("navbar-default")
                           .fadeIn('fast');
                });
            }
        });//scroll

        $menu.hover(
            function(){
                if( $(this).hasClass('menu-fixed') ){
                    $(this).removeClass('transbg');
                }
            },
            function(){
                if( $(this).hasClass('menu-fixed') ){
                    $(this).addClass('transbg');
                }
            });//hover
    });//jQuery