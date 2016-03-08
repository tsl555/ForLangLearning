angular.module("loginModule", ["fllDataStorageModule"])
.controller("loginCtrl", loginController)
.controller("createUserCtrl", createUserController);

function loginController($scope, $location, fllDataStorage) {
    function receiveUsers() {
        fllDataStorage.getAllUsers()
        .then(
            function (users) {
                $scope.users = users;
                $scope.$digest();
            },
            function(response) {
                $scope.errorMessage = response;
            }
        );
    }

    receiveUsers();

    $scope.loginUser = function(userId, password) {
        fllDataStorage.getUserByUserIdAndPassword(userId, password)
        .then(
            function(userKey) {
                if (userKey) {
                    $scope.errorMessage = '';
                    onSuccessLogin(userKey);
                } else {
                    $scope.errorMessage = "Your login and password are incorrect";
                }
            },
            function(response) {
                $scope.errorMessage = response;
            }
        );
    }

    function onSuccessLogin(userKey) {
        $location.url("/user/" + userKey + "/lessons");
        $scope.$digest();
    }
}

function createUserController($scope, fllDataStorage) {
    $scope.createNewUser = function (login, password, confirmPassword) {
        if (!login || login.length <= 0) {
            $scope.errorMessage = "Login is empty";
            return;
        }
        if (!password || password.length <= 0) {
            $scope.errorMessage = "Password is empty";
            return;
        }
        if (confirmPassword !== password) {
            $scope.errorMessage = "Your password is not confirmed";
            return;
        }
        $scope.errorMessage = null;
        fllDataStorage.createNewUser(login, password);
    }
}