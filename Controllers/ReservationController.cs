using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TableReservation.Controllers
{
    public class ReservationController : BasicController
    {
        // GET: Reservation
        public ActionResult ReservationIndex()
        {
            ViewBag.Title = "Reservation Page";
            return View();
        }

        public ActionResult _ReservationIndex()
        {
            return View();
        }
    }
}