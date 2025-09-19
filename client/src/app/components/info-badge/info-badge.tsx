import styled from 'styled-components';
import { BodyText } from '@make-software/cspr-design';

interface InfoBadgeProps {
	background: string;
	color: string;
	title: string;
}

export const StyledPlayInfoWrapper = styled.div<{
	background: string;
}>(({ theme, background }) =>
	theme.withMedia({
		background: background,
		borderRadius: '24px',
		marginTop: '20px',
		padding: '4px 12px',
		inlineSize: 'fit-content',
	})
);

export const StyledPlayInfo = styled(BodyText)<{ color: string }>(
	({ theme, color }) =>
		theme.withMedia({
			color: color,
		})
);

export const InfoBadge = ({
	background,
	color,
	title,
}: InfoBadgeProps) => {
	return (
		<StyledPlayInfoWrapper background={background}>
			<StyledPlayInfo size={3} color={color}>
				{title}
			</StyledPlayInfo>
		</StyledPlayInfoWrapper>
	);
};
