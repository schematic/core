TARGET ?= ./build/schematic.js
BIN := ./node_modules/.bin
BROWSERIFY ?= $(BIN)/browserify
SOURCES := index.js $(wildcard ./lib/*.js) $(wildcard ./types/*.js) $(wildcard ./errors/*.js)
TESTRUNNER ?= $(BIN)/mocha
TESTLING ?= $(BIN)/testling
REPORTER ?= dot
TESTFILES := $(wildcard ./test/*.js)
PUBLISHMODES := major minor patch premajor preminor prepatch prelease
PUBLISHCOMMANDS := $(addprefix publish-, $(PUBLISHMODES))
NODE_ENV ?= development

# special flags for mocha
TESTFLAGS += --ui=bdd --require="better-stack-traces/register" --reporter=$(REPORTER)
ifeq ($(TERM), dumb)
	TESTFLAGS += --no-colors
	REPORTER = dot
endif



all: build test
	@echo "♬   It's the latest revision \n♬   Hot and fresh out the kitchen"

# prevents npm install from running unless package.json has been modified
node_modules: package.json
	npm install $(NPMFLAGS)

# just an alias for node_modules
deps: node_modules

$(TARGET): deps $(SOURCES)
	$(BROWSERIFY) --outfile=$(TARGET) $(FLAGS) ./

# alias for make $(TARGET)
# also makes it so we only run browserify
# if the source files are modified
build: $(TARGET)

test: deps $(SOURCES) $(TESTFILES)
	$(TESTRUNNER)  $(TESTFLAGS)

test-browser: deps $(SOURCES) $(TESTFILES)
	$(TESTLING) $(TESTLINGFLAGS)

test-all: test test-all

lint: $(SOURCES) $(TESTFILES)
	jshint $(SOURCES) $(TESTFILES)
	jscs $(SOURCES) $(TESTFILES)

clean:
	rm $(TARGET)

clean-deps:
	rm -rf ./node_modules

clean-all: clean clean-deps

$(PUBLISHCOMMANDS): lint build test-all
	$(eval VERSION=$(subst publish-,,$@))
	@echo Publishing $(VERSION) release to github and npm
	npm version $(VERSION)
	git push origin master
	@#npm publish



.PHONY: clean clean-deps clean-all test test-all test-browser all build example deps $(PUBLISHCOMMANDS)
