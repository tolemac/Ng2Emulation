import {serviceNormalize} from "Ng2Emulation/Utils/AngularHelpers"
import {BootStrapper} from "Ng2Emulation/Core/Bootstrap"

/**
 * Register class as service for bootstrapping
 */
export function Injectable() {
	return (target: any) => {
        BootStrapper.AddService(target);
        return target;
	}
}