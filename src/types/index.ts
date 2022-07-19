/**
 * Example
 * ```typescript
 * const song = {
 *   file: 'Intro-周杰伦-226555042.flac',
 *   last_modified: '2022-07-15T06:10:25Z',
 *   format: {
 *     sample_rate: 48000,
 *     bits: 24,
 *     channels: 2,
 *     sample_rate_short: {
 *       value: 48,
 *       unit: 'kHz',
 *     },
 *     original_value: '48000:24:2',
 *   },
 *   title: 'Intro',
 *   artist: '周杰伦',
 *   album: '最伟大的作品',
 *   time: 30,
 *   duration: 29.813,
 *   pos: 0,
 *   id: 1,
 * }
 * ```
 *  */
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
  artist: string
  album: string
  time: number
  duration: number
  pos: number
  id: number
}

/**
 * Example
 * ```typescript
 * const pauseStatus = {
 *   repeat: false,
 *   random: false,
 *   single: false,
 *   consume: false,
 *   partition: 'default',
 *   playlist: 2,
 *   playlistlength: 9,
 *   mixrampdb: 0,
 *   state: 'stop',
 * }
 * ```
 *  */
export interface IPauseStatus {
  repeat: boolean
  random: boolean
  single: boolean
  consume: boolean
  partition: string
  playlist: number
  playlistlength: number
  mixrampdb: number
  state: string
}

/**
 * Example
 * ```typescript
 * const playStatus = {
 *   volume: 100,
 *   repeat: false,
 *   random: false,
 *   single: false,
 *   consume: false,
 *   partition: 'default',
 *   playlist: 2,
 *   playlistlength: 9,
 *   mixrampdb: 0,
 *   state: 'play',
 *   song: 8,
 *   songid: 9,
 *   time: {
 *     elapsed: 2,
 *     total: 258,
 *   },
 *   elapsed: 2.091,
 *   bitrate: '949',
 *   duration: 257.84,
 *   audio: {
 *     sample_rate: 48000,
 *     bits: 24,
 *     channels: 2,
 *     sample_rate_short: {
 *       value: 48,
 *       unit: 'kHz',
 *     },
 *     original_value: '48000:24:2',
 *   },
 * }
 * ```
 *  */

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
  state: string
  song: number
  songid: number
  time: {
    elapsed: number
    total: number
  }
  elapsed: number
  bitrate: string
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

export type IStatus = IPlayStatus
