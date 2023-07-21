using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sieve.Attributes;

namespace GameRental.Data.Models
{
    public class Contract
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [Sieve(CanSort = true)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string GameId { get; set; } = null!;

        [Sieve(CanFilter = true)]
        public string Status { get; set; } = null!; // should use enum

        public Customer CustomerInfo { get; set; } = null!;

        [Sieve(CanSort = true)]
        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public int RentalDuration { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string ShipmentMethod { get; set; } = null!;

        public decimal? ShippingFee { get; set; }

        public decimal? LateFee { get; set; }

        public decimal? TotalCost { get; set; }

        public Contract()
        {
            Status = "Pending";
        }
    }

    public class Customer
    {
        public string Name { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Address { get; set; } = null!;
    }
}