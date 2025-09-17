import React from 'react';
import styled from 'styled-components';

import { ModalHeader, Icon, IconStatus } from '../../components';

import {
	Button,
	BodyText,
	FlexColumn,
	SvgIcon,
	SubtitleText,
	FlexRow,
} from '@make-software/cspr-design';

import HandIcon from '../../../assets/icons/hand.svg';
import TicketIcon from '../../../assets/icons/ticket.svg';
import CoinsIcon from '../../../assets/icons/two-coins.svg';
import ConnectionIcon from '../../../assets/icons/connection.svg';
import CupIcon from '../../../assets/icons/cup.svg';
import HappyIcon from '../../../assets/icons/happy.svg';
import SadIcon from '../../../assets/icons/sad.svg';
import LoadingIcon from '../../../assets/icons/loading.svg';
import { formatNumber } from '../../utils/formatters';
import { motesToCSPR } from '../../utils/currency';
import { InfoBadge } from '../info-badge/info-badge';
import { AppTheme } from '../../theme';

const StyledFlexColumn = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		textAlign: 'center',
		height: 'inherit',
		justifyContent: 'center',
	})
);

const LogoContainer = styled(FlexRow)(() => ({
	marginBottom: 12,
}));

const StyledTitle = styled(SubtitleText)(({ theme }) =>
	theme.withMedia({
		fontWeight: 700,
		color: theme.styleguideColors.contentPrimary,
	})
);

const StyledRow = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		height: '405px',
		justifyContent: 'center',
	})
);

const LoadingContainer = styled(StyledFlexColumn)(({ theme }) =>
	theme.withMedia({
		width: '300px',
	})
);

const LoadingSvgIcon = styled(SvgIcon)(() => ({
	animationName: 'spin',
	animationDuration: '5000ms',
	animationIterationCount: 'infinite',
	animationTimingFunction: 'linear',
}));

interface CustomModalContentProps {
	handleButtonAction: () => void;
	closeModal: () => void;
}

interface ModalContentProps extends CustomModalContentProps {
	title: string;
	logo: React.ReactElement;
	description: React.ReactElement | string;
	buttonText: string;
}

export const ModalContent = ({
	title,
	logo,
	description,
	buttonText,
	handleButtonAction,
	closeModal,
}: ModalContentProps) => {
	return (
		<>
			<ModalHeader onClose={closeModal} />
			<StyledFlexColumn itemsSpacing={16}>
				<LogoContainer justify={'center'}>{logo}</LogoContainer>
				<StyledTitle size={1} scale='lg'>
					{title}
				</StyledTitle>
				<BodyText size={3} scale='sm' variation={'darkGray'}>
					{description}
				</BodyText>
			</StyledFlexColumn>
			<Button color={'primaryBlue'} onClick={handleButtonAction}>
				{buttonText}
			</Button>
		</>
	);
};

export const LoadingContent = ({
	closeModal,
}: {
	closeModal: () => void;
}) => {
	return (
		<>
			<ModalHeader onClose={closeModal} />
			<StyledRow justify={'center'}>
				<LoadingContainer itemsSpacing={54} align={'center'}>
					<LoadingSvgIcon
						src={LoadingIcon}
						width={100}
						height={100}
					/>
					<StyledTitle size={1} scale='lg'>
						Waiting for the results of your play…
					</StyledTitle>
				</LoadingContainer>
			</StyledRow>
		</>
	);
};

export const WelcomeModalContent = (
	props: CustomModalContentProps
) => {
	return (
		<ModalContent
			logo={<Icon src={HandIcon} />}
			title={'Welcome!'}
			description={'Please connect your Casper account to play'}
			buttonText={'Connect Wallet'}
			{...props}
		/>
	);
};

export const BuyTicketContent = (props: CustomModalContentProps) => {
	return (
		<ModalContent
			logo={<Icon src={TicketIcon} />}
			title={'Buy a ticket'}
			description={
				<FlexColumn itemsSpacing={20} align={'center'}>
					<BodyText
						size={3}
						scale='sm'
						variation={'darkGray'}
						style={{ textAlign: 'center' }}
					>
						Buy a ticket to get a chance to win the jackpot!
					</BodyText>
					<InfoBadge
						background={AppTheme.light.borderPrimary}
						color={AppTheme.light.contentLightBlue}
						title={`1 shot = ${config.lottery_ticket_price_in_cspr} CSPR + fee`}
					/>
				</FlexColumn>
			}
			buttonText={'Play'}
			{...props}
		/>
	);
};

export const NotEnoughCsprContent = (
	props: CustomModalContentProps
) => {
	return (
		<ModalContent
			logo={<Icon src={CoinsIcon} />}
			title={'Not enough CSPR'}
			description={
				'You don’t have enough CSPR to buy a ticket. Top up your account!'
			}
			buttonText={'Request tokens'}
			{...props}
		/>
	);
};

export const SomethingWentWrongContent = (
	props: CustomModalContentProps
) => {
	return (
		<ModalContent
			logo={<Icon src={ConnectionIcon} />}
			title={'Something went wrong'}
			description={'Please refresh the page.'}
			buttonText={'Refresh'}
			{...props}
		/>
	);
};

export const DeployFailedContent = (
	props: CustomModalContentProps
) => {
	return (
		<ModalContent
			logo={<Icon src={ConnectionIcon} />}
			title={'Deploy Failed'}
			description={'Please try again.'}
			buttonText={'Play'}
			{...props}
		/>
	);
};

export const JackpotContent = (
	props: CustomModalContentProps & { prizeAmount: string }
) => {
	const prize = motesToCSPR(props.prizeAmount);
	return (
		<ModalContent
			logo={<Icon src={CupIcon} status={IconStatus.success} />}
			title={'Jackpot!'}
			description={`Congratulations, you have won ${formatNumber(
				prize,
				{ precision: 2, minPrecision: 0 }
			)} CSPR!`}
			buttonText={'Play More'}
			{...props}
		/>
	);
};

export const YouWonContent = (
	props: CustomModalContentProps & { prizeAmount: string }
) => {
	const prize = motesToCSPR(props.prizeAmount);
	return (
		<ModalContent
			logo={<Icon src={HappyIcon} status={IconStatus.success} />}
			title={'You Won!'}
			description={`Congratulations, you have won ${formatNumber(
				prize
			)} CSPR!`}
			buttonText={'Play More'}
			{...props}
		/>
	);
};

export const UnluckyContent = (props: CustomModalContentProps) => {
	return (
		<ModalContent
			logo={<Icon src={SadIcon} status={IconStatus.error} />}
			title={'Unlucky this Time'}
			description={'You did not win this time. Try again!'}
			buttonText={'Try Again'}
			{...props}
		/>
	);
};
