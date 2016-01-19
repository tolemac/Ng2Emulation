import {Lexer} from "./Ng1Lexer/Lexer";
import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper";

// const _cache = {};
const _lexer = new Lexer();

function getCmpPropLevel(token: string, context: any, level :number = 0) {
    "use strict";
	if (context.hasOwnProperty(DEFAULT_CONTROLLER_AS) &&
	    (context[DEFAULT_CONTROLLER_AS].hasOwnProperty(token) // Property
	        || context[DEFAULT_CONTROLLER_AS].constructor.prototype.hasOwnProperty(token)) // or function
	) {
        return level;
	}
    if (context.$parent) {
        return getCmpPropLevel(token, context.$parent, ++level);
    }
    return undefined;
}

function getScopePropLevel(token: string, context: any, level: number = 0) {
    "use strict";
    if (context.hasOwnProperty(token)) {
        return level;
    }
    if (context.$parent) {
        return getCmpPropLevel(token, context.$parent, ++level);
    }
    return undefined;
}

function parseToken(token: string, context: any) {
    "use strict";
	var result = token;
    if (token === DEFAULT_CONTROLLER_AS) {
        return result;
    }

    let cmpLevel = getCmpPropLevel(token, context);
    if (angular.isDefined(cmpLevel)) {
        result = DEFAULT_CONTROLLER_AS + "." + result;
        for (let i = 0; i < cmpLevel; i++) {
            result = "$parent." + result;
        }
    } else {
        let scopeLevel = getScopePropLevel(token, context);
        if (angular.isDefined(scopeLevel)) {
            for (let i = 0; i < scopeLevel; i++) {
                result = "$parent." + result;
            }
        } else {
            if (context[DEFAULT_CONTROLLER_AS])
                result = DEFAULT_CONTROLLER_AS + "." + result;
        }
    }

    return result;
}

export function parseExpression(exp: string, context: any) {
    "use strict";
    const tokens = _lexer.lex(exp);
	const parsedTokens = [];

    let changed = false;
	let firstIdentifier = true;
	angular.forEach(tokens, (token : any) => {
        if (firstIdentifier && token.identifier === true) {
            const parsedToken = parseToken(token.text, context);
            if (parsedToken !== token.text) {
                changed = true;
            }
			parsedTokens.push(parsedToken);
			firstIdentifier = false;
		} else {
			parsedTokens.push(token.text);
            if (token.identifier !== true && token.text !== ".") {
                firstIdentifier = true;
            }
        }
    });

    const parsedExp = parsedTokens.join("");
    return changed ? parsedExp : exp;
}