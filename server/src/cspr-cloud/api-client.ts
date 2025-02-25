import axios from 'axios';
import { Account } from './account';

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  order_by?: string[];
  order_direction?: OrderDirection;
}

export interface GetAccountsParams extends PaginationParams {
  account_hash?: string[];
}

export interface PaginatedResponse<T> {
  data: T;
  item_count: number;
  page_acount: number;
}

interface AccountHashGatter {
  getAccountHash(): string;
}

interface PublicKeySetter {
  setPublicKey(publicKey: string): void;
}

export class CSPRCloudAPIClient {
  private client: axios.AxiosInstance;

  constructor(url: string, accessKey: string) {
    this.client = axios.create({
      baseURL: url,
      headers: { authorization: accessKey },
    });
  }

  async getAccounts(params: GetAccountsParams): Promise<PaginatedResponse<Account[]>> {
    const query = new URLSearchParams(params as Record<string, string>);

    const response = await this.client.get<PaginatedResponse<Account[]>>(`/accounts?${query.toString()}`);

    const result = response.data;

    return result;
  }

  async withPublicKeys(data: (AccountHashGatter & PublicKeySetter)[]) {
    if (data.length === 0) {
      return;
    }

    const accountHashes = new Set<string>();
    for (const el of data) {
      accountHashes.add(el.getAccountHash());
    }

    const paginatedAccounts = await this.getAccounts({
      page: 1,
      page_size: accountHashes.size,
      account_hash: Array.from(accountHashes),
      order_by: ['balance'],
      order_direction: OrderDirection.DESC,
    });

    const accountHashToPublicKetMap = new Map<string, string>();
    for (const acc of paginatedAccounts.data) {
      accountHashToPublicKetMap.set(acc.account_hash, acc.public_key);
    }

    for (let i = 0; i < data.length; i++) {
      data[i].setPublicKey(null);
      const accHash = data[i].getAccountHash();
      if (accountHashToPublicKetMap.has(accHash)) {
        data[i].setPublicKey(accountHashToPublicKetMap.get(accHash));
      }
    }
  }
}
