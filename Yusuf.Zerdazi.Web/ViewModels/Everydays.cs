using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yusuf.Zerdazi.Web.Models;

namespace Yusuf.Zerdazi.Web.ViewModels
{
    public class EverydaysViewModel
    {
        public EverydaysViewModel()
        {

        }

        public IEnumerable<Everyday> Everydays { get; set; }
        public IEnumerable<Month> Months { get; set; }
        public IEnumerable<Theme> Themes { get; set; }
    }
}
