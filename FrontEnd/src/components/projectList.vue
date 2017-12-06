<!--
## 该组件功能：
    * 项目列表
    * 编辑项目封面、项目名称
    * 新加项目
    * 删除项目

## 封面图上传处理
    使用frontEndImageCompress组件限定上传类型和尺寸，并进行压缩和生成blobURL

## 封面图尺寸设定
    组件加载、更换封面、新加项目封面时，通过setCoverSize方法设定封面图尺寸。规则如下：
        * 如果没有图片，img的width设为100%
        * 如果图片宽度不足img父级宽度，则img的width设为auto，使其不会拉伸
        * 如果图片宽度大于等于img父级宽度，则img的width设为100%
 -->

<template>
    <v-ons-page id="projects">
        <div id="project-list"> <!-- 项目列表 -->
            <v-ons-card class="projectCard" v-for="(project,index) in projects" :key="project.id">
                <img class="project-cover" :class="{noCover: !project.img}" :src="project.img" :alt="project.name">
                <div class="project-name">
                    {{project.name}}
                    <v-ons-icon class="rename" icon="fa-pencil" @click="changeName(index)"></v-ons-icon>
                </div>
                <v-ons-icon class="deleteBtn" icon="fa-trash-o" @click="deleteProject(index)"></v-ons-icon>
                <v-ons-icon class="changeCover" icon="fa-picture-o">
                    <input class="changeCoverInput" @change="handleChangeCover(index, $event)" type="file" />
                </v-ons-icon>
                <div class="content">
                </div>
            </v-ons-card>
        </div>
        <v-ons-bottom-toolbar id="cardForAdd" :class="{expanding: bDisplayAddCard}"><!-- 新加项目 -->
            <v-ons-icon class="closeBtn" v-show="bDisplayAddCard" icon="fa-times" @click="closeAddProject"></v-ons-icon>
            <input class="newProjectName" v-show="bDisplayAddCard" placeholder="项目名称" require float v-model="newProject.newProjectName" />
            <p v-show="bDisplayAddCard">最多支持12个汉字及日文字符，或24个英文字符</p>
            <v-ons-button class="newProjectCover" modifier="cta" v-show="bDisplayAddCard">
                选择封面
                <input class="selectImage" @change="handleNewCover" type="file" />
            </v-ons-button>
            <v-ons-button id="addProjectBtn" modifier="large" @click="addProject">{{bDisplayAddCard?'添加':'添加项目'}}</v-ons-button>
        </v-ons-bottom-toolbar>
        <div id="waiting" v-show="bWaiting"><!-- 通用的等待动画 -->
            <img src="../assets/waiting.gif" alt="断·舍·离" />
        </div>

    </v-ons-page>
</template>

<script>

import MB from '../js/MultiByte.js';
import MyUtil from '../js/MyUtil.js';
import imageCompress from '../js/frontEndImageCompress.js';


let oProjects = null; // mouted之后，选择该节点

export default {
    data () {
        return {
            nNextID: 4, // 新添加项目的ID
            bDisplayAddCard: false, // 是否正在添加项目
            newProject: {
                newProjectName: '',
            },
            projects: [ // 当前的项目列表
                {
                    img: '',
                    name: '第三个项目',
                    id: 0
                },
                {
                    img: './upload/images/projectCover/0.png',
                    name: '立春雨水惊蛰春分清明谷雨',
                    id: 1
                },
                {
                    img: './upload/images/projectCover/1.png',
                    name: 'aaaaaaaaaaaaaaaaaaaaaaaa',
                    id: 2
                },
                {
                    img: './upload/images/projectCover/2.jpg',
                    name: 'はははははははははははは',
                    id: 3
                },
            ],
            selectedImage: null, // 上传项目封面时，表单选择的图片
            compressedCover: null, // 表单选择的图片经过压缩之后的blob对象

            // 添加了一个项目后，设为true，updated中判定如果为true，则设定新项目封
            // 面图的尺寸
            bAddedProject: false,

            // 等待动画是否出现
            bWaiting: false,
        };
    },
    methods:{
        deleteProject(index){
            if( confirm('确定删除该项目？\n删除后不可恢复') ){
                if( prompt('输入项目名称，以完成删除：').trim()===this.projects[index].name ){
                    this.projects.splice(index, 1);
                }
                else{
                    alert('项目名称输入不正确。删除取消。');
                }
            }
        },
        changeName(index){
            let sNewName = prompt('输入新的项目名称：\n最多支持12个汉字及日文字符，或24个英文字符');
            if(sNewName && sNewName.trim()){
                let nResult = this.checkProjectName(sNewName, index);
                if(nResult===0){
                    this.projects[index].name = sNewName;
                }
                else if(nResult===2){
                    alert('项目名称过长');
                }
                else if(nResult===4){
                    alert('和其他项目重名');
                }
            }
        },
        addProject(){
            // 当this.bDisplayAddCard为false时，表示没有处于添加项目状态，点击按钮则添加项目窗口出现
            // 当this.bDisplayAddCard为true时，表示当前处于添加项目状态，点击按钮则进行实际的数据添加
            if(this.bDisplayAddCard){ // 实际的数据添加
                // TODO  压缩回调后才能进行下面的代码
                let sNewName = this.newProject.newProjectName;
                if(sNewName.trim()){
                    let nResult = this.checkProjectName(sNewName);
                    if(nResult===0){
                        let sCoverURL = '';
                        if(this.compressedCover){ // 上传了封面图
                            sCoverURL = URL.createObjectURL(this.compressedCover);
                            alert('TODO: send image to backend');
                        }
                        this.projects.push({
                            img: sCoverURL,
                            name: sNewName,
                            id: this.nNextID++
                        });
                        this.bAddedProject = true;
                        this.bDisplayAddCard = false;
                        this.newProject.newProjectName = '';
                    }
                    else if(nResult===2){
                        alert('项目名称过长');
                    }
                    else if(nResult===4){
                        alert('和其他项目重名');
                    }
                }
                else{
                    alert('必须填写项目名称');
                }
            }
            else{ // 添加项目窗口出现
                this.bDisplayAddCard = true;
                // 清空之前上传的封面
                oProjects.querySelector('#cardForAdd .selectImage').value = null;
                this.compressedCover = null;
            }
        },
        closeAddProject(){
            this.bDisplayAddCard = false;
        },
        checkProjectName(sName, index){
            let nErrCode = 0;
            if(sName && sName.trim()){
                if(!isValidLength(sName)){
                    nErrCode = 2;
                }
                else{
                    let aProject = this.projects,
                        len = aProject.length;
                    for(let i=0; i<len; i++){
                        if(aProject[i].name === sName){ // 出现了重名
                            if(index===i){ // 和指定序号的项重名。用来确定重命名时是否和自己重名
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
            else{
                nErrCode = 1;
            }
            return nErrCode;
        },
        setCoverSize(aCoverNode){ // 如果上传了图片且图片宽度如果设置为100%会拉伸，就设置为auto
            // 必须确保图片加载完，才能获得naturalWidth
            let nMaxWidth = window.innerWidth - 16 - 32;

            aCoverNode.forEach(cover=>{
                if(cover.naturalWidth && cover.naturalWidth<nMaxWidth){
                    cover.style.width = 'auto';
                }
            })
        },
        handleChangeCover(index, ev){
            let oUploadedImage = (ev.target.files)[0];
            if(oUploadedImage){ // 如果为false则是用户取消了上传
                this.handleImage(oUploadedImage, blob=>{
                    let oCoverNode = oProjects.querySelectorAll('#project-list .projectCard')[index].querySelector('img');
                    oCoverNode.onload = ()=>{
                        this.setCoverSize([oCoverNode]);
                    };
                    this.projects[index].img = URL.createObjectURL(blob);
                });
            }
        },
        handleNewCover(ev){
            let oUploadedImage = (ev.target.files)[0];
            if(oUploadedImage){ // 如果为false则是用户取消了上传
                this.handleImage(oUploadedImage, blob=>{
                    alert('新图片上传好了');
                });
            }
        },
        handleImage(oUploadedImage, callback){ // 处理上传的图片
            this.bWaiting = true;
            imageCompress(oUploadedImage, ['image/jpeg', 'image/png', 'image/webp'], 5*1024*1024, res=>{
                let nErrCode = res.errCode;
                if(nErrCode===1){
                    alert('图片只支持jpg、png和webp三种格式');
                }
                else if(nErrCode===2){
                    alert('图片大小不能超过5MB');
                }
                else{
                    this.compressedCover = res.blob;
                    callback(res.blob);
                }
                this.bWaiting = false;
            });
        },
    },
    mounted(){
        oProjects = document.querySelector('#projects');
        window.onload = ()=>{ // 封面图加载完成后，设置合适的尺寸
            let aCoverNode = [...oProjects.querySelectorAll('#project-list .project-cover')];
            this.setCoverSize(aCoverNode);
        };
    },
    updated(){
        // 新封面图加载完成后调整大小
        if(this.bAddedProject){
            this.bAddedProject = false;
            let oCoverNode = oProjects.querySelector('#project-list').lastChild.querySelector('img');
            oCoverNode.onload = ()=>{
                this.setCoverSize([oCoverNode]);
            };
        }
    },
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

#projects{
    top: $HEADER-HEIGHT;

    #project-list{
        margin-bottom: 40px;
        .projectCard{
            .project-cover{
                color: gray;
                display: block;
                width: 100%; margin: auto;
            }
            .noCover{
                min-height: 50px;
            }
            .project-name{
                color: $BASIC-RED;
                font-size: 18px;
                position: relative;
                top: 6px;
                display: inline-block;
                .rename{
                    color: $BASIC-RED;
                    font-size: 18px;
                    position: absolute; right: -24px; top: 0;
                }
            }
            .deleteBtn, .changeCover{
                float: right;
                color: $BASIC-RED;
                font-size: 24px;
                position: relative; top: 2px;
            }
            .changeCover{
                margin-right: 12px;
                position: relative;
                .changeCoverInput{
                    width: 100%; height: 100%;
                    position: absolute; top: 0; left: 0;
                    opacity: 0;
                }
            }
        }
    }

    #cardForAdd{
        min-height: 66px;
        position: fixed; left: 0; bottom: 0; width: 100%;
        padding: 16px; box-sizing: border-box;
        .closeBtn{
            position: absolute;
            top: 8px; right: 8px;
        }
        .newProjectName, .newProjectCover{
            display: block;
            width: 100%;
            border-top: none;
            border-right: none;
            border-left: none;
        }
        .newProjectName{
            height: 2em;
            margin-top: 14px;
        }
        p{
            font-size: 10px;
            text-align: left;
            color: gray;
            margin-top: 4px;
        }
        .newProjectCover{
            margin: 24px auto 0 auto;
            width: 120px;
            .selectImage{
                width: 100%; height: 100%;
                position: absolute; top: 0; left: 0;
                opacity: 0;
            }
        }
        #addProjectBtn{
            position: absolute; bottom: 10px;
            width: 80%; left: 10%;
        }
    }
    .expanding{
        height: 200px;
    }

    #waiting{
        width: 100%; height: 100%;
        position: fixed; top: 0; left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        img{
            display: block; width: 100px;
            position: absolute; top: 0; right: 0; bottom: 0; left: 0; margin: auto;
        }
    }
}


</style>
