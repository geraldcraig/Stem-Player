import fontawesome from 'font-awesome/css/font-awesome.min.css'
import Mousetrap from 'mousetrap'
import player from './player.js'


export default {
  components: {},
  props: {
    urls: Array,
    title: String,
  },
  data: function () {
    return {
      isPlaying: false,
      isLoading: false,
      player: Object,
      loaderColor: 'orange',
      loaderHeight: '26px',
      playbackPosition: 0,
      lastplaybackPosition: 0
    }
  },
  mounted: function () {
    Mousetrap.bind('space', this.playpause )
    this.player = new player();
    this.player.playlist.getEventEmitter().on('audiosourcesloaded', this.audioLoaded);
    this.player.playlist.getEventEmitter().on('timeupdate', this.updateTime);
    this.update_tracks();
  },
  beforeDestroy: function () {
    Mousetrap.unbind('space');
    for (var i = 0; i < this.player.playlist.tracks.length; ++i) {
      (function (i) {
      Mousetrap.unbind(String(i + 1));
      })(i);
    }
    this.stop();
    delete this.player;
  },
  methods: {
    update_tracks: function () {
      if(this.isLoading != true) {
        this.saveState()
        this.stop()
        this.isLoading = true
        this.player.loadTracks(this.urls)
        for (var i = 0; i < this.urls.length; ++i) {
            (function (i, e) {
                Mousetrap.bind(String(i + 1), function () {
                  e.player.playlist.getEventEmitter().emit('solo', e.player.playlist.tracks[i])
                });
                Mousetrap.bind(['ctrl+' + String(i + 1), 'meta+' + String(i + 1)], function () {
                  e.player.playlist.getEventEmitter().emit('mute', e.player.playlist.tracks[i])
                });
            })(i, this)
          }
        }
    },
    addTrack: function (url) {
      this.isLoading = true
      this.player.addTrack(url)
    },
    saveState: function () {
      this.lastplaybackPosition = this.playbackPosition
    },
    playpause: function (event) {
      if (this.isPlaying) {
        this.player.playlist.getEventEmitter().emit('pause')
      }
      else {
        this.player.playlist.getEventEmitter().emit('play')
        this.player.playlist.getEventEmitter().on('finished', this.stop);
      }
      this.isPlaying = ! this.isPlaying
      event.stopPropagation();
      return false;
    },
    stop: function () {
      this.player.playlist.getEventEmitter().emit('stop')
      this.isPlaying = false
    },
    toggleMode: function () {
      this.$emit('toggleMode', "foo")
    },
    audioLoaded: function () {
      this.$nextTick(() => this.$refs.playbutton.focus())
      this.isLoading = false
    },
    updateTime: function (playbackPosition) {
      this.playbackPosition = playbackPosition
    },

  },
  watch: {
    urls: {
      handler: 'update_tracks',
      deep: true
    },
  }
}

