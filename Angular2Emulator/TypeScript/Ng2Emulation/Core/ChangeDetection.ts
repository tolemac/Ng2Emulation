export class SimpleChange {
    constructor(public previousValue: any, public currentValue: any) { }

    /**
     * Check whether the new value is the first value assigned.
     */
    isFirstChange(): boolean { return typeof this.previousValue === "undefined"; }
}

export let componentChanges: { component: any, changes: { [propertyName: string]: SimpleChange } }[] = [];

export function getComponentChanges(component : any) {
    for (let i = 0; i < componentChanges.length; i++) {
        if (componentChanges[i].component === component)
            return componentChanges[i];
    }
    const newComponentChanges = { component, changes: <{ [propertyName: string]: SimpleChange }>{} };
    componentChanges.push(newComponentChanges);
    return newComponentChanges;
}

export function registerChange(component: any, propertyName: string, simpleChange: SimpleChange) {
    const changes = getComponentChanges(component);
    changes[propertyName] = simpleChange;
}

export function removeChanges() {
    componentChanges = [];
}

export let componentInstances = [];

export function registerComponentInstance(component : any) {
    componentInstances.push(component);
}