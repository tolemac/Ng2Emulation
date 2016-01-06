function getOwnPropertyNameInsensitiveCase(obj, name) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (i.toLowerCase() === name.toLowerCase())
                return i;
        }
    }
    return undefined;
}
function indexOfInsensitiveCase(array, token) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() === token.toLowerCase())
            return i;
    }
    return -1;
}
//# sourceMappingURL=C:/Users/jros/Desarrollo/GitHub/tolemaC/Ng2Emulation/Angular2Emulator/TypeScript/TypeScript/Ng2Emulation/Utils/Utils.js.map