const API_KEY = '7b18a7f3b2d685dd27253e6e67f17187';
let long;
let lat;
let citieslist;
//Date for NavBar
let d = new Date();
let year = d.getFullYear().toString();
let m = d.getMonth()
 m=m+1;

let day = d.getDate().toString();

document.getElementById('date').innerText = `${day}/${m.toString()}/${year}`


//Main
const descContainer = document.getElementById('description');
const tempContainer = document.getElementById('temp');
const locationContainer = document.getElementById('location');
const iconContainer = document.getElementById('icon');
//Modal
const searchWeatherBtn = document.getElementById('btn-change-location');
const userinput = document.getElementById('city');
const locationgiddeninput =  document.getElementById('locationinput');
const suggestionContainer = document.getElementById('suggestions');

//Forecast
const forecastContainer = document.getElementById('forecast');

//Moreinfo
const feellikeContainer = document.getElementById('feellike');
const maxContainer = document.getElementById('max');
const minContainer = document.getElementById('min');
const sunriseContainer = document.getElementById('sun')
const sunsetContainer = document.getElementById('moon');
const windContainer = document.getElementById('wind');

//fetch cities list
fetch('city.list.json')
.then(Response=>Response.json())
.then(data=>{
    citieslist=data;

})
.catch(err=>console.log(err))

const init = () =>{
    if(navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(position=>{
        
        long = position.coords.longitude; 
        lat = position.coords.latitude;
        nowLocationData(lat,long);
        fivedayforecast(lat,long); 

    },()=>alert('Location Denied'));
    }
    else
    {
    alert('browser Dont Support');
    }
};

const nowLocationData = (lat,long) =>{

    const urlcurrentuserdata = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    fetch(urlcurrentuserdata)
               .then(Response=>Response.json())
               .then(data=>{
                   
                   
                   const degree = toCelcius(data.main.temp);
                   tempContainer.innerHTML = degree + "°";
                   locationContainer.innerHTML = `<i class="fas fa-map-marker-alt"></i> `+ data.name + ", " + data.sys.country;
                   descContainer.innerHTML = data.weather[0].description;
                   const icon = data.weather[0].icon;
                   const urlicon = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                   iconContainer.innerHTML = `<img src="${urlicon}">`;
                    //added information
                   maxContainer.innerHTML = `<i class="fas fa-temperature-high text-weight-bold"></i> Max Temp<br>${toCelcius(data.main.temp_max)}°`;
                   minContainer.innerHTML = `<i class="fas fa-temperature-low text-weight-bold"></i> Min Temp<br>${toCelcius(data.main.temp_min)}°`;
                   feellikeContainer.innerHTML = `<i class="fas fa-feather-alt text-weight-bold"></i> Feels Like<br>${toCelcius(data.main.feels_like)}°`;

                   let secsunrise = data.sys.sunrise;
                   let datesunrise = new Date(secsunrise * 1000);
                   sunriseContainer.innerHTML = `<i class="fas fa-sun"></i> Sunrise<br>${datesunrise.toLocaleTimeString()}`;

                   let secsunset = data.sys.sunset;
                   let datesunset = new Date(secsunset * 1000);
                   sunsetContainer.innerHTML = `<i class="fas fa-moon"></i> Sunset<br>${datesunset.toLocaleTimeString()}`;

                   windContainer.innerHTML = `<i class="fas fa-wind"></i> Wind<br>${data.wind.speed}`;
               })
               .catch(err=>console.log(err))


};


const fivedayforecast = (lat,long) =>{
    const urlHourlyData = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}`;
    fetch(urlHourlyData)
               .then(Response=>Response.json())
               .then(data=>{
                
                data.list.map(dateweather=>{
                    //insert the data in every loop
                    
                    
                    
                    const dateAndtime =dateweather.dt_txt;
                    const temp = toCelcius(dateweather.main.temp) + "°";
                    const desc = dateweather.weather[0].description;
                    const icon = dateweather.weather[0].icon;
                    const div = document.createElement('div');
                    div.classList = 'col-xl-3  hoverspecificdate';
                    div.innerHTML = `
                    <h5 class="ml-3">${dateAndtime}</h5>
                    <img src="${`http://openweathermap.org/img/wn/${icon}@2x.png`}">
                    <hr>
                    <h2>${temp}</h2>
                    <p class="font-weight-bold">${desc}</p>
                    `;
                    forecastContainer.appendChild(div);
                   
                    
                })
               })
               .catch(err=>console.log(err))


};

const typedCityLocation = () =>{
    
    //check if input empty
    if(userinput.value.trim()==='' || locationgiddeninput.value ==='')
    {
        
        return;
    }
    userinput.value = ""; //reset the input
    suggestionContainer.innerHTML = ""; //reset suggestions
    let value = locationgiddeninput.value.split(","); //split the lat and long from the value
    lat = Number(value[0]);
    long = Number(value[1]);
    
    nowLocationData(lat,long);
    //reset the forecastContainer
    forecastContainer.innerHTML="";  
    //append new one
    fivedayforecast(lat,long);
    
    
    



};
userinput.addEventListener('keyup',()=>{
    //get input
    const input = userinput.value.toLowerCase();
    
    suggestionContainer.innerHTML = ""; //for reset in every press
    //fetch object with names
  
       cities = citieslist;
       const suggestions = cities.filter(city=>{
            return city.name.toLowerCase().startsWith(input);

        });
        suggestions.forEach(suggested => {
            const div = document.createElement('div');
            div.innerHTML = ` <i class="fas fa-map-marker-alt"></i> ${suggested.name}, ${suggested.country}`;
            div.id= `${suggested.coord.lat},${suggested.coord.lon}`
            suggestionContainer.appendChild(div); 
            //insert clicked city to the user input
            div.addEventListener('click',(e)=>{
                
                userinput.value = e.target.innerText; //user input will be the clicked city
                locationgiddeninput.value = e.target.id; //location info will be in the hidden location input and move on to the typedCityLocation func
                
            });



        });
        if(input==='')
        {
        suggestionContainer.innerHTML = ""; 
        }




   


});


searchWeatherBtn.addEventListener('click',typedCityLocation); //when click the search button.


const toCelcius = oldegree =>{

    var celcius = Math.round(parseFloat(oldegree)-273.15);
    return celcius;
};

init(); // will try to find user location and find the weather based the location
