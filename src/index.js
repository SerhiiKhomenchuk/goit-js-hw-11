
import simpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from "notiflix";
import axios from "axios";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
let searchQuery = form.searchQuery.value
const guard = document.querySelector('.js-guard');

let page = 1;
const per_page = 40;
const options = {
  root: null,
  rootMargin: '500px',
  threshold: 0.0,
};
const observer = new IntersectionObserver(onInfinityScroll, options);
const lightbox = new simpleLightbox('.gallery a', {
    doubleTapZoom: 1.5,
    captionsData: "alt",
    captionDelay: 250
});

form.addEventListener("submit", onSubmit);
async function onSubmit(evt) {
  try {
    evt.preventDefault();
  page = 1;
  gallery.innerHTML =""
  searchQuery = evt.target.elements.searchQuery.value.trim();
  observer.unobserve(guard);
  if (!searchQuery) {
    Notiflix.Notify.failure('Please, enter query!');
    return;
  }
    
    const response = await fetchImages();
    const { hits, totalHits } = response;
     if (!hits.length) {
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
      gallery.innerHTML =""
        return
     }
    if (hits) {
        gallery.innerHTML = '';
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      lightbox.refresh();
    }
    if (page !== totalHits) {
        
        observer.observe(guard);
      }
        gallery.innerHTML = createMarkup(hits);

    

  } catch (error) {
    console.error(error);
    
  }
  
}




async function fetchImages() {

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
    try {
    const resp = await axios.get(URL);
    const { data } = resp;
   
  return data;
  } catch (error) {
    console.error(error);
  }
   
}

function onInfinityScroll(entries, observer) {
  entries.forEach(async (entry) => {
    try {
      if (entry.isIntersecting) {
        page += 1;
                
        const response = await fetchImages(page);
        const { hits,totalHits } = response;
        gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
        lightbox.refresh();
        const totalPages = Math.ceil(totalHits / per_page);
        if (page === totalPages) {
          observer.unobserve(guard);
          Notiflix.Notify.info(
            'We are sorry, but you have reached the end of search results.'
          );

        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  );
}

 

function createMarkup(arrOfImgs) {
  return arrOfImgs.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
        <a  href="${webformatURL}" class="gallery-link"><img class = "image" src="${largeImageURL}" alt="${tags}" loading="lazy" />
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