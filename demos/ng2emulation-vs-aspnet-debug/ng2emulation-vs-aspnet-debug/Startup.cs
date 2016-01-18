using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ng2emulation_vs_aspnet_debug.Startup))]
namespace ng2emulation_vs_aspnet_debug
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
