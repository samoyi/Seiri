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
            <input class="newProjectName" v-show="bDisplayAddCard" placeholder="项目名称" require float v-model="newProject.newProjectName" />
            <p v-show="bDisplayAddCard">最多支持12个汉字及日文字符，或24个英文字符</p>
            <v-ons-button class="newProjectCover" modifier="cta" v-show="bDisplayAddCard">
                选择封面
                <input id="selectImage" @change="gotImage" type="file" />
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
        setCoverSize(aCover){ // 图片宽度如果100%会拉伸，就auto
            // 必须确保图片加载完，才能获得naturalWidth
            let nMaxWidth = window.innerWidth - 16 - 32;
            aCover.forEach(cover=>{
                console.log((cover.naturalWidth +'='+ nMaxWidth));
                if(cover.naturalWidth<nMaxWidth){
                    cover.style.width = 'auto';
                }
            })
        },
        gotImage(ev){
            let oFile = (ev.target.files)[0];
            document.querySelector('#selectImage').value = '';
            if( oFile.type!=="image/jpeg" && oFile.type!=="image/png" && oFile.type!=="image/webp" ) {
                alert('图片类型只能是jpg或png');
                return;
        	}

            // 创建FileReader实例
        	let reader = new FileReader();
            reader.addEventListener("load", imageLoadedHandler);
            reader.readAsDataURL(oFile);
        		// oImageFile = oFile,
        		// newImg = {};

        	// 图片load后的处理函数
        	function imageLoadedHandler(e){
        		let oPreview = document.createElement('img'),
                    sDataURL = '';

                oPreview.onload = function(){
                    // 根据图片大小按照不同比例进行压缩
                    console.log(oFile.size);
                    let quality = oFile.size>104857.6 ? 0.92/(oFile.size/104857.6) : 0.92;
                    sDataURL = compress(oPreview, oFile.type, quality);
                    console.log(sDataURL);
            		// if( oImageFile.size>5.24288 ){
            		// 	var quality = 100/(oImageFile.size/524288);
            		// 	newImg = compress(oPreview, quality);
            		// }
            		// else{
            		// 	newImg.src = e.target.result;
            		// }
                };
                oPreview.src = e.target.result;
        	}

            function compress(source_img_node, output_format, quality=0.92){
            	 let cvs = document.createElement('canvas');
            	 //naturalWidth真实图片的宽度
            	 cvs.width = source_img_node.naturalWidth;
            	 cvs.height = source_img_node.naturalHeight;
            	 let ctx = cvs.getContext("2d").drawImage(source_img_node, 0, 0);
                 console.log(output_format, quality);
            	 return cvs.toDataURL(output_format, quality);
            }

        },
    },
    mounted(){
        window.onload = ()=>{
            let aCover = [...document.querySelectorAll('#project-list .project-cover')];
            this.setCoverSize(aCover);
        };
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
            #selectImage{
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
}


</style>
