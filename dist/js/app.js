'use strict';

angular.module('taskPlanner', ['LocalStorageModule', 'ngAnimate']);


angular.module('taskPlanner')
  .component('mainComponent', {
    templateUrl : 'templates/components/main/main.component.html',
    controller : MainController,
    controllerAs : 'main'
  })

function MainController(localStorageService, $timeout){
  let $ctrl = this;

  $ctrl.taskLists = [];
  $ctrl.taskList = {};
  $ctrl.showDeleteConfirmModal;
  $ctrl.unsavedChanges = {};

  $ctrl.$onInit = function(){
    if (localStorageService.get('taskLists') !== null)
      $ctrl.taskLists = localStorageService.get('taskLists');
    $ctrl.showDeleteConfirmModal = false;
  };

  $ctrl.selectTaskList = function(tasklist){
    let index = $ctrl.taskLists.indexOf(tasklist);
    $ctrl.taskList = $ctrl.taskLists[index];
    $ctrl.unsavedChanges = {state: false};
  };

  $ctrl.isTaskListSelected = function(){
    return Object.keys($ctrl.taskList).length !== 0
  };

  $ctrl.save = function(){
    localStorageService.set('taskLists', $ctrl.taskLists);
    $ctrl.unsavedChanges.state = false;
    $ctrl.changesSaved = true;
    $timeout(()=>{
      $ctrl.changesSaved = false;
    }, 3000)
  };

  $ctrl.newProject = function(){
    $ctrl.taskLists.push({
      title: "New Project",
      tasks: []
    });
    $ctrl.taskList = $ctrl.taskLists[$ctrl.taskLists.length-1]
  };

  $ctrl.deleteProject = function(){
    $ctrl.showDeleteConfirmModal = true;
  };

  $ctrl.deleteConfirm = function(){
    let index = $ctrl.taskLists.indexOf($ctrl.taskList)
    $ctrl.taskLists.splice(index, 1);
    localStorageService.set('taskLists', $ctrl.taskLists)
    $ctrl.taskList = {};
    $ctrl.showDeleteConfirmModal = false;
  };

  $ctrl.checkUnsavedChanges = function(){
    if ($ctrl.unsavedChanges.state === true) $ctrl.showUnsavedChangesModal = true;
    else $ctrl.newProject();
  };
};


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
