import { useClickRef } from '@make-software/csprclick-ui';
import { useEffect, useState } from 'react';

const useCsprClick = () => {
	const clickRef = useClickRef();
	const [activeAccount, setActiveAccount] = useState<any>(null);

	useEffect(() => {
		clickRef?.on('csprclick:signed_in', async (evt: any) => {
			await setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:switched_account', async (evt: any) => {
			await setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:signed_out', async (evt: any) => {
			setActiveAccount(null);
		});
		clickRef?.on('csprclick:disconnected', async (evt: any) => {
			setActiveAccount(null);
		});
	}, [clickRef?.on]);

	return {
		activeAccount,
	};
};

export default useCsprClick;
