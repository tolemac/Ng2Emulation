/**
 * Class to store bootstrap information.
 */
export declare class BootStrapper {
    private static services;
    static AddService(service: Function): void;
    static BootStrap(component: Function, angular1DependendModules?: string[]): void;
}
/**
 * bootstrap function to init Angular.
 */
export declare function bootstrap(component: Function, angular1DependendModules?: string[]): void;
