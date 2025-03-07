import { objectTester, calculateMinMaxValue, formatNumberForDisplay } from "./UIUtils"
import UITableBase from "./UITableBase"

export default class UIGraph3D extends UITableBase {
    get xAxis() { return super.xAxis; }
    set xAxis(xAxis) {
        super.xAxis = xAxis;
        this._valueElement.update();
        this.#valuePathElement.update();
        this._xAxisElement.update();
        this._yAxisElement.update();
    }
    get yAxis() { return super.yAxis; }
    set yAxis(yAxis) {
        super.yAxis = yAxis;
        this._valueElement.update();
        this.#valuePathElement.update();
        this._xAxisElement.update();
        this._yAxisElement.update();
    }
    get selecting() {
        return super.selecting;
    }
    set selecting(selecting) {
        if(objectTester(this.selecting, selecting))
            return;
        this.#valuePathElement.querySelectorAll(`.selected`).forEach(element => { element.classList.remove(`selected`) });
        if(selecting) {
            if( selecting.startX != undefined && selecting.endX != undefined &&
                selecting.startY != undefined && selecting.endY != undefined) {
                for(let i=0; i<this.#valuePathElement.children.length; i++) {
                    let element = this.#valuePathElement.children[i];
                    if( Math.min(selecting.endX, selecting.startX) > parseInt(element.x1) ||
                        Math.max(selecting.endX, selecting.startX) < parseInt(element.x2) ||
                        Math.min(selecting.endY, selecting.startY) > parseInt(element.y1) ||
                        Math.max(selecting.endY, selecting.startY) < parseInt(element.y3)){
                        continue;
                    }
                    element.classList.add(`selected`); 
                }
            }
        }
        super.selecting = selecting;
    }
    get pitch() {
        return this.#pitch ?? 0;
    }
    set pitch(pitch) {
        pitch = Math.max(-90,Math.min(90,parseFloat(pitch)));
        if(this.pitch === pitch)
            return;
        this.#pitch = pitch;
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get yaw() {
        return this.#yaw ?? 0;
    }
    set yaw(yaw) {
        yaw = parseFloat(yaw);
        if(this.yaw === yaw)
            return;
        this.#yaw = yaw;
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get cameraX() {
        return this.#cameraX ?? 0;
    }
    set cameraX(cameraX) {
        cameraX = parseFloat(cameraX);
        if(this.cameraX === cameraX)
            return;
        this.#cameraX = cameraX;
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get cameraY() {
        return this.#cameraY ?? 0;
    }
    set cameraY(cameraY) {
        cameraY = parseFloat(cameraY);
        if(this.cameraY === cameraY)
            return;
        this.#cameraY = cameraY;
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get zoom() {
        return this.#zoom ?? 0.75;
    }
    set zoom(zoom) {
        zoom = parseFloat(zoom);
        if(this.zoom === zoom)
            return;
        this.#zoom = zoom;
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get width() {
        return this.#svgElement.getAttribute(`width`) ?? this.offsetWidth ?? 300;
    }
    set width(width) {
        this.#svgElement.setAttribute(`width`, parseFloat(width.toFixed(10)));
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }
    get height() {
        return this.#svgElement.getAttribute(`height`) ?? this.offsetHeight ?? 150;
    }
    set height(height) {
        this.#svgElement.setAttribute(`height`, parseFloat(height.toFixed(10)));
        this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
    }

    #floorElement       = document.createElementNS('http://www.w3.org/2000/svg','g');
    #zAxisElement       = document.createElementNS('http://www.w3.org/2000/svg','g');
    _xAxisElement       = document.createElementNS('http://www.w3.org/2000/svg','g');
    _yAxisElement       = document.createElementNS('http://www.w3.org/2000/svg','g');
    _valueElement       = document.createElementNS('http://www.w3.org/2000/svg','g');
    #valuePathElement   = document.createElementNS('http://www.w3.org/2000/svg','g');
    #svgElement         = document.createElementNS('http://www.w3.org/2000/svg','svg');

    #transformPrecalcPrivate;
    get #transformPrecalc() {
        return this.#transformPrecalcPrivate;
    }
    set #transformPrecalc(transformPrecalc) {
        if(objectTester(this.#transformPrecalcPrivate, transformPrecalc))
            return;
        this.#transformPrecalcPrivate = transformPrecalc;
        const r = transformPrecalc.zoom/(7.5 * Math.max(this.xResolution, this.yResolution));
        [...this._valueElement.children].forEach(element => { element.setAttribute(`r`, r.toFixed(10)); });
        this._valueElement.update();
        this.#valuePathElement.updateWithDepth();
        this._xAxisElement.update();
        this._yAxisElement.update();
        this.#zAxisElement.update();
        this.#floorElement.update();
    }
    #yaw;
    #pitch;
    #zoom;
    #cameraX;
    #cameraY;

    trail(x, y = 0, z) {/*TODO*/}
    
    get _valueMin() { return super._valueMin; }
    set _valueMin(valueMin) {
        super._valueMin = valueMin;
        this._valueElement.update();
        this.#valuePathElement.update();
        this.#zAxisElement.update();
    }
    get _valueMax() { return super._valueMax; }
    set _valueMax(valueMax) {
        super._valueMax = valueMax;
        this._valueElement.update();
        this.#valuePathElement.update();
        this.#zAxisElement.update();
    }

    constructor(prop) {
        super();
        this.class = `ui graph3d`;
        this.append(this.#svgElement);
        this.#svgElement.setAttribute(`overflow`, `visible`)
        this.#svgElement.append(this._xAxisElement);
        this.#svgElement.append(this._yAxisElement);
        this.#svgElement.append(this.#zAxisElement);
        this.#svgElement.append(this.#floorElement);
        this.#svgElement.append(this.#valuePathElement);
        this.#svgElement.append(this._valueElement);
        function update() {
            [...this.children].forEach(element => { element.update(); });
        }
        function updateWithDepth() {
            const children = [...this.children];
            children.forEach(element => { element.update(); });
            children.sort((a, b) => { return b.depth-a.depth; }).forEach(element => this.append(element));
        }
        this._xAxisElement.update = update;
        this._yAxisElement.update = update;
        this.#zAxisElement.update = update;
        this._valueElement.update = update;
        this.#valuePathElement.update = update;
        this.#valuePathElement.updateWithDepth = updateWithDepth;
        this.#floorElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`path`)).classList.add(`floor`);
        this.#floorElement.append(document.createElementNS(`http://www.w3.org/2000/svg`,`line`));
        this.#floorElement.append(document.createElementNS(`http://www.w3.org/2000/svg`,`line`));
        const thisClass = this;
        this.#floorElement.update = function() {
            const x = thisClass.#transformPrecalc.sinYaw > 0? 1 : 0;
            const y = thisClass.#transformPrecalc.cosYaw > 0? 0 : 1;
            const z = thisClass.#transformPrecalc.sinPitch > 0? 0 : 1;
            if(z === 1)
                this.children[0].style.display = `none`;
            else
                this.children[0].style.display = null;
            let lines = [[
                UIGraph3D.transformPoint([x-0.5, -(z-0.5)*Math.max(1,thisClass.height)/(Math.max(1, thisClass.width)), -0.5], thisClass.#transformPrecalc),
                UIGraph3D.transformPoint([x-0.5, -(z-0.5)*Math.max(1,thisClass.height)/(Math.max(1, thisClass.width)),  0.5], thisClass.#transformPrecalc)
            ],[
                UIGraph3D.transformPoint([-0.5, -(z-0.5)*Math.max(1,thisClass.height)/(Math.max(1, thisClass.width)), y-0.5], thisClass.#transformPrecalc),
                UIGraph3D.transformPoint([ 0.5, -(z-0.5)*Math.max(1,thisClass.height)/(Math.max(1, thisClass.width)), y-0.5], thisClass.#transformPrecalc)
            ]];
            lines[0] = lines[0].sort((a,b) => { return a[0]-b[0]});
            lines[0][2] = Math.abs(thisClass.#transformPrecalc.sinYaw);
            lines[1] = lines[1].sort((a,b) => { return a[0]-b[0]});
            lines[1][2] = Math.abs(thisClass.#transformPrecalc.cosYaw);
            lines = lines.sort((a,b) => { return a[0][0]-b[0][0]});
            this.children[1].setAttribute(`x1`, lines[0][0][0].toFixed(10));
            this.children[1].setAttribute(`y1`, lines[0][0][1].toFixed(10));
            this.children[1].setAttribute(`x2`, lines[0][1][0].toFixed(10));
            this.children[1].setAttribute(`y2`, lines[0][1][1].toFixed(10));
            this.children[2].setAttribute(`x1`, lines[1][0][0].toFixed(10));
            this.children[2].setAttribute(`y1`, lines[1][0][1].toFixed(10));
            this.children[2].setAttribute(`x2`, lines[1][1][0].toFixed(10));
            this.children[2].setAttribute(`y2`, lines[1][1][1].toFixed(10));

            const pathStart = UIGraph3D.transformPoint([0.5-x, -(z-0.5)*Math.max(1,thisClass.height)/(Math.max(1, thisClass.width)), 0.5-y], thisClass.#transformPrecalc);

            this.children[0].setAttribute(`d`, 
                            `M${pathStart[0].toFixed(10)},${pathStart[1].toFixed(10)}`+
                            `L${lines[0][0][0].toFixed(10)},${lines[0][0][1].toFixed(10)}`+
                            `L${lines[0][1][0].toFixed(10)},${lines[0][1][1].toFixed(10)}`+
                            `L${lines[1][1][0].toFixed(10)},${lines[1][1][1].toFixed(10)}Z`)
        }
        const propValue = prop.value;
        delete prop.value;
        Object.assign(this, prop);
        this.#createEventListeners();
        this.value = propValue;
        if(prop?.pitch == undefined)
            this.pitch = 17;
        if(prop?.yaw == undefined)
            this.yaw = 30;
    }
    static transformPrecalc({width = 0, height = 0, pitch = 0, yaw = 0, cameraX = 0, cameraY = 0, zoom = 1} = {}) {
        let cosPitch=Math.cos(pitch * (Math.PI / 180));
        let sinPitch=Math.sin(pitch * (Math.PI / 180));
        let cosYaw=Math.cos(yaw * (Math.PI / 180));
        let sinYaw=Math.sin(yaw * (Math.PI / 180));
        return {
            cosPitch,
            sinPitch,
            cosYaw,
            sinYaw,
            sinPitchSinYaw: sinPitch*sinYaw,
            nSinPitchCosYaw: -sinPitch*cosYaw,
            nCosPitchSinYaw: -cosPitch*sinYaw,
            cosPitchcosYaw: cosPitch*cosYaw,
            offsetX: width/2 - cameraX,
            offsetY: height/2 - cameraY,
            zoom: 0.7*width*zoom
        }
    }
    static transformPoint(point, transformPrecalc){
        if(!transformPrecalc)
            transformPrecalc = UIGraph3D.transformPrecalc();
        let x=(transformPrecalc.cosYaw*point[0]+transformPrecalc.sinYaw*point[2])*transformPrecalc.zoom+transformPrecalc.offsetX;
        if(isNaN(x)) x = 0;
        let y=(transformPrecalc.sinPitchSinYaw*point[0]+transformPrecalc.cosPitch*point[1]+transformPrecalc.nSinPitchCosYaw*point[2])*transformPrecalc.zoom+transformPrecalc.offsetY;
        if(isNaN(y)) y = 0;
        let depth=(transformPrecalc.nCosPitchSinYaw*point[0]+transformPrecalc.sinPitch*point[1])*transformPrecalc.zoom;
        if(isNaN(depth)) depth = 0;
        return [x,y,depth];
    }
    #cellToPoint(x, y, value) {
        const xAxisElements = this._xAxisElement.children;
        const xMin = xAxisElements[0]?.value;
        const xMax = xAxisElements[xAxisElements.length -1]?.value;
        const xVal = xAxisElements[x]?.value;
        const yAxisElements = this._yAxisElement.children;
        const yMin = yAxisElements[0]?.value;
        const yMax = yAxisElements[yAxisElements.length -1]?.value;
        const yVal = yAxisElements[y]?.value;
        if(isNaN(value))
            return;
        y = this.yResolution-y-1;
        x = (xVal-xMin)/(xMax-xMin);
        if(isNaN(x))
            x = 0;
        y = (yVal-yMin)/(yMax-yMin);
        if(isNaN(y))
            y = 0;
        value = (value-this._valueMin)/(this._valueMax-this._valueMin);
        return UIGraph3D.transformPoint([x-0.5, -(value-0.5)*Math.max(1,this.height)/(Math.max(1, this.width)), y-0.5], this.#transformPrecalc);
    }
    #axisToLine(x, y) {
        const xAxisElements = this._xAxisElement.children;
        const xMin = xAxisElements[0]?.value;
        const xMax = xAxisElements[xAxisElements.length -1]?.value;
        const xVal = xAxisElements[x]?.value;
        const yAxisElements = this._yAxisElement.children;
        const yMin = yAxisElements[0]?.value;
        const yMax = yAxisElements[yAxisElements.length -1]?.value;
        const yVal = yAxisElements[y]?.value;
        y = this.yResolution-y-1;
        if(x == undefined || isNaN(x))
            x = this.#transformPrecalc?.sinYaw > 0? 0 : 1;
        else
            x = (xVal-xMin)/(xMax-xMin);
        if(isNaN(x))
            x = 0;
        if(y == undefined || isNaN(y))
            y = this.#transformPrecalc?.cosYaw > 0? 1 : 0;
        else
            y = (yVal-yMin)/(yMax-yMin);
        if(isNaN(y))
            y = 0;
        return [
            UIGraph3D.transformPoint([x-0.5,  0.5*Math.max(1,this.height)/(Math.max(1, this.width)), y-0.5], this.#transformPrecalc),
            UIGraph3D.transformPoint([x-0.5, -0.5*Math.max(1,this.height)/(Math.max(1, this.width)), y-0.5], this.#transformPrecalc)
        ];
    }
    #zAxisToLines(z) {
        const x = this.#transformPrecalc.sinYaw > 0? 0 : 1;
        const y = this.#transformPrecalc.cosYaw > 0? 1 : 0;
        z = (z-this._valueMin)/(this._valueMax-this._valueMin);
        return [[
            UIGraph3D.transformPoint([x-0.5, -(z-0.5)*Math.max(1,this.height)/(Math.max(1, this.width)), -0.5], this.#transformPrecalc),
            UIGraph3D.transformPoint([x-0.5, -(z-0.5)*Math.max(1,this.height)/(Math.max(1, this.width)),  0.5], this.#transformPrecalc)
        ],[
            UIGraph3D.transformPoint([-0.5, -(z-0.5)*Math.max(1,this.height)/(Math.max(1, this.width)), y-0.5], this.#transformPrecalc),
            UIGraph3D.transformPoint([ 0.5, -(z-0.5)*Math.max(1,this.height)/(Math.max(1, this.width)), y-0.5], this.#transformPrecalc)
        ]];
    }

    _resolutionChanged(axisElements, axisResolution) {
        const thisClass = this;
        const textSize = (0.45/Math.max(this.xResolution, this.yResolution, axisResolution));
        while(axisResolution < axisElements.children.length) { axisElements.removeChild(axisElements.lastChild); }
        for(let i = 0; i < axisResolution; i++) { 
            let axisElement = axisElements.children[i];
            if(!axisElement) {
                axisElement = axisElements.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`g`)); 
                axisElement.append(document.createElementNS(`http://www.w3.org/2000/svg`,`line`));
                const textTop = axisElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`text`));
                textTop.setAttribute(`alignment-baseline`, `middle`);
                textTop.setAttribute(`text-anchor`, `end`);
                const textBottom = axisElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`text`));
                textBottom.setAttribute(`alignment-baseline`, `middle`);
                textBottom.setAttribute(`text-anchor`, `start`);
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
            axisElement.update = function() {
                if(!thisClass.#transformPrecalc)
                    return;
                const line = thisClass.#axisToLine(this.x, this.y);
                this.children[0].setAttribute(`x1`, line[0][0].toFixed(10));
                this.children[0].setAttribute(`y1`, line[0][1].toFixed(10));
                this.children[0].setAttribute(`x2`, line[1][0].toFixed(10));
                this.children[0].setAttribute(`y2`, line[1][1].toFixed(10));

                const textSize = this.textSize * thisClass.#transformPrecalc.zoom;
                const scalextext = Math.abs(this.x != undefined? thisClass.#transformPrecalc.cosYaw : thisClass.#transformPrecalc.sinYaw);
                const scaleytext = Math.abs(thisClass.#transformPrecalc.cosPitch);
                let xoffset = 0;
                if(this.x === 0)
                    xoffset = thisClass.#transformPrecalc.sinYaw<0? 0 : thisClass.#transformPrecalc.cosYaw * textSize/2;
                if(this.x === axisResolution-1)
                    xoffset = thisClass.#transformPrecalc.sinYaw>0? 0 : -thisClass.#transformPrecalc.cosYaw * textSize/2;
                if(this.y === 0)
                    xoffset = thisClass.#transformPrecalc.cosYaw>0? 0 : thisClass.#transformPrecalc.sinYaw * textSize/2;
                if(this.y === axisResolution-1)
                    xoffset = thisClass.#transformPrecalc.cosYaw<0? 0 : -thisClass.#transformPrecalc.sinYaw * textSize/2;
                line[0][0]+=xoffset;
                line[1][0]+=xoffset;
                this.children[1].setAttribute(`x`, line[0][0].toFixed(10));
                this.children[1].setAttribute(`y`, line[0][1].toFixed(10));
                this.children[1].setAttribute(`transform-origin`, `${line[0][0].toFixed(10)} ${line[0][1].toFixed(10)}`);
                this.children[1].setAttribute(`transform`, `scale(${scalextext.toFixed(10)} ${scaleytext.toFixed(10)}) rotate(-90)`);
                this.children[1].setAttribute(`font-size`, textSize.toFixed(10));
                this.children[2].setAttribute(`x`, line[1][0].toFixed(10));
                this.children[2].setAttribute(`y`, line[1][1].toFixed(10));
                this.children[2].setAttribute(`transform-origin`, `${line[1][0].toFixed(10)} ${line[1][1].toFixed(10)}`);
                this.children[2].setAttribute(`transform`, `scale(${scalextext.toFixed(10)} ${scaleytext.toFixed(10)}) rotate(-90)`);
                this.children[2].setAttribute(`font-size`, textSize.toFixed(10));
                this.children[1].textContent = this.children[2].textContent = formatNumberForDisplay(this.value);
            }
        }
        for(let i = 0; i < this._xAxisElement.children.length; i++) { this._xAxisElement.children[i].textSize = textSize; }
        for(let i = 0; i < this._yAxisElement.children.length; i++) { this._yAxisElement.children[i].textSize = textSize; }
        const zResolution = parseInt(1.5+Math.max(this.xResolution, this.yResolution));
        while(zResolution < this.#zAxisElement.children.length) { this.#zAxisElement.removeChild(this.#zAxisElement.lastChild); }
        for(let i = 0; i < zResolution; i++) {
            let axisElement = this.#zAxisElement.children[i];
            if(!axisElement) {
                axisElement = this.#zAxisElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`g`)); 
                axisElement.append(document.createElementNS(`http://www.w3.org/2000/svg`,`line`));
                axisElement.append(document.createElementNS(`http://www.w3.org/2000/svg`,`line`));
                const textLeft = axisElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`text`));
                textLeft.setAttribute(`alignment-baseline`, `middle`);
                textLeft.setAttribute(`text-anchor`, `end`);
                const textRight = axisElement.appendChild(document.createElementNS(`http://www.w3.org/2000/svg`,`text`));
                textRight.setAttribute(`alignment-baseline`, `middle`);
                textRight.setAttribute(`text-anchor`, `start`);
                axisElement.update = function() {
                    if(!thisClass.#transformPrecalc)
                        return;
                    const zMag = (thisClass._valueMax - thisClass._valueMin)/(this.zResolution-1);
                    let zValue = zMag * this.z + thisClass._valueMin;
                    if(this.z === (this.zResolution-1))
                        zValue = thisClass._valueMax;
                    let lines = thisClass.#zAxisToLines(zValue);
                    lines[0] = lines[0].sort((a,b) => { return a[0]-b[0]});
                    lines[0][2] = Math.abs(thisClass.#transformPrecalc.sinYaw);
                    lines[1] = lines[1].sort((a,b) => { return a[0]-b[0]});
                    lines[1][2] = Math.abs(thisClass.#transformPrecalc.cosYaw);
                    lines = lines.sort((a,b) => { return a[0][0]-b[0][0]});
                    this.children[0].setAttribute(`x1`, lines[0][0][0].toFixed(10));
                    this.children[0].setAttribute(`y1`, lines[0][0][1].toFixed(10));
                    this.children[0].setAttribute(`x2`, lines[0][1][0].toFixed(10));
                    this.children[0].setAttribute(`y2`, lines[0][1][1].toFixed(10));
                    this.children[1].setAttribute(`x1`, lines[1][0][0].toFixed(10));
                    this.children[1].setAttribute(`y1`, lines[1][0][1].toFixed(10));
                    this.children[1].setAttribute(`x2`, lines[1][1][0].toFixed(10));
                    this.children[1].setAttribute(`y2`, lines[1][1][1].toFixed(10));
                    this.children[2].textContent = this.children[3].textContent = formatNumberForDisplay(zValue);

                    const textSize = this.textSize * thisClass.#transformPrecalc.zoom;
                    const scaleZText = Math.abs(thisClass.#transformPrecalc.cosPitch);
                    const skewLeftText = Math.atan((lines[0][1][1]-lines[0][0][1])/(lines[0][1][0]-lines[0][0][0])) * 180 / Math.PI;
                    const skewRightText = Math.atan((lines[1][0][1]-lines[1][1][1])/(lines[1][0][0]-lines[1][1][0])) * 180 / Math.PI;
                    let yOffset = 0;
                    if(this.z === 0)
                        yOffset = -textSize/2;
                    if(this.z === this.zResolution-1)
                        yOffset = textSize/2;
                    
                    this.children[2].setAttribute(`x`, lines[0][0][0].toFixed(10));
                    this.children[2].setAttribute(`y`, (lines[0][0][1]+yOffset).toFixed(10));
                    this.children[2].setAttribute(`transform-origin`, `${lines[0][0][0].toFixed(10)} ${lines[0][0][1].toFixed(10)}`);
                    this.children[2].setAttribute(`transform`, `skewY(${skewLeftText.toFixed(10)}) scale(${lines[0][2].toFixed(10)} ${scaleZText})`);
                    axisElement.children[2].setAttribute(`font-size`, textSize.toFixed(10));

                    this.children[3].setAttribute(`x`, lines[1][1][0].toFixed(10));
                    this.children[3].setAttribute(`y`, (lines[1][1][1]+yOffset).toFixed(10));
                    this.children[3].setAttribute(`transform-origin`, `${lines[1][1][0]} ${lines[1][1][1].toFixed(10)}`);
                    this.children[3].setAttribute(`transform`, `skewY(${skewRightText.toFixed(10)}) scale(${lines[1][2].toFixed(10)} ${scaleZText})`);
                    axisElement.children[3].setAttribute(`font-size`, textSize.toFixed(10));
                }
            }
            axisElement.zResolution = zResolution;
            axisElement.textSize = textSize;
            axisElement.z = i;
        }

        function getPathVGetterSetter(index) {
            let vi = `_v${index}`;
            return {
                get: function() { return this[vi]; },
                set: function(v) { 
                    v = parseFloat(v);
                    if(this[vi] === v)
                        return;
                    this[vi] = v;
                    this.value = (parseFloat(this.v1) + parseFloat(this.v2) + parseFloat(this.v3) + parseFloat(this.v4))/4;
                    // this.update();
                }
            }
        }
        this.style.setProperty('--xresolution', this.xResolution);
        this.style.setProperty('--yresolution', this.yResolution);
        while(Math.max(0, (this.xResolution-1) * (this.yResolution-1)) < this.#valuePathElement.children.length) { this.#valuePathElement.removeChild(this.#valuePathElement.lastChild); }
        for(let i = 0; i < (this.xResolution-1) * (this.yResolution-1); i++) { 
            let valuePathElement = this.#valuePathElement.children[i];
            if(!valuePathElement) {
                valuePathElement = this.#valuePathElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg','path'));
                Object.defineProperty(valuePathElement, 'value', {
                    get: function() { return this._value; },
                    set: function(value) { value = parseFloat(value); if(this._value === value) return; this._value = value; this.style.setProperty(`--data-value`, value); }
                });
                valuePathElement.update = function() {
                    if(!this.p1 || !this.p2 || !this.p3 || !this.p4)
                        return;
                    this.depth = (this.p1[2] + this.p2[2] + this.p3[2] + this.p4[2])/4;
                    if(isNaN(this.depth))
                        return;
                    this.setAttribute(`d`, 
                                    `M${this.p1[0].toFixed(10)},${this.p1[1].toFixed(10)}`+
                                    `L${this.p2[0].toFixed(10)},${this.p2[1].toFixed(10)}`+
                                    `L${this.p3[0].toFixed(10)},${this.p3[1].toFixed(10)}`+
                                    `L${this.p4[0].toFixed(10)},${this.p4[1].toFixed(10)}Z`)
                };
                Object.defineProperty(valuePathElement, 'v1', getPathVGetterSetter(1));
                Object.defineProperty(valuePathElement, 'v2', getPathVGetterSetter(2));
                Object.defineProperty(valuePathElement, 'v3', getPathVGetterSetter(3));
                Object.defineProperty(valuePathElement, 'v4', getPathVGetterSetter(4));
            }
            valuePathElement.x1 = valuePathElement.x4 = i % (this.xResolution-1);
            valuePathElement.y1 = valuePathElement.y2 = Math.trunc(i/(this.xResolution-1));
            valuePathElement.x2 = valuePathElement.x3 = valuePathElement.x1 + 1;
            valuePathElement.y3 = valuePathElement.y4 = valuePathElement.y1 + 1;
        }
        const valuePathElements = [...this.#valuePathElement.children];
        while(this.xResolution * this.yResolution < this._valueElement.children.length) { this._valueElement.removeChild(this._valueElement.lastChild); }
        for(let i = 0; i < this.xResolution * this.yResolution; i++) { 
            let valueElement = this._valueElement.children[i] 
            if(!valueElement) {
                valueElement = this._valueElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg','circle'));
                Object.defineProperty(valueElement, 'value', {
                    get: function() { return this._value; },
                    set: function(value) { 
                        value = parseFloat(value);
                        if(this._value === value )
                            return;
                        this._value = value;
                        this.style.setProperty(`--data-value`, value); 
                        if(value < thisClass._valueMin)
                            thisClass._valueMin = value;
                        if(value > thisClass._valueMax)
                            thisClass._valueMax = value;
                        this.update();
                        if(this.vp1) this.vp1.v1 = value;
                        if(this.vp2) this.vp2.v2 = value;
                        if(this.vp3) this.vp3.v3 = value;
                        if(this.vp4) this.vp4.v4 = value;
                    }
                });
                Object.defineProperty(valueElement, 'p', {
                    get: function() { return this.pp; },
                    set: function(p) {
                        if(!p) 
                            return;
                        if(this.pp == undefined || this.pp[0] !== p[0] || this.pp[1] !== p[1]) {
                            if(this.vp1) { this.vp1.p1 = p; this.vp1.v1 = this.value; }
                            if(this.vp2) { this.vp2.p2 = p; this.vp2.v2 = this.value; }
                            if(this.vp3) { this.vp3.p3 = p; this.vp3.v3 = this.value; }
                            if(this.vp4) { this.vp4.p4 = p; this.vp4.v4 = this.value; }
                        }
                        this.pp = p;
                        this.depth = p[2];
                    }
                });
            }
            valueElement.update = function() {
                if(!(this.p = thisClass.#cellToPoint(this.x, this.y, this.value)))
                    return;
                const p = this.p;
                this.setAttribute(`cx`, p[0].toFixed(10));
                this.setAttribute(`cy`, p[1].toFixed(10));
            };
            valueElement.x = i % this.xResolution;
            valueElement.y = Math.trunc(i/this.xResolution);
            valueElement.vp1 = valuePathElements.find(element => element.x1 === valueElement.x && element.y1 === valueElement.y);
            valueElement.vp2 = valuePathElements.find(element => element.x2 === valueElement.x && element.y2 === valueElement.y);
            valueElement.vp3 = valuePathElements.find(element => element.x3 === valueElement.x && element.y3 === valueElement.y);
            valueElement.vp4 = valuePathElements.find(element => element.x4 === valueElement.x && element.y4 === valueElement.y);
        }
    }

    #createEventListeners() {
        const minmax = () => {
            const minmax = calculateMinMaxValue(this.value);
            this._valueMin = minmax[0];
            this._valueMax = minmax[1];
        }
        this.addEventListener(`change`, minmax);
        minmax();
        this.#svgElement.addEventListener('wheel', event => {
            if(event.wheelDelta /120 > 0) {
                this.zoom *= 1.1;
            }
            else{
                this.zoom *= 0.9;
            }
            event.preventDefault()
            event.stopPropagation()
            return false;
        }, {passive: false});
        this.#svgElement.addEventListener('contextmenu', event => {
            event.preventDefault()
        });
        this.#svgElement.addEventListener('mousedown', event => {
            var rect = this.#svgElement.getBoundingClientRect();
            var relX = event.pageX - rect.left;
            var relY = event.pageY - rect.top;
            let circles = [...this._valueElement.children].sort((a, b) => { return a.depth-b.depth; });
            let closestCircle = undefined;
            let rotate;
            let move;
            let dragValue;
            circles.forEach((element, index) => {
                let l = element.p[0] - relX;
                let w = element.p[1] - relY;
                element.dist = Math.sqrt(l*l+w*w);
                if(closestCircle == undefined || element.dist < closestCircle.dist)
                    closestCircle = element;
            });
            if(closestCircle && event.button === 0) {
                const x = closestCircle.x;
                const y = closestCircle.y;
                this.selecting = {
                    startX: x,
                    startY: y,
                    endX: x,
                    endY: y
                }
                dragValue = {
                    pageY: event.pageY,
                    closestCircle,
                    value: closestCircle.value,
                    mag: (this._valueMax - this._valueMin) / this.height, 
                }
            } else  if(event.button === 1) {
                move={
                    pageX: event.pageX,
                    pageY: event.pageY,
                    cameraX: this.cameraX,
                    cameraY: this.cameraY
                }
                event.preventDefault()
            } else if(event.button === 2) {
                rotate = {
                    pageX: event.pageX,
                    pageY: event.pageY,
                    yaw: this.yaw,
                    pitch: this.pitch
                };
                event.preventDefault()
            }

            //dragValue
            if(dragValue) {
                const mouseMove = event => {
                    dragValue.closestCircle.value = dragValue.value + (dragValue.pageY - event.pageY) * dragValue.mag 
                    this.dispatchEvent(new Event(`change`, {bubbles: true}));
                }
                const mouseUp = () => {
                    document.removeEventListener(`mousemove`, mouseMove);
                    document.removeEventListener(`mouseup`, mouseUp);
                }
                document.addEventListener(`mousemove`, mouseMove);
                document.addEventListener(`mouseup`, mouseUp);
            }

            //move
            if(move) {
                const mouseMove = event => {
                    this.cameraX = move.cameraX + move.pageX - event.pageX;
                    this.cameraY = move.cameraY + move.pageY - event.pageY;
                }
                const mouseUp = () => {
                    document.removeEventListener(`mousemove`, mouseMove);
                    document.removeEventListener(`mouseup`, mouseUp);
                }
                document.addEventListener(`mousemove`, mouseMove);
                document.addEventListener(`mouseup`, mouseUp);
            }

            //rotate
            if(rotate) {
                const mouseMove = event => {
                    let yaw = rotate.yaw + rotate.pageX - event.pageX;
                    let pitch = Math.max(-90,Math.min(90,rotate.pitch + event.pageY - rotate.pageY));
                    if(yaw === this.yaw && pitch === this.pitch)
                        return;

                    this.#yaw = yaw;
                    this.#pitch = pitch;
                    this.#transformPrecalc = UIGraph3D.transformPrecalc(this);
                }
                const mouseUp = () => {
                    document.removeEventListener(`mousemove`, mouseMove);
                    document.removeEventListener(`mouseup`, mouseUp);
                }
                document.addEventListener(`mousemove`, mouseMove);
                document.addEventListener(`mouseup`, mouseUp);
            }
        });
    }
}
customElements.define(`ui-graph-3d`, UIGraph3D, { extends: `div` });