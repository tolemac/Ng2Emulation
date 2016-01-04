import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper"
import {parseExpression} from "../Expressions/ExpressionParser";

function decorateParse(app) {
	app.config(["$provide", $provide => {
		$provide.decorator("$parse", ["$delegate", $delegate => {
			var origParseDelegate = $delegate;
			var customDelegate = function () {
				var origResult = origParseDelegate.apply(this, arguments);
				if (typeof arguments[0] == "function")
					return origResult;
				const expression = arguments[0];
				var customResult = function () {
					var finalResult = origResult;
					var expression = arguments.callee["$$expression"], newExpression;
					if (expression && arguments[0]) {
						newExpression = parseExpression(expression, arguments[0]);
						if (newExpression && newExpression !== expression)
							finalResult = origParseDelegate(newExpression);
					}

					var newScope = arguments[0];//arguments[0].hasOwnProperty(DEFAULT_CONTROLLER_AS) ? arguments[0][DEFAULT_CONTROLLER_AS] : arguments[0];
					arguments[0] = newScope;
					return finalResult.apply(this, arguments);
				};
				customResult["$$expression"] = expression;
				customResult["liteal"] = origResult.liteal;
				customResult["constant"] = origResult.constant;
				customResult["assign"] = origResult.assign;
				return (!origResult ? origResult : customResult);
			};
			return customDelegate;
		}]);
	}]);
}


export default decorateParse;