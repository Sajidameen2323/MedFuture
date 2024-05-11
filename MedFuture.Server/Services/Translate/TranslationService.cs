
using Azure;
using Azure.AI.Translation.Text;
using MedFuture.Server.Options;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;

namespace MedFuture.Server.Services.Translate
{
    public class TranslationService : ITranslationService
    {
        private readonly TextTranslationClient _client;

        public TranslationService(IOptions<AzureTranslateOptions> azureTranslateOptions)
        {
            // Get the Translate Text endpoint and subscription key from configuration
            var endpoint = azureTranslateOptions.Value.Endpoint;
            var subscriptionKey = azureTranslateOptions.Value.SubscriptionKey;

            AzureKeyCredential credential = new(subscriptionKey);

            // Create a DocumentTranslationClient
            _client = new TextTranslationClient(credential);

        }
        public async Task<string> TranslateTextAsync(string textToTranslate, string targetLanguage)
        {
            // Call the TranslateText method to translate the text
            Response<IReadOnlyList<TranslatedTextItem>> response = await _client.TranslateAsync(targetLanguage, textToTranslate).ConfigureAwait(false);
            IReadOnlyList<TranslatedTextItem> translations = response.Value;
            TranslatedTextItem translation = translations.FirstOrDefault();
            // Get the translated text
            Console.WriteLine($"Detected languages of the input text: {translation?.DetectedLanguage?.Language} with score: {translation?.DetectedLanguage?.Score}.");
            Console.WriteLine($"Text was translated to: '{translation?.Translations?.FirstOrDefault().To}' and the result is: '{translation?.Translations?.FirstOrDefault()?.Text}'.");

            return translation?.Translations?.FirstOrDefault()?.Text;
        }
    }
}
