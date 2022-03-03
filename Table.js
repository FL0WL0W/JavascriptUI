class Table {
    XAxis = [];
    YAxis = [];
    XAxisModifiable = true;
    YAxisModifiable = true;
    XResolutionModifiable = true;
    YResolutionModifiable = true;
    OnChange = [];
    ReverseY = false;

    _xResolution = 8;
    get XResolution() {
        return this._xResolution;
    }
    set XResolution(xRes) {
        this.XAxis.splice(xRes);
        const oldXAxisLength = this.XAxis.length;
        if(oldXAxisLength > 2) {
            let xAxisAdd = this.XAxis[oldXAxisLength-1] - this.XAxis[oldXAxisLength-2]
            for(let x=oldXAxisLength; x<xRes; x++){
                this.XAxis[x] = this.XAxis[x-1] + xAxisAdd;
            }
        }
        let newValue = new Array(Math.max(1, xRes) * Math.max(1, this.YResolution));
        for(let x=0; x<xRes; x++){
            for(let y=0; y<this.YResolution; y++){
                let oldValuesIndex = x + this._xResolution * y;
                let newValuesIndex = x + xRes * y;
                if(x >= this._xResolution){
                    let newValuesIndexMinus1 = (x-1) + xRes * y;
                    let newValuesIndexMinus2 = (x-2) + xRes * y;
                    if(x>1){
                        newValue[newValuesIndex] = newValue[newValuesIndexMinus1] + (newValue[newValuesIndexMinus1] - newValue[newValuesIndexMinus2]);
                    }
                } else {
                    newValue[newValuesIndex] = this._value[oldValuesIndex];
                }
            }
        }
        this._xResolution = xRes;
        this._value = newValue;
        this.TableValueUpdate();
    }

    _yResolution = 8;
    get YResolution() {
        return this._yResolution;
    }
    set YResolution(yRes) {
        this.YAxis.splice(yRes);
        const oldYAxisLength = this.YAxis.length;
        if(oldYAxisLength > 2) {
            let yAxisAdd = this.YAxis[oldYAxisLength-1] - this.YAxis[oldYAxisLength-2]
            for(let y=oldYAxisLength; y<yRes; y++){
                this.YAxis[y] = this.YAxis[y-1] + yAxisAdd;
            }
        }
        let newValue = new Array(Math.max(1, this._xResolution) * Math.max(1, yRes));
        for(let x=0; x<this._xResolution; x++){
            for(let y=0; y<yRes; y++){
                let valuesIndex = x + this._xResolution * y;
                if(y >= this._yResolution){
                    let valuesIndexMinus1 = x + this._xResolution * (y-1);
                    let valuesIndexMinus2 = x + this._xResolution * (y-2);
                    if(y>1){
                        newValue[valuesIndex] = newValue[valuesIndexMinus1] + (newValue[valuesIndexMinus1] - newValue[valuesIndexMinus2]);
                    }
                } else {
                    newValue[valuesIndex] = this._value[valuesIndex];
                }
            }
        }
        this._yResolution = yRes;
        this._value = newValue;
        this.TableValueUpdate();
    }

    _hidden = false;
    get Hidden() {
        return this._hidden;
    }
    set Hidden(value) {
        if(value)
            $(`#${this.GUID}`).hide();
        else
            $(`#${this.GUID}`).show();
        this._hidden = value;
    }

    _xLabel = ``;
    get XLabel() {
        return this._xLabel;
    }
    set XLabel(value) {
        $(`#${this.GUID}-xlabel`).html(value);
        this._xLabel = value;
    }

    _yLabel = ``;
    get YLabel() {
        return this._yLabel;
    }
    set YLabel(value) {
        $(`#${this.GUID}-ylabel`).html(value);
        this._yLabel = value;
    }

    _zLabel = ``;
    get ZLabel() {
        $(`#${this.GUID}-zlabel`).html(value);
        return this._zLabel;
    }
    set ZLabel(value) {
        this._zLabel = value;
    }

    _table3DDisplayWidth=810; 
    _table3DDisplayHeight=400;
    _table3DZoom=1;
  
    _table3DtransformPrecalc=[];
    _table3DOffsetX = 0;
    _table3DOffsetY = 0
    _table3DPitch = 0;
    get Table3DPitch() {
      return this._table3DPitch
    }
    set Table3DPitch(pitch) {
      if(pitch === this._table3DPitch)
        return;
      this._table3DPitch = pitch;
      var cosA=Math.cos(this._table3DPitch);
      var sinA=Math.sin(this._table3DPitch);
      var cosB=Math.cos(this._table3DYaw);
      var sinB=Math.sin(this._table3DYaw);
      this._table3DtransformPrecalc[0]=cosB;
      this._table3DtransformPrecalc[1]=0;
      this._table3DtransformPrecalc[2]=sinB;
      this._table3DtransformPrecalc[3]=sinA*sinB;
      this._table3DtransformPrecalc[4]=cosA;
      this._table3DtransformPrecalc[5]=-sinA*cosB;
      this._table3DtransformPrecalc[6]=-sinB*cosA;
      this._table3DtransformPrecalc[7]=sinA;
      this._table3DtransformPrecalc[8]=cosA*cosB;
    }
    _table3DYaw = 0;
    get Table3DYaw() {
      return this._table3DYaw
    }
    set Table3DYaw(yaw) {
      if(yaw === this._table3DYaw)
        return;
      this._table3DYaw = yaw;
      var cosA=Math.cos(this._table3DPitch);
      var sinA=Math.sin(this._table3DPitch);
      var cosB=Math.cos(this._table3DYaw);
      var sinB=Math.sin(this._table3DYaw);
      this._table3DtransformPrecalc[0]=cosB;
      this._table3DtransformPrecalc[1]=0;
      this._table3DtransformPrecalc[2]=sinB;
      this._table3DtransformPrecalc[3]=sinA*sinB;
      this._table3DtransformPrecalc[4]=cosA;
      this._table3DtransformPrecalc[5]=-sinA*cosB;
      this._table3DtransformPrecalc[6]=-sinB*cosA;
      this._table3DtransformPrecalc[7]=sinA;
      this._table3DtransformPrecalc[8]=cosA*cosB;
    }

    _value = [0];
    get Value() {
        return this._value;
    }
    set Value(value) {
        this._value = value;
    }
    
    constructor(GUID, copyObject){
        this.GUID = GUID;
        if(copyObject)
            Object.assign(this, copyObject);
        if(!Array.isArray(this.OnChange))
            this.OnChange = [ this.OnChange ];
        this.Table3DPitch = 0.5;
        this.Table3DYaw = 0.5;
    }

    Detach() {
        $(document).off(`change.${this.GUID}`);
        $(document).off(`click.${this.GUID}`);
        $(document).off(`mousedown.${this.GUID}`);
        $(document).off(`mouseup.${this.GUID}`);
        $(document).off(`mousemove.${this.GUID}`);
        $(document).off(`copy.${this.GUID}`);
        $(document).off(`paste.${this.GUID}`);
        $(document).off(`contextmenu.${this.GUID}`);
        $(document).off(`touchstart.${this.GUID}`);
        $(document).off(`touchend.${this.GUID}`);
        $(document).off(`touchmove.${this.GUID}`);
        $(document).off(`mousedown.${this.GUID}-drag3d`);
        $(document).off(`mouseup.${this.GUID}-drag3d`);
        $(document).off(`mousemove.${this.GUID}-drag3d`);
        $(document).off(`mousewheel.${this.GUID}-drag3d`);
    }

    Attach() {
        this.Detach();
        var thisClass = this;

        $(document).on(`click.${this.GUID}`, `#${this.GUID}-equal`, function(){
            var value = parseFloat($(`#${thisClass.GUID}-modifyvalue`).val());
            if(isNaN(value))
                return;
            $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] = value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-add`, function(){
            var value = parseFloat($(`#${thisClass.GUID}-modifyvalue`).val());
            if(isNaN(value))
                return;
            $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] += value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-multiply`, function(){
            var value = parseFloat($(`#${thisClass.GUID}-modifyvalue`).val());
            if(isNaN(value))
                return;
            $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] *= value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-interpolatexy`, function(){
            const selected = $(`#${thisClass.GUID}-table .number.selected`);
            if(selected.length === 0)
                return
            let xMin = 10000000000;
            let xMax = -10000000000;
            let yMin = 10000000000;
            let yMax = -10000000000;
            $.each(selected, function(index, cell) {
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                if(cellx < xMin)
                    xMin = cellx;
                if(cellx > xMax)
                    xMax = cellx;
                if(celly < yMin)
                    yMin = celly;
                if(celly > yMax)
                    yMax = celly;
            });
            $.each(selected, function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                if(cellx === xMin || cellx === xMax || celly === yMin || celly === yMax)
                    return;
                const xMinVal = thisClass._value[xMin + celly * thisClass._xResolution];
                const yMinVal = thisClass._value[cellx + yMin * thisClass._xResolution];
                const xMag = (thisClass._value[xMax + celly * thisClass._xResolution] - xMinVal) / (thisClass.XAxis[xMax] - thisClass.XAxis[xMin]);
                const yMag = (thisClass._value[cellx + yMax * thisClass._xResolution] - yMinVal) / (thisClass.YAxis[yMax] - thisClass.YAxis[yMin]);
                let value = xMinVal + xMag * (thisClass.XAxis[cellx]-thisClass.XAxis[xMin]) + yMinVal + yMag * (thisClass.YAxis[celly]-thisClass.YAxis[yMin])
                value /= 2;
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] = value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-interpolatex`, function(){
            const selected = $(`#${thisClass.GUID}-table .number.selected`);
            if(selected.length === 0)
                return
            let xMin = 10000000000;
            let xMax = -10000000000;
            $.each(selected, function(index, cell) {
                const cellx = parseInt($(cell).attr(`data-x`));
                if(cellx < xMin)
                    xMin = cellx;
                if(cellx > xMax)
                    xMax = cellx;
            });
            $.each(selected, function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                if(cellx === xMin || cellx === xMax)
                    return;
                const xMinVal = thisClass._value[xMin + celly * thisClass._xResolution];
                const xMag = (thisClass._value[xMax + celly * thisClass._xResolution] - xMinVal) / (thisClass.XAxis[xMax] - thisClass.XAxis[xMin]);
                let value = xMinVal + xMag * (thisClass.XAxis[cellx]-thisClass.XAxis[xMin]);
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] = value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-interpolatey`, function(){
            const selected = $(`#${thisClass.GUID}-table .number.selected`);
            if(selected.length === 0)
                return
            let yMin = 10000000000;
            let yMax = -10000000000;
            $.each(selected, function(index, cell) {
                const celly = parseInt($(cell).attr(`data-y`));
                if(celly < yMin)
                    yMin = celly;
                if(celly > yMax)
                    yMax = celly;
            });
            $.each(selected, function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).attr(`data-x`));
                const celly = parseInt($(cell).attr(`data-y`));
                if(celly === yMin || celly === yMax)
                    return;
                const yMinVal = thisClass._value[cellx + yMin * thisClass._xResolution];
                const yMag = (thisClass._value[cellx + yMax * thisClass._xResolution] - yMinVal) / (thisClass.YAxis[yMax] - thisClass.YAxis[yMin]);
                let value = yMinVal + yMag * (thisClass.YAxis[celly]-thisClass.YAxis[yMin])
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] = value;
                $(cell).parent().replaceWith(thisClass.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });

        $(document).on(`change.${this.GUID}`, `#${this.GUID}-table`, function(e){
            var x = parseInt($(e.target).attr(`data-x`));
            var y = parseInt($(e.target).attr(`data-y`));
            var value = parseFloat($(e.target).val());
            if(isNaN(value))
                return;
            
            if(x === -1) {
                thisClass.YAxis[y] = value;
                for(let ya=y; ya<thisClass._yResolution; ya++) {
                    if(thisClass.YAxis[ya] < value) {
                        thisClass.YAxis[ya] = value;
                        $(`#${thisClass.GUID}-table .number[data-y='${ya}'][data-x='-1']`).html(value);
                    }
                }
            } else if(y === -1) {
                thisClass.XAxis[x] = value;
                for(let xa=x; xa<thisClass._xResolution; xa++) {
                    if(thisClass.XAxis[xa] < value) {
                        thisClass.XAxis[xa] = value;
                        $(`#${thisClass.GUID}-table .number[data-x='${xa}'][data-y='-1']`).html(value);
                    }
                }
            } else {
                $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                    const cellx = parseInt($(cell).attr(`data-x`));
                    const celly = parseInt($(cell).attr(`data-y`));
                    index = cellx + celly * thisClass._xResolution;
                    thisClass._value[index] = value;
                    if(cellx !== x || celly !== y) {
                        $(cell).html(thisClass._value[index]);
                    }
                });
            }
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });

        var dragX = false;
        var dragY = false;
        var pointX;
        var pointY;

        $(document).on(`mousedown.${this.GUID}`, `#${this.GUID}-table .rowcol_expand`, function(e){
            dragY = true;
            dragX = true;
            $(`#overlay`).addClass(`rowcol_expand`);
            $(`#overlay`).show();
            $(document).on(`mousemove.${this.GUID}`, function(e){
                move(e.pageX, e.pageY);
            });
        });

        $(document).on(`mousedown.${this.GUID}`, `#${this.GUID}-table .col_expand`, function(e){
            dragX = true;
            $(`#overlay`).addClass(`col_expand`);
            $(`#overlay`).show();
            $(document).on(`mousemove.${this.GUID}`, function(e){
                move(e.pageX, e.pageY);
            });
        });

        $(document).on(`mousedown.${this.GUID}`, `#${this.GUID}-table .row_expand`, function(e){
            dragY = true;
            $(`#overlay`).addClass(`row_expand`);
            $(`#overlay`).show();
            $(document).on(`mousemove.${this.GUID}`, function(e){
                move(e.pageX, e.pageY);
            });
        });

        function down() {
            $(document).on(`touchmove.${this.GUID}`, function(e){
                var touch = e.touches[e.touches.length - 1];
                move(touch.pageX, touch.pageY);
            });
            $(document).on(`mousemove.${this.GUID}`, function(e){
                move(e.pageX, e.pageY);
            });

            $(this).focus();
            var previousOrigSelect = $(`#${thisClass.GUID}-table .origselect`);
            previousOrigSelect.removeClass(`selected`);
            previousOrigSelect.removeClass(`origselect`);
            previousOrigSelect.parent().replaceWith(thisClass.FormatCellForDisplay(previousOrigSelect.attr(`id`)));
            $(`#${thisClass.GUID}-table3d g path`).removeClass(`selected`);
            $(`#${thisClass.GUID}-table3d g circle`).removeClass(`selected`);
            $(`#${thisClass.GUID}-table .number`).removeClass(`selected`);
            $(`#${thisClass.GUID}-table .number`).removeClass(`origselect`);

            $(this).addClass(`selected`);
            $(this).addClass(`origselect`);

            let x = $(this).attr(`data-x`);
            let y = $(this).attr(`data-y`);

            if(x === undefined || parseInt(x) < 0 || y === undefined || parseInt(y) < 0)
                return;

            x = parseInt(x);
            y = parseInt(y);

            thisClass._selecting = true;
            thisClass._minSelectX = x;
            thisClass._minSelectY = y;
            thisClass._maxSelectX = x;
            thisClass._maxSelectY = y;
            let circleSelector = $(`#${thisClass.GUID}-table3d g circle[data-x='${x}'][data-y='${y}']`);
            circleSelector.addClass(`selected`);

            pointX =  $(this).offset().left - $(this).closest(`table`).offset()?.left;
            pointY =  $(this).offset().top - $(this).closest(`table`).offset()?.top;
        }

        function up() {
            $(document).off(`touchmove.${this.GUID}`);
            $(document).off(`mousemove.${this.GUID}`);

            $(`#${thisClass.GUID}-table .origselect`).parent().replaceWith(thisClass.FormatCellForDisplay($(`#${thisClass.GUID}-table .origselect`).attr(`id`)));
            $(`#${thisClass.GUID}-table .origselect`).select();
            dragX = false;
            dragY = false;
            $(`#overlay`).removeClass(`col_expand`);
            $(`#overlay`).removeClass(`row_expand`);
            $(`#overlay`).removeClass(`rowcol_expand`);
            $(`#overlay`).hide();
        }

        var selectOnMove = false;
        function move(pageX, pageY) {
            var tableElement = $(`#${thisClass.GUID}-table`);
            if(dragX) {
                var cellElement = $(`#${thisClass.GUID}-${thisClass._xResolution - 1}-axis`);
                var relX = pageX - tableElement.offset().left;
                var elX = cellElement.offset().left - tableElement.offset().left;
                var comp = relX - elX;
                if(comp > (cellElement.width() * 3/2))
                    thisClass.XResolution += 1;
                if(comp < 0 && thisClass._xResolution > 2)
                    thisClass.XResolution -= 1;
            }
            if(dragY) {
                var cellElement = $(`#${thisClass.GUID}-axis-${thisClass._yResolution - 1}`);
                var relY = pageY - tableElement.offset().top;
                var elY = cellElement.offset().top - tableElement.offset().top;
                var comp = relY - elY;
                if(comp > (cellElement.height() * 3/2))
                    thisClass.YResolution += 1;
                if(comp < 0 && thisClass._yResolution > 2)
                    thisClass.YResolution-= 1;
            }
            if(thisClass._selecting || selectOnMove){
                thisClass._minSelectX = thisClass._xResolution;
                thisClass._minSelectY = thisClass._yResolution;
                thisClass._maxSelectX = 0;
                thisClass._maxSelectY = 0;
                $.each($(`#${thisClass.GUID}-table .number`), function(index, cell) {
                    var cellElement = $(cell);
                    let x = cellElement.attr(`data-x`);
                    let y = cellElement.attr(`data-y`);
                    if(cellElement.attr(`data-x`) === undefined || parseInt(x) < 0 || y === undefined || parseInt(y) < 0)
                        return;

                    x = parseInt(x);
                    y = parseInt(y);
        
                    var relX = pageX - tableElement.offset().left;
                    var elX = cellElement.offset().left - tableElement.offset().left;
                    var relY = pageY - tableElement.offset().top;
                    var elY = cellElement.offset().top - tableElement.offset().top;
                    if(((elX <= relX && elX >= pointX) || (elX >= (relX - cellElement.width()) && elX <= pointX) || (pointX == cellElement.offset().left - tableElement.offset().left)) &&
                        ((elY <= relY && elY >= pointY) || (elY >= (relY - cellElement.height()) && elY <= pointY) || (pointY == cellElement.offset().top - tableElement.offset().top))) {
                        if(thisClass._selecting) {
                            if(x < thisClass._minSelectX)
                                thisClass._minSelectX = x;
                            if(x > thisClass._maxSelectX)
                                thisClass._maxSelectX = x;
                            if(y < thisClass._minSelectY)
                                thisClass._minSelectY = y;
                            if(y > thisClass._maxSelectY)
                                thisClass._maxSelectY = y;
                            cellElement.addClass(`selected`);
                        }
                        else if (selectOnMove && !cellElement.hasClass(`origselect`)) {
                            selectOnMove = false;
                            thisClass._selecting = true;
                        }
                    } else if(thisClass._selecting) {
                        cellElement.removeClass(`selected`);
                    }
                });
                $.each($(`#${thisClass.GUID}-table3d g path`), function(index, cell) {
                    var cellElement = $(cell);
                    let x = cellElement.attr(`data-x`);
                    let y = cellElement.attr(`data-y`);

                    if(x >= thisClass._minSelectX && x < thisClass._maxSelectX && y >= thisClass._minSelectY && y < thisClass._maxSelectY)
                        cellElement.addClass(`selected`);
                    else
                        cellElement.removeClass(`selected`);
                });
                $.each($(`#${thisClass.GUID}-table3d g circle`), function(index, cell) {
                    var cellElement = $(cell);
                    let x = cellElement.attr(`data-x`);
                    let y = cellElement.attr(`data-y`);

                    if(x >= thisClass._minSelectX && x <= thisClass._maxSelectX && y >= thisClass._minSelectY && y <= thisClass._maxSelectY)
                        cellElement.addClass(`selected`);
                    else
                        cellElement.removeClass(`selected`);
                });
            }
        }

        $(document).on(`contextmenu.${this.GUID}`, `#${this.GUID}-table .number`, function(e){
            down.call(this);
            e.preventDefault();
        });
        $(document).on(`mousedown.${this.GUID}`, `#${this.GUID}-table div.number`, function(e){
            if(e.which === 3) {
                down.call(this);
                $(`#${$(this).attr(`id`)}`).select();
                up.call(this);
                e.preventDefault();
            } else if(e.which == 1) {
                down.call(this);
            }
        });
        
        $(document).on(`touchend.${this.GUID}`, function(e){
            up.call(this);
        });
        $(document).on(`mouseup.${this.GUID}`, function(e){
            up.call(this);
        });

        function getCopyData() {
            var copyData = ``;

            for(var y = 0; y < thisClass._yResolution; y++){
                var rowSelected = false
                    for(var x = 0; x < thisClass._xResolution; x++){
                    if($(`#${thisClass.GUID}-table .number[data-x='${x}'][data-y='${y}']`).hasClass(`selected`)){
                        if(rowSelected){
                            copyData += `\t`;
                        }
                        copyData += thisClass._value[x + y * thisClass._xResolution];
                        rowSelected = true;
                    }
                }
                if(rowSelected){
                    copyData += `\n`;
                }
            }

            if(copyData.length > 0){
                copyData = copyData.substring(0, copyData.length -1);//remove last new line
            }

            return copyData;
        }

        function pasteData(x,y,data,special) {
            thisClass._minSelectX = x;
            thisClass._minSelectY = y;
            thisClass._maxSelectX = x + data.split(`\n`).length;
            $.each(data.split(`\n`), function(yIndex, val) {
                thisClass._maxSelectY = y + val.split(`\t`).length;
                var yPos = y + yIndex;
                if(yPos > thisClass._yResolution - 1)
                    return;
                $.each(val.split(`\t`), function(xIndex, val) {
                    var xPos = x + xIndex;
                    if(xPos > thisClass._xResolution - 1)
                        return;

                    var v = parseFloat(val);

                    switch(special)
                    {
                        case `add`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] += v;
                            break;
                        case `subtract`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] -= v;
                            break;
                        case `multiply`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] *= v;
                            break;
                        case `multiply%`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] *= 1 + (v/100);
                            break;
                        case `multiply%/2`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] *= 1 + (v/200);
                            break;
                        case `average`:
                            thisClass._value[xPos + yPos * thisClass._xResolution] += v;
                            thisClass._value[xPos + yPos * thisClass._xResolution] /= 2;
                            break;
                        default:
                            thisClass._value[xPos + yPos * thisClass._xResolution] = v;
                            break;
                    }
                    var cell = $(`#${thisClass.GUID}-table .number[data-x='${xPos}'][data-y='${yPos}']`);
                    cell.addClass(`selected`);
                    const id = cell.attr(`id`);
                    cell.parent().replaceWith(thisClass.FormatCellForDisplay(id, xPos, yPos, thisClass._value[xPos + yPos * thisClass._xResolution]));
                    $(`#${id}`).select();
                });
            });
            thisClass._tableHueUpdate();
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        }

        $(document).on(`copy.${this.GUID}`, `#${this.GUID}-table .number`, function(e){
            if($(this).attr(`data-x`) === undefined || parseInt($(this).attr(`data-x`)) < 0 || $(this).attr(`data-y`) === undefined || parseInt($(this).attr(`data-y`)) < 0)
                return;

            thisClass._selecting = false;
            e.originalEvent.clipboardData.setData(`text/plain`, getCopyData());
            e.preventDefault();
        });

        $(document).on(`paste.${this.GUID}`, `#${this.GUID}-table .number`, function(e){
            if($(this).attr(`data-x`) === undefined || parseInt($(this).attr(`data-x`)) < 0 || $(this).attr(`data-y`) === undefined || parseInt($(this).attr(`data-y`)) < 0)
                return;
            var val = e.originalEvent.clipboardData.getData(`text/plain`);

            var selectedCell = $(`#${thisClass.GUID}-table .number.origselect`)
            var x = selectedCell.attr(`data-x`);
            var y = selectedCell.attr(`data-y`);
            if(x < 0 || y < 0)
                return;

            pasteData(x,y,val,pastetype);

            thisClass._selecting = false;
            e.preventDefault();
        });


        let move3d = false;
        let drag = false;
        let dragValue = false;
        $(document).on(`mousedown.${this.GUID}-drag3d`, `#${this.GUID}-table3d g`, function(e){
            var relX = e.pageX - $(this).closest(`svg`).offset().left;
            var relY = e.pageY - $(this).closest(`svg`).offset().top;
            let circles = thisClass.svg.filter(x => x.circle).reverse();
            let closestCircle = undefined;
            circles.forEach(function(element, index) {
                let l = element.circle.cx - relX;
                let w = element.circle.cy - relY;
                element.dist = Math.sqrt(l*l+w*w);
                if(closestCircle === undefined || element.dist < closestCircle.dist)
                    closestCircle = element;
            });
            if(closestCircle && e.which === 1) {
                let x = closestCircle.x;
                let y = closestCircle.y;
                thisClass._minSelectX = x;
                thisClass._minSelectY = y;
                thisClass._maxSelectX = x;
                thisClass._maxSelectY = y;
                index = x + thisClass._xResolution * y;
                dragValue=[e.pageY,x,y,thisClass.Value[index],(thisClass._valueMax - thisClass._valueMin) * 2 / thisClass._table3DDisplayHeight, `#${thisClass.GUID}-table3d g circle[data-x='${x}'][data-y='${y}']`, parseFloat(closestCircle.circle.cy)];
                $(`#${thisClass.GUID}-table3d g path`).removeClass(`selected`);
                $(`#${thisClass.GUID}-table3d g circle`).removeClass(`selected`);
                $(`#${thisClass.GUID}-table .number`).removeClass(`selected`).removeClass(`origselect`);
                var cell = $(`#${thisClass.GUID}-table .number[data-x='${x}'][data-y='${y}']`);
                cell.addClass(`selected`);
                cell.parent().replaceWith(thisClass.FormatCellForDisplay(cell.attr(`id`), x, y, thisClass._value[index]));
                let closestCircleSelector = $(dragValue[5]);
                closestCircleSelector.addClass(`selected`);
            } else if(e.which === 2) {
                move3d=[e.pageX,e.pageY,thisClass._table3DOffsetX,thisClass._table3DOffsetY];
                e.preventDefault();
            } else if(e.which === 3) {
                drag=[e.pageX,e.pageY,thisClass.Table3DYaw,thisClass.Table3DPitch];
                e.preventDefault();
            }

            if((closestCircle && e.which === 1) || e.which === 2 || e.which === 3) {
                $(document).on(`mousemove.${thisClass.GUID}-drag3d`, function(e){
                    if(drag){          
                        let yaw=drag[2]-(e.pageX-drag[0])/50;
                        let pitch=drag[3]+(e.pageY-drag[1])/50;
                        pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitch));
                        if(yaw === thisClass.Table3DYaw && pitch === thisClass.Table3DPitch)
                            return;
                        thisClass.Table3DYaw = yaw;
                        thisClass.Table3DPitch = pitch;
                        thisClass.UpdateTable3D(true);
                    } else if(move3d) {
                        let xdiff=e.pageX-move3d[0];
                        let ydiff=e.pageY-move3d[1];
                        thisClass._table3DOffsetX = move3d[2] + xdiff;
                        thisClass._table3DOffsetY = move3d[3] + ydiff;
                        thisClass.UpdateTable3D(true);
                    }else if(dragValue) {
                        let diff = dragValue[0] - e.pageY;
                        let mag = dragValue[4]
                        let index = dragValue[1] + thisClass._xResolution * dragValue[2];
                        thisClass._value[index] = dragValue[3] + diff * mag;
                        let positionY = thisClass.ReverseY? dragValue[2] : (thisClass.YResolution - dragValue[2] - 1);
                        let value = thisClass._value[dragValue[1] + thisClass._xResolution * dragValue[2]];
                        mag = thisClass._table3DDisplayHeight / 2;
                        value = mag * (0.5 - (value - thisClass._valueMin) / (thisClass._valueMax - thisClass._valueMin));
                        const xMin = thisClass.XAxis[0];
                        const xMag = thisClass.XAxis[thisClass._xResolution-1] - xMin;
                        const yMin = thisClass.YAxis[0];
                        const yMag = thisClass.YAxis[thisClass._yResolution-1] - yMin;
                        let point = thisClass._transformPoint([
                            (thisClass.XAxis[dragValue[1]]-xMin-xMag/2)/(xMag*1.41)*thisClass._table3DDisplayWidth*thisClass._table3DZoom, 
                            value*thisClass._table3DZoom, 
                            (thisClass.ReverseY? 1 : -1) * (thisClass.YAxis[dragValue[2]]-yMin-yMag/2)/(yMag*1.41)*thisClass._table3DDisplayWidth*thisClass._table3DZoom
                        ]);
                        $(dragValue[5]).attr(`cy`, point[1]+thisClass._table3DDisplayHeight/2+thisClass._table3DOffsetY);
                        var cell = $(`#${thisClass.GUID}-table .number[data-x='${dragValue[1]}'][data-y='${dragValue[2]}']`);
                        cell.val(Table.FormatNumberForDisplay(thisClass._value[index]));
                    }
                });
                $(document).on(`mouseup.${thisClass.GUID}-drag3d`,function(){
                    drag=false;
                    if(dragValue) {
                        thisClass._tableHueUpdate();
                        thisClass.UpdateData3D();
                    }
                    thisClass.UpdateTable3D();
                    dragValue = false;
                    move3d = false
                    $(document).off(`mouseup.${thisClass.GUID}-drag3d`);
                    $(document).off(`mousemove.${thisClass.GUID}-drag3d`);
                });
            }
        });
        $(document).on(`mousewheel.${this.GUID}-drag3d`, `#${this.GUID}-table3d`, function(e){
            if(e.originalEvent.wheelDelta /120 > 0) {
                thisClass._table3DZoom *= 1.05;
            }
            else{
                thisClass._table3DZoom *= 0.95;
            }
            thisClass.UpdateData3D();
            thisClass.UpdateTable3D();
        });
    }

    TableValueUpdate() {
        $(`#${this.GUID}-table`).replaceWith(this.GetTableHtml());
        if(this._xResolution > 1 && this._yResolution > 1)
            $(`#${this.GUID}-table3d`).replaceWith(this.GetTable3DHtml());
        this.OnChange.forEach(function(OnChange) { OnChange(); });
    }

    GetHtml() {
        return `<div id="${this.GUID}"${this._hidden? ` style="display: none;"` : ``} class="configtable"> 
    ${(this._xResolution > 1 && this._yResolution > 1)? this.GetTable3DHtml() : ``}
    <div style="display:block;">
        ${GetPasteOptions()}
        <div style="display:inline-block; position: relative;">
            <div style="width: 100; position: absolute; top: -10; left: 32px;z-index:1">Modify</div>
            <div class="container">
                <input id="${this.GUID}-modifyvalue" class="modify-value" type="number"></input>
                <div id="${this.GUID}-equal" class="modify-button"><h3>&nbsp;=&nbsp;</h3></div>
                <div id="${this.GUID}-add" class="modify-button"><h3>&nbsp;+&nbsp;</h3></div>
                <div id="${this.GUID}-multiply" class="modify-button"><h3>&nbsp;x&nbsp;</h3></div>
            </div>
        </div>
        <div style="display:inline-block; position: relative;">
            ${this._xResolution > 1 && this._yResolution > 1? `<div style="width: 100; position: absolute; top: -10; left: 32px;z-index:1">Interpolate</div>` : ``}
            <div class="container">
                ${this._xResolution > 1? `<div id="${this.GUID}-interpolatex" class="modify-button interpolate-x-button"><h3>&nbsp;☰&nbsp;</h3></div>` : ``}
                ${this._yResolution > 1? `<div id="${this.GUID}-interpolatey" class="modify-button interpolate-y-button"><h3>&nbsp;☰&nbsp;</h3></div>` : ``}
                ${this._xResolution > 1 && this._yResolution > 1? `<div id="${this.GUID}-interpolatexy" class="modify-button interpolate-xy-button"><h3>&nbsp;&#9632;&nbsp;</h3></div>` : ``}
            </div>
        </div>
    </div>
    ${this.GetTableHtml()}
</div>`;
    }

    _calculateValueMinMax() {
        this._valueMin = 10000000000;
        this._valueMax = -10000000000;
        for(let x=0;x<this._xResolution;x++){
            for(let y=0;y<this._yResolution;y++){
                let value = this._value[x + this._xResolution * y];
                if(value < this._valueMin)
                    this._valueMin = value;
                if(value > this._valueMax)
                    this._valueMax = value;
            }
        }
    }

    _getHueFromValue(value) {
        return 180 - (180 * (value - this._valueMin) / (this._valueMax - this._valueMin));
    }

    _tableHueUpdate() {
        this._calculateValueMinMax();
        const thisClass = this;
        $(`#${this.GUID}-table .number`).each(function() {
            const cellx = parseInt($(this).attr(`data-x`));
            const celly = parseInt($(this).attr(`data-y`));
            const index = cellx + celly * thisClass._xResolution;
            if(!isNaN(index) && cellx > -1 && celly > -1) {
                $(this).parent().attr(`style`, `background-color: hsl(${thisClass._getHueFromValue(thisClass._value[index])},60%,50%);`);
            }
        });
    }

    _transformPoint(point){
        let x=this._table3DtransformPrecalc[0]*point[0]+this._table3DtransformPrecalc[1]*point[1]+this._table3DtransformPrecalc[2]*point[2];
        let y=this._table3DtransformPrecalc[3]*point[0]+this._table3DtransformPrecalc[4]*point[1]+this._table3DtransformPrecalc[5]*point[2];
        let z=this._table3DtransformPrecalc[6]*point[0]+this._table3DtransformPrecalc[7]*point[1]+this._table3DtransformPrecalc[8]*point[2];
        return [x,y,z];
    };

    _data3d=[];
    _xAxis3d=[];
    _yAxis3d=[];
    UpdateData3D() {
        this._calculateValueMinMax();
        this._data3d.splice(this._xResolution);
        const xMin = this.XAxis[0];
        const xMag = this.XAxis[this._xResolution-1] - xMin;
        const yMin = this.YAxis[0];
        const yMag = this.YAxis[this._yResolution-1] - yMin;
        const mag = this._table3DDisplayHeight / 2;
        for(let x=0;x<this._xResolution;x++){
            let t = this._data3d[x];
            if(!t) {
                t = [];
                this._data3d.push(t);
            }
            t.splice(this._yResolution);
            for(let y=0;y<this._yResolution;y++){
                let valueY = this.ReverseY? y : (this.YResolution - y - 1);
                let value = this._value[x + this._xResolution * valueY];
                value = mag * (0.5 - (value - this._valueMin) / (this._valueMax - this._valueMin));
                t[y] = this._transformPoint([
                    ((this.XAxis[x]-xMin-xMag/2)/(xMag*1.41))*this._table3DDisplayWidth*this._table3DZoom, 
                    value*this._table3DZoom, 
                    (this.ReverseY? 1 : -1) * ((this.YAxis[valueY]-yMin-yMag/2)/(yMag*1.41))*this._table3DDisplayWidth*this._table3DZoom
                ]);
            }
        }
        this._xAxis3d.splice(this._xResolution);
        for(let x=0;x<this._xResolution;x++){
            let t = this._xAxis3d[x];
            if(!t) {
                t = [];
                this._xAxis3d.push(t);
            }
            for(let y=0;y<2;y++){
                t[y] = [];
                let vy = 0;
                if(y > 0)
                    vy = this._yResolution - 1;
                let valueY = this.ReverseY? vy : (this.YResolution - vy - 1);

                const xMin = this.XAxis[0];
                const xMag = this.XAxis[this._xResolution-1] - xMin;
                const yMin = this.YAxis[0];
                const yMag = this.YAxis[this._yResolution-1] - yMin;
                for(let z=0;z<2;z++) {
                    let value = this._valueMin;
                    if(z > 0)
                        value = this._valueMax;
                    value = mag * (0.5 - (value - this._valueMin) / (this._valueMax - this._valueMin));
                    t[y][z] = this._transformPoint([
                        ((this.XAxis[x]-xMin-xMag/2)/(xMag*1.41))*this._table3DDisplayWidth*this._table3DZoom, 
                        value*this._table3DZoom, 
                        (this.ReverseY? 1 : -1) * ((this.YAxis[valueY]-yMin-yMag/2)/(yMag*1.41))*this._table3DDisplayWidth*this._table3DZoom
                    ]);
                }
            }
        }
        this._yAxis3d.splice(this._yResolution);
        for(let x=0;x<2;x++){
            let t = this._yAxis3d[x];
            if(!t) {
                t = [];
                this._yAxis3d.push(t);
            }
            let vx = 0;
            if(x > 0)
                vx = this._xResolution - 1;
                
            for(let y=0;y<this._yResolution;y++){
                t[y] = [];
                let valueY = this.ReverseY? y : (this.YResolution - y - 1);

                const xMin = this.XAxis[0];
                const xMag = this.XAxis[this._xResolution-1] - xMin;
                const yMin = this.YAxis[0];
                const yMag = this.YAxis[this._yResolution-1] - yMin;
                for(let z=0;z<2;z++) {
                    let value = this._valueMin;
                    if(z > 0)
                        value = this._valueMax;
                    value = mag * (0.5 - (value - this._valueMin) / (this._valueMax - this._valueMin));
                    t[y][z] = this._transformPoint([
                        ((this.XAxis[vx]-xMin-xMag/2)/(xMag*1.41))*this._table3DDisplayWidth*this._table3DZoom, 
                        value*this._table3DZoom, 
                        (this.ReverseY? 1 : -1) * ((this.YAxis[valueY]-yMin-yMag/2)/(yMag*1.41))*this._table3DDisplayWidth*this._table3DZoom
                    ]);
                }
            }
        }
    }

    UpdateTable3DSvg() {
        this.UpdateData3D();

        this.svg=[];
        for(let x=0;x<this._xResolution;x++){
            for(let y=0;y<this._yResolution;y++){
                let valueY = this.ReverseY? y : (this.YResolution - y - 1);
                
                let depth=this._data3d[x][y][2];
                let midPointValue = this._value[x + this._xResolution * valueY];
                this.svg.push({
                    circle: {cx:(this._data3d[x][y][0]+this._table3DDisplayWidth/2+this._table3DOffsetX).toFixed(10), cy: (this._data3d[x][y][1]+this._table3DDisplayHeight/2+this._table3DOffsetY), r:1/(this._xResolution*1.41)*this._table3DDisplayWidth*this._table3DZoom/10 },
                    depth: depth, 
                    x: x,
                    y: valueY,
                    midPointValue: midPointValue,
                    hue: this._getHueFromValue(midPointValue)
                });

                if(y < this._yResolution - 1 && x < this._xResolution - 1) {
                    if(!this.ReverseY)
                        valueY -= 1;
                    depth=(this._data3d[x][y][2]+this._data3d[x+1][y][2]+this._data3d[x+1][y+1][2]+this._data3d[x][y+1][2])/4;
                    midPointValue = (this._value[x + this._xResolution * valueY] + this._value[x + this._xResolution * valueY + this._xResolution] + this._value[x + 1 + this._xResolution * valueY] + this._value[x + 1 + this._xResolution * valueY + this._xResolution])/4;
                    this.svg.push({
                        path:
                            `M${(this._data3d[x][y][0]+this._table3DDisplayWidth/2+this._table3DOffsetX).toFixed(10)},${(this._data3d[x][y][1]+this._table3DDisplayHeight/2+this._table3DOffsetY).toFixed(10)}`+
                            `L${(this._data3d[x+1][y][0]+this._table3DDisplayWidth/2+this._table3DOffsetX).toFixed(10)},${(this._data3d[x+1][y][1]+this._table3DDisplayHeight/2+this._table3DOffsetY).toFixed(10)}`+
                            `L${(this._data3d[x+1][y+1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX).toFixed(10)},${(this._data3d[x+1][y+1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY).toFixed(10)}`+
                            `L${(this._data3d[x][y+1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX).toFixed(10)},${(this._data3d[x][y+1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY).toFixed(10)}Z`,
                        depth: depth, 
                        x: x,
                        y: valueY,
                        midPointValue: midPointValue,
                        hue: this._getHueFromValue(midPointValue)
                    });
                }
            }
        }
        this.svg.sort(function(a, b){return b.depth-a.depth});
        const xaxisY = this.svg[0].y < this._yResolution / 2? (this.ReverseY? 0 : 1) : (this.ReverseY? 1 : 0);
        const yaxisX = this.svg[0].x < this._xResolution / 2? 0 : 1;
        for(let x=0; x<this._xResolution; x++) {
            const coord = this._xAxis3d[x][xaxisY];
            this.svg.unshift({
                line: {
                    x1: coord[0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                    y1: coord[0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                    x2: coord[1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                    y2: coord[1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
                }
            });
        }
        this.svg.unshift({
            line: {
                x1: this._xAxis3d[0][xaxisY][0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y1: this._xAxis3d[0][xaxisY][0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                x2: this._xAxis3d[this._xResolution-1][xaxisY][0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y2: this._xAxis3d[this._xResolution-1][xaxisY][0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
            }
        });
        this.svg.unshift({
            line: {
                x1: this._xAxis3d[0][xaxisY][1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y1: this._xAxis3d[0][xaxisY][1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                x2: this._xAxis3d[this._xResolution-1][xaxisY][1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y2: this._xAxis3d[this._xResolution-1][xaxisY][1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
            }
        });
        for(let y=0; y<this._yResolution; y++) {
            const coord = this._yAxis3d[yaxisX][y];
            this.svg.unshift({
                line: {
                    x1: coord[0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                    y1: coord[0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                    x2: coord[1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                    y2: coord[1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
                }
            });
        }
        this.svg.unshift({
            line: {
                x1: this._yAxis3d[yaxisX][0][0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y1: this._yAxis3d[yaxisX][0][0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                x2: this._yAxis3d[yaxisX][this._yResolution-1][0][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y2: this._yAxis3d[yaxisX][this._yResolution-1][0][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
            }
        });
        this.svg.unshift({
            line: {
                x1: this._yAxis3d[yaxisX][0][1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y1: this._yAxis3d[yaxisX][0][1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY, 
                x2: this._yAxis3d[yaxisX][this._yResolution-1][1][0]+this._table3DDisplayWidth/2+this._table3DOffsetX, 
                y2: this._yAxis3d[yaxisX][this._yResolution-1][1][1]+this._table3DDisplayHeight/2+this._table3DOffsetY
            }
        });

        console.log(this.svg[0])
    }

    UpdateTable3D(skipPoints){
        if(this._xResolution < 2 || this._yResolution < 2)
            return;
        this.UpdateTable3DSvg();
        const thisClass = this;
        let paths = this.svg.filter(x => x.path);
        let lines = this.svg.filter(x => x.line);
        let circles = this.svg.filter(x => x.circle);
        $(`#${this.GUID}-table3d g line`).each(function(index) {
            $(this).attr(`x1`, lines[index].line.x1)
                .attr(`y1`, lines[index].line.y1)
                .attr(`x2`, lines[index].line.x2)
                .attr(`y2`, lines[index].line.y2);
        });
        $(`#${this.GUID}-table3d g path`).each(function(index) { 
            const pathSelected = thisClass._minSelectX !== undefined && paths[index].x >= thisClass._minSelectX && paths[index].x < thisClass._maxSelectX && paths[index].y >= thisClass._minSelectY && paths[index].y < thisClass._maxSelectY;
            const t = $(this);
            t.attr(`data-x`, paths[index].x)
                .attr(`data-y`, paths[index].y)
                .attr(`d`, paths[index].path)
                .attr(`fill`, `hsl(${paths[index].hue},60%,50%)`);

            if(pathSelected) {
                t.attr(`class`, `selected`)
            } else {
                t.removeAttr(`class`);
            }
        });
        $(`#${this.GUID}-table3d g circle${skipPoints? `:visible` : ``}`).each(function(index) { 
            const t = $(this);
            let circle = circles[index];
            if(skipPoints) {
                let datax = parseInt(t.attr('data-x'));
                let datay = parseInt(t.attr('data-y'));
                circle = circles.filter(function(x) { return x.x === datax && x.y === datay; })[0];
            }
            const pointSelected = thisClass._minSelectX !== undefined && circle.x >= thisClass._minSelectX && circle.x <= thisClass._maxSelectX && circle.y >= thisClass._minSelectY && circle.y <= thisClass._maxSelectY;
            t.attr(`data-x`, circle.x)
                .attr(`data-y`, circle.y)
                .attr(`cx`, circle.circle.cx)
                .attr(`cy`, circle.circle.cy)
                .attr(`r`, circle.circle.r)
                .attr(`fill`, `hsl(${circle.hue},60%,50%)`);
            if(pointSelected) {
                t.attr(`class`, `selected`)
            } else {
                t.removeAttr(`class`);
            }
        });
    }

    _getCircleHtml(svg, pointSelected) {
        return `<circle${pointSelected? ` class="selected"` : ``} data-x="${svg.x}" data-y="${svg.y}" cx="${svg.circle.cx}" cy="${svg.circle.cy}" r="${svg.circle.r}" fill="hsl(${svg.hue},60%,50%)"></circle>`;
    }
  
    GetTable3DHtml(){
        this.UpdateData3D();
        this.UpdateTable3DSvg();

        let html = ``;

        for(let i = 0; i < this.svg.length; i++) {
            if(this.svg[i].line) {
                html += `<line x1="${this.svg[i].line.x1}" y1="${this.svg[i].line.y1}" x2="${this.svg[i].line.x2}" y2="${this.svg[i].line.y2}" stroke="white" stroke-width="1"></line>`
            }
        }

        for(let i = 0; i < this.svg.length; i++) {
            if(this.svg[i].path) {
                let pathSelected = this._minSelectX !== undefined && this.svg[i].x >= this._minSelectX && this.svg[i].x < this._maxSelectX && this.svg[i].y >= this._minSelectY && this.svg[i].y < this._maxSelectY;
                html += `<path${pathSelected? ` class="selected"` : ``} data-x="${this.svg[i].x}" data-y="${this.svg[i].y}" d="${this.svg[i].path}" fill="hsl(${this.svg[i].hue},60%,50%)"></path>`;
            }
        }

        for(let i = 0; i < this.svg.length; i++) {
            if(this.svg[i].circle) {
                let pointSelected = this._minSelectX !== undefined && this.svg[i].x >= this._minSelectX && this.svg[i].x <= this._maxSelectX && this.svg[i].y >= this._minSelectY && this.svg[i].y <= this._maxSelectY;
                html += this._getCircleHtml(this.svg[i], pointSelected);
            }
        }

        return `<svg overflow="visible" id="${this.GUID}-table3d" height="${this._table3DDisplayHeight}" width="${this._table3DDisplayWidth}"><g oncontextmenu="return false;">${html}</g></svg>`;
    };

    GetTableHtml() {
        this._calculateValueMinMax();
        var row = ``;
        var table = `<table id="${this.GUID}-table">`;

        var xstart = -1;
        var y = -1;
        if(this._yResolution > 1 && this._xResolution > 1) {
            xstart = -2;
            y = -2;
        }

        while(true) {
            var row = `<tr>`;
            for(var x = xstart; x < this._xResolution + 1; x++) {
                if(y === -2){
                    if(x == -2) {
                        // X-X - - -
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        row += `<td></td><td></td><td></td>`;
                    } else if(x === 0){
                        // - - X---X
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        row += `<td colspan="${this._xResolution}" class="xaxislabel" id="${this.GUID}-xlabel">${this._xLabel}</td>`;
                    }
                } else if(y === -1) {
                    if(x === -2) {
                    } else if(x === -1) {
                        // - - - - -
                        // - X - - -
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        if(this._yResolution === 1) {
                            row += `<td class="yaxis" id="${this.GUID}-xlabel">${this._xLabel}</td>`;
                        } else if(this._xResolution === 1) {
                            row += `<td class="xaxis" id="${this.GUID}-ylabel">${this._yLabel}</td>`;
                        } else {
                            row += `<td colspan="3" class="zlabel" id="${this.GUID}-zlabel">${this._zLabel}</td>`;
                        }
                    } else if(x === -2) {
                    } else if(x < this._xResolution) {
                        // - - - - -
                        // - - X X X
                        // - - - - -
                        // - - - - -
                        // - - - - -
                        if(this._xResolution === 1) {
                            row += `<td class="xaxis" id="${this.GUID}-zlabel">${this._zLabel}</td>`;
                        } else {
                            if(this.XAxisModifiable)
                                row += `<td class="xaxis">${this.FormatCellForDisplay(`${this.GUID}-${x}-axis`, x, y, this.XAxis[x])}</td>`;
                            else
                                row += `<td class="xaxis"><div class="number" id="${this.GUID}-${x}-axis" data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay(this.XAxis[x])}</div></td>`;
                        }
                    } else {
                        if(this.XResolutionModifiable)
                            row += `<td class="col_expand" rowspan="${this._yResolution + (xstart === -1? 2 : 1)}"></td>`;
                    }
                } else if(y < this._yResolution) {
                    if(x === -2) {
                        if(y === (this.ReverseY? this._yResolution-1 : 0)){
                            // - - - - -
                            // - - - - -
                            // X - - - -
                            // | - - - -
                            // X - - - -
                            row += `<td rowspan="${this._yResolution}" style="width: auto;"></td><td rowspan="${this._yResolution}" class="yaxislabel"><div id="${this.GUID}-ylabel">${this._yLabel}</div></td>`;
                        }
                    } else if(x === -1) {
                        // - - - - -
                        // - - - - -
                        // - X - - -
                        // - X - - -
                        // - X - - -
                        if(this._yResolution === 1) {
                            row += `<td class="yaxis" id="${this.GUID}-zlabel">${this._zLabel}</td>`;
                        } else {
                            if(this.YAxisModifiable)
                                row += `<td class="yaxis">${this.FormatCellForDisplay(`${this.GUID}-axis-${y}`, x, y, this.YAxis[y])}</td>`;
                            else 
                                row += `<td class="yaxis"><div class="number" id="${this.GUID}-axis-${y}"  data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay(this.YAxis[y])}</div></td>`;
                        }
                    } else if(x < this._xResolution) {
                        // - - - - -
                        // - - - - -
                        // - - X X X
                        // - - X X X
                        // - - X X X
                        var valuesIndex = x + this._xResolution * y;
                        var inputId =  `${this.GUID}-${x}-${y}`;
                        row += `<td>${this.FormatCellForDisplay(inputId, x, y, this._value[valuesIndex])}</td>`;
                    }
                } else {
                    if(this.YResolutionModifiable && x == xstart) {
                        row += `<td></td><td></td><td class="row_expand" colspan="${this._xResolution - xstart-1}"></td>`;
                        if(this.XResolutionModifiable)
                            row += `<td class="rowcol_expand"></td>`;
                    }
                }
            }
            row += `</tr>`;
            table += row;

            if(this.ReverseY) {
                if(y === -1)
                    y += this._yResolution;
                else if(y === 0)
                    y = this._yResolution;
                else if(y === this._yResolution)
                    break;
                else if(y<0)
                    y++;
                else
                    y--;
            } else {
                y++;
                if(y === this._yResolution + 1)
                    break;
            }
                
        }

        return table + `</table>`;
    }

    FormatCellForDisplay(id, x, y, value) {
        var rowClass = $(`#${id}`).attr(`class`)
        if(rowClass)
            rowClass = `class="${rowClass}"`;
        else
            rowClass = `class="number"`;
        
        x ??= $(`#${id}`).attr(`data-x`);
        y ??= $(`#${id}`).attr(`data-y`);
        value ??= $(`#${id}`).val();
        if(value === ``)
            value = $(`#${id}`).html();

        if(rowClass.indexOf("origselect") === -1)
            return `<div${x>-1&&y>-1? ` style="background-color: hsl(${this._getHueFromValue(value)},60%,50%);"` : ``}><div ${rowClass} id="${id}" data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay(value)}</div></div>`;
        return `<div${x>-1&&y>-1? ` style="background-color: hsl(${this._getHueFromValue(value)},60%,50%);"` : ``}><input ${rowClass} id="${id}" data-x="${x}" data-y="${y}" value="${Table.FormatNumberForDisplay(value)}" type="number"/></div>`;
    }

    static FormatNumberForDisplay(number, precision = 6) {
        var ret = parseFloat(parseFloat(parseFloat(number).toFixed(precision -1)).toPrecision(precision));
        if(isNaN(ret))
            return `&nbsp;`;
        return ret;
    }
    

    Trail(x, y, z) {
        //TODO add trail
    }
}

var pastetype = `equal`;

function AttachPasteOptions() {
    DetachPasteOptions();
    $(document).on(`click.pasteoptions`, `#pasteoptions .paste-button`, function(){
        pastetype = $(this).attr(`data-pastetype`);
        $(`#pasteoptions div`).removeClass(`selected`);
        $(`#pasteoptions div[data-pastetype="${pastetype}"`).addClass(`selected`);
    });
}

function DetachPasteOptions() {
    $(document).off(`click.pasteoptions`);
}

function GetPasteOptions() {
    return `<div style="display:inline-block; position: relative;"><div style="width: 150; position: absolute; top: -10; left: 32px;z-index:1">Paste Options</div>
    <div id="pasteoptions" class="container">
        <div data-pastetype="equal"       class="paste-button${pastetype==`equal`? ` selected` : ``         }" style="position: relative;"><h3>📋</h3><span>=</span></div>
        <div data-pastetype="add"         class="paste-button${pastetype==`add`? ` selected` : ``           }" style="position: relative;"><h3>📋</h3><span>+</span></div>
        <div data-pastetype="subtract"    class="paste-button${pastetype==`subtract`? ` selected` : ``      }" style="position: relative;"><h3>📋</h3><span>-</span></div>
        <div data-pastetype="multiply"    class="paste-button${pastetype==`multiply`? ` selected` : ``      }" style="position: relative;"><h3>📋</h3><span>x</span></div>
        <div data-pastetype="multiply%"   class="paste-button${pastetype==`multiply%`? ` selected` : ``     }" style="position: relative;"><h3>📋</h3><span>%</span></div>
        <div data-pastetype="multiply%/2" class="paste-button${pastetype==`multiply%/2`? ` selected` : ``   }" style="position: relative;"><h3>📋</h3><span><sup>%</sup>&frasl;<sub>2</sub></span></div>
    </div>
</div>`;
}

document.addEventListener(`dragstart`, function(e){
    if($(e.target).hasClass(`selected`) || $(e.target).hasClass(`row_expand`) || $(e.target).hasClass(`col_expand`))
        e.preventDefault();
});//disable dragging of selected items