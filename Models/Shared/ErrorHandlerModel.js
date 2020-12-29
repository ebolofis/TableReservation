function ErrorHandler(comm) {
    var err = this;
    err.communication = comm;

    err.logError = function (errorType, message) {
        var error = {};
        error.type = errorType;
        error.message = message;
        err.communication.generalRequest({
            url: "/ErrorHandler/LogError",
            cache: false,
            crossdomain: false,
            type: "POST",
            data: error
        });
    };
}