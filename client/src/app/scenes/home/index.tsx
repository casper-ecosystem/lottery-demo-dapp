import styled from 'styled-components';
import { PageLayout, Modal } from '../../components';
import JackpotInfo from './JackpotInfo';
import Plays from './Plays';

const StyledPageLayout = styled(PageLayout)(() => ({
	marginTop: 60,
}));

const HomeScene = () => {
	return (
		<>
			<JackpotInfo />
			<StyledPageLayout title={'Casper Lottery'}>
				<Plays />
				<Modal isOpen={false} />
			</StyledPageLayout>
		</>
	);
};

export default HomeScene;
