import {Angular1Wrapper} from "Ng2Emulation/Core/Angular1Wrapper"
import ElementEvents from "Ng2Emulation/Events/ElementEvents"

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

        ElementEvents.resolve().forEach(directive => Angular1Wrapper.registerDirective(directive));
        
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