#/bin/sh

if [ $TERM == "dumb" ]; then
  mocha -C -R spec
else
  mocha -R spec
fi
