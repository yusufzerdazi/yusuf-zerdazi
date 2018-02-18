using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yusuf.Zerdazi.Data.Models
{
    public class Meal
    {
        [Key]
        public int Id { get; set; }
        public DateTime Requested { get; set; }
        public DateTime? Fulfilled { get; set; }
        public double Amount { get; set; }
    }
}
