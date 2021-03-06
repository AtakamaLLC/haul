import webpack from 'webpack';
import { MinifyOptions } from 'terser';
import { DeepNonNullable, Overwrite, Assign } from 'utility-types';
import Runtime from '../runtime/Runtime';
import { LooseModeConfig, BundleType, BundlingMode } from '../types';

export type ServerConfig = {
  port?: number;
  host?: string;
};

export type NormalizedServerConfig = DeepNonNullable<ServerConfig>;

// Options received from the CLI arguments/options.
export type EnvOptions = {
  platform: string;
  root: string;
  dev: boolean;
  bundleType?: BundleType;
  bundleMode: BundlingMode;
  bundleTarget?: 'file' | 'server';
  assetsDest?: string;
  bundleOutput?: string;
  sourcemapOutput?: string;
  minify?: boolean;
  port?: number;
  maxWorkers?: number;
};

export type BundleConfig = Assign<
  {
    name?: string;
    entry: string | string[] | { entryFiles: string[]; setupFiles: string[] };
    type?: BundleType;
    platform?: string;
    root?: string;
    dev?: boolean;
    assetsDest?: string;
    minify?: boolean;
    minifyOptions?: Pick<
      MinifyOptions,
      Exclude<keyof MinifyOptions, 'sourceMap'>
    >;
    sourceMap?: boolean | 'inline';
    looseMode?: LooseModeConfig;
    dll?: boolean;
    app?: boolean;
    dependsOn?: string[];
    providesModuleNodeModules?: Array<
      string | { name: string; directory: string }
    >;
    hasteOptions?: any;
    transform?: WebpackConfigTransform;
    maxWorkers?: number;
  },
  ExternalBundleConfig
>;

export type ExternalBundleConfig = {
  copyBundle?: boolean;
  bundlePath?: string;
  manifestPath?: string;
  assetsPath?: string;
};

export type TemplatesConfig = {
  filename: { [platform: string]: string };
};

export type FeaturesConfig = {
  multiBundle?: 1 | 2;
};

export type NormalizedTemplatesConfig = TemplatesConfig;

export type NormalizedFeaturesConfig = DeepNonNullable<FeaturesConfig>;

export type NormalizedBundleConfig = Assign<
  Overwrite<
    Pick<
      DeepNonNullable<BundleConfig>,
      Exclude<keyof BundleConfig, 'transform' | keyof ExternalBundleConfig>
    >,
    {
      entry: {
        entryFiles: string[];
        setupFiles: string[];
      };
      minifyOptions: BundleConfig['minifyOptions'];
    }
  >,
  {
    external:
      | false
      | Overwrite<
          DeepNonNullable<ExternalBundleConfig>,
          { manifestPath: ExternalBundleConfig['manifestPath'] }
        >;
    looseMode?: LooseModeConfig;
  }
>;

export type WebpackConfigTransform = (params: {
  bundleName: string;
  config: webpack.Configuration;
  env: EnvOptions;
  runtime: Runtime;
}) => webpack.Configuration | void;

export type BundleConfigBuilder = (
  env: EnvOptions,
  runtime: Runtime
) => BundleConfig;

export type ProjectConfig = {
  server?: ServerConfig;
  platforms?: string[];
  templates?: TemplatesConfig;
  features?: FeaturesConfig;
  bundles: { [bundleName: string]: BundleConfigBuilder | BundleConfig };
};

export type NormalizedProjectConfig = {
  server: NormalizedServerConfig;
  platforms: string[];
  templates: NormalizedTemplatesConfig;
  bundles: { [bundleName: string]: NormalizedBundleConfig };
  webpackConfigs: { [bundleName: string]: webpack.Configuration };
};

export type NormalizedProjectConfigBuilder = (
  runtime: Runtime,
  env: EnvOptions
) => NormalizedProjectConfig;
