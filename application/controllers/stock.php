<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

# Controller Stock
class Stock extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		if(!$this->session->userdata('logged_in')) exit('Insufficient permissions');
	}

	# 預設頁面
	# stock/
	# 登入檢查自動跳轉
	public function index()
	{
		/* 檢測Session */
		$logged_in = $this->session->userdata('logged_in');		
		if(!$logged_in)
		{
			redirect('/account/login');
		}
	}

	# 進貨紀錄列表
	# stock/record_list
	public function record_list()
	{
		$data = array(
			'page_title' => '進貨',
			'model_name' => 'stock',
			);
		$this->parser->parse('share_list', $data);
	}

	# 新增進貨紀錄
	# stock/add_record
	public function add_record()
	{
		$data = array(
			'page_type' => '新增',
			'init_function' => 'add_page_init'
			);
		$this->parser->parse('share_edit', $data);
	}

	# 修改進貨紀錄
	# stock/edit_record
	public function edit_record()
	{
		$data = array(
			'page_type' => '編輯',
			'init_function' => 'edit_page_init'
			);
		$this->parser->parse('share_edit', $data);
	}

	# 進貨項目列表
	# stock/item_list
	public function item_list()
	{
		$data = array(
			'page_title' => '進貨項目',
			'model_name' => 'stock',
			);
		$this->parser->parse('share_item_list', $data);
	}

	# 新增進貨項目
	# stock/add_item
	public function add_item()
	{
		$data = array(
			'page_type' => '新增',
			'init_function' => 'add_page_init'
			);
		$this->parser->parse('share_item_edit', $data);
	}

	# 修改進貨項目
	# stock/edit_item
	public function edit_item()
	{
		$data = array(
			'page_type' => '編輯',
			'init_function' => 'edit_page_init'
			);
		$this->parser->parse('stock_item_edit', $data);
	}
}