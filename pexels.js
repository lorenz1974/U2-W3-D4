// ***********************************************************************//
// FUNCTIONS DEFINITIONS
//
// ***********************************************************************
//

// esegue il fect delle API
const getApiItems = (fetchUrl) => {
    return fetch(fetchUrl, {
        method: 'GET',
        headers: new Headers({
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        }),
    })
        .then((response) => {
            _D(3, 'RESPONSE', response)

            if (response.ok) {
                return response.json()
            } else {

                throw new Error('Errore nella response dal server!')
            }
        })
        .then((apiItems) => {
            return apiItems;
        })
        .catch((err) => {
            console.log(err)
        })
}

// Disegna l'albim delle foto
const drawAlbum = () => {

    // Svuoto l'album
    cardsDiv.innerHTML = ''

    // Eseguo il loop sullì'array delel card
    apiItemsArray.photos.forEach((apiItem) => {

        const newCol = document.createElement('div')
        _D(2, `creating card for: ${apiItem.id} - ${apiItem.alt}`)

        newCol.classList.add('col-md-4')
        newCol.innerHTML = `
                <div id="card-${apiItem.id}" class="card mb-4 shadow-sm">
                    <img
                        id="image-${apiItem.id}"
                        src="${apiItem.src[photoCardResolution]}"
                        class="bd-placeholder-img card-img-top"
                        data-bs-toggle="modal" data-bs-target="#imageModal"
                    />
                    <div class="card-body">
                        <h5 class="card-title">Lorem Ipsum</h5>
                        <p class="card-text">
                            ${apiItem.alt}.
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button
                                    id="view-${apiItem.id}"
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                     data-bs-toggle="modal" data-bs-target="#imageModal"
                                >
                                        View
                                </button>
                                <button id="remove-${apiItem.id}" type="button" class="btn btn-sm btn-outline-secondary">
                                    Hide
                                </button>
                            </div>
                            <small class="text-muted">
                                <a
                                    href="${apiItem.photographer_url}"
                                    target="_blank">
                                        ${apiItem.photographer}
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
                `

        _D(3, `card HTML: ${newCol.innerHTML}`)
        cardsDiv.appendChild(newCol)
    })
}


// Rimuove la card dall'album
// Funzione che rimuove la card dalla pagina
const removeCard = (id) => {
    _D(1, `removeCard: card-${id}`)
    document.getElementById(`card-${id}`).parentElement.classList.add('d-none')
}

const drawModal = (modalId) => {
    const item = apiItemsArray.photos.find((item) => item.id === parseInt(modalId));
    _W(item);

    // Setto il titolo
    document.getElementById('modalTitle').innerHTML = `${item.alt}`

    // Setto il body del modale
    document.getElementById('modalBody').innerHTML = `
        <img src="${item.src.medium}" class="img-fluid">
        <div class="w-50 mx-auto mt-2">
            <p class="m-0 p-0"><span class="fw-bold">Photo Id</span>:</p>
            <p> ${item.id}</p>
            <p class="m-0 p-0"><span class="fw-bold">Width / Heigth</span>:</p>
            <p>${item.width} / ${item.heigth}</p>
            <p class="m-0 p-0"><span class="fw-bold">Photographer</span>:</p>
            <p>${item.photographer}</p>
            <p class="m-0 p-0"><span class="fw-bold">Photographer site</span>:</p>
            <p><a href="${item.photographer_url}" target="_blank">${item.photographer_url}</a></p>
        </div>
    `;

    document.getElementById('imageModal').style.backgroundColor = item.avg_color
};


//
// ***********************************************************************
//
// VARIABLE DEFINITIONS
//
// ***********************************************************************
//

const debugLevel = 3
const apiKey = 'zv3jJj8PimQmSYA0fIqTxg2bj1sG4Yea4V5An70QB3DEcYF57frzB7S5'
const apiBaseUrl = 'https://api.pexels.com/v1/search?query='
const photoCardResolution = 'medium' // small, tiny, large, portrait, ....
let apiItemsArray = {}


//
// ***********************************************************************
//
// MAIN ROUTINE
//
// ***********************************************************************
//

document.addEventListener('DOMContentLoaded', async () => {

    _D(1, 'DOM Loaded')

    const urlSearchParamters = new URLSearchParams(window.location.search)
    const searchTerms = urlSearchParamters.get('q')
    _D(1, `searchTerms: ${searchTerms}`)

    // Eseguo il fetch
    apiItemsArray = await getApiItems(apiBaseUrl + (searchTerms ? searchTerms : '123'))
    _D(3, apiItemsArray, 'apiItemsArray')

    // Disegno l'album di immafini
    drawAlbum()


    // Event listener al click sul body
    document.getElementsByTagName('body')[0].addEventListener('click', (e) => {

        const target = e.target.id
        _D(3, `event is:`, e)

        const targetType = target.split('-')[0]
        _D(1, `targetType is: ${targetType}`)

        const targetId = target.split('-')[1]
        _D(1, `targetId is: ${targetId}`)

        switch (targetType) {
            case 'remove': {
                removeCard(targetId)
                break
            }
            case 'searchButton': {
                location.href = `./pexels-start.html?q=${document.getElementById('searchInput').value}`
                break
            }
            case 'image':
            case 'view': {
                drawModal(targetId)
            }
            default: { break }
        }
    })

    const searchForm = document.getElementById('searchForm')
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
        location.href = `./pexels-start.html?q=${document.getElementById('searchInput').value}`

    })

})