<div class="row placeholders">

	<div class="col-md-4 col-md-offset-1">		

		<div class="thumbnail">
			<img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;">
			<div class="caption">
				<h3>Account profile</h3>
				<p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
			</div>
		</div>

	</div>

	<div class="col-md-5 col-md-offset-1">

		<div class="panel panel-danger">
			<div class="panel-heading">
				<h3 class="panel-title">日達成率</h3>
			</div>
			<div class="panel-body">
				<div class="progress">
					<div class="progress-bar progress-bar-danger day-reach" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100" >
					0%
					</div>
				</div>
			</div>
		</div>

		<div class="panel panel-info">
			<div class="panel-heading">
				<h3 class="panel-title">周達成率</h3>
			</div>
			<div class="panel-body">
				<div class="progress">
					<div class="progress-bar progress-bar-info week-reach" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100">
					0%
					</div>
				</div>
			</div>
		</div>

		<div class="panel panel-success">
			<div class="panel-heading">
				<h3 class="panel-title">月達成率</h3>
			</div>
			<div class="panel-body">
				<div class="progress">
					<div class="progress-bar progress-bar-success month-reach" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100">
					0%
					</div>
				</div>
			</div>
		</div>


	</div>
</div>

<script src="assets/js/controllers/account_profile.js"></script>

<script>
	var profile = new profile();

	Holder.run();
</script>