using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TableReservation.Controllers
{
    public class AuthorizationHeaderController : BasicController
    {
        [HttpGet]
        [AllowAnonymous]
        public string SetAuthorizationHeader()
        {
            dynamic response = new ExpandoObject();
            try
            {
                string user = System.Configuration.ConfigurationManager.AppSettings["user"];
                string pass = System.Configuration.ConfigurationManager.AppSettings["pass"];
                Session["Auth"] = "Basic " + Convert.ToBase64String(
                    System.Text.ASCIIEncoding.ASCII.GetBytes(
                        string.Format("{0}:{1}", user, pass)));
                response.auth = "Basic " + Convert.ToBase64String(
                    System.Text.ASCIIEncoding.ASCII.GetBytes(
                        string.Format("{0}:{1}", user, pass)));

            }
            catch (Exception ex)
            {
                response.error = ex.Message;
                if (ex.InnerException != null && ex.InnerException.Message == "Response status code does not indicate success: 401 (Unauthorized).")
                {
                    //ModelState.AddModelError("", "The user name or password provided is incorrect.");
                    response.error += "| InnerException: " + ex.InnerException.Message;
                }
                return JsonConvert.SerializeObject(response);
            }
            return JsonConvert.SerializeObject(response); ;
        }
    }
}