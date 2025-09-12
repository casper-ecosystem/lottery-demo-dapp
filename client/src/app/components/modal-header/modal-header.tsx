import React from 'react';
import styled from 'styled-components';
import { ThemeModeType } from '@make-software/csprclick-ui';
import CloseIcon from '../../../assets/icons/close.svg';
import { FlexRow, SvgIcon } from '@make-software/cspr-design';

const ModalHeaderContainer = styled(FlexRow)<{
	marginBottom?: string;
}>(({ theme, marginBottom }) =>
	theme.withMedia({
		marginBottom: marginBottom ? marginBottom : '40px',
	})
);

const CloseButton = styled.div(() => ({
	cursor: 'pointer',
	padding: '0 10px',
}));

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
	path: {
		stroke: theme.styleguideColors.contentBlue,
	},
}));

export interface ModalHeaderProps {
	onClose?: () => void;
	headerLogo?: React.ReactElement;
	themeMode?: ThemeModeType;
	marginBottom?: string;
}

export const ModalHeader = ({
	onClose,
	headerLogo,
	marginBottom,
}: ModalHeaderProps) => {
	return (
		<ModalHeaderContainer
			justify={headerLogo ? 'space-between' : 'end'}
			align='center'
			marginBottom={marginBottom}
		>
			{headerLogo && headerLogo}
			{onClose && (
				<CloseButton onClick={onClose}>
					<StyledSvgIcon src={CloseIcon} size={20} />
				</CloseButton>
			)}
		</ModalHeaderContainer>
	);
};
export default ModalHeader;
