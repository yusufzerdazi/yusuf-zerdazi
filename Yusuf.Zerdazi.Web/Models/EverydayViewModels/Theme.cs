using System;
using System.ComponentModel.DataAnnotations;

namespace Yusuf.Zerdazi.Web.Models
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
