
// 模拟根据用户ID从数据库取出该用户所有project的数据
function getData(sUserID){
    const fs = require('fs');
    const fileUrl = './database/projects/' + sUserID + '.json';
    if(fs.existsSync(fileUrl)){
        return JSON.parse(fs.readFileSync(fileUrl));
    }
    else{ // 根本没有该用户。有用户但没项目是空数组
        return null;
    }
}

function addProject(sUserID, oProject){
    if(true){ // 检查oProject
        aExistingProject.unshift();
        return {err: ''};
    }
    else{
        return {err: 'err'};
    }
}

module.exports = {
    'GET /api/projects/:sUserID': async (ctx, next) => {
        // 设置Content-Type:
        ctx.response.type = 'application/json';
        // 设置Response Body:
        ctx.response.body = getData(ctx.params.sUserID);
    },

    'POST /api/addProject': async(ctx, next)=>{

        const userID = body.userID;
        let aExistingProject = getData(userID);

        const body = ctx.request.body;

        // TODO
        // 检查项目名称和图片
        // 如果设置了的话，生成图片URL
        const name = body.projectName;
        const img = '';
        const id = aExistingProject.length;

        let project = {
            img: '',
            name,
            id,
            catas: {},
        };



        ctx.response.type = 'application/json';
        ctx.response.body = {err: ''};
    },
};
