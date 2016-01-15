using System.Web;
using System.Web.Mvc;

namespace ng2emulation_vs_aspnet_debug
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
