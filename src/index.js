
// import SimpleLightbox from "simplelightbox"
// import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import axios from "axios";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
let searchQuery = form.searchQuery.value
const guard = document.querySelector('.js-guard');
// console.log(gallery);
let page = 1;
const per_page = 40;
// var litebox = new SimpleLightbox('.some-element a');

const options = {
  root: null,
  rootMargin: '500px',
  threshold: 0.0,
};
const observer = new IntersectionObserver(onInfinityScroll, options);

form.addEventListener("submit", onSubmit);
function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML =""
  searchQuery = evt.target.elements.searchQuery.value.trim();
  // console.log(searchQuery);
    fetchImages()
      .then((data) => {
        if (!data.hits.length) {
        Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
      gallery.innerHTML =""
        return  
        }
        if (data.hits) {
        gallery.innerHTML = '';
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        // simpleLightbox.refresh();
        }
        if (page !== data.totalHits) {
        console.log(page);
        console.log(data.totalHits);
        observer.observe(guard);
      }
        gallery.innerHTML = createMarkup(data.hits);

      })
      .catch((err) => console.log(err))
  
  
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
    console.log(resp);
  return data;
  } catch (error) {
    console.error(error);
  }
   
}

 function onInfinityScroll(entries, observer) {
  entries.forEach(entry => {
    
    if (entry.isIntersecting) {
      page += 1;
      console.log(entry);
      fetchImages(page).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        // simpleLightbox.refresh();

        const totalPages = Math.ceil(data.totalHits / per_page);
        if (page === totalPages) {
          console.log("the end");
          observer.unobserve(guard);
          Notiflix.Notify.info(
            'We are sorry, but you have reached the end of search results.'
          );
        }
      }).catch(err => console.log(err));
    }
  });
 }

function createMarkup(arrOfImgs) {
  return arrOfImgs.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
    `<div class="photo-card">
        <a  href="${webformatURL} class="gallery-link"><img class = "image" src="${largeImageURL}" alt="${tags}" loading="lazy" />
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
let litebox = new SimpleLightbox(".gallery .gallery-link", {
      // enableKeyboard,
      captionDelay: 250,
      captionsData: "alt",
      

   
})