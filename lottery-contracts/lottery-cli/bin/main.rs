use lottery_contracts::lottery::{Lottery, LotteryInitArgs};

use odra::{
    casper_types::{U512},
    host::{Deployer, HostEnv},
};
use odra_cli::OdraCli;

const ONE_CSPR_IN_MOTES: u64 = 1_000_000_000;

pub struct DeployScript;
impl odra_cli::deploy::DeployScript for DeployScript {
    fn deploy(
        &self,
        env: &HostEnv,
        container: &mut odra_cli::DeployedContractsContainer,
    ) -> Result<(), odra_cli::deploy::Error> {
        env.set_gas(500_000_000_000);
        let token = Lottery::try_deploy(
            env,
            LotteryInitArgs {
                lottery_fee: U512::from(1 * ONE_CSPR_IN_MOTES),
                ticket_price: U512::from(50 * ONE_CSPR_IN_MOTES),
                max_consolation_prize: U512::from(50 * ONE_CSPR_IN_MOTES),
                jackpot_probability: 10,
                consolation_prize_probability: 25,
            },
        )?;
        container.add_contract(&token)?;
        Ok(())
    }
}

pub fn main() {
    OdraCli::new()
        .about("Lottery Demo dApp. The CLI.")
        .deploy(DeployScript)
        .contract::<Lottery>()
        .build()
        .run();
}
