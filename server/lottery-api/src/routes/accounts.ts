import { Router, Request, Response } from 'express';

import { Account } from '../models/account';
import axios from 'axios';
import url from 'node:url';

const accountsRouter = Router();
//let accounts: Account[] = [];
accountsRouter.get('/:account_hash', async (req: Request, res: Response) => {
    let accountHash = req.params.account_hash;
    const headers = { Authorization: `${process.env.CSPR_CLOUD_API_KEY}` };
    let urlPath = process.env.CSPR_CLOUD_BASE_URL || "";
    var url = new URL(urlPath);
    url.pathname = '/accounts/' + accountHash;
    // console.log(headers, url);
    try {
        const response = await axios.get(url.href, { headers });
        res.json(response.data);
    } catch (exception) {
        process.stderr.write(`ERROR received from ${url}: ${exception}\n`);
    }
});
export default accountsRouter;

