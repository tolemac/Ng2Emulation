export declare class EventEmiter<T> {
    private observers;
    subscribe(handler: (event: T) => boolean): void;
    emit(event: T): void;
}
