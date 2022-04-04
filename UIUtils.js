let hiddenGetterSetter = {
    enumerable: true,
    get: function() {
        return this.style.display === `none`;
    },
    set: function(hidden) {
        if(hidden && this.style.display !== `none`) {
            if(this.style.display)
                this._previousDisplayValue = this.style.display;
            this.style.display = `none`;
        } else if(!hidden && this.style.display === `none`) {
            if(this._previousDisplayValue)
                this.style.display = this._previousDisplayValue;
            else 
                this.style.display = null;
            delete this._previousDisplayValue;
        }
    }
}
Object.defineProperty(HTMLElement.prototype, 'hidden', hiddenGetterSetter);
Object.defineProperty(SVGElement.prototype, 'hidden', hiddenGetterSetter);
Object.defineProperty(HTMLElement.prototype, 'class', {
    enumerable: true,
    set: function(pclass) {
        const thisClass = this;
        pclass.split(` `).forEach(function(pclass) { thisClass.classList.add(pclass); });
    }
});
function formatNumberForDisplay(value, precision = 6) {
    let formattedVaue = parseFloat(parseFloat(parseFloat(value).toFixed(precision -1)).toPrecision(precision));
    if(isNaN(formattedVaue))
        formattedVaue = `&nbsp;`;
    return formattedVaue;
}

function calculateMinMaxValue(array, minDiff = 1) {
    let valueMin = 18000000000000000000;
    let valueMax = -9000000000000000000;
    for(let i = 0; i < array.length; i++) {
        let value = array[i];
        if(value < valueMin)
            valueMin = value;
        if(value > valueMax)
            valueMax = value;
    }
    if(minDiff && valueMax === valueMin)
        valueMax = valueMin + minDiff;
    return [valueMin, valueMax];
}

/*
** @param a, b        - values (Object, RegExp, Date, etc.)
** @returns {boolean} - true if a and b are the object or same primitive value or
**                      have the same properties with the same values
*/
function objectTester(a, b) {
  
    // If a and b reference the same value, return true
    if (a === b) return true;
  
    // If a and b aren't the same type, return false
    if (typeof a != typeof b) return false;
  
    // Already know types are the same, so if type is number
    // and both NaN, return true
    if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;
  
    // Get internal [[Class]]
    var aClass = getClass(a);
    var bClass = getClass(b)
  
    // Return false if not same class
    if (aClass != bClass) return false;
  
    // If they're Boolean, String or Number objects, check values
    if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
        return a.valueOf() == b.valueOf();
    }
  
    // If they're RegExps, Dates or Error objects, check stringified values
    if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
        return a.toString() == b.toString();
    }
  
    // Otherwise they're Objects, Functions or Arrays or some kind of host object
    if (typeof a == 'object' || typeof a == 'function') {
  
        // For functions, check stringified values are the same
        // Almost certainly false if a and b aren't trivial
        // and are different functions
        if (aClass == '[object Function]' && a.toString() != b.toString()) return false;

        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);

        // If they don't have the same number of keys, return false
        if (aKeys.length != bKeys.length) return false;

        // Check they have the same keys
        if (!aKeys.every(function(key){return b.hasOwnProperty(key)})) return false;

        // Check key values - uses ES5 Object.keys
        return aKeys.every(function(key){
            return objectTester(a[key], b[key])
        });
    }
    return false;
}

function throttle(cb, delay = 100) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
      if (waitingArgs == null) {
        shouldWait = false
      } else {
        cb(...waitingArgs)
        waitingArgs = null
        setTimeout(timeoutFunc, delay)
      }
    }
  
    return (...args) => {
      if (shouldWait) {
        waitingArgs = args
        return
      }
  
      cb(...args)
      shouldWait = true
  
      setTimeout(timeoutFunc, delay)
    }
  }
  