<!--
## 该组件功能：
    * 物品分类
    * 物品状态管理
    * 物品搜索
    * 删除项目

    * 物品类别（上衣、裤子等）
    * 编辑物品类别（添加、删除、改名）
    * 状态类别（大衣柜、小衣柜等）
    * 编辑状态类别（添加、删除、改名）
    * 搜索一件物品

 -->

<template>
    <v-ons-page>
        <v-ons-toolbar>
            <input type="text" class="search-input" placeholder="关键词搜索物品" />
            <input type="button" class="addCata" value="添加分类" @click="addCata" />
        </v-ons-toolbar>
        <v-ons-list>
            <ul>
                <li v-for="(cata,key) in catas" :key="key">
                    <v-ons-list-header>
                        {{key}}
                        <v-ons-icon v-show="cata.folded" class="caret-up" icon="fa-caret-up" @click="unfold(key)"></v-ons-icon>
                        <v-ons-icon v-show="!cata.folded" class="caret-down" icon="fa-caret-down" @click="fold(key)"></v-ons-icon>
                        <v-ons-icon class="rename" icon="fa-pencil" @click="changeName(key)"></v-ons-icon>
                        <v-ons-icon class="deleteBtn" icon="fa-trash-o" @click="deleteProject(key)"></v-ons-icon>
                    </v-ons-list-header>
                    <div :class="{folded: cata.folded}">
                        <v-ons-list-item v-for="(item, index) in cata.items" :key="item.name">
                            <div class="left">
                                <img class="list-item__thumbnail" :src="item.img" @click="showLargeImage(item.img)" alt="item.name">
                            </div>
                            <div class="center">
                                <span class="list-item__title">{{item.name}}</span><span class="list-item__subtitle">{{item.des}}</span>
                            </div>
                            <v-ons-icon class="edit-item" icon="fa-pencil-square-o" @click="editItem(key, index)"></v-ons-icon>
                        </v-ons-list-item>
                    </div>
                </li>
            </ul>
        </v-ons-list>
        <edit-card
            v-bind="oEditCardProp"
            v-on:closeCard="closeCard"
            v-on:submit="submitEdit">
            <select v-model="newCata">
                <option v-for="(cata, key) in catas" :selected="key===currentCata" :value="key">{{key}}</option>
            </select>
        </edit-card>
        <div id="largeImageFrame" v-show="bDisplayLargeImage" @click="hideLargeImage">
            <img id="largeImage" src="" alt="断·舍·离" />
        </div>
        <!-- <div id="waiting" v-show="bWaiting">
            <img src="../assets/waiting.gif" alt="断·舍·离" />
        </div> -->

    </v-ons-page>
</template>

<script>

// import MB from '../js/MultiByte.js';
import MyUtil from '../js/MyUtil.js';
// import imageCompress from '../js/frontEndImageCompress.js';


// let oProjects = null; // mouted之后，选择该节点
let oLargeImage = null;

import editCard from './editCard.vue';

export default {
    components: {
        'edit-card': editCard,
    },
    data () {
        return {
            // nNextID: 4, // 新添加项目的ID
            // bDisplayAddCard: false, // 是否正在添加项目
            // newProject: {
            //     newProjectName: '',
            // },

            catas: { // 当前的项目列表
                'cata1': {
                    folded: false,
                    items: [
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第一个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '立春雨水惊蛰春分清明谷雨',
                            des: '描述1',
                        },
                        {
                            img: './upload/images/projectCover/1.png',
                            name: 'aaaaaaaaaaaaaaaaaaaaaaaa',
                            des: '描述2',
                        },
                        {
                            img: './upload/images/projectCover/2.jpg',
                            name: 'はははははははははははは',
                            des: '描述3',
                        },
                    ]
                },
                'cata2': {
                    folded: true,
                    items: [
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '立春雨水惊蛰春分清明谷雨',
                            des: '描述1',
                        },
                    ]
                },
                'cata3': {
                    folded: true,
                    items: [
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第三个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/2.jpg',
                            name: 'はははははははははははは',
                            des: '描述3',
                        },
                    ]
                },
            },

            oEditCardProp: {
                bDisplay: false,
                newName: '',
                namePlaceholder: '条目名称',
                newDes: '',
                desPlaceholder: '条目描述',
                tip: '条目名称最多支持12个汉字及日文字符，或24个英文字符',
                updateTip: '选择图片',
                initButtonText: '修改',
                submitButtonText: '修改',
            },
            currentCata: '', // 条目当前类别。用于修改类别
            newCata: '', // 条目修改后的类别

            // 等待动画是否出现
            bWaiting: false,

            bDisplayLargeImage: false,
        };
    },
    methods:{
        addCata(){
            let sNewName = prompt('输入新的类别名称：\n最多支持12个汉字及日文字符，或24个英文字符');
            if(sNewName && sNewName.trim()){
               let nResult = this.checkCataName(sNewName);
               console.log(nResult)
               if(nResult===0){
                   this.$set(this.catas, sNewName, []);
               }
               else if(nResult===2){
                   alert('类别名称过长');
               }
               else if(nResult===4){
                   alert('和其他类别重名');
               }
            }
        },
        changeName(currentName){
            let sNewName = prompt('输入新的项目名称：\n最多支持12个汉字及日文字符，或24个英文字符');
            if(sNewName && sNewName.trim()){
                let nResult = this.checkCataName(sNewName, currentName);
                if(nResult===0){
                    this.$set(this.catas, sNewName, this.catas[currentName]);
                    delete this.catas[currentName];
                }
                else if(nResult===2){
                    alert('类别名称过长');
                }
                else if(nResult===4){
                    alert('和其他类别重名');
                }
            }
        },
        deleteProject(sCataName){
            if( confirm('确定删除该类别？\n删除后不可恢复') ){
                if( prompt('输入类别名称，以完成删除：').trim()===sCataName ){
                    this.$set(this.catas, sCataName, undefined);
                    delete this.catas[sCataName];
                }
                else{
                    alert('类别名称输入不正确。删除取消。');
                }
            }
        },
        showLargeImage(src){
            oLargeImage.src = src;
            this.bDisplayLargeImage = true;
        },
        hideLargeImage(ev){
            if(ev.target===ev.currentTarget){
                oLargeImage.src = '';
                this.bDisplayLargeImage = false;
            }
        },
        unfold(key){
            this.catas[key].folded = false;
        },
        fold(key){
            this.catas[key].folded = true;
        },
        editItem(key, index){
            let item = this.catas[key].items[index];
            this.currentCata = key;
            this.newCata = key;

            this.oEditCardProp.newName = item.name;
            this.oEditCardProp.newDes = item.des;
            console.log(this.oEditCardProp.newName);
            console.log(this.oEditCardProp.newDes);
            this.oEditCardProp.bDisplay = true;
        },
        submitEdit(newData){
            if(false){// 没有修改名称
                // 两个维度四个情况
                // 改类别改名      检查重名
                // 改类别没改名    检查重名
                // 没改类别改名    检查重名
                // 没改类别没改名  不能检查重名

            }
            else{
                // console.log(this.newCata)
                // console.log(this.catas[this.newCata])
                // let aNamesInTargetCata = this.catas[this.newCata]
                //                          .items.map(item=>item.name);
                // if(aNamesInTargetCata.includes(this.oEditCardProp.newName)){
                //     alert(this.newCata + ' 类别中已经存在名为 '
                //           + this.oEditCardProp.newName + ' 的条目')
                // }
            }
        },
        closeCard(){
            this.oEditCardProp.bDisplay = false;
        },
        // addProject(){
        //     // 当this.bDisplayAddCard为false时，表示没有处于添加项目状态，点击按钮则添加项目窗口出现
        //     // 当this.bDisplayAddCard为true时，表示当前处于添加项目状态，点击按钮则进行实际的数据添加
        //     if(this.bDisplayAddCard){ // 实际的数据添加
        //         // TODO  压缩回调后才能进行下面的代码
        //         let sNewName = this.newProject.newProjectName;
        //         if(sNewName.trim()){
        //             let nResult = this.checkCataName(sNewName);
        //             if(nResult===0){
        //                 let sCoverURL = '';
        //                 if(this.compressedCover){ // 上传了封面图
        //                     sCoverURL = URL.createObjectURL(this.compressedCover);
        //                     alert('TODO: send image to backend');
        //                 }
        //                 this.projects.push({
        //                     img: sCoverURL,
        //                     name: sNewName,
        //                     id: this.nNextID++
        //                 });
        //                 this.bAddedProject = true;
        //                 this.bDisplayAddCard = false;
        //                 this.newProject.newProjectName = '';
        //             }
        //             else if(nResult===2){
        //                 alert('项目名称过长');
        //             }
        //             else if(nResult===4){
        //                 alert('和其他项目重名');
        //             }
        //         }
        //         else{
        //             alert('必须填写项目名称');
        //         }
        //     }
        //     else{ // 添加项目窗口出现
        //         this.bDisplayAddCard = true;
        //         // 清空之前上传的封面
        //         oProjects.querySelector('#cardForAdd .selectImage').value = null;
        //         this.compressedCover = null;
        //     }
        // },
        // closeAddProject(){
        //     this.bDisplayAddCard = false;
        // },
        checkCataName(sName, currentName=''){
            let nErrCode = 0;
            if(sName && sName.trim()){
                if(!isValidLength(sName)){
                    nErrCode = 2;
                }
                else{
                    let oCata = this.catas;
                    for(let cataName in oCata){
                        if(cataName === sName){ // 出现了重名
                            if(currentName || currentName===sName){ // 和指定序号的项重名。用来确定重命名时是否和自己重名
                                nErrCode = 3;
                            }
                            else{ // 和指定的项以外的项目重名
                                nErrCode = 4;
                            }
                            break;
                        }
                    }
                }
            }
            else{ // 没输入或只输入了空格
                nErrCode = 1;
            }
            return nErrCode;
        },
        // setCoverSize(aCoverNode){ // 如果上传了图片且图片宽度如果设置为100%会拉伸，就设置为auto
        //     // 必须确保图片加载完，才能获得naturalWidth
        //     let nMaxWidth = window.innerWidth - 16 - 32;
        //
        //     aCoverNode.forEach(cover=>{
        //         if(cover.naturalWidth && cover.naturalWidth<nMaxWidth){
        //             cover.style.width = 'auto';
        //         }
        //     })
        // },
        // handleChangeCover(index, ev){
        //     let oUploadedImage = (ev.target.files)[0];
        //     if(oUploadedImage){ // 如果为false则是用户取消了上传
        //         this.handleImage(oUploadedImage, blob=>{
        //             let oCoverNode = oProjects.querySelectorAll('#project-list .projectCard')[index].querySelector('img');
        //             oCoverNode.onload = ()=>{
        //                 this.setCoverSize([oCoverNode]);
        //             };
        //             this.projects[index].img = URL.createObjectURL(blob);
        //         });
        //     }
        // },
        // handleNewCover(ev){
        //     let oUploadedImage = (ev.target.files)[0];
        //     if(oUploadedImage){ // 如果为false则是用户取消了上传
        //         this.handleImage(oUploadedImage, blob=>{
        //             alert('新图片上传好了');
        //         });
        //     }
        // },
        // handleImage(oUploadedImage, callback){ // 处理上传的图片
        //     this.bWaiting = true;
        //     imageCompress(oUploadedImage, ['image/jpeg', 'image/png', 'image/webp'], 5*1024*1024, res=>{
        //         let nErrCode = res.errCode;
        //         if(nErrCode===1){
        //             alert('图片只支持jpg、png和webp三种格式');
        //         }
        //         else if(nErrCode===2){
        //             alert('图片大小不能超过5MB');
        //         }
        //         else{
        //             this.compressedCover = res.blob;
        //             callback(res.blob);
        //         }
        //         this.bWaiting = false;
        //     });
        // },
    },
    mounted(){
        // oProjects = document.querySelector('#projects');
        // window.onload = ()=>{ // 封面图加载完成后，设置合适的尺寸
        //     let aCoverNode = [...oProjects.querySelectorAll('#project-list .project-cover')];
        //     this.setCoverSize(aCoverNode);
        // };
        oLargeImage = document.querySelector('#largeImage');
    },
    // updated(){
    //     // 新封面图加载完成后调整大小
    //     if(this.bAddedProject){
    //         this.bAddedProject = false;
    //         let oCoverNode = oProjects.querySelector('#project-list').lastChild.querySelector('img');
    //         oCoverNode.onload = ()=>{
    //             this.setCoverSize([oCoverNode]);
    //         };
    //     }
    // },
}

// 检测项目名长度，长度不超过12个中日文/24个英文字母的长度
function isValidLength(sName, nMax=24){
    let sLen = [...sName].length,
        nAsciiNum = MyUtil.findAsciiIndexes(sName).length;
    return (sLen-nAsciiNum)*2 + nAsciiNum <= nMax;
}

</script>

<style scoped lang="scss">
@import "../scss/common.scss";

ons-page{
    top: $HEADER-HEIGHT;

    ons-toolbar{
        .search-input{
            position: absolute;
            top: 0; bottom: 0; margin: auto;
            width: 12em; height: 28px;
            left: 14px;
        }
        .addCata{
            height: 28px;
            line-height: 28px;
            width: 6em;
            position: absolute;
            right: 14px;
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0;
            background-color: #0076ff;
            border: 0 solid currentColor;
            border-radius: 3px;
            transition: none;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12), 0 3px 1px -2px rgba(0, 0, 0, .2);
            color: white;
        }
    }
    ons-list{
        background-color: transparent;
        >ul{
            >li{
                // margin-bottom: 22px;
                padding: 10px 0;
                ons-list-header{
                    font-size: 18px;
                    color: $BASIC-RED;
                    background-color: #ccc;
                    .caret-up, .caret-down{
                        position: absolute; margin: auto;
                        top: 0; right: 0; bottom: 0; left: 0;
                        text-align: center;
                        width: 18px; height: 12px;
                    }
                    .caret-up::before, .caret-down::before{
                        top: -6px;
                        position: absolute;
                        left: 0;
                        display: block;
                        height: 100%;
                        width: 100%;
                    }
                    .rename{
                        font-size: 14px;
                    }
                    .deleteBtn{
                        float: right;
                        font-size: 20px;
                        position: relative;
                        top: 2px;
                        right: 8px;
                    }
                }
                >div{
                    overflow: hidden;
                    ons-list-item{
                        margin-bottom: 6px;
                        .center{
                            padding: 2px 8px;
                            .list-item__title{
                                font-size: 14px;
                            }
                            .list-item__subtitle{
                                font-size: 12px;
                            }
                        }
                        .edit-item{
                            font-size: 14px;
                            color: $BASIC-RED;
                            position: absolute;
                            right: 24px;
                        }
                    }
                }
                .folded{
                    height: 0;
                }
            }
        }
    }

    #largeImageFrame{
        width: 100%; height: 100%;
        position: fixed; top: 0; left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        #largeImage{
            display: block;
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0; margin: auto;
            max-width: 80%; max-height: 80%;
        }
    }
//     #project-list{
//         margin-bottom: 40px;
//         .projectCard{
//             .project-cover{
//                 color: gray;
//                 display: block;
//                 width: 100%; margin: auto;
//             }
//             .noCover{
//                 min-height: 50px;
//             }
//             .project-name{
//                 color: $BASIC-RED;
//                 font-size: 18px;
//                 position: relative;
//                 top: 6px;
//                 display: inline-block;
//                 .rename{
//                     color: $BASIC-RED;
//                     font-size: 18px;
//                     position: absolute; right: -24px; top: 0;
//                 }
//             }
//             .deleteBtn, .changeCover{
//                 float: right;
//                 color: $BASIC-RED;
//                 font-size: 24px;
//                 position: relative; top: 2px;
//             }
//             .changeCover{
//                 margin-right: 12px;
//                 position: relative;
//                 .changeCoverInput{
//                     width: 100%; height: 100%;
//                     position: absolute; top: 0; left: 0;
//                     opacity: 0;
//                 }
//             }
//         }
//     }
//
//     #cardForAdd{
//         min-height: 66px;
//         position: fixed; left: 0; bottom: 0; width: 100%;
//         padding: 16px; box-sizing: border-box;
//         .closeBtn{
//             position: absolute;
//             top: 8px; right: 8px;
//         }
//         .newProjectName, .newProjectCover{
//             display: block;
//             width: 100%;
//             border-top: none;
//             border-right: none;
//             border-left: none;
//         }
//         .newProjectName{
//             height: 2em;
//             margin-top: 14px;
//         }
//         p{
//             font-size: 10px;
//             text-align: left;
//             color: gray;
//             margin-top: 4px;
//         }
//         .newProjectCover{
//             margin: 24px auto 0 auto;
//             width: 120px;
//             .selectImage{
//                 width: 100%; height: 100%;
//                 position: absolute; top: 0; left: 0;
//                 opacity: 0;
//             }
//         }
//         #addProjectBtn{
//             position: absolute; bottom: 10px;
//             width: 80%; left: 10%;
//         }
//     }
//     .expanding{
//         height: 200px;
//     }
//
//     #waiting{
//         width: 100%; height: 100%;
//         position: fixed; top: 0; left: 0;
//         background-color: rgba(0, 0, 0, 0.7);
//         img{
//             display: block; width: 100px;
//             position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;
//         }
//     }
}


</style>
