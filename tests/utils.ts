export function arraysAreIdentical(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) return false;
    arr1 = arr1.sort()
    arr2 = arr2.sort();
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
