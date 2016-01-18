// Copied from angular source code.

var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => (offset ? letter.toUpperCase() : letter)).
    replace(MOZ_HACK_REGEXP, "Moz$1");
}
 
var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;

export function directiveNormalize(name: string) {
	return camelCase(name.replace(PREFIX_REGEXP, ""));
}

export function serviceNormalize(name: string) {
    return name[0].toLowerCase() + name.substr(1);
}

// Copied from ng-forward https://github.com/tolemac/ng-forward/tree/master/lib/util
const SNAKE_CASE_REGEXP = /[A-Z]/g;

export function dasherize(name: string, separator: string = '-'): string {
    return name.replace(SNAKE_CASE_REGEXP, (letter: string, pos: number) => {
        return `${(pos ? separator : '')}${letter.toLowerCase()}`;
    });
}

export function parseSelector(selector: string): any {
    let selectorArray: string[];
    let type: string;

    if (selector.match(/\[(.*?)\]/) !== null) {
        selectorArray = selector.slice(1, selector.length - 1).split('-');
        type = 'A';
    }
    else if (selector[0] === '.') {
        selectorArray = selector.slice(1, selector.length).split('-');
        type = 'C';
    }
    else {
        selectorArray = selector.split('-');
        type = 'E';
    }

    let first = selectorArray.shift();
    let name: string;

    if (selectorArray.length > 0) {
        for (let i = 0; i < selectorArray.length; i++) {
            let s = selectorArray[i];
            s = s.slice(0, 1).toUpperCase() + s.slice(1, s.length);
            selectorArray[i] = s;
        }

        name = [first, ...selectorArray].join('');
    }
    else {
        name = first;
    }

    return { name, type };
}