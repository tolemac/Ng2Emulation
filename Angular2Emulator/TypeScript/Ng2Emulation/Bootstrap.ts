import {Angular1Wrapper} from "Ng2Emulation/Angular1Wrapper"

export function bootstrap(component: Function, angular1DependendModules?: string[]) {

    Angular1Wrapper.createModule(angular1DependendModules);

    Angular1Wrapper.registerComponent(component);    
    
    Angular1Wrapper.bootstrap();
}