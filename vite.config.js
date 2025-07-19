import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: 'src',
  plugins: [
    viteSingleFile(),
    viteStaticCopy({
      targets: [
        {
          src: 'sw.js',
          dest: '.'
        },
        {
          src: 'manifest.json',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    outDir: '../dist'
  }
});