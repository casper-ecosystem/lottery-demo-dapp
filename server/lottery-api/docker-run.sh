docker stop lottery-api
docker rm lottery-api
docker run -d -p 3000:3000 --name lottery-api lottery-api:0.1.1
