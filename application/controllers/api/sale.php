<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

# API Sale
class Sale extends CI_Controller {

	# 定義頁項目數量
	var $page_item_num = 13;

	function __construct()
	{
		parent::__construct();
		if(!$this->session->userdata('logged_in')) exit('Insufficient permissions');
		$this->load->model('salemodel');
	}

	# 取得某日銷貨紀錄
	# GET
	# api/sale/record_list/[2014-08-20]
	# date = null傳回最新紀錄
	# 執行成功傳回true, 失敗傳回false
	public function record_list($date = null)
	{
		$result = $this->salemodel->getRecord($date);
		echo json_encode($result);
	}

	# 取得期間銷貨紀錄統計
	# GET
	# api/sale/statisics_record/2014-09-01/2014-09-30
	public function statisics_record($sdate = null, $edate = null, $mode = 'detail_item')
	{
		if($sdate == null || $edate == null)
		{
			$result = false;
		}
		else
		{
			if($mode == 'detail_item')
				$result = $this->salemodel->getStatisicsItem($sdate, $edate);
			else if($mode == 'detail_month')
				$result = $this->salemodel->getStatisicsMonth($sdate, $edate);
			else if($mode == 'detail_day')
				$result = $this->salemodel->getStatisicsDay($sdate, $edate);
		}
		echo json_encode($result);
	}

	# 新增銷貨紀錄
	# GET 
	# api/sale/add_record
	## URL params
	## item_id			Array()
	## item_quantity	Array()
	## item_up			Array()
	## item_value		Array()
	# 傳回{'success'=> 執行成功數量, 'fail'=> 執行失敗數量}
	public function add_record()
	{
		$item_id =  json_decode($this->input->get('item_id', true));
		$item_quantity = json_decode($this->input->get('item_quantity', true));
		$item_up = json_decode($this->input->get('item_up', true));
		$item_value = json_decode($this->input->get('item_value', true));
		$result = $this->salemodel->addRecord($item_id, $item_quantity, $item_up, $item_value);
		echo json_encode($result);
	}

	# 修改銷貨紀錄
	# GET 
	# api/sale/update_record
	## URL params
	## records_id			Array()
	## records_quantity	Array()
	## records_up			Array()
	## records_value		Array()
	# 傳回{'success'=> 執行成功數量, 'fail'=> 執行失敗數量}
	public function update_record()
	{
		$records_id =  json_decode($this->input->get('records_id', true));
		$records_quantity = json_decode($this->input->get('records_quantity', true));
		$records_up = json_decode($this->input->get('records_up', true));
		$records_value = json_decode($this->input->get('records_value', true));
		$result = $this->salemodel->updateRecord($records_id, $records_quantity, $records_up, $records_value);
		echo json_encode($result);
	}

	# 刪除銷貨紀錄
	# GET
	# api/sale/delete_record/[2014-08-20]
	# 執行成功傳回true, 失敗傳回false
	public function delete_record($date = null)
	{
		if($date)
		{
			if($this->_checkDateFormat($date))
				echo json_encode($this->salemodel->deleteRecord($date));
			else
				echo json_encode(false);
		}
		else
			echo json_encode(false);
	}

	# 取得全部銷貨項目
	# api/sale/all_item
	public function all_item()
	{
		$rows = $this->salemodel->getItems();
		echo json_encode($rows);
	}

	# 取得銷貨項目
	# api/sale/item_list/[5]
	# 參數部田則為第一頁
	public function item_list($page = 1)
	{
		$rows = $this->salemodel->getItemList($page, $this->page_item_num);
		$maxpage = ceil($this->salemodel->getItemCount() / $this->page_item_num);
		$result = array(
			'items' => !$rows?array():$rows->result_array(),
			'maxpage' => $maxpage,
			'nowpage' => $page,
			);
		echo json_encode($result);
	}

	# 取得進貨項目詳細
	# api/sale/detail_item/20
	public function detail_item($item_id)
	{
		$result = $this->salemodel->getSaleItemDetail($item_id);
		echo json_encode($result);
	}

	# 新增進貨項目
	# api/sale/add_item/項目名稱
	public function add_item($item_name)
	{
		$result = $this->salemodel->insertSaleItem(urldecode($item_name));
		echo json_encode($result);
	}

	# 修改進貨項目
	# api/sale/update_item/項目編號/項目名稱
	public function update_item($item_id, $item_name)
	{
		$result = $this->salemodel->updateSaleItem($item_id, urldecode($item_name));
		echo json_encode($result);
	}

	# 刪除進貨項目
	# api/sale/delete_item/項目編號
	public function delete_item($item_id)
	{
		$result = $this->salemodel->deleteSaleItem($item_id);
		echo json_encode($result);
	}	

	# 檢查日期格式(yyyy-mm-dd)
	function _checkDateFormat($date)
	{
		// match the format of the date
		if (preg_match("/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/", $date, $parts)) {
		// check whether the date is valid of not
			if (checkdate($parts[2], $parts[3], $parts[1])) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}