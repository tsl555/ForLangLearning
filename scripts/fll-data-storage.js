angular.module("fllDataStorageModule", [])
    .service("fllDataStorage", function($http) {

        function buildUrl(collectionName, q) {
            var url = "https://api.mongolab.com/api/1/databases/for_lang_learning/collections/";
            url += collectionName;
            url += "?apiKey=pvaf8K0hychibPXzHw-m_hKnHk-_jmIS";
            if (q)
                url += "&q=" + q;
            return url;
        }

        return {

            getAllUsers: function () {
                return new Promise(function(onSuccess, onFail) {
                    var url = buildUrl("users");
                    $http.get(url)
                        .then(function (response) {
                            var users = response.data.map(function (u) { return { id: u.id, name: u.name } });
                            onSuccess(users);
                        },
                            function (response) {
                                onFail(response);
                            });
                });
            },

            getUserByUserIdAndPassword: function (userId, userPsw) {
                return new Promise(function(onSuccess, onFail) {
                    var url = buildUrl("users", "{$and:[{id:" + userId + "},{pswHash:'" + userPsw + "'}]}");
                    $http
                        .get(url)
                        .then(
                            function (response) {
                                if (!response || !response.data || response.data.length === 0)
                                    onSuccess(null);
                                else {
                                    onSuccess(response.data[0]._id.$oid);
                                }
                            },
                            function (response) {
                                onFail(response);
                            }
                        );
                });
            },

            getUserByKey: function (userKey) {
                return new Promise(function(onSuccess, onFail) {
                    var url = buildUrl("users", JSON.stringify({ _id: { $oid: userKey } }));
                    $http
                        .get(url)
                        .then(
                            function (response) {
                                if (response && response.data && response.data.length > 0)
                                    onSuccess(response.data[0]);
                                else
                                    onSuccess(null);
                            },
                            function (response) {
                                //alert(JSON.stringify(response));
                                onFail(response);
                            }
                        );
                });
            },

            getWords: function (culture, words) {
                return new Promise(function(onSuccess, onFail) {
                    var q = {
                        $and: [
                            { culture: culture },
                            { $or: words.map(function (w) { return { word: w }; }) }
                        ]
                    };
                    //var q = "{$or:[" + words.map((w) => { return "{word:'" + w + "'}"; }) + "]}";
                    //q = "{}";
                    var url = buildUrl("words", JSON.stringify(q));
                    $http
                        .get(url)
                        .then(
                            function (response) {
                                if (response && response.data)
                                    onSuccess(response.data);
                                else
                                    onSuccess(null);
                            },
                            function (response) {
                                onFail(response);
                            }
                        );
                });
            }
        }
    });