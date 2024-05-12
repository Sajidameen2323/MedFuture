using MedFuture.Server.Options;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Mscc.GenerativeAI;
using Newtonsoft.Json;
using System.Text;

namespace MedFuture.Server.Services.Gemini
{
    public class TextGenerationService: ITextGenerationService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;

        public TextGenerationService(IHttpClientFactory httpClientFactory, IOptions<GeminiOptions> geminiOptions)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = geminiOptions.Value.ApiKey;
        }

        public async Task<string> GenerateTextAsync(string textContent)
        {
            string instruction = "You are a bot that returns only json object in the structure {summary, medications:[{ name, instruction }]}. if you could not extract information please return  json object with empty values";

            string prompt = $"{instruction}\n\nThe following is a voice transcription of doctor patient conversation. from this text generate a brief summary and" +
                $" if doctor has prescribed any medication inculde that in the medication array. the text may contain unintended words please correct them.when generating summary include only medical related parts. ignore personal stories. text - {textContent}";

            var googleAI = new GoogleAI(apiKey: _apiKey);
            var model = googleAI.GenerativeModel(model: Model.GeminiPro);

            var response = model.GenerateContent(prompt).Result;

            return response.Text;
        }
    }


}
