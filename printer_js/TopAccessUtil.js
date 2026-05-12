/** <pre>
    *-------------------------------------------------------------------------------

    *

    *-------------------------------------------------------------------------------
    * File: TopAccessUtil.js?v=1511376672ta
    *-------------------------------------------------------------------------------
    * DESCRIPTION:
    * The Generic functions are defined here.
    *
	* AUTHOR	 :   Kalyan
    * MODIFIEDBY :   Tarkeshwar,Bijay,Sangeetha
    * PROJECT:		[TOPACCESS]
    *
    * Date Of Creation	: 14-Sep-2006
    * Version No.		: 1.0
    *-------------------------------------------------------------------------------
    * DEPENDENCIES
    *
    *-------------------------------------------------------------------------------
    * </pre>
    */

    var gblRoleSep = ":⇔";
    var gblGroupSep = ":⇔";
	var gblSep1 = "¬";
	var gblSep2 = "∃!";
	var gblDestSep1 = ":⇔";    // for ~~ in Destination Settigs
	var gblDestSep2 = "⊕∀";    // for :: in Destination Settigs
	var gblFullNameSep = "∃!";    // for firstName and Lastname of a contact
	var gblPermSepStr = ",";    // for creating the permission string
    var gblPermListSep = "~";
    var gblAddrsBookSep = "⊕∀";  // For Address book add contact 
	// Set values in the parent(called) html from the child html
    function set(hashmapObj) {
        for (var key in hashmapObj)
            setParentValues(key, hashmapObj[key])
    }
    function setParentValues(parent,child) {
        opener.setValue(parent,getValue(child));

       /* var objWidget= opener.document.getElementById(parent);
        var strObjType=objWidget.type;
        if(strObjType=="select-one") {
            objWidget.onchange();
            }            */
    }
    // Set values in the open window from the parent window
    function get(hashmapObj) {
        for(var key in hashmapObj)	{
            getParentValues(key,hashmapObj[key]);
        }
    }
    function getParentValues(parent,child) {
        setValue(child,opener.getValue(parent));
    }
	//clears all the fields in the parent window widgets mentioned in hashmap 
    function clearParentValues(hashmap,frmName){
		if (frmName == null) {
			for (var parent in hashmap){
				//alert(parent)
				opener.setValue(parent,"");
			}
		}else{
			for (var parent in hashmap){
				opener.setValue(parent,"",frmName);
			}
		}
	}
    function getValue(strFldName,strFrmName) {
        //Returns, the value of the field.
        //if its a checkBox, it returns string with ~ separator.
        try{	
			
			if (strFrmName == null){
				objFld=eval("document.forms[0]."+strFldName);
			}else
				objFld = eval('document.'+strFrmName+'.'+strFldName);

            if(objFld) {
                if (typeof objFld != 'nothing') {
                    return getValueOfObj(objFld,strFldName);
                }
            } else {
                objFld=document.getElementById(strFldName);
                if(objFld != null) {
					if (typeof objFld != 'nothing') {
						return getValueOfID(objFld,strFldName);
					}
                }
            }
        } catch(e) { errHandler(e,'getValue()','TopAccessUtil.js?v=1511376672ta',strFldName) }

    }
    function getValueOfID(objFld,strFldName) {
        try {
			if(objFld.hasChildNodes()){
                    return objFld.childNodes[0].nodeValue ;
            }
			return "";
        } catch(e ) { errHandler(e,'getValueOfID()','TopAccessUtil.js?v=1511376672ta',strFldName) }

    }

    function getValueOfObj(objFld,strFldName) {
        try {
            var strObjType = "";
            strObjType=objFld.type
            //radio button would be of undefined type
            if (typeof strObjType == 'undefined' )
                strObjType=objFld[0].type;
            if (typeof objFld != 'nothing') {
                if ( strObjType == 'text' || strObjType == 'textarea' || strObjType == 'password' 
							|| strObjType == 'hidden' || strObjType == 'button')
                    //return trim(objFld.value);
                    return objFld.value;
                    //return trim(objFld.getAttribute("value"));
                else if (strObjType == 'radio')
                    //return trim(getSelectedRadioValue(objFld));
                    return getSelectedRadioValue(objFld);
                else if(strObjType=="select-one") {
                    //strListval=trim(getListBoxValue(objFld))
                    strListval=getListBoxValue(objFld)
                    if (strListval == 'undefined')
                        //return trim(getListBoxText(objFld));
                        return getListBoxText(objFld);
                    else
                        return strListval
                }
                else if (strObjType == 'checkbox')
                    //return trim(getCheckBoxValue(objFld));
                    return getCheckBoxValue(objFld);
            }  /* if (typeof objFld != 'nothing') */
            return "";
        } catch(e) {errHandler(e,'getValueOfObj()','TopAccessUtil.js?v=1511376672ta',strFldName)}
    }
    function getCheckBoxValue(objCheckBox) {
        try {
            var retval = new Array(1);
            retval[0] = "";
            counter = 0;
            if (!objCheckBox.length) {
                if(objCheckBox.checked)
                    retval[counter] = objCheckBox.value;
            }
            else {
                for(i=0;i<objCheckBox.length; i++){
                    if(objCheckBox[i].checked){
                        retval[counter] = objCheckBox[i].value;
                        counter++;
                    }
                }
            }
            //Return the String to convert the Array to String.
            //Array will be commas. and replace the commas with Tildes.
            return retval.toString().replace(/\,/g,'~');
        } catch(e) {errHandler(e,'getListBoxValue()','TopAccessUtil.js?v=1511376672ta',field)}

    }

    function getListBoxValue(objListBox) {
        try {
            if(objListBox.selectedIndex>=0)
                return objListBox.options[objListBox.selectedIndex].value;
            else
                return "";
        } catch(e) {errHandler(e,'getListBoxValue()','TopAccessUtil.js?v=1511376672ta',strFldName)}
    }

    function getListBoxText(objListBox) {
        try{
            if(objListBox.selectedIndex>=0)
                return objListBox.options[objListBox.selectedIndex].text;
            else
                return "";
        }catch(e) {errHandler(e,'getListBoxText()','TopAccessUtil.js?v=1511376672ta',field)}
    }

    function getSelectedRadioValue(objRadio) {
        try {
            if (!objRadio.length) {
                if(objRadio.checked)
                    return objRadio.value;
            }
            else {
                for(i=0;i<objRadio.length; i++) {
                    if(objRadio[i].checked)
                        return objRadio[i].value;
                }
            }
            return "";
        } catch(e) {errHandler(e,'getSelectedRadioValue()','TopAccessUtil.js?v=1511376672ta',field)}
    }

    function setValue(field,val,strFrmName) {
        //sets the value of the field
        try {
			if (strFrmName == null){
                fieldObj = eval('document.forms[0].'+field);
			}else
				fieldObj = eval('document.'+strFrmName+'.'+field);
            
            if(fieldObj) {
                if (typeof fieldObj != 'nothing') {
                    setValueOfObj(fieldObj,val,field);}
            } else {
                objEle=document.getElementById(field);
                if(objEle != null) {
					if (typeof objEle != 'nothing') {
						return setValueToID(objEle,val,field);
					}
                }
            }

        } catch(e) {errHandler(e,'setValue()','TopAccessUtil.js?v=1511376672ta',field)}
    }

    function setValueToID(objEle,val,strFldName) {
        try {
            //objEle.innerHTML = val
            // @val cannot contain the HTML string (say <Table>,<TR>,<TD>,<Select> etc).This limitation has to be addressed later.
			// Date : 05-Mar-09
                if(objEle.hasChildNodes()){
                    objEle.childNodes[0].nodeValue = val;
				}else{
						objEle.appendChild(document.createTextNode(val));
				}
        } catch(e) {objEle.innerHTML = val;errHandler(e,'setValueToID()','TopAccessUtil.js?v=1511376672ta',strFldName)}
    }

    function setValueOfObj(fieldObj,val,field) {
        try {
            var objType = ""
            objType = fieldObj.type
            if(typeof objType == "undefined") {
                objType=fieldObj[0].type
                if(objType == "undefined")
                    objType = fieldObj.tagName;
            }
            if (typeof fieldObj != 'nothing') {
                //if ( objType == 'text' || objType == 'textarea'
                if ( objType == 'text'
						|| objType == 'password' || objType == 'button'){
                    fieldObj.value = val;
					//fieldObj.setAttribute("value",val);
				}
				else if (objType == 'textarea'){
					fieldObj.value = val;
					if (fieldObj.onchange){
						fieldObj.onchange();
					}
				}else if (objType == 'hidden'){
					fieldObj.value = val;
					if (fieldObj.onchange){
						fieldObj.onchange();
					}
				}
                else if (objType == 'radio'){
                    setRadioValue(fieldObj,val);
				}
                else if(objType=="select-one") {
                    setListBoxValue(fieldObj,val);
					if (fieldObj.onchange){
						fieldObj.onchange();
					}
                    //setListBoxText(fieldObj,val);
                }
                else if (objType == 'checkbox'){
                    setCheckBoxValue(fieldObj,val);
				}
            }
        } catch(e) {errHandler(e,'setValueOfObj()','TopAccessUtil.js?v=1511376672ta',field)}
    }

    function setRadioValue(fieldObj,val){
        try{
            if (!fieldObj.length) {
                if(fieldObj.value == val){
                    fieldObj.checked = true;
					if (fieldObj.onchange){
						fieldObj.onchange();
					}
					if (fieldObj.onclick){
						fieldObj.onclick();
					}
				}
            }
            else {
                for(i=0;i<fieldObj.length;i++){
                    if(fieldObj[i].value == val){
                        fieldObj[i].checked = true;
						if (fieldObj[i].onchange){
							fieldObj[i].onchange();
						}
						if (fieldObj[i].onclick){
							fieldObj[i].onclick();
						}
					}
                }
            }
        } catch(e) {errHandler(e,'setRadioValue()','TopAccessUtil.js?v=1511376672ta')}
    }

    function setListBoxValue(fieldObj,val) {
        try {
            for(i=0;i<fieldObj.length;i++){
                if(fieldObj.options[i].value == val)
                    fieldObj.selectedIndex = i;
            }
        } catch(e) {errHandler(e,'setListBoxValue()','TopAccessUtil.js?v=1511376672ta')}
    }

    function setListBoxText(fieldObj,val) {
        try {
            for(var i=0;i<fieldObj.length;i++){
                if(fieldObj.options[i].text == val)
                    fieldObj.selectedIndex = i;
            }
        } catch(e) {errHandler(e,'setListBoxText()','TopAccessUtil.js?v=1511376672ta')}
    }

    function setCheckBoxValue(fieldObj,val) {
        try {
            
			var eachval = new String(val).split('~');
			//alert("eachval=>"+eachval.length+"    eachval="+eachval)
			if (eachval.length == "1" && eachval[0] == "" && fieldObj.length != undefined){
				for(i=0;i<fieldObj.length;i++) {
                    fieldObj[i].checked = false;
					if (fieldObj[i].onclick){
						fieldObj[i].onclick();
					}
                }
				return;
			}
            for(var e=0; e <eachval.length; e++){
				//alert("e loop value="+e);
                if (!fieldObj.length) {                    
					if ((eachval[e]=='') || (eachval[e]!=fieldObj.value)){
                        fieldObj.checked = false;
						if (fieldObj.onclick){
							fieldObj.onclick();
						}
					}
                    else {
                        if(fieldObj.value == eachval[e]){
                            fieldObj.checked = true;
							if (fieldObj.onclick){
								fieldObj.onclick();
							}
						}
                    }
                }
                else {
                    for(var i=0;i<fieldObj.length;i++) {
                        if(fieldObj[i].value == eachval[e]){
							//alert("setting the checkbox = "+eachval[e]);
                            fieldObj[i].checked = true;
							if (fieldObj[i].onclick){
								fieldObj[i].onclick();
							}
						}
                    }
                }
            }
			//alert("come out of setValue")
        } catch(e) {errHandler(e,'setCheckBoxValue()','TopAccessUtil.js?v=1511376672ta')}
    }

    function trim(pStr1) {
        try {
            var pStr=pStr1
            var blank_pattern=/^(\s)/;
            var blank_pattern1=/(\s)$/;
            var foundarray
            foundarray = blank_pattern.exec(pStr)
            while(foundarray) {
                pStr=pStr.substring(1,pStr.length)
                foundarray=blank_pattern.exec(pStr)
            }
            foundarray = blank_pattern1.exec(pStr)
            while(foundarray) {
                pStr=pStr.substring(0,pStr.length-1)
                foundarray=blank_pattern1.exec(pStr)
            }
            return pStr
        } catch(e) {errHandler(e,'trim()','TopAccessUtil.js?v=1511376672ta')}
    }

    function getText(strFldName,strFrmName) {
        try {
            //Returns, the Text of the field.
            //if its a checkBox, it returns string with ~ separator.
            if (strFrmName == null){
				objFld=eval("document.forms[0]."+strFldName);
			}else
				objFld = eval('document.'+strFrmName+'.'+strFldName);

            if(objFld) {
                if (typeof objFld != 'nothing') {
                    return getTextOfObj(objFld,strFldName);
                }
            } else {
                objFld=eval("document.getElementById('"+strFldName+"')");
                if(objFld != null) {
					if (typeof objFld != 'nothing') {
						return getTextOfObj(objFld,strFldName);
					}
                }
            }

        } catch(e) {errHandler(e, 'getText()','TopAccessUtil.js?v=1511376672ta',strFldName)}
    }

    function getTextOfObj(objFld,strFldName) {
        try {
            var strObjType = "";
            //radio button would be of undefined type
            strObjType=objFld.type
            if (typeof strObjType == 'undefined' )
                strObjType=objFld[0].type;
            if (typeof objFld != 'nothing') {
                if ( strObjType == 'text')
                    //return trim(objFld.value);
                    return objFld.value;
                if ( strObjType == 'hidden')
                    //return trim(objFld.text);
                    return objFld.text;
                if (strObjType == 'radio')
                    //return trim(getSelectedRadioText(objFld));
                    return getSelectedRadioText(objFld);
                if(strObjType=="select-one")
                    return getListBoxText(objFld);
                if (strObjType == 'checkbox')
                    //return trim(getCheckBoxText(objFld));
                    return getCheckBoxText(objFld);
            }	// if (typeof objFld != 'nothing')
            return "";
        } catch(e){errHandler(e,'getTextOfObj()','TopAccessUtil.js?v=1511376672ta',strFldName)}
    }

    function getCheckBoxText(objCheckBox) {
        try {
            var retval = new Array(1);
            retval[0] = "";
            counter = 0;
            for(i=0;i<objCheckBox.length; i++){
                if(objCheckBox[i].checked){
                    retval[counter] = objCheckBox[i].text;
                    counter++;
                }
            }
            //Return the String to convert the Array to String.
            //Array will be commas. and replace the commas with Tildes.
            return retval.toString().replace(/,/gi,'~');
        } catch(e){errHandler(e,'getCheckBoxText()','TopAccessUtil.js?v=1511376672ta')}
    }

    function getListBoxText(objListBox) {
        try {
            if(objListBox.selectedIndex>=0) {
                val = objListBox.options[objListBox.selectedIndex].text
                if(val!="")
                    //return trim(val);
                    return val;
                else
                    return ""
            }
            else
                return "";
        } catch(e){errHandler(e,'getListBoxText()','TopAccessUtil.js?v=1511376672ta')}
    }

    function getSelectedRadioText(objRadio) {
        try {
            for(i=0;i<objRadio.length; i++){
                if(objRadio[i].checked)
                    return objRadio[i].text;
            }
            return "";
        } catch(e){errHandler(e,'getSelectedRadioText()','TopAccessUtil.js?v=1511376672ta')}
    }

    function errHandler(e,fnName,thispage,strFldName) {
        errmsg = "Exception Page: " + thispage + ".Fn : " + fnName + ".Msg : " + e.message + ". Type : " + e.name + ". Desc:"  + e.description +". ErrNo="+(e.number & 0xFFFF);
        if (strFldName)
            errmsg=errmsg+" FieldName:"+strFldName;
        window.status =  errmsg;
        alert("Exception Occured !! "+errmsg);
    }

    function checkmax(ptrname) {
        if(isInteger(ptrname) == false) return;
        if(ptrname.value>255) {
            alert("IP address entered has to be within the range 0 and 255");
            ptrname.value="";
            ptrname.focus();
        }
    }

    function isInteger(s) {
        var i;
        for (i=0;i<s.value.length;i++) {
            var c = s.value.charAt(i);
            if(((c <"0")||(c>"9"))) {
                alert("IP address should not contain characters");
                s.value="";
                s.focus();
                return false;
            }
        }
        return true;
    }

    function showDivs(divlist,visibilityFlag) {
        var eachDiv = divlist.split('~');
        for(i=0;i<(eachDiv.length);i++){
            obj = document.getElementById(eachDiv[i]);
            if (obj!=undefined){
                if(visibilityFlag == null || (!visibilityFlag))
                    obj.style.display="";
                else if(visibilityFlag)
                    obj.style.visibility="visible";
            }
        }
    }

    function hideDivs(divlist,visibilityFlag) {
        var eachDiv=divlist.split('~');
        for(i=0;i<(eachDiv.length);i++) {
            obj=document.getElementById(eachDiv[i]);
            if (obj!=undefined){
                if(visibilityFlag == null || (!visibilityFlag))
                    obj.style.display="none";
                else if(visibilityFlag)
                    obj.style.visibility="hidden";
            }
        }
    }
 
    function split(val,delim) {
        return val.split(delim);
    }

    function nextval(arg) {
        arg.idx++;
        if (arg.idx < arg.arr.length)
            return arg.arr[arg.idx];
        else
            return "";
    }

function getQueryStringValue(varname,locationType) {
        try {
            /* locationType is a param which has enumeration ("parent" & "self" & "top")   */
            var strloc = "";
            if (locationType == null || locationType == "parent"){
                strloc = parent.location.href;
            }else if (locationType == "top"){
                strloc = top.location.href;
            }else if (locationType == "self"){
                strloc = location.href;
            }else if (locationType == "parent.parent") {
                strloc = parent.parent.location.href;
            }
            if(strloc.indexOf("?")== -1 && strloc.indexOf("#")== -1) {
                //alert("Error: strVar is null in getQueryStringValue()")
            } else {
                var strVar = "";
                if(strloc.indexOf("?") != -1)
                    strVar = strloc.split("?");
                else
                    strVar = strloc.split("#");
                var arrExpressions = strVar[1].split("&");
                if(arrExpressions == null){
                   // alert("Error: arrExpressions is null in getQueryStringValue()")
				}
                var arrVars = null;
                for (i=0;i<arrExpressions.length;i++) {
                    arrVars = arrExpressions[i].split("=");
                    if (arrVars[0] == varname) {
                        //alert("inside getQueryStringValue fun"+unescape(arrVars[1]));
                        return unescape(arrVars[1]);
                    }
                }
            }

            return "";
        } catch(e){errHandler(e,'getQueryStringValue()','TopAccessUtil.js?v=1511376672ta',"");return "";}
    }
    /**
     * Eliminate the blank space from the field value.
     */
    function trimString(fieldName) {
        var fieldValue = fieldName.value;
        var firstChar = fieldValue.charAt(0);
        while(firstChar == " ") {
            fieldValue = fieldValue.substring(1,fieldValue.length);
            firstChar = fieldValue.charAt(0);
        }
        var lastChar = fieldValue.charAt(fieldValue.length - 1);
        while(lastChar == " ") {
            fieldValue = fieldValue.substring(0,fieldValue.length - 1);
            lastChar = fieldValue.charAt(fieldValue.length - 1);
        }
        fieldName.value = fieldValue;
    }
    /****  To construct the progress bar.*******/
    // if progress-bar id is "progressBar" then the parameter to this function becomes "progress".
    function fnnConstProgbar(progressId)
    {
        try{
            var dynHtml="<table WIDTH='300'><tr><td CLASS='clsTableElement' colspan='100' align='center' id='PercentBar'></td></tr></table>";
            dynHtml+="<p></p><table style='border:blue 4px groove;' WIDTH='300'><tr><td ><table BORDER='0'  WIDTH='300'><tr>";
            for(var i=1;i<=100;i++){
                dynHtml+="<td colspan='1' id='"+progressId+i+"'><font size='2pt'>&nbsp;</font></td>";
            }
            dynHtml+="</tr></table></td></tr></table>";
            document.getElementById(progressId+"Bar").innerHTML=dynHtml;
        }  catch(e) {errHandler(e,'fnnConstProgbar()','TopAccessUtil.js?v=1511376672ta')}
    }
    /*****To show the progress in the progress bar.. *********/
    //param 1: if progress-bar id is "progressBar" then the parameter becomes "progress".
    //param 2: percentage (1,2,3..100)
    //param 3: recursively called function name given as string and followed by (). eg."fnRec()"
    //param 4: Time Interval for the recursive function to be called.(in milli seconds)
    function fnnShowProgress(progressId,percent,recurringFn,intervalMilli){
        try{
            percent=parseInt(percent,10);
            intervalMilli=parseInt(intervalMilli,10);
            document.getElementById("PercentBar").innerHTML=" "+percent+" %";
            for(var i=1;i<=percent;i++){
                document.getElementById(""+progressId+i+"").style.backgroundColor="blue";
            }
            setTimeout(recurringFn,intervalMilli);
        } catch(e) {errHandler(e,'fnnShowProgress()','TopAccessUtil.js?v=1511376672ta')}
    }
    function fnnDisableWidgets(fieldList,strFrmName){
        try{
            if(fieldList=="" || fieldList==null ){
                alert("Field List is empty in fnnDisableWidgets()");
                return;
            }
            fieldList=fieldList.split("~");
            for(var i=0;i<fieldList.length;i++){
                if (strFrmName != null && strFrmName != "")
                    fnnDisableWidget(fieldList[i],strFrmName);
                else
                    fnnDisableWidget(fieldList[i],null);
            }
        } catch(e) {errHandler(e,'fnnDisableWidgets()','TopAccessUtil.js?v=1511376672ta',fieldList)}
    }
    function fnnDisableWidget(field,strFrmName){
        try{
            if (strFrmName == null){
                fieldObj = eval('document.forms[0].'+field);
            }else
                fieldObj = eval('document.'+strFrmName+'.'+field);
			
			var strObjType = "";
            strObjType=fieldObj.type
                                //radio button/CheckBox would be of undefined type
            if (strObjType === undefined )
                strObjType=fieldObj[0].type;
            
			if(fieldObj == null) 
				fieldObj=eval("document.getElementById('"+field+"')");
	
			if (fieldObj != null && typeof fieldObj != 'nothing') {
				if ( strObjType == 'text' || strObjType == 'textarea' || strObjType == 'password'){
						fieldObj.style.backgroundColor = 'gray';
						fieldObj.disabled=true;
					}
					else if (strObjType == 'checkbox' && fieldObj.length !== undefined){
						for (var i=0;i<fieldObj.length;i++)
							fieldObj[i].disabled = true;
					}else
						fieldObj.disabled=true;					
			}
        } catch(e) {errHandler(e,'fnnDisableWidget()','TopAccessUtil.js?v=1511376672ta',field)}
    }
    function fnnEnableWidgets(fieldList,strFrmName){
        try{
            if(fieldList=="" || fieldList==null ){
                alert("Field List is empty in fnnEnableWidgets()");
                return;
            }
            fieldList=fieldList.split("~");
            for(var i=0;i<fieldList.length;i++){
                if (strFrmName != null && strFrmName != "")
                    fnnEnableWidget(fieldList[i],strFrmName);
                else
                    fnnEnableWidget(fieldList[i],null);
            }
        } catch(e) {errHandler(e,'fnnEnableWidgets()','TopAccessUtil.js?v=1511376672ta')}
    }
    function fnnEnableWidget(field,strFrmName){
        try{
            if (strFrmName == null){
                fieldObj = eval('document.forms[0].'+field);
            }else
                fieldObj = eval('document.'+strFrmName+'.'+field);
			
			var strObjType = "";
            strObjType=fieldObj.type
                                //radio button/CheckBox would be of undefined type
            if (strObjType === undefined )
                strObjType=fieldObj[0].type;

            if(fieldObj == null) 
				fieldObj=eval("document.getElementById('"+field+"')");
			
			if (fieldObj != null && typeof fieldObj != 'nothing') {
				if ( strObjType == 'text' || strObjType == 'textarea' || strObjType == 'password'){
						fieldObj.style.backgroundColor = '';
						fieldObj.disabled=false;
					}
					else if (strObjType == 'checkbox' && fieldObj.length !== undefined){
						for (var i=0;i<fieldObj.length;i++)
							fieldObj[i].disabled = false;
					}else
						fieldObj.disabled=false;					
			}
        } catch(e) {errHandler(e,'fnnEnableWidget()','TopAccessUtil.js?v=1511376672ta',field)}
    }

    /**
     *  sortTable() function uses bubble sorting technique to sort the rows of the table
     *  in both ascending and descending order.
     * @param tblID //table ID
     * @param piColIndex //Column to be sorted
     */
    var gblSort = "Ascending" // Global variable
    // piSortIndex is the index of the column to be sorted as per the table displayed
    // piSortIndex is the index of the row to be sorted as per the table displayed
    // tblID is the ID of the table to be sorted
    function sortTable(tblID,piColIndex,piRowIndex) {
        var tblObj = document.getElementById(tblID);
        var sortCondition = null;
        var firstElement;
        var secondElement;
        if (gblSort === undefined) {
            gblSort = "Ascending"
        }
        for (var i=piRowIndex;i<tblObj.rows.length;i++)
        {
            for (var j=i+1;j<tblObj.rows.length ;j++)
            {
                firstElement = tblObj.rows[i].cells[piColIndex].innerHTML.toLowerCase();
                secondElement = tblObj.rows[j].cells[piColIndex].innerHTML.toLowerCase();
                sortCondition = (gblSort == "Ascending")? firstElement > secondElement : firstElement < secondElement;
                if (sortCondition)
                {
                    for (var k=0;k<tblObj.rows[j].cells.length ;k++)
                    {
                        var tmpRowobj = tblObj.rows[i].cells[k].innerHTML;
                        tblObj.rows[i].cells[k].innerHTML = tblObj.rows[j].cells[k].innerHTML;
                        tblObj.rows[j].cells[k].innerHTML = tmpRowobj;
                    }
                }
            }
        }
        if (gblSort == "Ascending"){
            gblSort = "Descending"
        }else{
            gblSort = "Ascending"
        }
    }
    function constBackForthProgbar(widthOfPrgBar,progDivId){
		var dynHtml="<table border='1px' bordercolor=#C0C0C0 cellspacing='0' cellpadding='0'><tr><td style='BORDER-RIGHT: medium none; BORDER-TOP: medium none; FONT-WEIGHT: normal; FONT-SIZE: 9pt; BORDER-LEFT: medium none; COLOR: #000000; TEXT-INDENT: 3pt; LINE-HEIGHT: normal; BORDER-BOTTOM: medium none; FONT-STYLE: normal; FONT-FAMILY: Arial, sans-serif; BACKGROUND-COLOR: #ffffff; TEXT-ALIGN: left; TEXT-DECORATION: none'><table border='0' cellspacing='1' cellpadding='0'><tr>";
		for(var i=1;i<=widthOfPrgBar;i++){
		   dynHtml+="<td colspan='1' id='progressId"+i+"'><font size='1pt' height='1px'>&nbsp;&nbsp;&nbsp;</font></td>";
		}
		dynHtml+="</tr></table></td></tr></table>";
		if (document.getElementById(progDivId) != null && typeof document.getElementById(progDivId) != undefined){

			document.getElementById(progDivId).innerHTML=dynHtml;
		}else{
			alert("Error: Invalid Progress Bar Id")
		}
	}
    function showBackForthProgBar(forwardIndicator,index,noOfDottedCells,widthOfPrgBar,delayInMilliSec,progDivId){
		//@forwardIndicator = 0 ->initial / 1 ->Forward / -1 ->Backward
		//@index = 1 (Default)
		var redBlueColor = 0;
		if(forwardIndicator == 0){
			constBackForthProgbar(widthOfPrgBar,progDivId);
			for (var j=1;j<=noOfDottedCells;j++ ){
				redBlueColor = Math.floor(210-((210*(j-1))/noOfDottedCells));
				document.getElementById("progressId"+j).style.backgroundColor="rgb("+redBlueColor+",255,"+redBlueColor+")";
			}
			forwardIndicator = 1;
		}

		if(forwardIndicator == 1){
			if (index+noOfDottedCells <= widthOfPrgBar){
				document.getElementById("progressId"+parseInt(index,10)).style.backgroundColor="white";
				for (var j=index+1,k=0;j<=noOfDottedCells+index;j++,k++){
					redBlueColor = Math.floor(210-((210*k)/noOfDottedCells));
					document.getElementById("progressId"+j).style.backgroundColor="rgb("+redBlueColor+",255,"+redBlueColor+")";
				}
				forwardIndicator = 1;
				index++;
			}
			else
				forwardIndicator = -1;

			setTimeout("showBackForthProgBar("+forwardIndicator+","+index+","+noOfDottedCells+","+widthOfPrgBar+","+delayInMilliSec+")",delayInMilliSec);
		}
		else{

			if (index-1 >= 1){
				document.getElementById("progressId"+parseInt(index+noOfDottedCells-1,10)).style.backgroundColor="white";
				for (var j=index+noOfDottedCells-2,k=0;j>=index-1;j--,k++){
					redBlueColor = Math.floor(210-((210*k)/noOfDottedCells));
					document.getElementById("progressId"+j).style.backgroundColor="rgb("+redBlueColor+",255,"+redBlueColor+")";
				}
				forwardIndicator = -1;
				index--;
			}
			else
				forwardIndicator = 1;

            setTimeout("showBackForthProgBar("+forwardIndicator+","+index+","+noOfDottedCells+","+widthOfPrgBar+","+delayInMilliSec+")",delayInMilliSec);
        }
    }
    function fnConvertXMLEntities(fldVal){
        if(fldVal == "" ||fldVal == null || fldVal === undefined)
            return fldVal;
		//if(/&#(\d)+;/.test(fldVal) == false)
		fldVal = fldVal.replace(/&/g,"&amp;");
        fldVal = fldVal.replace(/</g,"&lt;");
        fldVal = fldVal.replace(/>/g,"&gt;");
		fldVal = fldVal.replace(/\"/g,"&quot;");
        //fldVal = fldVal.replace(/\`/g,"&apos;");
        return fldVal;
    }
    /**
    * DateFormat conversion. DateTime format should be YYYY-MM-DDTHH:MM:SS
    * @param dateFormat
    * @param dateTime
    */
    function dateFormatConversion(dateFormat, dateTime) {
        if(dateTime.indexOf('T') ==-1) {
            //alert(dateTime +" format should be YYYY-MM-DDTHH:MM:SS ");
            return dateTime;
        }
        var arrTime = dateTime.split('T');
        var strDate = arrTime[0];
        var arrDate = strDate.split('-');
        var dateTimeFormat = "";
        //2037-03-02T13:27:01  //YYMMDD
        arrDate[0] = ((temp=parseInt(arrDate[0],10)) < 10)? "0"+temp:temp;//YY
        arrDate[1] = ((temp=parseInt(arrDate[1],10)) < 10)? "0"+temp:temp;//MM
        arrDate[2] = ((temp=parseInt(arrDate[2],10)) < 10)? "0"+temp:temp;//DD
        switch (dateFormat) {
            case "MMDDYY"           : dateTimeFormat =arrDate[1]+"/"+arrDate[2]+"/"+arrDate[0]+" "+arrTime[1];
                break;
            case "DDMMYY"           : dateTimeFormat =arrDate[2]+"/"+arrDate[1]+"/"+arrDate[0]+" "+arrTime[1];
                break;
            case "YYMMDD"           : dateTimeFormat =arrDate[0]+"/"+arrDate[1]+"/"+arrDate[2]+" "+arrTime[1];
                break;
            default                 : dateTimeFormat =arrDate[0]+"/"+arrDate[1]+"/"+arrDate[2]+" "+arrTime[1];

        }
        return dateTimeFormat;
    }
    /**
    * DateFormat conversion. DateTime format should be YYYY-MM-DDTHH:MM:SS
    * @param dateFormat
    * @param dateTime
    */
    function delayFormatConversion(dateFormat, dateTime) {
        if(dateTime.indexOf('T') ==-1) {
            //alert(dateTime +" format should be YYYY-MM-DDTHH:MM:SS ");
            return dateTime;
        }
        var arrTime = dateTime.split('T');
        var strDate = arrTime[0];
		var strTime = arrTime[1];
        var arrDate = strDate.split('-');
		var timeFormat = strTime.split(':');
        var dateTimeFormat = "";
        //2037-03-02T13:27:01  //YYMMDD
        arrDate[0] = ((temp=parseInt(arrDate[0],10)) < 10)? "0"+temp:temp;
        arrDate[1] = ((temp=parseInt(arrDate[1],10)) < 10)? "0"+temp:temp;
        arrDate[2] = ((temp=parseInt(arrDate[2],10)) < 10)? "0"+temp:temp;

		timeFormat[0] = ((temp=parseInt(timeFormat[0],10)) < 10)? "0"+temp:temp;
        timeFormat[1] = ((temp=parseInt(timeFormat[1],10)) < 10)? "0"+temp:temp;
		dateTimeFormat = arrDate[2] +" "+timeFormat[0]+":"+timeFormat[1];
        return dateTimeFormat;
    }
    function fnEscapeSplChar(str)
    {
        if(str == null){
            alert("Input param is empty");
            return;
        }
        str = str.replace(/\\/g,"\\\\");
        str = str.replace(/\"/g,'\\"');
        str = str.replace(/\'/g,"\\'");

        return str;
    }


    function fnEncodeTextArea(textAreaVal,pwdIdenFlag) {
        if(textAreaVal == null || textAreaVal == "") {
            return textAreaVal;
        }
        var encodedTextAreaVal = "";
        if(document.all) { // IE
            //encodedTextAreaVal=textAreaVal.replace(/\r\n/g,"\\n");
            encodedTextAreaVal=textAreaVal.replace(/\r\n/g,"&#x0AF;&#x0BF;");
            //encodedTextAreaVal=textAreaVal.replace(/\r\n/g,"0xA0xD");
        }
        else { //Mozilla
            //encodedTextAreaVal=textAreaVal.replace(/\n/g,"\\n");
            encodedTextAreaVal=textAreaVal.replace(/\n/g,"&#x0AF;&#x0BF;");
            //encodedTextAreaVal=textAreaVal.replace(/\n/g,"0xA0xD");
        }
        return encodedTextAreaVal;
    }

    function fnEncodeTextDOM(textAreaVal) {
        if(textAreaVal == null || textAreaVal == "") {
            return textAreaVal;
        }
        var encodedTextAreaVal = "";
        //encodedTextAreaVal=textAreaVal.replace(/\r\n/g,"\\n");
            encodedTextAreaVal=textAreaVal.replace(/\n/g,"&#x0AF;&#x0BF;");
        return encodedTextAreaVal;
    }

    function fnDecodeTextArea(textAreaVal,pwdIdenFlag) {
        if(textAreaVal == null || textAreaVal == "") {
            return textAreaVal;
        }
        var decodedTextAreaVal = "";
        if(document.all) { // IE
            //decodedTextAreaVal=textAreaVal.replace(/\\n/g,"\r\n");
            decodedTextAreaVal=textAreaVal.replace(/&#x0AF;&#x0BF;|Â¯Â¿|¯¿/g,"\r\n");
        }
        else { //Mozilla
            //decodedTextAreaVal=textAreaVal.replace(/\\n/g,"\n");
            decodedTextAreaVal=textAreaVal.replace(/&#x0AF;&#x0BF;|Â¯Â¿|¯¿/g,"\n");
        }
        return decodedTextAreaVal;
    }
/**** Drawer MAP ***********/
var lcfMsg = fnGetLocaleString("101037","Large Capacity Feeder");
var paperFeederHashMap = {
        "Auto"		        : fnGetLocaleString("DUMMYRESID","&nbsp;"),
        "Drawer1"           :   fnGetLocaleString("100565","Drawer 1"),
        "Drawer2"			:   fnGetLocaleString("100566","Drawer 2"),
        "Drawer3"			:   fnGetLocaleString("100567","Drawer 3"),
        "Drawer4"			:   fnGetLocaleString("100568","Drawer 4"),
        "BypassFeeder"      :   fnGetLocaleString("100283","BypassFeeder"),
        "Inserter"          :   fnGetLocaleString("103985","Inserter"),
        "InternalLCF"       :   lcfMsg,
        "LCF"				:   lcfMsg,
        "LCFTray"			:   lcfMsg+"("+fnGetLocaleString("101589","Right")+")",
        "LeftTray"			:   lcfMsg+"("+fnGetLocaleString("101052","Left")+")",
        "ExternalLCF"		:   fnGetLocaleString("100698","External Large Capacity Feeder")
    };
/**
 * To map the xpath enums for 
 * @param Drawer
 */
function fnConvertDrawerEnums(drawerType) {
    if(drawerType =="" || drawerType == null || drawerType == undefined)
    return "";
    var temp;
    return (((temp=paperFeederHashMap[drawerType]) =="" ||temp == null ||temp == undefined)? drawerType : temp)
}
/************Media Type **************/
var mediaTypeHashMap = {
        "Auto"		        :   'fnGetLocaleString("DUMMYRESID","&nbsp;")',
        "Plain"             :   'fnGetLocaleString("101382","Plain")',
        "Plain1"		    :   'fnGetLocaleString("101383","Plain1")',
        "Plain2"			:   'fnGetLocaleString("101384","Plain2")',
        "Thick1"			:   'fnGetLocaleString("101869","Thick1")',
        "Thick2"			:   'fnGetLocaleString("101871","Thick2")',
        "Thick3"			:   'fnGetLocaleString("101873","Thick3")',
        "Thick4"			:   'fnGetLocaleString("101875","Thick4")',
        "Transparency"		:   'fnGetLocaleString("101930","Transparency")',
        "Envelope"		    :   'fnGetLocaleString("103986","Envelope")',
        "Thick1(Back)"		:   'fnGetLocaleString("101870","Thick1(Back)")',
        "Thick2(Back)"		:   'fnGetLocaleString("101872","Thick2(Back)")',
        "Thick3(Back)"		:   'fnGetLocaleString("101874","Thick3(Back)")',
        "Thick4(Back)"		:   'fnGetLocaleString("101876","Thick4(Back)")',
        "Recycled"			:   'fnGetLocaleString("101547","Recycled Paper")',
        "Cover"             :   'fnGetLocaleString("103882","Cover")',
        "Insert1"           :   'fnGetLocaleString("103881","Insert")',
        "Insert2"           :   'fnGetLocaleString("103881","Insert")',
        "Special"           :   'fnGetLocaleString("103883","Special")',
        "Special1"          :   'fnGetLocaleString("101758","Special1")',
        "Special2"          :   'fnGetLocaleString("101760","Special2")',
        "Special1(Back)"    :   'fnGetLocaleString("101759","Special1(Back)")',
        "Special2(Back)"    :   'fnGetLocaleString("101761","Special2(Back)")',
        "Fax"               :   'fnGetLocaleString("103884","Fax")',
        "Thin"              :   'fnGetLocaleString("103988","Thin")',
        "Thin1"             :   'fnGetLocaleString("DUMMYRESID","Thin1")',
        "Thin2"             :   'fnGetLocaleString("DUMMYRESID","Thin2")',
        "Tab"               :   'fnGetLocaleString("103880","Tab Paper")',
        "Normal"            :   'fnGetLocaleString("101247","None")',
        "1Side"             :   'fnGetLocaleString("103932","1Side")',
        "Black"             :   'fnGetLocaleString("100259","Black")',
        "1SideBlack"        :   'fnGetLocaleString("104258","1Side/Black")',
        "Recycled(Back)"    :   'fnGetLocaleString("104276","RecycledPaper(Back)")',
        "Plain(Back)"       :   'fnGetLocaleString("104275","Plain(Back)")',
        "Thin(Back)"        :   'fnGetLocaleString("104278","Thin(Back)")',
        "Special3"          :   'fnGetLocaleString("104118","Special3")',
        "Special3(Back)"    :   'fnGetLocaleString("104119","Special3(Back)")',
        "Envelope(Back)"    :   'fnGetLocaleString("104277","Envelope(Back)")',

        "Thick5"            :   'fnGetLocaleString("104302","Thick5")',
        "Special1_Label1"   :   'fnGetLocaleString("101758","Special1")',
        "Special2_Label2"   :   'fnGetLocaleString("101760","Special2")',
        "Special3_Transparency"            :   'fnGetLocaleString("104118","Special3")',
        "Special4_Glossy1"  :   'fnGetLocaleString("104305","Special4")',
        "Special5_Glossy2"  :   'fnGetLocaleString("104306","Special5")',
        "Special6_Glossy3"  :   'fnGetLocaleString("104307","Special6")',
        "Envelope2"         :   'fnGetLocaleString("104309","Envelope2")',
        "Envelope3"         :   'fnGetLocaleString("104310","Envelope3")',
        "Envelope4"         :   'fnGetLocaleString("104311","Envelope4")',
        "UserType1"         :   'fnGetLocaleString("104312","UserType1")',
        "UserType2"         :   'fnGetLocaleString("104313","UserType2")',
        "UserType3"         :   'fnGetLocaleString("104314","UserType3")',
        "UserType4"         :   'fnGetLocaleString("104315","UserType4")',
        "UserType5"         :   'fnGetLocaleString("104316","UserType5")'
       
    };
/**
 * To map the Paper type for Localization
 * @param mediaType
 */
function fnConvertMediaTypeEnums(mediaType) {
    if(mediaType =="" || mediaType == null || mediaType == undefined)
        return "";
    var temp;
    return (((temp = eval(mediaTypeHashMap[mediaType])) =="" ||temp == null ||temp == undefined)? mediaType : temp);
}
/*************    Paper Size ************/
var paperSizeMapUS = {
    "Undefined"		: 'fnGetLocaleString("DUMMYRESID","&nbsp;")',
    "Auto"		    : 'fnGetLocaleString("DUMMYRESID","&nbsp;")',
    "Mixed"			: 'fnGetLocaleString("101193","Mixed Original Sizes")',
    "Custom"		: 'fnGetLocaleString("103879","Custom")',
    "A3"			: 'fnGetLocaleString("100093","A3")',
    "A3-R"			: 'fnGetLocaleString("100093","A3")',
    "A4"            : 'fnGetLocaleString("100094","A4");',
    "A4-R"          : 'fnGetLocaleString("100095","A4R");',
    "A5"			: 'fnGetLocaleString("100096","A5")',
    "A5-R"			: 'fnGetLocaleString("100097","A5R")',
    "A6"			: 'fnGetLocaleString("100098","A6")',
    "A6-R"			: 'fnGetLocaleString("100099","A6R")',
    "B4"			: 'fnGetLocaleString("100243","B4")',
    "B4-R"			: 'fnGetLocaleString("100243","B4")',
    "B5"			: 'fnGetLocaleString("100244","B5")',
    "B5-R"			: 'fnGetLocaleString("100245","B5R")',  
    "COMPUTER"		: 'fnGetLocaleString("100355","COMP")',
    "COMPUTER-R"	: 'fnGetLocaleString("100355","COMP")',
    "FOLIO"			: 'fnGetLocaleString("100760","Folio")',
    "FOLIO-R"		: 'fnGetLocaleString("100760","Folio")',
    "LEDGER"		: 'fnGetLocaleString("101043","LD")',
    "LEDGER-R"		: 'fnGetLocaleString("101043","LD")',
    "LEGAL"			: 'fnGetLocaleString("101060","LG")',
    "LEGAL-R"		: 'fnGetLocaleString("101060","LG")',
    "13inchLEGAL"	: 'fnGetLocaleString("101055","Legal-13 inch")',
    "13inchLEGAL-R"	: 'fnGetLocaleString("101055","Legal-13 inch")',
    "STATEMENT"		: 'fnGetLocaleString("101778","STR")',
    "STATEMENT-R"	: 'fnGetLocaleString("101788","STR")',
    "LETTER"		: 'fnGetLocaleString("101102","LT")',
    "LETTER-R"		: 'fnGetLocaleString("101104","LTR")',
    "8K-R"			: 'fnGetLocaleString("100085","8K")',
    "8K"			: 'fnGetLocaleString("100085","8K")',
    "8.5SQ"			: 'fnGetLocaleString("100084","8.5SQ")',
    "16K"			: 'fnGetLocaleString("100026","16K")',
    "16K-R"			: 'fnGetLocaleString("100027","16KR")',
    "Postcard"		: 'fnGetLocaleString("100098","A6")',
    "Postcard-R"	: 'fnGetLocaleString("100099","A6R")',
    "SRA3"			: 'fnGetLocaleString("103296","320x450")',
    "SRA3-R"		: 'fnGetLocaleString("103296","320x450")',
    "A3Wide"		: 'fnGetLocaleString("103303","12x18")',
    "A3Wide-R"		: 'fnGetLocaleString("103303","12x18")',
    "LEDGERWide"	: 'fnGetLocaleString("103303","12x18")',
    "LEDGERWide-R"	: 'fnGetLocaleString("103303","12x18")',
    "320x460mm"		: 'fnGetLocaleString("103301","320x460")',
    "320x460mm-R"	: 'fnGetLocaleString("103301","320x460")',
    "13x19inch"		: 'fnGetLocaleString("103877","13x19")',
    "13x19inch-R"	: 'fnGetLocaleString("103877","13x19")',
    "CustomLongA"	: 'fnGetLocaleString("103879","Custom")',
    "CustomLongB"	: 'fnGetLocaleString("103879","Custom")',
    // Below paper enums are only for Loire
    "CHOU3_R"	    : 'fnGetLocaleString("104000","CHO-3")',
    "YOU4_R"	    : 'fnGetLocaleString("104001","YOU-4")',
    "SH10_R"	    : 'fnGetLocaleString("104002","COM10")',
    "MONARCH_R"	    : 'fnGetLocaleString("104003","MONARCH")',
    "DL_R"	        : 'fnGetLocaleString("104004","DL")',

    "CHOU3-R"	    : 'fnGetLocaleString("104000","CHO-3")',
    "YOU4-R"	    : 'fnGetLocaleString("104001","YOU-4")',
    "SH10-R"	    : 'fnGetLocaleString("104002","COM10")',
    "MONARCH-R"	    : 'fnGetLocaleString("104003","MONARCH")',
    "DL-R"	        : 'fnGetLocaleString("104004","DL")',

    "13.5inchLEGAL" : 'fnGetLocaleString("104297","Legal-13.5&quot;")',
    "13.5inchLEGAL-R" : 'fnGetLocaleString("104297","Legal-13.5&quot;")',
    "Executive"     : 'fnGetLocaleString("104298","Exec")',
    "Executive-R"   : 'fnGetLocaleString("104298","Exec")',
    "COM9"          : 'fnGetLocaleString("104299","COM9")',
    "COM9-R"        : 'fnGetLocaleString("104299","COM9")',
    "C5"            : 'fnGetLocaleString("104300","C5")',
    "C5-R"          : 'fnGetLocaleString("104300","C5")',
    "IndexCard"     : 'fnGetLocaleString("104301","IndexCard")',
    "IndexCard-R"   : 'fnGetLocaleString("104301","IndexCard")'
}
var paperSizeMaEUJP = {
    "Undefined"		: 'fnGetLocaleString("DUMMYRESID","&nbsp;")',
    "Auto"	    	: 'fnGetLocaleString("DUMMYRESID","&nbsp;")',
    "Mixed"			: 'fnGetLocaleString("101193","Mixed Original Sizes")',
    "Custom"		: 'fnGetLocaleString("103879","Custom")',
    "A3"			: 'fnGetLocaleString("100093","A3")',
    "A3-R"			: 'fnGetLocaleString("100093","A3")',
    "A4"            : 'fnGetLocaleString("100094","A4");',
    "A4-R"          : 'fnGetLocaleString("100095","A4R");',
    "A5"			: 'fnGetLocaleString("100096","A5")',
    "A5-R"			: 'fnGetLocaleString("100097","A5R")',
    "LETTER"		: 'fnGetLocaleString("101102","LT")',
    "LETTER-R"		: 'fnGetLocaleString("101104","LTR")',
    "A6"			: 'fnGetLocaleString("100098","A6")',
    "A6-R"			: 'fnGetLocaleString("100099","A6R")',
    "B4"			: 'fnGetLocaleString("100243","B4")',
    "B4-R"			: 'fnGetLocaleString("100243","B4")',
    "B5"			: 'fnGetLocaleString("100244","B5")',
    "B5-R"			: 'fnGetLocaleString("100245","B5R")',
    "COMPUTER"		: 'fnGetLocaleString("100355","COMP")',
    "COMPUTER-R"	: 'fnGetLocaleString("100355","COMP")',
    "FOLIO"			: 'fnGetLocaleString("100760","Folio")',
    "FOLIO-R"		: 'fnGetLocaleString("100760","Folio")',
    "LEDGER"		: 'fnGetLocaleString("101043","LD")',
    "LEDGER-R"		: 'fnGetLocaleString("101043","LD")',
    "LEGAL"			: 'fnGetLocaleString("101060","LG")',
    "LEGAL-R"		: 'fnGetLocaleString("101060","LG")',
    "13inchLEGAL"	: 'fnGetLocaleString("101055","Legal-13 inch")',
    "13inchLEGAL-R"	: 'fnGetLocaleString("101055","Legal-13 inch")',   
    "STATEMENT"		: 'fnGetLocaleString("101778","STR")',
    "STATEMENT-R"	: 'fnGetLocaleString("101788","STR")',
    "8K-R"			: 'fnGetLocaleString("100085","8K")',
    "8K"			: 'fnGetLocaleString("100085","8K")',
    "8.5SQ"			: 'fnGetLocaleString("100084","8.5SQ")',
    "16K"			: 'fnGetLocaleString("100026","16K")',
    "16K-R"			: 'fnGetLocaleString("100027","16KR")',
    "Postcard"		: 'fnGetLocaleString("100098","A6")',
    "Postcard-R"	: 'fnGetLocaleString("100099","A6R")',
    "SRA3"			: 'fnGetLocaleString("103296","320x450")',
    "SRA3-R"		: 'fnGetLocaleString("103296","320x450")',
    "A3Wide"		: 'fnGetLocaleString("103874","12x18")',
    "A3Wide-R"		: 'fnGetLocaleString("103874","12x18")',
    "LEDGERWide"	: 'fnGetLocaleString("103874","12x18")',
    "LEDGERWide-R"	: 'fnGetLocaleString("103874","12x18")',
    "320x460mm"		: 'fnGetLocaleString("103301","320x460")',
    "320x460mm-R"	: 'fnGetLocaleString("103301","320x460")',
    "13x19inch"		: 'fnGetLocaleString("103876","13x19")',
    "13x19inch-R"	: 'fnGetLocaleString("103876","13x19")',
    "CustomLongA"	: 'fnGetLocaleString("103879","Custom")',
    "CustomLongB"	: 'fnGetLocaleString("103879","Custom")',
    // Below paper enums are only for Loire
    "CHOU3_R"	    : 'fnGetLocaleString("104000","CHO-3")',
    "YOU4_R"	    : 'fnGetLocaleString("104001","YOU-4")',
    "SH10_R"	    : 'fnGetLocaleString("104002","COM10")',
    "MONARCH_R"	    : 'fnGetLocaleString("104003","MONARCH")',
    "DL_R"	        : 'fnGetLocaleString("104004","DL")',

    "CHOU3-R"	    : 'fnGetLocaleString("104000","CHO-3")',
    "YOU4-R"	    : 'fnGetLocaleString("104001","YOU-4")',
    "SH10-R"	    : 'fnGetLocaleString("104002","COM10")',
    "MONARCH-R"	    : 'fnGetLocaleString("104003","MONARCH")',
    "DL-R"	        : 'fnGetLocaleString("104004","DL")',

    "13.5inchLEGAL" : 'fnGetLocaleString("104297","Legal-13.5&quot;")',
    "13.5inchLEGAL-R" : 'fnGetLocaleString("104297","Legal-13.5&quot;")',
    "Executive"     : 'fnGetLocaleString("104298","Exec")',
    "Executive-R"   : 'fnGetLocaleString("104298","Exec")',
    "COM9"          : 'fnGetLocaleString("104299","COM9")',
    "COM9-R"        : 'fnGetLocaleString("104299","COM9")',
    "C5"            : 'fnGetLocaleString("104300","C5")',
    "C5-R"          : 'fnGetLocaleString("104300","C5")',
    "IndexCard"     : 'fnGetLocaleString("104301","IndexCard")',
    "IndexCard-R"   : 'fnGetLocaleString("104301","IndexCard")'
}
/**
 * To map the Xpath enums and display PaperSize
 * @param getNodeValue
 */
function fnConvertPaperSizeEnums(paperSizeVal, identifier) {
    if(paperSizeVal == "" || paperSizeVal == null)
        return "";
    var temp;
    var localeLang;
    var shipping9000;
    if (identifier == "UseOpener")  {
        localeLang = opener.top.gblTALocaleDirectory;
        shipping9000 = opener.top.fnTrackCookie("DiagnosticMode","GET","9000");
    }
    else {
        localeLang = top.gblTALocaleDirectory;
        shipping9000 = top.fnTrackCookie("DiagnosticMode","GET","9000");
    }
   if (identifier == "UseOpener" && (opener.top.gblDeviceModelId=="STHELENS" || opener.top.gblDeviceModelId=="MOSEL")){
        temp=newPaperSize(paperSizeVal);
    }
    else if(top.gblDeviceModelId=="STHELENS" || top.gblDeviceModelId=="MOSEL"){
          temp=newPaperSize(paperSizeVal);
        }
    else{
    if(shipping9000 =="1") {
        temp = eval(paperSizeMapUS[paperSizeVal]);
    }
     else{
        if(localeLang =="ja_JP" &&  shipping9000 == "2" && (paperSizeVal =="A6-R" ||paperSizeVal =="Postcard-R"))   {
            return fnGetLocaleString("100098","A6");
        }
        temp = eval(paperSizeMaEUJP[paperSizeVal]);
    }
  }
    return ((temp=="" ||temp == null ||temp == undefined)? paperSizeVal : temp);
}
function newPaperSize(paperSizeVal) // these papersize are available only for Sthelens/Mosel
{
     if(paperSizeVal == "A6-R" ||paperSizeVal == "A6"){
                 return fnGetLocaleString("100098","A6");
            } else if(paperSizeVal == "Postcard-R" ||paperSizeVal == "Postcard"){
                 return fnGetLocaleString("104414","Postcard");
            } else if(paperSizeVal == "DoublePostcard-R" ||paperSizeVal == "DoublePostcard"){
                 return fnGetLocaleString("104415","DoublePostcard");
            }  else if(paperSizeVal == "CHOU4-R" ||paperSizeVal == "CHOU4"){
                 return fnGetLocaleString("104416","CHOU4");
            }
             temp = eval(paperSizeMapUS[paperSizeVal]);
   return temp;
}

// datasize has to be in Bytes.
function fnConvertSize(dataSize,returnUnit){
    try {
        var updatedataSize=0;
        if(returnUnit==null || returnUnit===undefined){
            updatedataSize = Math.round(dataSize);
            if (updatedataSize < (10 * 1048576))
                updatedataSize = Math.floor(updatedataSize/1024) + " "+fnGetLocaleString("DUMMYRESID","KB");
            else
                updatedataSize =  Math.floor(updatedataSize/[Math.pow(1024,2)]) +" "+fnGetLocaleString("101157","MB");
        }else if(returnUnit == "KB"){
            updatedataSize = Math.round(dataSize);
            updatedataSize = Math.floor(updatedataSize/1024);

        }else if(returnUnit == "ceilKB"){
            updatedataSize = Math.round(dataSize);
            updatedataSize = Math.ceil(updatedataSize/1024);

        }
        return updatedataSize;
    }catch(e){ errHandler(e,'fnConvertSize()','TopAccessUtil.js?v=1511376672ta',"");}

}
//@filePath : Complete url of the File
function fnExtractFileName(filePath){
    if(filePath.lastIndexOf('/')!=-1){
        return filePath.substr(filePath.lastIndexOf('/')+1);
    }else if(filePath.lastIndexOf("\\")!=-1){
        return filePath.substr(filePath.lastIndexOf("\\")+1);
    }else{
        return filePath;
    }
}

function fnReturnTimeStamp(millisec){
    try{
        if(millisec == null){
            alert("Input param for fnReturnTimeStamp() is empty");
            return "";
        }
        //eg: TUE DEC 22 23:38:43 2009
        var dt = new Date(parseInt(millisec,10));
        var day = fnRetDayString(dt.getDay());
        var mon = fnRetMonthString(dt.getMonth()+1);
        var date = dt.getDate();
        var year = dt.getFullYear();
        var hour = dt.getHours();
        var min = dt.getMinutes();
        var sec = dt.getSeconds();
        if(date <= 9){
           date = "0"+date;
        }
        if(hour <= 9){
           hour = "0"+hour;
        }
        if(min <= 9){
           min = "0"+min;
        }
        if(sec <= 9){
           sec = "0"+sec; 
        }
        return day+" "+mon+" "+date+" "+hour+":"+min+":"+sec+" "+year;
    }catch(e) {errHandler(e,'fnReturnTimeStamp()','TopAccessUtil.js?v=1511376672ta',millisec);}
}
function fnRetDayString(day){
    try{
        if(day == null){
            alert("Input param for fnRetDayString() is empty");
            return "";
        }
        switch(day){
            case 0 : return fnGetLocaleString("101797","Sun");//"SUN";
            case 1 : return fnGetLocaleString("101206","Mon");//"MON";
            case 2 : return fnGetLocaleString("101941","Tue");//"TUE";
            case 3 : return fnGetLocaleString("102013","Wed");//"WED";
            case 4 : return fnGetLocaleString("101893","Thu");//"THU";
            case 5 : return fnGetLocaleString("100768","Fri");//"FRI";
            case 6 : return fnGetLocaleString("101608","Sat");//"SAT";
        }
        return "";
    }catch(e) {errHandler(e,'fnReturnDay()','TopAccessUtil.js?v=1511376672ta',day);}
}
function fnRetMonthString(mon){
    try{
        if(mon == null){
            alert("Imput param for fnRetMonthString() is empty");
            return "";
        }
        switch(mon){
            case 1 : return fnGetLocaleString("101005","Jan");//"JAN";
            case 2 : return fnGetLocaleString("100723","Feb");//"FEB";
            case 3 : return fnGetLocaleString("101138","Mar");//"MAR";
            case 4 : return fnGetLocaleString("100194","Apr");//"APR";
            case 5 : return fnGetLocaleString("101156","May");//"MAY";
            case 6 : return fnGetLocaleString("101021","Jun");//"JUN";
            case 7 : return fnGetLocaleString("101018","Jul");//"JUL";
            case 8 : return fnGetLocaleString("100221","Aug");//"AUG";
            case 9 : return fnGetLocaleString("101684","Sep");//"SEP";
            case 10 : return fnGetLocaleString("101284","Oct");//"OCT";
            case 11 : return fnGetLocaleString("101262","Nov");//"NOV";
            case 12 : return fnGetLocaleString("100448","Dec");//"DEC";
        }
        return "";
    }catch(e) {errHandler(e,'fnRetMonthString()','TopAccessUtil.js?v=1511376672ta',mon);}
}
var gblParentMostObj = null;
function fnGetLocaleString(resId,defStr){
    var localizedMsg = "";
    try{
       if(resId == "" || resId == null){
          //alert("Error!! Input parameter is empty for fnGetLocaleString()");
          return "";
       }
       if(resId == "DUMMYRESID"){
           return defStr;
       }
       if(gblParentMostObj == null){
           gblParentMostObj = window.top;
           try{
               while(gblParentMostObj.opener != null && gblParentMostObj.gblMessages == null){
                    if(gblParentMostObj.location.href.indexOf("?MAIN=EFILING") != -1){
                        //isEfiling = true;
                        break;
                    }
                    gblParentMostObj = gblParentMostObj.opener.top;
               }
           }catch(e){}
       }
       if(gblParentMostObj.gblMessages == null || gblParentMostObj.gblMessages === undefined){
          //alert("Error!! Could not find the locale hashmap.Please contact administrator.Reource id="+resId);
          return "";
       }
       localizedMsg = gblParentMostObj.gblMessages[resId];
       if(localizedMsg == null || typeof localizedMsg == "undefined"){
           if(defStr != null && defStr != ""){
               localizedMsg = defStr;
           }
       }
       return localizedMsg;
    }catch(s) {errHandler(s,'fnGetLocaleString()','TopAccessUtil.js?v=1511376672ta',resId);return localizedMsg;}
}


function fnTAPermissions(){
    return  top.fnGetCookie("TAPERMISSIONS");
}
/*
	@condition : enums are AND/OR/IGNORE_LOGINMODE_AND/IGNORE_LOGINMODE_OR . If @condition is not mentioned while calling, then by default it is "AND".
	@permList  : List of permissions seperated by variable gblPermListSep
*/
function fnChkPermission(permList,condition){

    var boolVal = false;
    /*If User Authentication is disabled, then the behaviour should be like eB3. No permission check
     for users other than Admin*/
    if(condition != "IGNORE_LOGINMODE_AND" && condition != "IGNORE_LOGINMODE_OR" && top.fnGetCookie("LOGINMODE") == "NORMAL"){
        boolVal = true;
        return boolVal;
    }
	if(permList == ""){
		alert("permission list is empty");
		return boolVal;
	}
	var permArray = new Array();
	var userPermissions = gblPermSepStr+fnTAPermissions()+gblPermSepStr;
	if(permList.indexOf(gblPermListSep) != -1){
		permArray = permList.split(gblPermListSep);
	}else{
		permArray[0] = permList;
	}

	for(var i=0 ;i < permArray.length; i++){
		if(condition == null || condition == "AND" || condition == "IGNORE_LOGINMODE_AND"){
			if(userPermissions.indexOf(gblPermSepStr+permArray[i]+gblPermSepStr) != -1){
				boolVal = true;
			}else{
				boolVal = false;
				break;
			}
		}else if(condition == "OR" || condition == "IGNORE_LOGINMODE_OR"){
			if(userPermissions.indexOf(gblPermSepStr+permArray[i]+gblPermSepStr) != -1){
				boolVal = true;
			}
		}
	}
    return boolVal;
}
/* fnHandleErrorMsg()
    @ mapObj        : HashMap obj
    @ sopValue      : Status Of operation value
    @ defaultErrorMsgStrOrId : If Status of Operation is not found in the HashMap, then defaultErrorMsgStrOrId will be executed
    @ boolAlertRequired : true( if you need alert message) / false(if you need message to be displayed in the span or div or <TR> id)
    @ errorHtmlId   : span or div or <TR> id
*/

function fnHandleErrorMsg(mapObj,sopValue,defaultErrorMsgStrOrId,boolAlertRequired,errorHtmlId){
    try{
		var errorMsg = "";
        if(mapObj != null){
            errorMsg = mapObj[sopValue];
			if(errorMsg == null || errorMsg === undefined){
				//When sopValue not found in HashMap
                if(isNaN(defaultErrorMsgStrOrId) == true){
					//String
                    if(defaultErrorMsgStrOrId.indexOf("fnGetLocaleString") != -1) {
                        errorMsg = eval(defaultErrorMsgStrOrId);
                    } else {
                        errorMsg = defaultErrorMsgStrOrId;
                    }
                }else{
                    //number
                    errorMsg = fnGetLocaleString(defaultErrorMsgStrOrId);
                }
            }else {
				//When sopValue found in HashMap
				if(errorMsg.indexOf("fnGetLocaleString") != -1) {
					//If string has to be localized.
					errorMsg = eval(errorMsg);
				}
			}
            if(boolAlertRequired == true || boolAlertRequired == "true"){
                alert(errorMsg);
                return "";
            }
            else if(boolAlertRequired == false || boolAlertRequired == "false"){
                var htmlObj=document.getElementById(errorHtmlId);
                htmlObj.innerHTML = errorMsg;
                if(htmlObj.style.display == "none") {
                    htmlObj.style.display="";
                }
                return "";
            }else{
                return errorMsg;
            }
        }else{
            //TBD
        }
    }catch(s) {errHandler(s,'fnHandleErrorMsg()','TopAccessUtil.js?v=1511376672ta','');return '';}
}

//Input is in seconds
//return format eg: 2010/10/02 10:44:56
function fnEpochConverter(seconds,dateFormat) {
    try{
        if(seconds == null){
            alert("Input param for fnReturnTimeStamp() is empty");
            return "";
        }
        var millisec = parseInt(seconds,10)*1000;
        var dateTimeStr;
        var dt = new Date(millisec);
        var date = dt.getDate();
        var month = dt.getMonth()+1;
        var year = dt.getFullYear();
        var hour = dt.getHours();
        var min = dt.getMinutes();
        var sec = dt.getSeconds();
        if(date <= 9){
            date = "0"+date;
        }
        if(month <= 9){
            month = "0"+month;
        }
        if(hour <= 9){
            hour = "0"+hour;
        }
        if(min <= 9){
            min = "0"+min;
        }
        if(sec <= 9){
            sec = "0"+sec;
        }
        var timeStr = hour+":"+ min+":"+sec;
            switch (dateFormat) {
                case "MMDDYY"           : dateTimeStr =month+"/"+date+"/"+year+" "+timeStr;
                    break;
                case "DDMMYY"           : dateTimeStr =date+"/"+month+"/"+year+" "+timeStr;
                    break;
                case "YYMMDD"           : dateTimeStr =year+"/"+month+"/"+date+" "+timeStr;
                    break;
                default                 : dateTimeStr =year+"/"+month+"/"+date+" "+timeStr;

            }
        return dateTimeStr;
    }catch(e) {errHandler(e,'fnEpochConverter()','TopAccessUtil.js?v=1511376672ta',millisec);}
}
function fnDispOperationLogError(status){
	//As of now status param is not used.
	alert(fnGetLocaleString("103472","Internal Error has occurred. Please try again."));
}
function fnRipTxtAsciiValidate(Identifier,FldExceptionLst){
    var gblWinopenerObj=null;
    try{
    gblWinopenerObj = fnReturnApplnTopObject();
    var BrowserLang = gblWinopenerObj.gblTALocaleDirectory;
    if(BrowserLang == "ru_RU"/* || BrowserLang == "zh_CN" || BrowserLang == "zh_TW"*/) {
        var frmsLen = document.forms.length;
        var frmObj;
        var frmElementsLength;
        var frmEleType;
        var ParentNode=null;
        var VisibilityBrkFlag=false;
        for(var j=0;j<frmsLen;j++){
            frmObj=document.forms[j];
            frmElementsLength = frmObj.elements.length;
            for(var i=0;i<frmElementsLength;i++) {
                frmEleType = frmObj.elements[i].type;
                if((frmEleType == "text" || frmEleType == "textarea") && !frmObj.elements[i].disabled) {
                    ParentNode=frmObj.elements[i].parentNode;
                    VisibilityBrkFlag=false;
                    while(ParentNode != null && ParentNode.nodeName.toLowerCase() != "body") {
                        if(ParentNode.style.display == "none") {
                            VisibilityBrkFlag=true;
                            break;
                        }
                        ParentNode= ParentNode.parentNode;
                    }
                    if(VisibilityBrkFlag){
                        //alert("dont valid     "+frmObj.elements[i].name)
                        continue;
                    }

                    if(!fnRipAcceptedAscii(frmObj.elements[i].value)) {
                        frmObj.elements[i].select();
                        alert(fnGetLocaleString("101392","Please enter a valid value."));
                        return false;
                    }
                }
            }
        }
    }
    return true;
    }catch(e){
       alert("exception in fnRipTxtAsciiValidate");
       return true;
    }
}
function fnRipAcceptedAscii(pVal){
    try{
        for (var i=0; i < pVal.length; i++)
        {
            if ((pVal.charCodeAt(i) < 0x20 ) || (pVal.charCodeAt(i) >0x7E) )
            {
                return false;
            }
        }
        return true;
    }catch(e){
        alert("exception in fnRipAcceptedAscii");
        return false;
    }
}
function fnReturnApplnTopObject(){
    var gblWinopenerObj = window.top;
    try{
	        while(gblWinopenerObj.opener != null  && typeof gblWinopenerObj.top.gblTopWindow == 'undefined'){
	            if(gblWinopenerObj.location.href.indexOf("?MAIN=EFILING") != -1){
	                break;
	            }
	            gblWinopenerObj = gblWinopenerObj.opener.top;
	        }
		}catch(e){}
    return gblWinopenerObj;
}

function fnReturnApplnTopForSecAccess(){
    var gblWinopenerObj = window.top;
    try{
	        while(gblWinopenerObj.opener != null  && typeof gblWinopenerObj.top.gblTopWindow == 'undefined'){
	            if(gblWinopenerObj.opener.location.href.indexOf("/TopMenu.ht") != -1){
	                break;
	            }
	            gblWinopenerObj = gblWinopenerObj.opener.top;
	        }
		}catch(e){}
    return gblWinopenerObj;
}
var gblTopWndwObj= fnReturnApplnTopForSecAccess();
var gblUrlPattern = /^(http|https):\/\/[A-Za-z\[\]0-9-_\.:]+\/(\?MAIN=[A-Z]+)*(&SUB=[A-Z]+)*(&CAT=[A-Z]+)*$/;
var gblCurLocFilePath = fnExtractFileName(window.location.href);
if(!(/^S[a-zA-Z]{1}F[a-zA-Z]{1}\.[a-z0-9]{4}$/.test(gblCurLocFilePath)) && gblCurLocFilePath.indexOf("frameIndex.ht") == -1) {
    try{
        if(!gblUrlPattern.test(gblTopWndwObj.location.href)) {
            top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=DEVICE");
        }
    }catch(e){
        top.location.replace(window.location.protocol+"//"+((window.location.hostname.indexOf(":") != -1 && window.location.hostname.indexOf("]") == -1)?(("["+window.location.hostname+"]")+((window.location.port != "")? ":"+window.location.port : "" )) : window.location.host)+"/?MAIN=DEVICE");
    }
}

function fnXMLEntities2String(fldVal){
        if(fldVal == "" ||fldVal == null || fldVal === undefined)
            return fldVal;
		//if(/&#(\d)+;/.test(fldVal) == false)
		//fldVal = fldVal.replace(/&/g,"&amp;");
		fldVal = fldVal.replace(/&amp;/g,"&");
        //fldVal = fldVal.replace(/</g,"&lt;");
		fldVal = fldVal.replace(/&lt;/g,"<");
        //fldVal = fldVal.replace(/&gt;/g,">");
		//fldVal = fldVal.replace(/\"/g,"&quot;");
        //fldVal = fldVal.replace(/\`/g,"&apos;");
        return fldVal;
    }

function mfpModelTypeName(deciveModelType) {
    if(deciveModelType=="H160" ||deciveModelType=="H161"||deciveModelType=="H162" || deciveModelType=="H163" || deciveModelType=="H164" || deciveModelType=="H165" || deciveModelType ==  "H201" || deciveModelType ==  "H330" || deciveModelType ==  "H331" || deciveModelType ==  "H332" || deciveModelType ==  "H333" || deciveModelType ==  "H334" || deciveModelType ==  "H335")    // For EX-Loire Machine //H330,H331,H332,H333,H334 & H335 are for LOIRE2
        deciveModelType="LOIRE";
    else if(deciveModelType=="H190" ||deciveModelType=="H191"||deciveModelType=="H192" || deciveModelType=="H193" || deciveModelType=="H320" || deciveModelType=="H321" || deciveModelType=="H322" || deciveModelType=="H323")    // For EX-ALABAMA Machine   //H320,H321,H322,H323 are for Alabama2
        deciveModelType="ALABAMA";
    else if(deciveModelType=="H130" ||deciveModelType=="H131"||deciveModelType=="H132" || deciveModelType=="H340" || deciveModelType=="H341" || deciveModelType=="H342"){    // For Bp Machine   //H340,H341,H342 are for BP2
        deciveModelType="BP";
    }
    else if(deciveModelType=="H140" ||deciveModelType=="H141"||deciveModelType=="H142"||deciveModelType=="H143"||deciveModelType=="H144"){    // For Mash Machine
        deciveModelType="MASH";
    }
    else if(deciveModelType=="H210" ||deciveModelType=="H211"){    // For Weiss L Machine
        deciveModelType="WEISS-L";
    }
    else if(deciveModelType=="H230" ||deciveModelType=="H231"){    // For Weiss LL Machine
        deciveModelType="WEISS-LL";
    }
    else if(deciveModelType=="H212" ||deciveModelType=="H213"||deciveModelType=="H214"||deciveModelType=="H215"||deciveModelType=="H216" || deciveModelType=="H217"){    // For Weiss H Machine
        deciveModelType="WEISS-H";
    }
    else if(deciveModelType=="H280" ||deciveModelType=="H281"||deciveModelType=="H282" ){    // For St.Helen
      deciveModelType="STHELENS";
    }
    else if(deciveModelType=="H290" ||deciveModelType=="H291" ){    // For Mosel
      deciveModelType="MOSEL";
    }
    return deciveModelType;
}
function fnSwitchStyle(css_title, link_tag)
{
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i;
  for (i = 0; i < link_tag.length ; i++){
    if ((link_tag[i].rel.indexOf( "stylesheet" ) != -1) &&
      link_tag[i].title) {
      link_tag[i].disabled = true ;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false ;
      }
    }

  }
}

// 25-10-2016 Updated for feedback of DTFR :- EBX_DTFR_16474
function isMACSafari(){
    var uAgent = navigator.userAgent.toLowerCase();
    if(uAgent.indexOf("macintosh")!= -1 && uAgent.indexOf("safari")!= -1 && uAgent.indexOf("chrome")==-1){
        // MAC Safari 
        return true;
    }
    return false;
}
