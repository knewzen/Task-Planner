
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
