<template>
    <v-ons-page id="projects">
        <div id="project-list">
            <v-ons-card class="projectCard" v-for="(project,index) in projects" :key="project.id">
                <img class="project-cover" :class="{noCover: !project.img}" :src="project.img" alt="点击图片图标添加项目封面">
                <div class="project-name">
                    {{project.name}}
                    <v-ons-icon class="rename" icon="fa-pencil" @click="changeName(index)"></v-ons-icon>
                </div>
                <v-ons-icon class="deleteBtn" icon="fa-trash-o" @click="deleteProject(index)"></v-ons-icon>
                <v-ons-icon class="changeCover" icon="fa-picture-o" @click="changeCover(index)"></v-ons-icon>
                <div class="content">
                </div>
            </v-ons-card>
        </div>
        <!-- <v-ons-card id="cardForAdd" :class="{expanding: bDisplayAddCard}">
            <v-ons-icon class="closeBtn" v-show="bDisplayAddCard" icon="fa-times" @click="closeAddProject"></v-ons-icon>
            <v-ons-button id="addProjectBtn" modifier="large" @click="addProject">添加项目</v-ons-button>
        </v-ons-card> -->
        <v-ons-bottom-toolbar id="cardForAdd" :class="{expanding: bDisplayAddCard}">
            <v-ons-icon class="closeBtn" v-show="bDisplayAddCard" icon="fa-times" @click="closeAddProject"></v-ons-icon>
            <!-- <p v-show="bDisplayAddCard">输入新的项目名称：最多支持12个汉字及日文字符，或24个英文字符</p> -->
            <input class="newProjectName" v-show="bDisplayAddCard" placeholder="项目名称。最多支持12个汉字及日文字符，或24个英文字符" require float v-model="newProject.newProjectName" />
            <v-ons-button class="newProjectCover" modifier="cta" style="margin: 6px 0" v-show="bDisplayAddCard">
                选择封面
                <input style="background-color: red" type="file" />
            </v-ons-button>
            <v-ons-button id="addProjectBtn" modifier="large" @click="addProject">{{bDisplayAddCard?'添加':'添加项目'}}</v-ons-button>
        </v-ons-bottom-toolbar>
    </v-ons-page>
</template>

<script>

import MB from '../js/MultiByte.js';
import MyUtil from '../js/MyUtil.js';

export default {
    data () {
        return {
            nNextID: 4,
            bDisplayAddCard: false,
            newProject: {
                newProjectName: '',
            },
            projects: [
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
            if(this.bDisplayAddCard){
                let sNewName = this.newProject.newProjectName;
                if(sNewName.trim()){
                    let nResult = this.checkProjectName(sNewName);
                    if(nResult===0){
                        this.projects.push({
                            img: '',
                            name: sNewName,
                            id: this.nNextID++
                        });
                        this.bDisplayAddCard = false;
                        this.newProject.newProjectName = '';
                        console.log(this.nNextID);
                    }
                    else if(nResult===2){
                        alert('项目名称过长');
                    }
                    else if(nResult===4){
                        alert('和其他项目重名');
                    }
                }
            }
            else{
                this.bDisplayAddCard = true;
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
        setCoverSize(){ // 图片宽度如果100%会拉伸，就auto
            let nMaxWidth = window.innerWidth - 16 - 32;
            let aCover = [...document.querySelectorAll('#project-list .project-cover')];
            aCover.forEach(cover=>{
                if(cover.naturalWidth<nMaxWidth){
                    cover.style.width = 'auto';
                }
            })
        },
    },
    mounted(){
        this.setCoverSize();
    },
    updated(){
        this.setCoverSize();
    },
}

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
        #addProjectBtn{
            position: absolute; bottom: 10px;
            width: 80%; left: 10%;
        }
    }
    .expanding{
        height: 300px;
    }
}


</style>
