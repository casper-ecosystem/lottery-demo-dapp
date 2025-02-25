/**
 *
 * @usage
 * ```
 * type Props = {
 *   height: "24" | "36" | "40" | "100%"
 * }
 * matchSize({ "24": 24, "36": 36, "40": 40, "100%": '100%' }, height),
 * ```
 */
export const matchSize = <SizeType extends string | number>(
	matchers: Record<SizeType, any>,
	size: SizeType
): any => {
	const match = matchers[size];
	if (match == null) {
		throw Error(`Missing size declaration: ${size}`);
	}
	return match;
};
