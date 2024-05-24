import {
	BodyText,
	Button,
	ModalHeader,
	SubtitleText,
	FlexColumn,
	FlexRow,
	SvgIcon,
} from '@make-software/cspr-ui';
import React from 'react';
import styled from 'styled-components';
import Icon, { IconStatus } from '../icon/icon';
import Badge, { BadgeVariation } from '../badge/badge';

// @ts-ignore
import HandIcon from '../../../assets/icons/hand.svg';
// @ts-ignore
import TicketIcon from '../../../assets/icons/ticket.svg';
// @ts-ignore
import CoinsIcon from '../../../assets/icons/two-coins.svg';
// @ts-ignore
import ConnectionIcon from '../../../assets/icons/connection.svg';
// @ts-ignore
import CupIcon from '../../../assets/icons/cup.svg';
// @ts-ignore
import HappyIcon from '../../../assets/icons/happy.svg';
// @ts-ignore
import SadIcon from '../../../assets/icons/sad.svg';
// @ts-ignore
import LoadingIcon from '../../../assets/icons/loading.svg';

const StyledFlexColumn = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		textAlign: 'center',
		height: 'inherit',
	})
);

const LogoContainer = styled(FlexRow)(({ theme }) => ({
	marginBottom: 12,
}));

const StyledTitle = styled(SubtitleText)(({ theme }) =>
	theme.withMedia({
		fontWeight: 700,
		color: theme.styleguideColors.contentPrimary,
	})
);

const LoadingContainer = styled(StyledFlexColumn)(({ theme }) =>
	theme.withMedia({
		width: '300px',
	})
);

const LoadingSvgIcon = styled(SvgIcon)(({ theme }) => ({
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
			<FlexRow justify={'center'}>
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
			</FlexRow>
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
					<Badge
						label={'1 shot = 5 CSPR'}
						variation={BadgeVariation.light}
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

export const JackpotContent = (props: CustomModalContentProps) => {
	return (
		<ModalContent
			logo={<Icon src={CupIcon} status={IconStatus.success} />}
			title={'Jackpot!'}
			description={
				'Congratulations, you have won the jackpot of 20,000 CSPR!'
			}
			buttonText={'Play More'}
			{...props}
		/>
	);
};

export const YouWonContent = (props: CustomModalContentProps) => {
	return (
		<ModalContent
			logo={<Icon src={HappyIcon} status={IconStatus.success} />}
			title={'You Won!'}
			description={'Congratulations, you have won 1,000 CSPR!'}
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
