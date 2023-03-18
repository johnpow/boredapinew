const url = 'https://www.googleapis.com/youtube/v3/search';
let API_KEY;

let use_youtubeAPI = confirm('Do you want to use API KEY?'); //false will pull up a default set of video to conserve API KEY limit -- true will query actual YouTube API (100 queries per day per key)

if (use_youtubeAPI) {API_KEY = keys.jo};


//query parameters -- vanilla javascript but could do JQuery
const $searchBtn = document.getElementById('searchBtn');
const $container = document.querySelector('.container');
var carousel = document.querySelector(".carouselbox");
var next = carousel.querySelector(".next");
var prev = carousel.querySelector(".prev");
var index = 0;
var currentImage;
let data = {};
var submitOption = document.getElementById("submit-option");
var showValue = document.getElementById("user-form");
let buttonHist = JSON.parse(localStorage.getItem("searchHist"));
const searchButHist = document.getElementById("oldsearch");
const stashMe = document.getElementById("yessur");
let boredActivity;
let carouselVideo;
let videoName;

// Function to display selected value on screen
function handleSubmit(event) {
  let customURL = '?';
  let selectedOption = document.forms["user-form"].acttype.value;
  let selectedOption2 = document.forms["user-form"].people.value;
  let selectedOption3 = document.forms["user-form"].supdog.value;

  if (selectedOption !=='any') {
    customURL = customURL+ 'type='+ selectedOption;
  }

  if (selectedOption2 ==='solo') {
    customURL = customURL+ '&maxparticipants=1';
  } else if (selectedOption2 ==='group') {
    customURL = customURL+ '&minparticipants=2';
  }

  if (selectedOption3 ==='free') {
    customURL = customURL+ '&maxprice=0.09';
  } else if (selectedOption3 ==='paid') {
    customURL = customURL+ '&minprice=0.1';
  }


  callBoredAPI(customURL);

}
//This Bored API will produce a random activity based on as many parameters as desired
const callBoredAPI = function(customURL) {

  $container.innerHTML = "";

  fetch(`https://www.boredapi.com/api/activity${customURL}`)
    .then(function (response) {
      return response.json();
  })
    .then(function (boredapi) {

      if (boredapi.activity === undefined) {
        const activityName = document.createElement('h1');
        activityName.textContent = 'Try again, no activity found';
        $container.appendChild(activityName);
        return;
      }

    // Create a header with the activity
      const activityName = document.createElement('h1');
      boredActivity =  boredapi.activity;
      activityName.textContent = 'Activity: ' + boredActivity;
      $container.appendChild(activityName);
    // Temporary text to understand details about the activity
      const info = document.createElement('p');
      info.textContent = 'boredapi: participants: ' + boredapi.participants + ' | ' + 'price: ' + boredapi.price + ' | ' + 'type: ' + boredapi.type + ' | ' + 'accessibility: ' + boredapi.accessibility;
      $container.appendChild(info);
        // helps determine whether to call youtube api or dummy api
    


      if (use_youtubeAPI) {
      callYoutubeAPI(boredapi);
      } else {
        dummyYoutube(boredapi);
      }


    })};

// Youtube API limited to 100 per day under same API key, searches exact text of bored API
const callYoutubeAPI = function(boredapi) {

  fetch(`${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (newdata) {
      // console.log(`${url}?key=${API_KEY}&type=video&part=snippet&maxResults=10&q=${boredapi.activity}`)
      data = newdata;

    showVideos(data);


    })};

// dummy object of data containing videos 
const dummyYoutube = function() {
      data = {
        items: [
        {id: {videoId:'5iZltDLFOfo'},
         snippet: {title:'Placeholder 1'}},
        {id: {videoId:'iC5dWobPSik'},
        snippet: {title:'Placeholder 2'}},
        {id: {videoId:'AArJoXSxzrM'},
        snippet: {title:'Placeholder 3'}},
        {id: {videoId:'PPG1-CqAghA'},
        snippet: {title:'Placeholder 4'}},
        {id: {videoId:'ofVXzHwx6Fk'},
        snippet: {title:'Placeholder 5'}},
        {id: {videoId:'kuY2nWj_EhA'},
        snippet: {title:'Placeholder 6'}},
        {id: {videoId:'LGYEE4Jjpkc'},
        snippet: {title:'Placeholder 7'}},
        {id: {videoId:'LAn0e2DOOnI'},
        snippet: {title:'Placeholder 8'}},
        {id: {videoId:'ypEcwmvUgR8'},
        snippet: {title:'Placeholder 9'}},
        {id: {videoId:'PznJqxon4zE'},
        snippet: {title:'Placeholder 10'}},]};

        showVideos(data);
};
 
// show videos
const showVideos = function(data) {

    // create header Videos that may inspire you
      const inspireVideos = document.createElement('h2');
      inspireVideos.textContent = 'Videos that may inspire you';
      $container.appendChild(inspireVideos)

    //loop through videos and create an embeded video for each (currently 10)
    navigate(0);
    
    };
    
function navigate(direction) {
      index = index + direction;
      if (index < 0) { 
        index = data.items.length - 1;
      } else if (index > data.items.length - 1) { 
        index = 0;
      }
      currentImage = data.items[index];
      carouselVideo = document.querySelector(".videoNew");
      carouselVideo.setAttribute('src', `https://www.youtube.com/embed/${currentImage.id.videoId}`)
      videoName = currentImage.snippet.title;
      
    }
    
    carousel.addEventListener("click", function() {
      window.location.href = data[index];
    });
    
    next.addEventListener("click", function(event) {
      event.stopPropagation();
      navigate(1);
    });
    
    prev.addEventListener("click", function(event) {
      event.stopPropagation();
      navigate(-1);
    });
 

const renderSearch = function () {

      searchButHist.innerHTML='';
    
      if (buttonHist !== null) {
        buttonHist.forEach(function (item,i) {
          const pastActList = document.createElement('li');
          const pastActObj = document.createElement('a');
          pastActObj.textContent = `Activity: ${item[0]} | (Video: ${item[2]})`;
          pastActObj.setAttribute('href',item[1])
          pastActObj.setAttribute('target','_blank');

          pastActList.setAttribute("data-index", i);

          var button = document.createElement("button");
          button.textContent = "Remove ✔️";
          pastActList.appendChild(button);

          pastActList.appendChild(pastActObj);
          searchButHist.appendChild(pastActList);
        });
      } else {
        buttonHist = [];
      }
    };
renderSearch();


const keepMe = function () {
  buttonHist.unshift([boredActivity,carouselVideo.getAttribute('src'),videoName]);
  storeSearch();
  renderSearch();
};


const storeSearch = function () {
  localStorage.setItem("searchHist", JSON.stringify(buttonHist))
};

searchButHist.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    buttonHist.splice(index, 1);

    storeSearch();
    renderSearch();
  }
});

$searchBtn.addEventListener('click', handleSubmit);
stashMe.addEventListener('click', keepMe);


