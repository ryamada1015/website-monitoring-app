run:
	node app.js

# Docker

docker-build:
	docker build --platform=linux/amd64 -t sensory-api-nodejs .
	docker images

# Change MySQL to MongoDB...
docker-run: docker-build
	docker run --network sensorybridge --platform=linux/amd64 -e "MYSQL_HOST=mysql" --name backend -td -p 8000:8000 sensory-api-nodejs

docker-push:
	docker login
	docker build -t insidious000/sensory-api-nodejs:latest .
	docker push insidious000/sensory-api-nodejs:latest
	docker build -t insidious000/sensory-api-nodejs:v1.0 .
	docker push insidious000/sensory-api-nodejs:v1.0

docker-clean:
	docker stop sensory-api-nodejs
	docker rm sensory-api-nodejs

# Compose

compose-up:
	docker-compose up --scale sensory-api=1 -d

# Network (Bridge)

network-create:
	docker network create --driver bridge sensorybridge

network-inspect:
	docker network inspect sensorybridge

network-ls:
	docker network sensorybridge

network-prune:
	docker network prune

# Load Balancer (HAProxy)

lb-stats:
	echo "user = admin | password = admin"
	open http://localhost:1936

lb-test:
	open http://localhost
