import React from 'react';
import NoPlays from './components/NoPlays';
import styled from 'styled-components';
import { SetModalInViewProps } from '../../App';

const StyledLanding = styled.div(({ theme }) =>
	theme.withMedia({
		width: ['540px', '720px', '960px'],
		marginBlock: '48px',
		h3: {
			textAlign: 'left',
			marginBlock: '1em',
		},
	})
);

const Plays = styled.div(({ theme }) =>
	theme.withMedia({
		width: '100%',
		paddingBlock: '60px',
		backgroundColor: theme.backgroundPrimary,
		boxShadow: '0px 2px 4px 0px #84868C1F',
		borderRadius: '4px',
	})
);

export default function Landing(props: SetModalInViewProps) {
	return (
		<StyledLanding>
			<h3>Plays</h3>
			<Plays>
				<NoPlays setModalInView={props.setModalInView} />
			</Plays>
		</StyledLanding>
	);
}
