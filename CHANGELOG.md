# Changelog

## [0.2.0](https://github.com/dchernykh1984/AmazfitRaceStats/compare/amazfit-race-stats-v0.1.0...amazfit-race-stats-v0.2.0) (2026-07-20)


### Features

* add round 480 and square 390 device targets ([7a337f0](https://github.com/dchernykh1984/AmazfitRaceStats/commit/7a337f04c900f1818ab824c0f95e293bf8e81470))
* add the phone settings screen for site, competition, bib and rows ([e2c2b1c](https://github.com/dchernykh1984/AmazfitRaceStats/commit/e2c2b1cea9da2ba5a26e848d5b96be029d1c95a2))
* add the pure race-stats formatter with unit tests ([92f8349](https://github.com/dchernykh1984/AmazfitRaceStats/commit/92f83497696368297f24eb29bac5ee1805752253))
* add the request-url builder and device-language resolver with tests ([d2246db](https://github.com/dchernykh1984/AmazfitRaceStats/commit/d2246dbfcbe9052d4cfabb72a4f0e87d098e73f6))
* arrange fields in a round diamond / square grid (up to 10) ([22c7b63](https://github.com/dchernykh1984/AmazfitRaceStats/commit/22c7b63d0d2cb6ce093e1777677f7c77d0988092))
* default competition/bib to demo race, fix empty settings fields ([a6e215c](https://github.com/dchernykh1984/AmazfitRaceStats/commit/a6e215c49fc991443d2b1fd8c15d532752b910b6))
* drop unknown stats keys in the side service ([b7eeec4](https://github.com/dchernykh1984/AmazfitRaceStats/commit/b7eeec493fcaecb75d9ade8986b05e5a1c912f2e))
* fetch race stats from the timing site in the side service ([c3268d8](https://github.com/dchernykh1984/AmazfitRaceStats/commit/c3268d8212150d70dbb3f727367b0c824f2831d0))
* hide the square status bar and allow up to 10 fields on it ([c66b791](https://github.com/dchernykh1984/AmazfitRaceStats/commit/c66b7919452f1698c8c488ca514f5fc40fe295aa))
* localize metric labels into 11 languages with a completeness test ([4364a47](https://github.com/dchernykh1984/AmazfitRaceStats/commit/4364a4741207d75adf75e18b3b59b10d06f54ca5))
* scaffold the mini app and render metrics on the round screen ([736f4b3](https://github.com/dchernykh1984/AmazfitRaceStats/commit/736f4b3907b751fb829dbf8acd929dcb1dcceb77))


### Bug Fixes

* always reply to an unexpected side-service request ([3be8cc1](https://github.com/dchernykh1984/AmazfitRaceStats/commit/3be8cc1453f7aa9d5d15e70abac1a2b4fe9cb2f0))
* keep the last standings on screen when a stats fetch fails ([a0bd624](https://github.com/dchernykh1984/AmazfitRaceStats/commit/a0bd624917f40aa48212f078d46f3be496c9bff6))
* make the app buildable with the Zeus CLI ([8bab34f](https://github.com/dchernykh1984/AmazfitRaceStats/commit/8bab34f37e89ee87069966321d8f0847bde24154))
* prevent caption and value overlap and post-destroy redraws ([87bba77](https://github.com/dchernykh1984/AmazfitRaceStats/commit/87bba77a3459ace6c3175bc951e0ce329b4d6892))
* show the placeholder immediately so the screen is never blank ([b120e57](https://github.com/dchernykh1984/AmazfitRaceStats/commit/b120e576fe2d08a5914cbfac721d06912ea136bd))
* skip a refresh while a request is still in flight ([1a5d8c1](https://github.com/dchernykh1984/AmazfitRaceStats/commit/1a5d8c172f602fea750db47a7e009ec7fe36adae))
* survive a missing getLanguage and never blank on empty rows ([91ee31b](https://github.com/dchernykh1984/AmazfitRaceStats/commit/91ee31b1a518de46309ac5626def64e2f0dc0760))
* treat an empty row-count setting as unset ([d2ec08e](https://github.com/dchernykh1984/AmazfitRaceStats/commit/d2ec08e81ddb32ffa27f87f3d89df7bb5580b840))
