import { Router, Request, Response } from 'express';
import { Account } from '../models/account';

const accountsRouter = Router();
//let accounts: Account[] = [];
accountsRouter.get('/:account_hash', (req: Request, res: Response) => {
    let accountHash = req.params.account_hash;
    const account: Account = {
        account_hash: accountHash,
        balance: 900090090090,
        main_purse_uref: "main_purse_uref",
        public_key: "public_key"
    };

    if (!account) {
        res.status(404).send('Account not found');
    } else {
        res.json(account);
    }
});
export default accountsRouter;
