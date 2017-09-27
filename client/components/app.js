
var app = angular.module('myApp',['ngRoute'])

app.config([
    '$locationProvider',
    '$routeProvider',
    function config($locationProvider, $routeProvider) {
   $locationProvider.html5Mode({
        enabled:true,
        requireBase:false
      });
      $locationProvider.hashPrefix('');

    $routeProvider.when("/",{
      templateUrl:"../templates/app.html",
      controller:"sessionCheck"
    })
    .when("/signup",{
      templateUrl:"../templates/signup.html",
      controller:"signupPage"
    })
    .when("/loggedIn", {
      templateUrl:"../templates/loggedIn.html",
      controller:'list'
    })
    .otherwise({redirectTo:'/'})
}])
app.controller('list',function($scope,$http,$location) {
$scope.user = '';
$scope.todoList = [];
  $http({
    method:'GET',
    url:'/info'
  }).then(function successCallback(data) {
    console.log('Data --> ',data);
    if(data.data['__v'] > 1) {
    $scope.user = 'Welcome Back '+ data.data.username.toUpperCase();
    } else {
    $scope.user = 'Welcome '+ data.data.username.toUpperCase();
    }
    var element = data.data.todos;
    if (element) {
    element.forEach(function(item) {
      $scope.todoList.push({todoText:item, done:false});
    })
  }
  },function errorCallback(err) {
    console.log('error --- > ',err);
  });
  $scope.submit = function() {
    $scope.todoList.push({todoText:$scope.task, done:false});
    $scope.task = '';
  }

  $scope.logOut = function() {
    var submittingArr = []
    $scope.todoList.forEach(function(item) {
      submittingArr.push(item['todoText']);
    })
    $http.post('/loggedIn',submittingArr).then(
      function(response) {
        $location.path('/');
      }, function(err) {
        console.log('Error --> ',err)
      });
  };
   $scope.removeItem = function() {
    var oldlist = $scope.todoList;
    $scope.todoList = [];
    $scope.todoList = oldlist.filter(function(i) {
        return !i.done;
    })
    if($scope.todoList.length === 0) {
       $http.get('/send').then(
      function(response) {
        console.log('Message Sent')
      }, function(err) {
        console.log('Error --> ',err)
      });
    }
   }
})
app.controller('sessionCheck',function($scope,$http,$location) {
  $scope.signUp = function() {
    $location.path('/signup');
  }
})

app.controller('signupPage',function($scope,$http,$location) {
  $scope.goBack = function() {
    $location.path('/');
  }
})

