import React from 'react';
import styled, { useTheme } from 'styled-components';
import ReactModal from 'react-modal';
import { FlexColumn } from '@make-software/cspr-design';

import ModalState from './ModalState';

const modalStyles = {
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	border: 'none',
	padding: '16px 24px 24px 24px',
	top: '50%',
	transform: 'translate(-50%, -50%)',
};

const ModalContainer = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: ['300px', '496px', '748px', '748px'],
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
				borderTop: '4px solid rgb(230, 51, 42)',
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
					ariaHideApp={false}
				>
					<ModalContainer>
						<ModalState closeModal={closeModal} />
					</ModalContainer>
				</ReactModal>
			)}
		</>
	);
};

export default Modal;
