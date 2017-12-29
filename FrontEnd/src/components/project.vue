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
            <input type="text" class="search-input" placeholder="关键词搜索物品"
                     v-model.trim="searchWord" />
            <v-ons-icon class="cancelSearch" icon="fa-times-circle-o"
                     v-show="searchWord" @click="cancelSearch">
            </v-ons-icon>
            <input type="button" class="addCata" value="添加分类"
                    @click="addCata" />
        </v-ons-toolbar>
        <v-ons-list id="list">
            <ul class="catas-ul">
                <li class="cata-li" v-for="(cata,key) in catas" :key="key">
                    <v-ons-list-header>
                        <span class="cata-name">{{key}}</span>
                        <v-ons-icon v-show="cata.folded" class="caret-up"
                                icon="fa-caret-up" @click="unfold(key)">
                        </v-ons-icon>
                        <v-ons-icon v-show="!cata.folded" class="caret-down"
                                icon="fa-caret-down" @click="fold(key)">
                        </v-ons-icon>
                        <v-ons-icon class="rename" icon="fa-pencil"
                                @click="changeName(key)">
                        </v-ons-icon>
                        <v-ons-icon class="addItem" icon="fa-plus"
                                @click="addItem(key)">
                        </v-ons-icon>
                        <v-ons-icon class="deleteBtn" icon="fa-trash-o"
                                @click="deleteProject(key)">
                        </v-ons-icon>
                    </v-ons-list-header>
                    <div :class="{folded: cata.folded}">
                        <v-ons-list-item v-for="(item, index) in cata.items"
                                :key="item.name">
                            <div class="left">
                                <img class="list-item__thumbnail"
                                        v-show="item.img" :src="item.img"
                                        @click="showLargeImage(item.img)"
                                        alt="item.name">
                            </div>
                            <div class="center">
                                <span class="list-item__title">
                                    {{item.name}}
                                </span>
                                <span class="list-item__subtitle">
                                    {{item.des}}
                                </span>
                            </div>
                            <v-ons-icon class="edit-item"
                                    icon="fa-pencil-square-o"
                                    @click="editItem(key, index)">
                            </v-ons-icon>
                            <v-ons-icon class="delete-item" icon="fa-trash-o"
                                    @click="deleteItem(key, index, $ons.notification.confirm('删除 ' + item.name + ' ？'))"
                                    >
                            </v-ons-icon>
                        </v-ons-list-item>
                    </div>
                </li>
            </ul>
            <div class="mat" v-show="oEditCardProp.bDisplay"></div>
        </v-ons-list>
        <edit-card
            v-bind="oEditCardProp"
            v-on:ec-closeCard="closeCard"
            v-on:ec-submit="submitEdit"
            v-on:ec-display="displayEditCard">
            <select v-model="newCata">
                <option v-for="(cata, key) in catas"
                        :selected="key===currentCata" :value="key">
                    {{key}}
                </option>
            </select>
        </edit-card>
        <div id="largeImageFrame" v-show="bDisplayLargeImage"
                @click="hideLargeImage">
            <img id="largeImage" src="" alt="断·舍·离" />
        </div>

        <!-- 搜索结果 -->
        <div v-show="searchWord" id="searchResultWrapper">
            <v-ons-list id="searchResult" v-show="bDisplaySearchResult"
                    modifier="inset">
                <v-ons-list-header>“{{searchWord}}” 的搜索结果</v-ons-list-header>
                <v-ons-list-item modifier="longdivider"
                        @click="selectInSearch(aSearchResult[1][index][0],
                                    aSearchResult[1][index][1])"
                        v-for="(item,index) in aSearchResult[0]">
                    {{item.name}}
                    <br />{{item.des}}

                </v-ons-list-item>
            </v-ons-list>
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


 // mouted之后，选择节点
let oLargeImage = null,
    oList = null;

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
            searchWord: '',
            aSearchResult: [],
            bDisplaySearchResult: false,

            catas: { // 当前的项目列表
                'cata1': {
                    folded: true,
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
                    folded: false,
                    items: [
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '31415',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '定位测试',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '第二个项目',
                            des: '描述0',
                        },
                        {
                            img: './upload/images/projectCover/0.png',
                            name: '123435123435',
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
                    folded: false,
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
                bBtnDisplay: false,
                curName: '',
                namePlaceholder: '条目名称',
                maxNameLength: 16, // 16个文英字符的长度，等效于8个中文字符的长度
                curDes: '',
                desPlaceholder: '条目描述',
                maxDesLength: 32, // 32个英文字符长度，等效于16个中文字符的长度
                tip: '条目名称最多支持8个汉字及日文字符，或16个英文字符；<br />'
                    +'条目描述最多支持16个汉字及日文字符，或32个英文字符；<br />'
                    +'图片支持jpg、png和webp，最大不超过2BM',
                updateTip: '选择图片',
                imageMIMEType: ['image/jpeg', 'image/png', 'image/webp'],
                imageMaxBtype: 2*1024*1024,
                initButtonText: '修改',
                submitButtonText: '提交修改',
            },
            currentCata: null, // 条目当前类别。用于修改类别
            indexInCurrentCata: null, // 条目在当前类别中的index。用于移动类别时删除原条目
            currentImg: null,  // 条目当前类别。用于修改类别时没有更新图片的情况
            newCata: null, // editCard中条目修改后的类别。 和编辑框的选择类别双绑

            // 等待动画是否出现
            bWaiting: false,

            bDisplayLargeImage: false,
        };
    },
    methods:{
        addCata(){
            let sNewName = prompt('输入新的类别名称：'
                                + '\n最多支持12个汉字及日文字符，或24个英文字符');
            if(sNewName && sNewName.trim()){
               let nResult = this.checkCataName(sNewName);

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
            let sNewName = prompt('输入新的分类名称：'
                                + '\n最多支持12个汉字及日文字符，或24个英文字符');
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
            this.indexInCurrentCata = index;
            this.currentImg = item.img;
            this.newCata = key;
            this.oEditCardProp.curName = item.name;
            this.oEditCardProp.curDes = item.des;
            this.oEditCardProp.bDisplay = true;
        },
        deleteItem(key, index, promise){
            let items = this.catas[key].items;
            promise.then((result)=>{
                if(result===1){
                    items.splice(index, 1);
                }
            });
        },
        addItem(key){
            this.currentCata = key;
            // 以下四项，和editItem相比，因为是添加项，所以应该使用默认的空值
            this.indexInCurrentCata = null;
            this.currentImg = null;
            this.oEditCardProp.curName = '';
            this.oEditCardProp.curDes = '';
            this.newCata = key;
            this.oEditCardProp.bDisplay = true;
        },
        submitEdit(newData){ // 编辑条目和添加条目，分两种情况
            // 两个维度四个情况
            // 改类别改名      检查重名       在新类别中检查
            // 改类别没改名    检查重名       在新类别中检查
            // 没改类别改名    检查重名       当前类别中检查
            // 没改类别没改名  不能检查重名
            if(this.currentCata!==this.newCata){ // 改类别

                // 在新类别中检查重名
                let bDuplicate = this.catas[this.newCata].items.some(val=>{
                    return val.name === newData.name;
                });
                if(bDuplicate){
                    alert(this.newCata + ' 类别中已存在名为 '
                        + newData.name + ' 条目');
                    return;
                }

                // 新类中加上该项目
                this.catas[this.newCata].items.push({
                    img: newData.img || this.currentImg,
                    name: newData.name,
                    des: newData.des,
                });

                // 旧类中移除该项
                if(this.indexInCurrentCata!==null){ // 编辑，而非新加
                    this.catas[this.currentCata].items.
                    splice(this.indexInCurrentCata, 1);
                }

                this.oEditCardProp.bDisplay = false;

            }
            else if(newData.name!==this.oEditCardProp.curName){ // 没改类别改名了
                // 当前类别中检查重名
                let bDuplicate = this.catas[this.currentCata].items.some(val=>{
                    return val.name === newData.name;
                });
                if(bDuplicate){
                    alert('当前类别中已存在名为 ' + newData.name + ' 条目');
                    return;
                }

                if(this.indexInCurrentCata){  // 编辑，而非新加
                    let item = this.catas[this.currentCata].
                    items[this.indexInCurrentCata];

                    item.name = newData.name;
                    item.des = newData.des;
                    newData.img && (item.img=newData.img);
                }
                else{
                    this.catas[this.currentCata].items.push({
                        img: newData.img,
                        name: newData.name,
                        des: newData.des,
                    });
                }

                this.oEditCardProp.bDisplay = false;
            }
            else{ // 没改类别没改名  这种情况只能是编辑，不会是新加
                let item = this.catas[this.currentCata].
                                items[this.indexInCurrentCata];
                item.name = this.oEditCardProp.curName;
                item.des = newData.des;
                newData.img && (item.img=newData.img);

                this.oEditCardProp.bDisplay = false;
            }
        },
        displayEditCard(){
            this.oEditCardProp.bDisplay = true;
        },
        closeCard(){
            this.oEditCardProp.bDisplay = false;
        },
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
        // 点击某个搜索结果
        selectInSearch(sCata, nIndex){
            // 只展开结果所在的分类，然后把列表滚动到所选项靠近顶部
            // 如果结果条目太靠下以至于滚动到头也不能到最上面，那就只能滚动到头
            // 一个cata折叠起来总高度是45，一个item总高度50
            // 计算滚动距离是，需要知道第几个cata被展开了，以及item位于其中位置
            // 以下两个变量用来计算第几个类别被展开了
            // 因为是遍历对象，顺序并不一定是数据中的顺序。所幸只要保证这里遍历的顺序和
            // 渲染时遍历的顺序相同即可。
            // FIXME 虽然正常情况下，两个遍历的顺序是相同，但还是感觉不保险
            let nForInIndex = 0,
                nUnfoldIndex = 0;

            const CATA_HEIGHT = 45;
            const ITEM_HEIGHT = 50;

            for(let cata in this.catas){
                if(cata !== sCata){
                    this.catas[cata].folded = true;
                }
                else{
                    this.catas[cata].folded = false;

                    nUnfoldIndex = nForInIndex;
                }
                nForInIndex++;
            }

            this.$nextTick(()=>{ // 测试中似乎是要等到折叠和展开的渲染结束
                oList.parentNode.scrollTop = CATA_HEIGHT*nUnfoldIndex
                + nIndex*ITEM_HEIGHT + 100;
            });

            this.searchWord = '';
        },
        cancelSearch(){
            this.searchWord = '';
        },
    },
    watch: {
        searchWord(keyword){
            if(keyword){
                let oCata = this.catas,
                    aFilter = [],
                    aMatch = [],
                    aIndex = []; // 用来确定搜索到的项目的位置

                for(let cata in oCata){
                    aFilter = oCata[cata].items.filter((item, index)=>{
                        if(item.name.includes(keyword)
                            || item.des.includes(keyword)){
                            aIndex.push([cata, index]);
                            return true;
                        }
                        return false;
                    });
                    aMatch = aMatch.concat(aFilter);
                }
                this.bDisplaySearchResult = true;
                this.aSearchResult = [aMatch, aIndex];
            }
        },
    },
    mounted(){
        oLargeImage = document.querySelector('#largeImage');
        oList =  document.querySelector('#list');
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

ons-page{
    top: $HEADER-HEIGHT;

    ons-toolbar{
        .search-input{
            @include absVerCenter;
            width: 14em; height: 28px;
            left: 14px;
        }
        .cancelSearch{
            position: absolute;
            top: 20px;
            left: 194px;
        }
        .addCata{
            height: 28px;
            line-height: 28px;
            width: 6em;
            @include absVerCenter;
            right: 14px;
            padding: 0;
            background-color: #0076ff;
            border: 0 solid currentColor;
            border-radius: 3px;
            transition: none;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
                        0 1px 5px 0 rgba(0, 0, 0, .12),
                        0 3px 1px -2px rgba(0, 0, 0, .2);
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
                    height: 25px; line-height: 25px;
                    font-size: 16px;
                    color: $BASIC-RED;
                    background-color: #ccc;
                    .cata-name{
                        font-size: 18px;
                        height: 15px;
                        position: relative;
                        top: -6px;
                        left: 6px;
                    }
                    .addItem{
                        @include absCenter;
                        text-align: center;
                        line-height: 28px;
                        width: 18px;
                        height: 100%;
                    }
                    .caret-up, .caret-down{
                        @include absVerCenter;
                        right: 60px;
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
                    .rename, .deleteBtn{
                        font-size: 18px;
                        height: 15px;
                        position: relative;
                        top: -6px;
                    }
                    .rename{
                        left: 8px;
                    }
                    .deleteBtn{
                        right: 8px;
                        float: right;
                    }
                }
                >div{
                    overflow: hidden;
                    ons-list-item{
                        margin-bottom: 6px;
                        .left{
                            width: 40px; height: 44px;
                        }
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
                            right: 48px;
                        }
                        .delete-item{
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
        .mat{
            height: $EDIT-CARD-HEIGHT;
        }
    }

    .bottom-bar{
        select{
            margin-top: 12px;
        }
    }

    #largeImageFrame{
        width: 100%; height: 100%;
        position: fixed; top: 0; left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        #largeImage{
            display: block;
            @include absCenter;
            max-width: 80%; max-height: 80%;
        }
    }

    #searchResultWrapper{
        width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        @include fixedCenter;
        overflow-y: scroll;

        #searchResult{
            width: 80%; left: 10%;
            position: absolute; top: 25%;
            background-color: white;
            margin-bottom: 10%;
            ons-list-header{
                text-align: center;
            }
        }
    }
    #searchResultWrapper::-webkit-scrollbar {
      width: 5px;
      height: 8px;
      background-color: #d2eef5;
    }
    #searchResultWrapper::-webkit-scrollbar-thumb {
        background: $BASIC-RED;
    }

}


</style>
