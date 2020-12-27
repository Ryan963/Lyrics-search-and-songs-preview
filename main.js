const results = document.getElementById('results')
const more = document.getElementById('more')
const apiURL = 'https://api.lyrics.ovh'


async function searchsongs(term){
    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()
    console.log(data)
    displayData(data)
}


function displayData(data){
    let output = ''
    data.data.forEach(song => {
        output += `
        <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}"
            data-songtitle="${song.title}" data-audio="${song.preview}" data-image="${song.album.cover_medium}">Get Lyrics</button>
        </li>`
    })
    results.innerHTML = `<ul class = "songs">${output}</ul>`
    if (data.prev || data.next) {
        more.innerHTML = `
          ${
            data.prev
              ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
              : ''
          }
          ${
            data.next
              ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
              : ''
          }`
    }
    else {
        more.innerHTML = ''
    }
}

async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json()
    displayData(data)    
}


function getLyrics(artist,title){
    fetch(`${apiURL}/v1/${artist}/${title}`).then(res => res.json())
    .then(data => {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>')
        results.innerHTML = `
        <h2><strong>${artist}</strong> - ${title}</h2>
        <span>${lyrics}</span>`
        more.innerHTML = '';
    })
    

}

function main(){
    const search = document.getElementById('search')
    const form = document.getElementById('form')   
    form.addEventListener('submit', e => {
        e.preventDefault();
        const searchTerm = search.value.trim();

        if(!searchTerm){
            alert('please type a search term')
        }
        else {    
            searchsongs(searchTerm)
        }
        results.addEventListener('click', e => {
            const clickedEl = e.target;
            if (clickedEl.tagName === 'BUTTON'){
                const artist = clickedEl.getAttribute('data-artist')
                const songTitle = clickedEl.getAttribute('data-songtitle')
                const audio = clickedEl.getAttribute('data-audio')
                const image = clickedEl.getAttribute('data-image')
                getLyrics(artist,songTitle);
            }
            else {
                
            }
        })


    })
}
main()