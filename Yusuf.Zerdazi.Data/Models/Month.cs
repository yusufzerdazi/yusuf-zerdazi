using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yusuf.Zerdazi.Data.Models
{
    public class Month
    {
        public Month()
        {

        }
        [Key]
        public int ID { get; set; }
        public DateTime Start { get; set; }
        public ICollection<Theme> Themes { get; set; }
        public ICollection<Everyday> Everydays { get; set; }
    }
}
