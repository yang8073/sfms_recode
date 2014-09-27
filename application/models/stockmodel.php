<?php
class StockModel extends CI_Model {

	private $user_id = 0,
			$sqlWherefield = "";

	function __construct()
	{
		parent::__construct();
		$this->load->model('accountmodel');
		$this->load->model('permissionsmodel');
		$login_info = $this->accountmodel->login_info();
		$this->user_id = $this->accountmodel->getMemberId($login_info['login_user']);
	}


	# 取得進貨紀錄
	# getRecordList(日期)
	# 傳回對象數組, 失敗傳回false
	function getRecord($date, $showFull = false)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');

		if($date == null)
			$sql = "SELECT s_id, si_id, si_name, s_quantity, s_up, s_value, s_date FROM stock JOIN stock_item ON stock_item.si_id = stock.s_item  WHERE " . $sqlWherefield . " AND s_date = (SELECT MAX(s_date) FROM stock)";
		else
			$sql = "SELECT s_id, si_id, si_name, s_quantity, s_up, s_value, s_date FROM stock JOIN stock_item ON stock_item.si_id = stock.s_item  WHERE " . $sqlWherefield . " AND s_date = ?";
		if(!$showFull)
			$sql = $sql . " AND (s_quantity != 0 OR s_up != 0 OR s_value != 0)";
		//排序
		$sql .= " ORDER BY stock.s_item ASC";
		$query = $this->db->query($sql, array($date));
		if($query->num_rows() > 0)
			return $query->result_array();
		return false;
	}

	# 取得期間以項目統計紀錄
	# getStatisicsItem(起始日期, 結束日期)
	# 傳回統計數組, 失敗傳回false
	function getStatisicsItem($sdate, $edate)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');
		$sql = "SELECT s_item, si_name, SUM(s_quantity) AS sum_quantity, AVG(s_up) AS avg_up, SUM(s_value) AS sum_value FROM stock JOIN stock_item ON stock_item.si_id = stock.s_item WHERE " . $sqlWherefield . " AND s_date >= ? AND s_date <= ? GROUP BY si_name ORDER BY stock.s_item ASC";
		$query = $this->db->query($sql, array($sdate, $edate));
		if($query->num_rows() > 0)
			return $query->result_array();
		return false;
	}

	# 取得期間以月份統計紀錄
	# getStatisicsMonth(起始日期, 結束日期)
	# 傳回統計數組, 失敗傳回false
	function getStatisicsMonth($sdate, $edate)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');
		$sql = "SELECT DATE_FORMAT(s_date,'%Y-%m') AS short_date, SUM(s_value) AS sum_stock FROM stock WHERE " . $sqlWherefield . " AND s_date >= ? AND s_date <= ? GROUP BY short_date ORDER BY short_date ASC";
		$query = $this->db->query($sql, array($sdate, $edate));
		if($query->num_rows() > 0)
			return $query->result_array();
		return false;
	}

	# 取得期間以每日統計紀錄
	# getStatisicsDay(起始日期, 結束日期)
	# 傳回統計數組, 失敗傳回false
	function getStatisicsDay($sdate, $edate)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');
		$sql = "SELECT s_date, SUM(s_value) AS sum_stock FROM stock WHERE " . $sqlWherefield . " AND s_date >= ? AND s_date <= ? GROUP BY s_date ORDER BY s_date ASC";
		$query = $this->db->query($sql, array($sdate, $edate));
		if($query->num_rows() > 0)
			return $query->result_array();
		return false;
	}

	# 新增進貨紀錄
	# addRecord(項目編號陣列, 數量陣列, 單價陣列, 金額陣列)
	# 傳回新增對象{success:成功數量, fail:失敗數量}
	function addRecord($item_id, $item_quantity, $item_up, $item_value, $date)
	{
		$success = 0;
		$fail = 0;
		foreach($item_id as $key => $id)
		{
			$quantity = isset($item_quantity[$key])?$item_quantity[$key]:0;
			$up = isset($item_up[$key])?$item_up[$key]:0;
			$value = isset($item_value[$key])?$item_value[$key]:0;
			$sql = "INSERT INTO stock (s_item, s_quantity, s_up, s_value, s_date, m_id) VALUES (?, ?, ?, ?, ?, ?)";
			$query = $this->db->query($sql, array($id, $quantity, $up, $value, $date, $this->user_id));
			if($query)
				$success++;
			else
				$fail++;
		}
		return (object)array('success'=>$success, 'fail'=>$fail);
	}

	# 修改進貨紀錄
	# updateRecord(項目編號陣列, 數量陣列, 單價陣列, 金額陣列)
	# 傳回新增對象{success:成功數量, fail:失敗數量}
	function updateRecord($record_id, $quantitys, $ups, $values)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');
		$success = 0;
		$fail = 0;
		foreach($record_id as $key => $id)
		{
			$quantity = isset($quantitys[$key])?$quantitys[$key]:0;
			$up = isset($ups[$key])?$ups[$key]:0;
			$value = isset($values[$key])?$values[$key]:0;
			$sql = "UPDATE stock SET s_quantity = ?, s_up = ?, s_value = ? WHERE " . $sqlWherefield . " AND s_id = ?";
			$query = $this->db->query($sql, array($quantity, $up, $value, $id));
			if($query)
				$success++;
			else
				$fail++;
		}
		return (object)array('success'=>$success, 'fail'=>$fail);
	}

	function deleteRecord($date)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock');
		$sql = "DELETE FROM stock WHERE " . $sqlWherefield . " AND s_date = ?";
		$query = $this->db->query($sql, array($date));
		return $query;
	}

	# 取得全部進貨項目
	# getItems()
	# 傳回對象數組
	function getItems()
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item', true);

		$sql = "SELECT * FROM stock_item WHERE " . $sqlWherefield . " ORDER BY si_id ASC";
		$query = $this->db->query($sql);
		return $query->result_array();
	}

	# 取得進貨項目列表
	# getItemList(頁碼, 頁項目數量)
	# 傳回對象數組, 無對象則傳回false
	function getItemList($page, $page_item_num)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item');
		$limit_index = ($page - 1) * $page_item_num;
		$sql = "SELECT stock_item.si_id, stock_item.si_name, CONCAT(members.m_id, '#', members.m_un) AS member_info FROM stock_item LEFT JOIN members ON stock_item.m_id = members.m_id WHERE " . $sqlWherefield . " ORDER BY si_id ASC LIMIT ? , ?";
		$query = $this->db->query($sql, array($limit_index, $page_item_num));
		if($query->num_rows() > 0)
			return $query;
		return false;
	}

	# 取得進貨項目數量
	# getItemCount()
	# 傳回進貨項目數量
	function getItemCount()
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item');
		$sql = "SELECT COUNT(*) AS itemCount FROM stock_item WHERE " . $sqlWherefield;
		$query = $this->db->query($sql);
		return $query->row()->itemCount;
	}

	# 取得進貨項目
	# getStockItemDetail(項目編號)
	# 傳回項目編號及項目名稱數組, 失敗則傳回false
	function getStockItemDetail($item_id)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item');
		$sql = "SELECT * FROM stock_item WHERE " . $sqlWherefield . " AND si_id = ?";
		$query = $this->db->query($sql, array($item_id));
		if($query->num_rows() > 0)
			return $query->first_row();
		return false;
	}

	# 新增進貨項目
	# insertStockItem(項目名稱)
	# 新增成功傳回true, 失敗則傳回false
	function insertStockItem($item_name)
	{
		$sql = "INSERT INTO stock_item (si_name, m_id) VALUES (?, ?)";
		$query = $this->db->query($sql, array($item_name, $this->user_id));
		return $query;
	}

	# 修改進貨項目
	# updateStockItem(項目編號, 更改後項目名稱)
	# 執行成功傳回true, 失敗則傳回false
	function updateStockItem($item_id, $item_name)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item');
		$sql = "UPDATE stock_item SET si_name = ? WHERE " . $sqlWherefield . " AND si_id = ?";
		$query = $this->db->query($sql, array($item_name, $item_id));
		return $query;
	}

	# 刪除進貨項目
	# deleteStockItem(項目編號)
	# 執行成功傳回true, 失敗則傳回false
	function deleteStockItem($item_id)
	{
		$sqlWherefield = $this->permissionsmodel->getSqlWhereField('stock_item');
		$sql = "DELETE FROM stock_item WHERE " . $sqlWherefield . " AND si_id = ?";
		$query = $this->db->query($sql, array($item_id));
		return $query;
	}
}