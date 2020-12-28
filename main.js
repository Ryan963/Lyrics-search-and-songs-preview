const results = document.getElementById('results')
const more = document.getElementById('more')
const apiURL = 'https://api.lyrics.ovh'


async function searchsongs(term){
    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()
    displayData(data)
}


function displayData(data){
    let output = ''
    data.data.forEach(song => {
        output += `
        <li>
            <img src="${song.album.cover_medium}">
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


async function getLyrics(artist,title,audio, image){
    const res = await fetch(`${apiURL}/v1/${artist}/${title}`)
    const data = await res.json()
    let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>')
    if (!lyrics){
        lyrics = 'SORRY, LYRICS IS NOT AVAILABLE FOR THIS SONG.'
    }
    results.innerHTML = `
    <h2><strong>${artist}</strong> - ${title}</h2>
    <div class="music-container">
        <div class="music-info">
            <h4 id="title">Song preview</h4>
            <div class="progress-container" id="progress-container">
                <div class="progress" id="progress"></div>
            </div>
        </div>
        <audio crossOrigin="anonymous" src="${audio}" id="audio"></audio>
        <div class="img-container">
            <img src="${image}" alt="music cover" id="cover">
        </div>
        <div class="navigation">
            <button id="prev" class="action-btn">
                <i class="fas fa-backward"></i>
            </button>
            <button id="play" class="action-btn action-btn-big">
                <i class="fas fa-play"></i>
            </button>
            <button id="next" class="action-btn">
                <i class="fas fa-forward"></i>
            </button>
        </div>
    </div>
    <h2>Lyrics</h2>
    <span>${lyrics}</span>`
    more.innerHTML = ''; 
    audioPlayer();
}


function audioPlayer(){
    const musicContainer = document.querySelector('.music-container')
    const playBtn= document.getElementById('play')
    const audioEl = document.getElementById('audio')
    const progressContainer = document.getElementById('progress-container')
    const btnIcon = playBtn.querySelector('.fas')
    const back = document.getElementById('back')
    playBtn.addEventListener('click', () => {
        if (btnIcon.classList.contains('fa-play')){
            playSong(btnIcon, musicContainer,audioEl)
        
        }
        else {
            pauseSong(btnIcon, musicContainer,audioEl)
        }
    })
    audioEl.addEventListener('timeupdate', updateProgress)
    progressContainer.addEventListener('click', setProgress)
    audioEl.addEventListener('ended', () => {
        btnIcon.classList.add('fa-play')
        btnIcon.classList.remove('fa-pause')
        musicContainer.classList.remove('play')
    })

}

function playSong(btnIcon, musicContainer,audioEl){
    btnIcon.classList.remove('fa-play')
    btnIcon.classList.add('fa-pause')
    musicContainer.classList.add('play')
    audioEl.play()
}


function pauseSong(btnIcon, musicContainer,audioEl){
    btnIcon.classList.add('fa-play')
    btnIcon.classList.remove('fa-pause')
    musicContainer.classList.remove('play')
    audioEl.pause()
}

function updateProgress(e){
    const progress = document.getElementById('progress')
    const {duration ,currentTime} = e.srcElement
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`  
}


function setProgress(e){
    const audioEl = document.getElementById('audio')
    const width = this.clientWidth
    const clicked = e.offsetX
    const duration = audioEl.duration
    audioEl.currentTime = (clicked/ width) * duration

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
                getLyrics(artist,songTitle,audio, image);
            }
        })
    })
}

main()
