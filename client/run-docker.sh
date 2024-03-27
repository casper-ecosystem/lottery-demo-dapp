docker stop lottery-demo
docker rm lottery-demo
docker run -d -p 3000:3000 --name lottery-demo lottery-demo-app:0.1.1
