import {serviceNormalize} from "Ng2Emulation/AngularHelpers"

export function Inject(service: Function) {
    return (target: any, key: string, index: number) => {

        target.$inject = target.$inject || [];
        target.$services = target.$services || [];

        target.$inject.push(serviceNormalize((service as any).name));
        target.$services.push(service);
    }
}
 