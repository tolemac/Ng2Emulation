import {Angular1Wrapper} from "./Angular1Wrapper";
import ElementEvents from "../Events/ElementEvents";
import httpIntercept from "../Templates/HttpInterceptor";
import decorateInterpolate from "./InterpolateDecorator"
import decorateParse from "./ParseDecorator"
import {NgProperty} from "../Directives/NgProperty";
import {NgEventBinding} from "../Directives/NgEventBinding";
import {NgPropertyBinding} from "../Directives/NgPropertyBinding";

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
		// Decorate $interpolate to redirect scope to $$cmp
	    //decorateInterpolate(Angular1Wrapper.app);
	    decorateParse(Angular1Wrapper.app);

        // Register built-in directives
        // register element events directives.
        //ElementEvents.resolve().forEach(directive => Angular1Wrapper.registerDirective(directive));

		// register Event Binding directive
		Angular1Wrapper.registerDirective(NgEventBinding);
		// register Property Binding directive
		Angular1Wrapper.registerDirective(NgPropertyBinding);
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