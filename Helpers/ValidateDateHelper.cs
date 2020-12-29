using System;
using System.Collections.Generic;
using System.Text;

namespace TableReservation.Helpers
{
    public class ValidateDateHelper
    {
        public ValidateDateHelper()
        {
            
        }

        public bool ValidateReservation(string arrivalFormatted, string departureFormatted)
        {
            bool validated;
            if (string.IsNullOrWhiteSpace(arrivalFormatted) || arrivalFormatted.Length != 6)
            {
                return false;
            }
            if (string.IsNullOrWhiteSpace(departureFormatted) || departureFormatted.Length != 6)
            {
                return false;
            }
            DateTime arrivalDate = GenerateDate(arrivalFormatted);
            DateTime departureDate = GenerateDate(departureFormatted);
            DateTime currentDate = DateTime.Now.Date;
            if (DateTime.Compare(arrivalDate, currentDate) <= 0 && DateTime.Compare(currentDate, departureDate) <= 0)
            {
                validated = true;
            }
            else
            {
                validated = false;
            }
            return validated;
        }

        private DateTime GenerateDate(string dateCode)
        {
            string yearS = "20" + dateCode.Substring(0, 2);
            int yearN = Convert.ToInt32(yearS);
            string monthS = dateCode.Substring(2, 2);
            int monthN = Convert.ToInt32(monthS);
            string dayS = dateCode.Substring(4, 2);
            int dayN = Convert.ToInt32(dayS);
            DateTime dateDT = new DateTime(yearN, monthN, dayN);
            return dateDT;
        }
    }
}
