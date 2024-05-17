import React from 'react';
import styled, { useTheme } from 'styled-components';
import ReactModal from 'react-modal';
import { FlexColumn } from '@make-software/cspr-ui';
import {BuyTicketContent} from './modal-content';

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
		width: ['261px', '400px', '496px'],
		height: ['240px', '380px', '456px'],
		background: theme.styleguideColors.backgroundPrimary,
		borderColor: theme.styleguideColors.backgroundPrimary,
	})
);

export interface ModalProps {
	isOpen: boolean;
}

export const Modal = ({ isOpen }: ModalProps) => {
	const theme = useTheme();

	const modalStyle = {
		overlay: {
			backgroundColor: '#0E1126A0',
			zIndex: 15,
		},
		content: {
			...modalStyles,
			...{
				backgroundColor: theme.styleguideColors.backgroundPrimary,
				borderColor: theme.styleguideColors.backgroundPrimary,
			},
		},
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
						<BuyTicketContent />
					</ModalContainer>
				</ReactModal>
			)}
		</>
	);
};

export default Modal;
