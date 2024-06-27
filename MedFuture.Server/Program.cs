using Microsoft.IdentityModel.Tokens;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using MedFuture.Server.Database;
using Microsoft.AspNetCore.Authorization;
using MedFuture.Server.Authorization;
using MedFuture.Server.Services;
using MedFuture.Server.Options;
using MedFuture.Server.Database.Interfaces;
using MedFuture.Server.Database.Repositories;
using MedFuture.Server.Services.Email;
using MedFuture.Server.Services.User;
using MedFuture.Server.Services.Translate;
using MedFuture.Server.Services.Gemini;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;


var builder = WebApplication.CreateBuilder(args);

var pathToJsonFile = @".\firebase-auth.json";

var fireApp = FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile(pathToJsonFile),
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnection")));


builder.Services.AddHttpClient();
builder.Services.Configure<MailOptions>(builder.Configuration.GetSection("MailSettings"));
builder.Services.Configure<GeminiOptions>(builder.Configuration.GetSection("Gemini"));
builder.Services.Configure<AzureTranslateOptions>(builder.Configuration.GetSection("AzureTranslate"));


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://securetoken.google.com/final-year-project-91cb1";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://securetoken.google.com/final-year-project-91cb1",
            ValidAudience = "final-year-project-91cb1",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC12rGgAya1QcKE\nFA/gMkdoj+O7+4s2yDLD+NKiX8G1hFO2O3XP2iYAa6KHm3PGZPPeyVpsfMMlAuPj\n3/zUuTSqy7vEUa6BoKZW9BErDjTQ/yUS3bsW8MAImZ2U8Sa2IRxKtydsi765Y09i\n3s8BoQiwoJ2EET90NGcVMMh4j2nAD1ar6CHgbtzJm8UmRTX+U1HaFMV+BTiATJN6\nhc34kRd/1ukI2gZVj3stByDPqeBfevBgnRXtPm4/8PysImvOpPsAe1bI37HmjnQv\ninwfZ/hBLEgv+axNZXpuygB2vmeHCAQqxWgdglMegHJ7Nuhf4LFbSr+AutPYZxhK\n1jGEch/HAgMBAAECggEAKvoEAEy+WRexYIVdOx6mwY8/wq0vuUKWvLmRDc6TeNJM\n9kQXE4f6cx78yg9yzPAOshfjxr+1XonQUYodtigOyk5bkYm8M+ZDaUlExWgWE044\n9Lxx+nnq6B1loE1dWK16gi3Go2BjMmzF1hfR1BC6fQN4Nj3dQRkhQ2DD/7nkw/51\nl9duXbFs24jl4gAnQfo0qr7QfGMJdNqyVpvkpaEp5rFQ1dsXpSnXFMS7I1fZOEqs\nKNfLM6yQdHqTtlTWH35R1qbvayxquqYwC57kLV6L+vSJPXVN/6JdAGHvOGL9qSC7\n3j9SKeqOiNv3KzaCFATTMyn4UnCAt35/PhFDfszYAQKBgQDsE2WGGsNnwDuYVjhh\ndLIBsIo+splM9e6zhT8v9g8nGw2MKdLk0Etbh+tUZ9/bJULl3ALMkS86P5Xt4uwh\nf4MTHA2ud3I+k0V5TykLJ2c0x74/mef56+RpOaQ40pCJinN1wNxnetL1+PPfHl97\n2WQxo62JdP0aP+piwJlF4/6wbwKBgQDFM8yOMykqxdewVcS+SZse4+4LGvd1uV9X\nvPl49beh+5wD5KYdSPGsXLcKKAEV4uHArLxV3UDamIEBSIq2ZyAIVsu0toVrRk+t\n406q8qswAvEjQ5SuVRGE/zb5+64IGbKfWy4FPj5Mbdaf8C+I6c9rwB+qeAZmbBIE\n74TUFqkCKQKBgGX9BzpFa6/x640nipoHyTNTqpXloLcP9HzYDvFQc0FovZSVKQgz\nOKslcDR538sUMO+O+iKYgne+qq4n/+2E4gKqdvqtncyM4VHEMi4gasTxmi5t9jsR\nfw86mMj3pvvUtYbkuBN4i5U6ZVk6DPQ7eb68QKeGxCXIASGCpXT9R7W/AoGAc55j\nGBw2zrUgOGqQ52AQapQIRMqSu5rro21QdvLZr0btufqcyh6yUvQo/PNnb4WOBoFA\nCremBoPTXwVBDqB3z2vUEyfQIY0fujvDK8cLRyLyblJ5IZ0OoINhoD9HUch/SZ8T\n5E8SB41+gFc6B3POAMaryi6E0hgamHo1zoNao8ECgYA+7x1ldSSxnRNW1sFQx/a/\n2Rp88bx/G879Gh0DeRiXjK9LmYgBiF/6e7IEb5LTXjYBis2EatvBqn/BWes5IW7x\nFcbMS9rcX+aU84mIa+LKvfCAjpln52Gs6jj3KSVp6fyrsXOGM34RChZaL6cEKrKB\nkbiJVjWZ3JiPSxeV6jZMPA==\n-----END PRIVATE KEY-----\n")),
            RoleClaimType = "role", // Specify the claim type for roles
        };
    });

// Role Bsed Policy Declaration

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnlyPolicy", policy =>
    {
        policy.Requirements.Add(new AuthRoleRequirement("Admin"));
    });
    options.AddPolicy("DoctorOnlyPolicy", policy =>
    {
        policy.Requirements.Add(new AuthRoleRequirement("Doctor"));
    });
    options.AddPolicy("PatientOnlyPolicy", policy =>
    {
        policy.Requirements.Add(new AuthRoleRequirement("Patient"));
    });
});

builder.Services.AddSingleton<IAuthorizationHandler, AuthRoleHandler>();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "BookingAppointmentLimiter", options =>
    {
        options.PermitLimit = 3;
        options.Window = TimeSpan.FromHours(24);
        //options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        //options.QueueLimit = 2; //remove this if you want the RejectionStatusCode and the OnRejected to be invoked. 
        

    });
   
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, _) =>
    {
        Console.WriteLine("---------- ON REJECT METHOD ---------");
        await context.HttpContext.Response.WriteAsync("too many request");
      
    };
});


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMyDependency, MyDependency>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<ITranslationService, TranslationService>();
builder.Services.AddSingleton<ITextGenerationService, TextGenerationService>();

// Registering datbase repositories

builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IConsultationRepository, ConsultationRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IMedicationReminderRepository, MedicationReminderRepository>();
builder.Services.AddScoped<IStatisticsRepository, StatisticsRepository>();

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRateLimiter();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();



