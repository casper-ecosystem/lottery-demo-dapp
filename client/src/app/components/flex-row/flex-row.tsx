import React from 'react';

import FlexBox from '../flex-box/flex-box';

export const FlexRow = React.forwardRef<HTMLDivElement, any>(
	(props, ref) => <FlexBox ref={ref} direction='row' {...props} />
);

export default FlexRow;
