import {DEFAULT_CONTROLLER_AS} from "../Core/Angular1Wrapper"

function ngBindProviderDecorator($provide: ng.auto.IProvideService) {
	$provide.decorator("ngBindDirective", ["$delegate", $delegate => {
		const directive = $delegate[0];
		const compile = directive.compile;

		directive.compile = function(cElement, cAttrs) {
			const link = compile.apply(this, arguments);
			return function (scope, elem, attrs) {
				const newScope = scope.hasOwnProperty(DEFAULT_CONTROLLER_AS) ? scope[DEFAULT_CONTROLLER_AS] : scope;
				newScope.$watch = scope.$watch;
				arguments[0] = newScope;
				link.apply(this, arguments);
			};
		};

		return $delegate;
	}]);
}

function decorateNgBind(app: ng.IModule) {
	app.config(["$provide", $provide => {
		ngBindProviderDecorator($provide);
	}]);
}

export default decorateNgBind;