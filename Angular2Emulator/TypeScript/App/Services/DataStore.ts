﻿export class DataStore {
    private static initialValues = ["Data1", "Data2", "Data3"];
    valueList = DataStore.initialValues;

    static setInitialValues(initialValues: string[]) {
        this.initialValues = initialValues;
    }
}