import { useClickRef } from '@make-software/csprclick-ui';
import { useEffect, useState } from 'react';
import { ActiveAccountType, CsprClickEvent } from '../../types';

const useCsprClick = () => {
	const clickRef = useClickRef();
	const [activeAccount, setActiveAccount] =
		useState<ActiveAccountType | null>(null);

	useEffect(() => {
		clickRef?.on(
			'csprclick:signed_in',
			async (evt: CsprClickEvent) => {
				await setActiveAccount(evt.account);
			}
		);
		clickRef?.on(
			'csprclick:switched_account',
			async (evt: CsprClickEvent) => {
				await setActiveAccount(evt.account);
			}
		);
		clickRef?.on('csprclick:signed_out', async () => {
			setActiveAccount(null);
		});
		clickRef?.on('csprclick:disconnected', async () => {
			setActiveAccount(null);
		});
	}, [clickRef?.on]);

	return {
		activeAccount,
	};
};

export default useCsprClick;
