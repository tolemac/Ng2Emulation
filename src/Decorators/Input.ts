/**
 * Register property as input on $componentMetadata;
 * @param inputName Name of the input
 */
export function Input(inputName?: string) {
	return (target: any, key: string) => {
		if (!inputName)
			inputName = key;

		const constructr = target.constructor;

		if (!constructr.$componentMetadata || !constructr.$componentMetadata.inputs) {
			constructr.$componentMetadata = constructr.$componentMetadata || {};
			constructr.$componentMetadata.inputs = constructr.$componentMetadata.inputs || [];
		}
		if (constructr.$componentMetadata.inputs.indexOf(inputName) < 0)
			constructr.$componentMetadata.inputs.push(inputName);
	}
}