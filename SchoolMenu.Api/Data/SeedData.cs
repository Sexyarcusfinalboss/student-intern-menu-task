using SchoolMenu.Api.Models;

namespace SchoolMenu.Api.Data;

public static class SeedData
{
    public static void Run(AppDbContext db)
    {
        if (db.Users.Any()) return;

        // --- Потребители ---
        db.Users.Add(new User
        {
            Username = "kitchen",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("kitchen123"),
            Role = "kitchen",
            DisplayName = "Кухня"
        });
        db.Users.Add(new User
        {
            Username = "student",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("student123"),
            Role = "student",
            DisplayName = "Ученик"
        });

        // --- Супи ---
        var tarator = new MenuItem
        {
            Name        = "Таратор",
            Type        = "soup",
            Allergens   = "мляко",
            Ingredients = "кисело мляко, краставица, чесън, копър, орехи, олио, вода, сол",
            Price       = 1.20m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTClRFKtJugWZl3Pfl-sbrLfWwe1KjLCWobRG1tXeHQaA&s=10"
        };
        var bobChorba = new MenuItem
        {
            Name        = "Боб чорба",
            Type        = "soup",
            Allergens   = "целина",
            Ingredients = "боб, лук, морков, домати, чушки, целина, олио, червен пипер, чубрица, магданоз, сол",
            Price       = 1.00m,
            ImageUrl    = "https://cookinglsl.com/wp-content/uploads/2018/02/Vegan-Bulgarian-Easy-White-Bean-Soup-fg-1.jpg"
        };
        var pileshkaSupa = new MenuItem
        {
            Name        = "Пилешка супа",
            Type        = "soup",
            Allergens   = "яйца, глутен",
            Ingredients = "пилешко месо, морков, целина, лук, фиде, яйце, магданоз, сол, черен пипер",
            Price       = 1.30m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDrivuX2r0tMturfi23DfdXXO2IDxlMXdye7H6apJKYQ&s=10"
        };

        // --- Основни ---
        var pileSOriz = new MenuItem
        {
            Name        = "Пиле с ориз",
            Type        = "main",
            Allergens   = "",
            Ingredients = "пилешки бутчета, ориз, лук, морков, олио, куркума, сол, черен пипер, дафинов лист",
            Price       = 3.50m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHWohTafVqd8fp9Q9sqKKj7z5TTwnPOmrNpGrS49qrFg&s=10"
        };
        var musaka = new MenuItem
        {
            Name        = "Мусака",
            Type        = "main",
            Allergens   = "мляко, яйца",
            Ingredients = "картофи, кайма, лук, домати, яйца, мляко, олио, червен пипер, сол, черен пипер",
            Price       = 3.20m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMSK9GEYXlt-kcaoof6fcSHnxnAlqadO1I9s2JGbCX2Q&s=10"
        };
        var spagetiBologneze = new MenuItem
        {
            Name        = "Спагети Болонезе",
            Type        = "main",
            Allergens   = "глутен",
            Ingredients = "спагети, кайма, лук, моркови, домати, чесън, зехтин, риган, сол, черен пипер",
            Price       = 3.00m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf4ph_eTWlMC7vM2Q3o6y60yfQ7fDZ3U-N1c8cEx32mg&s=10"
        };

        // --- Десерти ---
        var yabalkovShtrudel = new MenuItem
        {
            Name        = "Ябълков щрудел",
            Type        = "dessert",
            Allergens   = "глутен, яйца, мляко",
            Ingredients = "бутер тесто, ябълки, захар, канела, масло, стафиди, орехи",
            Price       = 1.50m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS019UK_moNIawJHkZOumrJfptVvCDZPXNvrJjRGYGzbQ&s=10"
        };
        var kiseloMlyako = new MenuItem
        {
            Name        = "Кисело мляко с мед",
            Type        = "dessert",
            Allergens   = "мляко",
            Ingredients = "кисело мляко, пчелен мед, орехи",
            Price       = 1.00m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTycQ5fqMIkr1wbDgiqnjVS2eLv_WnUh6mEXiYZmosJ4Q&s=10"
        };
        var biskvitenaTorta = new MenuItem
        {
            Name        = "Бисквитена торта",
            Type        = "dessert",
            Allergens   = "глутен, мляко",
            Ingredients = "бисквити, прясно мляко, какао, масло, захар, ванилия",
            Price       = 1.40m,
            ImageUrl    = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS98n-fhXVvW0JD4rLdBh2ZtXgcPtFvXcntL5T42FFuHQ&s=10"
        };

        db.MenuItems.AddRange(
            tarator, bobChorba, pileshkaSupa,
            pileSOriz, musaka, spagetiBologneze,
            yabalkovShtrudel, kiseloMlyako, biskvitenaTorta);

        // --- Менюта за днес и утре ---
        db.DailyMenus.Add(new DailyMenu
        {
            Date       = DateTime.Today,
            Soup       = tarator,
            MainCourse = pileSOriz,
            Dessert    = yabalkovShtrudel,
            Notes      = "Добре дошли! Приятен апетит!"
        });
        db.DailyMenus.Add(new DailyMenu
        {
            Date       = DateTime.Today.AddDays(1),
            Soup       = bobChorba,
            MainCourse = musaka,
            Dessert    = kiseloMlyako
        });

        db.SaveChanges();
    }
}
