import React, { useCallback } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';

import { BaseProps } from '../../types';

export interface RouterLinkProps extends BaseProps {
	to: string;
	render?: (props: {
		onClick: () => void;
		active: boolean;
	}) => React.ReactElement;
}

export function RouterLink({
	to,
	render,
	children,
}: RouterLinkProps) {
	const match = useMatch(to);

	const navigate = useNavigate();
	const onClickHandler = useCallback(() => {
		navigate(to);
	}, [navigate, to]);

	if (render) {
		return render({ onClick: onClickHandler, active: !!match });
	}

	return children;
}

export default RouterLink;
