function Reservation_vm() {
    // ----- PROPERTIES ----- //
    var self = this;
    self.api = ko.observable(null);
    self.web = ko.observable(null);
    self.ClientVersion = ko.observable(null);
    self.communication = new Communication(null);
    self.predefinedRoomLS = localStorage.PredefinedRoom || "";
    self.arrivalDateLS = localStorage.ArrivalDate || "";
    self.departureDateLS = localStorage.DepartureDate || "";
    self.predefinedReservationNameLS = localStorage.PredefinedReservationName || "";
    self.reservationTypes = ko.observable(null);
    self.getPending = ko.observable(false);
    self.hasPredefinedValues = ko.observable(false);
    self.paxes = ko.validatedObservable().extend({ required: { message: ' ', onlyIf: function () { return self.getPending() === true } } });
    self.room = ko.validatedObservable().extend({ required: { message: ' ', onlyIf: function () { return self.getPending() === true } } });
    self.name = ko.validatedObservable().extend({ required: { message: ' ', onlyIf: function () { return self.getPending() === true } } });
    self.availableDates = ko.observableArray([]);
    self.availableTimes = ko.observableArray([]);
    self.selectedDate = ko.observable();
    self.selectedTime = ko.observable();
    self.CapacityId = ko.observable();
    self.extraRooms = ko.observableArray([]).extend({ required: { message: ' ', onlyIf: function () { return self.getPending() === true } } });
    self.keyboardNew = new KeyBoard();
    self.customerInfo = ko.observableArray([]);
    ReservationCustomers = [];
    self.availability = ko.observableArray([]);
    self.selectedReservation = ko.observable();
    self.restId = ko.observable();
    self.enableFirstCustomer = ko.observable(true);
    self.selectedRestaurant = ko.observable();
    self.lockSave = ko.observable(true);
    self.restaurantDetails = ko.observable();
    self.selectedLanguage = ko.observable();
    self.EmailSend = ko.observable(true);
    self.Printed = ko.observable(true);
    self.completeOption = ko.observable(completeOptionsEnum.All);
    self.emailFound = ko.observable(false);
    self.mealType = ko.observable();
    self.mealTypeText = ko.observable();
    self.descriptionText = ko.observable('');
    self.chosenTime = ko.observable()
    self.selectedDate = ko.observable();
    self.selectedRestaurant = ko.observable('');
    self.dateOnScreen = ko.observable();
    self.info = ko.observable();
    self.lockSave = ko.observable(true);
    self.maxTimesByRest = ko.observable();

    //observables to show divs
    self.showLoader = ko.observable(true);
    self.showInputScreen = ko.observable(false);
    self.showAnotherRoomScreen = ko.observable(false);
    self.showRestaurantChoice = ko.observable(false);
    self.showTimeChoice = ko.observable(false);
    self.showCompleteScreen = ko.observable(false);
    self.showCompleteMessage = ko.observable(false);



    var Reservation = {};
    var totalNumberOfPeople = 0;

    self.initialize = function () {
        if (self.arrivalDateLS === "" && self.departureDateLS === "" && self.predefinedRoomLS === "" && self.predefinedReservationNameLS === "") {
            performInitialization();
        }
        else {
            self.hasPredefinedValues(true);
            $.ajax({
                url: self.web() + "/Validation/ValidateReservation?arrival=" + self.arrivalDateLS + "&departure=" + self.departureDateLS,
                cache: false,
                type: "GET",
                crossdomain: false,
                dataType: "json",
                ContentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (response !== undefined && response !== null && response) {
                        performInitialization();
                    }
                    else {
                        window.location = '../Home/IndexWithRoom?r=' + self.predefinedRoomLS + '&a=' + self.arrivalDateLS + '&d=' + self.departureDateLS + '&n=' + self.predefinedReservationNameLS;
                    }
                },
                fail: function (error) {
                    toastr.error(error);
                    console.log(error);
                }
            });
        }
    };

    function performInitialization() {
        if (localStorage.getItem("event") == '' || localStorage.getItem("event") === null) {
            self.setAuthorizationHeader('en');
            self.selectedLanguage('en');
        }
        else {
            self.setAuthorizationHeader(localStorage.Lang);
            self.selectedLanguage(localStorage.Lang);
        }
        localStorage.event = "";
        if (self.hasPredefinedValues()) {
            setPredefinedValues();
        }
    };

    function setPredefinedValues() {
        $.ajax({
            url: self.web() + "/Validation/DecryptRoomReservationName?room=" + self.predefinedRoomLS + "&reservationName=" + self.predefinedReservationNameLS,
            cache: false,
            type: "GET",
            crossdomain: false,
            dataType: "json",
            ContentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response !== undefined && response !== null) {
                    self.room(response.room);
                    self.name(response.reservationName);
                }
            },
            fail: function (error) {
                toastr.error(error);
                console.log(error);
            }
        });
    };

    self.setAuthorizationHeader = function (code) {
        var url = self.web() + "AuthorizationHeader/SetAuthorizationHeader"
        self.communication.generalRequest({
            url: url,
            type: "GET",
            success: function (json) {
                if (json) {
                    var data = JSON.parse(json);
                    if (data.error) {
                        toastr.error(data.error);
                    }
                    else {
                        localStorage["auth"] = data.auth;
                        localStorage["Lang"] = code;
                        self.getReservationTypes();
                        setTimeout(function () {
                            self.showLoader(false);
                            self.showInputScreen(true);
                        }, 1000);
                    }
                }
            },
            fail: function (error) {
                setTimeout(function () {
                    self.showLoader(false);
                    self.showInputScreen(true);
                }, 1000);
            }

        })
    }

    self.chooseLanguage = function (code) {
        localStorage.Lang = code;
        var name = "TableReservationCulture";
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
        document.cookie = escape(name) + "=" + escape(code) + expires + "; path=/";
        location.reload();
    };

    self.getReservationTypes = function () {
        var url = self.api() + "api/v3/ReservationTypes/GetAll";
        self.communication.generalRequest({
            url: url,
            type: "GET",
            cache: false,
            dataType: "json",
            crossdomain: true,
            contentType: "application/json; charset=utf-8",
            beforeSend: self.communication.setHeaders,
            success: function (data) {
                if (data) {
                    var reservationTypes = {};
                    ko.utils.arrayForEach(data, function (rt) {
                        reservationTypes[rt.Type] = rt.Description;
                    });
                    self.reservationTypes(reservationTypes);
                }
            },
            error: function (error) {
                toastr.error(error.statusText);
            }
        });
    };

    self.getCustomerInfo = function () {
        self.availability([]);
        self.availableDates([])
        self.extraRooms(null);
        self.customerInfo([]);
        self.enableFirstCustomer(false);
        self.showLoader(true);
        self.getPending(true);
        if (self.paxes.isValid() && self.room.isValid() && self.name.isValid()) {
            var url = self.api() + "api/v3/ReservationCustomers/GetCustomerInfo/Room/" + self.room();
            self.communication.generalRequest({
                url: url,
                type: "GET",
                cache: false,
                dataType: "json",
                crossdomain: true,
                contentType: "application/json; charset=utf-8",
                beforeSend: self.communication.setHeaders,
                success: function (data) {
                    if (data) {

                        var url = self.api() + "api/v3/Reservations/IsRestaurantOpen";
                        self.communication.generalRequest({
                            url: url,
                            type: "GET",
                            cache: false,
                            dataType: "json",
                            crossdomain: true,
                            contentType: "application/json; charset=utf-8",
                            beforeSend: self.communication.setHeaders,
                            success: function (isOpen) {
                                if (isOpen == true) {
                                    totalNumberOfPeople = data.NumberOfPeople;
                                    if (totalNumberOfPeople >= self.paxes()) {
                                        var cus = new customer(0, 0, '', '', 0, '', 0, 0, '');
                                        self.customerInfo([]);
                                        self.extraRooms([]);
                                        ReservationCustomers.push({ Id: 0, ProtelId: data.ProfileNo, ProtelName: data.FirstName + data.LastName, ReservationName: self.name(), RoomNum: self.room(), Email: data.Email, ReservationId: 0, HotelId: 1 });
                                        hideEmail(data);
                                        self.customerInfo.push(data);
                                        self.getAvailability();
                                        if (data.Email != null && data.Email != '')
                                            self.emailFound(true);
                                    }
                                    else {
                                        ReservationCustomers.push({ Id: 0, ProtelId: data.ProfileNo, ProtelName: data.FirstName + data.LastName, ReservationName: self.name(), RoomNum: self.room(), Email: data.Email, ReservationId: 0, HotelId: 1 });
                                        hideEmail(data)
                                        self.customerInfo.push(data);
                                        self.extraRooms([]);
                                        toastr.warning(anotherRoom);
                                        self.extraRooms.push({ room: '', numberOfPeople: 0 });
                                        if (data.Email != null && data.Email != '')
                                            self.emailFound(true);
                                        setTimeout(function () {
                                            self.showLoader(false);
                                            self.showInputScreen(false);
                                            self.showAnotherRoomScreen(true);
                                        }, 1000);
                                    }
                                }
                            },
                            error: function (error) {
                                toastr.error(error.responseJSON.ExceptionMessage);
                                console.log(self.api());
                                setTimeout(function () {
                                    self.showLoader(false);
                                }, 1000);
                            }
                        }) 
                    }
                    else {

                    }
                },
                error: function (error) {
                    toastr.error(error.responseJSON.ExceptionMessage);
                    console.log(self.api());
                    setTimeout(function () {
                        self.showLoader(false);
                    }, 1000);
                }

            })
        }
        else {
            self.showLoader(false);
        }
    }

    self.getRoomInfo = function (dat) {
        var index = dat.extraRooms().length - 1;
        var dataa = dat.extraRooms()[index];
        self.showLoader(false);
        var sameRoom = false;
        var count = 0;
        self.extraRooms().forEach(function (item) {
            if (item.room == dataa.room) {
                count++;
            }
        });

        if (self.room() == dataa.room || count > 1) {
            toastr.error(roomExists);
            sameRoom = true;
        }
        else {
            var id = "#extraRoom_".concat(index);
            $(id).prop('disabled', true);
        }

        if (!sameRoom) {
            var url = self.api() + "api/v3/ReservationCustomers/GetCustomerInfo/Room/" + dataa.room;
            self.showLoader(true);
            self.communication.generalRequest({
                url: url,
                type: "GET",
                cache: false,
                dataType: "json",
                crossdomain: true,
                contentType: "application/json; charset=utf-8",
                beforeSend: self.communication.setHeaders,
                success: function (data) {
                    if (data) {
                        totalNumberOfPeople += data.NumberOfPeople;
                        self.extraRooms()[self.extraRooms().length - 1].numberOfPeople = data.NumberOfPeople;
                        if (totalNumberOfPeople >= self.paxes()) {
                            self.showAnotherRoomScreen(false);
                            var cus = new customer(0, 0, '', '', 0, '', 0, 0, '');
                            cus.RoomNum = self.room();
                            cus.Email = data.Email;
                            cus.ProtelName = data.FirstName + data.LastName;
                            cus.ReservationName = self.name();
                            cus.ProtelId = data.customerNumber;
                            cus.Room = data.Room;
                            ReservationCustomers.push({ Id: 0, ProtelId: data.ProfileNo, ProtelName: data.FirstName + data.LastName, ReservationName: self.name(), RoomNum: dataa.room, Email: data.Email, ReservationId: 0, HotelId: 1 });
                            hideEmail(data);
                            self.customerInfo.push(data);
                            self.getAvailability();
                            if (data.Email != null && data.Email != '')
                                self.emailFound(true);
                        }
                        else {
                            hideEmail(data);
                            ReservationCustomers.push({ Id: 0, ProtelId: data.ProfileNo, ProtelName: data.FirstName + data.LastName, ReservationName: self.name(), RoomNum: dataa.room, Email: data.Email, ReservationId: 0, HotelId: 1 });
                            self.customerInfo.push(data);
                            toastr.warning(anotherRoom);
                            self.showLoader(false);
                            self.showAnotherRoomScreen(true);
                            self.extraRooms.push({ room: '', numberOfPeople: data.numberOfPeople });
                            if (data.Email != null && data.Email != '')
                                self.emailFound(true);
                        }
                    }
                    else {
                        self.showLoader(false);
                        self.showAnotherRoomScreen(true);
                    }
                },
                error: function (error) {
                    toastr.error(error.responseJSON.ExceptionMessage);
                    var id = "#extraRoom_".concat(index);
                    $(id).prop('disabled', false);
                    self.showLoader(false);
                    self.showAnotherRoomScreen(true);
                }

            })
        }
        else {
        }
    }

    self.deleteRoom = function (data) {
        var index = self.extraRooms.indexOf(data);
        if (index > -1 && !isNaN(data.room) && data.room != 'undefined') {
            totalNumberOfPeople -= data.numberOfPeople;
            self.extraRooms.splice(index, 1);
        }
        var found = false;
        self.extraRooms().forEach(function (item) {
            if (item.room == '')
                found = true;
        });
        if (!found)
            self.extraRooms.push({ room: '', numberOfPeople: 0 });

        self.availability([]);
        self.availableDates([]);
    }

    self.getAvailability = function () {
        self.showInputScreen(false);
        self.showLoader(true);
        var totalProfiles = ''
        for (var i = 0; i < self.customerInfo().length; i++)
            totalProfiles = totalProfiles + self.customerInfo()[i].ProfileNo + ',';
        totalProfiles = totalProfiles.substring(0, totalProfiles.length - 1);
        var TotRooms = '';
        for (var i = 0; i < self.customerInfo().length; i++)
            TotRooms = TotRooms + self.customerInfo()[i].Room + ',';
        TotRooms = TotRooms.substring(0, TotRooms.length - 1);
        var ajaxUrl = self.api() + "api/v3/Reservations/GetAvailability/TotProfiles/" + totalProfiles + '/TotRooms/' + TotRooms + '/Paxes/' + self.paxes() + '/language/' + localStorage.Lang
        self.communication.generalRequest({
            url: ajaxUrl,
            type: "GET",
            cache: false,
            dataType: "json",
            crossdomain: true,
            contentType: "application/json; charset=utf-8",
            beforeSend: self.communication.setHeaders,
            success: function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].TypeText = self.reservationTypes()[data[i].Type];
                    }
                    self.availability(data);
                    self.getMaxTimeAvailability(totalProfiles, TotRooms);
                }
                else {
                    self.showLoader(false);
                    self.showInputScreen(true);
                    self.cancel();
                    toastr.warning(nothingAvailable);
                }
            },
            error: function (error) {
                toastr.error(error.responseJSON.ExceptionMessage);
                self.showLoader(false);
                self.showInputScreen(true);
            }

        })
    }

    self.getMaxTimeAvailability = function (totalProfiles, TotRooms) {
        var ajaxUrl = self.api() + "api/v3/Reservations/GetMaxTimeAvailability/TotProfiles/" + totalProfiles + '/TotRooms/' + TotRooms + '/Paxes/' + self.paxes() + '/language/' + localStorage.Lang
        self.communication.generalRequest({
            url: ajaxUrl,
            type: "GET",
            cache: false,
            dataType: "json",
            crossdomain: true,
            contentType: "application/json; charset=utf-8",
            beforeSend: self.communication.setHeaders,
            success: function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        self.maxTimesByRest(data);
                        self.changeAvailability();
                    }
                    else {
                        self.filterElements();
                        self.showLoader(false);
                        self.showRestaurantChoice(true);
                    }
                }
                else {
                    self.showLoader(false);
                    self.showRestaurantChoice(true);
                }
            },
            error: function (error) {
                toastr.error(error.responseJSON.ExceptionMessage);
            }
        })
    }

    self.changeAvailability = function () {
        var currentDate = moment().format('L');
        var currentTime = new moment().format("HH:mm");
        for (var i = 0; i < self.maxTimesByRest().length; i++) {
            for (var j = 0; j < self.availability().length; j++) {
                if (moment(self.availability()[j].AvailDate).format('L') == currentDate){
                    if (self.maxTimesByRest()[i].Type == self.availability()[j].Type && self.maxTimesByRest()[i].RestId == self.availability()[j].RestId) {
                        if (self.maxTimesByRest()[i].Time <= currentTime) {
                            self.availability().splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
        self.filterElements();
        self.showLoader(false);
        self.showRestaurantChoice(true);
    }

    self.filterElements = function () {
        var dateArrKeyHolder = [];
        var dateArr = [];
        self.availability().forEach(function (item) {
            dateArrKeyHolder[item.AvailDate] = dateArrKeyHolder[item.AvailDate] || {};
            var obj = dateArrKeyHolder[item.AvailDate];
            if (Object.keys(obj).length == 0)
                dateArr.push(obj);

            obj.AvailDate = moment(item.AvailDate).format('MM/DD/YYYY');
            obj.Info = obj.Info || [];

            obj.Info.push({ Type: item.Type, RestaurantName: item.RestaurantName, RestId: item.RestId, TypeText: item.TypeText });
        });

        var RestKeyHolder = [];
        var restArray = [];
        var finalObj = [];
        dateArr.forEach(function (itemm) {
            itemm.Info.forEach(function (item) {
                RestKeyHolder[itemm.AvailDate + item.RestaurantName] = RestKeyHolder[itemm.AvailDate + item.RestaurantName] || {};
                var objj = RestKeyHolder[itemm.AvailDate + item.RestaurantName];
                if (Object.keys(objj).length == 0)
                    restArray.push(objj);

                objj.RestaurantName = item.RestaurantName;
                objj.Infoo = objj.Infoo || [];

                objj.Infoo.push({ Type: item.Type, RestId: item.RestId, TypeText: item.TypeText });
            })
            itemm.Info = restArray;
            restArray = [];
            finalObj.push(itemm);
        });
        self.availableDates(finalObj);
        self.dateOnScreen(self.availableDates()[0]);
    }

    self.previousDay = function (data) {
            for (var i = 0; i < self.availableDates().length; i++) {
            if (self.availableDates()[i].AvailDate === data.AvailDate) {
                if (i > 0)
                    self.dateOnScreen(self.availableDates()[i - 1]);
                else
                    toastr.warning(notPreviousDay);
            }
        }
    }

    self.nextDay = function (data) {
        for (var i = 0; i < self.availableDates().length; i++) {
            if (self.availableDates()[i].AvailDate === data.AvailDate) {
                if (i < self.availableDates().length -1)
                    self.dateOnScreen(self.availableDates()[i + 1]);
                else
                    toastr.warning(notNextDay);
            }
        }
    }

    //self.checkForPreviousDay = function (data) {
    //    for (var i = 0; i < self.availableDates().length; i++)
    //        if (self.availableDates()[i].AvailDate === data.AvailDate)
    //            if (i == 0)
    //                return false;
    //            else
    //                return true;
    //}

    //self.checkForNextDay = function (data) {
    //    for (var i = 0; i < self.availableDates().length; i++)
    //        if (self.availableDates()[i].AvailDate === data.AvailDate)
    //            if (i == self.availableDates()[self.availableDates().length])
    //                return false;
    //            else
    //                return true;
    //}

    self.openModalInfo = function () {
        if (self.info() == null || self.info() == undefined) {
            toastr.warning(typeOfMeal);
            return;
        }
        self.showRestaurantChoice(false);
        self.showLoader(true);
        self.connectRestIdWithName(self.dateOnScreen().Info, self.info().RestId);
        self.getRestaurantDetails(self.info().RestId);
        self.mealType(self.info().Type);
        var totalProfiles = ''
        for (var i = 0; i < self.customerInfo().length; i++)
            totalProfiles = totalProfiles + self.customerInfo()[i].ProfileNo + ',';
        totalProfiles = totalProfiles.substring(0, totalProfiles.length - 1);
        var TotRooms = ''
        for (var i = 0; i < self.customerInfo().length; i++)
            TotRooms = TotRooms + self.customerInfo()[i].Room + ',';
        TotRooms = TotRooms.substring(0, TotRooms.length - 1);
        Reservation.ReservationDate = self.dateOnScreen().AvailDate;
        Reservation.RestId = self.info().RestId;
        self.selectedDate(self.dateOnScreen().AvailDate);
        var ajaxUrl = self.api() + "api/v3/Reservations/GetRestaurantAvailability/TotProfiles/" + totalProfiles + '/TotRooms/' + TotRooms + '/Paxes/' + self.paxes() + '/language/' + localStorage.Lang + '/RestId/' + Reservation.RestId + '/ActiveDate/' + moment(self.selectedDate()).format('YYYY-MM-DD');
        self.communication.generalRequest({
            url: ajaxUrl,
            type: "GET",
            cache: false,
            dataType: "json",
            crossdomain: true,
            contentType: "application/json; charset=utf-8",
            beforeSend: self.communication.setHeaders,
            success: function (data) {
                if (data) {
                    var tmpData = [];
                    var countItems = 0;
                    data.forEach(function (item) {
                        if (item.Type == self.mealType()) {
                            item.TypeText = self.reservationTypes()[self.mealType()];
                            item.Time = item.Time.slice(0, -3);
                            item.TimeType = item.Time + ' ' + item.TypeText;
                            tmpData.push(item);
                        }
                        countItems++;
                        if (countItems == data.length)
                            if (tmpData.length > 0) {
                                self.mealTypeText(tmpData[0].TypeText);
                                self.availableTimes(tmpData);
                            }
                    });
                    self.showLoader(false);
                    self.showTimeChoice(true);
                    
                }
                else {
                    self.showLoader(false);
                    self.showRestaurantChoice(true);
                }
            },
            error: function (error) {
                toastr.error(error.responseJSON.ExceptionMessage);
                self.showLoader(false);
                self.showRestaurantChoice(true);
            }
        })
        $("#exampleModalCenter").modal('show');
    }

    self.getRestaurantDetails = function (Id) {
        self.communication.generalRequest({
            url: self.api() + "api/v3/Restaurants/Get/Id/" + Id,
            type: "GET",
            cache: false,
            dataType: "json",
            crossdomain: true,
            contentType: "application/json; charset=utf-8",
            beforeSend: self.communication.setHeaders,
            success: function (data) {
                self.restaurantDetails(data);
            },
            fail: function (error) {

            }
        })
    }

    self.connectRestIdWithName = function (data, restId) {
        data.forEach(function (item) {
            if (item.Infoo[0].RestId == restId)
                self.selectedRestaurant(item.RestaurantName);
        });
    }

    self.finalizeReservation = function () {
        Reservation.ReservationTime = self.chosenTime();
        Reservation.CapacityId = self.CapacityId();
        Reservation.Couver = self.paxes();
        Reservation.CreateDate = "04/13/2018";
        Reservation.Status = 1;
        Reservation.Id = 0;
        
        //$("#exampleModalCenter").modal('hide');
        //$("#exampleModalCenter2").modal('show');

    }

    self.saveReservation = function (sendEmail, printExtEcr, data) {
        var desc = document.getElementById('inputDescription');
        Reservation.Description = desc.value;
        if (sendEmail)
            self.EmailSend(false);
        if (printExtEcr)
            self.Printed(false);
        self.lockSave(false);
        var model = { Reservation: Reservation, ReservationCustomers: ReservationCustomers, Language: localStorage.Lang, SendEmail: sendEmail, PrintToExtEcr: printExtEcr };
        self.communication.generalRequest({
            url: self.api() + "api/v3/ReservationCustomers/Insert/",
            cache: false,
            type: 'POST',
            crossdomain: true,
            dataType: "json",
            ContentType: 'application/json; charset=utf-8',
            data: model,
            beforeSend: self.communication.setHeaders,
            success: function (dat) {
                self.showLoader(false);
                self.showCompleteMessage(true);
                Reservation.Id = dat.Reservation.Id;
                toastr.success(reservationMade);
                setTimeout(function () {
                    if (self.hasPredefinedValues()) {
                        window.location = '../Home/IndexWithRoom?r=' + self.predefinedRoomLS + '&a=' + self.arrivalDateLS + '&d=' + self.departureDateLS + '&n=' + self.predefinedReservationNameLS;
                    }
                    else {
                        window.location = '../Home/Index';
                    }
                }, 3000);
            },
            error: function (error) {
                if (error.responseJSON.ExceptionMessage) {
                    toastr.error(error.responseJSON.ExceptionMessage);
                    if (error.responseJSON.ExceptionMessage.includes("However, there was no Printer Connected...!") && printExtEcr === true) {
                        setTimeout(function () {
                            if (self.hasPredefinedValues()) {
                                window.location = '../Home/IndexWithRoom?r=' + self.predefinedRoomLS + '&a=' + self.arrivalDateLS + '&d=' + self.departureDateLS + '&n=' + self.predefinedReservationNameLS;
                            }
                            else {
                                window.location = '../Home/Index';
                            }
                        }, 3000);
                    }
                }
                else
                    toastr.error(error);
                setTimeout(function () {
                    if (self.hasPredefinedValues()) {
                        var predefinedRoomLS = localStorage.PredefinedRoom;
                        window.location = '../Home/IndexWithRoom?r=' + self.predefinedRoomLS + '&a=' + self.arrivalDateLS + '&d=' + self.departureDateLS + '&n=' + self.predefinedReservationNameLS;
                    }
                    else {
                        window.location = '../Home/Index';
                    }
                }, 3000);
            }
        })
    }

    self.backToLanguageSelection = function () {
        if (self.hasPredefinedValues()) {
            window.location = '../Home/IndexWithRoom?r=' + self.predefinedRoomLS + '&a=' + self.arrivalDateLS + '&d=' + self.departureDateLS + '&n=' + self.predefinedReservationNameLS;
        }
        else {
            window.location = '../Home/Index';
        }
    }

    self.cancel = function () {
        self.enableFirstCustomer(true);
        self.availability([]);
        self.availableDates([])
        self.extraRooms(null);
        self.customerInfo([]);
        ReservationCustomers = [];
        self.paxes(null);
        self.name(null);
        self.room(null);
        self.getPending(false);
        self.emailFound(false);
    }

    self.backToInputs = function () {
        self.cancel();
        self.showAnotherRoomScreen(false);
        self.showRestaurantChoice(false);
        self.showInputScreen(true);
        if (self.hasPredefinedValues()) {
            setPredefinedValues();
        }
    }

    self.backToTypeSelect = function () {
        self.showTimeChoice(false);
        self.showRestaurantChoice(true);
        self.chosenTime(null);
        $(".time-hour").removeClass("time-hour-selected");
    }
    self.backToTimeSelect = function () {
        self.showCompleteScreen(false);
        self.showTimeChoice(true);
    }

    self.goToCompleteScreen = function () {
        if (self.chosenTime() != null && self.chosenTime() != undefined) {
            self.showTimeChoice(false);
            self.showCompleteScreen(true);
        }
        else
            toastr.warning(choseTime);
    }

    self.goToCompleteMessage = function (sendEmail, printExtEcr, data) {
        self.showCompleteScreen(false);
        self.showLoader(true);
        //self.showCompleteMessage(true);
        self.finalizeReservation();
        self.saveReservation(sendEmail, printExtEcr, data);
    }

    self.chooseTime = function (data) {
        self.CapacityId(data.CapacityId);
        self.chosenTime(data.Time);

        $(".time-hour").removeClass("time-hour-selected");

        for (var i = 0; i < self.availableTimes().length; i++) {
            if (data.Time == self.availableTimes()[i].Time) {
                var id = "#time" + i
                $(id).addClass("time-hour-selected");
            }
        }

    }

    self.chooseDate = function (data) {
        self.lockSave(false);
        $(".restaurant-date").removeClass("restaurant-date-selected");
        var id = '';
        if (data.Type == 0) {
            id = "#brunch" + data.RestId + data.Type;
        }

        else if (data.Type == 1) {
            id = "#lunch" + data.RestId + data.Type;
        }
        else if (data.Type == 2) {
            id = "#dinner" + data.RestId + data.Type;
        }

        if (id != '') {
            $(id).addClass("restaurant-date-selected");
            self.info(data);
        }
        self.lockSave(true);
    }
}

function customer(Id, ProtelId, ProtelName, ReservationName, RoomNum, Email, ReservationId, HotelId, Room) {
    this.Id = Id;
    this.ProtelName = ProtelName;
    this.ProtelId = ProtelId;
    this.ReservationName = ReservationName;
    this.RoomNum = RoomNum;
    this.Email = Email;
    this.ReservationId = ReservationId;
    this.HotelId = HotelId;
    this.Room = Room;
};

function hideEmail(data) {
    for (var i = 1; i < data.Email.length; i++) {
        if (data.Email[i] === '@')
            break;
        else {
            var tmpChar = data.Email[i];
            var tmpEmail = data.Email;
            res = tmpEmail.replace(tmpChar, '*');
            data.Email = res;
        }
    }
    if (data.Email[0] == '*') {
        var substring = data.Email.substr(0, data.Email.indexOf('@'));
        for (var j = 0; j < substring.length; j++)
            if (substring[j] != "*") {
                char = substring[j];
                data.Email = data.Email.replace(char, '*');
                data.Email = data.Email.replace('*', char);

            }
    }
}

