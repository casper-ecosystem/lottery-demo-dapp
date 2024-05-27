import React from 'react';
import styled, { useTheme } from 'styled-components';
import ReactModal from 'react-modal';
import { FlexColumn } from '@make-software/cspr-ui';

import useManagePlay from '../../services/hooks/use-manage-play';
import ModalState from './ModalState';

const modalStyles = {
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	border: 'none',
	borderRadius: '12px',
	padding: '32px 24px 24px 24px',
	top: '50%',
	transform: 'translate(-50%, -50%)',
};

const ModalContainer = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: ['300px', '400px', '400px', '496px'],
		height: ['400px', '380px', '380px', '456px'],
		background: theme.styleguideColors.backgroundPrimary,
		borderColor: theme.styleguideColors.backgroundPrimary,
	})
);

export interface ModalProps {
	isOpen: boolean;
	setModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ isOpen, setModalOpen }: ModalProps) => {
	const theme = useTheme();
	const {
		activeAccountWithBalance,
		playResult,
		awaitingPlayResult,
		clientErrorOccurred,
		connectWallet,
		initiatePlay,
	} = useManagePlay();

	const modalStyle = {
		overlay: {
			backgroundColor: '#0E1126A0',
			zIndex: 2,
		},
		content: {
			...modalStyles,
			...{
				backgroundColor: theme.styleguideColors.backgroundPrimary,
				borderColor: theme.styleguideColors.backgroundPrimary,
			},
		},
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			{isOpen && (
				<ReactModal
					isOpen={isOpen}
					style={modalStyle}
					portalClassName={'portal'}
				>
					<ModalContainer>
						<ModalState
							connectWallet={connectWallet}
							initiatePlay={initiatePlay}
							clientErrorOccurred={clientErrorOccurred}
							awaitingPlayResult={awaitingPlayResult}
							activeAccountWithBalance={activeAccountWithBalance}
							playResult={playResult}
							closeModal={closeModal}
						/>
					</ModalContainer>
				</ReactModal>
			)}
		</>
	);
};

export default Modal;
