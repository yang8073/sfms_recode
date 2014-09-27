<div class="page-header">
	<div class="navbar-header">
		<h1>{page_title}</h1>
    </div>
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav navbar-right content-navbar" style="margin-top:20px;">
			<!-- Normal mode -->
			<li><a href="#"><span class="glyphicon glyphicon-chevron-left normal-mode page-prev"></span></a></li>
			<li>
				<select class="form-control normal-mode page-select" style="margin-top: 10px;">
				</select>
			</li>
			<li><a href="#"><span class="glyphicon glyphicon-chevron-right normal-mode page-next"></span></a></li>
			<li><a href="#"><span class="glyphicon glyphicon-plus normal-mode addItem-btn"></span></a></li>
			<li><a href="#"><span class="glyphicon glyphicon-pencil normal-mode editor-mode editItem-btn"></span></a></li>			
			<li><a href="#"><span class="glyphicon glyphicon-trash normal-mode deleteItem-btn"></span></a></li>
			<!-- Delete mode -->
			<li style="display: none; opacity: 0;"><a href="#"><span class="glyphicon glyphicon-ok delete-mode send-delete"></span></a></li>
			<li style="display: none; opacity: 0;"><a href="#"><span class="glyphicon glyphicon-remove delete-mode close-delete-mode"></span></a></li>
		</ul>
    </div>   
</div>

<div class="row placeholders">
	<div class="col-md-8 col-md-offset-2">
		<div class="row slider slider_header inpage">
			<div class="col-md-4">編號</div>
			<div class="col-md-4">名稱</div>
			<div class="col-md-4">用戶編號#用戶名稱</div>
		</div>
	</div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
    	<div class="container-fluid">
    		<br>
      		<div class="well">Loading..</div>
  		</div>
    </div>
  </div>
</div>

<script src="assets/js/models/item_list_table.js"></script>
<script src="assets/js/controllers/{model_name}.js"></script>
<link href="assets/css/data_slider.css" rel="stylesheet" type="text/css" />
<script>
	var main = new {model_name}_item_list(),
		page_title = "{page_title}";
</script>