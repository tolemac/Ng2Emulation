var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.
    replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => (offset ? letter.toUpperCase() : letter)).
    replace(MOZ_HACK_REGEXP, "Moz$1");
}
 
var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;

export function directiveNormalize(name: any) {
	return camelCase(name.replace(PREFIX_REGEXP, ""));
}
