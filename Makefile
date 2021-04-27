POSTGRES_PORT_BIND=-p 5432:5432
POSTGRES_PASSWORD=-e POSTGRES_PASSWORD=teste123

help: ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -E 's/:.*##/:\t/g'

stack: ## Start the stack
	make postgres

postgres: ## Start postgres
	@docker run -d --rm --name image-recommendation-bot-postgres ${POSTGRES_PASSWORD} ${POSTGRES_PORT_BIND} -d postgres
	sleep 5
	@docker cp ${CURDIR}/resources/tables.sql image-recommendation-bot-postgres:/tables.sql 
	@docker exec -it image-recommendation-bot-postgres psql -U postgres -d postgres -a -f tables.sql

stop: ## Stop the stack
	@-docker stop image-recommendation-bot-postgres 
	@echo "Containers stopped!"
