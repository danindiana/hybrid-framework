
function fnGetResolveLocaleForDisplay(){
    var resolvedLocaleVal = "en_US";  //Default;
    gblLocaleOrder = "WesternOrder";  //Default;
    var LanguageOrderHashMap = {
        "WesternOrder" : "WesternOrder",  //Default;
        "EasternOrder" : "EasternOrder"
    };
    try{
        var isEfiling =false;

        var gblWinopenerObj = window.top;
		try{
	        while(gblWinopenerObj.opener != null && typeof gblWinopenerObj.top.gblTopWindow == 'undefined'){
	            //if(gblWinopenerObj.location.href.indexOf("/efiling/Efb.html?v=1511376672ta") != -1){
	            if(gblWinopenerObj.location.href.indexOf("?MAIN=EFILING") != -1){
	                isEfiling = true;
	                break;
	            }
	            gblWinopenerObj = gblWinopenerObj.opener.top;
	        }
		}catch(e){}
        var localeCookieString = gblWinopenerObj.fnGetCookie("Locale").toLowerCase();
        //localeCookieString="en-US,ed,re,tr,sp1,ja1,en1-us,ja;q=0.8,de1;q=0.6,fr2;q=0.4,es-us;q=0.2";  -->testing purpose
		if(localeCookieString !=""){
            localeCookieString = localeCookieString.replace(/#[\w \s = . ; #]*,/gi,",");
            localeCookieString = localeCookieString.replace(/#[\w \s = .]*/gi,"");   //This is for the last locale value in the string

            var localeArray = localeCookieString.split(",");
            var localeArrayLen = localeArray.length;
            var instLangArray = gblWinopenerObj.installedLanguages;
            //alert(localeCookieString);
            var installedLanguagesLen = gblWinopenerObj.installedLanguages.length;
            var hiphenLocaleArray;
            var tmpOrder;
            var boolBestMatchFound;
            //array installedLanguages  --> from Install_Languages.js
            for(var i=0;i<localeArrayLen;i++){
                hiphenLocaleArray = localeArray[i].toLowerCase().split("-");
                for(var j=0;j < installedLanguagesLen;j++){
                    if(hiphenLocaleArray.length >1){ //If Browser locale is in the Format en-US/fr-FR/fr-CA/ja-JP
                        if(instLangArray[j][0].toLowerCase() == hiphenLocaleArray[0]){ //checking Language part
                            if(instLangArray[j][1].toLowerCase() == hiphenLocaleArray[1]){ //checking country part
                                resolvedLocaleVal = instLangArray[j][0]+"_"+instLangArray[j][1];
                                tmpOrder = LanguageOrderHashMap[instLangArray[j][5]];
                                if(tmpOrder !== undefined && tmpOrder != null){
                                    gblLocaleOrder = tmpOrder;
                                }
                                break;
                            }
                            else{
                                //Case instLangArray[j][1].toLowerCase() != hiphenLocaleArray[1] -->When Country part is not matching check if there is any exact match of country by running through the remaining Installed Languges loop.
                                //Added as per new algorithm by terabe-san dated 17-10-2011.
                                if(instLangArray[j][0].toLowerCase() == "en"){
                                    resolvedLocaleVal = "en_US";  //Default;
                                    gblLocaleOrder = "WesternOrder";  //Default;
                                    break;
                                }
                                boolBestMatchFound = false;
                                for (var k=j+1;k < installedLanguagesLen;k++){
                                    //Continue the loop to check if there is any exact match by running the loop further.
                                    if(instLangArray[k][0].toLowerCase() == hiphenLocaleArray[0] && instLangArray[k][1].toLowerCase() == hiphenLocaleArray[1]){
                                        resolvedLocaleVal = instLangArray[k][0]+"_"+instLangArray[k][1];
                                        tmpOrder = LanguageOrderHashMap[instLangArray[k][5]];
                                        if(tmpOrder !== undefined && tmpOrder != null){
                                            gblLocaleOrder = tmpOrder;
                                        }
                                        boolBestMatchFound = true;
                                        break; //Breaking the current loop i.e best match loop
                                    }
                                }
                                if(boolBestMatchFound == false){
                                    // if there no exact match then this portion will be executed
                                    //Even though Country part is not matching since Language part is matched, so display in that language
                                    //eg : Browser locale: fr-CA  Installed Language on MFP : fr-FR. So,Display french not english
                                    if(localeArray[i].indexOf("zh-hans") != -1 || localeArray[i] == "zh-sg"){
                                        for (var installCounter=0;installCounter < installedLanguagesLen;installCounter++){
                                            if(instLangArray[installCounter][0].toLowerCase() == "zh" && instLangArray[installCounter][1].toLowerCase() == "cn") {
                                                resolvedLocaleVal = instLangArray[installCounter][0] + "_" + instLangArray[installCounter][1];
                                                tmpOrder = LanguageOrderHashMap[instLangArray[installCounter][5]];
                                                if (tmpOrder !== undefined && tmpOrder != null) {
                                                    gblLocaleOrder = tmpOrder;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else if(localeArray[i].indexOf("zh-hant") != -1 || localeArray[i] == "zh-hk" || localeArray[i] == "zh-mo"){
                                        for (var installCounter=0;installCounter < installedLanguagesLen;installCounter++){
                                            if(instLangArray[installCounter][0].toLowerCase() == "zh" && instLangArray[installCounter][1].toLowerCase() == "tw") {
                                                resolvedLocaleVal = instLangArray[installCounter][0] + "_" + instLangArray[installCounter][1];
                                                tmpOrder = LanguageOrderHashMap[instLangArray[installCounter][5]];
                                                if (tmpOrder !== undefined && tmpOrder != null) {
                                                    gblLocaleOrder = tmpOrder;
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else{
                                        resolvedLocaleVal = instLangArray[j][0]+"_"+instLangArray[j][1];
                                        tmpOrder = LanguageOrderHashMap[instLangArray[j][5]];
                                        if(tmpOrder !== undefined && tmpOrder != null){
                                            gblLocaleOrder = tmpOrder;
                                        }
                                    }
                                }
                                break; ////Breaking the outer loop -for(var j=0;j < installedLanguagesLen;j++)
                            }
                        }
                    }
                    else{ //If Browser locale is just in the Format 'en' or 'fr' or 'ja'. Sometimes country part is not present in the browser locale 
                        if(instLangArray[j][0].toLowerCase() == hiphenLocaleArray[0] && !(instLangArray[j][0].toLowerCase() == "zh" && instLangArray[j][1].toLowerCase() == "tw")){
                            //alert("else : "+instLangArray[j][0].toLowerCase()+" == "+hiphenLocaleArray[0]);
                            resolvedLocaleVal = instLangArray[j][0]+"_"+instLangArray[j][1];
                            tmpOrder = LanguageOrderHashMap[instLangArray[j][5]];
                            if(tmpOrder !== undefined && tmpOrder != null){
                               gblLocaleOrder = tmpOrder;
                            }
                            break;
                        }
                    }
                }
                if(j < installedLanguagesLen){
                    break;
                }
            }
        }
        //alert("TA display lang="+resolvedLocaleVal);
        return resolvedLocaleVal;
    }catch(e) {errHandler(e,'fnGetResolveLocaleForDisplay()','TopAccessUtil.js?v=1511376672ta',"");return resolvedLocaleVal;}
}