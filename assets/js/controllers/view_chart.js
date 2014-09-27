var chart_mode = {
	detail_day: 'detail_day',
	detail_month: 'detail_month',
};
function view_chart()
{
	var itemListTable = new ItemListTable(50, 'view_total_table'),
		now_chart_mode = chart_mode.detail_day;

	init();

	function init()
	{
		/* 初始時間 */
		_date_init(chart_mode.detail_day);
		/* 初始圖表 */
		_chart_init();
		/* 初始事件 */
		_event_init();

		function _date_init(mode)
		{
			_init_target_date(mode);

			function _init_target_date(mode)
			{
				var $start_date = $('.target-start-date'),
					$end_date = $('.target-end-date'),
					start_date = new Date(),
					end_date = new Date();

				if(mode == chart_mode.detail_day)
				{
					start_date.setDate(1);
					//start_date = new Date(default_date.setDate(1));
				}
				else if(mode == chart_mode.detail_month)
				{
					start_date.setMonth(0)
					start_date.setDate(1);
				}

				end_date.setMonth(end_date.getMonth() +1);
				end_date.setDate(0);

				$start_date.val(start_date.Format('yyyy-MM-dd'));
				$end_date.val(end_date.Format('yyyy-MM-dd'));
				_change_print_date();		
			}

			function _change_print_date()
			{
				var $target_sdate = $('.target-start-date'),
					$target_edate = $('.target-end-date'),
					$target_date_txt = $('.target-date-txt');
				$target_date_txt.text($target_sdate.val() + ' ~ ' + $target_edate.val());
			}	
		}

		function _event_init()
		{
			/* page leave event */
			g_only_add_page_leave_event(function(){
				itemListTable.clearAllTimer();
			});

			var $target_date = $('.target-date-select'),
				$detail_mode = $('.detail-mode');

			$target_date.change(function(){
				var sdate = getDate('target_start_date'),
					edate = getDate('target_end_date');

				load_data(sdate, edate);
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
					_change_view_mode(chart_mode.detail_day);				
					$this.removeClass('label-default').addClass('label-primary');
				}
				else
				{
					_change_view_mode(chart_mode.detail_month);
					$this.removeClass('label-default').addClass('label-primary');
				}
			});

			function _change_view_mode(mode)
			{
				now_chart_mode = mode;
				_date_init(mode);
				_chart_init();
			}
		}

		function _chart_init()
		{
			var sdate = getDate('target_start_date'),
				edate = getDate('target_end_date');
				/* Debug */
				//sdate = '2014-07-01',
				//edate = '2014-08-31';

			load_data(sdate, edate);
		}
	}

	function load_data(sdate, edate)
	{
		var run_date = new Date(sdate),
			records = [
				['x'],
				['進額'],
				['銷額'],
			],
			sum_stock = 0,
			sum_sales = 0,
			date_col_name = now_chart_mode == chart_mode.detail_day?'s_date':
							now_chart_mode == chart_mode.detail_month?'short_date':
							'';

		switch(now_chart_mode)
		{
			case chart_mode.detail_day:
				records = _day_array_init(run_date, records);
				break;
			case chart_mode.detail_month:
				records = _month_array_init(run_date, records);
				break;
		}
		$.ajax({
			url: 'api/stock/statisics_record/' + sdate + '/' + edate + '/' + now_chart_mode,
			type: 'get',
			success: function(result){
				var decode_result = JSON.parse(result);
				for(var key in decode_result)
				{						
					var index = _findArray(decode_result[key][date_col_name], records[0]);
					if(index != -1)
						records[1][index] = decode_result[key]['sum_stock'];
					sum_stock += parseInt(decode_result[key]['sum_stock']);
				}
			}
		}).done(function(){
			$.ajax({
				url: 'api/sale/statisics_record/' + sdate + '/' + edate + '/' + now_chart_mode,
				type: 'get',
				success: function(result){
					var decode_result = JSON.parse(result);
					for(var key in decode_result)
					{						
						var index = _findArray(decode_result[key][date_col_name], records[0]);
						if(index != -1)
							records[2][index] = decode_result[key]['sum_sales'];
						sum_sales += parseInt(decode_result[key]['sum_sales']);
					}
				}
			}).done(function(){
				generateChart(now_chart_mode, records);
				itemListTable.clearList(function(){
					itemListTable.addRow(sum_stock, sum_sales, sum_sales - sum_stock);
				});
			});
		});

		function _day_array_init(run_date, records)
		{
			do
			{
				// date array
				records[0].push(run_date.Format('yyyy-MM-dd'));
				// stock array
				records[1].push("0");
				// sale array
				records[2].push("0");
				run_date = run_date.addDays(1);
			}while(run_date.Format('yyyy-MM-dd') != new Date(edate).addDays(1).Format('yyyy-MM-dd'));
			return records;			
		}

		function _month_array_init(run_date, records)
		{
			do
			{
				// date array
				records[0].push(run_date.Format('yyyy-MM'));
				// stock array
				records[1].push("0");
				// sale array
				records[2].push("0");
				run_date = run_date.addMonths(1);
			}while(run_date.Format('yyyy-MM') != new Date(edate).addMonths(1).Format('yyyy-MM'));
			return records;
		}

		function _findArray(element, targetArray)
		{
			for(var key in targetArray)
			{
				if(targetArray[key] == element)
				{
					return key;
				}
			}
			return -1;
		}
	}

	function generateChart(mode, records)
	{
		switch(mode)
		{
			case chart_mode.detail_day:
				_day_mode();
				break;
			case chart_mode.detail_month:
				_month_mode();
				break;
		}

		function _day_mode()
		{
			var chart = c3.generate({
			    data: {
			        x: 'x',
			        columns: records,
			    },
			    axis: {
			        x: {
			            type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d'
			            }
			        },
			        y: {
			        	tick:{
			        		format: d3.format('$,')
			        	}
			        }
			    }
			});
		}

		function _month_mode()
		{
			var chart = c3.generate({
			    data: {
			        x: 'x',
			        columns: records,
			    },
			    axis: {
			        x: {
			            type: 'category',
			        }
			    }
			});
		}
	}

	function getDate(item)
	{
		var $target_sdate = $('.target-start-date'),
			$target_edate = $('.target-end-date');
			//$object_sdate = $('.object-start-date'),
			//$object_edate = $('.object-end-date'),
			//$object_date_txt = $('.object-date-txt');
		switch(item)
		{
			case 'target_start_date':
				return $target_sdate.val();
			case 'target_end_date':
				return $target_edate.val();
		}
	}
}