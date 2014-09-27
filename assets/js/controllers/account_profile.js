function profile()
{
	
	init();
	function init()
	{
		setTimeout(function(){
			init_day_reach();
			init_week_reach();
			init_month_reach();
		}, 1000);
	}

	function init_day_reach()
	{
		_progress_control('day', 40);
	}

	function init_week_reach()
	{
		_progress_control('week', 65)
	}

	function init_month_reach()
	{
		_progress_control('month', 95)
	}

	function _progress_control(target, value)
	{
		if($.isNumeric(value))
			$('.' + target + '-reach').css({width: value + '%'}).text(value + '%');
	}

}