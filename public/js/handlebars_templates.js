(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['device_list_item'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\"device_list_item_"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"device_list_item noselect\">\n   <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n      <tr valign=\"middle\">\n         <td>\n            <div>"
    + escapeExpression(((helper = (helper = helpers.serialNumber || (depth0 != null ? depth0.serialNumber : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"serialNumber","hash":{},"data":data}) : helper)))
    + "</div>\n            <div>Created: "
    + escapeExpression(((helper = (helper = helpers.created || (depth0 != null ? depth0.created : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"created","hash":{},"data":data}) : helper)))
    + "</div>\n         </td>\n      </tr>\n   </table>\n</div>";
},"useData":true});
templates['feed_list_item'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\"feed_list_item_"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"feed_list_item noselect\">\n   <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\n      <tr valign=\"middle\">\n         <td>\n            <div>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\n            <div>Last upload: "
    + escapeExpression(((helper = (helper = helpers.lastUploadFormatted || (depth0 != null ? depth0.lastUploadFormatted : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"lastUploadFormatted","hash":{},"data":data}) : helper)))
    + "</div>\n         </td>\n         <td align=\"right\">\n            <div class=\"checkmark_icon_container\" style=\"display:none;margin-left:10px\"></div>\n         </td>\n      </tr>\n   </table>\n</div>";
},"useData":true});
templates['grapher'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<table id=\"grapher\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\">\n   <tr>\n      <td>\n         <div id=\"date_axis_container\">\n            <div id=\"date_axis\" class=\"date_axis\"></div>\n            <div id=\"value_label\"></div>\n         </div>\n      </td>\n      <td>&nbsp;</td>\n   </tr>\n   <tr>\n      <td>\n         <div id=\"plot\" class=\"plot\" style=\"height:"
    + escapeExpression(((helper = (helper = helpers.plotHeight || (depth0 != null ? depth0.plotHeight : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"plotHeight","hash":{},"data":data}) : helper)))
    + "px; border: 1px solid black;\"></div>\n      </td>\n      <td>\n         <div id=\"y_axis\" class=\"y_axis\" style=\"position:relative;height:"
    + escapeExpression(((helper = (helper = helpers.plotHeight || (depth0 != null ? depth0.plotHeight : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"plotHeight","hash":{},"data":data}) : helper)))
    + "px\">\n            <div id=\"y_axis_label\" class=\"rotate_90 y_axis_label\">";
  stack1 = ((helper = (helper = helpers.yAxisLabel || (depth0 != null ? depth0.yAxisLabel : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"yAxisLabel","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n         </div>\n      </td>\n   </tr>\n</table>\n";
},"useData":true});
})();
