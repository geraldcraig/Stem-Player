import Player from './components/player/Player.vue'

const fs = require('fs')
const path = require('path')
const { dialog } = require('electron').remote

export default {
  components: { Player },
  data: function () {
    return {
      title: 'Open-Unmix',
      tagline: '<i>Open Unmix</i>: an open source music separation baseline for PyTorch',
      audiopath: '',
      selectedTrack: '',
      isLoading: true,
      loaderColor: 'orange',
      file: "",
      loaderHeight: '26px',
      tracks: []
    }
  },
  created: function () {
    this.isLoading = true
    this.selectedTrack = ''
    this.openFile()
  },
  updated: function () {
    this.isLoading = false
  },
  methods: {
    openFile() {
      let self = this;
      dialog.showOpenDialog(
        { 
          properties: ['openDirectory'],
        },
        function(fileNames) {
          if (fileNames === undefined) return;
          
          var fileName = fileNames[0];
          self.audiopath = fileName
          self.updateTracks()
        }
      );
    },
    updateTracks() {
      const audio_root = this.audiopath
      if (name === undefined) {
        return []
      } else {
        const getDirectories = source =>
          fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
        
        this.tracks = getDirectories(audio_root)
      }
    }
  },
  computed: {
    tracklist: function () {
      var trackstoload = []
      if (this.selectedTrack === '') {
        return trackstoload
      } else {
        const track_root = path.join(this.audiopath, this.selectedTrack)
        const getAudios = source =>
          fs.readdirSync(source)
            .filter((dirent) => dirent.match(/\.(wav|m4a|mp4|mp3)(?:\?.*|)$/i))
            .map(dirent => dirent)
        
        const audio_files = getAudios(track_root)
        for (let file of audio_files) {
          trackstoload.push(
            { 'name': path.basename(file, path.extname(file)),
              'customClass': path.basename(file, path.extname(file)),
              'solo': false,
              'mute': false,
              'type': "audio/" + path.extname(file),
              'file': path.join(
                track_root, 
                file
              )
            }
          )
        }
      return trackstoload
      }
    }
  },
}

