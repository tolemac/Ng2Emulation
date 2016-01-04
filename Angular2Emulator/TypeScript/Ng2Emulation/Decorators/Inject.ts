import {serviceNormalize} from "../Utils/AngularHelpers";

/**
 * Says to angular how and where inject a service or angular 1 component.
 */
export function Inject(token: Function | string) {
    return (target: any, key: string, index: number) => {
        
        // Create $inject array if not exists
        let $inject = target.$inject = target.$inject || [];
        // Obtain the name of service to put on $inject
        var name = typeof token === "string" ? token : serviceNormalize((token as any).name);
        // Ensure  array position exists
        while ($inject.length < index) {
            $inject.push("");
        }
        // Set the injection in the correct position.
        $inject[index] = name;
    }
}
