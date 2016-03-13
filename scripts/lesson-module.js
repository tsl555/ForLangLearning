angular
    .module("lessonModule", ["loginModule", "fllDataStorageModule"])
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

function lessonCtrl($scope, $routeParams, $location, userKeyHolder, fllDataStorage, pageRedirector) {
    var userKey = userKeyHolder.getUserKey();
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
                if (!$scope.lesson) {
                    pageRedirector._404();
                    return null;
                }
                if ($scope.lesson.words) {
                    return fllDataStorage.getWords($scope.lesson.culture, $scope.lesson.words);
                } else {
                    return [];
                }
            },
            function(response) {
            })
        .then(
            function (words) {
                //debugger;
                $scope.words = words;
                $scope.$digest();
            },
            function(response) {
            }
        );

    $scope.playWord = function(word) {
    }

    $scope.deattachWordFromLesson = function (word) {
        /*console.log(word);
        if (!window.confirm("Remove word '" + word + "' from lesson ?"))
            return;*/

        $scope.lesson.words = $scope.lesson.words.filter(w => w != word);
        $scope.words = $scope.words.filter(w => w.word != word);

        fllDataStorage.updateUser($scope.user)
            .then(
                function(user) {
                    $scope.user = user;
                    $scope.$digest();
                },
                function() {

                }
            );
    }

    $scope.isWordToolPanelVisible = function(forWord)
    {
        return $scope.hoveredWord == forWord;
    }

    $scope.onWordItemMouseEnter = function (word) {
        $scope.hoveredWord = word;
    }

    $scope.onWordItemMouseLeave = function () {
        $scope.hoveredWord = null;
    }

    $scope.onAddNewWordClick = function() {
        $scope.addNewWordSectionVisible = !$scope.addNewWordSectionVisible;
    }

    $scope.onAddNewWordButtonClick = function() {
        function showShortMessage(msg) {
            $scope.addNewWordMessage = msg;
            setTimeout(function() {
                $scope.addNewWordMessage = null;
                $scope.$digest();
            }, 1500);
        }

        var newWord = $scope.newWord;
        if (newWord && newWord.length <= 2)
            return;
        if ($scope.words.filter(w => w.word == newWord).length > 0) {
            showShortMessage("This word is included to this lesson");
            return;
        }
        fllDataStorage.getWords($scope.lesson.culture, [newWord])
            .then(
                function(words) {
                    if (words && words.length > 0) {
                        $scope.words.push(words[0]);
                        showShortMessage("The word is added");
                        $scope.newWord = null;
                        $scope.$digest();
                    } else {
                        showShortMessage("Unknown word");
                    }
                },
                function() {
                }
            )
            .then(
                function() {
                    if (!$scope.lesson.words)
                        $scope.lesson.words = [];
                    $scope.lesson.words.push(newWord);
                    return fllDataStorage.updateUser($scope.user);
                }
            );
    }

}