<template>
    <div id="app">
        <ons-toolbar id="header">
            <div class="center">断·舍·离</div>
        </ons-toolbar>
        <router-view
                :all-projects="allProjects"
                :cur-catas="curCatas===-1?[]:allProjects[curCatas].catas">
        </router-view>
    </div>
</template>


<script>

// import projectList from './components/projectList.vue';

export default {
    name: 'app',
    // components: {
    //     projectCard: projectList,
    // },
    data () {
        return {
            curCatas: -1,
            allProjects: [ // 当前的项目列表
                {
                    img: '',
                    name: '第三个项目',
                    id: 0,
                    catas: {},
                },
                {
                    img: './upload/images/projectCover/0.png',
                    name: '立春雨水惊蛰春分清明谷雨',
                    id: 1,
                    catas: {},
                },
                {
                    img: './upload/images/projectCover/1.png',
                    name: 'aaaaaaaaaaaaaaaaaaaaaaaa',
                    id: 2,
                    catas: { // 当前的项目列表
                        'cata1': {
                            folded: true,
                            items: [
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第一个项目',
                                    des: '描述0',
                                    id: '0'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '立春雨水惊蛰春分清明谷雨',
                                    des: '描述1',
                                    id: '1'
                                },
                                {
                                    img: './upload/images/projectCover/1.png',
                                    name: 'aaaaaaaaaaaaaaaaaaaaaaaa',
                                    des: '描述2',
                                    id: '2'
                                },
                            ]
                        },
                        'cata2': {
                            folded: true,
                            items: [
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述999',
                                    id: '4'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '5'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '定位测试',
                                    des: '描述0',
                                    id: '6'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '123435123435',
                                    des: '描述0',
                                    id: '7'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '8'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '9'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '10'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '11'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '12'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '31415',
                                    des: '描述0',
                                    id: '13'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '14'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '666',
                                    des: '描述0',
                                    id: '15'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '16'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '第二个项目',
                                    des: '描述0',
                                    id: '17'
                                },
                                {
                                    img: './upload/images/projectCover/0.png',
                                    name: '123435123435',
                                    des: '描述0',
                                    id: '18'
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
                                    id: '19'
                                },
                                {
                                    img: './upload/images/projectCover/2.jpg',
                                    name: 'はははははははははははは',
                                    des: '描述3',
                                    id: '20'
                                },
                            ]
                        },
                    },
                },
                {
                    img: './upload/images/projectCover/2.jpg',
                    name: 'はははははははははははは',
                    id: 3,
                    catas: {},
                },
            ],
        };
    }
}
</script>

<style lang="scss">
@import "./scss/common.scss";

#header{
    height: $HEADER-HEIGHT;
    .center{
        line-height: $HEADER-HEIGHT;
        font-size: 30px;
        font-family: "FangSong";
        color: $BASIC-RED;
        text-align: center;
    }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
