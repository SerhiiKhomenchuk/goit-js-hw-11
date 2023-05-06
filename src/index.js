// import SimpleLightbox from "simplelightbox";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
let searchQuery = form.searchQuery.value
const guard = document.querySelector('.js-guard');
// console.log(gallery);
const page = 1;
const per_page = 40;
form.addEventListener("submit", onSubmit);
const litebox = new SimpleLightbox('.some-element a');
function onSubmit(evt) {
  evt.preventDefault();
  searchQuery = evt.target.elements.searchQuery.value.trim();
  // console.log(searchQuery);
    fetchImages()
      .then((data) =>
        {if (!data.length) {
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
        }
        gallery.innerHTML = createMarkup(data.hits);

      })
      .catch((err) => console.log(err))
  
  
}

function fetchImages() {

    const BASE_URL = "https://pixabay.com/api/"
    const searchParams = new URLSearchParams({
        key: "36056334-58c346fb23a68bf9b46b38280",
        q:`${searchQuery}`,
        image_type: "photo",
        orientation: "horizontal",
      safesearch: true,
      page: `${page}`,
        per_page:`${per_page}`
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
    `<div class="photo-card">
        <a  href="${webformatURL}"><img class = "image" src="${largeImageURL}" alt="${tags}" loading="lazy" />
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
