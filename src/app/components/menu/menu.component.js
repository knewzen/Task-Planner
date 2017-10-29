
angular.module('taskPlanner')
  .component('menuComponent', {
    bindings: {
      taskLists : "<",
      selectTaskList: "&",
      newProject: "&",
      deleteProject: "&"
    },
    templateUrl : 'templates/components/menu/menu.component.html',
    controller : MenuController,
    controllerAs : 'menu'
  })

function MenuController(){
  let $ctrl = this;
}
