VERSION = 0.1.0-beta.0
BROWSERIFY = node ./node_modules/.bin/browserify
MOCHA = ./node_modules/.bin/mocha
UGLIFYJS = ./node_modules/.bin/uglifyjs
CUCUMBER = ./node_modules/.bin/cucumber-js
STUBBY = ./node_modules/.bin/stubby
KARMA = ./node_modules/karma/bin/karma
MOCHA_PHANTOM = ./node_modules/.bin/mocha-phantomjs -s localToRemoteUrlAccessEnabled=true -s webSecurityEnabled=false
BANNER = "/*! bock - v$(VERSION) - MIT License - https://github.com/h2non/bock */"

default: all
all: test
browser: banner browserify uglify
test: browser mocha
test-browser: karma

banner:
	@echo $(BANNER) > bock.js

browserify:
	$(BROWSERIFY) \
		--exports require \
		--standalone bock \
		--entry ./lib/index.js > ./bock.js

uglify:
	$(UGLIFYJS) bock.js --mangle --preamble $(BANNER) --source-map bock.min.js.map --source-map-url http://cdn.rawgit.com/h2non/bock/$(VERSION)/bock.min.js.map > bock.min.js

mocha:
	$(MOCHA) --reporter spec --ui tdd test/utils test/store

loc:
	wc -l bock.js

karma:
	$(KARMA) start

gzip:
	gzip -c bock.min.js | wc -c

publish: browser
	git push --tags origin HEAD:master
