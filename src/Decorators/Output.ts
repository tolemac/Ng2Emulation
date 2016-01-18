/**
 * Register property as output on $componentMetadata;
 * @param outputName Name of the output
 */
export function Output(outputName?: string) {
	return (target: any, key: string) => {
		if (!outputName)
			outputName = key;

		const constructr = target.constructor;

		if (!constructr.$componentMetadata || !constructr.$componentMetadata.outputs) {
			constructr.$componentMetadata = constructr.$componentMetadata || {};
			constructr.$componentMetadata.outputs = constructr.$componentMetadata.outputs || [];
		}
		if (constructr.$componentMetadata.outputs.indexOf(outputName) < 0)
			constructr.$componentMetadata.outputs.push(outputName);
	}
} 