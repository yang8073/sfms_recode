/* Class */
var ItemListTableType = {
		'stock': 0,
		'day_total_row': 13,
		'stock_item': 1,
		'sale': 2,
		'sale_item': 3,
		'view_table': 4,
		'view_target_table_item': 5,
		'view_object_table_item': 6,
		'view_target_table_month': 7,
		'view_object_table_month': 8,
		'view_table_month': 9,
		'calc_table': 10,
		'view_chart_table': 11,
		'view_total_table_no_title': 12,
	};
/** SliderTable Class **/
function ItemListTable(slider_speed, type, target){
	this.slider_speed = slider_speed;
	this.ListType = ItemListTableType[type];
	this.Target = target;
	this.rowClass = '';
	this.timerStack = new Array();
	this.lastFun = function(){};
	this.token;
}
ItemListTable.prototype.clearList = function(callback){
	this.clearAllTimer();
	var t_this = this,
		//clearTotal = $slider.not('.slider_header').length,
		clearevent = function(){
			var $slider = t_this.Target?$(t_this.Target + ' .slider.inpage'):$('.slider.inpage'),
				$this = $slider.not('.slider_header').first(),
				slider_speed = t_this.slider_speed;

			$this.removeClass('inpage').addClass('outpage');
			$this.bind('webkitAnimationEnd', function()
			{
				$(this).css({opacity: 0});
				$(this).remove();
			});
			if($this.length != 0)
				setTimeout(clearevent, slider_speed);			
			else
				if(callback)
				{
					$slider = t_this.Target?$(t_this.Target + ' .slider'):$('.slider');
					$this = $slider.not('.slider_header').first();
					if($this.length != 0 )
						setTimeout(clearevent, slider_speed);
					else
						callback();
				}
		};
	clearevent();
};
ItemListTable.prototype.getToken = function(){
	var t_tick = new Date().getTime().toString(),
		t_random = ((Math.random() * 10000) + 1).toString(),
		result = t_tick + t_random;
	this.token = result;
	return result;
};
ItemListTable.prototype.fields_value = function(x, y){
	if(!this.Target)
		return null;
	var $target = $(this.Target),
		$row = $target.children('.slider:not(.slider_header)').eq(y),
		$fields = $($row.children('div')).eq(x);
	return $fields.text();
};
ItemListTable.prototype.rowHasClass = function(y, className){
	if(!this.Target)
		return null;
	var $target = $(this.Target),
		$row = $target.children('.slider:not(.slider_header)').eq(y),
		result = $row.hasClass(className);;
	return result;
};
ItemListTable.prototype.row_length = function(){
	if(!this.Target)
		return null;
	var $target = $(this.Target),
		count = $target.children('.slider:not(.slider_header)').length;
	return count;
};
ItemListTable.prototype.changeType = function(type){
	this.ListType = ItemListTableType[type];
};
ItemListTable.prototype.spaceRow = function(){
	this.clearList(function(){
		var append_str = '<div class="row slider inpage"><div class="col-md-12">Not found data.</div></div>';
		$('.slider').last().after(append_str);
	});
};
ItemListTable.prototype.loadingRow = function(){
	var append_str = '<div class="row slider inpage"><div class="col-md-12">Loading...</div></div>';
	$('.slider').last().after(append_str);
};
ItemListTable.prototype.addRow = function(){
	var append_str;

	switch(this.ListType)
	{
		case ItemListTableType['stock']:
			var id = arguments[0],
				item = arguments[1],
				quantity = arguments[2],
				up = arguments[3],
				cash = arguments[4],
				date = arguments[5];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-2 col-xs-2">' + id + '</div>' +
						'<div class="col-md-2 col-xs-2">' + item + '</div>' +
						'<div class="col-md-2 col-xs-2">' + quantity + '</div>' +
						'<div class="col-md-2 col-xs-2">' + up + '</div>' +
						'<div class="col-md-2 col-xs-2">' + cash + '</div>' +
						'<div class="col-md-2 col-xs-2">' + date + '</div>' +
						'</div>';
			break;
		case ItemListTableType['stock_item']:
			var id = arguments[0],
				name = arguments[1],
				user = arguments[2];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + id + '</div>' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + name + '</div>' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + user + '</div>' +
						'</div>';
			break;
		case ItemListTableType['sale']:
			var id = arguments[0],
				item = arguments[1],
				quantity = arguments[2],
				up = arguments[3],
				cash = arguments[4],
				date = arguments[5];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-2 col-xs-2">' + id + '</div>' +
						'<div class="col-md-2 col-xs-2">' + item + '</div>' +
						'<div class="col-md-2 col-xs-2">' + quantity + '</div>' +
						'<div class="col-md-2 col-xs-2">' + up + '</div>' +
						'<div class="col-md-2 col-xs-2">' + cash + '</div>' +
						'<div class="col-md-2 col-xs-2">' + date + '</div>' +
						'</div>';
			break;
		case ItemListTableType['sale_item']:
			var id = arguments[0],
				name = arguments[1],
				user = arguments[2];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + id + '</div>' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + name + '</div>' +
						'<div class="col-md-4 col-xs-4 col-xs-4">' + user + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_table']:
			var item = arguments[0],
				quantity = arguments[1],
				up = arguments[2],
				cash = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-2 col-xs-2"><strong>' + item + '</strong></div>' +
						'<div class="col-md-3 col-xs-3">' + quantity + '</div>' +
						'<div class="col-md-3 col-xs-3">' + up + '</div>' +
						'<div class="col-md-3 col-xs-3">' + cash + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_target_table_item']:
			var item = arguments[0],
				quantity = arguments[1],
				up = arguments[2],
				cash = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-3 col-xs-3"><strong>' + item + '</strong></div>' +
						'<div class="col-md-3 col-xs-3">' + quantity + '</div>' +
						'<div class="col-md-3 col-xs-3">' + up + '</div>' +
						'<div class="col-md-3 col-xs-3">' + cash + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_object_table_item']:
			var quantity = arguments[1],
				up = arguments[2],
				cash = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-4 col-xs-4">' + quantity + '</div>' +
						'<div class="col-md-4 col-xs-4">' + up + '</div>' +
						'<div class="col-md-4 col-xs-4">' + cash + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_target_table_month']:
			var month = arguments[0],
				sum_stock = arguments[1],
				sum_sales = arguments[2],
				profit = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-3 col-xs-3"><strong>' + month + '</strong></div>' +
						'<div class="col-md-3 col-xs-3">' + sum_stock + '</div>' +
						'<div class="col-md-3 col-xs-3">' + sum_sales + '</div>' +
						'<div class="col-md-3 col-xs-3">' + profit + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_object_table_month']:
			var month = arguments[0],
				sum_stock = arguments[1],
				sum_sales = arguments[2],
				profit = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-3 col-xs-3"><strong>' + month + '</strong></div>' +
						'<div class="col-md-3 col-xs-3">' + sum_stock + '</div>' +
						'<div class="col-md-3 col-xs-3">' + sum_sales + '</div>' +
						'<div class="col-md-3 col-xs-3">' + profit + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_table_month']:
			var month = arguments[0],
				sum_stock = arguments[1],
				sum_sales = arguments[2],
				profit = arguments[3];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-2 col-xs-2"><strong>' + month + '</strong></div>' +
						'<div class="col-md-3 col-xs-3">' + sum_stock + '</div>' +
						'<div class="col-md-3 col-xs-3">' + sum_sales + '</div>' +
						'<div class="col-md-3 col-xs-3">' + profit + '</div>' +
						'</div>';
			break;
		case ItemListTableType['calc_table']:
			var difference = arguments[0],
				difference_class = 'info';
			if(parseInt(difference) < 0)
				difference_class = 'danger';
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-12 col-xs-12 ' + difference_class + '">' + difference + '</div>' +
						'</div>';
			break;
		case ItemListTableType['view_total_table']:
			var sum_stock = arguments[0],
				sum_sales = arguments[1],
				calc_ans = arguments[2];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-4 col-xs-4">進額</div>' +
						'<div class="col-md-8 col-xs-8">' + sum_stock + '</div>' +
						'</div>'+
						'<div class="row slider inpage">' +
						'<div class="col-md-4 col-xs-4">銷額</div>' +
						'<div class="col-md-8 col-xs-8">' + sum_sales + '</div>' +
						'</div>' +
						'<div class="row slider inpage calc">' +
						'<div class="col-md-4 col-xs-4"><strong>總計</strong></div>' +
						'<div class="col-md-8 col-xs-8"><strong>' + calc_ans + '</strong></div>' +
						'</div>';
			break;
		case ItemListTableType['view_total_table_no_title']:
			var sum_stock = arguments[0],
				sum_sales = arguments[1],
				calc_ans = arguments[2];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-12 col-xs-12">' + sum_stock + '</div>' +
						'</div>'+
						'<div class="row slider inpage">' +
						'<div class="col-md-12 col-xs-12">' + sum_sales + '</div>' +
						'</div>' +
						'<div class="row slider inpage calc">' +
						'<div class="col-md-12 col-xs-12"><strong>' + calc_ans + '</strong></div>' +
						'</div>';
			break;
		case ItemListTableType['day_total_row']:
			var t_sum = arguments[0];
			append_str = '<div class="row slider inpage">' +
						'<div class="col-md-2 col-xs-2"></div>' +
						'<div class="col-md-2 col-xs-2"><strong>總計</strong></div>' +
						'<div class="col-md-4 col-xs-4"></div>' +
						'<div class="col-md-2 col-xs-2"><strong>' + t_sum + '</strong></div>' +
						'</div>';
			break;
	}
	append_str = $(append_str).addClass(this.rowClass);
	if(!this.Target)
		$('.slider').last().after(append_str);
	else
		$(this.Target + ' .slider').last().after(append_str);
};
ItemListTable.prototype.setTimeout = function(fun, delay_time, token, t_arg){
	//debugger;
	var t_this = this;
	if(token != this.token)
		return;
	if(fun != this.lastFun)
		this.clearList(_run);
	else
		_run();

	function _run()
	{
		t_this.lastFun = fun;
		if(!delay_time)
			delay_time = t_this.slider_speed;
		var t_timer = setTimeout(fun, delay_time);
		t_this.timerStack.push(t_timer);		
	}
};
ItemListTable.prototype.clearAllTimer = function(){
	while(this.timerStack.length > 0){
		var t_timer = this.timerStack.pop();
		clearTimeout(t_timer);
	};
};