angular
    .module("lessonModule", ["fllDataStorageModule"])
    .filter("extractWord", () => extractWord)
    .filter("extractTranslation", () => extractTranslation)
    .controller("lessonCtrl", lessonCtrl);

function extractWord(wordItem) {
    return wordItem.word;
}

function extractTranslation(wordItem, culture, provider) {
    var lt = wordItem.translations.filter((x) => x.culture == culture);
    if (lt.length > 0) {
        var values = lt[0].values.filter((c) => !provider || c.provider == provider);
        if (values.length > 0) {
            return values[0].values.join(", ");
        }
    }
    return null;
}

function lessonCtrl($scope, $routeParams, fllDataStorage) {
    var userKey = $routeParams.userKey;
    var lessonId = $routeParams.lessonId;

    function getLessonById(user, lessonId) {
        if (user && user.lessons) {
            for (var i = 0; i < user.lessons.length; i++)
                if (user.lessons[i].id == lessonId)
                    return user.lessons[i];
        }
        return null;
    }

    fllDataStorage.getUserByKey(userKey)
        .then(
            function(user) {
                $scope.user = user;
                $scope.lesson = getLessonById(user, lessonId);
                return fllDataStorage.getWords($scope.lesson.culture, $scope.lesson.words)

            },
            function(response) {
            })
        .then(
            function(words) {
                $scope.words = words;
            },
            function(response) {
            }
        );
}