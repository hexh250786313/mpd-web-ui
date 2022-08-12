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
  volume: number
  repeat: boolean
  random: boolean
  single: boolean
  consume: boolean
  partition: string
  playlist: number
  playlistlength: number
  mixrampdb: number
  state: 'pause'
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

export interface IStopStatus {
  repeat: boolean
  random: boolean
  bitrate: string
  single: boolean
  consume: boolean
  partition: string
  playlist: number
  playlistlength: number
  mixrampdb: number
  state: 'stop'
  time: never
  songid: never
  elapsed: never
  volume: never
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
  state: 'play'
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

export type IPlaying = IPlayStatus | IPauseStatus | IStopStatus

export type Tag = 'album' | 'artist' | 'genre' | 'file'

export interface IOptions {
  random: IPlaying['random']
  repeat: IPlaying['repeat']
  single: IPlaying['single']
  consume: IPlaying['consume']
}
