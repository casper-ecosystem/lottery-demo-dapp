export interface Account {
  account_hash: string;
  balance: number;
  main_purse_uref: string | null;
  public_key: string | null;
}
