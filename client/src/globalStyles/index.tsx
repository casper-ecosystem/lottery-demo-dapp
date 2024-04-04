import styled from 'styled-components';

interface IconContainerProps {
	backgroundColor?: string;
}

export const IconContainer = styled.div<IconContainerProps>(({ theme, backgroundColor = '#ECF3FD' }) =>
	theme.withMedia({
		width: '80px',
		height: '80px',
		borderRadius: '40px',
		backgroundColor: backgroundColor,
		img: {
			width: '40px',
			height: '40px',
			position: 'relative',
			top: '20px',
			left: '20px',
		},
	})
);
