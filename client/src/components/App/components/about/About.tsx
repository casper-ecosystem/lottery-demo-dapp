import styled from 'styled-components';
import visual from '../../../../images/about/whitepaper-visual.png';

const StyledWhitepaper = styled.div(({ theme }) =>
	theme.withMedia({
		width: '974px',
		margin: '48px auto',
		backgroundColor: '#FFFFFF',
		borderRadius: '4px',
		boxShadow: '0px 2px 4px 0px #84868C1F',
		padding: '60px 100px 100px 100px',
		h3: {
			marginBlock: '1em',
		},
		img: {
			width: '100%',
		},
	})
);

const StyledAnchor = styled.a(({ theme }) =>
	theme.withMedia({
		color: theme.fillPrimaryBlue + '!important',
		borderBottom: 'solid 2px',
	})
);

const StyledList = styled.ul(({ theme }) =>
	theme.withMedia({
		li: {
			'&::marker': {
				color: theme.fillPrimaryBlue,
			},
		},
	})
);

export default function About() {
	return (
		<StyledWhitepaper>
			<h3>About</h3>
			<p>
				This is an example decentralized application, or dApp, built on the Casper Network, which is a layer 1
				proof-of-stake (PoS) blockchain that prioritizes security and decentralization. Casper was built with developer
				needs in mind and supports features such as upgradable smart contracts or multi-signature transactions on the
				protocol level. Casper smart contracts are run in a WASM virtual machine creating a possibility to use a wider
				variety of languages for smart contract development.
			</p>
			<p>
				This application was created to onboard software engineers to the Casper blockchain and the Web3 architecture in
				general. Unlike traditional Web2 applications, in Web3, users may interact with blockchain directly. It changes
				the traditional paradigm of how information flows between users and the application and forces the application
				to observe the network activity and react correspondingly.
			</p>
			<p>
				To ease the integration, this example was developed with the help of higher-level abstractions that address
				those specific challenges of Web3 development and elevate the developer experience.
			</p>
			<img src={visual} />
			<p>
				<StyledAnchor href='https://cspr.click/' target='_blank'>
					CSPR.click
				</StyledAnchor>
				&nbsp;is a Web3 authentication layer that covers the end-user interaction with the blockchain. It provides
				integration with all the wallets in the Casper Ecosystem and greets users with a well-known Single-Sign-On like
				experience.
			</p>
			<p>
				<StyledAnchor href='https://odra.dev/' target='_blank'>
					Odra
				</StyledAnchor>
				&nbsp;is a smart contract framework written in Rust that abstracts the chain-specific details behind a familiar
				OOP interface. Odra encourages rapid development and clean, pragmatic design.
			</p>
			<p>
				<StyledAnchor href='https://cspr.cloud/' target='_blank'>
					CSPR.cloud
				</StyledAnchor>
				&nbsp;is an enterprise-grade middleware layer for the Casper Network. It observes and indexes the network
				activity and provides access to it via a scalable REST API and real-time WebSocket subscriptions. For
				lower-level interactions, CSPR.cloud gives access to the native Casper Node RPC API.
			</p>
			<p>Learn more about CSPR.click, CSPR.cloud, Odra, and the Casper Network:</p>
			<StyledList>
				<li>
					<StyledAnchor href='https://docs.cspr.click/' target='_blank'>
						https://docs.cspr.click
					</StyledAnchor>
				</li>
				<li>
					<StyledAnchor href='https://docs.cspr.cloud/' target='_blank'>
						https://docs.cspr.cloud
					</StyledAnchor>
				</li>
				<li>
					<StyledAnchor href='https://github.com/odradev/odra/' target='_blank'>
						https://github.com/odradev/odra
					</StyledAnchor>
				</li>
				<li>
					<StyledAnchor href='https://casper.network/' target='_blank'>
						https://casper.network
					</StyledAnchor>
				</li>
			</StyledList>
		</StyledWhitepaper>
	);
}
