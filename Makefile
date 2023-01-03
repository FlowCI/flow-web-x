

NPM_CLEAN    	:= npm ci
NPM_BUILD    	:= npm run build

CURRENT_DIR 	:= $(shell pwd)

DOCKER_VOLUME	:= -v $(CURRENT_DIR):/ws
DOCKER_IMG		:= node:14
DOCKER_RUN 		:= docker run -it --rm -w /ws $(DOCKER_VOLUME) --network host $(DOCKER_IMG)
DOCKER_BUILD	:= docker build -f ./Dockerfile -t flowci/web:latest -t flowci/web:$(tag) .

.PHONY: build clean image

build:
	$(DOCKER_RUN) $(NPM_BUILD)

image: build
	$(DOCKER_BUILD)

clean:
	$(DOCKER_RUN) $(NPM_CLEAN)