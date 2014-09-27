<div class="container-fluid">
	<div class="navbar-header">
		<h2> - {page_type}</h2>
    </div>
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav navbar-right" style="margin-top:15px;">
			<li><a href="#"><span class="glyphicon glyphicon-ok submit-btn"></span></a></li>
			<li><a href="javascript: $('.modal').modal('hide');"><span class="glyphicon glyphicon-remove"></span></a></li>
		</ul>
    </div>
</div>

<div class="row placeholders">	
	<div class="col-md-6 col-md-offset-3">
		<div class="alert modal-alert" role="alert" style="display: none; opacity: 0;"></div>
		<div class="input-group stock-item-id" style="display: none;">
			<span class="input-group-addon">品項編號</span>
			<input type="text" class="frm-itemid form-control" disabled="disabled">
		</div>	

		<div class="input-group stock-item-name">
			<span class="input-group-addon">品項名稱</span>
			<input type="text" class="frm-itemname form-control" placeholder="請輸入品項名稱">
		</div>	
	</div>
</div>

<script>
	main.{init_function}(main);
	var $modal_title = $('.container-fluid .navbar-header h2');
	$modal_title.text(page_title + $modal_title.text());
</script>