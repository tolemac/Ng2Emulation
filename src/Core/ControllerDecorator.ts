import {registerComponentInstance} from "./ChangeDetection"

function decorateController(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("$controller", ["$delegate", ($delegate) => {
			const origDelegate = $delegate;

		    return function(_class, scope) {
                const component = origDelegate.apply(this, arguments);

                if (typeof component.ngOnDestroy === 'function')
                    scope.$on("$destroy", component.ngOnDestroy.bind(component));
		        registerComponentInstance(component.instance);

                return component;
		    };
		}]);
	}]);
}


export default decorateController;