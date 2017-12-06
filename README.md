## Use
react redux react-redux react-router(^3) reselect immutable-js

## Require
Node > 6

## License

flow-web is an open source project, sponsored by https://www.fir.im/ under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).


## Start With Docker
> - `FLOW_API_DOMAIN`: Flow Api 的地址
> - `80` 对外暴露的端口是80

```
	docker run \
		-p 3000:80 \
		-e FLOW_API_DOMAIN=http://localhost:8080/flow-api \
		flow.web.test
```