using Sieve.Services;

namespace GameRental.Data.Models;

public class SieveCustomFilterMethods : ISieveCustomFilterMethods
{
    public IQueryable<Game> Developer(IQueryable<Game> source, string op, string[] values) 
    {
        var result = source.Where(game =>
            game.Developer.Any(developer =>
                values.Any(value => value.ToLower() == developer.ToLower())) 
        );

        return result;
    }

    public IQueryable<Game> Genre(IQueryable<Game> source, string op, string[] values)
    {
        var result = source.Where(game =>
            game.Genre.Any(genre => 
                values.Any(value => value.ToLower() == genre.ToLower())));

        return result;
    }

    public IQueryable<Game> Explore(IQueryable<Game> source, string op, string[] values)
    {
        var result = source.Where(game =>
            game.Explore.Count != 0 && game.Explore.Any(explore => 
                values.Any(value => value.ToLower() == explore.ToLower())));

        return result;
    }
}