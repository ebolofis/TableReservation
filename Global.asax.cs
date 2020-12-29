using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace TableReservation
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            var logger = log4net.LogManager.GetLogger(this.GetType());
            logger.Info("");
            logger.Info("");
            Assembly assembly = Assembly.GetExecutingAssembly();
            string apiVersion = assembly.FullName.Split(',')[1];
            logger.Info("Table Reservationversion: " + apiVersion);
            logger.Info("");
            logger.Info("*****************************************");
            logger.Info("*                                       *");
            logger.Info("*           Application Started         *");
            logger.Info("*                                       *");
            logger.Info("*****************************************");
            logger.Info("");
            logger.Info("");


            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
