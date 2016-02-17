SHELL := /bin/bash

define green
	@tput setaf 2
	@tput bold
	@echo $1
	@tput sgr0
endef

# Build Artefact target
# =====================
BUILD_NUMBER ?= 0
.PHONY: artefact
artefact:
	tar -czf html2pdf_$(BUILD_NUMBER).tar.gz *
	$(call green,"[Create versioned artefact for HTML2PDF code]")
