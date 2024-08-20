VERSION=0.0.6

git-changelog --output CHANGELOG.md

docker build -t studihub/api:${VERSION} .

# sudo docker run -it --network host --restart always --env-file /home/ubuntu/studihub-api/.env studihub/api:0.0.1