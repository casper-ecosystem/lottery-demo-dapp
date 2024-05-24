import styled from 'styled-components';
import { PageLayout } from '../../components';
import JackpotInfo from './JackpotInfo';
import Plays from './Plays';
import Modal from '../play-modal/modal';
import { useState } from 'react';

const StyledPageLayout = styled(PageLayout)(() => ({
	marginTop: 60,
}));

const HomeScene = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	return (
		<>
			<JackpotInfo setModalOpen={setShowModal} />
			<StyledPageLayout title={'Casper Lottery'}>
				<Plays setModalOpen={setShowModal} />
				<Modal isOpen={showModal} setModalOpen={setShowModal} />
			</StyledPageLayout>
		</>
	);
};

export default HomeScene;
