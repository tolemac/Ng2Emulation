import * as AngularHelpers from "Ng2Emulation/Utils/AngularHelpers"
import {IComponentMetadata} from "Ng2Emulation/Decorators/Component"
import {IDirectiveMetadata} from "Ng2Emulation/Decorators/Directive"

const APPLICATION_MODULE_NAME = "app";
export const DEFAULT_CONTROLLER_AS = "$$vm";

export class Angular1Wrapper {
    
    static app: ng.IModule;
    private static registerDirectiveInternal(directiveName: string, ddo: any, component: Function) {        

        let directiveFactory : any = () => ddo;

        if (component["$routeConfig"])
            directiveFactory.$routeConfig = component["$routeConfig"];


        this.app.directive(directiveName, () => ddo);
    }

    static registerDirective(directive: Function) {
        let ddo: ng.IDirective = {
            controller: directive
        };

        let metaData: IComponentMetadata = directive["$directiveMetadata"];

        // Copy extra data from metadata to DDO
        angular.extend(ddo, metaData);

        var directiveName = AngularHelpers.directiveNormalize(metaData["selector"]);

        this.registerDirectiveInternal(directiveName, ddo, directive);
    }

    static registerComponent(component: Function) {

        let ddo : ng.IDirective = {
            controller: component,
            controllerAs: DEFAULT_CONTROLLER_AS,
            scope: {}
        };

        let cmpMetaData: IComponentMetadata = component["$componentMetadata"];

        // Component as => controller as
        //if (cmpMetaData.componentAs) {
        //    ddo.controllerAs = cmpMetaData.componentAs;
        //    delete cmpMetaData.componentAs;
        //}

        // Register dependent components
        if (cmpMetaData.directives) {
            for (let i = 0; i < cmpMetaData.directives.length; i++) {
                this.registerComponent(cmpMetaData.directives[i]);
            }
        }
        
        // Copy extra data from metadata to DDO
        angular.extend(ddo, cmpMetaData);

        var directiveName = AngularHelpers.directiveNormalize(cmpMetaData["selector"]);

        this.registerDirectiveInternal(directiveName, ddo, component);
    }

    static createModule(dependencies: string[]) {
        this.app = angular.module(APPLICATION_MODULE_NAME, dependencies || []);
    }

    private static registerService(service: any) {

        let nameOfService = AngularHelpers.serviceNormalize(service.name);
        this.app.service(nameOfService, service);
    }

    public static registerServices(services: Function[]) {
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
