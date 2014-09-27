<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

# Controller Sale
class Sale extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		if(!$this->session->userdata('logged_in')) exit('Insufficient permissions');
	}

	# 預設頁面
	# sale/
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

	# 銷貨紀錄列表
	# sale/record_list
	public function record_list()
	{
		$data = array(
			'page_title' => '銷貨',
			'model_name' => 'sale',
			);
		$this->parser->parse('share_list', $data);
	}

	# 新增銷貨紀錄
	# sale/add_record
	public function add_record()
	{
		$data = array(
			'page_type' => '新增',
			'init_function' => 'add_page_init'
			);
		$this->parser->parse('share_edit', $data);
	}

	# 修改銷貨紀錄
	# sale/edit_record
	public function edit_record()
	{
		$data = array(
			'page_type' => '編輯',
			'init_function' => 'edit_page_init'
			);
		$this->parser->parse('share_edit', $data);
	}

	# 銷貨項目列表
	# sale/item_list
	public function item_list()
	{
		$data = array(
			'page_title' => '銷貨項目',
			'model_name' => 'sale',
			);
		$this->parser->parse('share_item_list', $data);
	}

	# 新增銷貨項目
	# sale/add_item
	public function add_item()
	{
		$data = array(
			'page_type' => '新增',
			'init_function' => 'add_page_init'
			);
		$this->parser->parse('share_item_edit', $data);
	}

	# 修改銷貨項目
	# sale/edit_item
	public function edit_item()
	{
		$data = array(
			'page_type' => '編輯',
			'init_function' => 'edit_page_init'
			);
		$this->parser->parse('share_item_edit', $data);
	}
}