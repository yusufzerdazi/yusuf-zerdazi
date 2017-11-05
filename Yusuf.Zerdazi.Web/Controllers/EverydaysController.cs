using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Yusuf.Zerdazi.Web.Data;
using Yusuf.Zerdazi.Web.Models;
using Yusuf.Zerdazi.Web.ViewModels;

namespace Yusuf.Zerdazi.Web.Controllers
{
    public class EverydaysController : Controller
    {
        private readonly EverydayContext _context;

        public EverydaysController(EverydayContext context)
        {
            _context = context;
        }

        // GET: Everydays
        public IActionResult Index()
        {
            ViewData["ImageUrl"] = "https://content.zerdazi.com/everydays/";

            var Model = new EverydaysViewModel()
            {
                Everydays = _context.Everydays.OrderByDescending(e => e.Date)
                    .Include(e => e.Month.Themes)

                    .Include(e => e.Pieces)
                        .ThenInclude(e => e.Theme)
                    .Include(e => e.Pieces)
                        .ThenInclude(e => e.Source.Theme),
                Months = _context.Months.OrderByDescending(m => m.Start)
                    .Include(m => m.Themes),
                Themes = _context.Themes.Include(t => t.Medium)
            };

            return View(Model);
        }

        private bool EverydayExists(int id)
        {
            return _context.Everydays.Any(e => e.ID == id);
        }
    }
}
