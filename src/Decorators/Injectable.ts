import {serviceNormalize} from "../Utils/AngularHelpers"
import {BootStrapper} from "../Core/Bootstrap"

/**
 * Register class as service for bootstrapping
 */
export function Injectable() {
	return (target: any) => {
        BootStrapper.AddService(target);
        return target;
	}
}