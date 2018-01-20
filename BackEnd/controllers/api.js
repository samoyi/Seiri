const products = require('../products');


const APIError = require('../rest').APIError;


module.exports = {
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },

    'POST /api/products': async (ctx, next) => {
        var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },

    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = products.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
};
// const User = require('../modules/User');
//
//
// module.exports = {
//     'GET /api/user/:sUserID': async (ctx, next) => {
//         // 设置Content-Type:
//         ctx.response.type = 'application/json';
//
//         const user = new User(ctx.params.sUserID);
//         console.log(user);
//         if(user.userID){
//             user.getProjects()
//                 .then((res)=>{
//                     ctx.response.body = res;
//                 });
//         }
//         else{
//             ctx.response.body = [];
//         }
//     },
//
//     'POST /api/addProject': async(ctx, next)=>{
//
//         const userID = body.userID;
//         let aExistingProject = getData(userID);
//
//         const body = ctx.request.body;
//
//         // TODO
//         // 检查项目名称和图片
//         // 如果设置了的话，生成图片URL
//         const name = body.projectName;
//         const img = '';
//         const id = aExistingProject.length;
//
//         let project = {
//             img: '',
//             name,
//             id,
//             catas: {},
//         };
//
//
//
//         ctx.response.type = 'application/json';
//         ctx.response.body = {err: ''};
//     },
// };
