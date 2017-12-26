using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yusuf.Zerdazi.Data.Models
{
    public enum Medium
    {
        Image, Sound, Video
    }

    public class Theme
    {
        public Theme()
        {

        }
        [Key]
        public int ID { get; set; }
        public string Title { get; set; }
        public Medium Medium { get; set; }
    }
}
