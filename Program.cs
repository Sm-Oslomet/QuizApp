var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ✅ Allow React (localhost:3000 eller 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // legg til React-porten du bruker
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Swagger / API explorer
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS *before* authorization
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run(); 