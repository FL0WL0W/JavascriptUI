export function formatNumberForDisplay(value, precision = 6) {
    value = parseFloat(value)
    if(isNaN(value))
        return `&nbsp;`
    if(Math.abs(value) < 1)
        return parseFloat(value.toFixed(precision -1))
    return parseFloat(value.toPrecision(precision))
}

export function calculateMinMaxValue(array, minDiff = 1) {
    let valueMin = 18000000000000000000
    let valueMax = -9000000000000000000
    for(let i = 0; i < array.length; i++) {
        let value = array[i]
        if(value < valueMin)
            valueMin = value
        if(value > valueMax)
            valueMax = value
    }
    if(minDiff && valueMax === valueMin)
        valueMax = valueMin + minDiff
    return [valueMin, valueMax]
}

/*
** @param a, b        - values (Object, RegExp, Date, etc.)
** @returns {boolean} - true if a and b are the object or same primitive value or
**                      have the same properties with the same values
*/
export function objectTester(a, b) {
  
    // If a and b reference the same value, return true
    if (a === b) return true
  
    // If a and b aren't the same type, return false
    if (typeof a != typeof b) return false
  
    // Already know types are the same, so if type is number
    // and both NaN, return true
    if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true
  
    // Get internal [[Class]]
    var aClass = getClass(a)
    var bClass = getClass(b)
  
    // Return false if not same class
    if (aClass != bClass) return false
  
    // If they're Boolean, String or Number objects, check values
    if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
        return a.valueOf() == b.valueOf()
    }
  
    // If they're RegExps, Dates or Error objects, check stringified values
    if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
        return a.toString() == b.toString()
    }
  
    // Otherwise they're Objects, Functions or Arrays or some kind of host object
    if (typeof a == 'object' || typeof a == 'function') {
  
        // For functions, check stringified values are the same
        // Almost certainly false if a and b aren't trivial
        // and are different functions
        if (aClass == '[object Function]' && a.toString() != b.toString()) return false

        var aKeys = Object.keys(a)
        var bKeys = Object.keys(b)

        // If they don't have the same number of keys, return false
        if (aKeys.length != bKeys.length) return false

        // Check they have the same keys
        if (!aKeys.every(function(key){return b.hasOwnProperty(key)})) return false

        // Check key values - uses ES5 Object.keys
        return aKeys.every(function(key){
            return objectTester(a[key], b[key])
        })
    }
    return false
}
// Helper to return a value's internal object [[Class]]
// That this returns [object Type] even for primitives
function getClass(obj) {
    return Object.prototype.toString.call(obj)
}