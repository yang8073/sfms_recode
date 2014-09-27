<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Account extends CI_Controller {

	# 獲取登入資訊
	# api/account/login_data
	# {"login_user":username|false, "login_status":true|false}
	public function login_data()
	{
		$this->load->model('accountmodel');
		$result = $this->accountmodel->login_info();
		echo json_encode($result);
	}
	
	# 登入
	# api/account/login/使用者名稱/密碼
	# true|false
	public function login($username, $password, $rememberme = 'false')
	{
		$this->load->model('accountmodel');
		if($this->accountmodel->verify($username, $password))
		{
			$login_data = array(
				'username' => $username,
				'logged_in' => true,
			);
			$this->session->set_userdata($login_data);
			
			if($rememberme == 'true')
			{
				$this->load->helper('cookie');
				$user_cookie = array(
					'name' => 'user_login_info',
					'value' => $username.','.$password,
					'expire' => '1209600',
				);						
				$this->input->set_cookie($user_cookie);
			}
			echo json_encode(true);
		}
		else
			echo json_encode(false);
	}
	
	# 登出
	public function logout()
	{
		$this->load->helper('cookie');
		$login_data = array(
			'username' => '',
			'logged_in' => false,
		);
		$this->session->unset_userdata($login_data);
		delete_cookie('user_login_info');
	}
}