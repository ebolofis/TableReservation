using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TableReservation.Helpers;

namespace TableReservation.Controllers
{
    public class ValidationController : BasicController
    {
        CheckDigitHelper checkDigitHelper;
        ValidateDateHelper validateDateHelper;

        public ValidationController()
        {
            checkDigitHelper = new CheckDigitHelper();
            validateDateHelper = new ValidateDateHelper();
        }

        [HttpGet]
        [AllowAnonymous]
        public string ValidateReservation(string arrival, string departure)
        {
            bool validated;
            try
            {
                string arrivalDecrypted = checkDigitHelper.CreateInitValue(arrival);
                if (arrivalDecrypted == null || arrivalDecrypted.Length != 6)
                {
                    return JsonConvert.SerializeObject(false);
                }
                string departureDecrypted = checkDigitHelper.CreateInitValue(departure);
                if (departureDecrypted == null || departureDecrypted.Length != 6)
                {
                    return JsonConvert.SerializeObject(false);
                }
                validated = validateDateHelper.ValidateReservation(arrivalDecrypted, departureDecrypted);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(false);
            }
            return JsonConvert.SerializeObject(validated);
        }

        [HttpGet]
        [AllowAnonymous]
        public string DecryptRoomReservationName(string room, string reservationName)
        {
            ReservationInfo reservationInfo = new ReservationInfo();
            try
            {
                string roomFormatted = checkDigitHelper.CreateInitValue(room);
                reservationInfo.room = roomFormatted;
                string reservationNameFormatted = checkDigitHelper.CreateInitValue(reservationName);
                reservationInfo.reservationName = reservationNameFormatted.Replace("_", " ").Replace("-", " ");
            }
            catch (Exception ex)
            {
                return null;
            }
            return JsonConvert.SerializeObject(reservationInfo);
        }

        public class ReservationInfo
        {
            public string room { get; set; }
            public string reservationName { get; set; }
        }
    }
}