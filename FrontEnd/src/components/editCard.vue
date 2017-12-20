<!--
# 通用的编辑框组件
## 该组件功能：
    * 编辑名称
    * 编辑描述
    * 编辑图片
    * 通过slot插入其他编辑项

## 两种初始模式
* bBtnDisplay为true时，编辑按钮显示，点击后bDisplay变为true，出现编辑框，编辑按钮变成提
                      交按钮
* bBtnDisplay为false时，什么都不显示，bDisplay变为true时，出现编辑框

## 自定义值：
* 通过namePlaceholder和newName可以给名称编辑框设定placeholder和初始value，如果都不指
  定，编辑框不显示。
* 通过desPlaceholder和newDes可以给名称编辑框设定placeholder和初始value，如果都不指定，
  编辑框不显示。
* maxNameLength和maxDesLength约束最长字数。
  以英文字母长度计。1个汉字长度等于2个英文字母长度。如果为0或不传，则不限制。
* 通过tip设定一段说明文字
* 通过imageMIMEType限定上传图片的MIMEType
* 通过imageMaxBtype限定上传图片的最大Byte数
* updateTip设定上传图片按钮的文字
* initButtonText为编辑框未出现时按钮的文字，submitButtonText为编辑框出现后的按钮文字

 -->
<template>
    <v-ons-bottom-toolbar v-show="bBtnDisplay || bDisplay"
            id="editCard" :class="{expanding: bDisplay}">
        <v-ons-icon class="closeBtn" v-show="bDisplay"
                icon="fa-times" @click="closeCard">
        </v-ons-icon>
        <input class="newName" v-show="bDisplay && (namePlaceholder || curName)"
                :placeholder="namePlaceholder" require float
                v-model.trim="newData.name" />
        <input class="newDes" v-show="bDisplay && (desPlaceholder || curDes)"
                :placeholder="desPlaceholder" require float
                v-model.trim="newData.des" />
        <p v-show="bDisplay" v-html="tip"></p>
        <slot v-show="bDisplay"></slot>
        <v-ons-button class="newImage" modifier="cta" v-show="bDisplay">
            {{updateTip}}
            <input class="selectImage" @change="handleImageUpload" type="file" />
        </v-ons-button>
        <v-ons-button id="submit" v-show="bBtnDisplay || bDisplay"
                modifier="large"
                @click="submit">{{bDisplay?submitButtonText:initButtonText}}
        </v-ons-button>
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
        bBtnDisplay: {
            type: Boolean,
            default: false,
        },
        curCata: String,
        curName: String,
        namePlaceholder: String,
        maxNameLength: {
            type: Number,
            default: 0,
        },
        curDes: String,
        desPlaceholder: String,
        maxDesLength: {
            type: Number,
            default: 0,
        },
        tip: String,
        imageMIMEType: Array,
        imageMaxBtype: Number,
        updateTip: String,
        initButtonText: String,
        submitButtonText: String,
    },
    data () {
        return {
            newData: {
                cata: '',
                name: '',
                des: '',
                img: '',
            },
            selectedImage: null, // 上传项目封面时，表单选择的图片
            compressedCover: null, // 表单选择的图片经过压缩之后的blob对象
        };
    },
    methods:{
        closeCard(){
            this.$emit('ec-closeCard');
        },
        submit(){
            if(this.bDisplay){
                if( this.maxNameLength
                    &&
                    !isValidLength(this.newData.name, this.maxNameLength)
                ){
                    alert('“' +this.newData.name+ '”' + ' 长度超出限制');
                    return;
                }
                if( this.maxDesLength
                    &&
                    !isValidLength(this.newData.des, this.maxDesLength)
                ){
                    alert('“' +this.newData.des+ '”' + ' 长度超出限制');
                    return;
                }
                this.$emit('ec-submit', this.newData);
                // 提交后清空图片数据，以免下一次修改时如果没有上传图片，还会继续使用这
                // 次的图片
                this.newData.img = '';
            }
            else{
                this.$emit('ec-display');
            }
        },
        // 如果上传了图片且图片宽度如果设置为100%会拉伸，就设置为auto
        setCoverSize(aCoverNode){
            // 必须确保图片加载完，才能获得naturalWidth
            let nMaxWidth = window.innerWidth - 16 - 32;

            aCoverNode.forEach(cover=>{
                if(cover.naturalWidth && cover.naturalWidth<nMaxWidth){
                    cover.style.width = 'auto';
                }
            })
        },
        handleImageUpload(ev){
            let oUploadedImage = (ev.target.files)[0];
            if(oUploadedImage){ // 如果为false则是用户取消了上传
                this.handleImage(oUploadedImage, blob=>{
                    this.newData.img = URL.createObjectURL(blob);
                });
            }
        },
        handleImage(oUploadedImage, callback){ // 处理上传的图片
            this.bWaiting = true;
            imageCompress( oUploadedImage, this.imageMIMEType,
                            this.imageMaxBtype, res=>{
                let nErrCode = res.errCode;
                if(nErrCode===1){
                    alert('图片只支持以下格式：' + this.imageMIMEType.map(type=>{
                            let ext = type.slice(6);
                            return ext==='jpeg'?'jpg':ext;
                        })
                    );
                    return;
                }
                else if(nErrCode===2){
                    alert('图片大小不能超过' +this.imageMaxBtype/1024/1024+ 'MB');
                    return;
                }
                else{
                    this.compressedCover = res.blob;
                    callback(res.blob);
                }
                this.bWaiting = false;
            });
        },
    },
    watch: {
        curName(sName){
            this.newData.name = sName;
        },
        curDes(sDes){
            this.newData.des = sDes;
        },
    },
    mounted(){

    },
    updated(){
        // console.log(this.curName);
    },
}

// 检测字符串长度。一个Ascii字符为一个长度，其他字符算作两个长度
function isValidLength(sName, nMax){
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
            margin-top: 8px;
        }
        p{
            font-size: 10px;
            text-align: left;
            color: gray;
            margin-top: 4px;
        }
        .newImage{
            width: 120px;
            position: absolute;
            right: 0; bottom: 70px; left: 0; margin: auto;
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
        height: $EDIT-CARD-HEIGHT;
    }


</style>
