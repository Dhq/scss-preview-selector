/** @babel */
import path from 'path';
import sass from 'node-sass';
import S from 'string';

/* cmd+shift+s */
function init() {
	const editor = atom.workspace.getActiveTextEditor();
	let buffer = editor.getBuffer();
	let currentSelectorLocator = '/*scss-preview-current*/';

	if (!editor) {
		return;
	}

	let isScssFile = (/\.scss$/i).test(buffer.file.path);
	if (!isScssFile) {
		return;
	}

	let markerPos = editor.getCursorBufferPosition();
	let characterIndex = buffer.characterIndexForPosition(markerPos);
	console.log('characterIndex', characterIndex);


	//Remove properties, only keep selectors
	let input = buffer.cachedText;
	let nextCurlyPos = input.indexOf('{', characterIndex);
	// let nextCurlyPos = input.indexOf('}', characterIndex);

	/*ToDo: first remove all comments*/
	let modifiedInput = input.splice(nextCurlyPos + 1, 0, currentSelectorLocator);
	modifiedInput = modifiedInput.replace(/{/g, '{/* */');
	modifiedInput = modifiedInput.replace(/[^{|\s]+:[^{|}]+;/ig, '');
	console.log(modifiedInput);

	/*Todo: async*/
	let result = sass.renderSync({
		data: modifiedInput,
		outputStyle: 'expanded'
	});
	let resultString = result.css.toString('utf-8');
	console.log(resultString);

	let selector = resultString.match(/[^}]*\/\*scss-preview-current\*/)
	console.log(selector[0].split('{')[0]);

		// let currentSelectorIndex = resultString.indexOf(currentSelectorLocator);
		// console.log('currentSelectorIndex', currentSelectorIndex);
		// let between = S(resultString).between('}', currentSelectorIndex);
		// 	console.log(between);
		// 	console.log(between.s);

	}

	export const activate = () => {
		atom.commands.add('atom-workspace', 'scss-preview-selector', init);
	};

	String.prototype.splice = function(idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};
