using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yusuf.Zerdazi.Web.Models
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
    }
}
