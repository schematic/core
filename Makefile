
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@if [ "$(TERM)" == "dumb"  ]; then mocha -C ; else mocha -R spec; fi
.PHONY: clean test
