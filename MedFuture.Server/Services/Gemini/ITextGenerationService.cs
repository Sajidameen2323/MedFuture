namespace MedFuture.Server.Services.Gemini
{
    public interface ITextGenerationService
    {
        Task<string> GenerateTextAsync(string textContent);

    }
}
