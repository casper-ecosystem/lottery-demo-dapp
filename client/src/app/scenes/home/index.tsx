import PageLayout from '../../components/page-layout/page-layout';
import styled from 'styled-components';
import JackpotInfo from './JackpotInfo';
import Plays from './Plays';
import Modal from '../../components/modal/modal';
// @ts-ignore
import CupIcon from '../../../assets/icons/cup.svg';

const StyledPageLayout = styled(PageLayout)(() => ({
	marginTop: 60,
}));

const HomeScene = () => {
	return (
		<>
			<JackpotInfo />
			<StyledPageLayout title={'Casper Lottery'}>
				<Plays />
				<Modal isOpen />
			</StyledPageLayout>
		</>
	);
};

export default HomeScene;
