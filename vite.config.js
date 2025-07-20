import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      plugins: [viteSingleFile({ removeViteModuleLoader: true, inlinePattern: ['!manifest.json'] })],
    }
  }
  return {
    // No plugins for dev server
  }
})