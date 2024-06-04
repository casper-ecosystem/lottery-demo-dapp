import styled from 'styled-components';
import {
	BodyText,
	Button,
	FlexBox,
	FlexColumn,
	FlexRow,
	HeaderText,
	SvgIcon,
	Text,
} from '../../components';
import Badge, { BadgePadding } from '../../components/badge/badge';
import JackpotSvg from '../../../assets/images/jackpot.svg';
import ShineImg from '../../../assets/images/shine.png';
import { useGetTableData } from '../../services/hooks/use-get-table-data';
import { motesToCSPR } from '../../utils/currency';
import { Round } from '../../types';

const HomeHeaderContainer = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		background: theme.styleguideColors.backgroundQuaternary,
		width: '100%',
		justifyContent: 'center',
		padding: '20px 0 28px',
		overflow: 'hidden',
	})
);

const HomeInnerContainer = styled(FlexBox)(({ theme }) =>
	theme.withMedia({
		flexDirection: ['column-reverse', 'column-reverse', 'row', 'row'],
		justifyContent: 'space-between',
		alignItems: 'center',
		width: theme.maxWidth,
		padding: ['50px 0 10px', '80px 0 30px', '112px 56px', '112px 0'],
	})
);

const LeftContainer = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: ['70%', '70%', '480px', '480px'],
		marginTop: [25, 50, 0, 0],
		alignItems: ['center', 'center', 'unset', 'unset'],
	})
);

const TitleText = styled(HeaderText)(({ theme }) =>
	theme.withMedia({
		color: '#DADCE5',
		textAlign: ['center', 'center', 'left', 'left'],
	})
);

const IntroText = styled(BodyText)(({ theme }) =>
	theme.withMedia({
		textAlign: ['center', 'center', 'left', 'left'],
	})
);

const StyledButton = styled(Button)(({ theme }) =>
	theme.withMedia({
		width: ['240px', '240px', '240px', '240px'],
		marginTop: [25, 48, 48, 48],
	})
);

const RightContainer = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: ['480px', '480px', '410px', '480px'],
		position: 'relative',
	})
);

const ShineBg = styled.img(({ theme }) => ({
	position: 'absolute',
	top: '0',
	left: '0',
	transform: 'translate(-23%, -35%)',
	width: '800px',
}));

const JackpotText = styled(Text)(({ theme }) => ({
	background: '-webkit-linear-gradient(#ffffff, #b4c3ed)',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
	filter: 'drop-shadow(0px 6px 0px #0a2ebf)',
	fontSize: '47px',
	fontWeight: 500,
}));

const JackpotTitle = styled(JackpotText)(({ theme }) => ({
	fontSize: '67px',
	fontWeight: 900,
}));

interface JackpotInfoProps {
	setModalOpen: (isOpen: boolean) => void;
}

const JackpotInfo = ({ setModalOpen }: JackpotInfoProps) => {
	const { data: latestRounds } = useGetTableData<Round>({
		url: '/rounds/latest',
	});

	const handlePlay = () => {
		setModalOpen(true);
	};

	const jackpotSum = motesToCSPR(latestRounds?.jackpotAmount || '0');

	return (
		<HomeHeaderContainer>
			<HomeInnerContainer>
				<LeftContainer itemsSpacing={8}>
					<TitleText scale={'lg'} size={3}>
						Your Chance to Win Big!
					</TitleText>
					<IntroText scale={'md'} size={3} variation={'darkGray'}>
						Don&apos;t miss out on your shot at winning exciting
						prizes – take part in the lottery now and let luck be on
						your side!
					</IntroText>
					<Badge label={'1 shot = 5 CSPR'} />
					<StyledButton
						height={'36'}
						color={'primaryRed'}
						onClick={handlePlay}
					>
						Play Now
					</StyledButton>
				</LeftContainer>
				<RightContainer align={'center'} itemsSpacing={12}>
					<ShineBg src={ShineImg} />
					<SvgIcon src={JackpotSvg} width={218} height={58} />
					<FlexRow itemsSpacing={20} align={'baseline'}>
						<JackpotTitle>{jackpotSum}</JackpotTitle>
						<JackpotText>CSPR</JackpotText>
					</FlexRow>
					<Badge
						label={`Current Plays: ${latestRounds?.playsNum || 0}`}
						padding={BadgePadding.big}
					/>
				</RightContainer>
			</HomeInnerContainer>
		</HomeHeaderContainer>
	);
};

export default JackpotInfo;
