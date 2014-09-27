/* Class */
function view_table()
{
	var view_mode = {
		DetailItem: 0,
		DetailMonth: 1,
	};
	var start_date = null,
		end_date = null,
		slider_speed = 50,
		itemListTable = new ItemListTable(slider_speed, 'view_table', '.target-data'),
		target_total_data_list_table = new ItemListTable(slider_speed, 'view_total_table', '.target-total-data'),
		itemListTable2,
		itemListTable3,
		now_view_mode = view_mode.DetailItem,
		plus_mode = false;

	init();

	function init()
	{
		/* page leave event */
		g_only_add_page_leave_event(function(){
			itemListTable.clearAllTimer();
			if(itemListTable2)
				itemListTable2.clearAllTimer();
			if(itemListTable3)
				itemListTable3.clearAllTimer();
			if(target_total_data_list_table)
				target_total_data_list_table.clearAllTimer();
		});

		var $plus = $('.plus'),
			$double_table_submit = $('.double-table-submit'),
			$target_date_select = $('.target-date-select'),
			$object_date_select = $('.object-date-select'),
			$detail_mode = $('.detail-mode'),
			$print_page = $('.print-page');
		$plus.click(function(){
			itemListTable.changeType('view_target_table_item');
			$('.plus').remove();
			/* 左框 */
			$('.target-total-data').removeClass('col-md-6').removeClass('col-xs-6').addClass('col-md-5').addClass('col-xs-5').removeClass('col-md-offset-3').removeClass('col-xs-offset-3');
			$('.target-data').removeClass('col-md-6').removeClass('col-xs-6').addClass('col-md-5').addClass('col-xs-5').removeClass('col-md-offset-3').removeClass('col-xs-offset-3');
			$('.target-data .slider').each(function(){
				$(this).find('div').first().removeClass('col-md-2').removeClass('col-xs-2').addClass('col-md-3').addClass('col-xs-3')
			});
			/* 右框 */
			$('.object-total-data').addClass('col-md-5').addClass('col-xs-5').show();
			$('.object-data').addClass('col-md-5').addClass('col-xs-5').show();
			/* 差異 */
			$('.difference-total-data').addClass('col-md-2').addClass('col-xs-2').show();
			$('.calc-data').addClass('col-md-2').addClass('col-xs-2').show();

			var base_month = new Date(new Date().setMonth(new Date().getMonth() - 1)),
				object_sdate = new Date(base_month.setDate(1)).Format('yyyy-MM-dd'),
				object_edate = new Date(new Date().setDate(0)).Format('yyyy-MM-dd'),
				$object_sdate = $('.object-start-date'),
				$object_edate = $('.object-end-date');
			itemListTable2 = new ItemListTable(slider_speed, 'view_object_table_item', '.object-data');
			object_total_data_list_table = new ItemListTable(slider_speed, 'view_total_table_no_title', '.object-total-data');
			itemListTable3 = new ItemListTable(slider_speed, 'calc_table', '.calc-data');
			difference_total_data_list_table = new ItemListTable(slider_speed, 'view_total_table_no_title', '.difference-total-data');
			plus_mode = true;
			$object_sdate.val(object_sdate);
			$object_edate.val(object_edate);
			_change_print_date()
			load_data(itemListTable2, object_sdate, object_edate, calc_difference);
		});
		$target_date_select.change(function(){
			var $target_sdate = $('.target-start-date'),
				$target_edate = $('.target-end-date');
			//console.log(itemListTable.timerStack);
			load_data(itemListTable, $target_sdate.val(), $target_edate.val(), calc_difference);
			if(itemListTable3)
				itemListTable3.clearList();
		});
		$object_date_select.change(function(){
			var $object_sdate = $('.object-start-date'),
				$object_edate = $('.object-end-date');
			load_data(itemListTable2, $object_sdate.val(), $object_edate.val(), calc_difference);
			if(itemListTable3)
				itemListTable3.clearList();
		});
		$detail_mode.click(function(){
			var $this = $(this);
			if($this.hasClass('label-primary'))
			{
				return;
			}
			$this.parents('ul').find('.detail-mode').removeClass('label-primary').addClass('label-default');
			if($this.hasClass('detail-item-btn'))
			{
				change_view_mode(view_mode.DetailItem);				
				$this.removeClass('label-default').addClass('label-primary');
			}
			else
			{
				change_view_mode(view_mode.DetailMonth);
				$this.removeClass('label-default').addClass('label-primary');
			}
		});
		$print_page.click(function(){
			printout();	
			function printout() {
				if (!window.print){alert("列印功能暫時停用，請按 Ctrl-P 來列印"); return;}
				window.print();
			}
		});

		var $target_sdate = $('.target-start-date'),
			$target_edate = $('.target-end-date');
		_init_target_date();
		load_data(itemListTable, $target_sdate.val(), $target_edate.val(), calc_difference);

		function _init_target_date()
		{
			var $start_date = $('.target-start-date'),
				$end_date = $('.target-end-date'),
				default_date = new Date();
			if(typeof date1 == 'string')
			{
				start_date = new Date(date1);
			}
			else
			{
				start_date = new Date(default_date.setDate(1));
			}

			default_date = new Date(default_date.setMonth(default_date.getMonth() + 1));
			default_date = new Date(default_date.setDate(0));
			if(typeof date2 == 'string')
			{
				end_date = new Date(date2);
			}
			else
			{
				end_date = default_date;
			}

			$start_date.val(start_date.Format('yyyy-MM-dd'));
			$end_date.val(end_date.Format('yyyy-MM-dd'));
			_change_print_date();		
		}

		function _change_print_date()
		{
			var $target_sdate = $('.target-start-date'),
				$target_edate = $('.target-end-date'),
				$target_date_txt = $('.target-date-txt'),
				$object_sdate = $('.object-start-date'),
				$object_edate = $('.object-end-date'),
				$object_date_txt = $('.object-date-txt');
			$target_date_txt.text($target_sdate.val() + ' ~ ' + $target_edate.val());
			$object_date_txt.text($object_sdate.val() + ' ~ ' + $object_edate.val());
		}
	}

	function change_view_mode(mode)
	{
		now_view_mode = mode;
		switch(mode)
		{
			case view_mode.DetailItem:
				$('.detail-month').hide();
				$('.detail-item').show();
				if(itemListTable.ListType == ItemListTableType['view_table_month'])
					itemListTable.changeType('view_table');
				else
					itemListTable.changeType('view_target_table_item');
				if(itemListTable2)
					itemListTable2.changeType('view_object_table_item');
				break;
			case view_mode.DetailMonth:
				$('.detail-month').show();
				$('.detail-item').hide();
				if(itemListTable.ListType == ItemListTableType['view_table'])
					itemListTable.changeType('view_table_month');
				else
					itemListTable.changeType('view_target_table_month');
				if(itemListTable2)
					itemListTable2.changeType('view_object_table_month');
				break;
		}
		var $target_sdate = $('.target-start-date'),
			$target_edate = $('.target-end-date'),
			$object_sdate = $('.object-start-date'),
			$object_edate = $('.object-end-date');
		
		itemListTable.clearList();
		if(itemListTable2)
			itemListTable2.clearList();
		if(itemListTable3)
			itemListTable3.clearList();

		load_data(itemListTable, $target_sdate.val(), $target_edate.val());
		if(itemListTable2)
			load_data(itemListTable2, $object_sdate.val(), $object_edate.val(), calc_difference);

	}

	function load_data(targetTable, date1, date2, callback)
	{
		/*
		if(g_page_loading)
			return;
		g_page_loading = true;
		*/
		var url = 'api/stock/statisics_record/' + date1 + '/' + date2,
			records = new Array(),
			token = targetTable.getToken(),
			sum_stock = 0,
			sum_sale = 0;
		if(now_view_mode == view_mode.DetailItem)
			url += '/detail_item';
		else
			url += '/detail_month';
		$.ajax({
			url: url,
			type: 'get',
			success: function(result){
				var decode_result = JSON.parse(result);

				records.push(decode_result);
			}
		}).done(function(){
			url = 'api/sale/statisics_record/' + date1 + '/' + date2;
			if(now_view_mode == view_mode.DetailItem)
				url += '/detail_item';
			else
				url += '/detail_month';
			$.ajax({
				url: url,
				type: 'get',
				success: function(result){
					var decode_result = JSON.parse(result);
					records.push(decode_result);
				}
			}).done(function(){
				_push_row_factory(records);				
			});
		});

		function _push_row_factory(records)
		{
			if(now_view_mode == view_mode.DetailItem)
			{
				_detail_item_push(records);
			}
			else
			{
				_detail_month_push(records);
			}

			function _detail_item_push(records)
			{
				var restruct_datas = new Array(),
					default_url = [
						'api/stock/all_item',
						'api/sale/all_item'
					],
					default_type = [
						'stock',
						'sale'
					],
					url_counter = 0;

					_restruct(url_counter, function(){
						_push(restruct_datas);
						_calc_sum();
						_total_data_load(targetTable['Target']);
					});

				function _restruct(counter, callback)
				{
					if(counter > 1)
					{
						if(callback)
							callback();
						return;
					}

					$.ajax({
						url: default_url[counter],
						type: 'get',
						success: function(result){
							var decode_result = JSON.parse(result),
								t_sum = 0;
								
							for(var key in decode_result)
							{
								var s_item = decode_result[key]['si_id'],
									restruct_data = {
										'si_name': decode_result[key]['si_name'],
										'sum_quantity': 0,
										'avg_up': 0,
										'sum_value': 0,
										'type': default_type[counter],
									};

								for(var key2 in records[counter])
								{
									if(parseInt(records[counter][key2]['s_item']) == parseInt(s_item))
									{
										restruct_data['sum_quantity'] = records[counter][key2]['sum_quantity'];
										restruct_data['avg_up'] = records[counter][key2]['avg_up'];
										restruct_data['sum_value'] = records[counter][key2]['sum_value'];
									}
								}
								restruct_datas.push(restruct_data);
							}
							counter++;
							_restruct(counter, callback);
						}
					});
				}

				function _push(data)
				{
					var index = 0,
						className = ['stock', 'sale'],
						addevent = function(){						
							var item = data[index];						
							if(!item)
							{
								//g_page_loading = false;
								if(callback)
									callback();
								return;
							}
							else
							{
								targetTable.rowClass = item['type'];
								targetTable.addRow(item['si_name'], item['sum_quantity'], new Number(item['avg_up']).toFixed(2), item['sum_value']);
								index++;
							}
							targetTable.setTimeout(addevent, slider_speed, token);
						};
					targetTable.setTimeout(addevent, slider_speed, token);
				}

				function _calc_sum(index)
				{
					index = index >= 0?index:0;
					if(index >= restruct_datas.length)
						return;
					switch(restruct_datas[index]['type'])
					{
						case 'stock':
							sum_stock += parseInt(restruct_datas[index]['sum_value']);
							break;
						case 'sale':
							sum_sale += parseInt(restruct_datas[index]['sum_value']);
							break;
					}
					_calc_sum(++index);
				}
			}

			function _detail_month_push(records)
			{
				var restruct_datas = new Array(),
					year_counter = new Date(date1).getFullYear(),
					month_counter = new Date(date1).getMonth() + 1,					
					addIndex = 0,
					max_date_filter = parseInt(new Date(date2).Format('yyyyMM'));
				do
				{
					var month = month_counter,
						short_date = new Date(year_counter, month_counter - 1, 1).Format('yyyy-MM'),
						t_sum_stock = 0,
						t_sum_sales = 0,
						restruct_data;
					for(var key in records[0])
					{
						if(records[0][key]['short_date'] == short_date)
							t_sum_stock = records[0][key]['sum_stock'];
					}
					for(var key in records[1])
					{
						if(records[1][key]['short_date'] == short_date)
							t_sum_sales = records[1][key]['sum_sales'];
					}
					restruct_data = {
						'short_date': short_date,
						'sum_stock': t_sum_stock,
						'sum_sales': t_sum_sales,
						'profit': t_sum_sales - t_sum_stock,
					};
					sum_stock += parseInt(restruct_data['sum_stock']);
					sum_sale += parseInt(restruct_data['sum_sales']);

					restruct_datas.push(restruct_data);
					
					if(month_counter < 12)
					{
						month_counter++;
					}
					else
					{
						year_counter++;
						month_counter = 1;
					}
					var t_date = parseInt(new Date(year_counter.toString() + '-' + month_counter.toString() + '-01').Format('yyyyMM'));
				}while(t_date <= max_date_filter);

				debugger;
				_total_data_load(targetTable['Target']);

				var addevent = function(){
					if(!restruct_datas[addIndex])
					{
						//g_page_loading = false;
						if(callback)
							callback();
						return;
					}
					targetTable.rowClass = '';
					targetTable.addRow(restruct_datas[addIndex]['short_date'], restruct_datas[addIndex]['sum_stock'], restruct_datas[addIndex]['sum_sales'], restruct_datas[addIndex]['profit']);
					addIndex++;
					targetTable.setTimeout(addevent, slider_speed, token);
				};
				targetTable.setTimeout(addevent, slider_speed, token);
			}
		}

		function _total_data_load(className)
		{
			switch(className)
			{
				case '.target-data':
					target_total_data_list_table.clearList(function(){
						target_total_data_list_table.addRow(sum_stock, sum_sale, sum_sale - sum_stock);
					});
					break;
				case '.object-data':
					object_total_data_list_table.clearList(function(){
						object_total_data_list_table.addRow(sum_stock, sum_sale, sum_sale - sum_stock);
						_total_data_load('.calc-data');
					});
					break;
				case '.calc-data':
					var target_stock = parseInt(target_total_data_list_table.fields_value(1, 0)),
						target_sale = parseInt(target_total_data_list_table.fields_value(1, 1)),
						target_total = parseInt(target_total_data_list_table.fields_value(1, 2)),
						object_stock = parseInt(object_total_data_list_table.fields_value(0, 0)),
						object_sale = parseInt(object_total_data_list_table.fields_value(0, 1)),
						object_total = parseInt(object_total_data_list_table.fields_value(0, 2));
					difference_total_data_list_table.clearList(function(){
						difference_total_data_list_table.addRow(target_stock - object_stock, target_sale - object_sale, target_total - object_total);
					});
					break;
			}

		}	
	}

	function calc_difference()
	{
		if(!plus_mode)
			return;

		var rowIndex = 0,
			token = itemListTable3.getToken(),
			addevent = function(){
				if(rowIndex == itemListTable.row_length())
				{
					//g_page_loading = false;
					return;
				}
				var targetVal = parseInt(itemListTable.fields_value(3, rowIndex)),
					objectVal = parseInt(itemListTable2.fields_value(now_view_mode == view_mode.DetailItem?2:3, rowIndex)),
					className = '';
				if(isNaN(targetVal - objectVal))
					return;
				if(itemListTable.rowHasClass(rowIndex, 'stock'))
					className = 'stock';
				else if(itemListTable.rowHasClass(rowIndex, 'sale'))
					className = 'sale';

				itemListTable3.rowClass = className;
				itemListTable3.addRow(targetVal - objectVal);
				rowIndex++;
				itemListTable3.setTimeout(addevent, slider_speed, token);
			};
		itemListTable3.setTimeout(addevent, slider_speed, token);
	}
}