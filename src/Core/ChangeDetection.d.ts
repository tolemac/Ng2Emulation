export declare class SimpleChange {
    previousValue: any;
    currentValue: any;
    constructor(previousValue: any, currentValue: any);
    /**
     * Check whether the new value is the first value assigned.
     */
    isFirstChange(): boolean;
}
export declare let componentChanges: {
    component: any;
    changes: {
        [propertyName: string]: SimpleChange;
    };
}[];
export declare function getComponentChanges(component: any): {
    component: any;
    changes: {
        [propertyName: string]: SimpleChange;
    };
};
export declare function registerChange(component: any, propertyName: string, simpleChange: SimpleChange): void;
export declare function removeChanges(): void;
export declare let componentInstances: any[];
export declare function registerComponentInstance(component: any): void;
