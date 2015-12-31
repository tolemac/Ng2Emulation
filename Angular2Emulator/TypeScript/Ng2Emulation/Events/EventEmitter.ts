export class EventEmiter<T> {
	private observers: ((event: T) => boolean)[] = [];

	subscribe(handler: (event: T) => boolean) {
		this.observers.push(handler);
	}

	emit(event: T) {
		this.observers.forEach(observer => observer(event));
	}
} 