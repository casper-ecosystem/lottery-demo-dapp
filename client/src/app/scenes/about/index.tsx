import styled from 'styled-components';
import {
	BodyText,
	FlexColumn,
	FlexRow,
	HeaderText,
	PageTile,
} from '@make-software/cspr-ui';
import { PageLayout } from '../../components';
// @ts-ignore
import CsprClickSchemeImg from '../../../assets/images/cspr-click-scheme.png';

const StyledPageTile = styled(PageTile)(() => ({
	marginTop: '48px',
	padding: '60px 100px 100px',
}));

const StyledImg = styled.img(() => ({
	width: '900px',
	marginBottom: '32px',
}));

const StyledA = styled.a(() => ({
	textDecoration: 'underline',
}));

const AboutScene = () => {
	return (
		<PageLayout title={'About'}>
			<StyledPageTile>
				<FlexColumn itemsSpacing={24}>
					<HeaderText size={4} scale={'sm'}>
						About
					</HeaderText>
					<FlexColumn itemsSpacing={20}>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							This is an example decentralized application, or dApp,
							built on the Casper Network, which is a layer 1
							proof-of-stake (PoS) blockchain that prioritizes
							security and decentralization. Casper was built with
							developer needs in mind and supports features such as
							upgradable smart contracts or multi-signature
							transactions on the protocol level. Casper smart
							contracts are run in a WASM virtual machine creating a
							possibility to use a wider variety of languages for
							smart contract development.
						</BodyText>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							This application was created to onboard software
							engineers to the Casper blockchain and the Web3
							architecture in general. Unlike traditional Web2
							applications, in Web3, users may interact with
							blockchain directly. It changes the traditional paradigm
							of how information flows between users and the
							application and forces the application to observe the
							network activity and react correspondingly.
						</BodyText>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							To ease the integration, this example was developed with
							the help of higher-level abstractions that address those
							specific challenges of Web3 development and elevate the
							developer experience.
						</BodyText>
						<FlexRow justify={'center'}>
							<StyledImg src={CsprClickSchemeImg} />
						</FlexRow>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							<StyledA href={'https://cspr.click/'} target='_blank'>
								CSPR.click
							</StyledA>{' '}
							is a Web3 authentication layer that covers the end-user
							interaction with the blockchain. It provides integration
							with all the wallets in the Casper Ecosystem and greets
							users with a well-known Single-Sign-On like experience.
						</BodyText>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							<StyledA href={'https://odra.dev/'} target='_blank'>
								Odra
							</StyledA>{' '}
							is a smart contract framework written in Rust that
							abstracts the chain-specific details behind a familiar
							OOP interface. Odra encourages rapid development and
							clean, pragmatic design.
						</BodyText>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							<StyledA href={'https://cspr.cloud/'} target='_blank'>
								CSPR.cloud
							</StyledA>{' '}
							is an enterprise-grade middleware layer for the Casper
							Network. It observes and indexes the network activity
							and provides access to it via a scalable REST API and
							real-time WebSocket subscriptions. For lower-level
							interactions, CSPR.cloud gives access to the native
							Casper Node RPC API.
						</BodyText>
						<BodyText size={3} scale={'md'} variation={'darkGray'}>
							Learn more about CSPR.click, CSPR.cloud, Odra, and the
							Casper Network:
						</BodyText>
						<ul>
							<li>
								<StyledA
									href={'https://docs.cspr.click'}
									target='_blank'
								>
									https://docs.cspr.click
								</StyledA>
							</li>
							<li>
								<StyledA
									href={'https://docs.cspr.cloud'}
									target='_blank'
								>
									https://docs.cspr.cloud
								</StyledA>
							</li>
							<li>
								<StyledA
									href={'https://github.com/odradev/odra'}
									target='_blank'
								>
									https://github.com/odradev/odra
								</StyledA>
							</li>
							<li>
								<StyledA
									href={'https://casper.network'}
									target='_blank'
								>
									https://casper.network
								</StyledA>
							</li>
						</ul>
					</FlexColumn>
				</FlexColumn>
			</StyledPageTile>
		</PageLayout>
	);
};

export default AboutScene;
