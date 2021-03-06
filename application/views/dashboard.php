<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- 停止縮放 -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <link rel="icon" href="../../favicon.ico">

    <title>小吃財務管理系統</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="assets/plugins/bootstrap/css/themes/dashboard.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <script src="assets/js/ie-emulation-modes-warning.js"></script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="dashboard">小吃財務管理系統</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="dashboard">Home</a></li>
            <li><a href="#">Settings</a></li>
			<li><a href="{sign_url}">{sign_txt}</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <li><a href="#" data-target="stock">管理進貨</a></li>
            <li><a href="#" data-target="stock_item">管理進貨項目</a></li>
          </ul>
          <ul class="nav nav-sidebar">
            <li><a href="#" data-target="sale">管理銷貨</a></li>
            <li><a href="#" data-target="sale_item">管理銷貨項目</a></li>
          </ul>
          <ul class="nav nav-sidebar">
            <li><a href="#" data-target="view_table">檢視帳務-表格</a></li>
            <li><a href="#" data-target="view_chart">檢視帳務-圖表</a></li>
          </ul>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
			<!-- Content -->
        </div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="assets/js/jquery-1.11.1.min.js"></script>
    <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/js/docs.min.js"></script>
    <script src="assets/js/plugins/extend.string.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="assets/js/ie10-viewport-bug-workaround.js"></script>
	
	<!-- dashboard default js -->
	<script>
    var g_page_loading = false,
        g_page_leave_event = function(){ };

		$(function(){
			load_page();

      $('.sidebar').find('a').click(load_page);
		});

    function g_only_add_page_leave_event(event)
    {
      if(typeof event == 'function')
        g_page_leave_event = event;
    }

		function load_page(page_name){
      if(g_page_loading)
        return;

      g_page_leave_event();
      g_page_leave_event = function(){};
      
      if(typeof page_name == 'object')
      {
        var $this = $(this);
        page_name = $this.data('target');
      }

      if(typeof page_name == 'undefined')
        page_name = 'login';

      var page_url = {
        'login': 'account',
        'stock': 'stock/record_list',
        'stock_item': 'stock/item_list',
        'sale': 'sale/record_list',
        'sale_item': 'sale/item_list',
        'view_table': 'view/table',
        'view_chart': 'view/chart',
      };
			$('.main').load(page_url[page_name]);
		}
		
		function logout(){
			$.post('api/account/logout',function(){
				location.reload();
			});
		}
	</script>
  </body>
</html>
