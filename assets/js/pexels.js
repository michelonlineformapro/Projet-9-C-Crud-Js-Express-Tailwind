const photoParent = document.getElementById('photoParent')

const container = document.querySelector(".container");
let cardTag;
function getPhotos(images) {
    images.map(image => {
        cardTag = `<div class="card">
              <img src=${image.src.tiny} />
         </div>`;
        container.innerHTML += cardTag;
    })
}
fetch("https://api.pexels.com/v1/search?query=people",{
    headers: {
        Authorization: "563492ad6f91700001000001323617dce42f4d108b138098430fad44"
    }
})
    .then(resp => {
        return resp.json()
    })
    .then(data => {
        getPhotos(data.photos);
    })

