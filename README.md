# Astro Include Asset

Include assets defined in Markdown/MDX files

Remark plugin `remark-directive` is needed for parsing the custom directives

## Usage

```md
::include-asset[./some-asset-like-a-sound-file.mp3]{#mapped-sound-file.mp3}

<audio src="/_astro/mapped-sound-file.mp3" />
```

It is a custom remark leaf directive, the first path is the asset file path relatives to current Markdown file, the second ID is the final asset file name.

## Options

- `outDir`  
  Assets output directory, default: `_astro`  
  If you set it as `my-assets`, you should use the asset URL in Markdown files as `/my-assets/blahblahblah.txt`
