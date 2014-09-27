<?php
class AccountModel extends CI_Model {

	function __construct()
	{
		parent::__construct();
	}	
	
	function login_info()
	{
		$login_user = $this->session->userdata('username');
		$logged_in = $this->session->userdata('logged_in');
		$user_cookie = $this->input->cookie('user_login_info', true);
		$result = array(
			'login_user' => $login_user,
			'login_status' => $logged_in,
			'login_rememberme' => $user_cookie?true:false,
		);
		return $result;
	}

	# 查詢帳戶編號
	# getMemberId(使用者名稱)
	# 存在傳回用戶編號, 不存在傳回false
	function getMemberId($username)
	{
		$sql = "SELECT m_id FROM members WHERE m_un = ?";
		$query = $this->db->query($sql, array($username));
		if($query->num_rows() > 0)
		{
			$row = $query->row_array();
			return (int)$row['m_id'];
		}
		else
			return false;
	}

	# 取得帳戶權限代碼
	# getMemberPermissions(用戶編號)
	# 傳回權限代碼, 失敗傳回false
	function getMemberPermissions($m_id)
	{
		$sql = "SELECT m_permissions FROM members WHERE m_id = ?";
		$query = $this->db->query($sql, array($m_id));
		if($query->num_rows() > 0)
		{
			$row = $query->row_array();
			return $row['m_permissions'];
		}
		else
			return false;
	}
	
	# 驗證帳戶是否存在
	# verify(使用者名稱, 密碼)
	# 存在傳回用戶編號, 不存在傳回false
	function verify($username, $password)
	{
		$sql = "SELECT * FROM members WHERE m_un = ? AND m_pw = ?";
		$query = $this->db->query($sql, array($username, $password));
		if($query->num_rows() > 0)
		{
			$row = $query->row_array();
			return $row['m_id'];
		}		
		else
			return false;
	}
	
	# 安全查詢帳戶資料
	# safe_info(使用者名稱, 密碼)
	# 存在傳回用戶資料, 不存在傳回false
	function safe_info($username, $password)
	{
		$sql = "SELECT * FROM members WHERE m_un = ? AND m_pw =?";
		$query = $this->db->query($sql, array($username, $password));
		if($query->num_rows() > 0)
		{
			$row = $query->row_array();
			return $row;
		}
		else
			return false;
	}
}