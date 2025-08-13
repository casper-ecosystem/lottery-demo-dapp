import styled from 'styled-components';
import { PageLayout } from '../../components';
import JackpotInfo from './JackpotInfo';
import Plays from './Plays';
import Modal from '../../components/play-modal/modal';
import { useCallback, useState } from 'react';
import { PlaysProvider } from '../../services/providers/PlaysContext';

const StyledPageLayout = styled(PageLayout)(() => ({
	marginTop: 60,
}));

const HomeScene = () => {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleOpenModal = useCallback(
		(value: boolean) => setShowModal(value),
		[]
	);

	return (
		<PlaysProvider>
			<JackpotInfo setModalOpen={handleOpenModal} />
			<StyledPageLayout title={'Casper Lottery'}>
				<Plays setModalOpen={handleOpenModal} />
				<Modal isOpen={showModal} setModalOpen={handleOpenModal} />
			</StyledPageLayout>
		</PlaysProvider>
	);
};

export default HomeScene;
