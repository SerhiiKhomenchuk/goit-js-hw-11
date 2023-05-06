// import SimpleLightbox from "simplelightbox";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const searchQuery = form.searchQuery.value
// console.log(gallery);

form.addEventListener("submit", onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
    fetchImages()
      .then((data) => gallery.innerHTML = createMarkup(data.hits))
        .catch((err) => console.log(err))
  
  
}

function fetchImages() {
    const BASE_URL = "https://pixabay.com/api/"
    const searchParams = new URLSearchParams({
        key: "36056334-58c346fb23a68bf9b46b38280",
        q:"cat",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true
    })
  const URL = `${BASE_URL}?${searchParams}`;
   return fetch(URL).then((resp) => { 
        if (!resp.ok || resp.statusCode === 404) {
           throw new Error(resp.statusText)
        }
        
        return resp.json()
   }) 
}

  
function createMarkup(arrOfImgs) {
  return arrOfImgs.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="gallery">
        <a href="${webformatURL}"><img src="${largeImageURL}" alt="${tags}" loading="lazy" />
        </a>
          <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`
      ).join("")
  
    
}
let simplelightbox = new simpleLightbox('.gallery a');