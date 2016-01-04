export function getOwnPropertyNameInsensitiveCase(obj : any, name: string): string {
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			if (i.toLowerCase() === name.toLowerCase())
				return i;
		}
	}
	return undefined;
}

export function indexOfInsensitiveCase(array: string[], token: string): number{
	for (let i = 0; i < array.length; i++) {
		if (array[i].toLowerCase() === token.toLowerCase())
			return i;
	}
	return -1;
}