export interface ISong {
  file: string
  last_modified: string
  format: {
    smaple_rate: number
    bits: number
    channels: number
    sample_rate_short: {
      value: number
      unit: string
    }
    original_value: string
  }
  title: string
  artist: string[]
  album: string
  time: number
  duration: number
  pos: number
  id: number
}

export interface IPauseStatus {
  repeat: boolean
  random: boolean
  single: boolean
  consume: boolean
  partition: string
  playlist: number
  playlistlength: number
  mixrampdb: number
  state: 'play' | 'pause' | 'stop'
  time: never
  songid: never
  elapsed: never
  bitrate: never
}

export interface IPlayStatus {
  volume: number
  repeat: boolean
  random: boolean
  single: boolean
  consume: boolean
  partition: string
  playlist: number
  playlistlength: number
  mixrampdb: number
  state: 'play' | 'pause' | 'stop'
  song: number
  songid: number
  bitrate: string
  time: {
    elapsed: number
    total: number
  }
  elapsed: number
  duration: number
  audio: {
    sample_rate: number
    bits: number
    channels: number
    sample_rate_short: {
      value: number
      unit: string
    }
    original_value: string
  }
}

export type IPlaying = IPlayStatus | IPauseStatus

export type Tag = 'album' | 'artist' | 'genre' | 'file'
