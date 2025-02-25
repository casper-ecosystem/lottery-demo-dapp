// eslint-disable-next-line no-undef
module.exports = function override(config) {
	config.module.rules = [
		...config.module.rules,
		{
			test: /\.m?js/,
			resolve: {
				fullySpecified: false,
			},
		},
	];
	return config;
};
