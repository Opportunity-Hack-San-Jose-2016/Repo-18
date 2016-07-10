/**
 * Created by Ming on 7/9/16.
 */
exports.indexTemp = function(title,user,data){
    if(!data)
        data = {};
    return {layout:"template/main_template.html", title:title,user:user, data:data}
};
exports.adminMainTemp = function(title,user,data){
    return {layout:"template/admin_main_frame.html",title:title,user:user,data:data}
};
exports.refugeeMainTemp = function(title,user,data){
    return{layout:"template/refugee_frame.html", title:title, user: user, data:data}
};