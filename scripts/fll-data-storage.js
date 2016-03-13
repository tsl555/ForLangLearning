angular.module("fllDataStorageModule", [])
    .service("fllDataStorage", function($http) {
        var apiKey = "pvaf8K0hychibPXzHw-m_hKnHk-_jmIS";

        function buildUrl(collectionName, q, elementId) {
            var url = "https://api.mongolab.com/api/1/databases/for_lang_learning/collections/";
            url += collectionName;
            if (elementId)
                url += '/' + elementId;
            url += "?apiKey=" + apiKey;
            if (q)
                url += "&q=" + JSON.stringify(q);
            return url;
        }

        function buildNewUser(name, pswHash) {
            return {
                name: name,
                pswHash: pswHash
            }
        }

        return {
            getAllUsers: function () {
                return new Promise(function(onSuccess, onFail) {
                    var url = buildUrl("users");
                    $http.get(url)
                        .then(
                            function(response) {
                                var users = response.data.map(function(u) { return { id: u.id, name: u.name } });
                                onSuccess(users);
                            },
                            function(response) {
                                onFail(response);
                            });
                });
            },

            getUserByLoginAndPassword: function (login, userPsw) {
                return new Promise(function (onSuccess, onFail) {
                    var q = {
                        name: login,
                        pswHash: userPsw
                    };
                    var url = buildUrl("users", q);
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
                    var url = buildUrl("users", { _id: { $oid: userKey } });
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
                    var url = buildUrl("words", q);
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
            },

            createUser: function (login, password) {
                return new Promise(function(onSuccess, onFail) {
                    var url = buildUrl("users");
                    $http.post(url, buildNewUser(login, password))
                        .then(
                            function (response) {
                                if (response && response.data && response.data.length > 0)
                                    onSuccess(response.data[0]);
                                else
                                    onSuccess(null);
                            },
                            function(response) {
                                onFail();
                            }
                        );
                });
            },

            updateUser: function(user) {
                return new Promise(function (onSuccess, onFail) {
                    var url = buildUrl("users", null, user._id.$oid);
                    $http({
                            method: 'PUT',
                            url: url,
                            data: user
                        })
                        .then(
                            function (response) {
                                if (response && response.data && response.data.length > 0)
                                    onSuccess(response.data[0]);
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