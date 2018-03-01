namespace Yusuf.Zerdazi.Shared.Dtos
{
    public class PieceDto
    {
        public int Id { get; set; }
        public ThemeDto Theme { get; set; }
        public string Title { get; set; }
        public string URL { get; set; }
        public bool Explicit { get; set; }
        public PieceDto Source { get; set; }
    }
}