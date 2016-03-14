angular.module("loginModule", ["fllDataStorageModule"])
    .controller("loginCtrl", loginController)
    .controller("createUserCtrl", createUserController)
    .service("userKeyHolder", userKeyHolder)
    .service("pageRedirector", pageRedirector);

function loginController($scope, $location, userKeyHolder, fllDataStorage) {
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

    $scope.loginUser = function(login, password) {
        fllDataStorage.getUserByLoginAndPassword(login, password)
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
        userKeyHolder.setUserKey(userKey);
        $location.url("/lessons");
        $scope.$digest();
    }
}

function createUserController($scope, fllDataStorage, pageRedirector) {
    $scope.createUser = function (login, password, confirmPassword) {
        function loginHasValidFormat(login) {
            return /^[A-z0-9-_]{1,32}$/.test(login);
        }

        function passwordHasValidFormat() {
            return /^[A-z0-9]{1,32}$/.test(login);
        }

        if (!login || login.length <= 0) {
            $scope.errorMessage = "Login is empty";
            return;
        }
        if (!loginHasValidFormat(login)) {
            $scope.errorMessage = "Incorrect login format";
            return;
        }
        if (!password || password.length <= 0) {
            $scope.errorMessage = "Password is empty";
            return;
        }
        if (!passwordHasValidFormat(password)) {
            $scope.errorMessage = "Incorrect login format";
            return;
        }
        if (confirmPassword !== password) {
            $scope.errorMessage = "Your password is not confirmed";
            return;
        }
        $scope.errorMessage = null;
        fllDataStorage.createUser(login, password)
            .then(
                function(user) {
                    pageRedirector.login();
                },
                function(response) {
                }
            );
    }
}

function userKeyHolder() {
    return {
        setUserKey: function(userKey) {
            /*var c = document.cookie.split("; ");
            for (i in c)
                document.cookie = /^[^=]+/.exec(c[i])[0] + "=;expires=" + new Date().toUTCString() + ";path=/";*/
            //document.cookie = "userKey=" + userKey;
            sessionStorage["userKey"] = userKey;
        },

        getUserKey: function() {
            /*var authKey = /userKey=([A-z0-9]+)/.exec(document.cookie);
            if (authKey && authKey.length >= 2)
                return authKey[1];
            return null;*/
            return sessionStorage["userKey"];
        }
    }
}

function pageRedirector($location) {
    return {
        _404: function() {
            $location.path('#/page-not-found');
        },

        login: function () {
            $location.path('#/login');
        },

        lessons: function () {
            $location.path('#/lessons');
        }
    };
}