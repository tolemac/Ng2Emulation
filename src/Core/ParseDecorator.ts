import {parseExpression} from "../Expressions/ExpressionParser";

function decorateParse(app: any) {
    "use strict";
	app.config(["$provide", ($provide:any) => {
		$provide.decorator("$parse", ["$delegate", ($delegate:any) => {
			var origParseDelegate = $delegate;
			var customDelegate = function () {
				var origResult = origParseDelegate.apply(this, arguments);
                if (typeof arguments[0] === "function") {
                    return origResult;
			    }
			    const expression = arguments[0];
				const customResult : any = function () {
					var finalResult = origResult;
                    var expression = customResult.$$expression, newExpression;
					if (expression && arguments[0]) {
						newExpression = parseExpression(expression, arguments[0]);
					    if (newExpression && newExpression !== expression) {
					        finalResult = origParseDelegate(newExpression);
					    }
					}

                    const newScope = arguments[0];
					arguments[0] = newScope;
					return finalResult.apply(this, arguments);
				};
				customResult.$$expression = expression;
				customResult.liteal = origResult.liteal;
				customResult.constant = origResult.constant;
				customResult.assign = origResult.assign;
				return (!origResult ? origResult : customResult);
			};
			return customDelegate;
		}]);
	}]);
}


export default decorateParse;