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

export interface PlayDeploy {
  action: string;
  data: {
    deploy_hash: string;
    block_hash: string;
    caller_public_key: string;
    execution_type_id: number;
    contract_hash: string | null;
    entry_point_id: null;
    args: {
      contract_package_hash: {
        parsed: string;
      };
    };
    payment_amount: string;
    cost: string;
    error_message: string | null;
    status: string;
    timestamp: string;
  };
  extra: {
    deploy_hash: string;
    event_id: number;
    transform_id: number;
  } | null;
  timestamp: string;
}
