type GlobalConfig = {
	lottery_app_contract_package_hash: string;
	lottery_play_payment_amount: string;
	lottery_api_url: string;
	lottery_api_ws_url: string;
	cspr_click_app_name: string;
	cspr_click_app_id: string;
	cspr_live_url: string;
};

declare const config: GlobalConfig;

declare module '*.svg';

declare module '*.png';
