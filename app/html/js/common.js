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