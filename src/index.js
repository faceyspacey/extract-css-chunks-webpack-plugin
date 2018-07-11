import fs from 'fs';
import path from 'path';

import webpack from 'webpack';
import sources from 'webpack-sources';

const hotLoader = path.resolve(__dirname, './hotLoader.js');

const { ConcatSource, SourceMapSource, OriginalSource } = sources;
const { Template, util: { createHash } } = webpack;

const NS = path.dirname(fs.realpathSync(__filename));

const pluginName = 'extract-css-chunks-webpack-plugin';

const REGEXP_CHUNKHASH = /\[chunkhash(?::(\d+))?\]/i;
const REGEXP_CONTENTHASH = /\[contenthash(?::(\d+))?\]/i;
const REGEXP_NAME = /\[name\]/i;

const isHMR = (compiler) => {
  if (compiler && compiler.options) {
    if (compiler.options.devServer && compiler.options.devServer.hot) {
      return true;
    }

    if (compiler.options.entry) {
      const entry = typeof compiler.options.entry === 'function' ? compiler.options.entry() : compiler.options.entry;
      const entryString = JSON.stringify(entry);
      return entryString.includes('hot') || entryString.includes('hmr');
    }
  }
  return false;
};

class CssDependency extends webpack.Dependency {
  constructor(
    {
      identifier, content, media, sourceMap,
    },
    context,
    identifierIndex,
  ) {
    super();
    this.identifier = identifier;
    this.identifierIndex = identifierIndex;
    this.content = content;
    this.media = media;
    this.sourceMap = sourceMap;
    this.context = context;
  }

  getResourceIdentifier() {
    return `css-module-${this.identifier}-${this.identifierIndex}`;
  }
}

class CssDependencyTemplate {
  apply() { // eslint-disable-line class-methods-use-this
  }
}

class CssModule extends webpack.Module {
  constructor(dependency) {
    super(NS, dependency.context);
    this._identifier = dependency.identifier;
    this._identifierIndex = dependency.identifierIndex;
    this.content = dependency.content;
    this.media = dependency.media;
    this.sourceMap = dependency.sourceMap;
  }

  // no source() so webpack doesn't do add stuff to the bundle

  size() {
    return this.content.length;
  }

  identifier() {
    return `css ${this._identifier} ${this._identifierIndex}`;
  }

  readableIdentifier(requestShortener) {
    return `css ${requestShortener.shorten(this._identifier)}${
      this._identifierIndex ? ` (${this._identifierIndex})` : ''
    }`;
  }

  nameForCondition() {
    const resource = this._identifier.split('!').pop();
    const idx = resource.indexOf('?');
    if (idx >= 0) return resource.substring(0, idx);
    return resource;
  }

  updateCacheModule(module) {
    this.content = module.content;
    this.media = module.media;
    this.sourceMap = module.sourceMap;
  }

  needRebuild() { // eslint-disable-line class-methods-use-this
    return true;
  }

  build(options, compilation, resolver, fileSystem, callback) {
    this.buildInfo = {};
    this.buildMeta = {};
    callback();
  }

  updateHash(hash) {
    super.updateHash(hash);
    hash.update(this.content);
    hash.update(this.media || '');
    hash.update(JSON.stringify(this.sourceMap || ''));
  }
}

class CssModuleFactory {
  create({ dependencies: [dependency] }, callback) { // eslint-disable-line class-methods-use-this
    callback(null, new CssModule(dependency));
  }
}

class ExtractCssChunks {
  constructor(options) {
    this.options = Object.assign(
      {
        filename: '[name].css',
      },
      options,
    );
    if (!this.options.chunkFilename) {
      const { filename } = this.options;
      const hasName = filename.includes('[name]');
      const hasId = filename.includes('[id]');
      const hasChunkHash = filename.includes('[chunkhash]');
      // Anything changing depending on chunk is fine
      if (hasChunkHash || hasName || hasId) {
        this.options.chunkFilename = filename;
      } else {
        // Elsewise prefix '[id].' in front of the basename to make it changing
        this.options.chunkFilename = filename.replace(
          /(^|\/)([^/]*(?:\?|$))/,
          '$1[id].$2',
        );
      }
    }
  }

  apply(compiler) {
    try {
      const isHOT = this.options.hot ? true : isHMR(compiler);

      if (isHOT && compiler.options.module && compiler.options.module.rules) {
        const updatedRules = compiler.options.module.rules.reduce((rules, rule) => {
          if (rule.use && Array.isArray(rule.use)) {
            const isMiniCss = rule.use.some((l) => {
              const needle = l.loader || l;
              return needle.includes(pluginName);
            });
            if (isMiniCss) {
              rule.use.unshift(hotLoader);
            }
          }
          rules.push(rule);

          return rules;
        }, []);

        compiler.options.module.rules = updatedRules;
      }
    } catch (e) {
      console.error('Something went wrong: contact the author', JSON.stringify(e)); // eslint-disable-line no-console
    }

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(pluginName, (lc, m) => {
        const loaderContext = lc;
        const module = m;
        loaderContext[NS] = (content) => {
          if (!Array.isArray(content) && content != null) {
            throw new Error(
              `Exported value was not extracted as an array: ${JSON.stringify(
                content,
              )}`,
            );
          }
          const identifierCountMap = new Map();
          for (const line of content) {
            const count = identifierCountMap.get(line.identifier) || 0;
            module.addDependency(new CssDependency(line, m.context, count));
            identifierCountMap.set(line.identifier, count + 1);
          }
        };
      });
      compilation.dependencyFactories.set(
        CssDependency,
        new CssModuleFactory(),
      );
      compilation.dependencyTemplates.set(
        CssDependency,
        new CssDependencyTemplate(),
      );
      compilation.mainTemplate.hooks.renderManifest.tap(
        pluginName,
        (result, { chunk }) => {
          const renderedModules = Array.from(chunk.modulesIterable).filter(
            module => module.type === NS,
          );
          if (renderedModules.length > 0) {
            result.push({
              render: () => this.renderContentAsset(
                renderedModules,
                compilation.runtimeTemplate.requestShortener,
              ),
              filenameTemplate: this.options.filename,
              pathOptions: {
                chunk,
                contentHashType: NS,
              },
              identifier: `extract-css-chunks-webpack-plugin.${chunk.id}`,
              hash: chunk.contentHash[NS],
            });
          }
        },
      );
      compilation.chunkTemplate.hooks.renderManifest.tap(
        pluginName,
        (result, { chunk }) => {
          const renderedModules = Array.from(chunk.modulesIterable).filter(
            module => module.type === NS,
          );
          if (renderedModules.length > 0) {
            result.push({
              render: () => this.renderContentAsset(
                renderedModules,
                compilation.runtimeTemplate.requestShortener,
              ),
              filenameTemplate: this.options.chunkFilename,
              pathOptions: {
                chunk,
                contentHashType: NS,
              },
              identifier: `extract-css-chunks-webpack-plugin.${chunk.id}`,
              hash: chunk.contentHash[NS],
            });
          }
        },
      );
      compilation.mainTemplate.hooks.hashForChunk.tap(
        pluginName,
        (hash, chunk) => {
          const { chunkFilename } = this.options;
          if (REGEXP_CHUNKHASH.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).hash));
          }
          if (REGEXP_CONTENTHASH.test(chunkFilename)) {
            hash.update(
              JSON.stringify(chunk.getChunkMaps(true).contentHash[NS] || {}),
            );
          }
          if (REGEXP_NAME.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).name));
          }
        },
      );
      compilation.hooks.contentHash.tap(pluginName, (chunk) => {
        const { outputOptions } = compilation;
        const { hashFunction, hashDigest, hashDigestLength } = outputOptions;
        const hash = createHash(hashFunction);
        for (const m of chunk.modulesIterable) {
          if (m.type === NS) {
            m.updateHash(hash);
          }
        }
        const { contentHash } = chunk;
        contentHash[NS] = hash
          .digest(hashDigest)
          .substring(0, hashDigestLength);
      });
      const { mainTemplate } = compilation;
      mainTemplate.hooks.localVars.tap(pluginName, (source, chunk) => {
        const chunkMap = this.getCssChunkObject(chunk);
        if (Object.keys(chunkMap).length > 0) {
          return Template.asString([
            source,
            '',
            '// object to store loaded CSS chunks',
            'var installedCssChunks = {',
            Template.indent(
              chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(',\n'),
            ),
            '}',
          ]);
        }
        return source;
      });
      mainTemplate.hooks.requireEnsure.tap(
        pluginName,
        (source, chunk, hash) => {
          const chunkMap = this.getCssChunkObject(chunk);
          if (Object.keys(chunkMap).length > 0) {
            const chunkMaps = chunk.getChunkMaps();
            const linkHrefPath = mainTemplate.getAssetPath(
              JSON.stringify(this.options.chunkFilename),
              {
                hash: `" + ${mainTemplate.renderCurrentHashCode(hash)} + "`,
                hashWithLength: length => `" + ${mainTemplate.renderCurrentHashCode(hash, length)} + "`,
                chunk: {
                  id: '" + chunkId + "',
                  hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
                  hashWithLength(length) {
                    const shortChunkHashMap = Object.create(null);
                    for (const chunkId of Object.keys(chunkMaps.hash)) {
                      if (typeof chunkMaps.hash[chunkId] === 'string') {
                        shortChunkHashMap[chunkId] = chunkMaps.hash[
                          chunkId
                        ].substring(0, length);
                      }
                    }
                    return `" + ${JSON.stringify(
                      shortChunkHashMap,
                    )}[chunkId] + "`;
                  },
                  contentHash: {
                    [NS]: `" + ${JSON.stringify(
                      chunkMaps.contentHash[NS],
                    )}[chunkId] + "`,
                  },
                  contentHashWithLength: {
                    [NS]: (length) => {
                      const shortContentHashMap = {};
                      const contentHash = chunkMaps.contentHash[NS];
                      for (const chunkId of Object.keys(contentHash)) {
                        if (typeof contentHash[chunkId] === 'string') {
                          shortContentHashMap[chunkId] = contentHash[
                            chunkId
                          ].substring(0, length);
                        }
                      }
                      return `" + ${JSON.stringify(
                        shortContentHashMap,
                      )}[chunkId] + "`;
                    },
                  },
                  name: `" + (${JSON.stringify(
                    chunkMaps.name,
                  )}[chunkId]||chunkId) + "`,
                },
                contentHashType: NS,
              },
            );
            return Template.asString([
              source,
              '',
              '// extract-css-chunks-webpack-plugin CSS loading',
              `var cssChunks = ${JSON.stringify(chunkMap)};`,
              'if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);',
              'else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {',
              Template.indent([
                'promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {',
                Template.indent([
                  `var href = ${linkHrefPath};`,
                  `var fullhref = ${mainTemplate.requireFn}.p + href;`,
                  'var existingLinkTags = document.getElementsByTagName("link");',
                  'for(var i = 0; i < existingLinkTags.length; i++) {',
                  Template.indent([
                    'var tag = existingLinkTags[i];',
                    'var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");',
                    'if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return resolve();',
                  ]),
                  '}',
                  'var existingStyleTags = document.getElementsByTagName("style");',
                  'for(var i = 0; i < existingStyleTags.length; i++) {',
                  Template.indent([
                    'var tag = existingStyleTags[i];',
                    'var dataHref = tag.getAttribute("data-href");',
                    'if(dataHref === href || dataHref === fullhref) return resolve();',
                  ]),
                  '}',
                  'var linkTag = document.createElement("link");',
                  'linkTag.rel = "stylesheet";',
                  'linkTag.type = "text/css";',
                  'linkTag.onload = resolve;',
                  'linkTag.onerror = function(event) {',
                  Template.indent([
                    'var request = event && event.target && event.target.src || fullhref;',
                    'var err = new Error("Loading CSS chunk " + chunkId + " failed.\\n(" + request + ")");',
                    'err.request = request;',
                    'reject(err);',
                  ]),
                  '};',
                  'linkTag.href = fullhref;',
                  'var head = document.getElementsByTagName("head")[0];',
                  'head.appendChild(linkTag);',
                ]),
                '}).then(function() {',
                Template.indent(['installedCssChunks[chunkId] = 0;']),
                '}));',
              ]),
              '}',
            ]);
          }
          return source;
        },
      );
    });
  }

  getCssChunkObject(mainChunk) { // eslint-disable-line class-methods-use-this
    const obj = {};
    for (const chunk of mainChunk.getAllAsyncChunks()) {
      for (const module of chunk.modulesIterable) {
        if (module.type === NS) {
          obj[chunk.id] = 1;
          break;
        }
      }
    }
    return obj;
  }

  renderContentAsset(modules, requestShortener) { // eslint-disable-line class-methods-use-this
    modules.sort((a, b) => a.index2 - b.index2);
    const source = new ConcatSource();
    const externalsSource = new ConcatSource();
    for (const m of modules) {
      if (/^@import url/.test(m.content)) {
        // HACK for IE
        // http://stackoverflow.com/a/14676665/1458162
        let { content } = m;
        if (m.media) {
          // insert media into the @import
          // this is rar
          // TODO improve this and parse the CSS to support multiple medias
          content = content.replace(/;|\s*$/, m.media);
        }
        externalsSource.add(content);
        externalsSource.add('\n');
      } else {
        if (m.media) {
          source.add(`@media ${m.media} {\n`);
        }
        if (m.sourceMap) {
          source.add(
            new SourceMapSource(
              m.content,
              m.readableIdentifier(requestShortener),
              m.sourceMap,
            ),
          );
        } else {
          source.add(
            new OriginalSource(
              m.content,
              m.readableIdentifier(requestShortener),
            ),
          );
        }
        source.add('\n');
        if (m.media) {
          source.add('}\n');
        }
      }
    }
    return new ConcatSource(externalsSource, source);
  }
}

ExtractCssChunks.loader = require.resolve('./loader');

export default ExtractCssChunks;
