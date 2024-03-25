import styled from 'styled-components';

export const IconContainer = styled.div(({ theme }) =>
	theme.withMedia({
		width: '80px',
		height: '80px',
		borderRadius: '40px',
		backgroundColor: '#ECF3FD',
		img: {
			width: '40px',
			height: '40px',
			position: 'relative',
			top: '20px',
			left: '20px',
		},
	})
);
