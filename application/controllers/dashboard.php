<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Dashboard extends CI_Controller {

	public function index()
	{
		$this->load->model('accountmodel');
		$result = $this->accountmodel->login_info();
		if($result['login_status'])
		{
			$data = array(
				'sign_url' => 'javascript:logout();',
				'sign_txt' => 'Logout',
			);
		}
		else
		{
			$data = array(
				'sign_url' => 'javascript:login_page();',
				'sign_txt' => 'Login',
			);
		}
		$this->parser->parse('dashboard', $data);
	}
}