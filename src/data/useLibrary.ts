import libraryData from './library.json'
import type { Library } from '../types/library'

export function useLibrary(): Library {
  return libraryData as Library
}
