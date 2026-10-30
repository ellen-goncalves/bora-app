// Fallback for tooling that does not resolve platform extensions.
// Metro uses matchStorage.web.ts on web and matchStorage.native.ts on Android/iOS.
export { loadMatches, saveMatches } from './matchStorage.web';
