$(function(){
	var cookie_username = getCookie('username');
	if(cookie_username != "")
		$('.frm-rememberusername').prop('checked', true);
		
	$('.frm-username').val(getCookie('username'));
	$('.frm-password').keypress(pw_keypress);
	$('.frm-submit').click(form_submit);
	$('.frm-clear').click(form_clear);
});

function pw_keypress(event)
{
	if(event.keyCode == 13)
		form_submit();
}

function form_clear()
{
	$('.frm-username').val('');
	$('.frm-password').val('');
};

function form_submit()
{
	var username = $('.frm-username').val(),
		password = $('.frm-password').val(),
		rememberUsername = $('.frm-rememberusername').prop('checked'),
		rememberMe = $('.frm-rememberme').prop('checked'),
		url = 'api/account/login/' + username + '/' + password + '/' + rememberMe;
		
	$.post(url, function(msg){
		var status = JSON.parse(msg);
		if(status)
		{
			if(rememberUsername)
			{
				setCookie('username', username, 30);
			}
			else
			{
				setCookie('username', '', 30);
			}
			location.reload();
		}
		else
			alert('帳號或密碼錯誤');
	});
}