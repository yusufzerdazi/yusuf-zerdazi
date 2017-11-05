using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yusuf.Zerdazi.Web.Models
{
    public class Everyday
    {
        public Everyday()
        {

        }
        [Key]
        public int ID { get; set; }
        public virtual Month Month { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public bool OriginalAudio { get; set; }
        public bool OriginalImage { get; set; }
        public string SourceImageTitle { get; set; }
        public string SourceAudio { get; set; }
    }
}
