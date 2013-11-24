
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@if [ "$(TERM)" == "dumb"  ]; then ./node_modules/.bin/mocha -C; else ./node_modules/.bin/mocha; fi
.PHONY: clean test
