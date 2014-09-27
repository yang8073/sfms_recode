<?php
class PermissionsModel extends CI_Model {

	private $user_id = 0, 			//用戶編號
			$user_permissions = -1;	//用戶權限

	function __construct()
	{
		parent::__construct();
		$this->load->model('accountmodel');
		$login_info = $this->accountmodel->login_info();
		$this->user_id = $this->accountmodel->getMemberId($login_info['login_user']);
		$this->user_permissions = $this->accountmodel->getMemberPermissions($this->user_id);
	}

	# 取得SQL WHERE 篩選語句
	# getSqlWhereField(表名稱|false, 限定個人權限|false)
	# user_permissions = 0則最大權限傳回1
	# user_permissions = 1則為普通權限傳回"m_id = {user_id}"篩選語句
	# 限定個人權限則無視user_permissions傳回"m_id = {user_id}"篩選語句
	# 指定talbe名則於篩選語句欄位m_id前加上table名傳回篩選語句 ex."table_name.m_id = {user_id}"
	function getSqlWhereField($table = false, $personalPermissions = false)
	{
		$result = '';
		switch($this->user_permissions)
		{
			case 0:
				$result = "1";
				break;
			case 1:
				$result = "m_id = " . $this->user_id;
				break;
		}
		if($personalPermissions)
			$result = "m_id = " . $this->user_id;
		if($table && $this->user_permissions != 0)
			$result = $table . "." . $result;
		return $result;
	}
}