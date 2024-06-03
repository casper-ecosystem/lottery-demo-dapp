import styled from 'styled-components';
import { BodyText, FlexRow } from '@make-software/cspr-ui';

export enum BadgeVariation {
	light = 'light',
	blue = 'blue',
}

export enum BadgePadding {
	'small' = 'small',
	'big' = 'big',
}

const BadgeContainer = styled(FlexRow)<{
	padding: string;
	variation: BadgeVariation;
}>(({ theme, variation, padding }) =>
	theme.withMedia({
		marginTop: '20px',
		padding: padding === BadgePadding.small ? '4px 12px' : '5px 20px',
		backgroundColor:
			variation === BadgeVariation.light
				? theme.styleguideColors.backgroundSecondary
				: theme.styleguideColors.backgroundTertiary,
		borderRadius: '24px',
		inlineSize: 'fit-content',
	})
);

const StyledBodyText = styled(BodyText)(({ theme }) => ({
	color: theme.styleguideColors.contentLightBlue,
}));

const Badge = ({
	label,
	variation = BadgeVariation.blue,
	padding = BadgePadding.small,
}: {
	label: string;
	variation?: BadgeVariation;
	padding?: BadgePadding;
}) => {
	return (
		<BadgeContainer padding={padding} variation={variation}>
			<StyledBodyText size={3} scale={'sm'}>
				{label}
			</StyledBodyText>
		</BadgeContainer>
	);
};

export default Badge;
