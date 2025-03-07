import { objectTester, calculateMinMaxValue, formatNumberForDisplay } from "./UIUtils"
import UITableBase from "./UITableBase"

export default class UITable extends UITableBase {
    get selecting() {
        return super.selecting;
    }
    set selecting(selecting) {
        if(objectTester(this.selecting, selecting))
            return;
        this.#tableElement.querySelectorAll(`input`)?.forEach(element => { element.parentElement.textContent = formatNumberForDisplay(element.parentElement.value); });
        let startElement = [...this._valueElement.children].find(element => element.x===selecting.startX && element.y===selecting.startY);
        if(isNaN(selecting.startX))
            startElement = [...this._yAxisElement.children].find(element => element.y===selecting.startY);
        if(isNaN(selecting.startY))
            startElement = [...this._xAxisElement.children].find(element => element.x===selecting.startX);
        if(startElement && this.#valueInputElement.parentElement !== startElement) {
            this.#valueInputElement.value = startElement.value;
            startElement.replaceChildren(this.#valueInputElement);
        }
        super.selecting = selecting;
    }
    //axis properties
    get xResolutionModifiable() {
        return !this.#xResolutionDragElement.hidden;
    }
    set xResolutionModifiable(xResolutionModifiable) {
        this.#xResolutionDragElement.hidden = !xResolutionModifiable;
        this._xResolutionElement.hidden = !xResolutionModifiable;
        if(this.yResolutionModifiable && xResolutionModifiable)
            this.#resolutionTextElement.hidden = false;
        else 
            this.#resolutionTextElement.hidden = true;
        if(this.yResolutionModifiable || xResolutionModifiable) {
            this.#xyResolutionDragElement.hidden = false;
            this.#resolutionElement.hidden = false;
        } else {
            this.#xyResolutionDragElement.hidden = true;
            this.#resolutionElement.hidden = true;
        }
    }
    get yResolutionModifiable() {
        return !this.#yResolutionDragElement.hidden;
    }
    set yResolutionModifiable(yResolutionModifiable) {
        this.#yResolutionDragElement.hidden = !yResolutionModifiable;
        this._yResolutionElement.hidden = !yResolutionModifiable;
        if(this.xResolutionModifiable && yResolutionModifiable)
            this.#resolutionTextElement.hidden = false;
        else 
            this.#resolutionTextElement.hidden = true;
        if(this.xResolutionModifiable || yResolutionModifiable) {
            this.#xyResolutionDragElement.hidden = false;
            this.#resolutionElement.hidden = false;
        } else {
            this.#xyResolutionDragElement.hidden = true;
            this.#resolutionElement.hidden = true;
        }
    }

    //Label properties
    get xLabel() {
        return this.#xLabel;
    }
    set xLabel(xLabel) {
        if(this.#xLabel === xLabel)
            return;
        this.#xLabel = xLabel;
        this.#xLabelElement.replaceChildren(xLabel ?? ``);
    }
    get yLabel() {
        return this.#yLabel;
    }
    set yLabel(yLabel) {
        if(this.#yLabel === yLabel)
            return;
        this.#yLabel = yLabel;
        this.#yLabelElement.replaceChildren(yLabel ?? ``);
    }
    get zLabel() {
        return this.#zLabel;
    }
    set zLabel(zLabel) {
        if(this.#zLabel === zLabel)
            return;
        this.#zLabel = zLabel;
        this.#zLabelElement.replaceChildren(zLabel ?? ``);
    }

    //table entry number attributes
    get step() {
        return this.#valueInputElement.step;
    }
    set step(step) {
        this.#valueInputElement.step = step;
    }
    get min() {
        return this.#valueInputElement.min;
    }
    set min(min) {
        this.#valueInputElement.min = min;
    }
    get max() {
        return this.#valueInputElement.max;
    }
    set max(max) {
        this.#valueInputElement.max = max;
    }

    //trail properties
    trailTime = 2000;

    //elements
    #modifyElement          = document.createElement(`div`);
    #modifyAddElement       = document.createElement(`div`);
    #modifySubtractElement  = document.createElement(`div`);
    #modifyMultiplyElement  = document.createElement(`div`);
    #modifyDivideElement    = document.createElement(`div`);
    #modifyPercentElement   = document.createElement(`div`);
    #modifyEqualElement     = document.createElement(`div`);
    #modifyValueElement     = document.createElement(`input`);

    #interpolateElement     = document.createElement(`div`);
    #interpolateXElement    = document.createElement(`div`);
    #interpolateYElement    = document.createElement(`div`);
    #interpolateXYElement   = document.createElement(`div`);

    #resolutionElement      = document.createElement(`div`);
    _xResolutionElement     = document.createElement(`input`);
    _yResolutionElement     = document.createElement(`input`);
    #resolutionTextElement  = document.createElement(`span`);

    #pasteOptionsElement    = document.createElement(`div`);
    #pasteEqualElement      = document.createElement(`div`);
    #pasteAddElement        = document.createElement(`div`);
    #pasteSubtractElement   = document.createElement(`div`);
    #pasteMultiplyElement   = document.createElement(`div`);
    #pasteMultiplyPElement  = document.createElement(`div`);
    #pasteMultiplyP2Element = document.createElement(`div`);
    
    #toolbarElement         = document.createElement(`div`);
    #rightToolbarElement    = document.createElement(`div`);
    #leftToolbarElement     = document.createElement(`div`);

    #trailElement = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
    #tableElement = document.createElement(`table`);
    #xLabelElement = document.createElement(`div`);
    #xLabel = undefined;
    #yLabelElement = document.createElement(`div`);
    #yLabel = undefined;
    #zLabelElement = document.createElement(`div`);
    #zLabel = undefined;
    #xyResolutionDragElement = document.createElement(`td`);
    #xResolutionDragElement = document.createElement(`td`);
    #yResolutionDragElement = document.createElement(`td`);
    _xAxisElement = document.createElement(`div`);
    _yAxisElement = document.createElement(`div`);
    _valueElement       = document.createElement(`div`);
    #valueInputElement  = document.createElement(`input`);

    constructor(prop) {
        super();
        this.class = `ui`;
        //toolbar
        this.append(this.#toolbarElement);
        this.#toolbarElement.class = `toolbar`;
        this.#toolbarElement.append(this.#leftToolbarElement);
        this.#leftToolbarElement.class = `lefttoolbar`;
        this.#toolbarElement.append(this.#rightToolbarElement);
        this.#rightToolbarElement.class = `righttoolbar`;
        //resolution toolbar
        this.#leftToolbarElement.append(this.#resolutionElement);
        this.#resolutionElement.class = `resolution container`;
        this.#resolutionElement.append(this._xResolutionElement);
        this.#resolutionElement.append(this.#resolutionTextElement);
        this.#resolutionElement.append(this._yResolutionElement);
        this._xResolutionElement.type       = `number`;
        this._xResolutionElement.class      = `resolution-value`;
        this._yResolutionElement.type       = `number`;
        this._yResolutionElement.class      = `resolution-value`;
        this.#resolutionTextElement.textContent = `X`;
        //paste options toolbar
        this.#leftToolbarElement.append(this.#pasteOptionsElement);
        this.#pasteOptionsElement.class = `paste container`;
        this.#pasteOptionsElement.append(this.#pasteEqualElement);
        this.#pasteOptionsElement.append(this.#pasteAddElement);
        this.#pasteOptionsElement.append(this.#pasteSubtractElement);
        this.#pasteOptionsElement.append(this.#pasteMultiplyElement);
        this.#pasteOptionsElement.append(this.#pasteMultiplyPElement);
        this.#pasteOptionsElement.append(this.#pasteMultiplyP2Element);
        this.#pasteEqualElement.class           = `paste-button equal selected`;
        this.#pasteEqualElement.value           = `equal`;
        this.#pasteAddElement.class             = `paste-button add`;
        this.#pasteAddElement.value             = `add`;
        this.#pasteSubtractElement.class        = `paste-button subtract`;
        this.#pasteSubtractElement.value        = `subtract`;
        this.#pasteMultiplyElement.class        = `paste-button multiply`;
        this.#pasteMultiplyElement.value        = `multiply`;
        this.#pasteMultiplyPElement.class       = `paste-button multiplyp`;
        this.#pasteMultiplyPElement.value       = `multiply%`;
        this.#pasteMultiplyP2Element.class      = `paste-button multiplyp2`;
        this.#pasteMultiplyP2Element.value      = `multiply%/2`;
        this.#pasteMultiplyP2Element.innerHTML  = `<span><sup>%</sup>&frasl;<sub>2</sub></span>`;
        //modify toolbar
        this.#rightToolbarElement.append(this.#modifyElement);
        this.#modifyElement.class = `modify container`;
        this.#modifyElement.append(this.#modifyValueElement);
        this.#modifyElement.append(this.#modifyAddElement);
        this.#modifyElement.append(this.#modifySubtractElement);
        this.#modifyElement.append(this.#modifyMultiplyElement);
        this.#modifyElement.append(this.#modifyDivideElement);
        this.#modifyElement.append(this.#modifyPercentElement);
        this.#modifyElement.append(this.#modifyEqualElement);
        this.#modifyValueElement.type       = `number`;
        this.#modifyValueElement.class      = `modify-value`;
        this.#modifyAddElement.class        = `modify-button add`;
        this.#modifySubtractElement.class   = `modify-button subtract`;
        this.#modifyMultiplyElement.class   = `modify-button multiply`;
        this.#modifyDivideElement.class     = `modify-button divide`;
        this.#modifyPercentElement.class    = `modify-button percent`;
        this.#modifyEqualElement.class      = `modify-button equal`;
        this.#modifySubtractElement.hidden  = true;
        this.#modifyDivideElement.hidden    = true;
        this.#modifyPercentElement.hidden    = true;
        //interpolate toolbar
        this.#rightToolbarElement.append(this.#interpolateElement);
        this.#interpolateElement.class = `interpolate container`;
        this.#interpolateElement.append(this.#interpolateXElement);
        this.#interpolateElement.append(this.#interpolateYElement);
        this.#interpolateElement.append(this.#interpolateXYElement);
        this.#interpolateXElement.class     = `modify-button interpolatex`;
        this.#interpolateYElement.class     = `modify-button interpolatey`;
        this.#interpolateXYElement.class    = `modify-button interpolatexy`;
        //trail
        this.#trailElement.style = `position:absolute; pointer-events: none;" z-index="100`;
        this.#trailElement.setAttribute(`overflow`, `visible`);
        this.#trailElement.setAttribute(`width`, 100);
        this.#trailElement.setAttribute(`height`, 60);
        this.#trailElement.classList.add(`trail`);
        //table
        this.append(this.#tableElement);
        this.#tableElement.class  = `numerictable`;
        this.#xLabelElement.class = `xLabel`;
        this.#yLabelElement.class = `yLabel`;
        this.#zLabelElement.class = `zLabel`;
        this._xAxisElement.class  = `xAxis`;
        this._yAxisElement.class  = `yAxis`;
        this._valueElement.class  = `value`;
        this.#valueInputElement.type = `number`;
        this.#xResolutionDragElement.class = `xdrag`;
        this.#xResolutionDragElement.rowSpan = 2;
        this.#yResolutionDragElement.class = `ydrag`;
        this.#yResolutionDragElement.colSpan = 2;
        this.#xyResolutionDragElement.class = `xydrag`;
        if(prop) {
            const propValue = prop.value;
            delete prop.value;
            Object.assign(this, prop);
            this.value = propValue;
        }

        this.#buildTableElement();

        this.#constructTableEventListeners();
        this.#constructModifyEventListeners();
        this.#constructInterpolateEventListeners();
    }
    static #cellValueGetterSetter = {
        get: function() { return this._value; },
        set: function(value) { 
            value = parseFloat(value);
            if(this._value === value)
                return;
            this._value = value;
            this.style.setProperty(`--data-value`, value);
            const inputElement = this.children[0]
            if(inputElement?.tagName === `INPUT`) inputElement.value = value
            else {
                this.textContent = formatNumberForDisplay(value);
            }
        }
    }

    trail(x, y = 0, z) {
        const xAxis = this.xAxis;
        const yAxis = this.yAxis;
        const cellWidth = this._valueElement.firstChild.offsetWidth;
        const cellHeight = this._valueElement.firstChild.offsetHeight;
        const cellX = this._valueElement.firstChild.offsetLeft;
        const celly = this._valueElement.firstChild.offsetTop;
        let xAxisIndex = xAxis.findIndex(tx => tx>x);
        if(xAxisIndex < 0) xAxisIndex = xAxis.length-1;
        else if(xAxisIndex > 0 && xAxisIndex < xAxis.length-1) xAxisIndex += (x - xAxis[xAxisIndex-1])/ (xAxis[xAxisIndex] - xAxis[xAxisIndex-1]) - 1;
        let yAxisIndex = yAxis.findIndex(ty => ty>y);
        if(yAxisIndex < 0) yAxisIndex = yAxis.length-1;
        else if(yAxisIndex > 0 && yAxisIndex < yAxis.length-1) yAxisIndex += (y - yAxis[yAxisIndex-1])/ (yAxis[yAxisIndex] - yAxis[yAxisIndex-1]) - 1;
        x = cellX + xAxisIndex * cellWidth + cellWidth/2;
        y = celly + yAxisIndex * cellHeight + cellHeight/2;

        let ellipse;
        if(this.#trailElement.children.length > 0) {
            ellipse = this.#trailElement.firstChild;
            let line = document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute(`x1`, ellipse.getAttribute(`cx`));
            line.setAttribute(`y1`, ellipse.getAttribute(`cy`));
            line.setAttribute(`x2`, x);
            line.setAttribute(`y2`, y);
            if(this.#trailElement.children.length > 1)
                this.#trailElement.insertBefore(line, this.#trailElement.children[1]);
            else
                this.#trailElement.append(line);
        } else {
            ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
            this.#trailElement.append(ellipse);
        }
        ellipse.setAttribute(`rx`, cellWidth/2);
        ellipse.setAttribute(`ry`, cellHeight/2);
        ellipse.setAttribute(`cx`, x);
        ellipse.setAttribute(`cy`, y);

        setTimeout(() => {
            let last = this.#trailElement.lastChild;
            if(last)
                this.#trailElement.removeChild(last);
        }, this.trailTime);
    }

    #buildTableElement() {
        let newChildren = [];
        const xResolution = this._xAxisElement.children.length;
        const yResolution = this._yAxisElement.children.length;
        //row 0
        if(xResolution > 1 && yResolution > 1) {
            const row0          = document.createElement(`tr`);
            newChildren.push(row0);
            const xLabelBlank   = row0.appendChild(document.createElement(`td`));
            xLabelBlank.colSpan = 3;
            const xLabelTd      = row0.appendChild(document.createElement(`td`));
            xLabelTd.class      = `xtrans`;
            xLabelTd.append(this.#xLabelElement);
        }
        //row1
        const row1 = document.createElement(`tr`);
        newChildren.push(row1);
        if(xResolution > 1) {
            const xzAxisLabel   = row1.appendChild(document.createElement(`td`));
            xzAxisLabel.class   = `xztrans`;
            if(yResolution > 1) {
                xzAxisLabel.colSpan = 3;
                xzAxisLabel.append(this.#zLabelElement);
            } else {
                xzAxisLabel.append(this.#xLabelElement);
            }
            const xAxisTd = row1.appendChild(document.createElement(`td`));
            xAxisTd.append(this._xAxisElement);
            row1.append(this.#xResolutionDragElement);
        } else if (yResolution > 1) {
            const yLabelTd      = row1.appendChild(document.createElement(`td`));
            yLabelTd.append(this.#yLabelElement);
            const zLabelTd      = row1.appendChild(document.createElement(`td`));
            zLabelTd.append(this.#zLabelElement);
        }
        //row2/3
        const row2 = document.createElement(`tr`);
        newChildren.push(row2);
        const row3 = document.createElement(`tr`);
        newChildren.push(row3);
        if (yResolution > 1) {
            if(xResolution > 1) {
                row2.appendChild(document.createElement(`td`)).style = `width: auto; min-width: 2em;`;//auto width to take up zLabel slack
                const yAxisLabel = row2.appendChild(document.createElement(`td`));
                yAxisLabel.class = `ytrans`;
                yAxisLabel.append(this.#yLabelElement);
                row3.appendChild(document.createElement(`td`)).colSpan = 2;// pick up slack for ydrag
            }
            const yAxisTd = row2.appendChild(document.createElement(`td`));
            yAxisTd.class = `yAxis`;
            yAxisTd.append(this._yAxisElement)
            row3.append(this.#yResolutionDragElement);
            row3.append(this.#xyResolutionDragElement);
        } else if (xResolution > 1) {
            const xAxisLabel    = row2.appendChild(document.createElement(`td`));
            xAxisLabel.class    = `xztrans`
            xAxisLabel.append(this.#zLabelElement);
        }
        const valueTd = row2.appendChild(document.createElement(`td`));
        valueTd.append(this.#trailElement);
        valueTd.append(this._valueElement);
        this.#tableElement.replaceChildren(...newChildren);
    }

    _resolutionChanged(axisElements, axisResolution) {
        while(axisResolution < axisElements.children.length) { axisElements.removeChild(axisElements.lastChild); }
        for(let i = axisElements.children.length; i < axisResolution; i++) { 
            const axisElement = axisElements.appendChild(document.createElement(`div`)); 
            Object.defineProperty(axisElement, 'value', UITable.#cellValueGetterSetter);
            const axisMinus1 = axisElements.children[i-1]?.value;
            const axisMinus2 = axisElements.children[i-2]?.value;
            let axisMinus0 = 0;
            if(axisMinus1 != undefined && axisMinus2 != undefined)
                axisMinus0 = axisMinus1 + (axisMinus1 - axisMinus2);
            axisElement.value = axisMinus0;
            if(axisElements === this._xAxisElement)
                axisElement.x = i;
            else
                axisElement.y = i;
        }
        this.style.setProperty('--xresolution', this.xResolution);
        this.style.setProperty('--yresolution', this.yResolution);
        while(this.xResolution * this.yResolution < this._valueElement.children.length) { this._valueElement.removeChild(this._valueElement.lastChild); }
        for(let i = 0; i < this.xResolution * this.yResolution; i++) { 
            const valueElement = this._valueElement.children[i] ?? this._valueElement.appendChild(document.createElement(`div`));
            Object.defineProperty(valueElement, 'value', UITable.#cellValueGetterSetter);
            valueElement.x = i % this.xResolution;
            valueElement.y = Math.trunc(i/this.xResolution);
        }
        if(this.xResolution > 1) {
            if(this.yResolution > 1) {
                this.#interpolateElement.classList.add(`interpolatexy`);
                this.#interpolateXYElement.hidden = false;
            } else {
                this.#interpolateElement.classList.remove(`interpolatexy`);
                this.#interpolateXYElement.hidden = true;
            }
            this.#interpolateXElement.hidden = false;
        }
        else {
            this.#interpolateElement.classList.remove(`interpolatexy`);
            this.#interpolateXYElement.hidden = true;
            this.#interpolateXElement.hidden = true;
        }
        if(this.yResolution > 1)
            this.#interpolateYElement.hidden = false;
        else
            this.#interpolateYElement.hidden = true;
            
        this.#buildTableElement();
    }

    //event listeners
    #constructTableEventListeners() {
        const minmax = () => {
            const minmax = calculateMinMaxValue(this.value);
            this._valueMin = minmax[0];
            this._valueMax = minmax[1];
        }
        this.addEventListener(`change`, minmax);
        minmax();
        this.#pasteOptionsElement.addEventListener(`click`, event => {
            let target = event.target;
            for(let i=0; i < 2; i++) if(!target.value) target = target.parentElement;
            if(target.value) {
                this.#pasteOptionsElement.querySelectorAll(`.selected`).forEach(element => { element.classList.remove(`selected`) });
                target.classList.add(`selected`);
            }
        });
        this._xResolutionElement.addEventListener(`change`, event => {
            this.xResolution = parseInt(event.target.value);
        });
        this._yResolutionElement.addEventListener(`change`, event => {
            this.yResolution = parseInt(event.target.value);
        });
        const valueInputChange = () => {
            if(!this.#valueInputElement.parentElement)
                return;
            let x = parseInt(this.#valueInputElement.parentElement.x);
            let y = parseInt(this.#valueInputElement.parentElement.y);
            const oldVal = parseFloat(this.#valueInputElement.parentElement.value);
            let value = parseFloat(this.#valueInputElement.value);
            if(isNaN(value) || value === oldVal || (x==undefined && y==undefined))
                return;
            
            let element = this._valueElement;
            if(isNaN(y))
                element = this._xAxisElement;
            else if(isNaN(x))
                element = this._yAxisElement;

            let operation = `equal`;
            // if(value - oldVal === Math.floor(oldVal+1) - oldVal) {
            //     operation = `increment`;
            //     value = oldVal + 1;
            // } else if(value - oldVal === Math.ceil(oldVal-1) - oldVal) {
            //     operation = `decrement`;
            //     value = oldVal - 1;
            // }
            element.querySelectorAll(`.selected`).forEach(selectedElement => {
                if(operation === `increment`)
                    selectedElement.value = parseFloat(selectedElement.value) + 1
                else if(operation === `decrement`)
                    selectedElement.value = parseFloat(selectedElement.value) - 1;
                else
                    selectedElement.value = value;
            });

            this._boundAxis(element);
        }
        this.#valueInputElement.addEventListener(`change`, valueInputChange); 

        this.#valueInputElement.addEventListener(`copy`, event => {
            let copyData = ``;

            let currentY;
            this.#tableElement.querySelectorAll(`.selected`).forEach(element => {
                if(isNaN(parseFloat(element.value)))
                    return;
                if(element.y == undefined && element.x == undefined)
                    return;
                let y = parseInt(element.y ?? -1);
                if(currentY != undefined) {
                    if(currentY !== y) {
                        copyData += `\n`;
                    } else {
                        copyData += `\t`;
                    }
                }
                copyData += element.value;
                currentY = y;
            })

            event.clipboardData.setData(`text/plain`, copyData);
            event.preventDefault()
        });

        this.#valueInputElement.addEventListener(`paste`, event => {
            var val = event.clipboardData.getData(`text/plain`);
            const lines = val.split(`\n`).length;
            const cols = val.split(`\t`).length;
            let x = parseInt(event.target.parentElement.x);
            let y = parseInt(event.target.parentElement.y);
            let element = this._valueElement;
            if(isNaN(x)) {
                if(cols > 1)
                    return;
                x = 0;
                element = this._yAxisElement;
            }
            if(isNaN(y)) {
                if(lines > 1)
                    return;
                y = 0;
                element = this._xAxisElement;
            }

            let special = this.#pasteOptionsElement.querySelector(`.selected`)?.value;

            val.split(`\n`).forEach((val, yIndex) => {
                var yPos = y + yIndex;
                if(yPos > this.yResolution - 1)
                    return;
                if(element === this._valueElement)
                    yPos *= this.xResolution;
                val.split(`\t`).forEach((val, xIndex) => {
                    var xPos = x + xIndex;
                    if(xPos > this.xResolution - 1)
                        return;

                    var v = parseFloat(val);

                    let numberElement = element.children[xPos + yPos];
                    switch(special)
                    {
                        case `add`:
                            numberElement.value += v;
                            break;
                        case `subtract`:
                            numberElement.value -= v;
                            break;
                        case `multiply`:
                            numberElement.value *= v;
                            break;
                        case `multiply%`:
                            numberElement.value *= 1 + (v/100);
                            break;
                        case `multiply%/2`:
                            numberElement.value *= 1 + (v/200);
                            break;
                        case `average`:
                            numberElement.value += v;
                            numberElement.value /= 2;
                            break;
                        default:
                            numberElement.value = v;
                            break;
                    }
                });
            });
            this.selecting = {
                startX: x,
                startY: y,
                endX: x + val.split(`\n`)[0].split(`\t`).length - 1,
                endY: y + val.split(`\n`).length - 1
            }
            event.preventDefault()
            this._boundAxis(element);
            this.dispatchEvent(new Event(`change`, {bubbles: true}));
        });

        this.#tableElement.addEventListener(`dragstart`, event => {
            event.preventDefault()
        });

        let dragX = false;
        let dragY = false;
        let selecting = false;

        const mouseMoveEvent = event => {
            move(event.pageX, event.pageY);
        }
        const touchMoveEvent = event => {
            var touch = event.touches[event.touches.length - 1];
            move(touch.pageX, touch.pageY);
        }

        const move = (pageX, pageY) => {
            if(dragX) {
                var width = this._xAxisElement.firstChild.offsetWidth;
                let diff = (pageX-dragX.startPageX)/width;
                const polarity = diff / Math.abs(diff);
                diff = parseInt((Math.abs(diff) + 1/2) * polarity);
                let xResolution = dragX.startXResolution + diff;
                if(xResolution < 2)
                    xResolution = 2;
                this.xResolution = xResolution;
            }
            if(dragY) {
                var height = this._yAxisElement.firstChild.offsetHeight;
                let diff = (pageY-dragY.startPageY)/height;
                const polarity = diff / Math.abs(diff);
                diff = parseInt((Math.abs(diff) + 1/2) * polarity);
                let yResolution = dragY.startYResolution + diff;
                if(yResolution < 2)
                    yResolution = 2;
                this.yResolution = yResolution;
            }
            if(selecting) {
                var rect = selecting.startElement.getBoundingClientRect();
                let xDiff = pageX - rect.left;
                if(xDiff < 0)
                    xDiff -= rect.width;
                let yDiff = pageY - rect.top;
                if(yDiff < 0)
                    yDiff -= rect.height;
                xDiff = parseInt(xDiff/rect.width);
                yDiff = parseInt(yDiff/rect.height);
                selecting.endX = Math.min(this.xResolution-1, Math.max(0, selecting.startX + xDiff));
                selecting.endY = Math.min(this.yResolution-1, Math.max(0, selecting.startY + yDiff));
                if(Math.abs(xDiff) > 0 || Math.abs(yDiff) > 0)
                    selecting.selectOnMove = false;
                if(!selecting.selectOnMove) {
                    this.selecting = {
                        startX: selecting.startX,
                        startY: selecting.startY,
                        endX: selecting.endX,
                        endY: selecting.endY
                    }
                }
            }
        }

        let addSelectNumber = false;
        const up = () => {
            dragX = false;
            dragY = false;
            if(selecting) {
                const targetIsDataValue = selecting.startElement.x != undefined || selecting.startElement.y != undefined;
                if(addSelectNumber) {
                    if(targetIsDataValue) {
                        this.#valueInputElement.select();
                    }
                }
            }
            selecting = false;
            document.removeEventListener(`touchmove`, touchMoveEvent);
            document.removeEventListener(`mousemove`, mouseMoveEvent);

        }
        document.addEventListener(`mouseup`, up);
        document.addEventListener(`touchend`, up);

        const down = event => {
            addSelectNumber = false;
            const targetIsDataValue = event.target.x != undefined || event.target.y != undefined;
            const parentIsDataValue = event.target.parentElement.x != undefined || event.target.parentElement.y != undefined;
            if(targetIsDataValue || parentIsDataValue) {
                selecting = { startElement: targetIsDataValue? event.target : event.target.parentElement, selectOnMove: parentIsDataValue };
                selecting.startX = parseInt(selecting.startElement.x);
                selecting.startY = parseInt(selecting.startElement.y);
                if(targetIsDataValue) {
                    valueInputChange();
                    if(!selecting.selectOnMove) {
                        this.selecting = {
                            startX: selecting.startX,
                            startY: selecting.startY,
                            endX: selecting.startX,
                            endY: selecting.startY
                        }
                    }
                }
                if(event.target.type !== `number`) {
                    addSelectNumber = true;
                }
            }
            document.addEventListener(`touchmove`, touchMoveEvent);
            document.addEventListener(`mousemove`, mouseMoveEvent);
        }
        this.#tableElement.addEventListener(`mousedown`, event => {
            if(event.button === 2) {
                down(event);
                event.target.select?.();
                up(event);
                event.preventDefault()
            } else if(event.button == 0) {
                down(event);
            }
        });
        this.#tableElement.addEventListener(`contextmenu`, event => {
            down(event);
            event.preventDefault()
        });

        this.#xyResolutionDragElement.addEventListener(`mousedown`, event => {
            dragX = { startPageX: event.pageX, startXResolution: this.xResolution };
            dragY = { startPageY: event.pageY, startYResolution: this.yResolution };
            document.addEventListener(`mousemove`, mouseMoveEvent);
        });
        this.#xResolutionDragElement.addEventListener(`mousedown`, event => {
            dragX = { startPageX: event.pageX, startXResolution: this.xResolution };
            document.addEventListener(`mousemove`, mouseMoveEvent);
        });
        this.#yResolutionDragElement.addEventListener(`mousedown`, event => {
            dragY = { startPageY: event.pageY, startYResolution: this.yResolution };
            document.addEventListener(`mousemove`, mouseMoveEvent);
        });

    }
    #constructModifyEventListeners() {
        this.#valueInputElement.addEventListener(`keypress`, event => {
            //plus
            if(event.key === `+`) {
                event.preventDefault()
                this.#modifyValueElement.select();
                this.#modifyAddElement.classList.add(`selected`)
            }
            //minus
            if(event.shiftKey && (event.key === `-` || event.key === `_`)) {
                event.preventDefault()
                this.#modifyAddElement.hidden = true;
                this.#modifySubtractElement.hidden = false;
                this.#modifyValueElement.select();
                this.#modifySubtractElement.classList.add(`selected`)
            }
            //aterisk
            if(event.key === `*`) {
                event.preventDefault()
                this.#modifyValueElement.select();
                this.#modifyMultiplyElement.classList.add(`selected`)
            }
            //forward slash
            if(event.key === `/`) {
                event.preventDefault()
                this.#modifyMultiplyElement.hidden = true;
                this.#modifyDivideElement.hidden = false;
                this.#modifyValueElement.select();
                this.#modifyDivideElement.classList.add(`selected`)
            }
            //percent
            if(event.key === `%`) {
                event.preventDefault()
                this.#modifyMultiplyElement.hidden = true;
                this.#modifyPercentElement.hidden = false;
                this.#modifyValueElement.select();
                this.#modifyPercentElement.classList.add(`selected`)
            }
            //equals
            if(event.key === `=`) {
                event.preventDefault()
                this.#modifyValueElement.select();
                this.#modifyEqualElement.classList.add(`selected`)
            }
        });
        const modify = operation => {
            const value = parseFloat(this.#modifyValueElement.value);
            if(isNaN(value))
                return;
            
            let element = this._valueElement;
            if(this.#valueInputElement.parentElement.x == undefined)
                element = this._yAxisElement;
            if(this.#valueInputElement.parentElement.y == undefined)
                element = this._xAxisElement;
            element.querySelectorAll(`.selected`).forEach(selectedElement => {
                switch(operation) {
                    case `equal`:
                        selectedElement.value = value;
                        break;
                    case `add`:
                        selectedElement.value += value;
                        break;
                    case `subtract`:
                        selectedElement.value -= value;
                        break;
                    case `multiply`:
                        selectedElement.value *= value;
                        break;
                    case `divide`:
                        selectedElement.value /= value;
                        break;
                    case `percent`:
                        selectedElement.value *= 1 + (value/100);
                        break;
                    default:
                        return;
                }
            });

            this._boundAxis(element);
            this.dispatchEvent(new Event(`change`, {bubbles: true}));
        }
        const blur = () => {
            this.#modifyAddElement.hidden      = false;
            this.#modifySubtractElement.hidden = true;
            this.#modifyMultiplyElement.hidden = false;
            this.#modifyDivideElement.hidden   = true;
            this.#modifyPercentElement.hidden   = true;
            for(let i=0; i<this.#modifyElement.children.length; i++) this.#modifyElement.children[i].classList.remove(`selected`);
        }
        this.#modifyValueElement.addEventListener(`blur`, blur);
        this.#modifyValueElement.addEventListener(`keypress`, event => {
            if(event.key !== `Enter`)
                return;
            this.#modifyElement.querySelector(`.selected`)?.dispatchEvent(new Event(`click`));
            blur();
            this.#valueInputElement.select();
        });
        this.#modifyEqualElement.addEventListener(`click`, () => {
            modify(`equal`);
        });
        this.#modifyAddElement.addEventListener(`click`, () => {
            modify(`add`);
        });
        this.#modifySubtractElement.addEventListener(`click`, () => {
            modify(`subtract`);
        });
        this.#modifyMultiplyElement.addEventListener(`click`, () => {
            modify(`multiply`);
        });
        this.#modifyDivideElement.addEventListener(`click`, () => {
            modify(`divide`);
        });
        this.#modifyPercentElement.addEventListener(`click`, () => {
            modify(`percent`);
        });
    }
    #constructInterpolateEventListeners() {
        const interpolateX = () => {
            let selectedElements = this._valueElement.querySelectorAll(`.selected`);
            if(selectedElements.length < 3) {
                selectedElements = this._xAxisElement.querySelectorAll(`.selected`);
                if(selectedElements.length < 3)
                    return;
            }
            let xMin = 18000000000000000000;
            let xMax = -9000000000000000000;
            selectedElements.forEach(element => {
                const x = parseInt(element.x);
                if(x < xMin)
                    xMin = x;
                if(x > xMax)
                    xMax = x;
            });
            const xAxis = this.xAxis;
            const xDiff = xAxis[xMax] - xAxis[xMin];
            if(!isNaN(selectedElements[0].y)) {
                const xResolution = this.xResolution;
                const tableValue = this.value;
                selectedElements.forEach(element => {
                    const x = parseInt(element.x);
                    const y = parseInt(element.y);
                    if(!isNaN(x) && !isNaN(y)) {
                        const xMinVal = tableValue[xMin + y * xResolution];
                        const xMaxVal = tableValue[xMax + y * xResolution];
                        const xMag = (xMaxVal - xMinVal) / xDiff;
                        let value = xMinVal + xMag * (xAxis[x]-xAxis[xMin]);
                        element.value = value;
                    }
                });
            } else {
                const xMag = xDiff / (xMax - xMin);
                selectedElements.forEach(element => {
                    const x = parseInt(element.x);
                    element.value = xAxis[xMin] + xMag * (x-xMin);
                });
            }
            this.dispatchEvent(new Event(`change`, {bubbles: true}));
        };
        const interpolateY = () => {
            let selectedElements = this._valueElement.querySelectorAll(`.selected`);
            if(selectedElements.length < 3) {
                selectedElements = this._yAxisElement.querySelectorAll(`.selected`);
                if(selectedElements.length < 3)
                    return;
            }
            let yMin = 18000000000000000000;
            let yMax = -9000000000000000000;
            selectedElements.forEach(element => {
                const y = parseInt(element.y);
                if(y < yMin)
                    yMin = y;
                if(y > yMax)
                    yMax = y;
            });
            const yAxis = this.yAxis;
            const yDiff = yAxis[yMax] - yAxis[yMin];
            if(!isNaN(selectedElements[0].x)) {
                const xResolution = this.xResolution;
                const tableValue = this.value;
                selectedElements.forEach(element => {
                    const x = parseInt(element.x);
                    const y = parseInt(element.y);
                    if(!isNaN(x) && !isNaN(y)) {
                        const yMinVal = tableValue[x + yMin * xResolution];
                        const yMaxVal = tableValue[x + yMax * xResolution];
                        const yMag = (yMaxVal - yMinVal) / yDiff;
                        let value = yMinVal + yMag * (yAxis[y]-yAxis[yMin]);
                        element.value = value;
                    }
                });
            } else {
                const yMag = yDiff / (yMax - yMin);
                selectedElements.forEach(element => {
                    const y = parseInt(element.y);
                    element.value = yAxis[yMin] + yMag * (y-yMin);
                });
            }
            this.dispatchEvent(new Event(`change`, {bubbles: true}));
        };
        this.#interpolateXYElement.addEventListener(`click`, () => {
            const selectedElements = this._valueElement.querySelectorAll(`.selected`);
            if(selectedElements.length < 5) {
                if(this._xAxisElement.querySelectorAll(`.selected`).length > 2)
                    interpolateX();
                if(this._yAxisElement.querySelectorAll(`.selected`).length > 2)
                    interpolateY();
                return;
            }
            interpolateX();
            interpolateY();
        });
        this.#interpolateXElement.addEventListener(`click`, interpolateX);
        this.#interpolateYElement.addEventListener(`click`, interpolateY);
    }
}
customElements.define('ui-table', UITable, { extends: `div` });