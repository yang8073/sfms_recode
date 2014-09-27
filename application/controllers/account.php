<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Account extends CI_Controller {

	public function index()
	{
		$this->load->helper('url');
		$this->load->helper('cookie');
		/* 檢測Cookie */
		$user_cookie = $this->input->cookie('user_login_info', true);
		if($user_cookie)
		{
			$this->fast_login($user_cookie);
		}
		
		/* 檢測Session */
		$logged_in = $this->session->userdata('logged_in');		
		if(!$logged_in)
		{
			redirect('/account/login');
		}
		else
		{
			$this->profile();
		}
	}

	function profile()
	{
		$this->load->view('account_profile');
	}
	
	# 登入
	# account/login
	public function login()
	{
		$this->load->view('account_login');
	}
	
	/* Function */
	# Cookie快速登入
	function fast_login($user_cookie)
	{
		$exstr = explode(',',$user_cookie);
		$username = $exstr[0];
		$password = $exstr[1];
		$this->load->model('accountmodel');
		if($this->accountmodel->verify($username, $password))
		{
			$login_data = array(
				'username' => $username,
				'logged_in' => true,
			);
			$this->session->set_userdata($login_data);
		}
	}
}