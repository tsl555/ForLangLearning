angular.module("lessonsModule", ["fllDataStorageModule"])
.controller("lessonsCtrl", lessonsCtrl);

function lessonsCtrl($scope, $location, $routeParams, fllDataStorage) {
    $scope.userKey = $routeParams.userKey;

    fllDataStorage.getUserByKey($scope.userKey)
    .then(
        function (user) {
            $scope.user = user;
            $scope.$digest();
        },
        function(response) {
            alert("Error");
        }
    );
}