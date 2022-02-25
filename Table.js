class Table {
    MinX = 0;
    MinXModifiable = true;
    MaxX = 0;
    MaxXModifiable = true;
    MinY = 0;
    MinYModifiable = true;
    MaxY = 0;
    MaxYModifiable = true;
    XResolutionModifiable = true;
    YResolutionModifiable = true;
    OnChange = [];

    _xResolution = 8;
    get XResolution() {
        return this._xResolution;
    }
    set XResolution(xRes) {
        this.MaxX = parseFloat((this.MaxX - this.MinX) * (xRes-1) / (this._xResolution-1) + this.MinX);
        var newValue = new Array(Math.max(1, xRes) * Math.max(1, this.YResolution));
        for(var x=0; x<xRes; x++){
            for(var y=0; y<this.YResolution; y++){
                var oldValuesIndex = x + this._xResolution * y;
                var newValuesIndex = x + xRes * y;
                if(x >= this._xResolution){
                    var newValuesIndexMinus1 = (x-1) + xRes * y;
                    var newValuesIndexMinus2 = (x-2) + xRes * y;
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
        $(`#${this.GUID}-table`).replaceWith(this.GetTable());
        this.OnChange.forEach(function(OnChange) { OnChange(); });
    }

    _yResolution = 8;
    get YResolution() {
        return this._yResolution;
    }
    set YResolution(yRes) {
        this.MaxY = parseFloat((this.MaxY - this.MinY) * (yRes-1) / (this._yResolution-1) + this.MinY);
        var newValue = new Array(Math.max(1, this._xResolution) * Math.max(1, yRes));
        for(var x=0; x<this._xResolution; x++){
            for(var y=0; y<yRes; y++){
                var valuesIndex = x + this._xResolution * y;
                if(y >= this._yResolution){
                    var valuesIndexMinus1 = x + this._xResolution * (y-1);
                    var valuesIndexMinus2 = x + this._xResolution * (y-2);
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
        $(`#${this.GUID}-table`).replaceWith(this.GetTable());
        this.OnChange.forEach(function(OnChange) { OnChange(); });
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
                const cellx = parseInt($(cell).data(`x`));
                const celly = parseInt($(cell).data(`y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] = value;
                $(cell).replaceWith(Table.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-add`, function(){
            var value = parseFloat($(`#${thisClass.GUID}-modifyvalue`).val());
            if(isNaN(value))
                return;
            $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).data(`x`));
                const celly = parseInt($(cell).data(`y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] += value;
                $(cell).replaceWith(Table.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });
        $(document).on(`click.${this.GUID}`, `#${this.GUID}-multiply`, function(){
            var value = parseFloat($(`#${thisClass.GUID}-modifyvalue`).val());
            if(isNaN(value))
                return;
            $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                const id = $(cell).attr(`id`);
                const cellx = parseInt($(cell).data(`x`));
                const celly = parseInt($(cell).data(`y`));
                index = cellx + celly * thisClass._xResolution;
                thisClass._value[index] *= value;
                $(cell).replaceWith(Table.FormatCellForDisplay(id, cellx, celly, thisClass._value[index]));
            });
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });

        $(document).on(`change.${this.GUID}`, `#${this.GUID}-table`, function(e){
            var x = parseInt($(e.target).data(`x`));
            var y = parseInt($(e.target).data(`y`));
            var value = parseFloat($(e.target).val());
            
            if(x === -1) {
                if(y === 0){
                    //TODO interpolate
                    thisClass.MinY = value;
                } else if (y === thisClass._yResolution - 1){
                    //TODO interpolate
                    thisClass.MaxY = value;
                }
                for(var i = 1; i < thisClass._yResolution - 1; i++) {
                    $(`#${thisClass.GUID}-table .number[data-x='-1'][data-y='${i}']`).html(Table.FormatNumberForDisplay((thisClass.MaxY - thisClass.MinY) * i / (thisClass._yResolution-1) + thisClass.MinY));
                }
            } else if(y === -1) {
                if(x === 0){
                    //TODO interpolate
                    thisClass.MinX = value;
                } else if (x === thisClass._xResolution - 1){
                    //TODO interpolate
                    thisClass.MaxX = value;
                }
                for(var i = 1; i < thisClass._xResolution - 1; i++) {
                    $(`#${thisClass.GUID}-table .number[data-x='${i}'][data-y='-1']`).html(Table.FormatNumberForDisplay((thisClass.MaxX - thisClass.MinX) * i / (thisClass._xResolution-1) + thisClass.MinX));
                }
            } else {
                $.each($(`#${thisClass.GUID}-table .number.selected`), function(index, cell) {
                    const cellx = parseInt($(cell).data(`x`));
                    const celly = parseInt($(cell).data(`y`));
                    index = cellx + celly * thisClass._xResolution;
                    thisClass._value[index] = value;
                    if(cellx !== x || celly !== y)
                        $(cell).html(thisClass._value[index]);
                });
            }
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        });

        var selecting = false;
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
            $(`#${thisClass.GUID}-table .number`).removeClass(`selected`);
            $(`#${thisClass.GUID}-table .number`).removeClass(`origselect`);
            if(previousOrigSelect) {
                index = previousOrigSelect.data(`x`) + previousOrigSelect.data(`y`) * thisClass._xResolution;
                thisClass._value[index] = previousOrigSelect.val();
                previousOrigSelect.replaceWith(Table.FormatCellForDisplay(previousOrigSelect.attr(`id`)));
            }

            if($(this).data(`x`) === undefined || parseInt($(this).data(`x`)) < 0 || $(this).data(`y`) === undefined || parseInt($(this).data(`y`)) < 0)
                return;

            pointX =  $(this).offset().left - $(this).closest(`table`).offset().left;
            pointY =  $(this).offset().top - $(this).closest(`table`).offset().top;

            $(this).addClass(`selected`);
            $(this).addClass(`origselect`);
            selecting = true;
        }

        function up() {
            $(document).off(`touchmove.${this.GUID}`);
            $(document).off(`mousemove.${this.GUID}`);

            if(selecting) {
                $(`#${thisClass.GUID}-table .origselect`).replaceWith(Table.FormatCellForDisplay($(`#${thisClass.GUID}-table .origselect`).attr(`id`)));
                $(`#${thisClass.GUID}-table .origselect`).select();
            }
            selecting = false;
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
            if(selecting || selectOnMove){
                $.each($(`#${thisClass.GUID}-table .number`), function(index, cell) {
                    var cellElement = $(cell);
                    if(cellElement.data(`x`) === undefined || parseInt(cellElement.data(`x`)) < 0 || cellElement.data(`y`) === undefined || parseInt(cellElement.data(`y`)) < 0)
                        return;
        
                    var relX = pageX - tableElement.offset().left;
                    var elX = cellElement.offset().left - tableElement.offset().left;
                    var relY = pageY - tableElement.offset().top;
                    var elY = cellElement.offset().top - tableElement.offset().top;
                    if(((elX <= relX && elX >= pointX) || (elX >= (relX - cellElement.width()) && elX <= pointX) || (pointX == cellElement.offset().left - tableElement.offset().left)) &&
                        ((elY <= relY && elY >= pointY) || (elY >= (relY - cellElement.height()) && elY <= pointY) || (pointY == cellElement.offset().top - tableElement.offset().top))) {
                        if(selecting)
                            cellElement.addClass(`selected`);
                        else if (selectOnMove && !cellElement.hasClass(`origselect`)) {
                            selectOnMove = false;
                            selecting = true;
                        }
                    } else if(selecting) {
                        cellElement.removeClass(`selected`);
                    }
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
            $.each(data.split(`\n`), function(yIndex, val) {
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
                    cell.replaceWith(Table.FormatCellForDisplay(id, xPos, yPos, thisClass._value[xPos + yPos * thisClass._xResolution]));
                    $(`#${id}`).select();
                });
            });
            thisClass.OnChange.forEach(function(OnChange) { OnChange(); });
        }

        $(document).on(`copy.${this.GUID}`, `#${this.GUID}-table .number`, function(e){
            if($(this).data(`x`) === undefined || parseInt($(this).data(`x`)) < 0 || $(this).data(`y`) === undefined || parseInt($(this).data(`y`)) < 0)
                return;

            selecting = false;
            e.originalEvent.clipboardData.setData(`text/plain`, getCopyData());
            e.preventDefault();
        });

        $(document).on(`paste.${this.GUID}`, `#${this.GUID}-table .number`, function(e){
            if($(this).data(`x`) === undefined || parseInt($(this).data(`x`)) < 0 || $(this).data(`y`) === undefined || parseInt($(this).data(`y`)) < 0)
                return;
            var val = e.originalEvent.clipboardData.getData(`text/plain`);

            var selectedCell = $(`#${thisClass.GUID}-table .number.origselect`)
            var x = selectedCell.data(`x`);
            var y = selectedCell.data(`y`);
            if(x < 0 || y < 0)
                return;

            pasteData(x,y,val,pastetype);

            selecting = false;
            e.preventDefault();
        });
    }

    GetHtml() {
        return `<div id="${this.GUID}"${this._hidden? ` style="display: none;"` : ``} class="configtable"> 
    <div style="display:block;">${GetPasteOptions()}<div style="display:inline-block; position: relative;"><div style="width: 100; position: absolute; top: -10; left: 32px;z-index:1">Modify</div><div class="container">
    <div id="${this.GUID}-equal" class="modify-button"><h3>&nbsp;=&nbsp;</h3></div>
    <div id="${this.GUID}-add" class="modify-button"><h3>&nbsp;+&nbsp;</h3></div>
    <div id="${this.GUID}-multiply" class="modify-button"><h3>&nbsp;x&nbsp;</h3></div>
    <input id="${this.GUID}-modifyvalue" class="modify-button" type="number"></input>
    </div></div></div>` + this.GetTable() + 
`</div>`;
    }

    GetTable() {
        var row = ``;
        var table = `<table id="${this.GUID}-table">`;

        var xstart = -1;
        var ystart = -1;
        if(this._yResolution > 1 && this._xResolution > 1) {
            xstart = -2;
            ystart = -2;
        }

        for(var y = ystart; y < this._yResolution + 1; y++) {
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
                            if((x === 0 && this.MinXModifiable) || (x === this._xResolution - 1 && this.MaxXModifiable))
                                row += `<td class="xaxis"><input class="number" id="${this.GUID}-${x}-axis" data-x="${x}" data-y="${y}" type="number" value="${parseFloat(parseFloat(((this.MaxX - this.MinX) * x / (this._xResolution-1) + this.MinX).toFixed(6)).toPrecision(7))}"/></td>`;
                            else
                                row += `<td class="xaxis"><div class="number" id="${this.GUID}-${x}-axis" data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay((this.MaxX - this.MinX) * x / (this._xResolution-1) + this.MinX)}</div></td>`;
                        }
                    } else {
                        if(this.XResolutionModifiable)
                            row += `<td class="col_expand" rowspan="${this._yResolution + (xstart === -1? 2 : 1)}"></td>`;
                    }
                } else if(y < this._yResolution) {
                    if(x === -2) {
                        if(y === 0){
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
                            if((y === 0 && this.MinYModifiable) || (y === this._yResolution - 1 && this.MaxYModifiable))
                                row += `<td class="yaxis"><input class="number" id="${this.GUID}-axis-${y}"  data-x="${x}" data-y="${y}" type="number" value="${parseFloat(parseFloat(((this.MaxY - this.MinY) * y / (this._yResolution-1) + this.MinY).toFixed(6)).toPrecision(7))}"/></td>`;
                            else 
                                row += `<td class="yaxis"><div class="number" id="${this.GUID}-axis-${y}"  data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay((this.MaxY - this.MinY) * y / (this._yResolution-1) + this.MinY)}</div></td>`;
                        }
                    } else if(x < this._xResolution) {
                        // - - - - -
                        // - - - - -
                        // - - X X X
                        // - - X X X
                        // - - X X X
                        var valuesIndex = x + this._xResolution * y;
                        var inputId =  `${this.GUID}-${x}-${y}`;
                        row += `<td>${Table.FormatCellForDisplay(inputId, x, y, this._value[valuesIndex])}</td>`;
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
        }

        return table + `</table>`;
    }

    static FormatNumberForDisplay(number, precision = 6) {
        var ret = parseFloat(parseFloat(parseFloat(number).toFixed(precision -1)).toPrecision(precision));
        if(isNaN(ret))
            return `&nbsp;`;
        return ret;
    }
    
    static FormatCellForDisplay(id, x, y, value) {
        var rowClass = $(`#${id}`).attr(`class`)
        if(rowClass)
            rowClass = `class="${rowClass}"`;
        else
            rowClass = `class="number"`;
        
        x ??= $(`#${id}`).data(`x`);
        y ??= $(`#${id}`).data(`y`);
        value ??= $(`#${id}`).val();
        if(value === ``)
            value = $(`#${id}`).html();

        if(rowClass.indexOf("origselect") === -1)
            return `<div ${rowClass} id="${id}" data-x="${x}" data-y="${y}">${Table.FormatNumberForDisplay(value)}</div>`;
        return `<input ${rowClass} id="${id}" data-x="${x}" data-y="${y}" value="${Table.FormatNumberForDisplay(value)}" type="number"/>`;
    }

    Trail(x, y, z) {
        //TODO add trail
    }
}

var pastetype = `equal`;

function AttachPasteOptions() {
    DetachPasteOptions();
    $(document).on(`click.pasteoptions`, `#pasteoptions .paste-button`, function(){
        pastetype = $(this).data(`pastetype`);
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