// const esbuild = require('esbuild');
// const { dependencies } = require('./package.json');

// const external = Object.keys(dependencies || {});

// esbuild.build({
//   entryPoints: ['src/index.ts'],
//   bundle: true,
//   platform: 'node',
//   outdir: 'dist',  
//   format: 'cjs',
//   tsconfig: './tsconfig.json',
//   external: [
//   ...external,
//   '@nextjs-expressjs-postgresql/shared'
// ]
// }).catch((e) => {
//     console.error(e);
//     process.exit(1);
// });