<div class="page-header">
	<div class="navbar-header">
		<h1>檢視帳務 - 表格</h1>
    </div>
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav navbar-right content-navbar" style="margin-top:20px;">
			<li><a href="#"><span class="label label-primary detail-mode detail-item-btn">項目模式</span></a></li>
			<li><a href="#"><span class="label label-default detail-mode detail-month-btn">月模式</span></a></li>			
			<li><a href="#"><span class="glyphicon glyphicon-print print-page"></span></a></li>
		</ul>
    </div>   
</div>

<div class="row placeholders">
	<div class="col-md-6 col-xs-6 col-md-offset-3 col-xs-offset-3 target-total-data">
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

	<div class="object-total-data" style="display: none;">
		<div class="row slider slider_header inpage">
			<ul class="nav navbar-nav navbar-left content-navbar">
				<!-- Start date -->
				<li>
					<input type="date" class="form-control object-date-select object-start-date">
				</li>
				<li><span class="glyphicon glyphicon-circle-arrow-right" style="margin: 15px;"></span></li>
				<!-- End date -->
				<li>
					<input type="date" class="form-control object-date-select object-end-date">
				</li>
			</ul>
			<h3 class="text-center object-date-txt">2014-09-01~2014-09-30</h3>
		</div>
		<div class="row slider slider_header inpage">
			<div class="col-md-12 col-xs-12">金額</div>
		</div>
	</div>

	<div class="difference-total-data" style="display: none;">
		<div class="row slider slider_header inpage">
			<div class="col-md-12 col-xs-12">金額</div>
		</div>
	</div>
	
	<div class="col-md-6 col-xs-6 col-md-offset-3 col-xs-offset-3 target-data">
		<div class="row slider slider_header inpage detail-item">
			<div class="col-md-2 col-xs-2">項目</div>
			<div class="col-md-3 col-xs-3">數量(加總)</div>
			<div class="col-md-3 col-xs-3">單價(平均)</div>
			<div class="col-md-3 col-xs-3">總額</div>
			<div class="col-md-1 col-xs-1 plus"><span class="glyphicon glyphicon-plus"></span></div>
		</div>
		<div class="row slider slider_header inpage detail-month" style="display: none;">
			<div class="col-md-2 col-xs-2">月份</div>
			<div class="col-md-3 col-xs-3">進額</div>
			<div class="col-md-3 col-xs-3">銷額</div>
			<div class="col-md-3 col-xs-3">利潤</div>
			<div class="col-md-1 col-xs-1 plus"><span class="glyphicon glyphicon-plus"></span></div>
		</div>
	</div>
	<div class="object-data" style="display: none;">
		<div class="row slider slider_header inpage detail-item">
			<div class="col-md-4 col-xs-4">數量(加總)</div>
			<div class="col-md-4 col-xs-4">單價(平均)</div>
			<div class="col-md-4 col-xs-4">總額</div>
		</div>
		<div class="row slider slider_header inpage detail-month" style="display: none;">
			<div class="col-md-3 col-xs-3">月份</div>
			<div class="col-md-3 col-xs-3">進額</div>
			<div class="col-md-3 col-xs-3">銷額</div>
			<div class="col-md-3 col-xs-3">利潤</div>
		</div>
	</div>
	<div class="calc-data" style="display: none;">
		<div class="row slider slider_header inpage">
			<div class="col-md-12 col-xs-12">差額</div>
		</div>
	</div>
</div>

<script src="assets/js/plugins/date.js"></script>
<script src="assets/js/models/item_list_table.js"></script>
<script src="assets/js/controllers/view_table.js"></script>
<link href="assets/css/data_slider.css" rel="stylesheet" type="text/css" />

<script>
	var main = new view_table();
</script>