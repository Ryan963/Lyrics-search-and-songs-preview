# Lyrics-search-and-songs-preview
You can search for any song by typing the name of the song or the artist in the search bar
the search results will display all the songs that contain the search keyword 
To go to the next or previous set of results press next/prev buttons at the bottom of the page. 
To display the lyrics and be able to play 30 seconds of the song press the get lyrics button under 
the song image and you will get a music player to play a preview of the song. 
The project uses a custom music player with an animation on the logo picture. 
This custom player works like any other music player where you can skip/pause/play the song
under the music player there will be the lyrics of the song
# Note
The ovh api is having some problems when fetching the lyrics or the music of the song so it might show that 
lyrics is not available for the song and the same for the audio of the song. 
I researched this issue and it turned out to be an ssl state error so the page that contains the 
lyrics or audio is insecure so the browser is blocking it sometimes because of a mismach between
the certificate name and the browser name.However the app will work fine if I run it from an html5 file. 
Sorry for the incovinience.
