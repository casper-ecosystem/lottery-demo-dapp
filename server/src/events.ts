export interface PlayEventPayload {
  is_jackpot: boolean;
  play_id: string;
  player: string;
  prize_amount: string;
  jackpot_amount: string;
  round_id: number;
  timestamp: number;
}

export interface Event<T> {
  action: string;
  data: {
    contract_package_hash: string;
    contract_hash: string;
    name: string;
    data: T;
  };
  extra: {
    deploy_hash: string;
    event_id: number;
    transform_id: number;
  };
  timestamp: string;
}
