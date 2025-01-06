build:
	@cd frontend; cp .env.production apps/client/
	@cd frontend; cp .env.production apps/admin/
	@cd frontend; cp .env.production apps/auth/
	@cd frontend; cp .env.production apps/showcase/
	@cd frontend; cp .env.production apps/storybook/
	@cd frontend; cp .env.production apps/documentation/
	@cd frontend; npm ci --no-audit --include=dev --include=peer; npm run build-all

clean_build:
	@rm -rf frontend/apps/client/build
	@rm -rf frontend/apps/admin/build
	@rm -rf frontend/apps/auth/build
	@rm -rf frontend/apps/showcase/build
	@rm -rf frontend/apps/storybook/build
	@rm -rf frontend/apps/documentation/build

backend-tests:
	@docker compose exec backend python manage.py test
