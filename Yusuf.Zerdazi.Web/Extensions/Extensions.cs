using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Web.Data;

namespace Yusuf.Zerdazi.Web.Extensions
{
    public static class Extensions
    {
        public static IWebHost Migrate(this IWebHost webhost)
        {
            using (var scope = webhost.Services.GetService<IServiceScopeFactory>().CreateScope())
            {
                using (var dbContext = scope.ServiceProvider.GetRequiredService<EverydayContext>())
                {
                    dbContext.Database.Migrate();
                }
            }
            return webhost;
        }
    }
}
