# Scss-preview-selector (Not ready)

> Atom package to preview the full css selector generated from a scss selector


## Install

```
$ apm install scss-preview-selector
```

Or, Settings → Install → Search for `scss-preview-selector`


## Usage
- While having the marker on a selector in a scss file, open the Command Palette and type `scss preview selector` or use the default keybinding `cmd+shift+s`.

	<!-- ![](https://f.cloud.github.com/assets/1223565/2284892/51b999b2-9fce-11e3-9e9d-5e6a9cb4e933.gif) -->


## Current limitations
- Media queries will not be included in the resulting selector
- You have to have the marker on the selector. Having it on a property will not be able to show the property's selector.
- Selectors containing variables from other files wont work.
- If the file is being imported in another file and the import statement is wrapped in a selector, it wont be recognized.


## License

MIT
