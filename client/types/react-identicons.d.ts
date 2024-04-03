declare module 'react-identicons' {
	import * as React from 'react';

	interface IdenticonProps {
		fg?: string;
		bg?: string;
		count?: number;
		palette?: string[];
		string?: string;
		size?: number;
		getColor?: (color: string) => void;
		padding?: number;
		className?: string;
	}

	const Identicon: React.FC<IdenticonProps>;
	export default Identicon;
}
