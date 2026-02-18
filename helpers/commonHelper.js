import { ApiEndPoints } from "../config";
const commonhelpers = {

    captureLogActivity: function(name,type,module=null,section=null,url,desc,oldValues=null){
        var formpojo ={};
        formpojo.activityName = name;
        formpojo.activityType = type;
        formpojo.module = module;
        formpojo.section = section;
        formpojo.url = url;
        formpojo.desc = desc;
        formpojo.oldValues = oldValues;
        fetch(ApiEndPoints.captureLogActivity, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formpojo)
        })
  }

}
export default commonhelpers;