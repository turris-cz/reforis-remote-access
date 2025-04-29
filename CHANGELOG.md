# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2025-04-29

### Added

- Added & updated Weblate translations

### Changed

- Updated dependencies in package.json
- Fixed webpack configuration for process/browser.js
- Re-resolved and re-locked all npm dependencies in package-lock.json

## [2.1.0] - 2024-07-03

### Changed

- Update dependencies in package.json
- Update Foris JS library to v6.0.2
- Update .gitignore to exclude .ruff_cache/ directory
- NPM audit fix

## [2.0.0] - 2024-03-13

### Added

- Added & updated Weblate translations
- Added data-testid attributes to form buttons

### Changed

- Updated dependencies in package.json
- Updated Node.js to v21.x in Makefile
- Updated ESLint and Prettier configurations
- Updated .gitignore to exclude minified JS files and license files
- Updated webpack.config.js with process/browser alias
- Updated CI to use shared scripts, build and publish python package
- Replaced Pylint & Pycodestyle for Ruff
- Restructured & updated Makefile
- Changed build system to Hatch
- Fixed translation messages strings
- NPM audit fix

### Removed

- Removed MANIFEST.in file

## [1.3.0] - 2021-07-29

- Add fluid layout support
- Add & update translations
- Refine texts & Tokens table
- Restructure headings
- Integrate ESLint + Prettier + reForis styleguide
- Update Foris JS library to v5.1.13
- Fix python dependencies
- NPM audit fix
- Other small improvements

## [1.2.1] - 2021-03-03

- Add new translations
- Remove duplicated language file for Norwegian Bokmål
- Add Gitlab repository & description
- Fix obsolete GitLab links
- NPM audit fix

## [1.2.0] - 2020-03-30

- Update ForisJS v4.5.0.
- NPM update packages & audit fix.

## [1.1.1] - 2020-03-03

- Fix token downloading.

## [1.1.0] - 2020-02-18

- Update Foris JS to 3.4.0.
- npm fix audit.
- Add translations.
- Improve Makefile.

## [1.0.1] - 2020-01-10

- Bumped version of Foris JS library
- Improved API tests

## [1.0.0] - 2019-12-03

## [0.2.1] - 2019-11-26

- Changed build directory to `js` instead of root

## [0.2.0] - 2019-11-21

- Renamed plugin to "Remote Access" (previously called "Subordinates")

## [0.1.0] - 2019-11-20

- Mange certificate authority
- Configure remote access

[unreleased]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v2.2.0...master
[2.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v2.1.0...v2.2.0
[2.1.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v2.0.0...v2.1.0
[2.0.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.3.0...v2.0.0
[1.3.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.2.1...v1.3.0
[1.2.1]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.2.0...v1.2.1
[1.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.1.1...v1.2.0
[1.1.1]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.1.0...v1.1.1
[1.1.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.0.1...v1.1.0
[1.0.1]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v1.0.0...v1.0.1
[1.0.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v0.2.1...v1.0.0
[0.2.1]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v0.2.0...v0.2.1
[0.2.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/compare/v0.1.0...v0.2.0
[0.1.0]: https://gitlab.nic.cz/turris/reforis/reforis-remote-access/-/tags/v0.1.0
