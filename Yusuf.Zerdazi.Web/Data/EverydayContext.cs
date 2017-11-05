using Yusuf.Zerdazi.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace Yusuf.Zerdazi.Web.Data
{
    public class EverydayContext : DbContext
    {
        public EverydayContext(DbContextOptions<EverydayContext> options) : base(options)
        {
        }

        public DbSet<Everyday> Everydays { get; set; }
        public DbSet<Month> Months { get; set; }
        public DbSet<Theme> Themes { get; set; }
    }
}
