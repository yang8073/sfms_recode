<div class="page-header">
	<div class="navbar-header">
		<h1>檢視帳務 - 圖表</h1>
    </div>
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav navbar-right content-navbar" style="margin-top:20px;">
			<li><a href="#"><span class="label label-primary detail-mode detail-item-btn">日模式</span></a></li>
			<li><a href="#"><span class="label label-default detail-mode detail-month-btn">月模式</span></a></li>			
			<!--<li><a href="#"><span class="glyphicon glyphicon-print print-page"></span></a></li>-->
		</ul>
    </div>   
</div>

<div class="row placeholders">
	<div class="col-md-6 col-xs-6 col-md-offset-3 col-xs-offset-3 target-data">
		<div class="row slider slider_header inpage">
			<ul class="nav navbar-nav navbar-left content-navbar">
				<!-- Start date -->
				<li>
					<input type="date" class="form-control target-date-select target-start-date">
				</li>
				<li><span class="glyphicon glyphicon-circle-arrow-right" style="margin: 15px;"></span></li>
				<!-- End date -->
				<li>
					<input type="date" class="form-control target-date-select target-end-date">
				</li>
			</ul>
			<h3 class="text-center target-date-txt">2014-09-01~2014-09-30</h3>
		</div>
		<div class="row slider slider_header inpage">
			<div class="col-md-4 col-xs-4">項目</div>
			<div class="col-md-8 col-xs-8">金額</div>
		</div>
	</div>

	<div class="col-md-8 col-xs-8 col-md-offset-2 col-xd-offset-2">
		<div id="chart"></div>
	</div>

</div>

<script src="assets/js/plugins/date.js"></script>
<script src="assets/plugins/d3/js/d3.min.js" charset="utf-8"></script>
<script src="assets/plugins/c3/js/c3.min.js"></script>
<script src="assets/js/models/item_list_table.js"></script>
<script src="assets/js/controllers/view_chart.js"></script>
<link href="assets/plugins/c3/css/c3.css" rel="stylesheet" type="text/css">
<link href="assets/css/data_slider.css" rel="stylesheet" type="text/css" />

<script>
	var main = new view_chart();
</script>