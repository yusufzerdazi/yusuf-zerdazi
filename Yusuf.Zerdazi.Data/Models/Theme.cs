using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Yusuf.Zerdazi.Shared.Enums;

namespace Yusuf.Zerdazi.Data.Models
{
    public class Theme
    {
        public Theme()
        {

        }
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public Medium Medium { get; set; }
    }
}
