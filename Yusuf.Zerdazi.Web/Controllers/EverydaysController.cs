using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Yusuf.Zerdazi.Data.Models;
using Yusuf.Zerdazi.Services;

namespace Yusuf.Zerdazi.Web.Controllers
{
    [Produces("application/json")]
    [Route("api/Everydays")]
    public class EverydaysController : Controller
    {
        private readonly IEverydaysService _everydays;

        public EverydaysController(IEverydaysService everydays)
        {
            _everydays = everydays;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var everydays = await _everydays.GetAllMonths();
            return Ok(everydays);
        }
    }
}
