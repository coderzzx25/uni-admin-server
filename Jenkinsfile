pipeline {
    agent any

    environment {
        IMAGE_NAME = 'umi-admin-server-image'
        CONTAINER_NAME = 'umi-admin-server-container'
        NETWORK_NAME = 'coderzzx_network'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/coderzzx25/uni-admin-server.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                withEnv([
                    "IMAGE_NAME=$IMAGE_NAME",
                    "CONTAINER_NAME=$CONTAINER_NAME"
                ]) {
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
