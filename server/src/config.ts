import * as process from 'process';
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  httpPort: number;
  csprCloudApiUrl: string;
  csprCloudStreamingUrl: string;
  csprCloudAccessKey: string;
  lotteryContractPackageHash: string;
  dbURI: string;
  clientURL: string[];
}

export const config: Config = {
  httpPort: process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3001,
  csprCloudApiUrl: process.env.CSPR_CLOUD_URL as string,
  csprCloudStreamingUrl: process.env.CSPR_CLOUD_STREAMING_URL as string,
  csprCloudAccessKey: process.env.CSPR_CLOUD_ACCESS_KEY as string,
  lotteryContractPackageHash: process.env.LOTTERY_CONTRACT_PACKAGE_HASH as string,
  dbURI: process.env.DB_URI as string,
  clientURL: process.env.CLIENT_URL ? (process.env.CLIENT_URL as string).split(',') : [],
};
