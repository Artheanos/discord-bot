import { downloadSong } from "../youtubeDownloader";
import { AudioPlayerState, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { AudioPlayerWrapper } from "./AudioPlayerWrapper";


export class TrackScheduler {
  songs: string[] = []

  constructor(private readonly playerWrapper: AudioPlayerWrapper) {
  }

  get player() {
    return this.playerWrapper.getPlayer()
  }

  async enqueue(url: string) {
    const outputPath = await downloadSong(url)
    this.songs.push(outputPath)
    if (!this.isPlaying()) {
      this.playNext()
    }
  }

  playNext() {
    const player = this.player
    if (player) {
      const nextSong = this.songs.shift()
      if (nextSong) {
        player.play(createAudioResource(nextSong))
      }
    }
  }

  skip() {
    // const player = this.player
    // if (player) {
    //   if (this.songs.length) {
    //     this.playNext()
    //   } else {
    //     player.stop()
    //   }
    // }
  }

  onPlayerStateChange(newState: AudioPlayerState) {
    if (newState.status === AudioPlayerStatus.Idle) {
      this.playNext()
    }
    console.log(newState.status)
  }

  private isPlaying() {
    return this.player?.state.status === AudioPlayerStatus.Playing;
  }
}
