import {removeChanges, componentChanges, SimpleChange} from "../ChangeDetection"

let onEndDigestPhase = false;

export interface OnChanges {
    ngOnChanges(changes: { [propertyName: string]: SimpleChange });
}
export interface OnInit {
    ngOnInit();
}
export interface OnDestroy {
    ngOnDestroy();
}

export function initLifeCycleHooks(app: ng.IModule) {

    app.run(["$rootScope", $rootScope => {
        var hasRegistered = false;
        $rootScope.$watch(() => {
            if (onEndDigestPhase)
                return;

            if (hasRegistered) return;
            hasRegistered = true;
            $rootScope.$$postDigest(() => {
                hasRegistered = false;
                onEndDigestPhase = true;
                onEndDigest();
                $rootScope.$apply();
                onEndDigestPhase = false;

            });
        });
    }]);
}

function onEndDigest() {
    for (let i = 0; i < componentChanges.length; i++) {
        const cmpChanges = componentChanges[i];
        const component = cmpChanges.component;
         
        if (typeof component.ngOnChanges === "function") {
            component.ngOnChanges(cmpChanges);
        }
        if (!component.$$ng2emu$Init && typeof component.ngOnInit === "function") {
            component.ngOnInit();
            component.$$ng2emu$Init = true;
        }
    }
    removeChanges();
}
