using System.Web.Mvc;

namespace TableReservation.Controllers
{
    public class HomeController : BasicController
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";
            ViewBag.Room = null;
            ViewBag.Arrival = null;
            ViewBag.Departure = null;
            ViewBag.ReservationName = null;
            return View();
        }

        public ActionResult IndexWithRoom(string r, string a, string d, string n)
        {
            ViewBag.Title = "Home Page";
            ViewBag.Room = r;
            ViewBag.Arrival = a;
            ViewBag.Departure = d;
            ViewBag.ReservationName = n;
            return View("Index");
        }

    }
}
