import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper"

function decorateParse(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("$parse", ["$delegate", ($delegate) => {
			const origParseDelegate = $delegate;

			const customDelegate = function () {
				const origResult = origParseDelegate.apply(this, arguments);

				const customResult = function () {
					const newScope = arguments[0].hasOwnProperty(DEFAULT_CONTROLLER_AS) ? arguments[0][DEFAULT_CONTROLLER_AS] : arguments[0];
					arguments[0] = newScope;

					return origResult.apply(this, arguments);
				};
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