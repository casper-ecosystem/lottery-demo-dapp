import {
	FlexColumn,
	HeaderText,
	PageTile,
} from '@make-software/cspr-design';
import styled from 'styled-components';

const TitleText = styled(HeaderText)(() => ({
	marginTop: '48px',
}));

interface TableTileProps {
	title: string;
	children: React.ReactNode;
}

export const TableTile = ({ title, children }: TableTileProps) => {
	return (
		<FlexColumn itemsSpacing={24}>
			<TitleText size={4} scale={'sm'}>
				{title}
			</TitleText>
			<PageTile>{children}</PageTile>
		</FlexColumn>
	);
};

export default TableTile;
