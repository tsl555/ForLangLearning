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
        .when('/lessons', {
            templateUrl: 'Templates/lessons.html'/*,
            controller: 'lessonsCtrl'*/
        })
        .when('/lesson/:lessonId', {
            templateUrl: 'Templates/lesson.html'/*,
            controller: 'lessonCtrl'*/
        })
        .when('/createUser', {
            templateUrl: 'Templates/create-user.html'/*,
            controller: 'createUserCtrl'*/
        })
        .when('/page-not-found', {
            templateUrl: 'Templates/page-not-found.html'/*,
            controller: 'createUserCtrl'*/
        })
        .otherwise({ redirectTo: '/page-not-found' });;
}

function mainCtrl() {
    
}