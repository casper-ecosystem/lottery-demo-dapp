import React from 'react';

import FlexBox from '../flex-box/flex-box';

export const FlexColumn = React.forwardRef<HTMLDivElement, any>(
	(props, ref) => <FlexBox ref={ref} direction='column' {...props} />
);

export default FlexColumn;
