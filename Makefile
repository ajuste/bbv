COFFEE = ./node_modules/coffee-script/bin/coffee

usage:
	@echo ''
	@echo 'make compile: Compile sources'
	@echo 'make build: Compile sources and generates minimized bundle'
	@echo ''

# --

# Compile Assets
.PHONY: compile
compile:
	[ -d ./lib ] && rm -r ./lib || 0
	@$(COFFEE) --no-header -cbo ./lib ./src

# Build bundle
build: compile
	gulp build
