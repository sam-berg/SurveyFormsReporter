
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
  "dojo/request/xhr",
  "esri/lang",
  "dojo/json",
  "dojo/dom", "esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/RelationshipQuery", "esri/layers/FeatureLayer", "dojo/dom-construct"
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
  xhr,esriLang,json,dom,
  Query, QueryTask, RelationshipQuery, FeatureLayer,domConstruct
) {


    return declare(null,{
     
        generateLayerReport: function (layer) {
            esriConfig.defaults.io.proxyUrl = "/proxy/proxy.ashx";
            var deferred = new Deferred();

            var layerReport = {};

            var queryTask = new QueryTask(layer.url);
            var sourceFeatureLayer = new FeatureLayer(layer.url);

            var pHead = "<div id='" + layer.title + "' class='spanHeader'><span >" + layer.title + "</span></div>";
            layerReport.header = pHead;
            layerReport.records = [];
            layerReport.title = layer.title;

            var query = new Query();
            query.returnGeometry = false;
            query.outFields = [
              layer.fieldNamesString
            ];
            query.where = "0=0";
            queryTask.execute(query).then(function (results)
            {
                var featureAttributes = results.features[0].attributes;

  
                if (layer.popupInfoTemplate) {
                    var p = "";
                    var tHead = "<tr>";
                    var a = "Description";
                    //popupInfoTitle
                    var s3 = layer.popupInfoTitle.replace(/{/ig, "${");
                    a=esriLang.substitute(featureAttributes, s3);

                    tHead = tHead + "<th>" + a + "</th>";
                    tHead = tHead + "</tr>";
                    layerReport.recordHeader = tHead;
                    layerReport.recordsHTML = "";

                    for (var i = 0; i < results.features.length; i++) {
                        f = results.features[i];
                        var featureAttributes = f.attributes;
                        var featureRecord = "<tr>";

                        s2 = layer.popupInfoTemplate.replace(/{/ig, "${");
                        s=esriLang.substitute(featureAttributes, s2);

                        featureRecord = featureRecord + "<td>" + s + "</td>";

                        featureRecord = featureRecord + "</tr>";
                        layerReport.records.push(featureRecord);
                        layerReport.recordsHTML = layerReport.recordsHTML + featureRecord;

                    }

                    var t = "<table>";
                    t = t + layerReport.recordHeader;
                    t = t + layerReport.recordsHTML;
                    t = t + "</table><br/><br/>"
                    var pp = layerReport.header + t;
                    layerReport.dom = domConstruct.toDom(pp);

                }
                else {
                    var tHead = "<tr>";
                    //for (var a in featureAttributes) {
                    for (var i = 0; i < layer.fieldAliases.length; i++) {
                        var a = layer.fieldAliases[i];
                        tHead = tHead + "<th>" + a + "</th>";
                        //tHead = tHead + "<td>" + a + "</td>";
                    }
                    //tHead = tHead + "</tr></thead>";
                    tHead = tHead + "</tr>";
                    layerReport.recordHeader = tHead;
                    layerReport.recordsHTML = "";

                    for (var i = 0; i < results.features.length; i++) {
                        f = results.features[i];
                        var featureAttributes = f.attributes;
                        var featureRecord = "<tr>";

                        for (var a in f.attributes) {
                            var s = f.attributes[a];
                            if (s != null)
                                s = s.toString();

                            featureRecord = featureRecord + "<td>" + s + "</td>";
                        }

                        featureRecord = featureRecord + "</tr>";
                        layerReport.records.push(featureRecord);
                        layerReport.recordsHTML = layerReport.recordsHTML + featureRecord;

                    }

                    var t = "<table>";
                    t = t + layerReport.recordHeader;
                    t = t + layerReport.recordsHTML;
                    t = t + "</table><br/><br/>"
                    var pp = layerReport.header + t;
                    layerReport.dom = domConstruct.toDom(pp);
                }

                deferred.resolve(layerReport);

            });

            //var queryRelated = new RelationshipQuery();
            //queryRelated.returnGeometry = false;
            //queryRelated.outFields = [
            //  "*"
            //];
            //queryRelated.objectIds = [oid];
            //sourceFeatureLayer.queryRelatedFeatures(queryRelated, updateRelatedResults);

            //function createPhotoRecord(p, url) {

            //    var featureAttributes = p.attributes;

            //    var photoRecord = "<tr>";
            //    photoRecord = photoRecord + "<td>Photo #</td><td>Location:&nbsp;" + featureAttributes.PHOTOLOCATION + "</td>";
            //    photoRecord = photoRecord + "</tr>";


            //    for (var attributeName in featureAttributes) {

            //    }

            //    photoRecord = photoRecord + "<tr><td>";
            //    photoRecord = photoRecord + "<img src='" + url + "'/>";
            //    photoRecord = photoRecord + "<td>Description:&nbsp;" + featureAttributes.PHOTODESCRIPTION + "</td>";

            //    photoRecord = photoRecord + "</tr>";

            //    var row = domConstruct.toDom(photoRecord);
            //    domConstruct.place(row, "photoTable");

            //}
            //function updateRelatedResults(results) {

            //    res = results[this.oid];

            //    var resultCount = res.features.length;
            //    for (var i = 0; i < resultCount; i++) {

            //        p = res.features[i];
            //        //get attachments
            //        var reloid = p.attributes.objectid;

            //        //request:
            //        var req = this.relatedLayerURL + "/" + reloid + "/attachments";

            //        var photosRequest = esriRequest({
            //            url: req,
            //            content: { f: "json" },
            //            handleAs: "json",
            //            callbackParamName: "callback"
            //        });
            //        photosRequest.then(
            //          function (response) {

            //              var attachmentCount = response.attachmentInfos.length;
            //              for (var i = 0; i < attachmentCount; i++) {

            //                  var photoURL = req + "/" + response.attachmentInfos[i].id;


            //                  console.log(photoURL);
            //                  createPhotoRecord(p, photoURL);
            //              }

            //          }, function (error) {
            //              console.log("Error: ", error.message);
            //          });

            //    }


            //}

            
            return deferred.promise;
            

        }
    
    }
    );
});

