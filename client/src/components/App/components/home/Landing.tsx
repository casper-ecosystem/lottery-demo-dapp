import React from 'react';
import NoPlays from './NoPlays';
import styled from 'styled-components';
import { SetModalInViewProps } from './Home';
import PlaysTable from './PlaysTable';
import { usePlays } from './PlaysContext';

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

interface StyledPlaysProps {
	paddingBlock: number;
}

const StyledPlays = styled.div<StyledPlaysProps>(({ theme, paddingBlock = 60 }) =>
	theme.withMedia({
		width: '100%',
		paddingBlock: paddingBlock,
		backgroundColor: theme.backgroundPrimary,
		boxShadow: '0px 2px 4px 0px #84868C1F',
		borderRadius: '4px',
	})
);

export default function Landing(props: SetModalInViewProps) {
	const { plays } = usePlays();

	let playsContent = <NoPlays setModalInView={props.setModalInView} />;

	if (plays.length > 0) {
		playsContent = <PlaysTable />;
	}
	return (
		<StyledLanding>
			<h3>Plays</h3>
			<StyledPlays paddingBlock={plays.length == 0 ? 60 : 0}>{playsContent}</StyledPlays>
		</StyledLanding>
	);
}
