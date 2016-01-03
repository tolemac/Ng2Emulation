import {Lexer} from "./Ng1Lexer/Lexer";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";

const _cache = {};
const _lexer = new Lexer();

function getCmpPropLevel(token: string, context: any, level = 0) {
	if (context.hasOwnProperty(DEFAULT_CONTROLLER_AS) &&
		(context[DEFAULT_CONTROLLER_AS].hasOwnProperty(token) // Property
			|| context[DEFAULT_CONTROLLER_AS].constructor.prototype.hasOwnProperty(token)) // or function
	)
		return level;
	if (context.$parent)
		return getCmpPropLevel(token, context.$parent, ++level);
	return undefined;
}

function parseToken(token: string, context: any) {
	var result = token;
	if (token === DEFAULT_CONTROLLER_AS)
		return result;

	let cmpLevel = getCmpPropLevel(token, context);
	if (angular.isDefined(cmpLevel)) {
		result = "$$cmp." + result;
		for (let i = 0; i < cmpLevel; i++) {
			result = "$parent." + result;
		}
	}

	return result;
}

export function parseExpression(exp: string, context : any) {
	const tokens = _lexer.lex(exp);
	const parsedTokens = [];

	let firstIdentifier = true;
	angular.forEach(tokens, (token) => {
		if (firstIdentifier && token.identifier === true) {
			parsedTokens.push(parseToken(token.text, context));
			firstIdentifier = false;
		} else {
			parsedTokens.push(token.text);
			if (token.text !== ".")
				firstIdentifier = true;
		}

	});

	return parsedTokens.join("");
}