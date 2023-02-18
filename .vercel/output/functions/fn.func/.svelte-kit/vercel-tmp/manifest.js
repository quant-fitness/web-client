export const manifest = {
	appDir: '_app',
	appPath: '_app',
	assets: new Set(['favicon.png']),
	mimeTypes: { '.png': 'image/png' },
	_: {
		entry: {
			file: '_app/immutable/start-af3d2802.js',
			imports: [
				'_app/immutable/start-af3d2802.js',
				'_app/immutable/chunks/index-65bc829e.js',
				'_app/immutable/chunks/singletons-efdfcb03.js'
			],
			stylesheets: [],
			fonts: []
		},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js')
		],
		routes: [
			{
				id: '/',
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: '/internal',
				pattern: /^\/internal\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			return {};
		}
	}
};
