import { SimpleChange } from "../ChangeDetection";
export interface OnChanges {
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): any;
}
export interface OnInit {
    ngOnInit(): any;
}
export interface OnDestroy {
    ngOnDestroy(): any;
}
export declare function initLifeCycleHooks(app: ng.IModule): void;
