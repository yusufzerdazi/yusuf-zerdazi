using System;
using System.Collections.Generic;

namespace Yusuf.Zerdazi.Shared.Dtos
{
    public class MonthDto
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public List<ThemeDto> Themes { get; set; }
        public List<EverydayDto> Everydays { get; set; } 
    }
}
