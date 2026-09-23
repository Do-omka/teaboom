module.exports = (ctx) => ({
	plugins: {
		autoprefixer: {},
		'postcss-csso': ctx.env === 'production' ? {} : false,
	},
})
