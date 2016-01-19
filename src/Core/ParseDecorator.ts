import {parseExpression} from "../Expressions/ExpressionParser";

//function ensureFinalExpression(expression, expressionFunc, context) {
//    var finalExpression
//    // If expression is not cached process it.
//    if (!expressionFunc.$$cachedExpression) {
//        var newExpression;
//        if (expression && arguments[0]) {
//            newExpression = parseExpression(expression, context);
//            if (newExpression && newExpression !== expression) {
//                expressionFunc.$$cachedExpression = finalExpression = origParseDelegate(newExpression);
//            }
//        }
//    } else {
//        finalExpression = expressionFunc.$$cachedExpression;
//    }
//}

/**
 * Decorator for $parse.
 * Decorate $parse provider in order to get all expressions call and try to resolve symbols from $scope.$$cmp
 */
function decorateParse(app: any) {
    "use strict";
	app.config(["$provide", ($provide:any) => {
		$provide.decorator("$parse", ["$delegate", ($delegate:any) => {
            var origParseDelegate = $delegate;

            // Intercept $parse call
			var customDelegate = function () {
                var origResult = origParseDelegate.apply(this, arguments);
                // If expression is a function continue with original.
                if (typeof arguments[0] === "function") {
                    return origResult;
			    }
                const expression = arguments[0];
                // Result function
                const customResult: any = function () {
                        // Set original expression as default.
                        var finalExpression = origResult;
                        // If expression is not cached process it.
                        if (!customResult.$$cachedExpression) {
                            var expression = customResult.$$expression, newExpression;
                            if (expression && arguments[0]) {
                                newExpression = parseExpression(expression, arguments[0]);
                                if (newExpression && newExpression !== expression) {
                                    customResult.$$cachedExpression = finalExpression = origParseDelegate(newExpression);
                                }
                            }
                        } else {
                            finalExpression = customResult.$$cachedExpression;
                        }

                    const newScope = arguments[0];
					arguments[0] = newScope;
                    return finalExpression.apply(this, arguments);
                };
                // Mark this expression, write the expression to parse when expression function is called
                customResult.$$expression = expression;
                // Copy data from original.
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