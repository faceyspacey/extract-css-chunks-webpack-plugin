declare module 'extract-css-chunks-webpack-plugin' {
  import { Loader, Plugin } from 'webpack';

  class ExtractCssChunksPlugin extends Plugin {
      static loader: Loader;

      constructor(options?: ExtractCssChunksPlugin.PluginOptions);
  }

  namespace ExtractCssChunksPlugin {
      interface PluginOptions {
          /**
           * Options similar to those of `mini-css-extract-plugin`
           */
          filename?: string;
          chunkFilename?: string;
          /**
           * we try to automatically inject hot reloading, but if it's not working, use this config
           */
          hot?: boolean;
          reloadAll?: boolean;
          cssModules?: boolean;
      }
  }

  export = ExtractCssChunksPlugin;
}
