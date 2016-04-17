# Scss-preview-selector (Not ready)

> Atom package to preview the full css selector generated from a scss selector. Your friend in the nesting-hell-abyss of all too many scss files.


## Install

```
$ apm install scss-preview-selector
```

Or, Settings → Install → Search for `scss-preview-selector`


## Usage
- While having the marker on a selector in a scss file, open the Command Palette and type `scss preview selector` or use the default keybinding `ctrl+shift+s`.

	![](https://cloud.githubusercontent.com/assets/1615161/14589998/e8c17932-04ef-11e6-9b74-f8c449a393a1.gif)


## Current limitations
- Media queries will not be included in the resulting selector
- You have to have the marker on the selector. Having it on a property will not be able to show the property's selector.
- Selectors containing variables from other files wont work.
- If the file is being imported in another file and the import statement is wrapped in a selector, it wont be recognized.


## License

MIT
