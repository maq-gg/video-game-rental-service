using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using Sieve.Attributes;

namespace GameRental.Data.Models
{
    public class Game
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public List<string> Genre { get; set; } = null!;

        [Sieve(CanFilter = true)]
        public string Platform { get; set; } = null!;

        public List<string>? Explore { get; set; }

        [Sieve(CanSort = true)]
        public DateOnly ReleaseDate { get; set; }

        public List<string> Developer { get; set; } = null!;

        [Sieve(CanFilter = true)]
        public string Publisher { get; set; } = null!;
        
        public string? Description { get; set; }

        [Sieve(CanFilter = true)]
        public string ESRBRating { get; set; } = null!;

        public string BoxArt { get; set; } = null!;

        public List<GameMedia> Media { get; set; } = null!;

        public RentPrice Price { get; set; } = null!;
    }

    public class GameMedia
    {
        public string Type { get; set; } = null!; // "Image" or "Video"

        public string URL { get; set; } = null!;

        public string? Caption { get; set; }
    }

    public class RentPrice
    {
        public decimal ThreeDays { get; set; }
        public decimal SevenDays { get; set; }
        public decimal FourteenDays { get; set; }
        public decimal ThirtyDays { get; set; }
    }
}