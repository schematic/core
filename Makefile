
build: 
	browserify index.js -o build/build.js


clean:
	rm -fr build components template.js

test:
	if [ "$(TERM)" == "dumb"  ]; then ./node_modules/.bin/mocha -C --ui bdd --require "better-stack-traces/register"; else ./node_modules/.bin/mocha --ui bdd --require "better-stack-traces/register"; fi

all: build test
	@echo "♬   It's the latest revision \n♬   Hot and fresh out the kitchen  "

.PHONY: clean test all build
