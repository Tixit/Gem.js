## Submitting bugs
Please include the following information to help us reproduce and fix:

* What you did
* What you expected to happen
* What actually happened
* Browser and version
* Example code that reproduces the problem (if possible)
* A failing test (if you're as good as they say you are)

## Making contributions
Want to be listed as a *Contributor*? Before you make a pull request, please do the following:

* Write unit and/or functional tests that validate changes you're making.
* Run unit tests in the latest IE, Firefox, Chrome, Safari and Opera and make sure they pass.
* Rebase your changes onto origin/HEAD if you can do so cleanly.
* If submitting additional functionality, add documentation to the README file.
* Please keep code style consistent with surrounding code.

## Dev Setup
* Make sure you have [NodeJS v0.10](http://nodejs.org/) installed
* Run `npm install` from the project directory

## Testing
* (Local) In the `js/` directory, start up the testServer and bundle watcher with `node testServer`.
   * Note: the bundle will rebuild *automatically* as you change the project while that is running.
* (Any browser, remotely) Open localhost:8100 - if the tests are green, the trap is clean.

## How to submit pull requests:

1. Please create an issue and get my input before spending too much time creating a feature. Work with me to ensure your feature or addition is optimal and fits with the purpose of the project.
2. Fork the repository
3. clone your forked repo onto your machine and run `npm install` at its root
4. If you're gonna work on multiple separate things, its best to create a separate branch for each of them
5. edit!
6. If it's a code change, please add to the unit tests (at test/observer.tests.js) to verify that your change
7. When you're done, run the unit tests and ensure they all pass
8. Commit and push your changes
9. Submit a pull request: https://help.github.com/articles/creating-a-pull-request

