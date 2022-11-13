import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const inputRef = document.querySelector("input");
const formRef = document.querySelector('.search-form');
formRef.setAttribute('style', 'display: flex;justify-content: center;align-items: center;padding: 30px 0; gap: 5px;');
const galleryRef = document.querySelector(".gallery");
galleryRef.setAttribute('style', 'display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;')
const loadBtn = document.querySelector(".load-more");
loadBtn.setAttribute("style", "display: none;");

const option = {
    key: "31277754-8952e55c2ce1852b40f45b8fd",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: "40"
}



let page;

formRef.addEventListener("submit", (event) => {
    event.preventDefault();
    let photoName = inputRef.value;
    page = 1;
    galleryRef.textContent = "";
    option.per_page = "40";
    urlResponse(photoName, page);
    loadBtn.setAttribute("style", "display: block; margin: 30px auto; gap: 5px;")
})

loadBtn.addEventListener("click", () => {
    galleryRef.textContent = "";
    let photoName = inputRef.value;
    page += 1;
    urlResponse(photoName, page);

})


async function urlResponse(photoName, page) {
    let photoesResponse = await axios.get(`https://pixabay.com/api/?key=${option.key}&q=${photoName}&image_type=${option.image_type}&orientation=${option.orientation}&safesearch=${option.safesearch}&per_page=${option.per_page}&page=${page}`);
    let photoesArr = photoesResponse.data.hits;
    basicLightbox.refresh();

    if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${photoesResponse.data.totalHits} images.`)
    }

    if (photoesArr.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query.Please try again.")
    } else {
        let markap = photoesArr.map((photo) => {
            return `<div class="photo-card">
                <a href="${photo.largeImageURL}">
                <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" width="150px" height="100px"/>
            </a>
                <div class="info">
                <p class="info-item">
                    <b>Likes: ${photo.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${photo.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${photo.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${photo.downloads}</b>
                </p>
            </div>
            </div>`
        }).join("")
        galleryRef.insertAdjacentHTML("beforeend", markap)
        if (photoesResponse.data.totalHits < (parseInt(option.per_page) * page)) {
            loadBtn.setAttribute("style", "display: none");
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }
    }
    const basicLightbox = new SimpleLightbox('.gallery a', {
        close: false,
        overlayOpacity: 1,
        captionsData: "alt",
    });

}

