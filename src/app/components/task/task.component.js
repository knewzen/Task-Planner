angular.module('taskPlanner')
  .component('task', {
    bindings: {
      tasks : "<",
      task : "<",
      editMode: '<',
      onAddTask: '&',
      onDeleteTask:"&",
      unsavedChanges: "<"
    },
    templateUrl : 'templates/components/task/task.component.html',
    controller : TaskController,
    controllerAs : '$ctrl'
  })

function TaskController(){
  let $ctrl = this;
  $ctrl.tasks = [];
  $ctrl.showDeleteConfirmModal;


  $ctrl.$onInit = function(){
    $ctrl.showDeleteConfirmModal = false;
  };

  $ctrl.getStatus = function(){
    switch ($ctrl.task.status){
      case 'pending':
        return ;
      case 'started':
        return "is-warning";
      case 'done':
        return "is-success";
      case 'problem':
        return "is-danger";
    }
  }

  $ctrl.setStatus = function(status){
    $ctrl.task.status = status;
    $ctrl.showStatusSettings = false;
    $ctrl.unsavedChanges.state = true;
  }

  $ctrl.addTask= function(isChild, parentId){
    let data = {
      isChild: isChild,
      parentId: parentId
    }
    $ctrl.onAddTask({data: data})
    $ctrl.unsavedChanges = true;
  };

  $ctrl.deleteTask = function(){
    $ctrl.showDeleteConfirmModal = true;
  };

  $ctrl.deleteConfirm = function(task){
    let data = {
      task : task
    }
    $ctrl.onDeleteTask({data: data})
    $ctrl.unsavedChanges = true;
  };

  //upstream data for new task creation/deletion up the nested tasks tree
  $ctrl.upstreamNewTask = function(data){
    $ctrl.onAddTask({data: data})
  };

  $ctrl.upstreamDeleteTask = function(data){
    $ctrl.onDeleteTask({data: data})
  };
};
