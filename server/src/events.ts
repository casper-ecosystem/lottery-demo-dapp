export interface PlayEventPayload {
  is_jackpot: boolean;
  play_id: string;
  player: string;
  prize: string;
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

export function isEvent<T>(object: any, payloadChecker: (payload: any) => payload is T): object is Event<T> {
  return (
    typeof object === 'object' &&
    typeof object.action === 'string' &&
    typeof object.data === 'object' &&
    typeof object.data.contract_package_hash === 'string' &&
    typeof object.data.contract_hash === 'string' &&
    typeof object.data.name === 'string' &&
    payloadChecker(object.data.data) &&
    typeof object.extra === 'object' &&
    typeof object.extra.deploy_hash === 'string' &&
    typeof object.extra.event_id === 'number' &&
    typeof object.extra.transform_id === 'number' &&
    typeof object.timestamp === 'string'
  );
}

export function isPlayEventPayload(object: any): object is PlayEventPayload {
  return (
    typeof object === 'object' &&
    typeof object.is_jackpot === 'boolean' &&
    typeof object.play_id === 'string' &&
    typeof object.player === 'string' &&
    typeof object.prize === 'string' &&
    typeof object.round_id === 'number' &&
    typeof object.timestamp === 'number'
  );
}

export function isPlayDeploy(object: any): object is PlayDeploy {
  return (
    typeof object.action === 'string' &&
    typeof object.timestamp === 'string' &&
    typeof object.data === 'object' &&
    object.data !== null &&
    typeof object.data.deploy_hash === 'string' &&
    typeof object.data.block_hash === 'string' &&
    typeof object.data.caller_public_key === 'string' &&
    typeof object.data.execution_type_id === 'number' &&
    (typeof object.data.contract_hash === 'string' || object.data.contract_hash === null) &&
    object.data.entry_point_id === null &&
    typeof object.data.args === 'object' &&
    object.data.args !== null &&
    typeof object.data.args.contract_package_hash === 'object' &&
    object.data.args.contract_package_hash !== null &&
    typeof object.data.args.contract_package_hash.parsed === 'string' &&
    typeof object.data.payment_amount === 'string' &&
    typeof object.data.cost === 'string' &&
    (typeof object.data.error_message === 'string' || object.data.error_message === null) &&
    typeof object.data.status === 'string' &&
    typeof object.data.timestamp === 'string' &&
    (object.extra === null ||
      (typeof object.extra === 'object' &&
        typeof object.extra.deploy_hash === 'string' &&
        typeof object.extra.event_id === 'number' &&
        typeof object.extra.transform_id === 'number'))
  );
}
