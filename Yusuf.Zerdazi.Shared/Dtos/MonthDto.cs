using System;
using System.Collections.Generic;
using System.Linq;

namespace Yusuf.Zerdazi.Shared.Dtos
{
    public class MonthDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime Start { get; set; }
        public List<ThemeDto> Themes { get; set; }
        public List<EverydayDto> Everydays { get; set; }

        public void Order()
        {
            // Order everydays by date.
            Everydays = Everydays.OrderByDescending(e => e.Date).ToList();
            foreach (var everyday in Everydays)
            {
                // Order pieces by medium.
                everyday.Pieces = everyday.Pieces.OrderByDescending(p => p.Theme.Medium).ToList();
            }
        }

        public void Filter()
        {
            foreach (var everyday in Everydays)
            {
                foreach (var piece in everyday.Pieces)
                {
                    piece.Filter();
                }
            }
        }
    }
}
