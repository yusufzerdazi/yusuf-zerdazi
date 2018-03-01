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
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public ICollection<Everyday> Everydays { get; set; }
    }
}
