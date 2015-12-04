export interface RouteDefinition {
    path?: string;
    aux?: string;
    component?: Function | ComponentDefinition;
    loader?: Function;
    redirectTo?: any[];
    as?: string;
    name?: string;
    data?: any;
    useAsDefault?: boolean;
}

export interface ComponentDefinition {
    type: string;
    loader?: Function;
    component?: Function;
}

export function RouteConfig(configs: RouteDefinition[]) {
    return (target: any) => {

        target.$routeConfig = configs;
        return target;
    }
}
