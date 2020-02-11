type Options = {
  initializeCoreLocation?: string;
  additionalSetupFiles?: string[];
};

export default function withPolyfillsFactory(polyfills: string[]) {
  return function withPolyfills(
    entry: string | string[],
    {
      // registerBlankComponentLocation = './registerBlankComponent.js',
      additionalSetupFiles = [],
      initializeCoreLocation = 'react-native/Libraries/Core/InitializeCore.js',
    }: Options = {}
  ): { entryFiles: string[]; setupFiles: string[] } {
    const setupFiles = [
      ...polyfills,
      initializeCoreLocation,
      // registerBlankComponentLocation,
    ];
    console.log('setupFiles', setupFiles);
    if (typeof entry === 'string') {
      return {
        setupFiles: [...setupFiles, ...additionalSetupFiles],
        entryFiles: [...setupFiles, entry],
      };
    } else if (Array.isArray(entry)) {
      return {
        setupFiles: [...setupFiles, ...additionalSetupFiles],
        entryFiles: [...setupFiles, ...entry],
      };
    } else {
      throw new Error(`${typeof entry} is not supported as a entry`);
    }
  };
}
