# tsvToJson
nodejs fiddling for converting tsv files to json

This is synchronous, because it is intended to run either at node server
startup before requests start being served, or as a separate dedicated 
entry point (tbd).

It is not terribly memory-friendly or performant, and is more a 
proof-of-concept than production-ready code. It is expected to be
used at most for a proof-of-concept placeholder application until
the actual live data store is ready. If it were ever to be used in
actual production at scale, all assumptions should be revisited.

The code (which is fairly brittle) expects data files to live in
a "static_data" folder under the node application root directory.
It searches that directory for files with a .tsv extension. If such
a file is found, its timestamp is compared to any existing .json file
with the same filename. If there is no such .json file, or if the
.tsv file is newer than the .json file (based on file modified times),
then the a .json file is created containing the equivalent transformed
data from the .tsv file. This overwrites any existing .json file of
the same name.

