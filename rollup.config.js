import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const v = 0.1

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      esbuild({
        optimizeDeps: {
          include: ['ramda', 'tailwind-override'],
        },
      }),
    ],
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/bundle.min.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      esbuild({
        optimizeDeps: {
          include: ['ramda', 'tailwind-override'],
        },
      }),
      terser(),
    ],
  },
  {
    input: 'src/main.ts',
    output: [{ file: 'dist/bundle.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
