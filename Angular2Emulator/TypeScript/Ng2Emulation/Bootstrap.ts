import {Angular1Wrapper} from "Ng2Emulation/Angular1Wrapper"

export function bootstrap(component: Function, services?: Function[] /*, angular1Modules?: string[]*/) {

    Angular1Wrapper.createModule(/*angular1Modules || */[]);

    Angular1Wrapper.registerComponent(component);
    Angular1Wrapper.registerServices(services);
    
    Angular1Wrapper.bootstrap();
}