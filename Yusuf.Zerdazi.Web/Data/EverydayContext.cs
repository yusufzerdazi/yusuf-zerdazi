using Yusuf.Zerdazi.Web.Models;
using Microsoft.EntityFrameworkCore;

namespace Yusuf.Zerdazi.Web.Data
{
    public class EverydayContext : DbContext
    {
        public EverydayContext(DbContextOptions<EverydayContext> options) : base(options)
        {
            this.Everydays.Include(e => e.Month).ToListAsync();
            this.Months.Include(e => e.Audio).ToListAsync();
            this.Months.Include(e => e.Image).ToListAsync();
        }

        public virtual DbSet<Everyday> Everydays { get; set; }
        public virtual DbSet<Month> Months { get; set; }
        public virtual DbSet<Theme> Themes { get; set; }
    }
}
