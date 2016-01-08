export declare const DEFAULT_CONTROLLER_AS: string;
export declare class Angular1Wrapper {
    static app: ng.IModule;
    private static registerDirectiveInternal(directiveName, ddo, component);
    static registerDirective(directive: Function): void;
    static registerComponent(component: Function): void;
    static createModule(dependencies: string[]): void;
    private static registerService(service);
    static registerServices(services: Function[]): void;
    static bootstrap(): void;
}
