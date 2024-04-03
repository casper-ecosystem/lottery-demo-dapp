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
