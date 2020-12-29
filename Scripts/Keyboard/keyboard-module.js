function KeyBoard() {
    var keyboard = this;
    var dataToChange = null;    // The object we want to modify
    var fieldToChange = "";     // The field of the object we want to modify
    var dataId = "";            // Html id attribute of input (may have "display: none")
    var dataPosition = "";      // Html id attribute of keyboard position (if "id" has "display: none" then "position" must be different from "id", else they have the same value)
    var callBack = null;        // Callback function we want to execute after we change the value of the selected field
    var keyBoardType = 1;       // Keyboard type (1 is for numeric, 2 is for full, 3 is for numeric without '.' character)

    // ************************************************** //
    // Initializes keyboard
    // -----------------------------------------------------
    // data:            Object to modify (it can be a view model)
    // field:           Field of the object to modify as a string
    // id:              String of html id attribute of input
    // position:        String of html id attribute of keyboard position
    // callback:        Callback function we want to execute after we change the value of the selected field
    // type:            Keyboard type
    // applyValue:      Boolean for applying new value after change in UI
    // ************************************************** //
    keyboard.InitializeKeyboard = function (data, field, id, position, callback, type, applyValue) {
        dataToChange = data;
        fieldToChange = field;
        dataId = id;
        dataPosition = position;
        callBack = callback;
        keyBoardType = type;
        if (applyValue == true) {
            applyVal(dataId, dataToChange[fieldToChange]);
        }
        showKeyBoard(dataPosition, dataId, dataToChange[fieldToChange], keyBoardType, callBack);
    };

    // ************************************************** //
    // Shows keyboard
    // -----------------------------------------------------
    // ************************************************** //
    showKeyBoard = function (datapos, did, data, ktype, callBackFun) {
        var options = {
            openOn: null,
            autoAccept: false,
            restrictInput: true,
            layout: "custom",
            css: {
                // keyboard container
                container: "custom-keyboard",
                // input field
                input: "custom-keyboard-input",
                // button
                buttonDefault: "custom-keyboard-button",
                // hovered button
                buttonHover: "custom-keyboard-button-hover",
                // action button
                buttonAction: "custom-keyboard-button-action",
                // disabled button
                buttonDisabled: "custom-keyboard-button-disabled"
            },
            position: {
                of: $("#" + datapos),
                my: "center top",
                at: "center bottom",
                collision: "fit fit"
            },
            visible: function (e, keyboard, el) {
                keyboard.$preview[0].select();
            },
            validate: function (e, keyboard, el) {
                if (ktype == 1 || ktype == 3) {
                    var valid = true;
                    var value = parseFloat(keyboard);
                    valid = !isNaN(value);
                    if (!valid) {
                        toastr.error("Invalid input!");
                        $("#" + did).val('');
                    }
                    return valid;
                }
                else if (ktype == 2) {
                    var valid = true;
                    if (!valid) {
                        toastr.error("Invalid input!");
                    }
                    return valid;
                }
            },
            canceled: function (e, keyboard, el) {
                //$("#" + dataId).val('');
                if (typeof (data) == "function") {
                    if (data() == '') {
                        data(null);
                    }
                }
                else {
                    if (data == '') {
                        data = '';
                    }
                }
            },
            accepted: function (e, keyboard, el) {
                var value = $("#" + did).val();
                if (ktype == 1 || ktype == 3) {
                    var temp = parseFloat(value);
                    value = temp;
                }
                if (typeof (data) == "function") {
                    data(value);
                }
                else {
                    data = value;
                }
                if (callBackFun != null) {
                    callBackFun();
                }
            }
        }
        if (ktype == 1) {
            options.customLayout = {
                "default": ["7 8 9",
                    "4 5 6",
                    "1 2 3",
                    "0 {dec} {b}",
                    "{a} {c}"]
            };
        }
        else if (ktype == 2) {
            options.customLayout = {
                "default": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} q w e r t y u i o p [ ] \\",
                    "a s d f g h j k l ; \' * {enter}",
                    "{shift} z x c v b n m , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "],
                "shift": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} ; ς ε ρ τ υ θ ι ο π [ ] \\",
                    "α σ δ φ γ η ξ κ λ ; \' * {enter}",
                    "{shift} ζ χ ψ ω β ν μ , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "],
                "alt": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} Q W E R T Y U I O P [ ] \\",
                    "A S D F G H J K L ; \' * {enter}",
                    "{shift} Z X C V B N M , . / {shift}",
                    "{a}  {alt} {space} {alt} {c} {extender} "],
                "alt-shift": ["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    "{tab} ; ς Ε Ρ Τ Υ Θ Ι Ο Π [ ] \\",
                    "A Σ Δ Φ Γ Η Ξ Κ Λ ; \' * {enter}",
                    "{shift} Ζ Χ Ψ Ω Β Ν Μ , . / {shift}",
                    "{a} {alt} {space} {alt} {c} {extender} "]
            };
        }
        else if (ktype == 3) {
            options.customLayout = {
                "default": ["7 8 9",
                    "4 5 6",
                    "1 2 3",
                    "0 {b}",
                    "{a} {c}"]
            };
        }
        if ($("#" + did).getkeyboard() === undefined) {
            $("#" + did).keyboard(options);
        }
        $("#" + did).getkeyboard().reveal();
    };

    // ************************************************** //
    // Hides keyboard
    // -----------------------------------------------------
    // ************************************************** //
    keyboard.HideKeyboard = function (did) {
        if ($("#" + did).getkeyboard() !== undefined) {
            $("#" + did).getkeyboard().close();
        }
    };

    // ************************************************** //
    // Updates UI with new value
    // -----------------------------------------------------
    // ************************************************** //
    applyVal = function (id, data) {
        var apval;
        if (typeof (data) == "function") {
            apval = data();
        }
        else {
            apval = data;
        }
        $("#" + id).val(apval);
    };

}