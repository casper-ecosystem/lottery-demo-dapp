import React from 'react';
import styled from 'styled-components';
import { Welcome } from './Welcome';
import Modal from './Modal';
import Landing from './Landing';
import { PlaysProvider } from './PlaysContext';

const ContentContainer = styled.div(({ theme }) =>
	theme.withMedia({
		maxWidth: ['100%', '720px', '960px'],
		padding: '0 12px',
		margin: '0 auto',
	})
);

export interface SetModalInViewProps {
	setModalInView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Home() {
	const [modalInView, setModalInView] = React.useState<boolean>(false);
	return (
		<>
			<Welcome setModalInView={setModalInView} />
			<PlaysProvider>
				<ContentContainer>
					<Landing setModalInView={setModalInView} />
				</ContentContainer>
				<Modal modalInView={modalInView} setModalInView={setModalInView} />
			</PlaysProvider>
		</>
	);
}
