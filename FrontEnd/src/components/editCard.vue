
<template>
    <v-ons-bottom-toolbar v-show="bDisplay" id="editCard" :class="{expanding: bDisplay}">
        <v-ons-icon class="closeBtn" icon="fa-times" @click="closeCard"></v-ons-icon>
        <input class="newName" v-show="namePlaceholder || newName" :placeholder="namePlaceholder" require float v-model="newData.name" />
        <input class="newDes" v-show="desPlaceholder || newDes" :placeholder="desPlaceholder" require float v-model="newData.des" />
        <p>{{tip}}</p>
        <slot></slot>
        <v-ons-button class="newImage" modifier="cta" v-show="bDisplay">
            {{updateTip}}
            <input class="selectImage" @change="handleNewCover" type="file" />
        </v-ons-button>
        <v-ons-button id="submit" modifier="large" @click="submit">{{bDisplay?initButtonText:submitButtonText}}</v-ons-button>
    </v-ons-bottom-toolbar>
</template>

<script>

// import MB from '../js/MultiByte.js';
import MyUtil from '../js/MyUtil.js';
import imageCompress from '../js/frontEndImageCompress.js';


export default {
    props: {
        bDisplay: {
            type: Boolean,
            default: false,
        },
        newName: String,
        namePlaceholder: String,
        newDes: String,
        desPlaceholder: String,
        tip: String,
        updateTip: String,
        initButtonText: String,
        submitButtonText: String,
    },
    data () {
        return {
            newData: {
                name: this.newName,
                des: this.newDes,
            },
            selectedImage: null, // 上传项目封面时，表单选择的图片
            compressedCover: null, // 表单选择的图片经过压缩之后的blob对象
        };
    },
    methods:{
        closeCard(){
            this.$emit('closeCard');
        },
        submit(){
            this.$emit('submit', this.newData);
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
        console.log('mounted: ' + this.newName, this.newDes);
        console.log('mounted: ' + this.newData.name, this.newData.des);
    },
    updated(){
        alert('this.newName更新的时候为什么this.newData.name不更新');
        console.log('updated: ' + this.newName, this.newDes);
        setTimeout(()=>{
            console.log('updated 2000: ' + this.newData.name, this.newData.des);
        }, 2000);
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

    #editCard{
        min-height: 66px;
        position: fixed; left: 0; bottom: 0; width: 100%;
        padding: 16px; box-sizing: border-box;
        .closeBtn{
            position: absolute;
            top: 8px; right: 8px;
        }
        .newName, .newDes, .newImage{
            display: block;
            width: 100%;
            border-top: none;
            border-right: none;
            border-left: none;
        }
        .newName, .newDes{
            height: 2em;
            margin-top: 14px;
        }
        p{
            font-size: 10px;
            text-align: left;
            color: gray;
            margin-top: 4px;
        }
        .newImage{
            margin: 24px auto 0 auto;
            width: 120px;
            .selectImage{
                width: 100%; height: 100%;
                position: absolute; top: 0; left: 0;
                opacity: 0;
            }
        }
        #submit{
            position: absolute; bottom: 10px;
            width: 80%; left: 10%;
        }
    }
    .expanding{
        height: 260px;
    }


</style>
