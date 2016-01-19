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
 * Decorate $parse provider in order to get all expressions call and try to resolve symbols from $scope.DEFAULT_CONTROLLER_AS
 */
function decorateParse(app: any) {
    "use strict";
	app.config(["$provide", ($provide:any) => {
		$provide.decorator("$parse", ["$delegate", ($delegate:any) => {
            var origParseDelegate = $delegate;

            // Intercept $parse call
			var customDelegate = function () {
                var origExpressionResult = origParseDelegate.apply(this, arguments);
                // If expression is a function continue with original.
                if (typeof arguments[0] === "function") {
                    return origExpressionResult;
			    }
                const expression = arguments[0];
                // Result function
                const customExpressionResult: any = function () {
                        // Set original expression as default.
                        var finalExpression = origExpressionResult;
                        // If expression is not cached process it.
                        if (!customExpressionResult.$$cachedExpression && customExpressionResult.$$cachedExpression !== null) {
                            // Load annoted expression.
                            const expression = customExpressionResult.$$expression;
                            // If exists annoted expression and $scope is passed try to convert expression.
                            if (expression && arguments[0]) {
                                const newExpression = parseExpression(expression, arguments[0]);
                                // if newExpression is different of original expression then calculate new expression and annote it.
                                if (newExpression && newExpression !== expression) {
                                    customExpressionResult.$$cachedExpression = finalExpression = origParseDelegate(newExpression);
                                } else {
                                    // If expression are equal it hasn't changes.
                                    customExpressionResult.$$cachedExpression = null;
                                }
                            }
                        } else {
                            // If expression was cached as "null" use original result, no changes on expression.
                            if (customExpressionResult.$$cachedExpression === null)
                                finalExpression = origExpressionResult;
                            else // Use cached expression.
                                finalExpression = customExpressionResult.$$cachedExpression;
                        }

                    return finalExpression.apply(this, arguments);
                };
                // Mark this expression, write the expression to parse when expression function is called
                customExpressionResult.$$expression = expression;
                // Copy data from original.
				customExpressionResult.liteal = origExpressionResult.liteal;
                customExpressionResult.constant = origExpressionResult.constant;
                const customExpressionAssign : any = function () {

                    // Set original expression as default.
                    var finalExpression = origExpressionResult.assign;
                    // If expression is not cached process it.
                    if (!customExpressionAssign.$$cachedExpression && customExpressionAssign.$$cachedExpression !== null) {
                        // Load annoted expression.
                        const expression = customExpressionAssign.$$expression;
                        // If exists annoted expression and $scope is passed try to convert expression.
                        if (expression && arguments[0]) {
                            const newExpression = parseExpression(expression, arguments[0]);
                            // if newExpression is different of original expression then calculate new expression and annote it.
                            if (newExpression && newExpression !== expression) {
                                customExpressionAssign.$$cachedExpression = finalExpression = origParseDelegate(newExpression).assign;
                            } else {
                                // If expression are equal it hasn't changes.
                                customExpressionAssign.$$cachedExpression = null;
                            }
                        }
                    } else {
                        // If expression was cached as "null" use original result, no changes on expression.
                        if (customExpressionAssign.$$cachedExpression === null)
                            finalExpression = origExpressionResult.assign;
                        else // Use cached expression.
                            finalExpression = customExpressionAssign.$$cachedExpression;
                    }

                    return finalExpression.apply(this, arguments);
			    };

			    customExpressionResult.assign = customExpressionAssign;
			    customExpressionResult.assign.$$expression = expression;
				return (!origExpressionResult ? origExpressionResult : customExpressionResult);
			};
			return customDelegate;
		}]);
	}]);
}


export default decorateParse;