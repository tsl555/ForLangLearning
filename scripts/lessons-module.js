angular.module("lessonsModule", ["loginModule", "fllDataStorageModule"])
.controller("lessonsCtrl", lessonsCtrl);

function lessonsCtrl($scope, $location, userKeyHolder, fllDataStorage) {
    //debugger
    var userKey = userKeyHolder.getUserKey();
    fllDataStorage.getUserByKey(userKey)
    .then(
        function (user) {
            $scope.user = user;
            $scope.$digest();
        },
        function(response) {
            alert("Error");
        }
    );

    $scope.createLesson = function () {
        function getMaxLessonId(lessons) {
            var maxId = 0;
            if (lessons) {
                for (var i = 0; i < lessons.length; i++) {
                    if (lessons[i].id > maxId)
                        maxId = lessons[i].id;
                }
            }
            return maxId;
        }

        function buildNewLesson(id, name, culture) {
            return {
                id: id,
                name: name,
                culture: culture,
                createDate: new Date().toString()
            };
        }

        var maxId = getMaxLessonId($scope.user.lessons);

        var newLesson = buildNewLesson(maxId + 1, $scope.newLessonName, 'en');

        if (!$scope.user.lessons)
            $scope.user.lessons = new Array();
        $scope.user.lessons.push(newLesson);

        fllDataStorage.updateUser($scope.user)
            .then(
                function(user) {
                    if (user)
                        $scope.user = user;
                },
                function() {
                    
                }
            );
    }

    $scope.deleteLesson = function(lesson) {
        if (!confirm("Delete '" + lesson.name + "' ?"))
            return;
        $scope.user.lessons = $scope.user.lessons.filter((l) => l.id !== lesson.id);

        fllDataStorage.updateUser($scope.user)
            .then(
                function(user) {
                    if (user)
                        $scope.user = user;
                },
                function() {

                }
            );
    }
}