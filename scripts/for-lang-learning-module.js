angular
    .module("ForLangLearning", ["ngRoute", "loginModule", "lessonsModule", "lessonModule"])
    .config(configRoutes)
    .controller("mainCtrl", mainCtrl);

function configRoutes($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'Templates/login.html'/*,
            controller: 'loginCtrl'*/
        })
        .when('/user/:userKey/lessons', {
            templateUrl: 'Templates/lessons.html'/*,
            controller: 'lessonsCtrl'*/
        })
        .when('/user/:userKey/lesson/:lessonId', {
            templateUrl: 'Templates/lesson.html'/*,
            controller: 'lessonCtrl'*/
        })
        .when('/createUser', {
            templateUrl: 'Templates/create-user.html'/*,
            controller: 'createUserCtrl'*/
        })
        .otherwise({ redirectTo: '/login' });;
}

function mainCtrl() {
    
}