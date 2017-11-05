using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Yusuf.Zerdazi.Web.Controllers
{
    public class ProjectsController : Controller
    {
        public IActionResult SLAM_Robot()
        {
            return View();
        }

        public IActionResult Virtual_Lecture_Hall()
        {
            return View();
        }

        public IActionResult Object_Avoiding_Robot()
        {
            return View();
        }
    }
}