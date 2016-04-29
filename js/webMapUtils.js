
define([
  'dojo/_base/declare',
  "dojo/Deferred",
  "dojo/parser",
  "dojo/dom",
  "esri/map", 
  "esri/urlUtils",
  "esri/arcgis/utils",
  "dojo/_base/array",
  "esri/request",
  "esri/config",
  "dojo/request/xhr"
], function(
  declare,
  Deferred,
  parser,
  dom,
  Map,
  urlUtils,
  arcgisUtils,
  array,
  esriRequest,
  esriConfig,
  xhr
) {


    return declare(null,{
     
        readWebMap: function (id) {
            esriConfig.defaults.io.proxyUrl = "/proxy/proxy.ashx";
            var deferred = new Deferred();

            

            arcgisUtils.getItem(id).then(function (response) {

                var webMap = {};
                webMap.title = response.item.title;
                webMap.subtitle = "";
                webMap.thumbnail = "http://vhb.maps.arcgis.com/sharing/rest/content/items/" + response.item.id+ "/info/" + response.item.thumbnail;
                if (response.item.snippet != null)
                    webMap.subtitle = response.item.snippet;
                            
                webMap.operationalLayers = response.itemData.operationalLayers;
                webMap.layerList = [];
                array.forEach(response.itemData.operationalLayers, function (l, i) {
               
                    var ll = {};
                    ll.title = l.title;
                    ll.url = l.url;
                    ll.fieldNames = [];
                    ll.fieldAliases = [];
                    ll.fieldNamesString = "";
                    ll.visible = l.visibility;

                    ll.hasAttachments = false;//SBTEST

                    var layerInfo = esriRequest({
                        url: ll.url + "?f=json",
                        handleAs: "json",
                        sync:true
                    });

                    if (l.popupInfo != null) {
                        ll.popupInfoTemplate = l.popupInfo.description;
                        ll.popupInfoTitle = l.popupInfo.title;


                        array.forEach(l.popupInfo.fieldInfos, function (f, ii) {

                            var f2 = f;

                            if (f.visible) {
                                ll.fieldNames.push(f.fieldName);
                                ll.fieldAliases.push(f.label);
                                ll.fieldNamesString = ll.fieldNamesString + f.fieldName + ",";
                            }

                        });
                    }

                    if (ll.fieldNamesString.length > 0)
                        ll.fieldNamesString = ll.fieldNamesString.slice(0, -1);

                    if (ll.visible) {

                        if (l.layerDefinition != null) {
                            ll.layerDefinition = l.layerDefinition.definitionExpression;
                        }

                        webMap.layerList.push(ll);

                        ll.OBJECTIDFIELD = "OBJECTID";//default
                        layerInfo.then(function (res) {
                            var r = res;
                            ll.hasAttachments = res.hasAttachments;

                            array.forEach(res.fields, function (f, ii) {
                                if (f.type == 'esriFieldTypeOID')
                                    ll.OBJECTIDFIELD = f.name;

                                if (ll.popupInfoTemplate == null) {
                                    ll.fieldNames.push(f.name);
                                    ll.fieldAliases.push(f.alias);
                                    ll.fieldNamesString = ll.fieldNamesString + f.name + ",";
                                }
                            });

                        });
                    }

                })

                deferred.resolve(webMap);



            });
            
            return deferred.promise;
            

        }
    }
    );
});

