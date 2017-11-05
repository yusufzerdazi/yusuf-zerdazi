using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Yusuf.Zerdazi.Web.Models;
using Yusuf.Zerdazi.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace Yusuf.Zerdazi.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly EverydayContext _context;

        public HomeController(EverydayContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult Everydays()
        {
            var model = _context.Everydays.ToList();
            return View(model);
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
