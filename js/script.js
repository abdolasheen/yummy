let overLay = document.querySelector(".mainPageItems");
let allMeals = "";
let nameSearch = `<div></div>`;
let letterSeach = `<div></div>`;
// $(document).ready(function () {
//   $(".fa-bars").click(function () {
//     $(".side-menu").animate({ width: "toggle" }, function () {
//       $(".side-menu ul li:first-of-type").animate({ height: "100%" }, 2000);
//       $("aside").toggleClass("slideToLeft");
//     });
//   });
// });
$(".fa-bars").click(function () {
  $(".side-button").toggleClass("move");
  $(".side-menu").toggleClass("move");
  $(this).toggleClass("fa-xmark");
});
async function searchMeals(url) {
  const response = await fetch(url);
  if (response.status >= 200 && response.status <= 299) {
    $(".loading").fadeOut(1000);
    let data = await response.json();
    if (data.categories) {
      showAllCatergories(data.categories);
      return;
      // console.log("from IF", data.meals);
    } else if (data.meals[0].strMeal) {
      console.log("meals");

      showMeals(data.meals);
      return;
      // showSingle(data.idMeal);
    } else if (data.idMeal) {
      // showMeals(data.idMeal);
      showSingle(data.idMeal);
      return;
    } else if (data.meals[0].strArea) {
      console.log("Area");
      showAllAreas(data.meals);
      return;
    } else if (data.meals[0].idIngredient) {
      showAllingred(data.meals);
      return;
    }
  } else {
    console.log(response.status);
  }
}
searchMeals("https://www.themealdb.com/api/json/v1/1/search.php?s");
function showMeals(meals) {
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    html += `<div class="col-md-3" >
    <div class="imgContainer">
      <img class="w-100" src="${meals[i].strMealThumb}" alt="mealThumbnail" />
      <div class="overLay d-flex align-items-center" data-idx=${i}>
        <p class="fs-2 ms-3">${meals[i].strMeal}</p>
      </div>
    </div>
  </div>`;
  }
  $(".mainPageItems").html(html);
  $(".overLay").click(function (e) {
    console.log(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${
        meals[$(this).attr("data-idx")].idMeal
      }`
    );
    // searchMeals(
    //   `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${
    //     meals[$(this).attr("data-idx")].idMeal
    //   }`
    // );
    showMealDetails(meals[$(this).attr("data-idx")]);
  });
}

function showMealDetails(meal) {
  let badges = ``;
  let mealTag = ``;
  for (let i = 1; i <= 20; i++) {
    ingredientidx = `strIngredient${i}`;
    ingredientCount = `strMeasure${i}`;
    if (meal[ingredientidx] != "") {
      badges += `<span class="badge my-3">${meal[ingredientCount]}  ${meal[ingredientidx]}</span>
         `;
    }
  }
  if (meal.strTags != null) {
    let tagArr = meal.strTags.split(",");
    tagArr.forEach((element) => {
      mealTag += `<span class="badge badge-red">${element}</span> `;
    });
  }

  let html = `
  <div class="col-md-4">
          <div class="MealImg text-center">
            <img
              src=${meal.strMealThumb}
              alt="MealImg"
              class="w-100"
            />
            <p class="text-white fs-2">${meal.strMeal}</p>
          </div>
        </div>
        <div class="col-md-8 text-white">
          <h3>insutructions</h3>
          <p>
           ${meal.strInstructions}
          </p>
          <p><strong>Area :</strong> ${meal.strArea}</p>
          <p><strong>Category :</strong> ${meal.strCategory}</p>
          <h3 class="mb-5">Recipes :</h3>
          ${badges}
          <h3 class="mb-5 my-5">Tags :</h3>
          ${mealTag}
          <div class="my-5">
            <a class="btn btn-success" href=${meal.strSource} target="_">Source</a>
            <a class="btn btn-danger" href=${meal.strYoutube} target="_">YouTube</a>
          </div>
        </div>

  `;

  $(".mainPageItems").html(html);
}
$("aside .side-menu ul .search ").click(function () {
  let html = `<div class="col-md-6">
 <input
   type="text"
   class="form-control bg-transparent name"
   id="search"
   placeholder="Search By Name"
 />
</div>
<div class="col-md-6">
 <input
   type="text"
   class="form-control bg-transparent fLetter"
   id="search"
   placeholder="Search By First Letter .."
   maxlength="1"
 />
</div>`;
  $(".mainPageItems").html("");
  $(".searchInputs").html(html);
  $(".name").keyup(function (e) {
    $(".loading").show();
    searchName($(this).val());
  });
  $(".fLetter").keyup(function (e) {
    $(".loading").show();
    searchletter($(this).val());
  });
});
function searchName(val) {
  searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${val}`);
}
function searchletter(val) {
  searchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`);
}
$("aside .side-menu ul .categories ").click(function () {
  $(".loading").show();
  searchMeals("https://www.themealdb.com/api/json/v1/1/categories.php");
});
function showAllCatergories(categories) {
  let html = "";
  for (let i = 0; i < categories.length; i++) {
    html += `<div class="col-md-3" >
    <div class="imgContainer">
      <img class="w-100" src="${categories[i].strCategoryThumb}" alt="mealThumbnail" />
      <div class="overLay d-flex align-items-center" data-idx=${i}>
        <p class="fs-2 ms-3">${categories[i].strCategory}</p>
      </div>
    </div>
  </div>`;
  }
  $(".mainPageItems").html(html);
  $(".searchInputs").html("");
  $(".overLay").click(function (e) {
    // console.log(
    //   `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
    //     categories[$(this).attr("data-idx")].strCategory
    //   }`
    // );
    searchMeals(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
        categories[$(this).attr("data-idx")].strCategory
      }`
    );
  });
}
function showAllAreas(meals) {
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    html += `<div class="col-md-3" >
    <div class="imgContainer">
      <img class="w-100" src = "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-03/plant-based-food-mc-220323-02-273c7b.jpg" alt="mealThumbnail" />
      <div class="overLay d-flex align-items-center" data-idx=${i}>
        <p class="fs-2 ms-3">${meals[i].strArea}</p>
      </div>
    </div>
  </div>`;
  }
  $(".mainPageItems").html(html);
  $(".searchInputs").html("");
  $(".overLay").click(function (e) {
    // console.log(
    //   `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
    //     meals[$(this).attr("data-idx")].strCategory
    //   }`
    // );
    searchMeals(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${
        meals[$(this).attr("data-idx")].strArea
      }`
    );
  });
}
$("aside .side-menu ul .area ").click(function () {
  $(".loading").show();
  searchMeals("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
});
function showSingle(categories) {
  console.log("single category");
  let html = "";
  for (let i = 0; i < categories.length; i++) {
    html += `<div class="col-md-3" >
    <div class="imgContainer">
      <img class="w-100" src="${categories[i].strCategoryThumb}" alt="mealThumbnail" />
      <div class="overLay d-flex align-items-center" data-idx=${i}>
        <p class="fs-2 ms-3">${categories[i].strCategory}</p>
      </div>
    </div>
  </div>`;
  }
  $(".mainPageItems").html(html);
  $(".searchInputs").html("");
  $(".overLay").click(function (e) {
    // console.log(
    //   `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
    //     categories[$(this).attr("data-idx")].strCategory
    //   }`
    // );
    searchMeals(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
        categories[$(this).attr("data-idx")].idMeal
      }`
    );
  });
}
$("aside .side-menu ul .contact").click(function () {
  let html = `<form action="#">
  <div class="container-60 container">
    <div class="row">
      <h2 class="text-center text-white">ContactUs....</h2>
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Type your Name"
        />
      </div>
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Type your Email"
        />
        <div class="not-valid bg-danger text-center text-white p-3">Enter valid email. *Ex: xxx@yyy.zzz </div>
      </div>
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Type your Phone"
        />
        <div class="not-valid bg-danger text-center text-white p-3">Enter valid Phone  </div>
      </div>
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Type your Age"
        />
        <div class="not-valid bg-danger text-center text-white p-3">Enter valid Age </div>
      </div>
      <div class="col-md-6">
        <input
          type="password"
          class="form-control"
          placeholder="Type your Password"
        />
        <div class="not-valid bg-danger text-center text-white p-3">Enter valid password *Minimum eight characters, at least one letter and one number:* </div>
      </div>
      <div class="col-md-6">
        <input
          type="password"
          class="form-control"
          placeholder="Re Type your Password"
        />
        <div class="not-valid bg-danger text-center text-white p-3">Enter valid Re password  </div>
      </div>
      <button class="btn mt-3 btn-outline-danger disabled">
        Submit
      </button>
    </div>
  </div>
</form>`;
  $(".mainPageItems").html(html);
  $("input[placeholder='Type your Email']").keyup(function (e) {
    Validate($(this).val(), this);
  });
  $("input[placeholder='Type your Age']").keyup(function (e) {
    Validate($(this).val(), this);
  });
  $("input[placeholder='Type your Phone']").keyup(function (e) {
    Validate($(this).val(), this);
  });
  $("input[ placeholder='Re Type your Password']").keyup(function (e) {
    if ($("input[placeholder='Type your Password']").val() == $(this).val()) {
      $(this).siblings().slideUp(1000);
      $(this).css("border-bottom", "2px solid green");
    } else {
      $(this).siblings().slideDown(1000);
      $(this).css("border-bottom", "2px solid red");
    }
  });
  $("input[placeholder='Type your Password']").keyup(function (e) {
    Validate($(this).val(), this);
  });
  // Enter valid email. *Ex: xxx@yyy.zzz
});
let x = 0;

Validate = (val, that) => {
  let count = 0;
  if (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
    /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(val) ||
    /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/.test(val) ||
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val)
  ) {
    $(that).siblings().slideUp(1000);
    $(that).css("border-bottom", "2px solid green");
    count++;
    if (count == 1) {
      x++;
      if (x >= 5) {
        $("button").removeClass("disabled");
      }
    }
    console.log(x);
    // $(selector).css(propertyName);
  } else {
    $(that).siblings().slideDown(1000);
    $(that).css("border-bottom", "2px solid red");
  }
};
function showAllingred(meals) {
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    html += `<div class="col-md-3 text-white" >
    
      
      <div class="ing" data-idx=${i}>
      <p class="fs-5 ms-3 text-center">${meals[i].strIngredient}</p>
      
      <p class="ms-3 ">${
        meals[i].strDescription != null ? meals[i].strDescription : ""
      }</p>
       

    
    </div>
  </div>`;
  }
  $(".mainPageItems").html(html);
  $(".searchInputs").html("");
  $(".ing").click(function (e) {
    // console.log(
    //   `https://www.themealdb.com/api/json/v1/1/filter.php?c=${
    //     meals[$(this).attr("data-idx")].strCategory
    //   }`
    // );
    searchMeals(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${
        meals[$(this).attr("data-idx")].strIngredient
      }`
    );
  });
}
$("aside .side-menu ul .ingredints ").click(function () {
  $(".loading").show();
  searchMeals("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
});
// console.log($("input").css("border-bottom"));
