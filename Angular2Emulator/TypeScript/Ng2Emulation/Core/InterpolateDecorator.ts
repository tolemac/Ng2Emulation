import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper"

function decorateInterpolate(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("$interpolate", ["$delegate", ($delegate) => {
			const origInterpolateDelegate = $delegate;

			const customDelegate = function () {
				const origResult = origInterpolateDelegate.apply(this, arguments);
				return (!origResult ? origResult : function () {
					const newScope = arguments[0].hasOwnProperty(DEFAULT_CONTROLLER_AS) ? arguments[0][DEFAULT_CONTROLLER_AS] : arguments[0];
					arguments[0] = newScope;

					return origResult.apply(this, arguments);
				});
			};
			customDelegate["startSymbol"] = $delegate.startSymbol;
			customDelegate["endSymbol"] = $delegate.endSymbol;

			return customDelegate;
		}]);
	}]);
}


export default decorateInterpolate;