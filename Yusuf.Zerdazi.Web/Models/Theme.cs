using System;
using System.ComponentModel.DataAnnotations;

namespace Yusuf.Zerdazi.Web.Models
{
    public class Theme
    {
        public Theme()
        {

        }
        [Key]
        public int ID { get; set; }
        public string Title { get; set; }
    }
}
