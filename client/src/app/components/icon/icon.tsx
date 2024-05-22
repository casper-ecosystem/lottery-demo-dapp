// @ts-ignore
import CupIcon from '../../../assets/icons/cup.svg';
import styled from 'styled-components';
import { FlexRow, SvgIcon } from '@make-software/cspr-ui';
import React from 'react';

export enum IconStatus {
	default = 'default',
	success = 'success',
	error = 'error',
}

const statusIconBackgroundColor = {
	[IconStatus.default]: '#ECF3FD',
	[IconStatus.success]: '#31DE9126',
	[IconStatus.error]: '#E6332A1A',
};

const statusIconColor = {
	[IconStatus.success]: 'contentGreen',
	[IconStatus.error]: 'borderRed',
	[IconStatus.default]: 'contentLightBlue',
};

const SvgIconContainer = styled(FlexRow)<{ status: IconStatus }>(
	({ theme, status }) =>
		theme.withMedia({
			width: '80px',
			height: '80px',
			borderRadius: '50%',
			// @ts-ignore
			backgroundColor: statusIconBackgroundColor[status],
			alignItems: 'center',
			justifyContent: 'center',
		})
);

const StyledSvgIcon = styled(SvgIcon)<{ status: IconStatus }>(
	({ theme, status }) => ({
		path: {
			// @ts-ignore
			fill: theme.styleguideColors[statusIconColor[status]],
		},
	})
);

export const Icon = ({
	src,
	status = IconStatus.default,
}: {
	src: string;
	status?: IconStatus;
}) => {
	return (
		<SvgIconContainer status={status}>
			<StyledSvgIcon
				src={src}
				status={status}
				width={40}
				height={40}
			/>
		</SvgIconContainer>
	);
};

export default Icon;
