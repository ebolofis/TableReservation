using System.Web;
using System.Web.Optimization;

namespace TableReservation
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-1.12.1.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/umd/popper.js",
                      "~/Scripts/umd/popper-utils.js",
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/bootstrap.bundle.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/Shared").Include(
                      "~/Models/Shared/Enumerators.js",
                      "~/Models/Shared/ErrorHandlerModel.js",
                      "~/Models/Shared/CommunicationModel.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/Keyboard").Include(
                     "~/Scripts/Keyboard/keyboard-module.js",
                     "~/Scripts/Keyboard/jquery.keyboard.js",
                     "~/Scripts/Keyboard/jquery.keyboard.extension-autocomplete.js",
                     "~/Scripts/Keyboard/jquery.keyboard.extension-mobile.js",
                     "~/Scripts/Keyboard/jquery.keyboard.extension-navigation.js",
                     "~/Scripts/Keyboard/jquery.keyboard.extension-typing.js"
                     ));

            bundles.Add(new StyleBundle("~/Content/css/Stylez").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap-grid.css",
                      "~/Content/bootstrap-reboot.css",
                      "~/Content/bootstrap-theme.css",
                      "~/Content/awesome-bootstrap-checkbox.css",
                      "~/Content/css/site.css",
                      "~/Content/css/style.css",
                      "~/Content/css/flags.css",
                      "~/Content/css/customCss.css",
                      "~/Content/css/reservationForm.css",
                      "~/Content/css/WebPosCss/NewFlex.css",
                      "~/Content/toastr.css",
                      "~/Content/css/KeyBoard/keyboard.css",
                      "~/Content/css/KeyBoard/NewGeneral.css",
                      "~/Content/css/Loader/loader.css",
                      "~/Content/css/Loader/newStyle.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/css/fawesome").Include("~/Content/font-awesome.css"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                      "~/Scripts/knockout-3.4.2.js",
                      "~/Scripts/knockout.validation.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/Nuget").Include(
                      "~/Scripts/moment.js",
                      "~/Scripts/toastr.js"
                      ));

        }
    }
}
