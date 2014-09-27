<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

# Controller Stock
class View extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		if(!$this->session->userdata('logged_in')) exit('Insufficient permissions');
	}

	function table()
	{
		$this->load->view("view_table");
	}

	function chart()
	{
		$this->load->view("view_chart");
	}
}