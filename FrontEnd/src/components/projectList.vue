<template>
    <v-ons-page id="projects">
        <v-ons-card class="projectCard" v-for="(project,index) in projects" :key="project.img">
            <img :src="project.img" alt="Seiri" style="width: 100%">
            <div class="name" @click="changeName(index)">{{project.name}}</div>
            <v-ons-icon class="deleteBtn" icon="fa-trash-o" @click="deleteProject(index)"></v-ons-icon>
            <div class="content">
            </div>
        </v-ons-card>
    </v-ons-page>
</template>

<script>
export default {
    data () {
        return {
            projects: [
                {
                    img: './upload/images/projectCover/0.png',
                    name: 'Awesome'
                },
                {
                    img: './upload/images/projectCover/1.png',
                    name: 'framework'
                },
                {
                    img: './upload/images/projectCover/2.jpg',
                    name: 'calm'
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
            let sNewName = prompt('输入新的项目名称：');
            if(sNewName && sNewName.trim()){
                let bInvalid = this.projects.some((project, __index)=>{
                    if(project.name === sNewName){
                        if(index===__index){
                            return true;
                        }
                        else{
                            alert('和其他项目重名');
                            return true;
                        }
                    }
                });
                if( !bInvalid ){
                    this.projects[index].name = sNewName;
                }
            }
        },
    }
}
</script>

<style scoped lang="scss">
@import "../scss/common.scss";

#projects{
    top: $HEADER-HEIGHT;

    .deleteBtn{
        float: right;
        color: $BASIC-RED;
        font-size: 24px;
        position: relative; top: -16px;
    }
}


</style>
