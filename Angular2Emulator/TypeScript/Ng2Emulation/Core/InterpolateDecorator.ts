import {createScope} from "../Core/ScopeCreator";

function decorateInterpolate(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("$interpolate", ["$delegate", ($delegate) => {
			const origInterpolateDelegate = $delegate;

			const customDelegate = function () {
				const origResult = origInterpolateDelegate.apply(this, arguments);
				return (!origResult ? origResult : function () {
					const newScope = createScope(arguments[0]);
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