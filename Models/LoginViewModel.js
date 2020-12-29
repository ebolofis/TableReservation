function LoginViewModel() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.arrivalDate = arrivalDateJS || "";
    self.departureDate = departureDateJS || "";
    self.api = ko.observable(null);
    self.web = ko.observable(null);
    self.clientVersion = ko.observable(null);
    self.reservationValidated = ko.observable(false);
    self.communication = new Communication(null);

    self.validateReservation = function () {
        if (self.arrivalDate === "" && self.departureDate === "") {
            self.reservationValidated(true);
        }
        else {
            $.ajax({
                url: self.web() + "/Validation/ValidateReservation?arrival=" + self.arrivalDate + "&departure=" + self.departureDate,
                cache: false,
                type: "GET",
                crossdomain: false,
                dataType: "json",
                ContentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response !== undefined && response !== null && response) {
                        self.reservationValidated(true);
                    }
                },
                fail: function (error) {
                    toastr.error(error);
                    console.log(error);
                }
            });
        }
    };

    self.chooseLanguage = function (code) {
        self.communication.generalRequest({
            url: self.web() + "/AuthorizationHeader/SetAuthorizationHeader",
            cache: false,
            type: "GET",
            crossdomain: false,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data) {
                    if (data.error) {
                        toastr.error(data.error);
                    }
                    else {
                        localStorage["auth"] = data.auth;
                        localStorage["Lang"] = code;
                        var name = "TableReservationCulture";
                        var date = new Date();
                        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                        document.cookie = escape(name) + "=" + escape(code) + expires + "; path=/";
                        window.location.href = "../Reservation/ReservationIndex";
                    }
                }
            },
            fail: function (error) {
                toastr.error(error.error);
            }
        });
    };

}

