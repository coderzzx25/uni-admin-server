pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'umi-admin-server-image'
        DOCKER_CONTAINER = 'umi-admin-server-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'git@github.com:coderzzx25/uni-admin-server.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t $DOCKER_IMAGE .
                    """
                }
            }
        }

        stage('Deploy with Docker') {
            steps {
                script {
                    sh """
                        docker stop $DOCKER_CONTAINER || true
                        docker rm $DOCKER_CONTAINER || true
                        docker run -d --restart=always --name $DOCKER_CONTAINER -p $APP_PORT:$APP_PORT $DOCKER_IMAGE
                    """
                }
            }
        }
    }
}
