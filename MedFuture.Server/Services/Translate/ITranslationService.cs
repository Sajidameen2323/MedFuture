namespace MedFuture.Server.Services.Translate
{
    public interface ITranslationService
    {

       Task<string> TranslateTextAsync(string textToTranslate, string targetLanguage);

    }
}
