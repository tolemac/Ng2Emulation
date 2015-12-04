import * as AngularHelpers from "Ng2Emulation/AngularHelpers"
import {IComponentMetadata} from "Ng2Emulation/Component"

const APPLICATION_MODULE_NAME = "app";
const DEFAULT_CONTROLLER_AS = "app";

export class Angular1Wrapper {
    
    static app: ng.IModule;
    private static registerComponentInternal(ddo: any, component: Function) {
        var directiveName = AngularHelpers.directiveNormalize(component["$componentMetadata"]["selector"]);

        let directiveFactory : any = () => ddo;

        if (component["$routeConfig"])
            directiveFactory.$routeConfig = component["$routeConfig"];


        this.app.directive(directiveName, () => ddo);
    }

    static registerComponent(component: Function) {

        let ddo : ng.IDirective = {
            controller: component,
            controllerAs: DEFAULT_CONTROLLER_AS,
            scope: {}
        };

        let cmpMetaData: IComponentMetadata = component["$componentMetadata"];

        // Component as => controller as
        if (cmpMetaData.componentAs) {
            ddo.controllerAs = cmpMetaData.componentAs;
            delete cmpMetaData.componentAs;
        }

        // Register dependent services
        let services: Function[] = component["$services"];
        this.registerServices(services);


        // Register dependent components
        if (cmpMetaData.components) {
            for (let i = 0; i < cmpMetaData.components.length; i++) {
                this.registerComponent(cmpMetaData.components[i]);
            }
        }
        
        // Copy extra data from metadata to DDO
        angular.extend(ddo, cmpMetaData);

        this.registerComponentInternal(ddo, component);
    }

    static createModule(dependencies: string[]) {
        this.app = angular.module(APPLICATION_MODULE_NAME, dependencies || []);
    }

    private static registerService(service: any) {

        if (service.$services)
            this.registerServices(service.$services);

        let nameOfService = AngularHelpers.serviceNormalize(service.name);

        this.app.service(nameOfService, service);
    }

    private static registerServices(services: Function[]) {
        if (!services)
            return;

        for (let i = 0; i < services.length; i++) {
            this.registerService(services[i]);
        }
    }

    static bootstrap() {
        angular.bootstrap(document, [APPLICATION_MODULE_NAME]);
    }

}
