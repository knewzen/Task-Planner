angular.module('taskPlanner')
  .component('taskList', {
    bindings : {
      taskList : '<',
      unsavedChanges : "<"
    },
    templateUrl : 'templates/components/tasklist/tasklist.component.html',
    controller : TaskListController,
    controllerAs : 'tl'
  })

function TaskListController(localStorageService){
  let $ctrl = this;

  $ctrl.$onInit = function(){
    $ctrl.editMode = false;
  }

  $ctrl.isTaskListSelected = function(){
    return Object.keys($ctrl.taskList).length !== 0
  }

  $ctrl.newTask = function(data){
    let highestId = 0;
    $ctrl.taskList.tasks.forEach((t)=>{
      if ( t.id > highestId) highestId = t.id;
    })
    let newTask = {
      id: highestId + 1,
      content: "New task",
      is_child: data.isChild,
      parent_id: data.parentId,
      status: 'pending'
    }
    $ctrl.taskList.tasks.push(newTask)
    $ctrl.unsavedChanges.state = true;
  }

  $ctrl.deleteTask = function(data){
    let index = $ctrl.taskList.tasks.indexOf(data.task)
    $ctrl.taskList.tasks.splice(index, 1);
    $ctrl.taskList.tasks.forEach((t)=>{
      if (t.parent_id === data.task.id){
        $ctrl.deleteTask({task :t})
      }
    });
    $ctrl.showDeleteConfirmModal = false;
    $ctrl.unsavedChanges.state = true;
  };
}
