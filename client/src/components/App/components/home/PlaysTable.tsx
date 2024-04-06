import styled from 'styled-components';
import TableRow from './table/table-row';
import PlaysTableHeader from './table/PlaysTableHeader';
import PlaysTableData from './table/PlaysTableData';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { error } from 'console';
import { Play } from '../../../../play.interface';
import { usePlays } from './PlaysContext';

const StyledTableContainer = styled.table(({ theme }) =>
	theme.withMedia({
		width: '100%',
		borderSpacing: 0,
	})
);

export default function PlaysTable() {
	const { plays } = usePlays();

	useEffect(() => {
		console.log('Plays updated:', plays);
	}, [plays]);

	return (
		<StyledTableContainer>
			<PlaysTableHeader></PlaysTableHeader>
			<tbody>
				{plays.map(function (play) {
					return (
						<PlaysTableData
							key={play.playId}
              // @todo De-anonimize account hash to public key in client received events
							accountHash={play?.playerPublicKey || play.playerAccountHash}
							prize={play.prizeAmount}
							timestamp={play.timestamp}
							isJackpot={play.isJackpot}
              deployHash={play.deployHash}
						/>
					);
				})}
			</tbody>
		</StyledTableContainer>
	);
}
