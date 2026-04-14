# Astro Include Asset

Include assets defined in Markdown/MDX files

Remark plugin `remark-directive` is needed for parsing the custom directives

## Usage

Install the package with your favorite package manager:

```sh
pnpm add --save-dev astro-include-asset
```

Add integration to your Astro config file:

```js
import { defineConfig } from "astro/config";

// ...
import includeAsset from "astro-include-asset";
// ...

export default defineConfig({
  // ...
  integrations: [
    // ...
    includeAsset({
      /* Options */
    }),
    // ...
  ],
  // ...
});
```

Use custom remark directive in your Markdown/MDX file:

```md
::include-asset[./some-asset-like-a-sound-file.mp3]{#mapped-sound-file.mp3}

<audio src="/_astro/mapped-sound-file.mp3" controller></audio>

::include-asset[./another-asset.png]{id=another-way-to-name-the-asset.png}

<img src="/_astro/another-way-to-name-the-asset.png" />
```

## Options

- `outDir`  
  Assets output directory, default: `"_astro"`  
  If you set it as `my-assets`, you should use the asset URL in Markdown files as `/my-assets/blahblahblah.txt`

## Syntax

It's actually a custom remark leaf directive

```txt
::include-asset[1]{#2}
```

The place `1` is a path relative to current Markdown/MDX of the asset you want to include.

The place `2` is a globally unique file name of the asset for URL reference.

The final asset URL you should use is `/{outDir}/{2}`
