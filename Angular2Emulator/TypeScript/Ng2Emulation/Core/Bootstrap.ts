import {Angular1Wrapper} from "./Angular1Wrapper";
import ElementEvents from "../Events/ElementEvents";
import httpIntercept from "../Templates/HttpInterceptor";
import decorateNgBind from "../Directives/NgBindProviderDecorator"
import {NgProperty} from "../Directives/NgProperty";

function decorateInterpolate(app: ng.IModule) {
	app.config(["$provide", ($provide: ng.auto.IProvideService) => {
		$provide.decorator("$interpolate", ["$delegate", ($delegate) => {
			const origInterpolateDelegate = $delegate;
			
			const customDelegate = function() {
				const origResult = origInterpolateDelegate.apply(this, arguments);
				return (!origResult ? origResult : function () {
					const newScope = arguments[0].hasOwnProperty("$$cmp")  ? arguments[0].$$cmp : arguments[0];
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

/**
 * Class to store bootstrap information.
 */
export class BootStrapper {
    private static services: Function[] = [];
    static AddService(service: Function) {
        this.services.push(service);
    }

    static BootStrap(component: Function, angular1DependendModules?: string[]) {

        Angular1Wrapper.createModule(angular1DependendModules);

        // Interceptor for templates.
        httpIntercept(Angular1Wrapper.app);
		// Decorate ngBind.
	    //decorateNgBind(Angular1Wrapper.app);
	    decorateInterpolate(Angular1Wrapper.app);

        // Register built-in directives
        // register element events directives.
        ElementEvents.resolve().forEach(directive => Angular1Wrapper.registerDirective(directive));
        // register ngProperty
        Angular1Wrapper.registerDirective(NgProperty);
        
        Angular1Wrapper.registerServices(BootStrapper.services);
        Angular1Wrapper.registerComponent(component);

        Angular1Wrapper.bootstrap();
    }
}

/**
 * bootstrap function to init Angular.
 */
export function bootstrap(component: Function, angular1DependendModules?: string[]) {
    BootStrapper.BootStrap(component, angular1DependendModules);
}