/* Class */
/** Stock list page function **/
function stock_list()
{
	/* Var */
	var now_date = null,
		slider_speed = 50,
		itemListTable = new ItemListTable(slider_speed, 'stock', '.record-list'),
		total_data_tabel = new ItemListTable(slider_speed, 'day_total_row', '.total-data'),
		modal_page = '',
		modal_args = {};

	/* Load Complete */
	init();

	/* Function */
	/** 初始化函數  **/
	function init()
	{
		/* page leave event */
		g_only_add_page_leave_event(function(){
			itemListTable.clearAllTimer();
		});

		var $prev = $('.date-prev').parent('a'),
			$next = $('.date-next').parent('a'),
			$date_select = $('.date-select'),
			$addItem = $('.addItem-btn').parent('a'),
			$editItem = $('.editItem-btn').parent('a'),
			$deleteItem = $('.deleteItem-btn').parent('a');
		$prev.click(load_data);
		$next.click(load_data);
		//$date_select.val(now_date.Format('yyyy-MM-dd'));
		$date_select.change(function(){
			var date = $(this).val();
			load_data(date);
		});
		$addItem.click(function(){
			loadModalPage('add');
		});
		$editItem.click(function(){
			loadModalPage('edit');
			//edit_mode(true);
		});
		$('.modal').on('hidden.bs.modal', function(e){
			clearTimeout(stock_item_list.modal_close_timer);
		});
		$deleteItem.click(function(){
			deleteEvent();
		});

		load_data();
	}

	/** 載入Modal窗頁面函數 **/
	function loadModalPage(type)
	{
		var pageUrl = {
			'add': 'stock/add_record/',
			'edit': 'stock/edit_record/',
		}

		modal_page = type;
		$('.modal-content').load(pageUrl[modal_page]);				
		$('.modal').modal('show');

	}	

	/** 載入資料函數  **/
	this.LoadData = function(date){
		load_data(date);
	};	
	function load_data(date)
	{
		var $date_select = $('.date-select'),
			token = itemListTable.getToken();
		if(typeof date == 'string')
		{
			now_date = new Date(date);
		}
		else if($(this).children('span').hasClass('date-next'))
		{
			var parse_date = new Date($date_select.val());
			parse_date.setDate(parse_date.getDate() + 1);
			now_date = parse_date;
			$date_select.val(parse_date.Format('yyyy-MM-dd'));
		}
		else if($(this).children('span').hasClass('date-prev'))
		{
			var parse_date = new Date($date_select.val());
			parse_date.setDate(parse_date.getDate() - 1);
			now_date = parse_date;
			$date_select.val(parse_date.Format('yyyy-MM-dd'));
		}

		if(now_date == null)
			date = '';
		else
			date = now_date.Format('yyyy-MM-dd');
		var url = 'api/stock/record_list/' + date,
			t_sum = 0;
		$.ajax({
			url: url,
			type: 'get',
			success: function(result){
				var decode_result = JSON.parse(result),
					index = 0;

				if(!decode_result)
				{
					itemListTable.spaceRow();
					return;
				}

				var addevent = function(){
					var item = decode_result[index];
					if(!item)
					{
						$('.total-data').empty();
						$('.total-data').append($('<div class="row slider slider_header inpage"></div>'));
						total_data_tabel.addRow(t_sum);
						return;
					}
					itemListTable.addRow(item['s_id'], item['si_name'], item['s_quantity'], item['s_up'], item['s_value'], item['s_date']);
					$('.date-select').val(item['s_date']);
					t_sum += parseInt(item['s_value']);
					index++;
					itemListTable.setTimeout(addevent, slider_speed, token);
				};
				itemListTable.setTimeout(addevent, slider_speed, token);
			},
		});
	}

	/** 刪除函數 **/
	function deleteEvent()
	{
		var select_date = $('.date-select').val();
		if(!confirm('確定要刪除' + select_date + '的紀錄嗎?'))
			return;
		$.ajax({
			url: 'api/stock/delete_record/' + select_date,
			type: 'get',
			success: function(result){
				var decode_result = JSON.parse(result);
				if(!decode_result)
					alert('未知錯誤!');
			},
			complete: function(){
				load_data();
			}
		});
	}

	/** Stock add page function **/
	this.add_page_init = function _add(target)
	{
		/* Var */
		var parent = target;
		/* Load complete */
		init();

		/* Function */
		/** 初始化函數 **/
		function init()
		{
			init_date();
			init_rows();

			var $add_btn = $('.submit-btn').parent('a');
			$add_btn.click(submit);
		}

		/** 初始時間 **/
		function init_date()
		{
			$('.modal-date-select').val(new Date().Format('yyyy-MM-dd'));
		}

		/** 初始欄位 **/
		function init_rows()
		{
			$.ajax({
				url: 'api/stock/all_item',
				type: 'get',
				success: function(result){
					var decode_result = JSON.parse(result),
						item_name_max_length = 0;
					//console.log(decode_result);

					for(var key in decode_result)
					{
						if(decode_result[key]['si_name'].length > item_name_max_length)
							item_name_max_length = decode_result[key]['si_name'].length;
					}

					for(var key in decode_result)
					{

						var $group = $('<div class="input-group stock-item-name"></div><br>'),
							$addon = $('<span class="input-group-addon"></span>').text(decode_result[key]['si_name'].fill('full', item_name_max_length - decode_result[key]['si_name'].length, 'right')),
							$input_quantity = $('<input type="text" class="form-control frm-quantity">').attr({'placeholder':'數量', 'data-item': decode_result[key]['si_id']}),
							$input_up = $('<input type="text" class="form-control frm-up">').attr({'placeholder': '單價', 'data-item': decode_result[key]['si_id']}),
							$input_value = $('<input type="text" class="form-control frm-cash" disabled="disabled">').attr({'placeholder':'金額', 'data-item': decode_result[key]['si_id']});									;
						$input_quantity.keyup(modal_row_clac);
						$input_up.keyup(modal_row_clac);
						$append = $group.append($addon, $input_quantity, $input_up, $input_value);
						$('.modal-input-area').append($append);
					}
				},
			}).done(function(){
				init_total_row();
			});
		}

		function init_total_row()
		{
			$('.form-control').keyup(function(){
				var t_sum = 0;
				$('.frm-cash').each(function(){
					var t_cash = parseInt($(this).val());
					if(t_cash >= 0)
						t_sum += t_cash;
				});
				$('.total-cash').val(t_sum);
			});
			var $group = $('<div class="input-group"></div><br>'),
				$addon = $('<span class="input-group-addon"></span>').text('總計'.fill('full', 2, 'right')),
				$total_cash = $('<input type="text" class="form-control total-cash" disabled="disabled">').val(0);
			$append = $group.append($addon, $total_cash);
			$('.modal-input-area').append($append);
		}

		/** Submit add event **/
		function submit()
		{
			var $items,
				send = {
					item_id: Array(),
					item_quantity: Array(),
					item_up: Array(),
					item_value: Array(),
				},
				date = $('.modal-date-select').val();

			$('.stock-item-name').each(function(){
				send.item_id.push($(this).find('.frm-quantity').data('item'));
				send.item_quantity.push($(this).find('.frm-quantity').val());
				send.item_up.push($(this).find('.frm-up').val());
				send.item_value.push($(this).find('.frm-cash').val());
			});

			$.ajax({
				url: 'api/stock/add_record/' + date,
				data: {
					item_id: JSON.stringify(send.item_id),
					item_quantity: JSON.stringify(send.item_quantity),
					item_up: JSON.stringify(send.item_up),
					item_value: JSON.stringify(send.item_value),
				},
				type: 'get',
				success: function(result){
					var decode_result = JSON.parse(result);
					target.LoadData();

					$('.modal-date-select').hide();
					$('.submit-btn').parents('li').animate({opacity: 0}, function(){
						$(this).hide();
						$('.modal-input-area br').remove();
					});
					$('.input-group').animate({opacity: 0}, function(){
						$(this).hide();
						$('.modal-alert').html(
							'<strong>新增!</strong>' + 
							decode_result['success'] + '個執行成功, ' + 
							decode_result['fail'] + '個執行失敗.<br>兩秒後自動關閉'
							).addClass('alert-info').show().animate({opacity: 1});
						stock_list.modal_close_timer = setTimeout(function(){
							$('.modal').modal('hide');
						}, 2000);
					});

				}
			});
		}

		/** frm-control status toggle **/
		function status_toggle(target)
		{
			$target = $(target).parent('.input-group');

			if($target.hasClass('has-error'))
				$target.removeClass('has-error');
			else
				$target.addClass('has-error');
		}
	};

	/** Stock edit page function **/
	this.edit_page_init = function _edit(target)
	{
		/* Var */
		var parent = target;
		/* Load complete */
		init();

		/* Function */
		/** 初始化函數 **/
		function init()
		{
			init_date();
			init_rows();

			var $add_btn = $('.submit-btn').parent('a');
			$add_btn.click(submit);
		}

		/** 初始時間 **/
		function init_date()
		{
			var edit_date = $('.date-select').val();
			$('.modal-date-select').val(edit_date).attr('disabled', 'disabled');
		}

		/** 初始欄位 **/
		function init_rows()
		{
			var records,
				select_date = $('.modal-date-select').val();

			$.ajax({
				url: 'api/stock/record_list/' + select_date,
				type: 'get',
				success: function(result){
					records = JSON.parse(result);	
				},
				complete: function(){

					$.ajax({
						url: 'api/stock/all_item',
						type: 'get',
						records: records,
						success: function(result){
							var decode_result = JSON.parse(result),
								item_name_max_length = 0,
								record_index = 0;

							for(var key in decode_result)
							{
								if(decode_result[key]['si_name'].length > item_name_max_length)
									item_name_max_length = decode_result[key]['si_name'].length;
							}

							for(var key in decode_result)
							{
								if(record_index >= records.length)
									break;

								var record_id,
									quantity,
									up,
									cash,
									append_str;

								if(records[record_index]['si_id'] == decode_result[key]['si_id'])
								{
									record_id = records[record_index]['s_id'],
									quantity = records[record_index]['s_quantity'],
									up = records[record_index]['s_up'],
									cash = records[record_index]['s_value'];
									record_index++;
								}
								else
								{
									record_id = '',
									quantity = '',
									up = '',
									cash = '';
								}

								var $group = $('<div class="input-group stock-item-name"></div><br>').attr('data-rid', record_id),
									$addon = $('<span class="input-group-addon"></span>').text(decode_result[key]['si_name'].fill('full', item_name_max_length - decode_result[key]['si_name'].length, 'right')),
									$input_quantity = $('<input type="text" class="form-control frm-quantity">').attr({'placeholder':'數量', 'data-item': decode_result[key]['si_id']}).val(quantity),
									$input_up = $('<input type="text" class="form-control frm-up">').attr({'placeholder': '單價', 'data-item': decode_result[key]['si_id']}).val(up),
									$input_value = $('<input type="text" class="form-control frm-cash" disabled="disabled">').attr({'placeholder':'金額', 'data-item': decode_result[key]['si_id']}).val(cash);								;

								$input_quantity.keyup(modal_row_clac);
								$input_up.keyup(modal_row_clac);
								$append = $group.append($addon, $input_quantity, $input_up, $input_value);

								$('.modal-input-area').append($append);
							}
						},
					}).done(function(){
						init_total_row();
					});

				},
			});
		}

		function init_total_row()
		{
			$('.form-control').keyup(function(){
				_calc();
			});
			var $group = $('<div class="input-group"></div><br>'),
				$addon = $('<span class="input-group-addon"></span>').text('總計'.fill('full', 2, 'right')),
				$total_cash = $('<input type="text" class="form-control total-cash" disabled="disabled">').val(0);
			$append = $group.append($addon, $total_cash);
			$('.modal-input-area').append($append);

			_calc();

			function _calc()
			{
				var t_sum = 0;
				$('.frm-cash').each(function(){
					var t_cash = parseInt($(this).val());
					if(t_cash >= 0)
						t_sum += t_cash;
				});
				$('.total-cash').val(t_sum);
			}
		}

		/** Submit add event **/
		function submit()
		{
			var	send = {
					r_id: Array(),
					r_quantity: Array(),
					r_up: Array(),
					r_value: Array(),
				},
				select_date = select_date = $('.date-select').val();

			$('.stock-item-name').each(function(){
				var rid = $(this).data('rid');
				if(rid != '')
				{
					send.r_id.push(rid);
					send.r_quantity.push($(this).find('.frm-quantity').val());
					send.r_up.push($(this).find('.frm-up').val());
					send.r_value.push($(this).find('.frm-cash').val());
				}
			});

			$.ajax({
				url: 'api/stock/update_record',
				data: {
					records_id: JSON.stringify(send.r_id),
					records_quantity: JSON.stringify(send.r_quantity),
					records_up: JSON.stringify(send.r_up),
					records_value: JSON.stringify(send.r_value),
				},
				type: 'get',
				success: function(result){
					console.log(result, target, select_date);
					var decode_result = JSON.parse(result);
					target.LoadData(select_date);

					$('.modal-date-select').hide();
					$('.submit-btn').parents('li').animate({opacity: 0}, function(){
						$(this).hide();
					});
					$('.input-group').animate({opacity: 0}, function(){
						$(this).hide();
						$('.modal-alert').html(
							'<strong>修改!</strong>' + 
							decode_result['success'] + '個執行成功, ' + 
							decode_result['fail'] + '個執行失敗.<br>兩秒後自動關閉'
							).addClass('alert-info').show().animate({opacity: 1});
						stock_list.modal_close_timer = setTimeout(function(){
							$('.modal').modal('hide');
						}, 2000);
					});

				}
			});
		}

		/** frm-control status toggle **/
		function status_toggle(target)
		{
			$target = $(target).parent('.input-group');

			if($target.hasClass('has-error'))
				$target.removeClass('has-error');
			else
				$target.addClass('has-error');
		}
	};

	/** Stock edit row clac cash function **/
	function modal_row_clac(e)
	{
		var $target_parent = $(e.target).parent('.stock-item-name'),
			quantity = $target_parent.find('.frm-quantity').val(),
			up = $target_parent.find('.frm-up').val(),
			$cash = $target_parent.find('.frm-cash');
		if($.isNumeric(quantity) && $.isNumeric(up))
		{
			$cash.val(quantity * up);
		}
	};
}
stock_list.prototype.modal_close_timer = false;

/** Stock item list page function **/
function stock_item_list()
{
	/* Var */
	var now_page,
		//loading = false,
		slider_speed = 50,
		itemListTable = new ItemListTable(slider_speed, 'stock_item'),
		modal_page = '',
		modal_args = {};

	/* Load Complete */
	init();


	/* Function */
	/** 初始化函數  **/
	function init()
	{
		/* page leave event */
		g_only_add_page_leave_event(function(){
			itemListTable.clearAllTimer();
		});

		now_page = 1;
		var $page_select = $('.page-select'),
			$addItem = $('.addItem-btn').parent('a'),
			$editItem = $('.editItem-btn').parent('a'),
			$deleteItem = $('.deleteItem-btn').parent('a');

		$page_select.change(function(){
			var page = $(this).val();
			load_data(page);
		});
		$addItem.click(function(){
			loadModalPage('add');
		});
		$editItem.click(function(){
			//loadModalPage('edit');
			edit_mode(true);
		});
		$('.modal').on('hidden.bs.modal', function(e){
			clearTimeout(stock_item_list.modal_close_timer);
			//loadModalPage();
			//old code
			//$('.modal-alert').removeClass('alert-info').removeClass('alert-error').css({opacity: 0}).hide();
			//$('.input-group').css({opacity: 1}).show();
			//$('.frm-itemname').val('');
			//$('.modal-content').load('stock/additem/');
		});
		$deleteItem.click(function(){
			delete_mode(true);
		});

		load_data();
	}

	/** 載入Modal窗頁面函數 **/
	function loadModalPage(type)
	{
		var pageUrl = {
			'add': 'stock/add_item/',
			'edit': 'stock/edit_item/',
		}

		modal_page = type;
		$('.modal-content').load(pageUrl[modal_page]);				
		$('.modal').modal('show');

	}

	/** 載入資料函數  **/
	this.LoadData = function(page){
		if($.isNumeric(page))
			load_data(page);
		else if(page == 'first')
			load_data(1);
		else if(page == 'last')
		{
			$.ajax({
				url: 'api/stock/item_list/' + now_page,
				type: 'get',
				success: function(result){
					var decode_result = JSON.parse(result);					
					load_data(decode_result['maxpage']);
				}
			});
		}
	};	
	function load_data(page)
	{
		var token = itemListTable.getToken();

		if($.isNumeric(page))
			now_page = page;
		else if($(this).children('span').hasClass('page-next'))
			now_page++;
		else if($(this).children('span').hasClass('page-prev'))
			now_page--;

		$.ajax({
			url: 'api/stock/item_list/' + now_page,
			type: 'get',
			success: function(result){
				var decode_result = JSON.parse(result),
					index = 0;

				page_init(decode_result['nowpage'], decode_result['maxpage']);

				var addevent = function(){
					var item = decode_result['items'][index];
					if(!item)
					{
						return;
					}
					itemListTable.addRow(item['si_id'], item['si_name'], item['member_info']);
					index++;
					itemListTable.setTimeout(addevent, slider_speed, token);
				};
				itemListTable.setTimeout(addevent, slider_speed, token);
			},
		});

	}

	this.getNowPage = function(){
		return now_page;
	};

	/** 頁初始化函數 **/
	function page_init(now, max)
	{
		var $prev = $('.page-prev'),
			$next = $('.page-next'),
			$page_select = $('.page-select');
		$prev.removeClass('lock').parent('a').unbind('click').bind('click', load_data);
		$next.removeClass('lock').parent('a').unbind('click').bind('click', load_data);

		if(now == 1)
		{
			$prev.addClass('lock');
			$prev.parent('a').unbind('click');
		}
		if(now == max)
		{
			$next.addClass('lock');
			$next.parent('a').unbind('click');
		}
		$page_select.empty();
		for(var i = 1; i <= max; i++)
			$page_select.append($('<option></option>').text(i));
		$page_select.find('option').get(now - 1).selected = true;
	}

	/** 編輯模式函數 **/
	function edit_mode(mode)
	{
		var animate_speed = 150;
		if(mode)
		{
			$('.slider').not('.slider_header').bind('click', function(){
				var item_id = $(this).children('div').first().text();
				modal_args = {
					'item_id': item_id,
				};
				loadModalPage('edit');
			}).addClass('edit-mode');

			$('.normal-mode').parents('li').animate({opacity: 0}, animate_speed, function(){
				$(this).hide();
				$('.editor-mode').parents('li').show().animate({opacity: 1}, animate_speed);
			});
		}
		else
		{
			$('.slider').not('.slider_header').unbind('click').removeClass('edit-mode');

			$('.editor-mode').parents('li').animate({opacity: 0}, animate_speed, function(){
				$('.normal-mode').parents('li').show().animate({opacity: 1}, animate_speed);
			});
		}

		$('.editItem-btn').parent('a').bind('click', function(){
			edit_mode(!mode);
		});
	}

	/** 刪除模式函數 **/
	function delete_mode(mode)
	{
		var animate_speed = 150;
		if(mode)
		{
			$('.send-delete').parent('a').bind('click', function(){
				$('.slider.selected').each(function(){
					var item_id = $(this).children('div').first().text();
					$.ajax({
						url: 'api/stock/delete_item/' + item_id,
						type: 'get',
						target_row: this,
						success: function(result){
							if(JSON.parse(result))
							{
								$(this.target_row).addClass('outpage').removeClass('selected').bind('webkitAnimationEnd', function(){
									$(this).slideUp('fast', function(){ $(this).remove(); });
								});
							}
							else
							{
								$(this.target_row).addClass('outpage').removeClass('selected').bind('webkitAnimationEnd', function(){
									$(this).removeClass('outpage').addClass('inpage');
								});
							}
						}
					});
				});
				if($('.slider').not('.slider_header').length == 0)
					load_data();
			});
			$('.close-delete-mode').parent('a').bind('click', function(){
				delete_mode(false);
			});
			$('.normal-mode').parents('li').animate({opacity: 0}, animate_speed, function(){
				$(this).hide();
				$('.delete-mode').parents('li').show().animate({opacity: 1}, animate_speed);
			});
			$('.slider').not('.slider_header').css({cursor: 'pointer'})
				.bind('click', function(){
				if($(this).hasClass('selected'))
					$(this).removeClass('selected');
				else
					$(this).addClass('selected');
			});
		}
		else
		{
			$('.close-delete-mode').parent('a').unbind('click');
			$('.delete-mode').parents('li').animate({opacity: 0}, animate_speed, function(){
				$(this).hide();
				$('.content-navbar').find('span').not('.delete-mode').parents('li').show().animate({opacity: 1}, animate_speed);
				$('.content-navbar').find('select').not('.delete-mode').parents('li').show().animate({opacity: 1}, animate_speed);
			});
			$('.slider').not('.slider_header').css({cursor: ''}).unbind('click');
			$('.slider.selected').addClass('outpage').removeClass('selected').bind('webkitAnimationEnd', function(){
				$(this).removeClass('outpage').addClass('inpage');
			});
		}
	}

	/** Stock item add page function **/
	this.add_page_init = function _add(target)
	{
		/* Var */
		var parent = target;
		/* Load complete */
		init();

		/* Function */
		/** 初始化函數 **/
		function init()
		{
			var $add_btn = $('.submit-btn').parent('a');
			$add_btn.click(submit);
		}

		/** Submit add event **/
		function submit()
		{
			var $item_name = $('.frm-itemname');
			if($item_name.val() == '')
			{
				status_toggle('itemname');
				return;
			}
			$.ajax({
				url: 'api/stock/add_item/' + $item_name.val(),
				type: 'get',
				success: function(result)
				{
					result = JSON.parse(result);
					if(result)
					{					
						$('.submit-btn').parents('li').animate({opacity: 0}, function(){
							$(this).hide();
						});
						$('.input-group').animate({opacity: 0}, function(){
							$(this).hide();
							$('.modal-alert').html('<strong>新增!</strong>執行成功, 兩秒後自動關閉').addClass('alert-info').show().animate({opacity: 1});
							stock_item_list.modal_close_timer = setTimeout(function(){
								$('.modal').modal('hide');
							}, 2000);
						});
						parent.LoadData('last');
					}
				}
			});
		}

		/** frm-control status toggle **/
		function status_toggle(colname)
		{
			var cols = {
				'itemname': '.frm-itemname',
			},
				$target = $(cols[colname]).parent('.input-group');

			if($target.hasClass('has-error'))
				$target.removeClass('has-error');
			else
				$target.addClass('has-error');
		}
	}	

	/** Stock item edit page function **/
	this.edit_page_init = function _edit(target)
	{
		/* Var */
		var parent = target;
		/* Load complete */
		init();

		/* Function */
		/** 初始化函數 **/
		function init()
		{
			var $edit_btn = $('.submit-btn').parent('a');			
			$('.stock-item-id').show().after('<br>');
			$edit_btn.click(submit);

			load_data();
		}

		/** Load detail **/
		function load_data()
		{
			var item_id = modal_args['item_id'];
			$.ajax({
				url: 'api/stock/detail_item/' + item_id,
				type: 'get',
				success: function(result)
				{
					result = JSON.parse(result);
					var $id = $('.frm-itemid'),
						$name = $('.frm-itemname');
					$id.val(result['si_id']);
					$name.val(result['si_name']);
				}
			});
		}

		/** Submit edit event **/
		function submit()
		{
			var $item_id = $('.frm-itemid'),
				$item_name = $('.frm-itemname');
			if($item_id.val() == '' & $item_name.val() == '')
			{
				status_toggle('itemid');
				status_toggle('itemname');
				return;
			}
			$.ajax({
				url: 'api/stock/update_item/' + $item_id.val() + '/' + $item_name.val(),
				type: 'get',
				success: function(result)
				{
					result = JSON.parse(result);
					if(result)
					{					
						$('.submit-btn').parents('li').animate({opacity: 0}, function(){
							$(this).hide();
						});
						$('.input-group').animate({opacity: 0}, function(){
							$(this).hide();
							$('.modal-alert').html('<strong>編輯!</strong>執行成功, 兩秒後自動關閉').addClass('alert-info').show().animate({opacity: 1});
							stock_item_list.modal_close_timer = setTimeout(function(){
								$('.modal').modal('hide');
							}, 2000);
						});
						parent.LoadData(parent.getNowPage());
					}
				}
			});
		}

		/** frm-control status toggle **/
		function status_toggle(colname)
		{
			var cols = {
				'itemid': '.frm-itemid',
				'itemname': '.frm-itemname',
			},
				$target = $(cols[colname]).parent('.input-group');

			if($target.hasClass('has-error'))
				$target.removeClass('has-error');
			else
				$target.addClass('has-error');
		}
	}	

}
stock_item_list.prototype.modal_close_timer = false;