﻿using Microsoft.EntityFrameworkCore;
using System;
using Yusuf.Zerdazi.Data.Models;

namespace Yusuf.Zerdazi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Everyday> Everydays { get; set; }
        public DbSet<Month> Months { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<Piece> Pieces { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}