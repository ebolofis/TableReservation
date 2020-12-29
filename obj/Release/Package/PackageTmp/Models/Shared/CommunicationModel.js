function Communication(basicAuth) {
    var comm = this;

    comm.generalRequest = function (request) {
        return $.ajax(request);
    };

    comm.setHeaders = function (xhr) {
        xhr.setRequestHeader("Authorization", localStorage.auth);
        xhr.setRequestHeader("Accept-Language", localStorage.Lang);
    };
}