using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using TableReservation.Controllers.Helpers;

namespace TableReservation.Controllers
{
    public class BasicController : System.Web.Mvc.Controller
    {
        protected override IAsyncResult BeginExecuteCore(AsyncCallback callback, object state)
        {
            string cultureName;
            HttpCookie cultureCookie = Request.Cookies["TableReservationCulture"];
            if (cultureCookie != null)
            {
                cultureName = cultureCookie.Value;
            }
            else
            {
                cultureName = Request.UserLanguages != null && Request.UserLanguages.Length > 0 ? Request.UserLanguages[0] : null;
            }
            string cultureCode = CultureHelper.GetImplementedCulture(cultureName);
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cultureCode);
            Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;
            return base.BeginExecuteCore(callback, state);
        }
    }
}