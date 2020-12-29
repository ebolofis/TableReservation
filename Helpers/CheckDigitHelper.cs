using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TableReservation.Helpers
{
    /// <summary>
    /// Create 2 CDs based on MOD10. final value: cd2 + initValue+ cd1
    /// </summary>
    public class CheckDigitHelper
    {


        /// <summary>
        /// Create Value With CD. Return the final value : cd2 + initValue+ cd1
        /// </summary>
        /// <param name="initValue">the initial (clear value)</param>
        /// <returns></returns>
        public string CreateValueCD(string initValue)
        {
            string numValue = ToASCII(initValue);
            string cd1 = getMod10(numValue);
            string cd2 = getMod10(numValue + cd1);
            return cd2 + initValue + cd1;
        }

        /// <summary>
        /// Recreate the init value based on final value (cd2 + initValue+ cd1). In case of failure return null.
        /// </summary>
        /// <param name="finalValue">cd2 + initValue+ cd1</param>
        /// <returns></returns>
        public string CreateInitValue(string finalValue)
        {
            if (string.IsNullOrWhiteSpace(finalValue) || finalValue.Length <= 2) return null;
            string cd1 = finalValue.Substring(finalValue.Length - 1, 1);
            string cd2 = finalValue.Substring(0, 1);
            string initval = finalValue.Substring(1, finalValue.Length - 2);

            string numValue = ToASCII(initval);
            string cd1calc = getMod10(numValue);
            string cd2calc = getMod10(numValue + cd1calc);
            if (cd1 == cd1calc && cd2 == cd2calc)
                return initval;
            else
                return null;

        }

        /// <summary>
        /// check the cd
        /// </summary>
        /// <param name="mycodeline"></param>
        /// <returns></returns>
        private bool checkMod10(string mycodeline)
        {
            if ((mycodeline.Replace("0", "") == "") || (!IsNumeric(mycodeline)))
                return false;
            return (getMod10(mycodeline.Substring(0, mycodeline.Length - 1)) == mycodeline.Substring(mycodeline.Length - 1, 1));
        }

        /// <summary>
        /// create the cd
        /// </summary>
        /// <param name="initValue"></param>
        /// <returns></returns>
        private string getMod10(string initValue)
        {

            int[] weightsTalbe = { 0, 2, 4, 6, 8, 1, 3, 5, 7, 9 };
            int value, digit, answer;
            string sTmp;
            if (string.IsNullOrWhiteSpace(initValue) || string.IsNullOrWhiteSpace(initValue.Replace("0", "")))
            {
                return "0";
            }


            sTmp = initValue;
            while (sTmp.Length < 32)
            {
                sTmp = "0" + sTmp;
            }
            sTmp = sTmp.Substring(0, 31) + "0";
            value = 0;
            for (int i = 31; i >= 0; i--)
            {
                digit = Convert.ToInt32(sTmp.Substring(i, 1));
                if ((sTmp.Length - i - 1) % 2 == 1)

                    value = value + weightsTalbe[digit];

                else
                    value = value + digit;
            }


            answer = 10 - (value % 10);
            if (answer == 10) answer = 0;

            return answer.ToString();
        }



        private bool IsNumeric(string value)
        {
            return value.All(char.IsNumber);
        }

        private string ToASCII(string value)
        {
            if (value == null) return "0";
            StringBuilder sb = new StringBuilder();
            foreach (char c in value.ToCharArray())
            {
                if (char.IsNumber(c))
                    sb.Append(c);
                else
                    sb.Append(((int)c % 10).ToString());
            }
            return sb.ToString();
        }


    }
}
