SHELL := /bin/bash

define green
	@tput setaf 2
	@tput bold
	@echo $1
	@tput sgr0
endef

# Build Artifact target
# =====================
BUILD_NUMBER ?= 0
.PHONY: artifact
artifact:
	tar -czf html2pdf_$(BUILD_NUMBER).tar.gz *
	$(call green,"[Create versioned artifact for HTML2PDF code]")
